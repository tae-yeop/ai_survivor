import { pageMetadata } from "@/lib/seo/metadata";
import { AUTHOR_DISPLAY_NAME } from "@/lib/brand-copy";

export const metadata = pageMetadata({
  title: "About",
  description: "AI 시대를 살아남기 위한 발버둥을 남기는 1인 생존 기록장입니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="container-prose py-16">
      <h1 className="font-display text-3xl font-bold tracking-[-0.025em] text-ink-900">
        About
      </h1>

      <div className="prose prose-post mt-8 max-w-none">
        <p>
          AI 시대를 살아남기 위해 부딪힌 도구, 에러, 비용, 결과물을 남기는 생존 기록장입니다.
          성공담보다 막혔던 지점과 다시 볼 단서를 우선합니다.
        </p>

        <p>
          운영자: {AUTHOR_DISPLAY_NAME}
          <br />
          이메일:{" "}
          <a href="mailto:deertangs@gmail.com" className="text-accent hover:underline">
            deertangs@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
