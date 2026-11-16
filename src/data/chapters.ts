import type { ChapterId, KLevel } from '../types';

export interface LearningObjective { id: string; k: KLevel; text: string }

export interface Chapter {
  id: ChapterId;
  title: string;
  short: string;
  emoji: string;
  color: string;
  minutes: number;
  maxK: KLevel;
  keywords: string[];
  los: LearningObjective[];
  /** Questions per chapter in every official sample exam (= real exam distribution, 1 point each) */
  examQuestions: number;
  examPoints: number;
  tagline: string;
}

const lo = (id: string, k: KLevel, text: string): LearningObjective => ({ id: `FL-${id}`, k, text });

export const chapters: Chapter[] = [
  {
    id: 1, title: 'Fundamentals of Testing', short: 'Fundamentals', emoji: '🧭', color: '#8b6cff',
    minutes: 180, maxK: 2, examQuestions: 8, examPoints: 8,
    tagline: 'What testing is, why it matters, 7 principles, the test process, roles & skills.',
    keywords: ['coverage', 'debugging', 'defect', 'error', 'failure', 'quality', 'quality assurance', 'root cause', 'test analysis', 'test basis', 'test case', 'test completion', 'test condition', 'test control', 'test data', 'test design', 'test execution', 'test implementation', 'test monitoring', 'test object', 'test objective', 'test planning', 'test procedure', 'test process', 'test result', 'testing', 'testware', 'traceability', 'validation', 'verification'],
    los: [
      lo('1.1.1', 1, 'Identify typical test objectives'),
      lo('1.1.2', 2, 'Differentiate testing from debugging'),
      lo('1.2.1', 2, 'Exemplify why testing is necessary'),
      lo('1.2.2', 1, 'Recall the relation between testing and quality assurance'),
      lo('1.2.3', 2, 'Distinguish between root cause, error, defect, and failure'),
      lo('1.3.1', 2, 'Explain the seven testing principles'),
      lo('1.4.1', 2, 'Explain the different test activities and related tasks'),
      lo('1.4.2', 2, 'Explain the impact of context on the test process'),
      lo('1.4.3', 2, 'Differentiate the testware that supports the test activities'),
      lo('1.4.4', 2, 'Explain the value of maintaining traceability'),
      lo('1.4.5', 2, 'Compare the different roles in testing'),
      lo('1.5.1', 2, 'Give examples of the generic skills required for testing'),
      lo('1.5.2', 1, 'Recall the advantages of the whole team approach'),
      lo('1.5.3', 2, 'Distinguish the benefits and drawbacks of independence of testing'),
    ],
  },
  {
    id: 2, title: 'Testing Throughout the Software Development Lifecycle', short: 'SDLC', emoji: '🔄', color: '#22d3ee',
    minutes: 130, maxK: 2, examQuestions: 6, examPoints: 6,
    tagline: 'SDLC impact, test-first, DevOps, shift left, test levels & types, maintenance.',
    keywords: ['acceptance testing', 'black-box testing', 'component integration testing', 'component testing', 'confirmation testing', 'functional testing', 'integration testing', 'maintenance testing', 'non-functional testing', 'regression testing', 'shift left', 'system integration testing', 'system testing', 'test level', 'test object', 'test type', 'white-box testing'],
    los: [
      lo('2.1.1', 2, 'Explain the impact of the chosen software development lifecycle on testing'),
      lo('2.1.2', 1, 'Recall good testing practices that apply to all software development lifecycles'),
      lo('2.1.3', 1, 'Recall the examples of test-first approaches to development'),
      lo('2.1.4', 2, 'Summarize how DevOps might have an impact on testing'),
      lo('2.1.5', 2, 'Explain shift left'),
      lo('2.1.6', 2, 'Explain how retrospectives can be used as a mechanism for process improvement'),
      lo('2.2.1', 2, 'Distinguish the different test levels'),
      lo('2.2.2', 2, 'Distinguish the different test types'),
      lo('2.2.3', 2, 'Distinguish confirmation testing from regression testing'),
      lo('2.3.1', 2, 'Summarize maintenance testing and its triggers'),
    ],
  },
  {
    id: 3, title: 'Static Testing', short: 'Static Testing', emoji: '🔍', color: '#ff7a59',
    minutes: 80, maxK: 2, examQuestions: 4, examPoints: 4,
    tagline: 'Find defects without running code: reviews, roles, review types.',
    keywords: ['anomaly', 'dynamic testing', 'formal review', 'informal review', 'inspection', 'review', 'static analysis', 'static testing', 'technical review', 'walkthrough'],
    los: [
      lo('3.1.1', 1, 'Recognize types of work products that can be examined by static testing'),
      lo('3.1.2', 2, 'Explain the value of static testing'),
      lo('3.1.3', 2, 'Compare and contrast static testing and dynamic testing'),
      lo('3.2.1', 1, 'Identify the benefits of early and frequent stakeholder feedback'),
      lo('3.2.2', 2, 'Summarize the activities of the review process'),
      lo('3.2.3', 1, 'Recall which responsibilities are assigned to the principal roles when performing reviews'),
      lo('3.2.4', 2, 'Compare and contrast the different review types'),
      lo('3.2.5', 1, 'Recall the factors that contribute to a successful review'),
    ],
  },
  {
    id: 4, title: 'Test Analysis and Design', short: 'Test Techniques', emoji: '🧪', color: '#f72585',
    minutes: 390, maxK: 3, examQuestions: 11, examPoints: 11,
    tagline: 'EP, BVA, decision tables, state transitions, coverage, experience & ATDD.',
    keywords: ['acceptance criteria', 'acceptance test-driven development', 'black-box test technique', 'boundary value analysis', 'branch coverage', 'checklist-based testing', 'collaboration-based test approach', 'coverage', 'coverage item', 'decision table testing', 'equivalence partitioning', 'error guessing', 'experience-based test technique', 'exploratory testing', 'state transition testing', 'statement coverage', 'test technique', 'white-box test technique'],
    los: [
      lo('4.1.1', 2, 'Distinguish black-box, white-box and experience-based test techniques'),
      lo('4.2.1', 3, 'Use equivalence partitioning to derive test cases'),
      lo('4.2.2', 3, 'Use boundary value analysis to derive test cases'),
      lo('4.2.3', 3, 'Use decision table testing to derive test cases'),
      lo('4.2.4', 3, 'Use state transition testing to derive test cases'),
      lo('4.3.1', 2, 'Explain statement testing'),
      lo('4.3.2', 2, 'Explain branch testing'),
      lo('4.3.3', 2, 'Explain the value of white-box testing'),
      lo('4.4.1', 2, 'Explain error guessing'),
      lo('4.4.2', 2, 'Explain exploratory testing'),
      lo('4.4.3', 2, 'Explain checklist-based testing'),
      lo('4.5.1', 2, 'Explain how to write user stories in collaboration with developers and business representatives'),
      lo('4.5.2', 2, 'Classify the different options for writing acceptance criteria'),
      lo('4.5.3', 3, 'Use acceptance test-driven development (ATDD) to derive test cases'),
    ],
  },
  {
    id: 5, title: 'Managing the Test Activities', short: 'Test Management', emoji: '📋', color: '#2ec4b6',
    minutes: 335, maxK: 3, examQuestions: 9, examPoints: 9,
    tagline: 'Planning, estimation, prioritization, risk, monitoring, CM and defect reports.',
    keywords: ['defect management', 'defect report', 'entry criteria', 'exit criteria', 'product risk', 'project risk', 'risk', 'risk analysis', 'risk assessment', 'risk control', 'risk identification', 'risk level', 'risk management', 'risk mitigation', 'risk monitoring', 'risk-based testing', 'test approach', 'test completion report', 'test control', 'test monitoring', 'test plan', 'test planning', 'test progress report', 'test pyramid', 'test strategy', 'testing quadrants'],
    los: [
      lo('5.1.1', 2, 'Exemplify the purpose and content of a test plan'),
      lo('5.1.2', 1, 'Recognize how a tester adds value to iteration and release planning'),
      lo('5.1.3', 2, 'Compare and contrast entry criteria and exit criteria'),
      lo('5.1.4', 3, 'Use estimation techniques to calculate the required test effort'),
      lo('5.1.5', 3, 'Apply test case prioritization'),
      lo('5.1.6', 1, 'Recall the concepts of the test pyramid'),
      lo('5.1.7', 2, 'Summarize the testing quadrants and their relationships with test levels and test types'),
      lo('5.2.1', 1, 'Identify risk level by using risk likelihood and risk impact'),
      lo('5.2.2', 2, 'Distinguish between project risks and product risks'),
      lo('5.2.3', 2, 'Explain how product risk analysis may influence thoroughness and test scope'),
      lo('5.2.4', 2, 'Explain what measures can be taken in response to analyzed product risks'),
      lo('5.3.1', 1, 'Recall metrics used for testing'),
      lo('5.3.2', 2, 'Summarize the purposes, content, and audiences for test reports'),
      lo('5.3.3', 2, 'Exemplify how to communicate the status of testing'),
      lo('5.4.1', 2, 'Summarize how configuration management supports testing'),
      lo('5.5.1', 3, 'Prepare a defect report'),
    ],
  },
  {
    id: 6, title: 'Test Tools', short: 'Tools', emoji: '🛠️', color: '#ffb703',
    minutes: 20, maxK: 2, examQuestions: 2, examPoints: 2,
    tagline: 'Tool types and the benefits & risks of test automation.',
    keywords: ['test automation'],
    los: [
      lo('6.1.1', 2, 'Explain how different types of test tools support testing'),
      lo('6.2.1', 1, 'Recall the benefits and risks of test automation'),
    ],
  },
];

export const chapterById = (id: number) => chapters.find((c) => c.id === id)!;

export const EXAM = {
  questions: 40,
  maxPoints: 40,
  passPoints: 26,
  passPct: 65,
  minutes: 60,
  extraMinutesNonNative: 15,
};
