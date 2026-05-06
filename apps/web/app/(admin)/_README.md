# Admin route group

Status: Phase B MVP implemented.

This route group exposes a private `/admin` editor for the owner account only. It does not use Supabase or a runtime database.

## Runtime model

- `/admin/login` starts GitHub OAuth.
- `/api/admin/github/callback` accepts the OAuth callback, verifies the CSRF state cookie, fetches the GitHub user, and creates a signed httpOnly session only when the account matches `ADMIN_GITHUB_LOGIN` and optional `ADMIN_GITHUB_ID`.
- `/admin` lists post files from GitHub when `GITHUB_CONTENT_TOKEN` is configured; otherwise it shows bundled local content plus a configuration warning.
- `/admin/posts/new` and `/admin/posts/[slug]` save `apps/web/content/posts/<slug>/index.mdx` by calling the GitHub Contents API from a server action.
- New posts default to `status: draft`.

## Required environment variables

See `apps/web/.env.example`. The admin feature must stay disabled until GitHub OAuth and a server-only repository content token are configured in Vercel.
