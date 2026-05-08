import { HeroCanvas } from "@/components/home/HeroCanvas";
import { HomePostsSection } from "@/components/home/HomePostsSection";
import { PopularPosts } from "@/components/home/PopularPosts";
import { TagCloud } from "@/components/home/TagCloud";
import { categoryBuckets, publishedPosts, tagBuckets } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const posts = publishedPosts;
  const hasMore = posts.length > 6;

  const categoryPills = categoryBuckets().map((b) => ({
    slug: b.slug,
    label: categoryLabel(b.slug) || b.label,
  }));

  const featuredPosts = posts.filter((p) => p.featured);
  const popularPosts =
    featuredPosts.length >= 1 ? featuredPosts.slice(0, 5) : posts.slice(0, 5);

  return (
    <>
      <HeroCanvas />

      <div className="mx-auto w-full max-w-[1100px] px-5">
        <HomePostsSection posts={posts} categoryPills={categoryPills} hasMore={hasMore} />

        <section className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-[1fr_280px]">
          <PopularPosts posts={popularPosts} />
          <aside className="space-y-10">
            <TagCloud tags={tagBuckets()} />
          </aside>
        </section>
      </div>
    </>
  );
}
