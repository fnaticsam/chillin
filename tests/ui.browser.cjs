const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
let browser;
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
before(async () => { browser = await puppeteer.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']}); });
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

test('reduced-motion counters hydrate without recoverable errors and show their final values',async()=>{
  const page=await pageFor(req=>respond(req,{}));
  // Next forwards React onRecoverableError to reportError (or console.error).
  await page.evaluateOnNewDocument(()=>{
    window.recoverableErrors=[];
    window.reportError=error=>window.recoverableErrors.push(String(error));
  });
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error' && /hydration|hydrating|Minified React error/i.test(message.text())) errors.push(message.text());});
  await page.goto(base);
  await page.waitForFunction(()=>['47 min','89%','4.9★'].every(value=>
    [...document.querySelectorAll('#hero span')].some(el=>el.textContent===value)));
  assert.deepEqual(await page.evaluate(()=>window.recoverableErrors),[]);
  assert.deepEqual(errors,[]);
  await page.close();
});

test('hero retains invite attribution and redirects after successful subscription',async()=>{
  const bodies=[];const page=await pageFor(req=>{if(req.method()==='POST') bodies.push(JSON.parse(req.postData()));return respond(req,{refCode:'BCDEFGHJ',position:2,total:2},201);});
  await page.goto(`${base}/?ref=ABCDEFGH`);await page.waitForSelector('#hero-email');
  await page.type('#hero-email','hero@example.com');await page.click('#hero form button[type=submit]');
  await page.waitForFunction(()=>location.pathname==='/waitlist');
  assert.deepEqual(bodies[0],{email:'hero@example.com',ref:'ABCDEFGH'});assert.match(page.url(),/ref=BCDEFGHJ/);await page.close();
});
test('footer signup retains invite attribution and redirects after success',async()=>{
  const bodies=[];const page=await pageFor(req=>{if(req.method()==='POST') bodies.push(JSON.parse(req.postData()));return respond(req,{refCode:'BCDEFGHJ',position:2,total:2},201);});
  await page.goto(`${base}/?ref=ABCDEFGH`);await page.waitForSelector('#waitlist-email');
  await page.$eval('#waitlist-email',el=>el.scrollIntoView());
  await page.type('#waitlist-email','footer@example.com');await page.click('#waitlist form button[type=submit]');
  await page.waitForFunction(()=>location.pathname==='/waitlist');
  assert.deepEqual(bodies[0],{email:'footer@example.com',ref:'ABCDEFGH'});assert.match(page.url(),/ref=BCDEFGHJ/);await page.close();
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
  assert.equal(await page.$eval('#modal-email-error',e=>getComputedStyle(e).color),'rgb(173, 73, 51)');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('nav button')),true);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');await page.close();
});

test('modal keeps its card styling, icons and loading/success feedback on phone and desktop',async()=>{
  for(const width of [390,1280]) {
    let releaseSignup;
    const requestReceived=new Promise(resolve=>{releaseSignup=resolve;});
    const page=await pageFor(req=>{releaseSignup(req);});
    await page.setViewport({width,height:850});
    await page.goto(base);await page.waitForSelector('nav button');
    await page.click('nav button');await page.waitForSelector('dialog[open]');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('dialog')).opacity==='1');
    const card=await page.$eval('dialog',el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      const label=el.querySelector('label');
      const close=el.querySelector('button[aria-label="Close waitlist dialog"]');
      return {shadow:s.boxShadow,border:s.borderLeftWidth,borderColor:s.borderLeftColor,
        radius:s.borderTopLeftRadius,labelWidth:label.getBoundingClientRect().width,
        closeWidth:close.getBoundingClientRect().width,closeIcon:!!close.querySelector('svg'),
        arrow:!!el.querySelector('button[type=submit] svg'),placeholder:el.querySelector('input').placeholder,
        left:r.left,right:r.right};
    });
    assert.ok(card.shadow.endsWith('rgba(0, 0, 0, 0.2) 0px 24px 80px 0px'));
    assert.equal(card.border,'3px');assert.equal(card.borderColor,'rgb(74, 107, 90)');
    assert.equal(card.radius,'24px');assert.equal(card.labelWidth,1);
    assert.equal(card.closeWidth,40);assert.equal(card.closeIcon,true);
    assert.equal(await page.$eval('dialog',el=>el.textContent.includes('☺')),true);
    assert.equal(card.arrow,true);assert.equal(card.placeholder,'your@email.com');
    assert.ok(card.left>=0 && card.right<=width);
    await page.type('#modal-email','modal@example.com');await page.click('dialog button[type=submit]');
    const signup=await requestReceived;
    await page.waitForSelector('dialog form[aria-busy="true"] button:disabled .animate-spin');
    // Hold the signup redirect clock while checking the transient success state.
    await page.evaluate(()=>{
      const schedule=window.setTimeout.bind(window),cancel=window.clearTimeout.bind(window);
      window.signupTimers=new Map();let timerId=-1;
      window.setTimeout=(callback,delay,...args)=>{
        if(delay!==800) return schedule(callback,delay,...args);
        const id=timerId--;window.signupTimers.set(id,()=>callback(...args));return id;
      };
      window.clearTimeout=id=>{if(!window.signupTimers.delete(id)) cancel(id);};
    });
    await respond(signup,{refCode:'BCDEFGHJ',position:2,total:2},201);
    await page.waitForSelector('dialog [role="status"] svg');
    assert.equal(await page.evaluate(()=>window.signupTimers.size),1);
    // Unmount during the success state so its redirect cannot outlive the dialog.
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
    assert.equal(await page.evaluate(()=>window.signupTimers.size),0);
    assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('nav button')),true);
    await page.click('nav button');await page.waitForSelector('dialog[open] #modal-email');
    assert.equal(await page.$eval('#modal-email',el=>el.value),'');
    await page.close();
  }
});

