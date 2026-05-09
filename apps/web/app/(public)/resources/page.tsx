import { PageHeader } from "@/components/layout/page-header";
import { DisclosureBox, ProductCard } from "@/components/monetization";
import type { MonetizedLinkKind } from "@/lib/monetization";
import { pageMetadata } from "@/lib/seo/metadata";

type Resource = {
  title: string;
  description: string;
  href: string;
  label: string;
  kind?: MonetizedLinkKind;
  note?: string;
};

type ResourceGroup = {
  title: string;
  description: string;
  items: Resource[];
};

const resourceGroups: ResourceGroup[] = [
  {
    title: "AI 코딩과 개발 워크플로",
    description: "블로그 제작, 글쓰기 자동화, 코드 실험에 자주 등장하는 개발 도구입니다.",
    items: [
      {
        title: "Cursor",
        description: "AI pair programming과 코드베이스 탐색에 사용하는 에디터 후보.",
        href: "https://cursor.com",
        label: "공식 사이트",
        kind: "editorial",
      },
      {
        title: "Next.js",
        description: "현재 public site와 admin editor가 올라가 있는 App Router 기반 프레임워크.",
        href: "https://nextjs.org",
        label: "공식 문서",
        kind: "editorial",
      },
      {
        title: "GitHub",
        description: "MDX 원본, 이미지, 변경 이력을 보관하는 Git-backed 콘텐츠 저장소.",
        href: "https://github.com",
        label: "공식 사이트",
        kind: "editorial",
      },
    ],
  },
  {
    title: "배포와 검색 노출",
    description: "런칭 후 도메인, 배포, 검색 색인을 확인할 때 필요한 서비스입니다.",
    items: [
      {
        title: "Vercel",
        description: "Next.js 배포와 preview/production 환경 분리를 담당하는 기본 배포 후보.",
        href: "https://vercel.com",
        label: "공식 사이트",
        kind: "editorial",
      },
      {
        title: "Google Search Console",
        description: "sitemap 제출, 색인 상태, 검색어 노출을 확인하는 필수 운영 도구.",
        href: "https://search.google.com/search-console",
        label: "도구 열기",
        kind: "editorial",
      },
      {
        title: "Naver Search Advisor",
        description: "한국어 검색 유입 확인과 네이버 색인 제출을 위한 운영 도구.",
        href: "https://searchadvisor.naver.com",
        label: "도구 열기",
        kind: "editorial",
      },
    ],
  },
  {
    title: "수익화 준비",
    description: "AdSense 외 제휴/스폰서/리소스 페이지를 준비할 때 확인할 곳입니다.",
    items: [
      {
        title: "Google AdSense",
        description: "정책 페이지, 충분한 원본 글, 도메인 연결 후 신청하는 광고 네트워크.",
        href: "https://www.google.com/adsense/start/",
        label: "공식 사이트",
        kind: "editorial",
        note: "광고는 승인 전까지 비활성화합니다.",
      },
      {
        title: "Coupang Partners",
        description: "한국어 콘텐츠에서 개발 장비·책 추천을 붙일 때 검토할 제휴 프로그램.",
        href: "https://partners.coupang.com",
        label: "공식 사이트",
        kind: "editorial",
        note: "실제 제휴 링크를 붙일 때는 고지와 rel 정책을 적용합니다.",
      },
      {
        title: "Amazon Associates",
        description: "영문 콘텐츠 또는 해외 독자를 대상으로 할 때 검토할 제휴 프로그램.",
        href: "https://affiliate-program.amazon.com",
        label: "공식 사이트",
        kind: "editorial",
        note: "영문/해외 독자 대상 콘텐츠를 시작할 때 재검토합니다.",
      },
    ],
  },
];

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "AI 시대 생존기에서 실제 사용하거나 검토 중인 AI 도구, 개발 스택, 검색/수익화 운영 리소스를 정리합니다.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        kicker="resources"
        title="실제로 쓰거나 검토 중인 도구"
        description="AI 도구, 블로그 개발 스택, 검색 노출, 수익화 준비에 필요한 리소스를 한 곳에 모읍니다."
      />

      <section className="container-wide py-12">
        <DisclosureBox title="disclosure">
          <p>
            이 페이지에는 향후 제휴 링크가 포함될 수 있습니다. 제휴 링크를 통해 구매하면 작성자가
            일정액의 수수료를 받을 수 있으며, 구매자에게 추가 비용은 발생하지 않습니다. 현재는 공식
            사이트와 운영 도구를 우선 연결합니다.
          </p>
        </DisclosureBox>

        <div className="mt-10 grid gap-8">
          {resourceGroups.map((group) => (
            <section key={group.title} className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink-900">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink-500">{group.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {group.items.map((resource) => (
                  <ProductCard
                    key={resource.href}
                    title={resource.title}
                    description={resource.description}
                    href={resource.href}
                    ctaLabel={resource.label}
                    kind={resource.kind ?? "editorial"}
                    note={resource.note}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
