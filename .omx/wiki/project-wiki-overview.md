---
title: "Project Wiki Overview"
tags: ["overview", "index", "onboarding"]
created: 2026-05-11T12:21:08Z
updated: 2026-05-11T12:42:00Z
sources: ["docs/README.md", "docs/40_architecture/HOW_IT_WORKS.md", "docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md"]
links: ["active-app-boundary.md", "how-it-works-doc-contract.md", "content-model-and-public-filtering.md", "admin-auth-and-github-write-flow.md", "public-protected-editor-boundary.md", "deployment-runbook-essentials.md", "similar-service-starter-pattern.md", "implementation-status-and-followups-2026-05-09.md"]
category: reference
confidence: high
schemaVersion: 1
---
# Project Wiki Overview
Start here when re-entering the AI Survivor codebase.

## Core pages
- [[active-app-boundary]]: Active app boundary and legacy Astro warning.
- [[how-it-works-doc-contract]]: Docs-first workflow, startup read, and verification rules.
- [[content-model-and-public-filtering]]: MDX post model, publishing states, and public filtering.
- [[admin-auth-and-github-write-flow]]: GitHub OAuth owner login and GitHub Contents API write path.
- [[public-protected-editor-boundary]]: Separation between crawler-safe public reads and owner-only writes.
- [[deployment-runbook-essentials]]: Vercel root, env, build, and smoke checklist.
- [[similar-service-starter-pattern]]: Reusable pattern for similar Git-backed content services.
- [[implementation-status-and-followups-2026-05-09]]: Implemented surfaces and known follow-ups.

## Golden rule
Keep the public read path simple. Put admin/editor complexity behind protected owner-only boundaries. When behavior changes, update the docs in the same patch.
