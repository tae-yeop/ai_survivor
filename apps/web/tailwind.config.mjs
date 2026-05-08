import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        // Display = Pretendard heavy (clean tech sans for headlines)
        display: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        // Serif = Fraunces, reserved for drop caps and rare editorial moments
        serif: [
          "Fraunces",
          "Source Serif 4",
          "Apple SD Gothic Neo",
          "Pretendard",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        ink: {
          50: "var(--ink-50)",
          100: "var(--ink-100)",
          200: "var(--ink-200)",
          300: "var(--ink-300)",
          400: "var(--ink-400)",
          500: "var(--ink-500)",
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          800: "var(--ink-800)",
          900: "var(--ink-900)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
          soft: "var(--accent-soft)",
          muted: "var(--accent-muted)",
          deep: "var(--accent-deep)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          overlay: "var(--surface-overlay)",
        },
        bg: {
          page: "var(--bg-page)",
          surface: "var(--bg-surface)",
          subtle: "var(--bg-subtle)",
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          deep: "var(--paper-deep)",
          elevated: "var(--paper-elevated)",
          rule: "var(--paper-rule)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },
      maxWidth: {
        prose: "68ch",
        "6xl": "72rem",
        "7xl": "80rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      fontSize: {
        // Pretendard at weight 700 + moderate tracking for a calmer headline
        // that still feels confident — not "shouting in bold."
        mast: [
          "clamp(1.95rem, 4.5vw, 3.4rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(1.75rem, 3.5vw, 2.7rem)",
          { lineHeight: "1.12", letterSpacing: "-0.022em", fontWeight: "700" },
        ],
        display: [
          "clamp(1.55rem, 2.6vw, 2.15rem)",
          { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        tick: "tick 1.6s ease-in-out infinite",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink.700"),
            "--tw-prose-headings": theme("colors.ink.900"),
            "--tw-prose-lead": theme("colors.ink.500"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-bold": theme("colors.ink.900"),
            "--tw-prose-counters": theme("colors.ink.400"),
            "--tw-prose-bullets": theme("colors.ink.300"),
            "--tw-prose-hr": theme("colors.paper.rule"),
            "--tw-prose-quotes": theme("colors.ink.700"),
            "--tw-prose-quote-borders": theme("colors.accent.DEFAULT"),
            "--tw-prose-code": theme("colors.ink.900"),
            "--tw-prose-pre-bg": theme("colors.ink.900"),
            "--tw-prose-pre-code": theme("colors.ink.50"),
            maxWidth: "68ch",
            lineHeight: "1.85",
            fontFamily: "var(--font-sans)",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-display)",
              fontWeight: "600",
              letterSpacing: "-0.02em",
              lineHeight: "1.25",
              color: theme("colors.ink.800"),
            },
            h2: {
              marginTop: "3rem",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: `1px solid ${theme("colors.paper.rule")}`,
              fontSize: "1.4em",
              fontWeight: "700",
            },
            h3: { marginTop: "2.25rem", fontSize: "1.15em", fontWeight: "600" },
            a: {
              textDecoration: "underline",
              textDecorationColor: theme("colors.accent.muted"),
              textUnderlineOffset: "3px",
              textDecorationThickness: "1.5px",
              fontWeight: "500",
              transition: "text-decoration-color 0.15s ease",
            },
            "a:hover": {
              textDecorationColor: theme("colors.accent.DEFAULT"),
            },
            // rehype-autolink-headings wraps the heading text in <a class="anchor-link">.
            // Strip prose link styling so headings render as headings, not as links.
            "h1 a, h2 a, h3 a, h4 a, h5 a, h6 a": {
              color: "inherit",
              textDecoration: "none",
              fontWeight: "inherit",
            },
            "h1 a:hover, h2 a:hover, h3 a:hover, h4 a:hover": {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "none",
            },
            // Blockquote = the one italic moment in prose. Serif (Fraunces).
            blockquote: {
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: "400",
              fontSize: "1.1em",
              borderLeftWidth: "2px",
              borderLeftColor: theme("colors.accent.DEFAULT"),
              paddingLeft: "1.25rem",
              color: theme("colors.ink.600"),
              quotes: "none",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            code: {
              fontFamily: "var(--font-mono)",
              fontWeight: "500",
              fontSize: "0.88em",
              backgroundColor: theme("colors.paper.deep"),
              color: theme("colors.accent.deep"),
              padding: "0.12em 0.35em",
              borderRadius: "2px",
              border: `1px solid ${theme("colors.paper.rule")}`,
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            "pre code": {
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              borderRadius: "0",
              color: "inherit",
              fontSize: "0.85em",
              lineHeight: "1.65",
            },
            pre: {
              borderRadius: "3px",
              border: `1px solid ${theme("colors.paper.rule")}`,
            },
            table: {
              fontSize: "0.95em",
            },
            "thead th": {
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: "600",
              color: theme("colors.ink.500"),
              borderBottomColor: theme("colors.ink.900"),
              borderBottomWidth: "2px",
              paddingBottom: "0.6rem",
            },
            "tbody td": {
              borderBottomColor: theme("colors.paper.rule"),
            },
            hr: {
              borderColor: theme("colors.paper.rule"),
              marginTop: "3rem",
              marginBottom: "3rem",
            },
            "figure figcaption": {
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              color: theme("colors.ink.500"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
