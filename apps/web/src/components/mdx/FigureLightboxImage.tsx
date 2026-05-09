"use client";

import { useEffect, useId, useState } from "react";
import {
  getFigureLightboxAlt,
  getFigureOpenLabel,
  isLightboxDismissKey,
  LIGHTBOX_DIALOG_LABEL,
} from "./figure-lightbox";

type FigureLightboxImageProps = {
  src: string;
  alt: string;
  caption?: string;
  referrerPolicy?: "no-referrer";
};

export function FigureLightboxImage({
  src,
  alt,
  caption,
  referrerPolicy,
}: FigureLightboxImageProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const safeAlt = getFigureLightboxAlt(alt, caption);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (isLightboxDismissKey(event.key)) setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={getFigureOpenLabel(alt, caption)}
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-md text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={safeAlt}
          loading="lazy"
          referrerPolicy={referrerPolicy}
          className="block w-full rounded-md border border-paper-rule transition duration-200 group-hover:brightness-[0.96]"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-ink-900/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          크게 보기
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[100] bg-black/88"
        >
          <button
            type="button"
            aria-label="이미지 닫기"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-zoom-out"
          />
          <div className="pointer-events-none relative z-10 flex min-h-dvh items-center justify-center p-4 sm:p-8">
            <figure className="pointer-events-auto max-w-full">
              <h2 id={titleId} className="sr-only">
                {LIGHTBOX_DIALOG_LABEL}
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={safeAlt}
                referrerPolicy={referrerPolicy}
                className="max-h-[86vh] max-w-[calc(100vw-2rem)] rounded-md bg-paper object-contain shadow-2xl sm:max-w-[calc(100vw-4rem)]"
              />
              {caption ? (
                <figcaption className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-white/80">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
            <button
              type="button"
              aria-label="이미지 닫기"
              onClick={() => setOpen(false)}
              className="pointer-events-auto absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            >
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
