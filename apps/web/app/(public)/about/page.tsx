import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "AI 도구를 직접 써보고 기록하는 1인 블로그입니다.",
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
          AI 도구를 직접 써보고, 설치부터 에러·비용·결과물까지 있는 그대로 기록하는 블로그입니다.
          실제로 써보지 않은 것은 쓰지 않습니다.
        </p>

        <p>
          운영자: ty-kim
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
