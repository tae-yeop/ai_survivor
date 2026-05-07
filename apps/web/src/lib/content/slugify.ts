const ALLOWED = /[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/u;

export function slugifyTaxonomy(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  let out = "";
  let prevWasHyphen = false;
  for (const ch of trimmed) {
    let next = ch;
    if (/\s/.test(next)) {
      next = "-";
    } else if (/[A-Z]/.test(next)) {
      next = next.toLowerCase();
    }
    if (!ALLOWED.test(next)) continue;
    if (next === "-") {
      if (prevWasHyphen || out.length === 0) continue;
      prevWasHyphen = true;
    } else {
      prevWasHyphen = false;
    }
    out += next;
  }
  return out.replace(/-+$/, "");
}
