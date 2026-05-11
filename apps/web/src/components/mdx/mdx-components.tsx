import type { ComponentProps } from "react";
import { AffiliateLink } from "@/components/monetization";
import { AudioEmbed } from "./AudioEmbed";
import { DocumentEmbed } from "./DocumentEmbed";
import { Figure } from "./Figure";
import { getMdxImageReferrerPolicy } from "./mdx-image-policy";
import { YouTube } from "./YouTube";

function MdxImage({
  src,
  alt = "",
  referrerPolicy,
  ...rest
}: ComponentProps<"img">) {
  return (
    // MDX fallback images can be migrated content without stable dimensions.
    // Keep raw image behavior, but avoid leaking page referrers to external hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy={getMdxImageReferrerPolicy(src, referrerPolicy)}
      className="my-6 max-w-full rounded-md border border-paper-rule"
    />
  );
}

export const mdxComponents = {
  AffiliateLink,
  AudioEmbed,
  DocumentEmbed,
  Figure,
  YouTube,
  img: MdxImage,
};
