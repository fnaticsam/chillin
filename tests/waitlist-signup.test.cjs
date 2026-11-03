const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const code = ts.transpileModule(fs.readFileSync('components/ui/useWaitlistSignup.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function signup(t, fetchResponse) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const pushes = [], successes = [], effects = [], states = [];
  let signal;
  const exports = {};
  vm.runInNewContext(code, {
    exports, AbortController, URLSearchParams, setTimeout, clearTimeout,
    window: { location: { search: '' } },
    fetch: async (_url, options) => {
      signal = options.signal;
      return fetchResponse ? fetchResponse() : { ok: true, json: async () => ({ refCode: 'BCDEFGHJ' }) };
    },
    require: name => {
      if (name === 'next/navigation') return { useRouter: () => ({ push: url => pushes.push(url) }) };
      if (name === 'react') return {
        useRef: value => ({ current: value }),
        useCallback: fn => fn,
        useEffect: fn => effects.push(fn),
        useState: value => {
          const index = states.push(value) - 1;
          return [value, next => { states[index] = next; }];
        },
      };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  const hook = exports.useWaitlistSignup(() => successes.push('success'));
  const cleanups = effects.map(effect => effect());
  t.after(() => cleanups.forEach(cleanup => cleanup?.()));
  return { ...hook, pushes, successes, states, get signal() { return signal; } };
}

test('dismissal at 600ms cancels the redirect and success callback before unmount', async t => {
  const hook = signup(t);
  await hook.handleSubmit({ preventDefault() {} });
  assert.equal(hook.states[1], 'success');
  t.mock.timers.tick(600);
  hook.cancelPending();
  // Still mounted throughout the 400ms exit, including the old 800ms deadline.
  t.mock.timers.tick(400);
  assert.deepEqual(hook.pushes, []);
  assert.deepEqual(hook.successes, []);
});

test('an undismissed signup calls success and redirects at 800ms', async t => {
  const hook = signup(t);
  await hook.handleSubmit({ preventDefault() {} });
  t.mock.timers.tick(799);
  assert.deepEqual(hook.pushes, []);
  assert.deepEqual(hook.successes, []);
  t.mock.timers.tick(1);
  assert.deepEqual(hook.pushes, ['/waitlist?ref=BCDEFGHJ']);
  assert.deepEqual(hook.successes, ['success']);
});

test('dismissal aborts an in-flight signup and ignores a late success response', async t => {
  let resolveResponse;
  const response = new Promise(resolve => { resolveResponse = resolve; });
  const hook = signup(t, () => response);
  const pending = hook.handleSubmit({ preventDefault() {} });
  hook.cancelPending();
  assert.equal(hook.signal.aborted, true);
  resolveResponse({ ok: true, json: async () => ({ refCode: 'BCDEFGHJ' }) });
  await pending;
  t.mock.timers.tick(1000);
  assert.notEqual(hook.states[1], 'success');
  assert.deepEqual(hook.pushes, []);
  assert.deepEqual(hook.successes, []);
});
