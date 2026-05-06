# Article Workflow

Status: Active
Owner: 개인 운영자
Last Updated: 2026-05-06

## 1. 목표

글은 `articles/`에서 편하게 쓰고, 공개할 글만 `apps/web/content/posts/`로 승격한다. 이렇게 하면 초안과 실제 사이트 노출을 분리할 수 있다.

## 2. 폴더 역할

| 위치                                      | 역할                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| `articles/`                               | 자유 작성, 조사 메모, 아직 구조화되지 않은 글        |
| `apps/web/content/posts/<slug>/index.mdx` | 사이트 빌드가 읽는 글                                |
| `apps/web/public/media/posts/<slug>/`     | 공개 이미지/짧은 영상                                |
| `.artifacts/`                             | 로컬 QA 스크린샷, 원본 자료, 공개하지 않을 임시 파일 |

## 3. 초안 작성

1. `articles/<topic>.md`에 자유롭게 쓴다.
2. 처음에는 frontmatter가 없어도 된다.
3. 조사 링크, rough memo, 긴 원본 이미지/영상 경로를 임시로 적어도 된다.
4. 단, 공개 전에 민감한 값/API key/개인정보가 없는지 확인한다.

## 4. 발행 승격

1. slug를 정한다.
2. `apps/web/content/posts/<slug>/index.mdx`를 만든다.
3. frontmatter를 채운다.
4. 초안 본문을 정리해서 옮긴다.
5. 이미지는 최적화해서 `apps/web/public/media/posts/<slug>/`에 둔다.
6. `status: draft` 상태로 test/build를 돌린다.
7. 공개 직전에 `status: published`로 바꾼다.
8. commit/push한다.

## 5. 이미지 운영

권장:

```text
apps/web/public/media/posts/<slug>/cover.webp
apps/web/public/media/posts/<slug>/screenshot-01.webp
apps/web/public/media/posts/<slug>/diagram-01.svg
```

본문 예:

```mdx
![Vercel 설정 화면](/media/posts/vercel-deploy-settings/screenshot-01.webp)
```

규칙:

- 파일명은 영문 소문자/kebab-case.
- 가능하면 `webp`.
- 큰 원본은 commit하지 않는다.
- 이미지마다 alt text를 쓴다.

## 6. 영상 운영

초기 기준:

- 짧은 데모만 Git에 넣는다.
- 긴 영상은 YouTube/Vimeo 등 영상 플랫폼을 우선한다.
- 직접 파일 호스팅이 필요해지면 Vercel Blob 또는 Cloudflare R2를 검토한다.

Git에 넣어도 되는 예:

- 5~15초 이하
- 최적화된 mp4/webm
- 글 이해에 꼭 필요함
- 파일 크기가 작음

Git에 넣지 않는 예:

- 원본 녹화 파일
- 긴 튜토리얼
- 반복적으로 수정되는 영상
- 썸네일/자막/소스 파일 묶음

## 7. 향후 사이트 로그인 글쓰기

원하는 방향은 “사이트에서 내 계정으로 로그인 → 글 작성 → GitHub commit → Vercel deploy”이다.

이 기능은 현재 MVP가 아니며, 구현 전 `ADR-004`를 확정한다.

초기 구현은 아래 순서가 안전하다.

1. owner-only login
2. 글 목록/새 글 생성
3. Markdown textarea 기반 편집
4. GitHub API로 commit
5. 이미지 upload는 나중에 Vercel Blob/R2로 추가
6. publish는 `status` 변경 + commit으로 처리

## 8. 검증

```powershell
cd apps/web
npm run test
npm run typecheck
npm run build
```

추가 확인:

- draft/scheduled 글이 `/posts`, RSS, sitemap에 나오지 않는가?
- 이미지 경로가 실제 public 파일을 가리키는가?
- `NEXT_PUBLIC_SITE_URL`이 현재 배포 도메인과 맞는가?
