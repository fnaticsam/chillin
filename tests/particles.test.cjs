const { test }=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const ts=require('typescript');
test('particle animation pauses offscreen, hidden and reduced-motion; overlap stays finite',()=>{
  const effects=[];const frames=new Map();let frame=0;let observer;let disconnected=false;
  const media={};const listeners={};const parentListeners={};const arcs=[];
  const parent={getBoundingClientRect:()=>({width:100,height:100,left:0,top:0}),addEventListener:(type,fn)=>parentListeners[type]=fn,removeEventListener:type=>delete parentListeners[type]};
  const canvas={parentElement:parent,getContext:()=>({clearRect(){},beginPath(){},fill(){},arc:(...v)=>arcs.push(v)})};
  const doc={hidden:false,addEventListener:(type,fn)=>listeners[type]=fn,removeEventListener:type=>delete listeners[type]};
  let ref=0;
  const exports={};
  const code=ts.transpileModule(fs.readFileSync('components/ui/ParticleCanvas.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(code,{
    exports,Math:Object.assign(Object.create(Math),{random:()=>0.5}),
    require:name=>name==='react'?{useRef:initial=>({current:ref++===0?canvas:initial}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)}:{jsx:()=>null},
    window:{matchMedia:query=>media[query]={matches:query.includes('min-width'),addEventListener:(type,fn)=>media[query].change=fn,removeEventListener:()=>{}},addEventListener:(type,fn)=>listeners[type]=fn,removeEventListener:type=>delete listeners[type]},
    document:doc,
    IntersectionObserver:class {constructor(fn){observer=fn;}observe(){}disconnect(){disconnected=true;}},
    requestAnimationFrame:fn=>{frames.set(++frame,fn);return frame;},cancelAnimationFrame:id=>frames.delete(id),
  });
  exports.default({particleCount:1});const cleanup=effects[0]();assert.equal(frames.size,0);
  parentListeners.mousemove({clientX:50,clientY:50});observer([{isIntersecting:true}]);assert.equal(frames.size,1);assert.ok(arcs.flat().every(Number.isFinite));
  observer([{isIntersecting:false}]);assert.equal(frames.size,0);
  observer([{isIntersecting:true}]);assert.equal(frames.size,1);
  doc.hidden=true;listeners.visibilitychange();assert.equal(frames.size,0);
  doc.hidden=false;listeners.visibilitychange();assert.equal(frames.size,1);
  const reduced=media['(prefers-reduced-motion: reduce)'];reduced.matches=true;reduced.change();assert.equal(frames.size,0);
  reduced.matches=false;reduced.change();assert.equal(frames.size,1);
  const desktop=media['(min-width: 900px)'];desktop.matches=false;desktop.change();assert.equal(frames.size,0);
  cleanup();assert.equal(disconnected,true);assert.equal(Object.keys(listeners).length,0);assert.equal(Object.keys(parentListeners).length,0);
});
