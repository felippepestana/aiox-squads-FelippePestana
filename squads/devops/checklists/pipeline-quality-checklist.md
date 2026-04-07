# Pipeline Quality Checklist

> Reviewer: pipeline-architect
> Purpose: Validate CI/CD pipeline before shipping to production.
> Usage: Check every item. A single unchecked CRITICAL item blocks approval.

---

## 1. Pipeline Structure

- [ ] Pipeline is defined as code (YAML/Groovy), version-controlled
- [ ] Stages follow correct order: lint → test → build → scan → deploy
- [ ] Concurrency controls prevent duplicate runs on same branch
- [ ] Pipeline triggers are scoped (not wildcard — specific branches/paths)

---

## 2. Caching & Performance

- [ ] Dependency caching configured (npm cache, pip cache, Maven repo)
- [ ] Build output caching enabled where supported (GHA cache, BuildKit)
- [ ] Parallel jobs used for independent stages (lint ∥ test)
- [ ] Total pipeline time < 10 min for PRs (target: < 5 min)

---

## 3. Testing

- [ ] Unit tests run with coverage report
- [ ] Test failure blocks pipeline progression (no `continue-on-error`)
- [ ] Test results uploaded as artifacts for debugging

---

## 4. Security [CRITICAL]

- [ ] No secrets hardcoded in pipeline config
- [ ] Secrets accessed via environment variables or vault
- [ ] SAST/SCA scanning integrated (at minimum: npm audit or equivalent)
- [ ] Container image scanned for CVEs before deployment

---

## 5. Deployment

- [ ] Staging deployment before production (no direct-to-prod)
- [ ] Production deployment requires approval gate or environment protection
- [ ] Rollback strategy documented and tested
- [ ] Deployment notifications configured (Slack, email, or webhook)

---

## 6. Artifacts

- [ ] Build artifacts tagged with commit SHA (not just :latest)
- [ ] Artifacts are immutable — built once, deployed to all environments
- [ ] Old artifacts have retention policy (auto-cleanup)
