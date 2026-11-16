import type { Scene } from './types';
import { ch1 } from './ch1';
import { ch2 } from './ch2';
import { ch3 } from './ch3';
import { ch4 } from './ch4';
import { ch5 } from './ch5';
import { ch6 } from './ch6';
import { SCENES_PER_CH, TOTAL_SCENES } from '../lib/store';

export type { Scene, Check } from './types';

export const lessons: Scene[] = [...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6];

export const scenesFor = (ch: number) => lessons.filter((s) => s.chapter === ch);
export const sceneKey = (ch: number, idx: number) => `${ch}-${idx}`;

TOTAL_SCENES.value = lessons.length;
SCENES_PER_CH.value = lessons.reduce<Record<number, number>>((acc, s) => { acc[s.chapter] = (acc[s.chapter] ?? 0) + 1; return acc; }, {});
