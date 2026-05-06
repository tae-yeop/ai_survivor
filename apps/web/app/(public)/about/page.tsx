import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "AI Vibe Lab은 AI 도구와 바이브코딩, 자동화 실험을 직접 사용해 보고 검증한 기록을 공유하는 한국어 블로그입니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="about"
        title="직접 실험한 AI 활용 경험을 기록합니다"
        description="AI Vibe Lab은 AI 도구, 바이브코딩, 업무 자동화 흐름을 실제 프로젝트와 콘텐츠 운영에 적용해 보고 배운 점을 한국어로 정리하는 블로그입니다. 성공 사례뿐 아니라 한계와 시행착오도 함께 남깁니다."
      />
      <section className="container-prose prose py-12">
        <h2>운영 목적</h2>
        <p>
          이 사이트는 개발자와 1인 창작자, 지식노동자가 AI를 더 안전하고 현실적으로 활용할 수 있도록
          실험 과정과 결과를 공유합니다. 단순한 도구 소개보다 실제로 어떤 문제를 풀었는지, 어떤
          비용과 제약이 있었는지, 다음에 무엇을 개선할 수 있는지를 중심으로 다룹니다.
        </p>

        <h2>다루는 주제</h2>
        <p>
          주요 주제는 AI 코딩 도구, 프롬프트 설계, 리서치 자동화, 콘텐츠 제작 워크플로, 검색
          친화적인 블로그 운영, 생산성 도구 비교입니다. 모든 글은 독자가 자신의 환경에서 재현하거나
          판단할 수 있도록 배경과 기준을 함께 설명하는 것을 목표로 합니다.
        </p>

        <h2>콘텐츠 원칙</h2>
        <p>
          초안 작성과 코드 보조에는 AI를 사용할 수 있지만, 게시 전에는 사람이 내용을 검토합니다.
          사실 확인이 필요한 정보는 가능한 한 출처와 검증 과정을 남기고, 개인적인 의견과 경험은
          명확히 구분합니다. 광고나 제휴가 포함되는 경우에는 독자가 알 수 있도록 표시할 예정입니다.
        </p>

        <h2>독자에게 드리는 약속</h2>
        <p>
          AI Vibe Lab은 과장된 성과보다 실용적인 판단을 우선합니다. 빠르게 변하는 AI 환경 속에서도
          오래 참고할 수 있는 기록을 만들기 위해 글의 작성일, 업데이트 이력, 실험 조건을 최대한
          투명하게 남기겠습니다.
        </p>
      </section>
    </>
  );
}
