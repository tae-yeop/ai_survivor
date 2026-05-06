import Link from "next/link";
import { getAdminAuthConfigStatus } from "@/lib/admin/env";
import { getAdminSession } from "@/lib/admin/session";
import { AdminHeader, ConfigWarning, getSearchParam } from "../_components/admin-ui";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getAdminSession();
  const authStatus = getAdminAuthConfigStatus();
  const error = getSearchParam(params, "error");
  const signedOut = getSearchParam(params, "signed_out");

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader
        title="Owner login"
        description="GitHub OAuth is used only to prove the site owner identity. Repository writes still use a server-only content token."
      />

      {session ? (
        <div className="rounded-2xl border border-paper-rule bg-paper p-5 shadow-sm">
          <p className="text-sm text-ink-600">Already signed in as {session.login}.</p>
          <Link
            className="mt-4 inline-block rounded-md bg-ink-900 px-4 py-3 text-sm text-paper"
            href="/admin"
          >
            Open admin
          </Link>
        </div>
      ) : null}

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {signedOut ? (
        <div className="mb-5 rounded-2xl border border-paper-rule bg-paper p-5 text-sm text-ink-600">
          Signed out.
        </div>
      ) : null}

      {!authStatus.configured ? (
        <ConfigWarning title="Owner login is not configured yet" missing={authStatus.missing} />
      ) : (
        <div className="rounded-2xl border border-paper-rule bg-paper p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-ink-600">
            Continue to GitHub. Only the configured ADMIN_GITHUB_LOGIN account can receive an admin
            session.
          </p>
          <a
            className="mt-5 inline-block rounded-md bg-ink-900 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-paper transition hover:bg-accent"
            href="/api/admin/github/login"
          >
            Sign in with GitHub
          </a>
        </div>
      )}
    </div>
  );
}
