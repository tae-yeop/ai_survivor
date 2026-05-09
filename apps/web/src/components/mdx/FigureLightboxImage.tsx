"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getFigureLightboxState,
  getFigureLightboxAlt,
  getFigureOpenLabel,
  getLightboxPortalContainer,
  isLightboxImageDismissClick,
  isLightboxDismissKey,
  LIGHTBOX_DIALOG_LABEL,
  LIGHTBOX_EXIT_MS,
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
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const titleId = useId();
  const safeAlt = getFigureLightboxAlt(alt, caption);
  const lightboxState = getFigureLightboxState(closing);
  const portalContainer = open
    ? getLightboxPortalContainer(typeof document === "undefined" ? undefined : document)
    : null;

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openLightbox = useCallback(() => {
    clearCloseTimer();
    setClosing(false);
    setOpen(true);
  }, [clearCloseTimer]);

  const closeLightbox = useCallback(() => {
    if (!open || closing) return;
    setClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closeTimerRef.current = null;
    }, LIGHTBOX_EXIT_MS);
  }, [clearCloseTimer, closing, open]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (isLightboxDismissKey(event.key)) closeLightbox();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, open]);

  return (
    <>
      <button
        type="button"
        aria-label={getFigureOpenLabel(alt, caption)}
        onClick={openLightbox}
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

      {open && portalContainer
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-state={lightboxState}
              className="fixed inset-0 z-[100] bg-black/88 data-[state=closing]:[animation:lightbox-backdrop-out_220ms_ease-in_both] data-[state=open]:[animation:lightbox-backdrop-in_180ms_ease-out_both] motion-reduce:[animation:none]"
            >
              <button
                type="button"
                aria-label="이미지 닫기"
                onClick={closeLightbox}
                className="absolute inset-0 cursor-zoom-out"
              />
              <div className="pointer-events-none relative z-10 flex min-h-dvh items-center justify-center p-4 sm:p-8">
                <figure
                  data-state={lightboxState}
                  className="pointer-events-auto max-w-full origin-center data-[state=closing]:[animation:lightbox-zoom-out_220ms_ease-in_both] data-[state=open]:[animation:lightbox-zoom-in_220ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:[animation:none]"
                >
                  <h2 id={titleId} className="sr-only">
                    {LIGHTBOX_DIALOG_LABEL}
                  </h2>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={safeAlt}
                    referrerPolicy={referrerPolicy}
                    onClick={(event) => {
                      if (isLightboxImageDismissClick(event.target, event.currentTarget)) {
                        closeLightbox();
                      }
                    }}
                    className="max-h-[86vh] max-w-full cursor-zoom-out rounded-md bg-paper object-contain shadow-2xl"
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
                  onClick={closeLightbox}
                  className="pointer-events-auto absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
                >
                  닫기
                </button>
              </div>
            </div>,
            portalContainer,
          )
        : null}
      <style jsx global>{`
        @keyframes lightbox-backdrop-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes lightbox-backdrop-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes lightbox-zoom-in {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes lightbox-zoom-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
        }
      `}</style>
    </>
  );
}
