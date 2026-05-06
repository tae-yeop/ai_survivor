import Script from "next/script";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/site";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  slot: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  label?: string;
};

export function AdSlot({
  slot,
  className,
  format = "auto",
  responsive = true,
  label = "광고",
}: AdSlotProps) {
  if (!ADS_ENABLED || !ADSENSE_CLIENT || !slot) {
    return null;
  }

  return (
    <aside className={cn("my-8 text-center", className)} aria-label={label} data-ads>
      <Script
        id="adsense-script"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      <Script id={`adsense-push-${slot}`} strategy="afterInteractive">
        {`(window.adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}
