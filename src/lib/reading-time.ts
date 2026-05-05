// Reading time estimate. Korean text is character-dense, so we count CJK
// characters separately from latin words and tune both.

const KR_CHARS_PER_MIN = 500; // ~500 한글 글자/분
const EN_WORDS_PER_MIN = 220;

export interface ReadingStats {
  minutes: number;
  words: number;
  chars: number;
}

export function estimateReadingTime(raw: string): ReadingStats {
  if (!raw) return { minutes: 1, words: 0, chars: 0 };
  const text = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const krChars = (text.match(/[ㄱ-힝]/g) ?? []).length;
  const latinWords = (text.match(/[A-Za-z][A-Za-z0-9'-]*/g) ?? []).length;
  const minutes = Math.max(
    1,
    Math.round(krChars / KR_CHARS_PER_MIN + latinWords / EN_WORDS_PER_MIN),
  );
  return { minutes, words: latinWords, chars: krChars + latinWords };
}
