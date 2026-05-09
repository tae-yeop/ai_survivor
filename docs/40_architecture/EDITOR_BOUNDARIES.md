# Editor Boundaries

Status: Active
Last Updated: 2026-05-09

이 문서는 public read surface와 protected writing surface의 경계를 고정한다. 비슷한 서비스를 만들 때도 “공개 렌더링”과 “소유자 쓰기”를 섞지 않는 것이 핵심이다.

## 1. 공개 영역

공개 영역은 방문자, 크롤러, 광고/검색엔진이 접근할 수 있는 읽기 전용 surface다.

| 영역         | 경로                                                | 원칙                                   |
| ------------ | --------------------------------------------------- | -------------------------------------- |
| 홈/목록/상세 | `/`, `/posts`, `/posts/[slug]`                      | published 콘텐츠만 노출                |
| taxonomy     | `/categories/*`, `/tags/*`, `/series/*`, `/tools/*` | public index에는 published 글만 포함   |
| 정책/소개    | `/about`, `/privacy`, `/contact`, `/resources`      | 광고/제휴/문의 신뢰를 위한 공개 페이지 |
| feed/index   | `/rss.xml`, `/sitemap.xml`, `/robots.txt`           | draft/scheduled/archived 제외          |

공개 영역에서는 다음을 금지한다.

- server action으로 콘텐츠를 저장하지 않는다.
- GitHub write token을 노출하지 않는다.
- admin session이 없어도 편집 UI가 노출되도록 만들지 않는다.
- `/admin`, `/write`, `/preview`를 광고 슬롯이나 sitemap에 포함하지 않는다.

## 2. 보호 영역

보호 영역은 owner 계정만 접근하는 writing surface다.

| 영역          | 경로                         | 보호 방식                                     |
| ------------- | ---------------------------- | --------------------------------------------- |
| 관리자 로그인 | `/admin/login`               | GitHub OAuth 설정 필요                        |
| 관리자 목록   | `/admin`                     | `requireAdminSession()`                       |
| 새 글 작성    | `/admin/posts/new`, `/write` | `requireAdminSession()`                       |
| 글 수정       | `/admin/posts/[slug]`        | `requireAdminSession()` + GitHub Contents API |
| admin API     | `/api/admin/*`               | OAuth state/session/token 검증                |

보호 영역의 런타임 원칙:

- `dynamic = "force-dynamic"`와 `runtime = "nodejs"`를 사용해 session/env 의존성을 명확히 한다.
- 저장은 server action에서만 수행한다.
- 저장 대상은 `apps/web/content/posts/<slug>/index.mdx`다.
- GitHub write token은 server-only env에만 둔다.
- 저장 실패 시 public page를 오염시키지 않고 관리자 경로에서 오류를 보여준다.

## 3. In-place edit 경계

In-place edit은 공개 글 상세 화면에서 시작하지만, 실제 편집/저장은 보호 영역 규칙을 따른다.

- 표시 조건: `INPLACE_EDIT_ENABLED`가 false가 아니고 admin session이 확인된 경우에만 edit entry를 보여준다.
- 로딩: client overlay가 `loadInPlace(slug)`를 호출해 편집 가능한 MDX를 불러온다.
- 저장: `savePostInPlaceAction()`은 server action이며 `requireAdminSession()`과 base sha 충돌 검사를 거쳐 GitHub에 저장한다.
- 실패/충돌: conflict 상태를 사용자에게 보여주고 새로고침/재시도를 유도한다.

## 4. 광고/수익화 경계

- 광고 슬롯은 published public content에만 배치한다.
- `/admin`, `/write`, `/preview`, draft/scheduled/archived 콘텐츠에는 광고를 넣지 않는다.
- 제휴/스폰서 링크는 `AffiliateLink` 또는 같은 정책을 쓰는 컴포넌트를 통해 `rel="sponsored nofollow noopener noreferrer"`를 적용한다.
- disclosure는 페이지 상단 또는 링크 주변에 독자가 이해할 수 있게 표시한다.

## 5. 변경 체크리스트

편집 관련 파일을 바꿀 때는 다음을 확인한다.

- [ ] public route에서 GitHub token 또는 admin-only env를 import하지 않는다.
- [ ] 저장 함수는 server action/API route 안에서만 실행된다.
- [ ] public metadata/sitemap/RSS는 published 글만 포함한다.
- [ ] `robots.txt`가 admin/preview 경로를 차단한다.
- [ ] `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`를 통과한다.
