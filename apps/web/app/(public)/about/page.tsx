import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "AI 시대를 살아남기 위해 직접 따라 해본 튜토리얼, 막힌 부분, 비용, 결과물까지 정리합니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="about"
        title="AI 시대 생존기"
        description="AI 시대를 살아남기 위해 직접 따라 해본 튜토리얼, 막힌 부분, 비용, 결과물까지 정리합니다."
      />
      <section className="container-prose prose py-12">
        <h2>이 사이트가 하는 일</h2>
        <p>
          AI 시대 생존기는 AI 뉴스 요약 블로그가 아닙니다. 개발자이자 메이커가 직접 AI 튜토리얼을
          따라 해보고, 설치부터 에러, 비용, 결과물까지 정리합니다. 잘 된 것뿐 아니라 막힌 부분과
          비용 누수, 약관상 조심해야 할 부분까지 기록합니다.
        </p>

        <h2>이 사이트가 하지 않는 일</h2>
        <p>
          새 도구 출시 알림, 추측성 트렌드 분석, 실험해보지 않은 AI 사용법은 다루지 않습니다.
        </p>

        <h2>기록 기준</h2>
        <p>
          이 글을 읽은 사람이 시간·돈·시행착오 중 하나를 줄일 수 있는가 — 이 질문을 통과하지
          못하면 글로 발행되지 않습니다.
        </p>
      </section>
    </>
  );
}
