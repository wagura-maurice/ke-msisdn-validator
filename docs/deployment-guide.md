# Deployment Guide

This package is published to the npm registry and gets a GitHub Release automatically via GitHub Actions. You do **not** publish manually.

## How releases work

Publishing is triggered **only** by version tags — normal pushes to `master` run CI/tests but never publish.

| Trigger                          | Workflows that run                       |
| -------------------------------- | ---------------------------------------- |
| Push or PR (any branch)          | `CI` — npm install + tests (Node 18/20/22) |
| Push a tag `vX.Y.Z`              | `Release` (GitHub Release) + `Publish to npm` |

## Release checklist

1. Make your code changes and push them to `master`.
2. Confirm CI is green.
3. Bump the version in `package.json` (and `npm install` to refresh `package-lock.json`), e.g. `1.0.1` → `1.0.2`.
4. Commit the version bump and push.
5. Create and push the matching tag:

   ```bash
   git tag v1.0.2
   git push origin v1.0.2
   ```

   The tag must match the `package.json` version (`v1.0.2` ↔ `1.0.2`).

6. That's it. GitHub Actions will:
   - run the tests,
   - publish `ke-msisdn-validator@1.0.2` to npm,
   - create a GitHub Release with auto-generated notes.

## How npm publishing is authenticated

Publishing uses **npm Trusted Publishing (OIDC)** — no long-lived token is stored in GitHub Secrets. GitHub issues a short-lived identity token at build time and npm verifies it against the trusted publisher registered for this repo.

To change or re-register the trusted publisher:

1. Go to https://www.npmjs.com/package/ke-msisdn-validator → **Access** → **Trusted Publishing**.
2. Publisher details:
   - Provider: **GitHub**
   - Organization or user: `wagura-maurice`
   - Repository: `ke-msisdn-validator`
   - Workflow filename: `publish-npm.yml`

If publishing ever fails with `ENEEDAUTH`, double-check the workflow filename matches exactly (case-sensitive), that the workflow runs on a GitHub-hosted runner, and that `id-token: write` is set.

## Workflows

- `.github/workflows/ci.yml` — tests on every push/PR.
- `.github/workflows/release.yml` — GitHub Release on `v*` tags.
- `.github/workflows/publish-npm.yml` — npm publish via OIDC on `v*` tags.
