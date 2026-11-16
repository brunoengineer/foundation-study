import type { ExamSet, Question } from '../types';
import { officialA } from './officialA';
import { officialB } from './officialB';
import { officialC } from './officialC';
import { officialD } from './officialD';
import { chapters } from './chapters';
import { shuffle } from '../lib/util';

export const officialSets: Record<ExamSet, Question[]> = {
  A: officialA.filter((q) => !q.additional),
  B: officialB,
  C: officialC,
  D: officialD,
};
export const additionalQuestions: Question[] = officialA.filter((q) => q.additional);
export const allQuestions: Question[] = [...officialA, ...officialB, ...officialC, ...officialD];
export const questionById = new Map(allQuestions.map((q) => [q.id, q]));

/**
 * Build a 40-question mock exam that mirrors the official chapter distribution (8·6·4·11·9·2),
 * spreading picks across learning objectives so every LO tends to be represented.
 */
export function buildMockExam(pool: Question[] = allQuestions): Question[] {
  const picked: Question[] = [];
  for (const ch of chapters) {
    const inCh = shuffle(pool.filter((q) => q.chapter === ch.id));
    const byLo = new Map<string, Question[]>();
    inCh.forEach((q) => byLo.set(q.lo, [...(byLo.get(q.lo) ?? []), q]));
    const los = shuffle([...byLo.keys()]);
    const chosen: Question[] = [];
    let i = 0;
    while (chosen.length < ch.examQuestions && [...byLo.values()].some((v) => v.length)) {
      const list = byLo.get(los[i % los.length])!;
      if (list.length) chosen.push(list.shift()!);
      i++;
    }
    picked.push(...chosen);
  }
  return picked;
}

/** Shuffle option order for practice so you learn content, not letter positions. Keeps keys stable. */
export function withShuffledOptions(q: Question): Question {
  // Matching / list-based option sets ("1C, 2A…", "i and ii") and options that reference other options keep their order
  if (q.list?.length || q.options.some((o) => /\b(all|none|both) of the (above|options)|answers? [a-e]\b/i.test(o.text))) return q;
  return { ...q, options: shuffle(q.options) };
}

export const questionLabel = (q: Question) =>
  q.exam ? `Sample Exam ${q.exam} · ${q.additional ? 'extra ' : '#'}${q.number ?? ''}` : 'Practice';
