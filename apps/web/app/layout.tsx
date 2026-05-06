import type { Metadata, Viewport } from "next";
import "../src/styles/global.css";
import { SITE_DESCRIPTION, SITE_LANG, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  themeColor: "#0e7490",
};

const themeScript = `
(function() {
  document.documentElement.classList.remove('no-js');
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE_LANG} className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg-primary text-ink-700 antialiased">{children}</body>
    </html>
  );
}
