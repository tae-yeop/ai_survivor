export const CATEGORY_LABELS: Record<string, string> = {
  "ai-tool-review": "AI 도구 사용기",
  "vibe-coding-lab": "바이브코딩 실험실",
  "ai-workflow-automation": "AI 업무 자동화",
  "ai-productivity": "AI 생산성 팁",
  "domain-ai": "전문 영역 적용기",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "ai-tool-review": "직접 써본 AI 도구의 장단점과 사용 환경을 기록합니다.",
  "vibe-coding-lab": "AI 코딩 도구로 실제 제품을 만들며 얻은 시행착오를 정리합니다.",
  "ai-workflow-automation": "반복 업무와 리서치 흐름을 자동화하는 실험을 다룹니다.",
  "ai-productivity": "AI를 생산성 도구로 사용할 때의 체크리스트와 루틴을 정리합니다.",
  "domain-ai": "특정 전문 영역에 AI를 적용한 경험과 한계를 기록합니다.",
};

export function categoryLabel(slug: string) {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => (part[0] ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}
