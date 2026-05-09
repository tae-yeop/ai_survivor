import type { ComponentProps } from "react";
import { AffiliateLink } from "@/components/monetization";
import { AudioEmbed } from "./AudioEmbed";
import { DocumentEmbed } from "./DocumentEmbed";
import { Figure } from "./Figure";
import { YouTube } from "./YouTube";

function MdxImage({ src, alt = "", ...rest }: ComponentProps<"img">) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="my-6 max-w-full rounded-md border border-paper-rule"
      {...rest}
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
