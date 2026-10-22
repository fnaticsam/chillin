# Dependency and check validation — 2026-10-22

This is the check foundation above the UI repair branch. The immutable source audit is in PR #1; this change addresses C09 and C10.

- Next and its ESLint configuration are aligned at 15.5.28 (previous runtime lock: 15.5.12).
- Puppeteer is updated to 25.16.0. The Node 24 engine matches the read-only Vercel project metadata. Supported dependency updates refresh the lockfile; Next's pinned PostCSS is overridden to the directly declared PostCSS (resolved 8.5.31).
- The old lint script opened an interactive setup prompt. ESLint now has a checked-in flat configuration and zero-warning CLI command. Actual lint findings were fixed (internal links and the unused animation constant); no rules were disabled.
- The workflow has read-only contents permissions, no secrets, deployments, publishing or write actions. GitHub Actions versions are pinned to the SHAs returned by their public v6 tags on the audit date. It runs lint, types, build, unit/render tests, browser tests when present, and an independent high-severity dependency audit.

## Results and remaining gates

`npm ci --ignore-scripts`, lint, TypeScript and whitespace checks pass. A local build with **test-only Google Fonts response mocks** passes, followed by production-server page smoke tests and particle lifecycle tests. The original build with actual Google Fonts requests fails because this environment cannot fetch those resources; the font mock is outside the repository and is not enabled by hosted CI. This is not a successful unmodified production build.

`npm audit` improved from 27 affected dependency entries (2 critical, 21 high, 3 moderate, 1 low) to 5 high entries, all from a single development dependency chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. Runtime-only audit reports zero findings. `braces` 3.0.3 is the latest published release at the audit date and is affected by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Five entries are not five independent vulnerabilities. Exposure requires processing attacker-controlled deeply nested patterns; this repository's lint command uses fixed source directories. No exploit was run. The full dependency-audit job remains blocking; no audit suppression, rule disablement, forced downgrade, or `continue-on-error` was added to make it green.

Hosted CI results must be recorded separately after publication. The CLI workflow-definition listing was denied with `Forbidden` and was not retried. The authorized connector's commit-scoped run/status lookups are distinct checks and previously returned empty arrays for the first two PRs.
