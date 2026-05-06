import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink-700">
      <section className="container-hero py-20">
        <p className="kicker kicker-accent">404</p>
        <h1 className="mt-4 font-display text-mast text-ink-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">
          요청한 URL이 존재하지 않거나 아직 공개되지 않았습니다.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex border border-ink-900 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-800 hover:bg-ink-900 hover:text-paper"
        >
          Home
        </Link>
      </section>
    </main>
  );
}
