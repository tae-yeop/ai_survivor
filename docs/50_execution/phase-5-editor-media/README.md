# Phase 5 — Editor & Media

Status: Partially implemented
Last Updated: 2026-05-09

Goal: 운영자가 브라우저에서 MDX 글을 편집하고, 작은 이미지/오디오/문서 asset을 안전하게 삽입할 수 있게 한다.

## Current status

| 영역                               | 상태        | 근거 / 남은 일                                                  |
| ---------------------------------- | ----------- | --------------------------------------------------------------- |
| Rich editor core                   | Implemented | `apps/web/src/components/admin/RichEditor/*`                    |
| Figure/image pipeline              | Implemented | paste/drop/upload, resize/align/caption, `<Figure />`           |
| Audio upload/embed v1              | Implemented | 4MB 이하 업로드, `<AudioEmbed />`, public `<audio controls>`    |
| Document upload/embed v1           | Implemented | 4MB 이하 업로드, `<DocumentEmbed />`, PDF iframe / non-PDF card |
| In-place edit                      | Implemented | `EditOverlay`, `save-action.ts`, SHA conflict guard             |
| R2/video pipeline                  | Backlog     | `R2_*` placeholders only, no active storage runtime             |
| Advanced embed pack                | Backlog     | Vimeo/X/Gist/CodePen/Spotify/OG card 등                         |
| Callout/toast/shortcut/a11y polish | Backlog     | 5.6 성격의 UX polish                                            |

## Active media policy

- GitHub asset upload is for small files only: max 4MB.
- Supported direct upload v1:
  - images: png, jpg/jpeg, webp, gif, avif, svg
  - audio: mp3, wav, m4a, ogg, webm
  - documents: pdf, Markdown/text, Word/PowerPoint/Excel 계열
- Large original files, long videos, and heavy media should use R2/Vercel Blob/YouTube/external URLs after a separate decision.
- Raw `<embed>` remains unsafe; public rendering must go through MDX components.

## Slices

| #   | 파일                                                                 | 현재 해석                               |
| --- | -------------------------------------------------------------------- | --------------------------------------- |
| 5.1 | [slice-5.1-rich-editor-core.md](./slice-5.1-rich-editor-core.md)     | RichEditor foundation. 대부분 구현 완료 |
| 5.2 | [slice-5.2-image-pipeline.md](./slice-5.2-image-pipeline.md)         | Figure/image pipeline. 대부분 구현 완료 |
| 5.3 | [slice-5.3-video-r2-pipeline.md](./slice-5.3-video-r2-pipeline.md)   | Backlog: large video/object storage     |
| 5.4 | [slice-5.4-embed-pack.md](./slice-5.4-embed-pack.md)                 | Backlog: advanced external embeds       |
| 5.5 | [slice-5.5-inplace-editing.md](./slice-5.5-inplace-editing.md)       | In-place edit baseline 구현 완료        |
| 5.6 | [slice-5.6-callout-and-polish.md](./slice-5.6-callout-and-polish.md) | Backlog: polish                         |

## Historical/design docs

- [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md): Phase 5 reactivation design context.
- [`_archive-adr-002/`](./_archive-adr-002/): Supabase/Tiptap historical path. 현재 구현으로 간주하지 않는다.

## Next recommended work

1. Callout block + MDX round-trip
2. Editor toast/error handling cleanup
3. Keyboard shortcut/help modal
4. Advanced URL-only embeds if content need appears
5. R2/video only after large media need is proven
