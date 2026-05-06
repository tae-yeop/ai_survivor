import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "404",
  description: "요청한 페이지를 찾을 수 없습니다.",
  path: "/404",
});

export default function FourOhFourPage() {
  return (
    <>
      <PageHeader
        kicker="404"
        title="페이지를 찾을 수 없습니다"
        description="URL이 바뀌었거나 아직 발행되지 않은 글일 수 있습니다."
      />
      <section className="container-hero py-10">
        <Button asChild>
          <Link href="/posts">전체 글 보기</Link>
        </Button>
      </section>
    </>
  );
}
