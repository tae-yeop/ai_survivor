import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContentConfigStatus } from "@/lib/admin/env";
import { getPostSourceFromGitHub } from "@/lib/admin/github-content";
import { parseAdminPostSource } from "@/lib/admin/mdx";
import { assertValidPostSlug } from "@/lib/admin/slug";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminHeader, ConfigWarning, getSearchParam } from "../../_components/admin-ui";
import { AdminPostForm } from "../../_components/post-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function EditAdminPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const { slug: rawSlug } = await params;
  const paramsValue = await searchParams;
  const slug = assertValidPostSlug(rawSlug);
  const contentStatus = getAdminContentConfigStatus();
  const error = getSearchParam(paramsValue, "error");
  const saved = getSearchParam(paramsValue, "saved");
  const commit = getSearchParam(paramsValue, "commit");
  const commitUrl = getSearchParam(paramsValue, "commitUrl");

  if (!contentStatus.configured) {
    return (
      <div>
        <AdminHeader
          title="Edit post"
          description="GitHub content settings are required before editing existing posts."
        />
        <ConfigWarning
          title="GitHub write API is not configured yet"
          missing={contentStatus.missing}
        />
      </div>
    );
  }

  let source: string | null = null;
  try {
    const file = await getPostSourceFromGitHub(contentStatus.config, slug);
    source = file?.source ?? null;
  } catch (readError) {
    return (
      <div>
        <AdminHeader
          title="GitHub read failed"
          description={`Could not load ${slug} from GitHub.`}
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {readError instanceof Error ? readError.message : "Unknown GitHub read error"}
        </div>
        <Link
          className="mt-5 inline-block text-sm text-accent underline underline-offset-4"
          href="/admin"
        >
          Back to admin
        </Link>
      </div>
    );
  }
  if (!source) notFound();
  const post = parseAdminPostSource(source, slug);

  return (
    <div>
      <AdminHeader
        title={`Edit: ${post.title}`}
        description="Changes are saved by committing the MDX source file back to GitHub."
      />
      {saved ? (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          Saved to GitHub{commit ? ` at ${commit}` : ""}.
          {commitUrl ? (
            <a
              className="ml-2 underline underline-offset-4"
              href={commitUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open commit
            </a>
          ) : null}
        </div>
      ) : null}
      <AdminPostForm post={post} mode="edit" error={error} />
    </div>
  );
}
