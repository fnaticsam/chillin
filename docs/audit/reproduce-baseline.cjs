const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = require('node:child_process').execFileSync('git', ['show', '0de5a201:app/api/waitlist/route.ts'], {encoding:'utf8'});
function harness() {
 const values = new Map(); const logs=[]; const writes=[]; const exports={};
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{exports, process:{env:{}}, console:{log:(...v)=>logs.push(v),error:()=>{}},require:(name)=>name==='next/server'?{NextResponse:Response}: {createClient:()=>({get:async key=>values.get(key)})},fetch:async (_,opts)=>{const {items}=JSON.parse(opts.body);writes.push(items);for(const i of items)values.set(i.key,i.value);return new Response('{}');}});
 const post=body=>exports.POST(new Request('https://local.test/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
 return {values,logs,writes,post};
}
(async()=>{
 let h=harness();const first=await (await h.post({email:'a.b@example.com'})).json(); const collision=await (await h.post({email:'a+b@example.com'})).json(); console.log('email collision:',collision.alreadyExists,first.refCode===collision.refCode);
 h=harness(); const results=await Promise.all(['one@example.com','two@example.com'].map(async email=>(await h.post({email})).json()));console.log('concurrent positions:',results.map(r=>r.position),'stored counter:',h.values.get('counter'));
 h=harness();console.log('null body status:',(await h.post(null)).status);console.log('numeric email status:',(await h.post({email:123})).status);
 h=harness();console.log('malformed email status:',(await h.post({email:'@.',ref:'not-a-real-ref'})).status,'arbitrary ref counter:',h.values.get('referrals_not-a-real-ref'));console.log('raw email logged:',JSON.stringify(h.logs).includes('@.'));
})();
