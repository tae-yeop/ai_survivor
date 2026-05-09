export type MonetizedLinkKind = "editorial" | "affiliate" | "sponsored";

export function externalResourceRel(kind: MonetizedLinkKind = "editorial") {
  if (kind === "affiliate" || kind === "sponsored") {
    return "sponsored nofollow noopener noreferrer";
  }

  return "noopener noreferrer";
}

export function monetizationDisclosureLabel(kind: MonetizedLinkKind = "editorial") {
  if (kind === "affiliate") {
    return "제휴 링크";
  }

  if (kind === "sponsored") {
    return "스폰서 링크";
  }

  return "편집상 참고 링크";
}
