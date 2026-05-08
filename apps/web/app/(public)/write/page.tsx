import type { Metadata } from "next";
import { AdminPostForm } from "../../(admin)/admin/_components/post-form";
import { createEmptyAdminPostDraft } from "@/lib/admin/mdx";
import { requireAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Write",
  description: "Write a new blog post in the browser editor.",
};

export default async function WritePage() {
  await requireAdminSession();

  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="mb-8">
        <p className="kicker kicker-accent">Write</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900 md:text-6xl">
          새 글 작성
        </h1>
        <p className="mt-4 text-ink-500">
          이 화면에서 바로 글을 쓰면 기존 MDX 포스트 구조로 GitHub에 저장됩니다.
        </p>
      </div>
      <AdminPostForm post={createEmptyAdminPostDraft()} mode="new" error={undefined} />
    </div>
  );
}
