# Finding disposition — Chillin

Audited main: `0de5a2014d01aad6b1ae815747418c3708daa1ce` ([immutable snapshot](2026-10-22-snapshot.md)). Source evidence, baseline reproductions, confidence and limitations remain in that snapshot; remediation does not rewrite it.

| Findings | Disposition | Review artifact |
| --- | --- | --- |
| C01 email key collisions | Implemented with SHA-256 keys and exact-email verification of legacy records. Historical data reconciliation remains separate. | [PR #1](https://github.com/fnaticsam/chillin/pull/1) |
| C02 concurrent counters / code collisions | Implemented with authoritative reads, create-only position/email/referral keys and bounded atomic batch retries. Provider integration and old-writer shutdown remain rollout gates. | [PR #1](https://github.com/fnaticsam/chillin/pull/1) |
| C03 abuse / invalid referrals | Request bounds, input/referral validation, bounded in-instance bursts and a global 1,000-successful-signups/day quota implemented. Full distributed client protection, verified incentives and capacity review remain open. | [PR #1](https://github.com/fnaticsam/chillin/pull/1) |
| C04 email handling / logs | Implemented typed/length-limited input validation, generic errors and removal of raw email/upstream response logging. Historical log retention and membership-disclosure policy remain open. | [PR #1](https://github.com/fnaticsam/chillin/pull/1) |
| C05 referral attribution / unsupported features | All forms share referral-aware submission. Removed nonfunctional reward controls and unsupported verification/rank claims. | [PR #2](https://github.com/fnaticsam/chillin/pull/2) |
| C06 signup accessibility | Dialog semantics, keyboard containment/Escape/focus restoration, labels/live errors, focus styles and narrow layouts implemented. Full contrast/assistive-technology audit remains outside this validation. | [PR #2](https://github.com/fnaticsam/chillin/pull/2) |
| C07 asynchronous UI correctness | Cancels stale lookups, resets per-code state, awaits clipboard success and cleans up timers. | [PR #2](https://github.com/fnaticsam/chillin/pull/2) |
| C08 animation/scroll overhead | Pauses particles offscreen/hidden, handles zero distance, cancels count-up work, stabilizes component/listener lifecycles and honors reduced motion. No field-performance claims. | [PR #2](https://github.com/fnaticsam/chillin/pull/2) |
| C09 vulnerable dependency versions | Runtime advisories remediated (runtime audit: 0); overall advisory entries reduced 27 → 5. One development-only braces chain has no patched current release and remains blocking. | [PR #3](https://github.com/fnaticsam/chillin/pull/3) |
| C10 nonfunctional lint / missing checks | Noninteractive ESLint with actual findings fixed; Node 24 read-only CI runs build, tests and full dependency audit. No check was weakened. | [PR #3](https://github.com/fnaticsam/chillin/pull/3) |

All PRs are drafts. Dependency stack: **main ← #2 (UI) ← #3 (checks/dependencies) ← #1 (API and audit)**. This allows the combined API/UI changes to inherit CI without duplicated workflow patches. No PR was merged and no production deployment was requested. Git auto-deployments are disabled for `codex/chillin-*`; read-only Vercel branch queries reported no deployments during the audit.

## Validation

- Baseline route reproduction uses only local in-memory storage/fetch mocks; results are preserved in the snapshot and `reproduce-baseline.cjs`.
- Final local suite: 12 API regressions, 1 particle lifecycle regression and 1 production-page render smoke test. All passed. The API mocks exercise four concurrent signups, duplicate requests, forced code collision, legacy email collision, uncertain commit outcomes and simultaneous quota exhaustion.
- Five Chromium browser regressions passed: referral forwarding, dialog focus/error/Escape behavior, 320px layout, clipboard failure and query-change cancellation. All waitlist requests and clipboard writes are mocked. No real signup was sent.
- Clean install, lint, TypeScript and diff checks passed. A local build uses test-only font response mocks because actual font downloads fail in this workspace. **Hosted CI did complete the unmocked production build successfully** in [run 39790776934](https://github.com/fnaticsam/chillin/actions/runs/39790776934).
- That initial hosted run passed lint/types/build/unit tests, failed browser setup on a root-only package-install flag, and failed dependency audit on the known braces chain. The setup repair removes system-package installation, uses existing runner libraries, and retains all tests. A second setup fix awaits Puppeteer 25's asynchronous executable-path lookup. In [run 39791785393](https://github.com/fnaticsam/chillin/actions/runs/39791785393), the complete quality job (real build, lint, types, unit/render and all browser tests) passed. The full dependency audit remains blocking on the braces chain; it was not suppressed. The API branch inherits these repairs; its latest exact-commit results are in the PR checks.

## Remaining gates and access boundary

Before any separately authorized rollout: validate the batch guard against a non-production provider fixture; stop old writers (they do not honor the guard); review quota/capacity; reconcile any preexisting corrupt records offline; decide membership-disclosure/retention policies and distributed bot protection. A configuration store remains unsuitable for sustained write-heavy growth; a transactional backend is a recommendation requiring a separate infrastructure plan. Subscription must remain distinct from account authentication.

Denied action: `gh api repos/fnaticsam/chillin/actions/workflows`, targeting workflow-definition metadata, returned **Forbidden**. Execution was denied, not pending or uncertain. It was not retried or retrieved by another route. Source review, fixes, PR creation and distinct commit-scoped CI/job checks proceeded through authorized access. Hosted browser system-package installation failed for missing root privileges; no privilege escalation was attempted, and that operation was removed in favor of existing libraries.

No mounted Fleet/Sam ID files, credentials, live databases or production endpoints were changed. No specialist output was requested or recovered, and no external agents were contacted.
