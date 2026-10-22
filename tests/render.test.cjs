const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

test('the production build serves both public pages without waitlist credentials', async () => {
  const port = 3107;
  const env = { ...process.env };
  for (const name of ['EDGE_CONFIG','EDGE_CONFIG_ID','VERCEL_API_TOKEN','VERCEL_TEAM_ID']) delete env[name];
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)], {env,stdio:'ignore'});
  try {
    let response;
    for(let attempt=0;attempt<100;attempt++) {
      if(server.exitCode !== null) throw new Error(`Next exited with ${server.exitCode}`);
      try {response=await fetch(`http://127.0.0.1:${port}/`);break;} catch {await delay(100);}
    }
    assert.ok(response,'Local server did not start');assert.equal(response.status,200);
    assert.match(await response.text(),/Someone else can sit/);
    const waitlist=await fetch(`http://127.0.0.1:${port}/waitlist`);assert.equal(waitlist.status,200);
  } finally { server.kill('SIGTERM'); }
});
