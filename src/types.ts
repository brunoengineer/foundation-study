export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6;
export type KLevel = 1 | 2 | 3;
export type ExamSet = 'A' | 'B' | 'C' | 'D';

export interface Option {
  key: string; // 'a' | 'b' | 'c' | 'd' | 'e'
  text: string;
}

export interface Question {
  /** Unique id. Main sample exam questions: "A-1".."A-40", "B-1"... Additional questions of set A: "A-X1".."A-X26" */
  id: string;
  source: 'official' | 'practice';
  /** Which ISTQB sample exam set the question comes from */
  exam?: ExamSet;
  /** True for the "Additional Sample Questions" appendix (not part of the 40-question exam) */
  additional?: boolean;
  /** Question number inside its set, e.g. "7" or "A7" */
  number?: string;
  chapter: ChapterId;
  /** Learning objective, e.g. "FL-4.2.2" */
  lo: string;
  k: KLevel;
  /** CTFL: every question is worth 1 point */
  points: 1;
  /** Optional scenario / context paragraph shown above the stem (keep line breaks with \n) */
  scenario?: string;
  /** Optional list rendered under the scenario (numbered items, roman numerals, matching items, table rows) */
  list?: string[];
  stem: string;
  options: Option[];
  /** Correct option keys. Length 1 = "Select ONE option", 2 = "Select TWO options" */
  correct: string[];
  /** Why each option is right or wrong, keyed by option key */
  explanations: Record<string, string>;
  /** Syllabus section, e.g. "4.2.2" */
  ref: string;
  /** Optional short memory hook shown after answering */
  hook?: string;
}

export interface Flashcard {
  id: string;
  chapter: ChapterId;
  front: string;
  back: string;
  icon?: string;
  keyword?: boolean;
}
