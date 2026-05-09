import type { ComponentProps } from "react";
import { AffiliateLink } from "@/components/monetization";
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
  Figure,
  YouTube,
  img: MdxImage,
};
