import Link from "next/link";
import { getAdminContentConfigStatus } from "@/lib/admin/env";
import { listAdminPostsFromGitHub } from "@/lib/admin/github-content";
import { listAdminPostsFromLocalContent } from "@/lib/admin/local-posts";
import type { AdminPostSummary } from "@/lib/admin/mdx";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminHeader, ConfigWarning } from "./_components/admin-ui";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PostListState = {
  posts: AdminPostSummary[];
  source: "github" | "local";
  error: string | null;
};

async function loadAdminPostList(): Promise<PostListState> {
  const contentStatus = getAdminContentConfigStatus();
  if (!contentStatus.configured) {
    return { posts: listAdminPostsFromLocalContent(), source: "local", error: null };
  }

  try {
    return {
      posts: await listAdminPostsFromGitHub(contentStatus.config),
      source: "github",
      error: null,
    };
  } catch (error) {
    return {
      posts: listAdminPostsFromLocalContent(),
      source: "local",
      error: error instanceof Error ? error.message : "Unable to list GitHub posts",
    };
  }
}

export default async function AdminPage() {
  const session = await requireAdminSession();
  const contentStatus = getAdminContentConfigStatus();
  const { posts, source, error } = await loadAdminPostList();

  return (
    <div>
      <div className="mb-4 flex justify-end gap-4 text-sm">
        <span className="text-ink-500">Signed in as {session.login}</span>
        <a
          className="text-ink-600 underline underline-offset-4 hover:text-accent"
          href="/api/admin/logout"
        >
          Logout
        </a>
      </div>
      <AdminHeader
        title="Blog admin"
        description="Create and edit MDX posts. Saves use the GitHub Contents API, then Vercel can redeploy from the normal git flow."
      />

      {!contentStatus.configured ? (
        <div className="mb-6">
          <ConfigWarning
            title="GitHub write API is not configured yet"
            missing={contentStatus.missing}
          />
        </div>
      ) : null}
      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          GitHub list failed, so this page is showing bundled local content: {error}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Showing {posts.length} posts from {source}. New posts save as draft unless you change
          status.
        </p>
        <Link
          className="rounded-md bg-ink-900 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-paper transition hover:bg-accent"
          href="/admin/posts/new"
        >
          New draft
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-paper-rule bg-paper shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-paper-deep text-xs uppercase tracking-[0.12em] text-ink-500">
            <tr>
              <th className="px-4 py-3">Post</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-t border-paper-rule align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-ink-900">{post.title}</div>
                  <div className="mt-1 font-mono text-xs text-ink-400">{post.slug}</div>
                  <div className="mt-2 max-w-xl text-xs leading-relaxed text-ink-500">
                    {post.description}
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-xs uppercase text-ink-600">
                  {post.status}
                </td>
                <td className="px-4 py-4 font-mono text-xs text-ink-500">{post.updatedAt}</td>
                <td className="px-4 py-4">
                  <Link
                    className="text-sm text-accent underline underline-offset-4"
                    href={`/admin/posts/${post.slug}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
