import { loadPosts } from "../content/posts.ts";
import { toAdminPostSummary, type AdminPostSummary } from "./mdx.ts";

export function listAdminPostsFromLocalContent(): AdminPostSummary[] {
  return loadPosts({ includeNonPublic: true }).map((post) =>
    toAdminPostSummary(
      {
        ...post,
        coverAlt: null,
        body: "",
      },
      "local",
    ),
  );
}
