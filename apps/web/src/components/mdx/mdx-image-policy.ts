import type { ComponentProps } from "react";

export function getMdxImageReferrerPolicy(
  src: ComponentProps<"img">["src"],
  fallback?: ComponentProps<"img">["referrerPolicy"],
) {
  const isExternal =
    typeof src === "string" && /^https?:\/\//i.test(src);
  const isGitHubContentAsset =
    typeof src === "string" && src.includes("raw.githubusercontent.com");

  return isExternal && !isGitHubContentAsset ? "no-referrer" : fallback;
}
