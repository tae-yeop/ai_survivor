import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { categoryBuckets } from "@/lib/content/posts";
import { CATEGORY_DESCRIPTIONS } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Categories",
  description: "AI Vibe Lab의 카테고리별 글 묶음을 탐색합니다.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = categoryBuckets();
  return (
    <>
      <PageHeader
        kicker="categories"
        title="카테고리"
        description="비어 있는 카테고리는 노출하지 않고, 발행된 글이 있는 주제만 보여줍니다."
      />
      <section className="container-wide grid gap-5 py-12 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="card-elevated block p-6 transition-colors hover:border-ink-900"
          >
            <p className="kicker kicker-accent">{String(category.count).padStart(2, "0")} posts</p>
            <h2 className="mt-3 font-display text-2xl text-ink-900">{category.label}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {CATEGORY_DESCRIPTIONS[category.slug] ?? "발행된 글이 있는 카테고리입니다."}
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
