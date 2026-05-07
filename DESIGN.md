# AI 시대 생존기 Design Standard

AI 시대 생존기 is a survival journal — tutorials taken end-to-end, with cost, errors, and what was left after they ran. Not a SaaS landing page.

The design should feel like a field report: sharp rules, calm paper, mono metadata, strong Korean headlines, and enough whitespace that the evidence can breathe. If a change makes the site look like a generic AI tools blog, reject it.

## Product promise

Readers come here to understand what happened when real AI tools were used in real workflows.

The interface must make three things obvious:

1. What was tested.
2. Under what context it was tested.
3. What the reader should do next.

## Visual direction

- Surface: cool slate paper, not pure white marketing gloss.
- Ink: near-black editorial text, restrained gray metadata.
- Accent: cinnabar / vermilion as an editorial signature mark, not a decorative gradient. Used only for the wordmark accent word, drop cap, kicker-accent, section §, focus ring, and the existing highlight band. Body links and buttons stay ink-on-paper.
- Shape: square edges by default. Rounded cards are not the brand.
- Rules: horizontal and vertical lines should structure the page like a print spread.
- Motion: subtle reveal is allowed. Motion must never hide content or create layout shift that blocks reading.

## Typography

- Display and body use Pretendard/Noto Sans KR stack.
- Mono metadata uses JetBrains Mono or system monospace.
- Fraunces/serif is reserved for rare editorial moments like drop caps or section symbols.
- Korean headlines must wrap cleanly on 375px screens. Use `break-words`, `min-w-0`, and measured `clamp()` sizing where needed.
- Do not introduce default SaaS font stacks like Inter-only or Roboto-only without a reason.

## Layout rules

### Home

The home page should read as an editorial issue:

1. masthead and promise
2. featured/latest dispatches
3. index paths by category, series, and tool
4. why the site exists / canonical ownership

Section markers are numbered `01 / 03`, `02 / 03`, `03 / 03` after the unnumbered hero. The third section is a restored editorial promise block with three left-aligned chip cards — never a centered icon-feature grid.

Avoid a generic three-card first impression. Cards are allowed only when the card is the interaction. Post lists should usually be editorial rows with a date rail, category, title, description, and tags.

### Post detail

Post pages prioritize reading:

- Keep the article column narrow enough for long Korean text.
- Keep metadata visible but quiet.
- Use table of contents only when it helps orientation.
- Preserve code block horizontal scrolling inside the block, not at document level.
- Tags are secondary. They should not compete with the title or lede.

### Archive

Archive pages must help readers rediscover experiments.

Required affordances:

- category chips or equivalent filters
- search by title, description, tag, category, tool
- explicit empty state when no result matches

## Mobile rules

Mobile is not “desktop stacked.” It is the main reading surface.

- No document-level horizontal overflow at 375px or 390px.
- Header metadata may be hidden before it clips.
- Large stretched-link pseudo elements must not extend beyond the viewport on mobile.
- `pre`, `table`, `iframe`, and media must scroll internally or shrink.
- Touch targets should be at least 44px high for primary navigation and controls.

## Anti-slop blacklist

Reject these patterns unless there is a specific product reason:

- hero followed by three symmetric feature cards
- icon-in-circle feature grids
- purple/blue gradients as personality substitute
- centered everything
- decorative blobs or wave dividers
- repeated rounded cards with the same radius everywhere
- generic copy like “unlock the power of AI”
- colored left-border on cards as visual decoration

## Platform and cross-posting policy

The canonical original lives on this site.

External platforms are distribution channels:

- Hashnode or Velog for developer reach.
- Substack for newsletter and subscriber relationship.
- Medium only for selected republished essays.
- Brunch only for narrative essays, not technical source-of-truth posts.

Every cross-post should point back to the canonical article on `aivibelab.com` (aisurvivor) when possible. Do not design the main site around the limits of external platforms.

## Definition of done for public UI changes

Before shipping public UI changes:

1. Build passes for the target app.
2. 390px mobile screenshots show no horizontal clipping.
3. Desktop first screen still communicates the site promise.
4. Archive/search empty state is tested when touched.
5. The page still looks like AI 시대 생존기, not a template.
