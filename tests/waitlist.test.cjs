const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

const source = fs.readFileSync('app/api/waitlist/route.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function harness(initial = {}, options = {}) {
  let uncertain = options.uncertainPatch;
  const values = new Map(Object.entries(initial)); const logs = []; const batches = []; const calls = []; const exports = {};
  const sdk = { get: async key => values.get(key), getAll: async keys => Object.fromEntries(keys.map(key => [key, values.get(key)])) };
  vm.runInNewContext(code, {
    exports, Buffer, URL, AbortSignal, Uint8Array, Date,
    process: { env: { EDGE_CONFIG_ID: 'test-store', VERCEL_API_TOKEN: 'test-only' } },
    console: { log: (...v) => logs.push(v), error: (...v) => logs.push(v) },
    require: name => name === 'next/server' ? { NextResponse: Response } : name === '@vercel/edge-config' ? { createClient: () => sdk } : options.crypto ?? crypto,
    fetch: async (url, init) => {
      calls.push({url:String(url),init});
      if (options.fail) return new Response('private@example.com secret token', {status:500});
      const path = url.pathname.split('/');
      if (init.method !== 'PATCH') {
        const key = decodeURIComponent(path.at(-1));
        return values.has(key) ? Response.json({ value: values.get(key) }) : new Response('',{status:404});
      }
      const { items } = JSON.parse(init.body); batches.push(items);
      // Model the documented all-or-nothing batch and create uniqueness semantics.
      if (items.some(item => item.operation === 'create' && values.has(item.key))) return new Response('',{status:409});
      for (const item of items) values.set(item.key,item.value);
      if (uncertain) { uncertain=false; return new Response('private@example.com', {status:500}); }
      return Response.json({status:'ok'});
    },
  });
  function request(body, extra={}) {
    const req=new Request('https://local.test/api/waitlist',{method:'POST',headers:{'content-type':'application/json',...extra.headers},body:typeof body==='string'?body:JSON.stringify(body)});
    req.nextUrl=new URL(req.url); return req;
  }
  return { values,logs,batches,calls,post:(body,extra)=>exports.POST(request(body,extra)),get:ref=>{const req={nextUrl:new URL('https://local.test/api/waitlist'+(ref===undefined?'':`?ref=${encodeURIComponent(ref)}`))};return exports.GET(req);} };
}