test('modal finishes its exit animation before releasing native focus containment',async()=>{
  const page=await pageFor(req=>respond(req,{}));
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.goto(base);await page.waitForSelector('nav button');
  await page.click('nav button');await page.waitForSelector('dialog[open]');
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('dialog')).opacity==='1');
  await page.click('dialog button[aria-label="Close waitlist dialog"]');
  await page.waitForFunction(()=>{
    const dialog=document.querySelector('dialog[open]');
    return dialog && Number(getComputedStyle(dialog).opacity)<1;
  });
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await page.waitForFunction(()=>!document.querySelector('dialog'));
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('nav button')),true);
  await page.close();
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
  assert.equal(await page.$('[role="alert"]'),null);
  assert.equal(await page.$eval('[role="status"]',el=>getComputedStyle(el).position),'absolute');
  await page.click('button');await page.waitForFunction(()=>document.body.textContent.includes('Could not copy.'));
  assert.equal(await page.$eval('[role="alert"]',el=>getComputedStyle(el).color),'rgb(212, 101, 74)');
  const text=await page.evaluate(()=>document.body.textContent);assert.ok(!text.includes('Copied!'));assert.ok(!text.includes('+30 spots'));assert.ok(!text.includes('Show details'));assert.ok(!text.includes('verified signup'));await page.close();
});

test('invite section has one heading, accessible copy feedback and a visible keyboard focus ring',async()=>{
  for(const width of [390,1280]) {
    const page=await pageFor(req=>respond(req,{refCode:'ABCDEFGH',position:12,total:12,referralCount:0}));
    await page.setViewport({width,height:850});
    await page.evaluateOnNewDocument(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copiedLink=text;}}}));
    await page.goto(`${base}/waitlist?ref=ABCDEFGH`);await page.waitForSelector('input[aria-label="Your invite link"]');
    assert.deepEqual(await page.$$eval('h2,h3',els=>els.map(el=>el.textContent.trim())),['Share the waitlist']);
    const text=await page.evaluate(()=>document.body.textContent);
    assert.ok(text.includes('Your signup position stays the same.'));
    for(const removed of ['Invite your friends','Share your link to track','Invites are counted']) assert.ok(!text.includes(removed));
    const footer=await page.evaluate(()=>[...document.querySelectorAll('p')].find(el=>el.textContent.includes('We mean it.')).className);
    assert.ok(footer.includes('text-paper/50'));
    await page.focus('input[aria-label="Your invite link"]');await page.keyboard.press('Tab');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('button')).outlineWidth==='2px');
    const focus=await page.$eval('button',el=>({focused:el===document.activeElement,width:getComputedStyle(el).outlineWidth,color:getComputedStyle(el).outlineColor}));
    assert.equal(focus.focused,true);assert.equal(focus.width,'2px');assert.equal(focus.color,'rgb(250, 250, 247)');
    await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[role="status"]').textContent==='Invite link copied.');
    assert.equal(await page.evaluate(()=>window.copiedLink),`${base}?ref=ABCDEFGH`);
    assert.equal(await page.$eval('[role="status"]',el=>getComputedStyle(el).position),'absolute');
    assert.equal(await page.$('[role="alert"]'),null);
    await page.close();
  }
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
