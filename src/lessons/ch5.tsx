import type { Scene } from './types';
import { C } from './types';
import { Versus, FlipGrid } from '../components/SceneKit';
import {
  BucketSort, TestPlanCrab, MetricsEstimationLab, DelphiPoker, ThreePointCalc, PrioritizationLab, TestPyramid, TestingQuadrants,
  RiskMatrix, RiskThoroughness, RiskResponse, MetricsCockpit, BaselineTimeline, DefectReportBuilder,
} from '../diagrams/Ch356';

export const ch5: Scene[] = [
  /* ---------------- 5.1.1 ---------------- */
  {
    chapter: 5, title: 'The test plan: a crab with seven legs', icon: '🗺️', lo: 'FL-5.1.1', ref: '5.1.1',
    story: <>A <b>test plan</b> describes the <b>test objectives, resources and processes</b> for a test project. Writing it is thinking: it forces testers to confront future challenges — risks, schedules, people, tools, costs, effort. Explore <b>why</b> it exists, then <b>what</b> goes in it, then test yourself: where does each sentence belong?</>,
    visual: () => <TestPlanCrab />,
    hook: <>🦀 <b>CAS-CRAB</b>: <b>C</b>ontext · <b>A</b>ssumptions & constraints · <b>S</b>takeholders · <b>C</b>ommunication · <b>R</b>isk register · <b>A</b>pproach · <b>B</b>udget & schedule.</>,
    trap: <>Concrete test data and expected results of individual test cases are <b>not</b> test plan content — the plan holds test data <b>requirements</b> (official sample C). Entry/exit criteria, metrics, independence and deviations from the strategy all live inside the <b>test approach</b>.</>,
    check: {
      q: 'Which item is typical content of the TEST APPROACH section of a test plan?',
      options: ['Budget and schedule', 'Entry criteria and exit criteria', 'The risk register', 'The concrete input values of each test case'],
      answer: 1,
      why: 'The test approach includes test levels, types, techniques, deliverables, entry & exit criteria, independence, metrics, test data and environment requirements, and deviations from policy/strategy.',
    },
  },

  /* ---------------- 5.1.2 ---------------- */
  {
    chapter: 5, title: 'Telescope vs magnifier: release & iteration planning', icon: '🔭', lo: 'FL-5.1.2', ref: '5.1.2',
    story: <>Iterative SDLCs plan at two zoom levels. <b>Release planning</b> looks ahead to the release and works on the <b>product backlog</b>; it is the basis for the test approach and test plan across all iterations. <b>Iteration planning</b> looks ahead to the end of one iteration and works on the <b>iteration backlog</b>. The tester adds value at both.</>,
    visual: () => <Versus cols={[
      { icon: '🔭', title: 'Release planning', color: C[5], points: [
        'Write TESTABLE user stories & acceptance criteria',
        'Participate in project & quality RISK analyses',
        'ESTIMATE test effort associated with user stories',
        'Determine the TEST APPROACH',
        'PLAN the testing for the release',
      ], foot: 'Defines/re-defines the product backlog; may split large stories into smaller ones.' },
      { icon: '🔍', title: 'Iteration planning', color: '#22d3ee', points: [
        'Participate in DETAILED risk analysis of user stories',
        'Determine the TESTABILITY of user stories',
        'Break user stories down into TASKS (particularly testing tasks)',
        'Estimate test effort for ALL testing tasks',
        'Identify & refine functional and non-functional aspects of the test object',
      ], foot: 'Concerned with the iteration backlog.' },
    ]} />,
    hook: <>🔭 Telescope = <b>whole release</b>: stories, risks, <b>approach</b>, plan. 🔍 Magnifier = <b>one iteration</b>: detailed risks, <b>testability</b>, <b>tasks</b>, task estimates.</>,
    trap: <>Prioritizing user stories is done by the <b>business representative together with the team</b> — not a tester's own contribution (official sample A). "Determine the test approach" = release; "break stories into testing tasks" = iteration.</>,
    check: {
      q: "Which is a tester's contribution to ITERATION planning?",
      options: ['Determining the test approach for the release', 'Breaking down user stories into testing tasks', 'Defining the product backlog', 'Deciding the priority of user stories alone'],
      answer: 1,
      why: 'In iteration planning testers break down user stories into tasks (particularly testing tasks) and estimate effort for them.',
    },
  },

  /* ---------------- 5.1.3 ---------------- */
  {
    chapter: 5, title: 'Gates: entry criteria vs exit criteria', icon: '🚪', lo: 'FL-5.1.3', ref: '5.1.3',
    story: <><b>Entry criteria</b> are the preconditions for <b>starting</b> an activity — skip them and the activity becomes harder, slower, costlier and riskier. <b>Exit criteria</b> define what must be achieved to declare it <b>done</b>. Both are defined per test level. In Agile: <b>Definition of Ready</b> (entry) and <b>Definition of Done</b> (exit). Sort the gate rules.</>,
    visual: () => <BucketSort
      buckets={[
        { id: 'in', icon: '🚪', title: 'Entry criteria (DoR)', sub: 'resources · testware · initial quality', color: C[5] },
        { id: 'out', icon: '🏁', title: 'Exit criteria (DoD)', sub: 'thoroughness measures · yes/no checks', color: '#ffb703' },
      ]}
      items={[
        { text: 'Test environment is available', bucket: 'in', why: 'availability of resources' },
        { text: 'Test data is available', bucket: 'in', why: 'availability of resources' },
        { text: 'Testable requirements / user stories exist', bucket: 'in', why: 'availability of testware' },
        { text: 'All smoke tests have passed', bucket: 'in', why: 'initial quality level of the test object' },
        { text: 'Budget and testers are available', bucket: 'in', why: 'availability of resources' },
        { text: '80% statement coverage achieved', bucket: 'out', why: 'measure of thoroughness (coverage)' },
        { text: 'Fewer than 3 unresolved minor defects', bucket: 'out', why: 'measure of thoroughness' },
        { text: 'Defect density below target', bucket: 'out', why: 'measure of thoroughness' },
        { text: 'All planned tests executed', bucket: 'out', why: 'binary yes/no criterion' },
        { text: 'All regression tests are automated', bucket: 'out', why: 'binary yes/no criterion' },
        { text: 'Static testing has been performed', bucket: 'out', why: 'binary yes/no criterion' },
        { text: 'Budget ran out & stakeholders accepted the risk', bucket: 'out', why: 'running out of time/budget can be a valid exit criterion if stakeholders accept the risk' },
      ]} />,
    hook: <>🚪 Entry asks <b>"Do we have what we NEED?"</b> (resources, testware, initial quality). 🏁 Exit asks <b>"Have we done ENOUGH?"</b> (coverage, defects, yes/no checks). DoR = <b>R</b>eady to start, DoD = <b>D</b>one.</>,
    trap: <>"All smoke tests passed" is an <b>entry</b> criterion (initial quality of the test object). "Budget runs out" <b>can</b> be a valid exit criterion — if stakeholders reviewed and accepted the risk of going live without further testing.</>,
    check: {
      q: 'Which is a typical ENTRY criterion?',
      options: ['Achieved statement coverage of 80%', 'All smoke tests have passed', 'Fewer than five unresolved defects', 'All regression tests are automated'],
      answer: 1,
      why: 'Initial quality level of the test object (e.g., all smoke tests passed) is a typical entry criterion; the others are exit criteria.',
    },
  },

  /* ---------------- 5.1.4 (a) ---------------- */
  {
    chapter: 5, title: 'Estimation lab I: ratios & extrapolation', icon: '📊', lo: 'FL-5.1.4', ref: '5.1.4',
    story: <>Test effort estimation predicts the test work needed to meet the objectives. Every estimate rests on <b>assumptions</b> and has an <b>estimation error</b>; small tasks are estimated more accurately, so <b>decompose</b> big ones. Two <b>metrics-based</b> techniques: <b>ratios</b> from your organization's previous projects, and <b>extrapolation</b> from early measurements in the current project. Play with the numbers.</>,
    visual: () => <MetricsEstimationLab />,
    hook: <>➗ Ratio = <b>look BACK</b> at OLD projects ("dev 3 : test 2"). 📈 Extrapolation = <b>look at THIS</b> project so far ("average of the last 3 iterations"). Both are numbers → <b>metrics-based</b>.</>,
    trap: <>Ratios use <b>historical</b> data from similar projects (your own organization's is best); extrapolation uses data from the <b>current</b> project. When the exam gives several past projects, average the efforts first, then take the ratio (sample B: $90k / $900k = 10% → $80k).</>,
    check: {
      q: 'Historical data shows a development-to-test effort ratio of 5:2. The new project needs 450 person-days of development. What is the estimated test effort?',
      options: ['180 person-days', '225 person-days', '112.5 person-days', '300 person-days'],
      answer: 0,
      why: 'Test = 450 × 2/5 = 180 person-days.',
    },
  },

  /* ---------------- 5.1.4 (b) ---------------- */
  {
    chapter: 5, title: 'Estimation lab II: Wideband Delphi & Planning Poker', icon: '🃏', lo: 'FL-5.1.4', ref: '5.1.4',
    story: <>Now the <b>expert-based</b> family. In <b>Wideband Delphi</b> each expert estimates <b>in isolation</b>. If estimates fall <b>outside the agreed boundaries</b>, the experts discuss, then estimate again — still in isolation — until <b>consensus</b>. <b>Planning Poker</b> is the Agile variant: everyone shows a numbered card at the same time.</>,
    visual: () => <DelphiPoker />,
    hook: <>🏛️ The oracle of <b>Delphi</b> consults several seers, each locked in a <b>separate room</b> 🙈, until the prophecies agree. 🃏 Poker = Delphi with <b>cards</b>, revealed all at once.</>,
    trap: <>Estimates are made <b>individually</b> each round; discussion only happens when deviations exceed the agreed boundaries. Planning Poker is a variant of <b>Wideband Delphi</b> (not of three-point estimation). One member — or the product owner — must not simply overrule the team.</>,
    check: {
      q: 'In Planning Poker the four team members show 5, 8, 21 and 5. What should happen next?',
      options: ['Take the average 9.75 as the final estimate', 'The team discusses the deviating estimates and everyone estimates again', 'Use the highest estimate to be safe', 'The product owner decides the estimate'],
      answer: 1,
      why: 'As in Wideband Delphi, out-of-range estimates are discussed and each member re-estimates, repeating until consensus.',
    },
  },

  /* ---------------- 5.1.4 (c) ---------------- */
  {
    chapter: 5, title: 'Estimation lab III: three-point estimation', icon: '🎯', lo: 'FL-5.1.4', ref: '5.1.4',
    story: <>Also expert-based: give three numbers — most <b>optimistic</b> (a), most <b>likely</b> (m), most <b>pessimistic</b> (b). The final estimate is their weighted mean <b>E = (a + 4m + b) / 6</b>, and you get the measurement error for free: <b>SD = (b − a) / 6</b>. Syllabus example: 6, 9, 18 → <b>10 ± 2</b>. Try the presets from the official sample exams.</>,
    visual: () => <ThreePointCalc />,
    hook: <>🗳️ Six voters: <b>1 optimist + 4 realists + 1 pessimist</b>, divided by 6. The error is the <b>gap between pessimist and optimist, split in 6</b>.</>,
    trap: <>It is <b>not</b> a plain average (a+m+b)/3 — m counts four times. If the numbers are <b>per test case</b>, multiply E by the number of test cases (sample D: (1 + 4·3 + 8)/6 = 3.5 h × 4 = 14 h).</>,
    check: {
      q: 'Three-point estimation: a = 4, m = 10, b = 22 person-hours. What is the result?',
      options: ['12 ± 3 person-hours', '11 ± 3 person-hours', '10 ± 2 person-hours', '11 ± 6 person-hours'],
      answer: 1,
      why: 'E = (4 + 4·10 + 22)/6 = 66/6 = 11; SD = (22 − 4)/6 = 3. (12 is the plain average trap.)',
    },
  },

  /* ---------------- 5.1.5 ---------------- */
  {
    chapter: 5, title: 'Prioritization: who runs first?', icon: '🥇', lo: 'FL-5.1.5', ref: '5.1.5',
    story: <>Test suites are arranged in a <b>test execution schedule</b>. Three common strategies: <b>risk-based</b>, <b>coverage-based</b> (incl. <b>additional coverage</b>), and <b>requirements-based</b>. But <b>dependencies</b> beat priorities: if a high-priority test depends on a low-priority one, the low-priority one runs <b>first</b>. Resources available only in time windows matter too. Build both schedules.</>,
    visual: () => <PrioritizationLab />,
    hook: <>🎯 <b>Priority picks the TARGET, dependencies draw the PATH</b>: get the highest-priority test running as early as possible — its prerequisites go right before it.</>,
    trap: <><b>Additional coverage</b> ≠ highest total coverage: after the first test, count only what is <b>not yet covered</b>. And never schedule a test before the test it depends on, however high its priority.</>,
    check: {
      q: 'TC-A (priority 2, no dependency), TC-B (priority 1, depends on TC-C), TC-C (priority 3, no dependency), TC-D (priority 2, depends on TC-A). 1 = highest. Which test case runs FIRST?',
      options: ['TC-A', 'TC-B', 'TC-C', 'TC-D'],
      answer: 2,
      why: 'TC-B has the highest priority but depends on TC-C, so TC-C must run first. Full order: TC-C, TC-B, TC-A, TC-D.',
    },
  },

  /* ---------------- 5.1.6 ---------------- */
  {
    chapter: 5, title: 'The test pyramid', icon: '🔺', lo: 'FL-5.1.6', ref: '5.1.6',
    story: <>The <b>test pyramid</b> shows that tests have different <b>granularity</b>. It helps the team with <b>test automation</b> and <b>test effort allocation</b>. The higher the layer, the <b>lower the granularity</b>, the <b>lower the isolation</b> and the <b>higher the execution time</b>. Layer names differ by model — toggle them.</>,
    visual: () => <TestPyramid />,
    hook: <>⛰️ A pile of sand and rocks: <b>lots of small, fast grains</b> at the bottom, <b>a few big, slow boulders</b> on top.</>,
    trap: <>The pyramid is about <b>granularity</b> (and how many tests each layer needs) — not about test priorities or coverage criteria (official sample C). The number and naming of layers may differ.</>,
    check: {
      q: 'According to the test pyramid, tests in the HIGHER layers are typically…',
      options: ['more isolated and faster', 'lower in granularity, less isolated and slower', 'more numerous than tests in the lower layers', 'always executed manually'],
      answer: 1,
      why: 'The higher the layer, the lower the test granularity, the lower the isolation and the higher the execution time; usually just a few are needed.',
    },
  },

  /* ---------------- 5.1.7 ---------------- */
  {
    chapter: 5, title: 'Testing quadrants: the 2×2 map', icon: '🧭', lo: 'FL-5.1.7', ref: '5.1.7',
    story: <>Brian Marick's <b>testing quadrants</b> group test levels with test types, activities, techniques and work products in Agile. Two axes: <b>business facing vs technology facing</b>, and <b>support the team</b> (guide development) vs <b>critique the product</b> (measure behavior against expectations). Explore, then place tests yourself.</>,
    visual: () => <TestingQuadrants />,
    hook: <>👔 Business lives <b>upstairs</b>, ⚙️ technology in the <b>basement</b>. The <b>left</b> hand helps (supports), the <b>right</b> hand judges (critiques). Count clockwise from basement-left: <b>Q1</b> code tests → <b>Q2</b> business examples → <b>Q3</b> humans explore → <b>Q4</b> machines stress.</>,
    trap: <><b>Usability</b> is non-functional but sits in <b>Q3</b> — Q4 holds non-functional tests <i>except</i> usability. <b>Smoke tests</b> are Q4, <b>API testing</b> is Q2, component (integration) tests are Q1.</>,
    check: {
      q: 'Which test type belongs to Q3 (business facing, critique the product)?',
      options: ['Component integration tests', 'Usability testing', 'Performance testing', 'API testing'],
      answer: 1,
      why: 'Q3 contains exploratory testing, usability testing and user acceptance testing — user-oriented and often manual.',
    },
  },

  /* ---------------- 5.2.1 ---------------- */
  {
    chapter: 5, title: 'Risk level = likelihood × impact', icon: '🎲', lo: 'FL-5.2.1', ref: '5.2.1',
    story: <>A <b>risk</b> is a potential event, hazard, threat or situation whose occurrence causes an adverse effect. Two attributes: <b>risk likelihood</b> (probability, strictly between 0 and 1) and <b>risk impact</b> (the harm). Together they give the <b>risk level</b> — the higher it is, the more important its treatment. Use the matrix (qualitative) or multiply (quantitative).</>,
    visual: () => <RiskMatrix />,
    hook: <>🎲 × 💥 = ⚠️ — <b>"dice times damage"</b>. A rare catastrophe and a frequent nuisance can end up on the same level.</>,
    trap: <>Never judge by impact alone: a high-impact but unlikely risk can have a <b>lower</b> level than a moderate, likely one. Likelihood is never 0 or 1.</>,
    check: {
      q: 'Risk A: likelihood 0.1, impact €80,000. Risk B: likelihood 0.4, impact €25,000. Using the quantitative approach, which is correct?',
      options: ['Risk A has the higher level (€8,000 vs €10,000)', 'Risk B has the higher level (€10,000 vs €8,000)', 'Both have the same level', 'Risk A, because its impact is higher'],
      answer: 1,
      why: 'Risk level = likelihood × impact: A = 0.1 × 80,000 = 8,000; B = 0.4 × 25,000 = 10,000.',
    },
  },

  /* ---------------- 5.2.2 ---------------- */
  {
    chapter: 5, title: 'Project risk or product risk?', icon: '⚖️', lo: 'FL-5.2.2', ref: '5.2.2',
    story: <><b>Project risks</b> concern the management and control of the project — organizational, people, technical and supplier issues — and hit the <b>schedule, budget or scope</b>. <b>Product risks</b> concern the product's <b>quality characteristics</b> (ISO 25010) and can lead to user dissatisfaction, lost revenue/trust/reputation, damage to third parties, high maintenance costs, help-desk overload, criminal penalties — even injury or death. Sort them.</>,
    visual: () => <BucketSort
      buckets={[
        { id: 'proj', icon: '🏗️', title: 'Project risk', sub: 'hits schedule, budget, scope', color: '#ffb703' },
        { id: 'prod', icon: '📦', title: 'Product risk', sub: 'hits quality characteristics', color: C[5] },
      ]}
      items={[
        { text: 'Test environment delivered 3 weeks late', bucket: 'proj', why: 'organizational issue (delay in deliveries)' },
        { text: 'Inaccurate estimates', bucket: 'proj', why: 'organizational issue' },
        { text: 'Budget cut by 20%', bucket: 'proj', why: 'organizational issue (cost cutting)' },
        { text: 'Testers lack skills for the new tool', bucket: 'proj', why: 'people issue' },
        { text: 'Scope creep', bucket: 'proj', why: 'technical issue' },
        { text: 'Poor tool support', bucket: 'proj', why: 'technical issue' },
        { text: 'Supporting company goes bankrupt', bucket: 'proj', why: 'supplier issue' },
        { text: 'Incorrect interest calculation', bucket: 'prod', why: 'incorrect calculations' },
        { text: 'Missing functionality', bucket: 'prod', why: 'missing or wrong functionality' },
        { text: 'Runtime error at checkout', bucket: 'prod', why: 'runtime errors' },
        { text: 'Inadequate response time', bucket: 'prod', why: 'performance' },
        { text: 'Poor user experience', bucket: 'prod', why: 'usability' },
        { text: 'Security vulnerability', bucket: 'prod', why: 'security' },
        { text: 'Poor architecture', bucket: 'prod', why: 'product quality' },
      ]} />,
    hook: <>🏗️ Project risks = the project manager's <b>OPTS</b>: <b>O</b>rganizational · <b>P</b>eople · <b>T</b>echnical · <b>S</b>upplier. 📦 Product risk = something wrong <b>inside the software</b>.</>,
    trap: <>"Scope creep" and "poor tool support" sound technical but are <b>project</b> risks (technical issues). "Poor architecture" and "inefficient algorithms" are <b>product</b> risks.</>,
    check: {
      q: 'Which of these is a PRODUCT risk?',
      options: ['Delay in delivery of the test environment', 'Shortage of skilled testers', 'Inadequate response time of the system', 'Bankruptcy of a third-party supplier'],
      answer: 2,
      why: 'Product risks relate to quality characteristics, e.g., inadequate response time. The others are project risks.',
    },
  },

  /* ---------------- 5.2.3 ---------------- */
  {
    chapter: 5, title: 'Product risk analysis turns the volume knob', icon: '🎛️', lo: 'FL-5.2.3', ref: '5.2.3',
    story: <>Product risk analysis aims to focus test effort so that the <b>residual product risk</b> is minimized — ideally starting <b>early</b>. It consists of <b>risk identification</b> (a comprehensive list) and <b>risk assessment</b> (categorize, likelihood, impact, level, prioritize, propose handling). Its results shape the <b>thoroughness and scope</b> of testing. Turn the knob.</>,
    visual: () => <RiskThoroughness />,
    hook: <>🎛️ Risk is the <b>volume knob</b>: turn it up and <b>scope, levels & types, techniques & coverage, effort, priority</b> — and maybe extra non-testing activities — all get louder.</>,
    trap: <>Identification = <b>generating the list</b> (brainstorming, workshops, interviews, cause-effect diagrams). Assessment = <b>categorizing, rating likelihood & impact, prioritizing, proposing handling</b>. Categorization helps because risks in the same category can be mitigated similarly.</>,
    check: {
      q: 'Which activity belongs to risk ASSESSMENT rather than risk identification?',
      options: ['Running a brainstorming session to list risks', 'Interviewing stakeholders to collect risks', 'Determining risk likelihood and impact and prioritizing the risks', 'Drawing cause-effect diagrams to generate risks'],
      answer: 2,
      why: 'Risk assessment involves categorization, determining likelihood, impact and level, prioritizing and proposing ways to handle risks.',
    },
  },

  /* ---------------- 5.2.4 ---------------- */
  {
    chapter: 5, title: 'Risk control: fix it, live with it, pass it on, plan B', icon: '🛡️', lo: 'FL-5.2.4', ref: '5.2.4',
    story: <><b>Product risk control</b> = all measures taken in response to analyzed risks: <b>risk mitigation</b> (implement actions to reduce the risk level) and <b>risk monitoring</b> (check mitigation works, improve assessment, spot emerging risks). Response options include <b>mitigation by testing, acceptance, transfer</b> and a <b>contingency plan</b>. Classify each scenario.</>,
    visual: () => <RiskResponse />,
    hook: <>🛠️ <b>Fix it</b> (mitigate) · 🤷 <b>Live with it</b> (accept) · 📤 <b>Pass it on</b> (transfer) · 🅱️ <b>Plan B</b> (contingency). Monitoring = 📡 "Is the medicine working, and is anything new hurting?"</>,
    trap: <>When the scenario proposes concrete <b>test actions</b> (testers with the right skills, independence, reviews/static analysis, techniques & coverage, test types, dynamic & regression testing), it is <b>mitigation by testing</b> — not acceptance or transfer (official sample A).</>,
    check: {
      q: 'For the payment module the team decides to apply boundary value analysis with higher coverage and to involve an independent test team. Which response is this?',
      options: ['Risk acceptance', 'Risk transfer', 'Risk mitigation by testing', 'Contingency plan'],
      answer: 2,
      why: 'Applying appropriate techniques/coverage and a level of independence are listed actions to mitigate product risks by testing.',
    },
  },

  /* ---------------- 5.3 / 5.3.1 ---------------- */
  {
    chapter: 5, title: 'Monitor, control, complete — and the 7 gauges', icon: '📡', lo: 'FL-5.3.1', ref: '5.3.1',
    story: <><b>Test monitoring</b> gathers information about testing; <b>test control</b> uses it to issue <b>control directives</b>; <b>test completion</b> consolidates experience and testware at milestones. The fuel is <b>metrics</b>: progress against schedule and budget, the current quality of the test object, and the effectiveness of test activities. Explore the loop, then sort metrics into their gauges.</>,
    visual: () => <MetricsCockpit />,
    hook: <>🚗 Seven gauges on the dashboard: <b>2 P's, 1 Q, 1 D, 1 R, 2 C's</b> — <b>P</b>roject progress · test <b>P</b>rogress · product <b>Q</b>uality · <b>D</b>efects · <b>R</b>isk · <b>C</b>overage · <b>C</b>ost.</>,
    trap: <><b>Availability, response time, mean time to failure</b> = product quality metrics. <b>Defect density, defect detection percentage</b> = defect metrics. <b>Test effort</b> = project progress. <b>Test execution time</b> = test progress.</>,
    check: {
      q: '"Mean time to failure" is an example of which kind of metric?',
      options: ['Test progress metric', 'Product quality metric', 'Defect metric', 'Coverage metric'],
      answer: 1,
      why: 'Product quality metrics include availability, response time and mean time to failure.',
    },
  },

  /* ---------------- 5.3.2 ---------------- */
  {
    chapter: 5, title: 'Progress report vs completion report', icon: '📰', lo: 'FL-5.3.2', ref: '5.3.2',
    story: <><b>Test progress reports</b> support ongoing <b>test control</b>: produced regularly (daily, weekly…), with enough information to adjust schedule, resources or plan. <b>Test completion reports</b> summarize a finished activity (test level, cycle, iteration), ideally once exit criteria are met, and feed later testing. Audiences shape formality and frequency. Compare, then sort the report contents.</>,
    visual: () => (
      <div>
        <Versus cols={[
          { icon: '📸', title: 'Test progress report', color: '#22d3ee', points: [
            'Purpose: support ongoing test control',
            'During monitoring & control, regularly (daily, weekly…)',
            'Within the team: frequent & informal',
            'ISO/IEC/IEEE 29119-3 calls it a "test status report"',
          ] },
          { icon: '📕', title: 'Test completion report', color: C[5], points: [
            'Purpose: summarize a specific test activity; info for subsequent testing',
            'During test completion — project, level or type complete',
            'Uses test progress reports and other data',
            'Follows a set template, occurs only once',
          ] },
        ]} />
        <div className="mt">
          <BucketSort
            buckets={[
              { id: 'p', icon: '📸', title: 'Progress only', color: '#22d3ee' },
              { id: 'b', icon: '🤝', title: 'Both reports', color: '#8b6cff' },
              { id: 'c', icon: '📕', title: 'Completion only', color: C[5] },
            ]}
            items={[
              { text: 'Testing period', bucket: 'p' },
              { text: 'Ahead / behind schedule, notable deviations', bucket: 'p' },
              { text: 'New and changed risks within the period', bucket: 'p' },
              { text: 'Testing planned for the next period', bucket: 'p' },
              { text: 'Impediments and workarounds', bucket: 'b' },
              { text: 'Test metrics', bucket: 'b' },
              { text: 'Test summary', bucket: 'c' },
              { text: 'Quality evaluation vs original test plan', bucket: 'c', why: 'based on test objectives and exit criteria' },
              { text: 'Deviations from the test plan (schedule, effort)', bucket: 'c' },
              { text: 'Unmitigated risks, defects not fixed', bucket: 'c' },
              { text: 'Lessons learned', bucket: 'c' },
            ]} />
        </div>
      </div>
    ),
    hook: <>📸 Progress report = <b>weather forecast</b>: this period + what's next. 📕 Completion report = <b>yearbook</b>: summary, evaluation against the plan, what's left over, <b>lessons learned</b>.</>,
    trap: <><b>Test metrics</b> and <b>impediments & workarounds</b> appear in <b>both</b>. Only the completion report has <b>lessons learned</b>; only the progress report has <b>testing planned for the next period</b>.</>,
    check: {
      q: 'Which content is typical of a test COMPLETION report but NOT of a test progress report?',
      options: ['Test metrics', 'Impediments and their workarounds', 'Lessons learned', 'Testing planned for the next period'],
      answer: 2,
      why: 'Lessons learned are part of the test completion report; metrics and impediments appear in both; next-period planning is progress-only.',
    },
  },

  /* ---------------- 5.3.3 ---------------- */
  {
    chapter: 5, title: 'Communicating test status: pick the channel', icon: '📢', lo: 'FL-5.3.3', ref: '5.3.3',
    story: <>The best way to communicate status depends on test management concerns, organizational test strategies, regulatory standards — or, in self-organizing teams, on the <b>team itself</b>. You can combine <b>one or more</b> channels and <b>tailor</b> the information to each stakeholder. Flip the cards.</>,
    visual: () => <FlipGrid color={C[5]} min={170} items={[
      { icon: '🗣️', title: 'Verbal', sub: 'team & stakeholders', note: 'Verbal communication with team members and other stakeholders.' },
      { icon: '📊', title: 'Dashboards', sub: 'always visible', note: 'e.g., CI/CD dashboards, task boards and burn-down charts — continuously show progress.' },
      { icon: '💬', title: 'Electronic channels', sub: 'async', note: 'e.g., e-mail, chat.' },
      { icon: '📚', title: 'Online documentation', sub: 'shared pages', note: 'Online documentation the stakeholders can consult.' },
      { icon: '📑', title: 'Formal test reports', sub: 'see 5.3.2', note: 'Test progress reports and test completion reports.' },
      { icon: '🌍', title: 'Distributed team?', sub: 'time zones', note: 'More FORMAL communication may be more appropriate when face-to-face is not always possible (distance, time differences).' },
      { icon: '🎯', title: 'Different stakeholders?', sub: 'different needs', note: 'Different stakeholders want different information → TAILOR the communication.' },
    ]} />,
    hook: <>🚲 → 🚚 Pick the channel like a vehicle: a quick word with the person next to you, a <b>formal report</b> to ship status across time zones.</>,
    trap: <>To show progress <b>continuously within an iteration</b>, a <b>burn-down chart / dashboard</b> wins — a completion report comes too late, and defect reports or acceptance criteria don't show progress (official sample A).</>,
    check: {
      q: 'A team wants to continuously show its work progress within an iteration. What is the BEST means?',
      options: ['A test completion report', 'A burn-down chart on a dashboard', 'Defect reports', 'The acceptance criteria'],
      answer: 1,
      why: 'Dashboards such as burn-down charts are updated continuously and show remaining work over time.',
    },
  },

  /* ---------------- 5.4.1 ---------------- */
  {
    chapter: 5, title: 'Configuration management: sealed snapshots', icon: '🔒', lo: 'FL-5.4.1', ref: '5.4.1',
    story: <><b>Configuration management (CM)</b> identifies, controls and tracks work products — test plans, cases, scripts, results, logs, reports — as <b>configuration items</b>. For a complex item like a test environment it records the parts, relationships and versions. Once approved for testing, it becomes a <b>baseline</b> that changes only via <b>formal change control</b>. A customer just reported a bug — use the timeline.</>,
    visual: () => <BaselineTimeline />,
    hook: <>📸🔒 A baseline is a <b>sealed group photo</b> of every item at one moment. You can always go back to the photo and <b>reproduce</b> what happened then.</>,
    trap: <>Creating a <b>new version</b> of a test script in the repository is <b>configuration management</b> — not traceability (links between <i>different</i> work products) and not maintenance testing (official sample B).</>,
    check: {
      q: 'A customer reports a failure in version 3.1. The team reassembles all files of that release so a developer can reproduce and fix the defect. What enabled this?',
      options: ['Risk management', 'Test monitoring', 'Configuration management', 'The whole team approach'],
      answer: 2,
      why: 'CM keeps versioned, uniquely identified configuration items and baselines, so previous states can be restored and results reproduced.',
    },
  },

  /* ---------------- 5.5.1 ---------------- */
  {
    chapter: 5, title: 'Defect report builder', icon: '🐞', lo: 'FL-5.5.1', ref: '5.5.1',
    story: <>The <b>defect management</b> workflow takes each anomaly from discovery to closure: <b>log → analyze & classify → decide on a response → close</b>. An anomaly may turn out to be a real defect, a false positive or a change request. A good <b>defect report</b> gives the fixer enough information, lets you track work-product quality, and suggests process improvements. Build one, then audit flawed ones.</>,
    visual: () => <DefectReportBuilder />,
    hook: <>🌙 Write it for a <b>stranger at 3 a.m.</b>: <b>ID & title</b> · <b>who/when</b> · <b>where</b> (test object + environment) · <b>context</b> · <b>how</b> (steps, logs) · <b>expected vs actual</b> · <b>how bad</b> (severity) · <b>how urgent</b> (priority) · <b>status</b> · <b>links</b>.</>,
    trap: <><b>Severity</b> = degree of impact; <b>priority</b> = urgency to fix — separate fields. The gap the sample exams love: no <b>test object version / test environment</b>. ID, date, author and initial status can be filled in automatically by tools.</>,
    check: {
      q: 'A defect report contains a title, steps, expected and actual results, severity and priority. Which missing information would MOST help the developer reproduce the failure?',
      options: ['The name of the test manager', 'The test object version and the test environment', 'The total number of defects found so far', 'The cost of fixing the defect'],
      answer: 1,
      why: 'A defect report should identify the test object and test environment; without them the failure often cannot be reproduced.',
    },
  },
];
