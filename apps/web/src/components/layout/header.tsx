import { categoryBuckets } from "@/lib/content/posts";
import { FloatingNav } from "@/components/layout/FloatingNav";

export function Header() {
  const categories = categoryBuckets();
  return <FloatingNav categories={categories} />;
}
