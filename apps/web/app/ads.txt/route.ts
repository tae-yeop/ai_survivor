const GOOGLE_ADSENSE_AUTHORITY_ID = "f08c47fec0942fa0";

function normalizePublisherId(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/^ca-/, "");
}

export function GET() {
  const publisherId = normalizePublisherId(process.env.ADSENSE_CLIENT);

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, ${GOOGLE_ADSENSE_AUTHORITY_ID}\n`
    : "# ads.txt placeholder: AdSense publisher id is not configured.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