test('rejects malformed JSON/types/addresses/referrals without storage access', async()=>{
  for (const body of ['{',null,[],{email:123},{email:'@.'},{email:'a..b@example.com'},{email:'a@b..com'},{email:'a@example.com\nInjected'},{email:'a@example.com',ref:{}},{email:'a@example.com',ref:'unknown'}]) {
    const h=harness();assert.equal((await h.post(body)).status,400);assert.equal(h.calls.length,0);
  }
});
test('bounds streamed and declared bodies and rejects unsupported content types/origins',async()=>{
  const h=harness();assert.equal((await h.post(' '.repeat(2049))).status,413);
  assert.equal((await h.post({email:'a@example.com'},{headers:{'content-length':'2049'}})).status,413);
  assert.equal((await h.post({email:'a@example.com'},{headers:{'content-type':'text/plain'}})).status,415);
  assert.equal((await h.post({email:'a@example.com'},{headers:{origin:'https://other.test'}})).status,403);
  assert.equal(h.calls.length,0);
});
test('different punctuation creates distinct keys and normalized duplicates are idempotent',async()=>{
  const h=harness();const a=await h.post({email:'a.b@example.com'});const b=await h.post({email:'a+b@example.com'});
  assert.equal(a.status,201);assert.equal(b.status,201);assert.equal(h.values.get('counter'),2);
  const duplicate=await (await h.post({email:' A.B@EXAMPLE.COM '})).json();assert.equal(duplicate.alreadyExists,true);assert.equal(duplicate.position,1);
  assert.equal(h.batches.length,2);assert.equal(h.logs.length,0);
});
test('legacy key collisions never disclose or claim the other address record',async()=>{
  const legacy={email:'a.b@example.com',refCode:'ABCDEFGH',position:7};const h=harness({counter:7,email_a_b_example_com:'ABCDEFGH',ref_ABCDEFGH:legacy});
  const old=await (await h.post({email:legacy.email})).json();assert.equal(old.refCode,'ABCDEFGH');assert.equal(h.batches.length,0);
  const collision=await h.post({email:'a+b@example.com'});assert.equal(collision.status,201);assert.equal((await collision.json()).position,8);
  assert.deepEqual(h.values.get('ref_ABCDEFGH'),legacy);
});
test('concurrent new signups and referrals have unique positions and no lost increments',async()=>{
  const h=harness({counter:1,ref_ABCDEFGH:{email:'friend@example.com',refCode:'ABCDEFGH',position:1}});
  const results=await Promise.all([1,2,3,4].map(i=>h.post({email:`user${i}@example.com`,ref:'ABCDEFGH'})));
  assert.deepEqual(results.map(r=>r.status),[201,201,201,201]);
  const positions=await Promise.all(results.map(async r=>(await r.json()).position));assert.equal(new Set(positions).size,4);
  assert.equal(h.values.get('counter'),5);assert.equal(h.values.get('referrals_ABCDEFGH'),4);
});
test('concurrent duplicate signup commits once',async()=>{
  const h=harness();const result=await Promise.all([h.post({email:'a@example.com'}),h.post({email:'a@example.com'})]);
  assert.deepEqual(result.map(r=>r.status).sort(),[200,201]);assert.equal(h.values.get('counter'),1);
});
test('random-code collision retries without overwriting prior entry',async()=>{
  let n=0;const code='a'.repeat(32);const old={email:'old@example.com',refCode:code,position:1};
  const h=harness({counter:1,[`ref_${code}`]:old},{crypto:{...crypto,randomBytes:()=>Buffer.from((n++?'b':'a').repeat(32),'hex')}});
  assert.equal((await h.post({email:'new@example.com'})).status,201);assert.deepEqual(h.values.get(`ref_${code}`),old);assert.equal(h.values.get('counter'),2);
});
test('unknown referral and corrupt counters cannot mutate storage',async()=>{
  const h=harness();assert.equal((await h.post({email:'a@example.com',ref:'ABCDEFGH'})).status,400);assert.equal(h.batches.length,0);
  const corrupt=harness({counter:'2'});assert.equal((await corrupt.post({email:'a@example.com'})).status,503);assert.equal(corrupt.batches.length,0);
});
test('global budget and instance bursts return 429 with retry guidance',async()=>{
  const h=harness({waitlist_write_budget:{day:new Date().toISOString().slice(0,10),count:1000}});
  const limited=await h.post({email:'a@example.com'});assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'60');assert.equal(h.batches.length,0);
  const burst=harness();for(let i=0;i<30;i++) await burst.post(null);assert.equal((await burst.post(null)).status,429);
});
test('errors and public reads never include raw emails or upstream details',async()=>{
  const h=harness({counter:1,ref_ABCDEFGH:{email:'private@example.com',refCode:'ABCDEFGH',position:1}});
  const response=await h.get('ABCDEFGH');assert.equal(response.headers.get('cache-control'),'no-store');assert.equal(JSON.stringify(await response.json()).includes('@'),false);
  assert.equal((await h.get('bad')).status,400);assert.equal((await h.get('BCDEFGHJ')).status,404);
  const fail=harness({}, {fail:true});const failed=await fail.post({email:'private@example.com'});assert.equal(failed.status,503);
  assert.equal(JSON.stringify([await failed.json(),fail.logs]).includes('private@example.com'),false);
});

test('an uncertain upstream write is not retried internally and a client retry is idempotent',async()=>{
  const h=harness({}, {uncertainPatch:true});
  assert.equal((await h.post({email:'a@example.com'})).status,503);assert.equal(h.batches.length,1);
  const retry=await h.post({email:'a@example.com'});assert.equal(retry.status,200);assert.equal((await retry.json()).alreadyExists,true);
  assert.equal(h.values.get('counter'),1);assert.equal(h.batches.length,1);assert.ok(!JSON.stringify(h.logs).includes('@'));
});
test('simultaneous signups cannot exceed the global successful-write budget',async()=>{
  const h=harness({waitlist_write_budget:{day:new Date().toISOString().slice(0,10),count:999}});
  const responses=await Promise.all([h.post({email:'a@example.com'}),h.post({email:'b@example.com'})]);
  assert.deepEqual(responses.map(r=>r.status).sort(),[201,429]);assert.equal(h.values.get('counter'),1);assert.equal(h.values.get('waitlist_write_budget').count,1000);
});
