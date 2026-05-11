---
title: "How It Works Doc Contract"
tags: ["docs-first", "verification", "source-of-truth"]
created: 2026-05-11T12:18:36Z
updated: 2026-05-11T12:42:00Z
sources: ["AGENTS.md", "CLAUDE.md", "docs/README.md", "docs/40_architecture/HOW_IT_WORKS.md", "docs/50_execution/SIMILAR_SERVICE_STARTER.md"]
links: ["project-wiki-overview.md", "active-app-boundary.md"]
category: convention
confidence: high
schemaVersion: 1
---
# How It Works Doc Contract
Docs are the source of truth. Code must not outrun architecture and execution docs.

## Required startup read
Before repository work, read or skim as relevant:

1. `CLAUDE.md`
2. `docs/README.md`
3. `docs/40_architecture/HOW_IT_WORKS.md`
4. `docs/50_execution/SIMILAR_SERVICE_STARTER.md`
5. `docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md`
6. Relevant phase or task docs under `docs/50_execution/**`

## Docs that must stay current
- `docs/40_architecture/HOW_IT_WORKS.md`, when routes, content flow, admin/write flow, env vars, GitHub storage, SEO outputs, or deployment behavior change.
- `docs/50_execution/SIMILAR_SERVICE_STARTER.md`, when reusable bootstrap patterns change.
- Implementation status docs, when active/deferred/legacy boundaries change.

## Request mode rule
If the user asks to document, review, inspect, audit, critique, or improve a plan/task document, do not implement app code unless explicitly requested.

If the user asks to implement, fix, build, or ship, follow Plan -> Implement -> Verify -> Document.

## Verification baseline
For code changes in `apps/web`, start narrow and expand as risk increases:

```bash
cd apps/web
npm run test
npm run format
npm run lint
npm run typecheck
npm run build
```

For docs-only changes, check file/link sanity and run `git diff --check`.
