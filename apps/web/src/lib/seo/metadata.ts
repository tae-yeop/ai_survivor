import type { Metadata } from "next";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string | null;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: PageMetadataInput): Metadata {
  const imagePath = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title === SITE_NAME ? title : `${title} · ${SITE_NAME}`,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type,
      images: [
        {
          url: absoluteUrl(imagePath),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(imagePath)],
    },
  };
}
