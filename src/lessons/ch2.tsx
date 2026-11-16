import type { Scene } from './types';
import { C } from './types';
import { FlipGrid, Versus } from '../components/SceneKit';
import {
  SdlcTimeline, TestFirstTrio, DevOpsLoop, ShiftLeftSlider, TestLevelsStairs, TestTypesExplorer, FixRetestRegress, MaintenanceTriggers,
} from '../diagrams/Ch12';

const c = C[2];

export const ch2: Scene[] = [
  /* ------------------------------------------------------------ 2.1 */
  {
    chapter: 2, title: 'How the SDLC shapes testing', icon: '🗺️', lo: 'FL-2.1.1', ref: '2.1.1',
    story: <>An SDLC model is an abstract, high-level picture of the development process: <b>sequential</b> (waterfall, V-model), <b>iterative</b> (spiral, prototyping) or <b>incremental</b> (Unified Process). Testing must be <b>adapted</b> to it. Compare when static and dynamic testing can happen in each world.</>,
    visual: () => <SdlcTimeline />,
    hook: <>🍽️ <b>Sequential</b> = one big dinner: you taste the food only at the end (dynamic testing late). 🍢 <b>Iterative/incremental</b> = tapas: taste every plate, and re-taste old ones (regression). 🏃 <b>Agile</b> = travel light, automate a lot.</>,
    trap: <>In sequential models testers are <b>still busy early</b>: requirement reviews, test analysis, test design — just <b>not dynamic testing</b>. Agile favors <b>lightweight</b> documentation, <b>extensive</b> automation, and <b>experience-based</b> techniques for manual testing.</>,
    check: { q: 'In a sequential development model, what do testers typically do in the initial phases?', options: ['Execute dynamic system tests', 'Participate in requirement reviews, test analysis and test design', 'Nothing until code is delivered', 'Run automated regression suites on each increment'], answer: 1, why: 'Executable code is created later, so early on testers do reviews, analysis and design; dynamic testing usually can\'t start early.' },
  },
  {
    chapter: 2, title: 'Good practices for ANY lifecycle', icon: '🪞', lo: 'FL-2.1.2', ref: '2.1.2',
    story: <>Whatever SDLC you use, four good testing practices always apply. Each one is a <b>mirror</b>: development and testing reflect each other, at the same time, from the first draft on.</>,
    visual: () => (
      <FlipGrid color={c} min={190} items={[
        { icon: '🪞', title: 'Every dev activity has a test twin', sub: 'mirror', note: 'For every software development activity there is a corresponding test activity → all development activities are subject to quality control.' },
        { icon: '🎚️', title: 'Each test level, its own objectives', sub: 'no overlap', note: 'Different test levels have specific and different test objectives → testing is appropriately comprehensive while avoiding redundancy.' },
        { icon: '⏰', title: 'Analysis & design start with the dev phase', sub: 'early testing', note: 'Test analysis and design for a given test level begins DURING the corresponding development phase → adheres to the principle of early testing.' },
        { icon: '📝', title: 'Review drafts ASAP', sub: 'shift left', note: 'Testers are involved in reviewing work products as soon as DRAFTS are available → earlier defect detection supports shift left.' },
      ]} />
    ),
    hook: <>🪞 <b>Twin</b> · 🎚️ <b>Own goal</b> · ⏰ <b>Same time</b> · 📝 <b>Draft review</b> — "Twins Own Same Drafts".</>,
    trap: <>Test analysis & design begin <b>during</b> the corresponding development phase — not after it ends. Different levels have <b>different</b> objectives (to avoid redundancy), not "the same objectives for consistency".</>,
    check: { q: 'Which is a good testing practice regardless of the SDLC model chosen?', options: ['Testing starts only after all code is complete', 'All test levels share the same objectives', 'For every development activity there is a corresponding test activity', 'Testers review work products only once they are final and approved'], answer: 2, why: 'The mirror practice. Testers review drafts as soon as they exist; test levels have different objectives.' },
  },
  {
    chapter: 2, title: 'Test-first: TDD, ATDD, BDD', icon: '🧭', lo: 'FL-2.1.3', ref: '2.1.3',
    story: <>In these three approaches, <b>tests are defined before the code</b> and used to <b>direct development</b>. That makes them a living example of <b>early testing</b> and <b>shift left</b>, and they support <b>iterative</b> development. Spin the TDD cycle, follow ATDD's flow, and translate a BDD scenario.</>,
    visual: () => <TestFirstTrio />,
    hook: <>🔴 <b>TDD</b> = the coder's compass (test → code → refactor). 🤝 <b>ATDD</b> = acceptance criteria become the contract. 🗣️ <b>BDD</b> = a <b>Given/When/Then</b> story anyone can read.</>,
    trap: <><b>ATDD</b> derives tests from <b>acceptance criteria</b> as part of <b>system design</b>. <b>BDD</b> = natural language (Given/When/Then) that is then <b>automatically translated</b> into executable tests. <b>TDD</b> guides coding <b>instead of extensive software design</b>.</>,
    check: { q: 'Which approach expresses desired behavior in simple natural language (usually Given/When/Then) that is then translated into executable tests?', options: ['Test-driven development', 'Acceptance test-driven development', 'Behavior-driven development', 'Domain-driven design'], answer: 2, why: 'That is BDD. ATDD derives tests from acceptance criteria; TDD writes tests first to direct coding.' },
  },
  {
    chapter: 2, title: 'DevOps and testing', icon: '♾️', lo: 'FL-2.1.4', ref: '2.1.4',
    story: <><b>DevOps</b> is an organizational approach that gets <b>development (including testing)</b> and <b>operations</b> working toward common goals — a <b>cultural shift</b> that treats both with equal value. Through a <b>delivery pipeline</b> with CI/CD, teams build, test and release high-quality code faster. Watch the loop, then compare the 6 benefits and 3 risks.</>,
    visual: () => <DevOpsLoop />,
    hook: <>♾️ The infinity loop melts the wall between Dev and Ops. Benefits = <b>fast, left, stable, visible, less manual, safe</b>. Risks = <b>pipeline, tools, automation cost</b>.</>,
    trap: <>DevOps does <b>not</b> remove manual testing — user-perspective manual testing is <b>still needed</b>. "CI/CD tools must be introduced and maintained" is a <b>risk</b>, not a benefit.</>,
    check: { q: 'Which is a RISK or challenge of DevOps from a testing perspective?', options: ['Increased visibility of non-functional quality characteristics', 'Fast feedback on code quality', 'CI/CD tools must be introduced and maintained', 'Reduced need for repetitive manual testing'], answer: 2, why: 'Introducing and maintaining CI/CD tools is a listed challenge; the others are benefits.' },
  },
  {
    chapter: 2, title: 'Shift left', icon: '⬅️', lo: 'FL-2.1.5', ref: '2.1.5',
    story: <><b>Shift left</b> is another name for the <b>early testing</b> principle: test earlier in the SDLC instead of waiting for code or integrated components. Hit the button and watch five good practices slide left — but notice the <b>ghosts</b>: later testing is <b>not</b> dropped.</>,
    visual: () => <ShiftLeftSlider />,
    hook: <>⬅️ Slide the effort left, leave a 👻 on the right. Pay a little <b>early</b> 💸, save a lot <b>later</b> 💰 — once stakeholders are <b>on board</b> 🤝.</>,
    trap: <>Shift left ≠ "neglect testing later". It can cost <b>extra training, effort or costs early</b>. Non-functional testing at <b>component level</b> is a shift-left practice; "wait for a complete system for NF testing" is the opposite.</>,
    check: { q: 'Which of the following is NOT a good practice for achieving shift left?', options: ['Reviewing the specification from the perspective of testers', 'Writing test cases before the code is written', 'Using CI/CD with automated component tests', 'Postponing all non-functional testing until a complete system and representative environment are available'], answer: 3, why: 'Starting non-functional testing at component level (where possible) is shift left. Postponing it is what shift left tries to avoid.' },
  },
  {
    chapter: 2, title: 'Retrospectives: keep, fix, plan', icon: '🪃', lo: 'FL-2.1.6', ref: '2.1.6',
    story: <>Retrospectives happen at the end of a project or iteration, at a release milestone, or <b>when needed</b>. Participants are <b>not only testers</b>: developers, architects, product owner, business analysts. They ask three questions; the results are <b>recorded</b>, normally in the <b>test completion report</b>, and improvements must be <b>followed up</b>.</>,
    visual: () => (
      <div className="col">
        <Versus cols={[
          { icon: '🌟', title: 'Keep', color: '#34d399', points: ['What was SUCCESSFUL and should be RETAINED?'] },
          { icon: '🔧', title: 'Improve', color: '#fb7185', points: ['What was NOT successful and could be IMPROVED?'] },
          { icon: '🚀', title: 'Plan', color: c, points: ['HOW to incorporate the improvements and retain the successes in the FUTURE?'] },
        ]} />
        <div className="kicker">Typical benefits for testing — flip them</div>
        <FlipGrid color={c} min={160} items={[
          { icon: '📈', title: 'Effectiveness & efficiency', note: 'Increased test effectiveness / efficiency, e.g., by implementing process improvement suggestions.' },
          { icon: '📦', title: 'Better testware', note: 'Increased quality of testware, e.g., by jointly reviewing the test processes.' },
          { icon: '🫂', title: 'Team bonding & learning', note: 'From the opportunity to raise issues and propose improvement points.' },
          { icon: '📄', title: 'Better test basis', note: 'Deficiencies in the extent and quality of the requirements can be addressed and solved.' },
          { icon: '🤝', title: 'Dev–test cooperation', note: 'Collaboration is reviewed and optimized regularly.' },
        ]} />
      </div>
    ),
    hook: <>🪃 A boomerang: lessons fly back into the next iteration. 🌟 <b>Keep</b> · 🔧 <b>Improve</b> · 🚀 <b>Plan</b>. Without follow-up, the boomerang never returns.</>,
    trap: <>Results usually go in the <b>test completion report</b> (not the test plan or a defect report). Retros are critical for <b>continuous improvement</b> — the recommended improvements must be <b>followed up</b>.</>,
    check: { q: 'Where are the results of a retrospective normally recorded?', options: ['In the test plan', 'In the test completion report', 'In the defect reports', 'In the risk register only'], answer: 1, why: 'The syllabus: results should be recorded and are normally part of the test completion report.' },
  },
  /* ------------------------------------------------------------ 2.2 */
  {
    chapter: 2, title: 'Five test levels: from brick to family home', icon: '🏠', lo: 'FL-2.2.1', ref: '2.2.1',
    story: <><b>Test levels</b> are groups of test activities organized and managed together — each one an <b>instance of the test process</b> at a given development stage. In sequential models, one level's exit criteria often form part of the next level's entry criteria; levels may <b>overlap in time</b>. Climb the stairs.</>,
    visual: () => <TestLevelsStairs />,
    hook: <>🧱 a <b>brick</b> → 🧱🔗🧱 the <b>mortar</b> → 🏠 the <b>house</b> → 🏠⚡🌐 the house on the <b>city grid</b> → 👨‍👩‍👧🔑 the <b>family moves in</b>.</>,
    trap: <><b>Component integration</b> = interfaces <i>between components</i> (depends on bottom-up / top-down / big-bang). <b>System integration</b> = interfaces with <i>other systems & external services</i>. Acceptance = <b>validation</b> + readiness for deployment; alpha & beta are <b>forms of acceptance testing</b>.</>,
    check: { q: 'A team tests the interfaces between their system and an external payment service in an environment similar to production. Which test level is this?', options: ['Component integration testing', 'System testing', 'System integration testing', 'Acceptance testing'], answer: 2, why: 'Interfaces of the SUT with other systems and external services → system integration testing.' },
  },
  {
    chapter: 2, title: 'Four test types + the ISO 25010 wheel', icon: '🎡', lo: 'FL-2.2.2', ref: '2.2.2',
    story: <><b>Test types</b> group test activities by quality characteristics; most can be performed at <b>every</b> test level. Two pairs: <b>functional</b> ("what") vs <b>non-functional</b> ("how well"), and <b>black-box</b> (from the spec) vs <b>white-box</b> (from the structure). Spin the ISO 25010 wheel for the 8 non-functional characteristics, then classify.</>,
    visual: () => <TestTypesExplorer />,
    hook: <>⚙️ <b>What</b> vs 🏎️ <b>How well</b>. 📘 <b>Spec</b> vs 🔩 <b>Structure</b>. ISO 8: "<b>P</b>ilots <b>C</b>an <b>U</b>se <b>R</b>eliable <b>S</b>hips <b>M</b>ade <b>P</b>roperly <b>S</b>afe".</>,
    trap: <>New v4 names: Usability = <b>interaction capability</b>, Portability = <b>flexibility</b>, and <b>Safety</b> is now on the list. Non-functional testing can start <b>early</b> (reviews, component tests). White-box is <b>not</b> restricted to component level — all four types apply at <b>all</b> levels.</>,
    check: { q: 'What is the main objective of white-box testing?', options: ['Checking the system\'s behavior against its specifications', 'Covering the underlying structure by the tests to an acceptable level', 'Checking functional completeness, correctness and appropriateness', 'Evaluating the non-functional quality characteristics'], answer: 1, why: 'White-box (structure-based) aims to cover the underlying structure to an acceptable level. Option A is black-box, C functional, D non-functional.' },
  },
  {
    chapter: 2, title: 'Confirmation vs regression testing', icon: '🩹', lo: 'FL-2.2.3', ref: '2.2.3',
    story: <>Changes (a new feature or a fix) call for two kinds of testing. <b>Confirmation testing</b> checks that the <b>original defect</b> is fixed. <b>Regression testing</b> checks that the change caused <b>no adverse consequences</b> elsewhere — in the same component, other components, connected systems, even the environment. Press play and watch the story.</>,
    visual: () => <FixRetestRegress />,
    hook: <>🩹 <b>Confirmation</b>: "Is the <b>hole</b> patched?" 🧱 <b>Regression</b>: "Did the patch <b>crack the wall</b> next door?" Do an <b>impact analysis</b> first to know how far to look.</>,
    trap: <>Regression testing is needed <b>even after</b> the fix passed confirmation. Both are needed at <b>all test levels</b> where defects are fixed or changes are made. Regression suites <b>grow</b> and run often → <b>strong automation candidates</b> (include them in CI).</>,
    check: { q: 'A defect in the payment module was fixed, and the tests that failed now pass. What should be done next to check the fix did not break other parts of the system?', options: ['Confirmation testing', 'Regression testing, ideally scoped by an impact analysis', 'Debugging', 'Acceptance testing only'], answer: 1, why: 'Confirmation testing is already done (the failed tests pass). Regression testing checks for adverse consequences elsewhere; impact analysis helps set its extent.' },
  },
  /* ------------------------------------------------------------ 2.3 */
  {
    chapter: 2, title: 'Maintenance testing & its triggers', icon: '🛠️', lo: 'FL-2.3.1', ref: '2.3.1',
    story: <>Maintenance can be <b>corrective</b>, <b>adaptive</b> to environment changes, or to improve <b>performance or maintainability</b> — via planned releases or unplanned <b>hot fixes</b>. Testing a change to an operational system means checking that the change <b>succeeded</b> <i>and</i> that the <b>unchanged</b> parts (usually most of the system) didn't regress. An <b>impact analysis</b> may even be done <i>before</i> the change, to decide whether to make it. Sort the triggers.</>,
    visual: () => <MaintenanceTriggers />,
    hook: <>🛠️ <b>M</b>odify · 🚚 <b>U</b>pgrade/migrate · 🪦 <b>R</b>etire — old systems <b>MUR</b>mur. Even a funeral 🪦 needs testing: <b>archiving</b> + <b>restore & retrieval</b>.</>,
    trap: <><b>Retirement</b> is a trigger too (data archiving for long retention, restore/retrieval). <b>Migration</b> may need <b>data conversion</b> tests plus tests of the new environment. Scope depends on <b>risk of the change</b>, <b>size of the existing system</b>, <b>size of the change</b>.</>,
    check: { q: 'An application reaches end of life, but its data must be kept for ten years. Which maintenance testing is most relevant?', options: ['Testing data conversion into a new platform', 'Testing data archiving and the restore/retrieval procedures', 'Confirmation testing of hot fixes', 'Component testing of new features'], answer: 1, why: 'Retirement may require testing of data archiving (long retention) and of restore & retrieval procedures.' },
  },
];
