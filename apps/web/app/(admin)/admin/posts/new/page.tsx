import { createEmptyAdminPostDraft } from "@/lib/admin/mdx";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminHeader, getSearchParam } from "../../_components/admin-ui";
import { AdminPostForm } from "../../_components/post-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function NewAdminPostPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const error = getSearchParam(params, "error");

  return (
    <div>
      <AdminHeader
        title="New draft"
        description="Create a new MDX file in apps/web/content/posts/<slug>/index.mdx. Status starts as draft."
      />
      <AdminPostForm post={createEmptyAdminPostDraft()} mode="new" error={error} />
    </div>
  );
}
