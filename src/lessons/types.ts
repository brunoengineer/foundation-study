import type { ReactNode } from 'react';
import type { ChapterId } from '../types';

/** A quick retrieval question at the end of each scene (4 options, one correct). */
export interface Check { q: string; options: string[]; answer: number; why: string }

/** One visual lesson "scene". */
export interface Scene {
  chapter: ChapterId;
  title: string;
  icon: string;
  /** Learning objective, e.g. "FL-4.2.1" */
  lo: string;
  /** Syllabus section, e.g. "4.2.1" */
  ref: string;
  /** 2–4 sentence narrative (JSX allowed, use <b> for key terms) */
  story: ReactNode;
  /** The interactive visual. Use SceneKit blocks or a custom diagram component. */
  visual: () => ReactNode;
  /** Vivid mnemonic / mental image */
  hook?: ReactNode;
  /** Common exam pitfall */
  trap?: ReactNode;
  check: Check;
}

/** Chapter accent colors — use these for consistency */
export const C = { 1: '#8b6cff', 2: '#22d3ee', 3: '#ff7a59', 4: '#f72585', 5: '#2ec4b6', 6: '#ffb703' } as const;
