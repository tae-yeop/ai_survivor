import type { CategorySlug, Difficulty } from '../content.config';

// Display labels for category slugs — see docs/10_content/CONTENT_MODEL.md §4.
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'ai-tool-review': 'AI 도구 사용기',
  'vibe-coding-lab': '바이브코딩 실험실',
  'ai-workflow-automation': 'AI 업무 자동화',
  'ai-productivity': 'AI 생산성 팁',
  'domain-ai': '전문 영역 적용기',
};

export const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  'ai-tool-review':
    'AI 도구를 실제 업무·개발·학습 문제에 적용해본 후기와 검증 결과.',
  'vibe-coding-lab':
    'AI 코딩 도구로 기능을 직접 만들고 검증한 실험 기록.',
  'ai-workflow-automation':
    '문서, 리서치, 데이터, 반복 업무를 AI로 자동화한 워크플로우.',
  'ai-productivity':
    '툴 조합, 프롬프트, 검증 루틴, 작업 습관에 대한 실용 팁.',
  'domain-ai':
    'PyTorch, 신약개발, 주식 리서치 등 전문 영역에 AI를 적용한 기록.',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '심화',
};

// Convert a free-form tag/tool name to a URL-safe slug. Idempotent for
// already-slugified input. Korean characters are kept as-is and percent-encoded
// by the URL constructor at link time.
export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug as CategorySlug] ?? slug;
}

export function difficultyLabel(value: string): string {
  return DIFFICULTY_LABELS[value as Difficulty] ?? value;
}
