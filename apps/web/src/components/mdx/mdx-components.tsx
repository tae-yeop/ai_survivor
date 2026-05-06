import type { ComponentProps } from "react";
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
  YouTube,
  img: MdxImage,
};
