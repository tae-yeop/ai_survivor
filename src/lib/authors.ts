// Author lookup keyed by the `author` slug used in post frontmatter
// (see docs/10_content/CONTENT_MODEL.md).

export interface Author {
  key: string;
  name: string;
  bio: string;
  url?: string;
}

export const AUTHORS: Record<string, Author> = {
  owner: {
    key: 'owner',
    name: 'AI Vibe Lab',
    bio: 'AI 도구와 바이브코딩, 업무 자동화를 직접 실험하고 검증한 결과를 기록한다.',
    url: '/about/',
  },
};

export function getAuthor(key: string): Author {
  return AUTHORS[key] ?? AUTHORS.owner;
}
