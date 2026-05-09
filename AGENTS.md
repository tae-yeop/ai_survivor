# AGENTS.md

This file is the Codex entrypoint for this repository.

The project operating contract lives in [CLAUDE.md](CLAUDE.md). Codex must read
and follow it before doing repository work. `CLAUDE.md` is not Claude-only for
project rules; it is the shared source for docs-first workflow, implementation,
verification, and documentation discipline.

---

## Codex-Specific Operating Rules

1. **Respect request mode.**
   - If the user asks to document, review, inspect, audit, critique, or improve a
     plan/task document, do not implement app code unless explicitly requested.
   - In those cases, edit only the requested docs/planning files and any root
     agent instruction files needed for the task.
   - If the user asks to implement, fix, build, or ship, follow the full
     Plan -> Implement -> Verify -> Document loop in `CLAUDE.md`.

2. **Docs remain source of truth.**
   - Large behavior, architecture, IA, auth, deployment, content model, or editor
     changes start in `docs/` or update `docs/` in the same patch.
   - Do not let code outrun the execution docs.
   - If docs and code disagree, report the mismatch and update docs first unless
     the user explicitly asked for a code-only patch.

3. **Implementation documentation is mandatory.**
   - Keep `docs/40_architecture/HOW_IT_WORKS.md` current whenever routes,
     content flow, admin/write flow, env vars, GitHub storage, SEO outputs, or
     deployment behavior change.
   - Keep `docs/50_execution/SIMILAR_SERVICE_STARTER.md` current when reusable
     patterns or bootstrapping steps change.
   - Keep implementation status docs current when active/deferred/legacy
     boundaries change.

4. **Scope is literal.**
   - Touch only files needed for the active request.
   - Do not do adjacent cleanup, dependency changes, route changes, redesigns, or
     migrations unless required for the request.
   - Preserve user-created or untracked work.

5. **Current app boundary.**
   - The active product app is `apps/web/`.
   - The root Astro app under `src/` is legacy/reference unless the user names it.
   - Do not reintroduce Supabase/Auth/DB CMS as active architecture without a new
     ADR or explicit user request.

6. **Implementation requires verification.**
   - For code changes, add or update focused tests when behavior changes.
   - Run the smallest useful verification first, then broader checks as risk
     increases.
   - For docs-only changes, run link/file sanity checks and `git diff --check`.
   - Report exact commands run and any known gaps.

7. **Project language.**
   - User-facing project docs and summaries default to Korean.
   - Code identifiers and technical API names should follow existing local
     conventions.

---

## Required Startup Read

Before acting on repository work, read or skim as relevant:

1. [CLAUDE.md](CLAUDE.md)
2. [docs/README.md](docs/README.md)
3. [docs/40_architecture/HOW_IT_WORKS.md](docs/40_architecture/HOW_IT_WORKS.md)
4. [docs/50_execution/SIMILAR_SERVICE_STARTER.md](docs/50_execution/SIMILAR_SERVICE_STARTER.md)
5. [docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md](docs/50_execution/IMPLEMENTATION_STATUS_2026-05-09.md)
6. The relevant phase/task docs under [docs/50_execution](docs/50_execution)

Then proceed according to the user's request mode.

---

## Completion Gate

Do not claim completion until:

- requested files are updated,
- relevant docs are synchronized,
- verification appropriate to the change has run,
- known gaps are explicitly reported.
