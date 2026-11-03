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

## Follow-up review — 2026-11-03

The sections above preserve the October 22 validation record. This follow-up supersedes their description of the braces advisory as currently active: GitHub [withdrew GHSA-vfj7-8cjw-p6xm on October 23](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). No dependency-audit exception or suppression has been introduced. A fresh registry audit and hosted run are still required; withdrawal alone is not evidence that the entire current dependency graph passes.

Read-only GitHub checks for published PR head `698a8a53b7065b86a8ef7c96fb1fc3eb62ec72a1` confirm [run 39792272093](https://github.com/fnaticsam/chillin/actions/runs/39792272093): quality succeeded, dependency-audit failed. There is no new published head or new run from this follow-up.

Local changes keep push checks running to completion, cancel superseded runs only for pull requests, and add full checks on main pushes. API tests now use a controlled clock, including minute-boundary burst recovery and UTC-midnight quota reset; they cannot accidentally cross a real minute or date boundary during execution.

On ai-mac with Node 24.20.0, all 14 API tests and the particle lifecycle test passed, as did `git diff --check`. The exact locked TypeScript tarball was recovered from the host's npm cache to run these isolated tests. A complete `npm ci --ignore-scripts` could not finish: registry DNS is unavailable and 26 non-optional locked packages are absent from the local cache. Lint, typecheck and build scripts consequently cannot start their tools; the fresh dependency audit also fails to reach the registry. Production render and browser tests remain unverified locally. No headless browser suite was run on ai-mac.

The mirrored worktree is detached at transport snapshot `e8d4ce92d7980690be37ce86519004ad87122efc`, whose tree matches the published PR head. Mirrored main has one newer commit, `8052b9309e1372ab738d28dee6d8b8c8fa8a97a6`; a read-only merge preview finds package manifest/lockfile conflicts. No merge, commit, push, PR metadata update or deployment was performed, as required by this follow-up's final instruction. Any eventual merge must preserve main's newer dependency/security behavior and regenerate and verify the lockfile with registry access.

A read-only independent API review found no further concrete code defect, conditional on the provider's batch guarantees. The [provider batch reference](https://vercel.com/docs/rest-api/global-config/update-global-config-items-in-batch) lists batch operations but does not establish the atomicity and concurrent-create guarantees modeled by these unit tests. The rollout gate remains open; mocks are not provider integration evidence.

Before rollout, use a separately authorized, empty non-production provider fixture and synthetic addresses to establish all of the following:

- A batch containing a conflicting create leaves every item unchanged, including counter, budget and referral increments. Test conflicts in each create position, not only the first item.
- Concurrent batches creating the same position marker permit exactly one whole batch to commit; losing batches leave no partial email or referral records.
- Parallel signups, duplicate retries and quota exhaustion against the provider satisfy the same invariants as the local tests. Keep the fixture isolated from production and retain the results before changing rollout status.
- Record the actual create-conflict HTTP status and error envelope. The route retries only explicit HTTP 409 conflicts; HTTP 400 responses fail immediately, including any as-yet-unverified provider conflict variant. Do not broaden retries to all HTTP 400 responses.

The fixture requires approved non-production access; none was requested or used here. Old-writer shutdown, acceptance of the 1,000/day ceiling and ASCII email policy, historical reconciliation, and membership-disclosure/retention/bot-protection decisions remain the rollout prerequisites listed above. Follow-up owner: fnaticsam; recheck the outstanding access, integration and fresh-CI gates by 2026-11-10. This PR is not ready to ship on the evidence available in this run.

## Review fixes — ai-box, 2026-11-03

Permanent or unrecognized HTTP 400 write failures now stop after one batch and use the generic storage-failure response instead of exhausting contention retries and reporting a busy waitlist. Regression tests cover validation errors containing private details, malformed/non-object error bodies, no additional reads or writes after rejection, unchanged storage, sanitized logs and the four-attempt HTTP 409 limit. The new HTTP 400 regression failed against the previous route before the fix.

The provider integration gate remains **blocking and not fixed**: this task supplied no approved empty non-production fixture or credentials. No provider write or new external access was attempted. Local storage mocks deliberately model the required guarantees and cannot establish provider behavior. The separately authorized integration run above is still required before approval or rollout.

Local verification on ai-box (Node 24.20.0): clean dependency install, all 18 tests (16 API plus particle lifecycle and production-page smoke tests), repository lint, TypeScript, unmodified production build, test-file syntax and whitespace checks passed. No font mocks, added retries or extended timeouts were used. Edits remain uncommitted; nothing was pushed, merged or deployed.
