import Image from "next/image";
import { cn } from "@/lib/utils";

const GRADIENT_FALLBACKS = [
  "linear-gradient(135deg, #0d1020, #1e1b4b)",
  "linear-gradient(135deg, #1a0800, #7c2d12)",
  "linear-gradient(135deg, #0d1a14, #064e3b)",
  "linear-gradient(135deg, #1a1500, #78350f)",
  "linear-gradient(135deg, #0d1a1a, #164e63)",
  "linear-gradient(135deg, #13111a, #4c1d95)",
] as const;

function gradientIndex(slug: string): number {
  return slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENT_FALLBACKS.length;
}

type Props = {
  src: string | null;
  alt: string;
  categorySlug: string;
  className?: string;
};

export function PostCoverImage({ src, alt, categorySlug, className }: Props) {
  if (src) {
    const isExternal = src.startsWith("http://") || src.startsWith("https://");
    if (isExternal) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn("h-full w-full rounded-lg object-cover", className)}
        />
      );
    }
    return (
      <div className={cn("overflow-hidden rounded-lg", className)}>
        <Image
          src={src}
          alt={alt}
          width={760}
          height={428}
          sizes="(max-width: 768px) 100vw, 760px"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-lg", className)}
      style={{ background: GRADIENT_FALLBACKS[gradientIndex(categorySlug)] }}
      aria-hidden="true"
    />
  );
}
