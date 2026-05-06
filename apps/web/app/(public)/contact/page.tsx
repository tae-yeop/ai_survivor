import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "AI Vibe Lab 운영자에게 콘텐츠 정정 제안, 협업 문의, 피드백을 보낼 수 있는 연락처 안내 페이지입니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="contact"
        title="문의와 제안을 보내 주세요"
        description="콘텐츠 정정 요청, 실험 주제 제안, 협업 문의, 광고 및 정책 관련 문의가 있다면 이메일로 연락해 주세요."
      />
      <section className="container-prose prose py-12">
        <div className="card-elevated not-prose space-y-6 p-8">
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-ink-900">연락 가능한 주제</h2>
            <ul className="list-disc space-y-2 pl-5 leading-relaxed text-ink-600">
              <li>게시글의 오탈자, 오래된 정보, 출처 보강 요청</li>
              <li>AI 도구, 자동화 워크플로, 블로그 운영 실험에 대한 피드백</li>
              <li>협업 제안, 인터뷰 요청, 광고 및 제휴 관련 문의</li>
              <li>개인정보 처리, 쿠키, 광고 표시와 관련한 정책 문의</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-ink-900">응답 안내</h2>
            <p className="leading-relaxed text-ink-600">
              모든 문의에 즉시 답변하기는 어렵지만, 사이트 운영과 콘텐츠 품질에 필요한 내용은 확인
              후 가능한 범위 안에서 답변하겠습니다. 정정 요청은 확인 가능한 근거를 함께 보내 주시면
              더 빠르게 검토할 수 있습니다.
            </p>
          </div>

          <Button asChild>
            <Link href="mailto:hello@example.com">이메일 보내기</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
