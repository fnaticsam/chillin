const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
let browser;
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
before(async () => { browser = await puppeteer.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']}); });
after(async () => { await browser?.close(); });
async function pageFor(handler) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', async request => {
    const url = new URL(request.url());
    if (url.pathname === '/api/waitlist') return handler(request);
    if (url.origin !== new URL(base).origin && url.protocol !== 'data:') return request.abort();
    return request.continue();
  });
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  return page;
}
const respond=(req,data,status=200)=>req.respond({status,contentType:'application/json',body:JSON.stringify(data)});

test('hero retains invite attribution and redirects after successful subscription',async()=>{
  const bodies=[];const page=await pageFor(req=>{if(req.method()==='POST') bodies.push(JSON.parse(req.postData()));return respond(req,{refCode:'BCDEFGHJ',position:2,total:2},201);});
  await page.goto(`${base}/?ref=ABCDEFGH`);await page.waitForSelector('#hero-email');
  await page.type('#hero-email','hero@example.com');await page.click('#hero form button[type=submit]');
  await page.waitForFunction(()=>location.pathname==='/waitlist');
  assert.deepEqual(bodies[0],{email:'hero@example.com',ref:'ABCDEFGH'});assert.match(page.url(),/ref=BCDEFGHJ/);await page.close();
});
test('modal contains keyboard focus, exposes errors and restores the trigger on Escape',async()=>{
  const bodies=[];const page=await pageFor(req=>{bodies.push(JSON.parse(req.postData()));return respond(req,{error:'Please try again shortly.'},429);});
  await page.goto(`${base}/?ref=ABCDEFGH`);await page.waitForSelector('nav button');
  await page.click('nav button');await page.waitForSelector('dialog[open]');
  assert.equal(await page.$eval('dialog',d=>d.getAttribute('aria-labelledby')),'waitlist-dialog-title');
  for(let i=0;i<7;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog')),true);}
  await page.type('#modal-email','modal@example.com');await page.click('dialog button[type=submit]');
  await page.waitForSelector('#modal-email-error');assert.deepEqual(bodies[0],{email:'modal@example.com',ref:'ABCDEFGH'});
  assert.equal(await page.$eval('#modal-email-error',e=>e.getAttribute('role')),'alert');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('nav button')),true);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');await page.close();
});
test('signup controls fit a 320px viewport and have accessible labels',async()=>{
  const page=await pageFor(req=>respond(req,{}));await page.setViewport({width:320,height:740});await page.goto(base);await page.waitForSelector('#hero-email');
  for (const selector of ['#hero-email','#hero form button']) {
    const rect=await page.$eval(selector,el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right};});
    assert.ok(rect.left>=0 && rect.right<=320,`${selector} ${JSON.stringify(rect)}`);
  }
  assert.equal(await page.$eval('#hero-email',el=>el.labels[0].textContent),'Email address');await page.close();
});
test('failed clipboard write has honest feedback and no unimplemented reward controls',async()=>{
  const page=await pageFor(req=>respond(req,{refCode:'ABCDEFGH',position:12,total:12,referralCount:1}));
  await page.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))}}));
  await page.goto(`${base}/waitlist?ref=ABCDEFGH`);await page.waitForSelector('input[aria-label="Your invite link"]');
  await page.click('button');await page.waitForFunction(()=>document.body.textContent.includes('Could not copy.'));
  const text=await page.evaluate(()=>document.body.textContent);assert.ok(!text.includes('Copied!'));assert.ok(!text.includes('+30 spots'));assert.ok(!text.includes('Show details'));assert.ok(!text.includes('verified signup'));await page.close();
});
test('changing referral query discards the previous request and displays the new position',async()=>{
  let oldRequest;const page=await pageFor(req=>{
    if(new URL(req.url()).searchParams.get('ref')==='ABCDEFGH') { oldRequest=req;return; }
    return respond(req,{refCode:'BCDEFGHJ',position:22,total:30,referralCount:0});
  });
  await page.goto(`${base}/waitlist?ref=ABCDEFGH`);
  await page.waitForFunction(()=>document.querySelector('[aria-label="Loading your waitlist position"]'));
  await page.evaluate(()=>history.pushState({},'', '/waitlist?ref=BCDEFGHJ'));
  await page.waitForSelector('input[aria-label="Your invite link"]');
  if(oldRequest) await respond(oldRequest,{refCode:'ABCDEFGH',position:11,total:30,referralCount:0}).catch(()=>{});
  assert.ok((await page.evaluate(()=>document.body.textContent)).includes('#22'));
  assert.equal(await page.$eval('input[aria-label="Your invite link"]',el=>el.value),`${base}?ref=BCDEFGHJ`);await page.close();
});
