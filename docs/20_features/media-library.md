# Media Library

Status: Draft
Owner: 개인 운영자
Last Updated: 2026-05-06
Source of Truth: 관리자 이미지 업로드와 본문 삽입 기능

## 1. Goal

관리자가 `/admin`에서 이미지와 첨부 자산을 업로드하고, 글 본문/cover/OG image에 재사용할 수 있게 한다.

저장소는 Supabase Storage를 사용한다. 공개 글에 필요한 이미지는 public read가 가능해야 하지만, 업로드와 metadata 수정은 관리자만 가능해야 한다.

## 2. Storage Policy

| 항목 | 결정 |
|---|---|
| Bucket | `media` |
| Read | public read |
| Write | admin only |
| Metadata DB | `assets` table |
| Upload path | `media/{yyyy}/{mm}/{asset_id}-{safe_filename}` |

`SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용한다. 브라우저 업로드는 관리자 세션을 확인하는 서버 route 또는 server action을 통해 처리한다.

## 3. Asset Metadata

최소 필드:

- `id`
- `storage_path`
- `public_url`
- `filename`
- `mime_type`
- `size_bytes`
- `width`
- `height`
- `alt`
- `caption`
- `uploaded_by`
- `created_at`
- `updated_at`

## 4. Upload Rules

- 허용 MIME: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- 기본 최대 용량: 5MB
- OG image 후보는 1200x630 비율을 권장한다.
- 본문 이미지는 alt text를 비워두지 않는다.
- 원본 파일명은 표시용으로만 쓰고, storage path에는 안전한 파일명을 사용한다.

## 5. Admin Capabilities

- 이미지 업로드
- 이미지 목록 보기
- 파일명, alt, caption 검색
- alt/caption 수정
- 본문에 이미지 삽입
- cover image로 지정
- OG image로 지정
- 미사용 자산 확인
- 삭제 또는 archive

## 6. Public Rendering Rules

- 공개 글의 이미지는 `next/image` 또는 검증된 image renderer를 사용한다.
- 이미지 width/height를 저장해 layout shift를 줄인다.
- 외부 이미지 hotlink를 기본으로 허용하지 않는다.
- 관리자, preview, draft 화면의 이미지는 검색엔진 색인 대상이 아니다.

## 7. Non-Goals

- 동영상 호스팅
- 대용량 파일 다운로드 센터
- 이미지 유료 라이선스 관리
- AI 이미지 생성 기능
