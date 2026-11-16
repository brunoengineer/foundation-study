import type { Scene } from './types';
import { C } from './types';
import { Flow, Versus } from '../components/SceneKit';
import {
  TechniqueLenses, EpPlayground, EachChoice, BvaLab, BoundaryBugHunt, DecisionTableLab, StateMachineLab,
  CoverageLab, FaultAttackBoard, ChecklistDoctor, StoryInvest, AcFormats, AtddWorkshop,
} from '../diagrams/Ch4';

/* ============================ CHAPTER 4 — Test Analysis and Design ============================ */
export const ch4: Scene[] = [
  /* ---------- 4.1 Overview ---------- */
  {
    chapter: 4, title: 'Three families of test techniques', icon: '🔭', lo: 'FL-4.1.1', ref: '4.1.1',
    story: <>Test techniques help you decide <b>what</b> to test (analysis) and <b>how</b> (design): a relatively <b>small but sufficient</b> set of tests, built systematically, with test conditions, <b>coverage items</b> and test data. The syllabus sorts them into three families by <b>what they are based on</b>: the spec, the code, or the tester's head.</>,
    visual: () => <TechniqueLenses />,
    hook: <>🍽️ Restaurant test: <b>⬛ Black-box</b> reads the <b>MENU</b> (spec) · <b>🔍 White-box</b> walks into the <b>KITCHEN</b> (code) · <b>🧠 Experience</b> asks the <b>CHEF</b> who has cooked for 20 years.</>,
    trap: <>White-box tests can only be created <b>after</b> design/implementation exists; black-box tests can be written from the spec before any code. Experience-based techniques are <b>complementary</b> — they don't replace the other two.</>,
    check: { q: 'The code is completely rewritten, but the required behaviour stays the same. Which tests stay useful without change?', options: ['White-box tests', 'Black-box tests', 'Only experience-based tests', 'None — every test must be redesigned'], answer: 1, why: 'Black-box test cases are independent of how the software is implemented, so they remain useful when only the implementation changes.' },
  },

  /* ---------- 4.2.1 EP ---------- */
  {
    chapter: 4, title: 'Equivalence partitioning: one apple per basket', icon: '🧺', lo: 'FL-4.2.1', ref: '4.2.1',
    story: <>EP splits data into <b>partitions</b> whose elements are expected to be <b>processed the same way</b>. If one value finds a defect, any other value of that partition should too — so <b>one test per partition</b> is enough. Partitions must <b>not overlap</b> and be <b>non-empty</b>, and there are <b>valid</b> and <b>invalid</b> ones. Coverage = partitions exercised ÷ <b>all</b> identified partitions (invalid ones included).</>,
    visual: () => <EpPlayground />,
    hook: <>🧺 Fruit baskets: taste <b>one apple from each basket</b>. Coverage counts <b>baskets</b>, never apples — a 2nd apple from the same basket adds nothing.</>,
    trap: <>Classic distractor: forgetting the <b>invalid</b> partitions in the denominator (3/3 = 100% instead of 3/5 = 60%). Also: partitions exist for <b>any</b> data element — inputs, outputs, configuration, internal and time-related values, interface parameters.</>,
    check: { q: 'A field accepts 1–10 tickets (integers). Partitions: ≤ 0 (invalid), 1–10 (valid), ≥ 11 (invalid). Your tests use 5, 7 and 11. What EP coverage do they reach?', options: ['33%', '67%', '75%', '100%'], answer: 1, why: '3 partitions. 5 and 7 hit the same valid partition (counts once), 11 hits "≥ 11". The "≤ 0" partition is not covered → 2/3 ≈ 67%.' },
  },
  {
    chapter: 4, title: 'Each Choice: every crayon touches the paper', icon: '🎨', lo: 'FL-4.2.1', ref: '4.2.1',
    story: <>Most test items have <b>several parameters</b>, each with its own set of partitions, so <b>one test case covers one partition from every set at once</b>. The simplest criterion is <b>Each Choice</b> coverage: every partition of every set is used at least once. It does <b>not</b> care about combinations. Build the tests yourself 👇</>,
    visual: () => <EachChoice />,
    hook: <>🖍️ Each crayon must touch the paper once. You need as many drawings as the <b>biggest box of crayons</b> — here max(3, 2, 4) = <b>4</b>.</>,
    trap: <>Don't multiply (3 × 2 × 4 = 24 is <b>all combinations</b>, not Each Choice). But read the scenario for <b>constraints</b>: in an official sample question some partitions can only go with one partition of another parameter (e.g. a garden only on the ground floor), which can push the minimum above the largest set.</>,
    check: { q: 'Browser {Chrome, Firefox, Safari}, OS {Windows, macOS}, language {EN, DE, FR, NL}. No constraints. Minimum number of test cases for 100% Each Choice coverage?', options: ['3', '4', '9', '24'], answer: 1, why: 'Each Choice needs every partition at least once; one test can cover one partition per parameter. The largest set (4 languages) sets the minimum: 4 tests. 9 = total partitions, 24 = all combinations.' },
  },

  /* ---------- 4.2.2 BVA ---------- */
  {
    chapter: 4, title: 'Boundary value analysis: 2-value vs 3-value', icon: '🚪', lo: 'FL-4.2.2', ref: '4.2.2',
    story: <>BVA exercises the <b>edges of ordered partitions</b> — because developers love to put boundaries one step too high or too low. A partition's <b>minimum and maximum</b> are its <b>boundary values</b>. In <b>2-value BVA</b> each boundary value has two coverage items: itself and its <b>closest neighbour in the adjacent partition</b>. In <b>3-value BVA</b>: itself and <b>both</b> neighbours. Switch scenarios and modes and watch the items change.</>,
    visual: () => <BvaLab />,
    hook: <>🚪 A doorframe. <b>2-value</b>: stand <b>on</b> the threshold and one step <b>through</b>. <b>3-value</b>: one step <b>before</b>, <b>on</b> it, one step <b>after</b> — for every threshold.</>,
    trap: <>① An open-ended partition (e.g. "≤ 17") has only <b>one</b> boundary value. ② In 3-value BVA, neighbours shared by two boundaries count <b>once</b> (sensor 0–2 °C → 7 items, not 4 × 3 = 12). ③ In 2-value BVA the "neighbour" is itself a boundary value, so items = boundary values. ④ Mind the step: integers → 1, cents → 0.01.</>,
    check: { q: 'Valid input: 18–65 (whole years); everything else is invalid. How many coverage items does 3-value BVA have?', options: ['4', '6', '8', '12'], answer: 2, why: 'Boundary values: 17, 18, 65, 66. 3-value items: 16, 17, 18, 19 and 64, 65, 66, 67 → 8 (shared neighbours counted once). 2-value BVA would have 4; 12 double-counts.' },
  },
  {
    chapter: 4, title: 'Why 3-value BVA catches more', icon: '🕵️', lo: 'FL-4.2.2', ref: '4.2.2',
    story: <>The syllabus' own example: the rule <b>"if (x ≤ 10)"</b> is wrongly coded as <b>"if (x = 10)"</b>. 2-value BVA tests 10 and 11 — both give the expected result, so the defect <b>slips through</b>. 3-value BVA also tests <b>9</b> (a neighbour <i>inside</i> the partition) and the defect pops out. That's why <b>3-value is more rigorous</b>. Try each buggy implementation.</>,
    visual: () => <BoundaryBugHunt />,
    hook: <>🕵️ 3-value BVA sends a <b>spy one step inside the room</b>. If the room has secretly shrunk to just the doorway (x = 10), the spy notices.</>,
    trap: <>Both versions catch a boundary moved by one step (x &lt; 10, x ≤ 11). Some 3-value items are <b>not boundary values</b> (9 and 12 are neighbours). Single-value partitions like {'{20}'} have one value that is both min and max.</>,
    check: { q: 'Partitions (integers): {…, 18, 19}, {20}, {21, 22, …}. Which set of values gives 100% 3-value BVA coverage with the fewest tests?', options: ['19, 20, 21', '18, 19, 20, 21, 22', '18, 20, 22', '19, 21'], answer: 1, why: 'Boundary values: 19, 20, 21 ({20} is its own min and max). 19 → 18, 19, 20; 20 → 19, 20, 21; 21 → 20, 21, 22. Union = 18–22 → 5 values.' },
  },

  /* ---------- 4.2.3 Decision tables ---------- */
  {
    chapter: 4, title: 'Decision tables: explode, cut, merge', icon: '🧮', lo: 'FL-4.2.3', ref: '4.2.3',
    story: <>When <b>combinations of conditions</b> lead to different outcomes (business rules), draw a decision table. <b>Conditions and actions are rows</b>, each <b>column is a decision rule</b>. Notation: <b>T</b>/<b>F</b>, <b>"–"</b> = irrelevant, <b>N/A</b> = infeasible, <b>X</b> = action happens, blank = it doesn't. A full table has <b>2ⁿ</b> columns; <b>delete</b> infeasible ones, <b>merge</b> columns where a condition doesn't matter. Coverage items = <b>feasible columns</b>.</>,
    visual: () => <DecisionTableLab />,
    hook: <>🌳 Every new condition <b>doubles</b> the columns (2ⁿ). Then ✂️ <b>N/A = impossible → cut it</b>; 🔗 <b>"–" = doesn't matter → merge it</b>.</>,
    trap: <>Coverage = exercised ÷ <b>feasible</b> columns — N/A columns never count. Don't confuse <b>"–"</b> (irrelevant) with <b>N/A</b> (infeasible). Bonus: tables expose <b>gaps</b> (a combination matching no column) and <b>contradictions</b> (one combination matching two columns with different actions).</>,
    check: { q: 'A full limited-entry decision table has 4 Boolean conditions; 3 combinations are infeasible. Without merging columns, what is the minimum number of test cases for 100% decision table coverage?', options: ['4', '8', '13', '16'], answer: 2, why: '2⁴ = 16 columns, minus 3 infeasible = 13 feasible columns. Each needs one test case.' },
  },

  /* ---------- 4.2.4 State transitions ---------- */
  {
    chapter: 4, title: 'State transitions: login with lockout', icon: '🚦', lo: 'FL-4.2.4', ref: '4.2.4',
    story: <>A <b>state diagram</b> shows states and <b>valid</b> transitions, triggered by an <b>event</b>, optionally with a <b>guard</b> and an <b>action</b>: <code>event [guard] / action</code>. The equivalent <b>state table</b> (rows = states, columns = events) also shows <b>invalid transitions</b> as empty cells. A test case is a <b>sequence of events</b>. Click arrows or event buttons to build tests and watch the three coverage counters.</>,
    visual: () => <StateMachineLab />,
    hook: <>🚇 Metro map. <b>All states</b> = visit every station. <b>Valid transitions (0-switch)</b> = ride every track. <b>All transitions</b> = also try every locked door — but only <b>one locked door per trip</b>.</>,
    trap: <>All-transitions denominator = <b>every cell of the state table</b> (5 states × 4 events = 20), not just the 8 arrows. Riding the same arrow twice counts <b>once</b>. One invalid transition per test case avoids <b>defect masking</b>. 100% valid transitions ⇒ 100% all states (not vice versa).</>,
    check: { q: 'Login model, starting in Login. Test: wrong PW, wrong PW, correct PW, logout. What VALID TRANSITIONS coverage does it reach?', options: ['40%', '50%', '80%', '100%'], answer: 1, why: 'It travels Login→1 fail, 1 fail→2 fails, 2 fails→Logged in, Logged in→Login = 4 of 8 valid transitions = 50%. (80% is its ALL STATES coverage: 4 of 5 states — Locked is never reached.)' },
  },

  /* ---------- 4.3 White-box ---------- */
  {
    chapter: 4, title: 'Statement testing: the highlighter', icon: '🖍️', lo: 'FL-4.3.1', ref: '4.3.1',
    story: <>In statement testing the coverage items are <b>executable statements</b>. Coverage = statements executed ÷ <b>all executable statements</b>. 100% means every statement — including every defective one — ran at least once. But running a defect doesn't always make it fail: a <b>data-dependent</b> defect (division by zero only when the denominator is 0) can hide, and not all <b>decision logic</b> is tested. Run tests and watch the lines light up.</>,
    visual: () => <CoverageLab focus="statement" />,
    hook: <>🖍️ A highlighter: every <b>executable line</b> must get coloured at least once. Braces and <code>else</code> don't need ink.</>,
    trap: <>Coverage depends on <b>what</b> is executed, not on <b>how many</b> tests: two tests with similar inputs can reach less than one well-chosen test. 100% statement coverage ≠ all defects found and ≠ all branches taken.</>,
    check: { q: 'In the 🎟️ program (8 executable statements) one test runs with age = 8 and member = true. What statement coverage does it reach?', options: ['50%', '75%', '87.5%', '100%'], answer: 2, why: 'It executes read, price = 10, if (age < 12), price = 5, if (member), price = price − 2 and print = 7 of 8. log("no member") is skipped → 87.5%.' },
  },
  {
    chapter: 4, title: 'Branch testing: take every fork', icon: '🛣️', lo: 'FL-4.3.2', ref: '4.3.2',
    story: <>A <b>branch</b> is a transfer of control between two nodes in the <b>control flow graph</b> — <b>unconditional</b> (straight-line code) or <b>conditional</b> (a decision outcome: if true/false, a switch case, loop continue/exit). Coverage = branches exercised ÷ <b>all branches</b>. <b>Branch coverage subsumes statement coverage</b>: 100% branch ⇒ 100% statement, never the other way round. Prove it in the lab.</>,
    visual: () => <CoverageLab focus="branch" />,
    hook: <>🛣️ At every fork take <b>both</b> exits. If you've driven <b>every road</b> you've seen <b>every town</b> (branch ⇒ statement) — but seeing every town doesn't mean you drove every road.</>,
    trap: <>An <code>if</code> without <code>else</code> can execute all its statements while its <b>False</b> branch is never taken. Branches include <b>unconditional</b> ones too. Even 100% branch coverage can miss defects that need a <b>specific path</b>.</>,
    check: { q: 'Code: if (x > 0) { y = 1 } then print(y). One test with x = 5. Which statement is TRUE?', options: ['100% statement and 100% branch coverage', '100% statement coverage, but branch coverage below 100%', 'Branch coverage 100%, statement coverage below 100%', 'Both are below 100%'], answer: 1, why: 'Every statement runs, but the False outcome (x ≤ 0) of the decision is never exercised. Statement 100% does not imply branch 100%.' },
  },
  {
    chapter: 4, title: 'The value of white-box testing', icon: '🔦', lo: 'FL-4.3.3', ref: '4.3.3',
    story: <>White-box techniques look at the <b>entire implementation</b>, so they find defects even when the spec is <b>vague, outdated or incomplete</b>. Their blind spot: a requirement that was <b>never implemented</b> leaves no code to cover — <b>defects of omission</b> slip by. They also work in <b>static testing</b>, and give an <b>objective coverage measure</b> that black-box testing alone cannot.</>,
    visual: () => <Versus cols={[
      { icon: '💪', title: 'Strength', color: 'var(--good)', points: ['Entire software implementation is taken into account', 'Finds defects even when the specification is vague, outdated or incomplete'] },
      { icon: '🕳️', title: 'Weakness', color: 'var(--bad)', points: ['If a requirement is NOT implemented, white-box testing may not detect the resulting defect of omission'] },
      { icon: '📄', title: 'Static use too', color: '#22d3ee', points: ['Dry runs of code', 'Reviewing code not yet ready for execution', 'Pseudocode & high-level / top-down logic modelled as a control flow graph'] },
      { icon: '📏', title: 'Measurement', color: '#ffb703', points: ['Black-box only gives NO measure of actual code coverage', 'White-box coverage is an objective measure', 'Shows which additional tests to write → more confidence in the code'] },
    ]} />,
    hook: <>🔦 A flashlight in a room: it lights up <b>everything that is there</b> — but can't show you the <b>sofa that was never delivered</b>.</>,
    trap: <>"White-box testing detects missing requirements" is the classic <b>wrong</b> option. Also wrong: "white-box needs executable code" — dry runs and reviews count.</>,
    check: { q: 'Which is a WEAKNESS of white-box test techniques?', options: ['They need a complete, up-to-date specification', 'They may not detect defects of omission (requirements never implemented)', 'They cannot be used in static testing', 'They give no objective measure of coverage'], answer: 1, why: 'Based only on the structure of the code, they cannot reveal a requirement that was never implemented. The other three are the opposite of what the syllabus says.' },
  },

  /* ---------- 4.4 Experience-based ---------- */
  {
    chapter: 4, title: 'Error guessing & fault attacks', icon: '🎯', lo: 'FL-4.4.1', ref: '4.4.1',
    story: <><b>Error guessing</b> anticipates errors, defects and failures from what the tester knows: how the app <b>worked in the past</b>, the errors <b>developers tend to make</b>, and failures in <b>similar applications</b>. <b>Fault attacks</b> make it methodical: <b>create or acquire a list</b> of possible errors, defects and failures, then design tests that expose them. Aim at the six target zones.</>,
    visual: () => <FaultAttackBoard />,
    hook: <>🎯 Six zones: <b>I</b>nput · <b>O</b>utput · <b>L</b>ogic · <b>C</b>omputation · <b>I</b>nterfaces · <b>D</b>ata — "<b>I O</b>ften <b>L</b>ose <b>C</b>offee <b>I</b>n <b>D</b>ebugging".</>,
    trap: <>A list of possible <b>failures/errors</b> used to design attacks = <b>error guessing (fault attack)</b>. A list of <b>questions / test conditions</b> to verify = <b>checklist-based</b>. Attack lists come from experience, defect and failure data, or common knowledge about why software fails.</>,
    check: { q: 'A tester collects failures reported for three competing apps and designs tests that try to provoke the same failures in her app. Which technique is this?', options: ['Checklist-based testing', 'Fault attack (error guessing)', 'Exploratory testing session', 'Decision table testing'], answer: 1, why: 'Building a list of possible failures (here from similar applications) and designing tests to cause them is a fault attack, a way to implement error guessing.' },
  },
  {
    chapter: 4, title: 'Exploratory testing: a mission with an oxygen tank', icon: '🧭', lo: 'FL-4.4.2', ref: '4.4.2',
    story: <>In exploratory testing, tests are <b>designed, executed and evaluated at the same time</b> while you <b>learn</b> about the test object. <b>Session-based</b> testing adds structure: a <b>time box</b>, a <b>test charter</b> with test objectives, <b>session sheets</b> and a <b>debriefing</b>. Best when specs are <b>few or inadequate</b> or there's <b>significant time pressure</b>, and to <b>complement</b> formal techniques.</>,
    visual: () => <Flow color={C[4]} items={[
      { icon: '📜', title: 'Charter', sub: 'test objectives', points: ['Contains the test objectives that guide the tester', 'Objectives may be treated as high-level test conditions'] },
      { icon: '⏱️', title: 'Time box', sub: 'defined session', points: ['Exploratory testing performed within a defined time box'] },
      { icon: '🔄', title: 'Design + run + evaluate', sub: 'while learning', points: ['Simultaneously, while learning about the test object', 'Coverage items are identified and exercised during the session', 'Can use other techniques, e.g. equivalence partitioning'] },
      { icon: '📓', title: 'Session sheet', sub: 'logbook', points: ['Documents the steps followed and the discoveries made'] },
      { icon: '🗣️', title: 'Debrief', sub: 'with stakeholders', points: ['Discussion between tester and stakeholders interested in the session results'] },
    ]} />,
    hook: <>🧭 <b>Charter</b> = mission orders · ⏱️ <b>time box</b> = oxygen tank · 📓 <b>session sheet</b> = logbook · 🗣️ <b>debrief</b> = report back to base. Works best with a diver who is experienced, curious, creative and knows the domain.</>,
    trap: <>Exploratory ≠ unstructured or undocumented. It is <b>not</b> the answer when the strategy demands formal techniques or the spec is formal and complete — its rationale is <b>poor specs</b> or <b>time pressure</b>.</>,
    check: { q: 'Which situation is the BEST reason to use exploratory testing?', options: ['The test strategy requires formal black-box techniques', 'Specifications are inadequate and there is significant time pressure', 'The specification is formal and machine-readable', 'Regulations require 100% branch coverage'], answer: 1, why: 'The syllabus names few/inadequate specifications and significant time pressure as the situations where exploratory testing is useful.' },
  },
  {
    chapter: 4, title: 'Checklist-based testing: the pilot\'s list', icon: '✈️', lo: 'FL-4.4.3', ref: '4.4.3',
    story: <>The tester designs, implements and executes tests that cover the <b>test conditions on a checklist</b>. Checklists come from experience, from what matters to the user, or from understanding why software fails. Items are often <b>questions</b>, each <b>checkable separately and directly</b>, for functional and non-functional testing (e.g. Nielsen's 10 usability heuristics). Diagnose the items below.</>,
    visual: () => <ChecklistDoctor />,
    hook: <>✈️ A pilot's pre-flight list: short <b>yes/no questions</b>, each checked on its own. Nobody writes "fly well" on it. Refresh it after every incident, but keep it short.</>,
    trap: <>Not on a checklist: items checked <b>automatically</b>, items better as <b>entry/exit criteria</b>, items that are <b>too general</b>. Entries get <b>less effective over time</b> (developers learn), so update them from defect analysis. High-level lists → more variability: <b>more coverage, less repeatability</b>.</>,
    check: { q: 'High-level checklists are used instead of detailed test cases. What is the likely effect?', options: ['Higher repeatability, lower coverage', 'Some variability: potentially greater coverage but less repeatability', 'The tests become fully automated', 'Defect analysis is no longer needed'], answer: 1, why: 'With high-level checklists, actual testing varies between testers → potentially greater coverage but less repeatability.' },
  },

  /* ---------- 4.5 Collaboration-based ---------- */
  {
    chapter: 4, title: 'User stories: 3 Cs & INVEST', icon: '🗂️', lo: 'FL-4.5.1', ref: '4.5.1',
    story: <>A user story is a feature <b>valuable to a user or purchaser</b>. It has three critical aspects, the <b>3 Cs</b>: <b>Card</b>, <b>Conversation</b>, <b>Confirmation</b>. Format: <i>As a [role], I want [goal], so that I can [business value]</i>, followed by acceptance criteria. Written <b>together</b> (brainstorming, mind mapping) from <b>business, development and testing</b> perspectives. Good stories are <b>INVEST</b>.</>,
    visual: () => <StoryInvest />,
    hook: <>🗂️ The <b>Card</b> on the wall, 💬 the <b>Conversation</b> at the table, ✅ the <b>Confirmation</b> at the finish line. And always <b>INVEST</b> in good stories.</>,
    trap: <><b>Confirmation = acceptance criteria</b> (not the Card). The Conversation can be <b>verbal or documented</b>. If a stakeholder doesn't know how to test a story, it may be unclear, not valuable to them, or they just need help testing.</>,
    check: { q: 'Which of the 3 Cs corresponds to the acceptance criteria?', options: ['Card', 'Conversation', 'Confirmation', 'Collaboration'], answer: 2, why: 'Card = the medium; Conversation = how the software will be used; Confirmation = the acceptance criteria. "Collaboration" is not one of the 3 Cs.' },
  },
  {
    chapter: 4, title: 'Acceptance criteria: movie script or ruler', icon: '🎬', lo: 'FL-4.5.2', ref: '4.5.2',
    story: <>Acceptance criteria are the conditions an implementation must meet to be <b>accepted by stakeholders</b> — in effect the <b>test conditions</b>, usually a result of the <b>Conversation</b>. Two common formats: <b>scenario-oriented</b> (Given/When/Then, as in BDD) and <b>rule-oriented</b> (bullet verification list or input→output table). A <b>custom</b> format is fine if it is well-defined and unambiguous.</>,
    visual: () => <AcFormats />,
    hook: <>🎬 <b>Scenario</b> = a movie script (Given/When/Then). 📏 <b>Rule</b> = a ruler: a list or a table. Five uses — "<b>S</b>ome <b>C</b>lever <b>P</b>eople <b>B</b>ake <b>P</b>ies": <b>S</b>cope · <b>C</b>onsensus · <b>P</b>ositive & negative scenarios · <b>B</b>asis for acceptance tests · <b>P</b>lanning & estimation.</>,
    trap: <>An <b>input→output table</b> is <b>rule-oriented</b>, not scenario-oriented. Given/When/Then is <b>scenario-oriented</b>. Acceptance criteria describe <b>both</b> positive and negative scenarios.</>,
    check: { q: 'Acceptance criteria are written as a table: "order < €50 → shipping €5 | €50–99 → €2 | ≥ €100 → free". Which format is this?', options: ['Scenario-oriented', 'Rule-oriented', 'Use-case-oriented', 'Invalid — acceptance criteria must use Given/When/Then'], answer: 1, why: 'A tabulated input→output mapping is one of the rule-oriented formats. Given/When/Then would be scenario-oriented; custom formats are allowed if unambiguous.' },
  },
  {
    chapter: 4, title: 'ATDD: examples before code', icon: '🧪', lo: 'FL-4.5.3', ref: '4.5.3',
    story: <>ATDD is <b>test-first</b>: test cases exist <b>before</b> the story is implemented, created by people with different perspectives (customers, developers, testers). Step 1: a <b>specification workshop</b> that analyses the story and acceptance criteria and fixes ambiguities. Step 2: derive <b>test cases from the acceptance criteria</b> — <b>positive first</b>, then <b>negative</b>, then <b>non-functional</b>. Cover the whole story, <b>never go beyond it</b>, and <b>no two tests</b> may describe the same characteristic.</>,
    visual: () => <AtddWorkshop />,
    hook: <>😀 → 😈 → 🏎️ : the <b>happy path</b> first, then its <b>evil twin</b>, then the <b>race car</b> (performance, usability). Automated, they become <b>executable requirements</b>.</>,
    trap: <>Order = <b>positive → negative → non-functional</b>. Tests use natural language with preconditions, inputs and postconditions. Techniques from 4.2–4.4 (e.g. BVA) may be used while designing ATDD tests. Anything outside the story (or a duplicate) is out.</>,
    check: { q: 'Story: "As a member, I want to borrow up to 3 e-books at a time." AC: up to 3 loans allowed; a 4th is refused with a message. Following ATDD, which test case should be written FIRST?', options: ['A member with 3 e-books tries to borrow a 4th → refused with message', 'A member with 0 e-books borrows 1 → loan succeeds', 'Borrowing completes in under 2 seconds', 'A non-member can buy a paper book'], answer: 1, why: 'ATDD starts with positive tests (correct behaviour, no errors). Option A is negative (comes next), C is non-functional (last), D goes beyond the story.' },
  },
];
