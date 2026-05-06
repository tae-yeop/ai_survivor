# Phase 5 — Tiptap Editor & Media Library

Status: Deferred by ADR-003
Goal: 현재 MVP에서는 Tiptap/Storage를 실행하지 않는다. 본문은 MDX, 이미지는 repo-local assets로 관리한다.

> Historical plan: 아래 slice들은 ADR-002의 Tiptap + Supabase Storage 경로를 위한 보관 문서다. ADR-003 경로에서는 MDX 컴포넌트와 post-local asset 규칙으로 대체한다.

## Slices

| # | 파일 | 한 줄 |
|---|---|---|
| 5.1 | [slice-5.1-tiptap.md](./slice-5.1-tiptap.md) | Tiptap 기본 에디터 통합 |
| 5.2 | [slice-5.2-storage-upload.md](./slice-5.2-storage-upload.md) | Supabase Storage 업로드 어댑터 |
| 5.3 | [slice-5.3-media-library.md](./slice-5.3-media-library.md) | 미디어 라이브러리 + alt/caption |
| 5.4 | [slice-5.4-rich-blocks.md](./slice-5.4-rich-blocks.md) | 코드 블록 / 임베드 / 표 |

## Reactivation Criteria

- MDX authoring이 표현력이나 미디어 관리에서 병목이 된다.
- 새 ADR에서 editor, storage, upload, sanitization 정책을 다시 정한다.
