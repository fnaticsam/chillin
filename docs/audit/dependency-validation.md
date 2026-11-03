# Dependency and check validation — 2026-10-22

This is the check foundation above the UI repair branch. The immutable source audit is in PR #1; this change addresses C09 and C10.

- Next and its ESLint configuration are aligned at 15.5.28 (previous runtime lock: 15.5.12).
- Puppeteer is updated to 25.16.0. The Node 24 engine matches the read-only Vercel project metadata. Supported dependency updates refresh the lockfile; Next's pinned PostCSS is overridden to the directly declared PostCSS (resolved 8.5.31).
- The old lint script opened an interactive setup prompt. ESLint now has a checked-in flat configuration and zero-warning CLI command. Actual lint findings were fixed (internal links and the unused animation constant); no rules were disabled.
- The workflow has read-only contents permissions, no secrets, deployments, publishing or write actions. GitHub Actions versions are pinned to the SHAs returned by their public v6 tags on the audit date. It runs lint, types, build, unit/render tests, the checked-in browser suite, and an independent high-severity dependency audit.

## Historical results and gates — 2026-10-22

`npm ci --ignore-scripts`, lint, TypeScript and whitespace checks pass. A local build with **test-only Google Fonts response mocks** passes, followed by production-server page smoke tests and particle lifecycle tests. The original build with actual Google Fonts requests fails because this environment cannot fetch those resources; the font mock is outside the repository and is not enabled by hosted CI. This is not a successful unmodified production build.

`npm audit` improved from 27 affected dependency entries (2 critical, 21 high, 3 moderate, 1 low) to 5 high entries, all from a single development dependency chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. Runtime-only audit reports zero findings. `braces` 3.0.3 is the latest published release at the audit date and is affected by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Five entries are not five independent vulnerabilities. Exposure requires processing attacker-controlled deeply nested patterns; this repository's lint command uses fixed source directories. No exploit was run. The full dependency-audit job remains blocking; no audit suppression, rule disablement, forced downgrade, or `continue-on-error` was added to make it green.

Hosted CI results must be recorded separately after publication. The CLI workflow-definition listing was denied with `Forbidden` and was not retried. The authorized connector's commit-scoped run/status lookups are distinct checks and previously returned empty arrays for the first two PRs.

Hosted run [39790776934](https://github.com/fnaticsam/chillin/actions/runs/39790776934) confirmed the real (unmocked) build, lint, types and unit/render tests pass. Browser setup initially failed because `--install-deps` requires root. The repair removes system-package installation and uses the hosted image's existing Chrome libraries while still downloading the pinned browser and running every browser test. No privilege escalation or skipped tests were introduced. Dependency audit failed on the documented braces chain.

## Follow-up validation — 2026-11-03

The earlier results above describe the original audit date. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) was withdrawn on 23 October because it is not practically exploitable. The existing blocking `npm audit --audit-level=high` command now passes without suppressions or dependency downgrades. The latest local audit reports 16 moderate development-only dependency entries from [one minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249), with no high or critical findings. `npm audit --omit=dev` reports zero vulnerabilities. The moderate advisory remains visible; no incompatible minimatch override or forced ESLint downgrade was introduced.

The local follow-up preserves main's React minimum versions (`^19.1.10`) and Sharp override (`0.35.5`) alongside this PR's aligned Next/ESLint versions and PostCSS override. The resolved React/React DOM versions remain 19.2.4 and Sharp remains 0.35.5. CI now also runs on main pushes, cancels in-progress work only for pull request events, and always runs the checked-in browser suite. Its quality job previously completed in about 66 seconds, so no slow-CI restructuring was needed.

On ai-box with Node 24.20.0, the updated lockfile installs with `npm ci --ignore-scripts`. Lint, TypeScript, an **unmodified production build with actual Google Fonts requests**, both unit/render tests, and all five browser tests pass. Browser tests use the Puppeteer-pinned Chrome download and a local production server; API responses are intercepted by the existing suite, with no production requests or credentials. No font mocks, retries, longer test timeouts or skipped tests were used.

GitHub's PR head is `110fa9b56039e15694585acbfa2a592ddcf86227`. Exact-head [Checks run 41662531235](https://github.com/fnaticsam/chillin/actions/runs/41662531235) completed successfully: both quality (clean install, lint, types, unmodified production build, unit/render tests and browser tests) and dependency-audit passed. The earlier failed runs above are historical and do not describe this head.

The PR is still stacked on #2 (`codex/chillin-ui-audit`), remains a draft, and GitHub reports `mergeable=false`. Its PR description still cites older validation and needs a separate refresh. Passing checks do not resolve those PR-state blockers. This documentation correction is committed on top of that head; no PR metadata changes, merges or deployments were made.
