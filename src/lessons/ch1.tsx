import type { Scene } from './types';
import { C } from './types';
import { FlipGrid, Hub, Versus, Secret } from '../components/SceneKit';
import {
  CausalChain, TestDebugLanes, PrinciplesCarousel, TestProcessMap, TestwareSorter, TraceGraph, IndependenceLadder,
} from '../diagrams/Ch12';

const c = C[1];

export const ch1: Scene[] = [
  /* ------------------------------------------------------------ 1.1 */
  {
    chapter: 1, title: 'Testing is more than running tests', icon: '🔭', lo: 'FL-1.1.1', ref: '1.1',
    story: <>Testing is <b>a set of activities to discover defects and evaluate the quality</b> of software work products — the <b>test objects</b>. Two classic misconceptions: that testing is <i>only</i> executing tests, and that it is <i>only</i> verification. In reality it also includes <b>static</b> testing and <b>validation</b>, and it is largely an <b>intellectual</b> activity.</>,
    visual: () => (
      <div className="col">
        <Versus cols={[
          { icon: '📏', title: 'Verification', color: c, points: ['Does the system meet the SPECIFIED REQUIREMENTS?', 'Checks against the documents'], foot: '"Did we build it right?"' },
          { icon: '🧑‍🤝‍🧑', title: 'Validation', color: C[2], points: ['Does the system meet USERS\' and other STAKEHOLDERS\' NEEDS', '…in its OPERATIONAL environment?'], foot: '"Did we build the right thing?"' },
        ]} />
        <Versus cols={[
          { icon: '👓', title: 'Static testing', color: '#ffb703', points: ['Does NOT execute the software', 'Reviews (ch. 3) and static analysis'] },
          { icon: '▶️', title: 'Dynamic testing', color: '#ff7a59', points: ['EXECUTES the software', 'Uses test techniques & approaches to derive test cases (ch. 4)'] },
        ]} />
        <div className="card flat small">
          🧠 Testing is <b>not only technical</b>: it must be planned, managed, estimated, monitored and controlled. Tools help, but testing needs <Secret>specialized knowledge, analytical skills, critical thinking and systems thinking</Secret>.
        </div>
      </div>
    ),
    hook: <>📏 <b>Verification</b> = built it <b>right</b> (vs. spec). 🧑‍🤝‍🧑 <b>Validation</b> = built the <b>right thing</b> (vs. real needs).</>,
    trap: <>"Testing consists only of executing tests" and "testing is only verifying the test object" are <b>misconceptions</b> straight from the syllabus. Reviews are testing too (static).</>,
    check: { q: 'Checking whether a system meets users\' and other stakeholders\' needs in its operational environment is called…', options: ['Verification', 'Debugging', 'Validation', 'Static analysis'], answer: 2, why: 'Validation = meets users\'/stakeholders\' needs in the operational environment. Verification = meets the specified requirements.' },
  },
  {
    chapter: 1, title: 'The nine test objectives', icon: '🎯', lo: 'FL-1.1.1', ref: '1.1.1',
    story: <>Why do we test? The syllabus lists <b>nine typical test objectives</b>. Sort them into four families: <b>FIND</b> problems, <b>MEASURE</b> coverage & risk, <b>CHECK</b> against requirements and needs, and <b>INFORM</b> people. Objectives <b>vary with context</b>: the work product, test level, risks, the SDLC and business factors (corporate structure, competition, time to market).</>,
    visual: () => (
      <FlipGrid color={c} min={170} items={[
        { icon: '🔎', title: 'Evaluate work products', sub: 'FIND', color: '#fb7185', note: 'Evaluating work products such as requirements, user stories, designs and code.' },
        { icon: '💥', title: 'Cause failures & find defects', sub: 'FIND', color: '#fb7185', note: 'Causing failures and finding defects.' },
        { icon: '📏', title: 'Ensure coverage', sub: 'MEASURE', color: '#ffb703', note: 'Ensuring required coverage of a test object.' },
        { icon: '📉', title: 'Reduce risk', sub: 'MEASURE', color: '#ffb703', note: 'Reducing the risk level of inadequate software quality.' },
        { icon: '📋', title: 'Verify requirements', sub: 'CHECK', color: '#22d3ee', note: 'Verifying whether specified requirements have been fulfilled.' },
        { icon: '⚖️', title: 'Verify compliance', sub: 'CHECK', color: '#22d3ee', note: 'Verifying that a test object complies with contractual, legal and regulatory requirements.' },
        { icon: '🧑‍🤝‍🧑', title: 'Validate', sub: 'CHECK', color: '#22d3ee', note: 'Validating whether the test object is complete and works as expected by the stakeholders.' },
        { icon: '📣', title: 'Inform decisions', sub: 'INFORM', color: '#34d399', note: 'Providing information to stakeholders to allow them to make informed decisions.' },
        { icon: '💪', title: 'Build confidence', sub: 'INFORM', color: '#34d399', note: 'Building confidence in the quality of the test object.' },
      ]} />
    ),
    hook: <>🔎 <b>FIND</b> (2) · 📏 <b>MEASURE</b> (2) · ✅ <b>CHECK</b> (3) · 📣 <b>INFORM</b> (2) = 9. "Find, Measure, Check, Inform" — a tester's <b>FMCI</b> radio station 📻.</>,
    trap: <>"<b>Proving</b> the software has no defects" is never an objective (principle 1). Also watch for "fixing defects" — that's debugging, not a test objective.</>,
    check: { q: 'Which of the following is NOT a typical test objective?', options: ['Building confidence in the quality of the test object', 'Proving that no defects remain in the test object', 'Reducing the risk level of inadequate software quality', 'Verifying compliance with legal requirements'], answer: 1, why: 'Testing cannot prove the absence of defects. The other three are listed objectives.' },
  },
  {
    chapter: 1, title: 'Testing vs debugging: smoke alarm & firefighter', icon: '🚨', lo: 'FL-1.1.2', ref: '1.1.2',
    story: <>Testing and debugging are <b>separate activities</b>. <b>Dynamic</b> testing <i>triggers failures</i>; <b>static</b> testing <i>finds defects directly</i>. <b>Debugging</b> then finds, analyzes and removes the cause: <b>reproduce → diagnose → fix</b>. Afterwards, testing comes back with <b>confirmation</b> and <b>regression</b> testing. Step through both lanes.</>,
    visual: () => <TestDebugLanes />,
    hook: <>🚨 Testing is the <b>smoke alarm</b>. 🧑‍🚒 Debugging is the <b>firefighter</b>. 🚨 The alarm is tested again afterwards (confirmation), and the rest of the house is checked (regression).</>,
    trap: <>Debugging is <b>not</b> a testing activity. With static testing there is <b>no reproduction or diagnosis</b> (no failure exists). Confirmation testing is <b>preferably</b> done by the <b>same person</b> who ran the initial test.</>,
    check: { q: 'Which of the following is part of DEBUGGING rather than testing?', options: ['Confirmation testing of a fix', 'Diagnosing the defect that caused a failure', 'Regression testing after a fix', 'Reviewing a requirements specification'], answer: 1, why: 'Debugging = reproduce, diagnose (find the defect), fix. Confirmation/regression testing and reviews are testing.' },
  },
  /* ------------------------------------------------------------ 1.2 */
  {
    chapter: 1, title: 'Why testing is necessary', icon: '🛟', lo: 'FL-1.2.1', ref: '1.2.1',
    story: <>Software that misbehaves can cost <b>money, time, reputation</b> — in extreme cases <b>injury or death</b>. Testing, as a form of <b>quality control</b>, helps reach the agreed objectives within <b>scope, time, quality and budget</b>. Any stakeholder can use testing skills. Its contributions fit on four satellites.</>,
    visual: () => (
      <Hub color={c} center={{ icon: '🛟', title: 'Testing contributes', points: ['A form of quality control', 'Helps achieve agreed objectives within scope, time, quality & budget constraints', 'Not restricted to the test team — any stakeholder can use testing skills'] }} items={[
        { icon: '🔎', title: 'Detect defects', sub: 'cost-effectively', color: '#fb7185', note: 'A cost-effective means of detecting defects. Removing them is debugging (a non-testing activity), so testing contributes INDIRECTLY to higher-quality test objects.' },
        { icon: '📊', title: 'Evaluate quality', sub: 'directly → decisions', color: '#ffb703', note: 'A means of DIRECTLY evaluating quality at various SDLC phases. These measures feed project decisions, e.g., moving to the next phase or the RELEASE decision.' },
        { icon: '👥', title: 'Represent users', sub: 'indirectly', color: '#22d3ee', note: 'Testers give users INDIRECT representation, ensuring their needs are considered throughout the lifecycle. Involving a representative set of real users is usually not possible (high costs, lack of availability).' },
        { icon: '⚖️', title: 'Meet obligations', sub: 'contract · law · regulation', color: '#34d399', note: 'Testing may be required to meet contractual or legal requirements, or to comply with regulatory standards.' },
      ]} />
    ),
    hook: <>🔎 <b>Detect</b> · 📊 <b>Decide</b> · 👥 <b>Delegate-for-users</b> · ⚖️ <b>Duty</b> — the four <b>D</b>s.</>,
    trap: <>Testing improves quality only <b>indirectly</b> (defects are removed by debugging). But it evaluates quality <b>directly</b>. Distractors swap these words.</>,
    check: { q: 'Why do testers provide an "indirect representation" of users?', options: ['Because users are not allowed to see test results', 'Because involving a representative set of users is usually not possible due to high costs and lack of availability', 'Because users only perform acceptance testing', 'Because regulations forbid user involvement'], answer: 1, why: 'The syllabus: the alternative (real representative users) is not usually possible due to high costs and lack of availability of suitable users.' },
  },
  {
    chapter: 1, title: 'Testing (QC) vs Quality Assurance', icon: '🎂', lo: 'FL-1.2.2', ref: '1.2.2',
    story: <>People mix them up, but they differ. <b>Testing</b> is <b>product-oriented</b> and <b>corrective</b> — a major form of <b>quality control</b>. <b>QA</b> is <b>process-oriented</b> and <b>preventive</b>: a good process followed correctly generates a good product. Both use <b>test results</b>, for different purposes.</>,
    visual: () => (
      <Versus cols={[
        { icon: '🔬', title: 'Testing = Quality Control', color: '#ff7a59', points: ['PRODUCT-oriented, CORRECTIVE', 'Supports achieving appropriate levels of quality', 'Other QC forms: formal methods (model checking, proof of correctness), simulation, prototyping', 'Test results → used to FIX DEFECTS'], foot: '🎂 Inspect the cake' },
        { icon: '📜', title: 'Quality Assurance', color: '#2ec4b6', points: ['PROCESS-oriented, PREVENTIVE', 'Implementation & improvement of processes', 'Applies to BOTH development and testing processes', 'Responsibility of EVERYONE on a project', 'Test results → FEEDBACK on how well dev & test processes perform'], foot: '📜 Improve the recipe' },
      ]} />
    ),
    hook: <>🎂 <b>QC tastes the cake</b> (product, after the fact). 📜 <b>QA fixes the recipe</b> (process, before the next cake). <b>C</b>ontrol = <b>C</b>orrective; <b>A</b>ssurance = <b>A</b>head-of-time.</>,
    trap: <>QA is <b>not</b> "what the test team does" — it's <b>everyone's</b> responsibility and covers the <b>test</b> process too. Testing is <b>one</b> form of QC, not the only one.</>,
    check: { q: 'Which statement about testing and QA is correct?', options: ['QA is product-oriented and corrective', 'Testing is process-oriented and preventive', 'QA is process-oriented and preventive, and is the responsibility of everyone on a project', 'Test results are used only by QA, not by testing'], answer: 2, why: 'QA = process-oriented, preventive, everyone\'s responsibility. Testing = product-oriented, corrective. Both use test results.' },
  },
  {
    chapter: 1, title: 'Root cause → error → defect → failure', icon: '🧬', lo: 'FL-1.2.3', ref: '1.2.3',
    story: <>Humans make <b>errors</b> (mistakes), which produce <b>defects</b> (faults, bugs) in work products, which <b>may</b> result in <b>failures</b> when executed. Behind the error hides a <b>root cause</b> — the fundamental reason. Switch stories, execute the code with different inputs, and run root cause analysis.</>,
    visual: () => <CausalChain />,
    hook: <>🌱 The <b>soil</b> (root cause) grows 🧠 a <b>slip</b> (error) that plants 🐛 a <b>bug</b> (defect) that blooms 💥 into a <b>failure</b> — only when the code runs, and maybe only in the right weather.</>,
    trap: <>Testers <b>observe failures</b>; defects are <b>in work products</b>; errors are <b>human</b>. "Time pressure" or "lack of training" is the <b>root cause / reason for the error</b>, not the error itself. And failures can come from the <b>environment</b> (radiation) without any human error.</>,
    check: { q: 'A developer under heavy time pressure misread a requirement and coded a wrong boundary; customers aged exactly 65 were charged wrongly. What is the "heavy time pressure"?', options: ['The error', 'The defect', 'The failure', 'The root cause'], answer: 3, why: 'Time pressure is the fundamental reason that led to the error (the misreading). The wrong boundary in code is the defect; the wrong charge is the failure.' },
  },
  /* ------------------------------------------------------------ 1.3 */
  {
    chapter: 1, title: 'The seven testing principles', icon: '7️⃣', lo: 'FL-1.3.1', ref: '1.3',
    story: <>Seven general guidelines apply to all testing. Each one gets a <b>picture</b> and a <b>toy</b>: a flashlight, an exploding calculator, a cost curve, a heat map, worn-out boots, a context switch, and a perfectly verified product nobody wants. Play with each, then say the principle out loud.</>,
    visual: () => <PrinciplesCarousel />,
    hook: <>Memory walk through your house: 🔦 flashlight at the door → ♾️ infinity mirror in the hall → ⏰ alarm clock in the bedroom → 🍇 grapes in the kitchen → 🥾 worn boots by the stairs → 🌍 globe in the study → 🪤 mousetrap in the cellar.</>,
    trap: <>v4.0 renamed the pesticide paradox to <b>"tests wear out"</b> — with the exception that repetition is <b>beneficial</b> for automated regression. "Exhaustive testing is impossible" has an exception: <b>trivial cases</b>. The absence-of-defects <b>fallacy</b> is about needing <b>validation</b>, not more verification.</>,
    check: { q: 'The same regression suite has run unchanged for two years, finds no new defects, yet users keep reporting new bugs. Which principle applies?', options: ['Defects cluster together', 'Tests wear out', 'Absence-of-defects fallacy', 'Exhaustive testing is impossible'], answer: 1, why: 'Repeating the same tests makes them increasingly ineffective at finding new defects → modify tests/data and write new ones.' },
  },
  /* ------------------------------------------------------------ 1.4 */
  {
    chapter: 1, title: 'The test process: 7 activity groups', icon: '🔄', lo: 'FL-1.4.1', ref: '1.4.1',
    story: <>A test process groups activities: <b>planning</b>, <b>monitoring & control</b>, <b>analysis</b> ("<b>what</b> to test?"), <b>design</b> ("<b>how</b> to test?"), <b>implementation</b>, <b>execution</b> and <b>completion</b>. They look sequential but are often <b>iterative or parallel</b>, and tailored to the system and project. Click each activity for its tasks.</>,
    visual: () => <TestProcessMap initial="tasks" />,
    hook: <>🗺️ <b>P</b>lan · 📡 <b>M</b>onitor · 🔍 <b>A</b>nalyze · 📐 <b>D</b>esign · 🧰 <b>I</b>mplement · ▶️ <b>E</b>xecute · 🏁 <b>C</b>omplete → "<b>P</b>lease <b>M</b>ake <b>A</b> <b>D</b>elicious <b>I</b>talian <b>E</b>spresso, <b>C</b>hef". Analysis = <b>WHAT</b>, Design = <b>HOW</b>.</>,
    trap: <>Test <b>conditions</b> → analysis; test <b>cases</b> & coverage items → design; procedures, suites, scripts, execution schedule, <b>building</b> the environment → implementation. <b>Analyzing anomalies</b> happens in execution. Archiving testware & lessons learned → completion.</>,
    check: { q: 'In which activity are test conditions elaborated into test cases, coverage items identified and test data requirements defined?', options: ['Test analysis', 'Test design', 'Test implementation', 'Test execution'], answer: 1, why: 'Test design answers "how to test?": test cases, coverage items, test data requirements, test environment design.' },
  },
  {
    chapter: 1, title: 'Test process in context', icon: '🎛️', lo: 'FL-1.4.2', ref: '1.4.2',
    story: <>Testing is <b>not performed in isolation</b>: it is part of the organization's development processes, funded by stakeholders to fulfill their business needs. So <b>eight contextual factors</b> shape how testing is done — and they change the strategy, techniques, automation, coverage, testware detail and reporting.</>,
    visual: () => (
      <Hub color={c} center={{ icon: '🧪', title: 'How we test', points: ['Test strategy', 'Test techniques used', 'Degree of test automation', 'Required level of coverage', 'Level of detail of testware', 'Test reporting'] }} items={[
        { icon: '🤝', title: 'Stakeholders', note: 'Needs, expectations, requirements, willingness to cooperate.' },
        { icon: '👥', title: 'Team members', note: 'Skills, knowledge, level of experience, availability, training needs.' },
        { icon: '🏦', title: 'Business domain', note: 'Criticality of the test object, identified risks, market needs, specific legal regulations.' },
        { icon: '⚙️', title: 'Technical', note: 'Type of software, product architecture, technology used.' },
        { icon: '⏳', title: 'Project constraints', note: 'Scope, time, budget, resources.' },
        { icon: '🏢', title: 'Organizational', note: 'Organizational structure, existing policies, practices used.' },
        { icon: '🔄', title: 'SDLC', note: 'Engineering practices, development methods.' },
        { icon: '🧰', title: 'Tools', note: 'Availability, usability, compliance.' },
      ]} />
    ),
    hook: <>8 dials on the mixing desk 🎛️: "<b>S</b>ome <b>T</b>eams <b>B</b>uild <b>T</b>ests <b>P</b>urely <b>O</b>n <b>S</b>olid <b>T</b>ools" = Stakeholders, Team, Business domain, Technical, Project constraints, Organizational, SDLC, Tools.</>,
    trap: <>The <b>center</b> (strategy, techniques, automation, coverage, testware detail, reporting) is what is <b>impacted</b>; the satellites are the <b>factors</b>. Distractors swap them ("degree of automation is a contextual factor").</>,
    check: { q: 'Which of the following is a contextual factor that influences the test process?', options: ['The level of detail of the testware', 'The team members\' skills, experience and availability', 'The test reporting format', 'The required level of coverage'], answer: 1, why: 'Team members (skills, knowledge, experience, availability, training needs) is a factor. The other three are things the factors impact.' },
  },
  {
    chapter: 1, title: 'Testware: what each activity leaves behind', icon: '📦', lo: 'FL-1.4.3', ref: '1.4.3',
    story: <><b>Testware</b> = the output work products of the test activities. Organizations name and shape them differently; <b>configuration management</b> keeps them consistent. Browse the testware per activity, then play the sorting game until it's automatic.</>,
    visual: () => (
      <div className="col">
        <TestProcessMap initial="ware" />
        <TestwareSorter />
      </div>
    ),
    hook: <>📐 Design writes the <b>shopping list</b> (test data <i>requirements</i>, environment <i>requirements</i>). 🧰 Implementation goes <b>shopping</b> (the actual test data, stubs, drivers, simulators, service virtualization).</>,
    trap: <><b>Defect reports</b> appear twice: in <b>analysis</b> (defects in the test basis) and in <b>execution</b>. The <b>test schedule</b> is planning; the <b>test execution schedule</b> is implementation. <b>Change requests</b> are a completion product.</>,
    check: { q: 'Stubs, drivers, simulators and service virtualizations are work products of which activity?', options: ['Test design', 'Test planning', 'Test implementation', 'Test execution'], answer: 2, why: 'They are test environment items, created in test implementation. Design only specifies test environment requirements.' },
  },
  {
    chapter: 1, title: 'Traceability: pull one thread, see the web', icon: '🕸️', lo: 'FL-1.4.4', ref: '1.4.4',
    story: <>For effective monitoring & control, keep <b>traceability</b> between <b>test basis</b> elements, associated testware (<b>test conditions, risks, test cases</b>), <b>test results</b> and <b>defects</b>. Click any box to trace it upstream and downstream, or ask the graph the four classic questions.</>,
    visual: () => <TraceGraph />,
    hook: <>📿 A string of pearls: pull <b>any</b> pearl and you feel the whole string move. Cases→requirements = <b>coverage</b>. Results→risks = <b>residual risk</b>.</>,
    trap: <>Traceability's value list: coverage evaluation, <b>impact of changes</b>, <b>audits</b>, <b>IT governance</b>, understandable progress/completion reports, and assessing product quality, process capability and project progress. It does <b>not</b> "prevent defects" or "replace test management".</>,
    check: { q: 'What can traceability of test results to risks be used for?', options: ['To evaluate the level of residual risk in a test object', 'To generate test cases automatically', 'To prove the test object contains no defects', 'To decide on the SDLC model'], answer: 0, why: 'The syllabus example: traceability of test results to risks evaluates the level of residual risk.' },
  },
  {
    chapter: 1, title: 'Two roles: test management vs testing', icon: '🎭', lo: 'FL-1.4.5', ref: '1.4.5',
    story: <>The syllabus covers two principal <b>roles</b> (not job titles). The <b>test management role</b> owns the test process, team and leadership — the <b>bookends</b>: planning, monitoring, control, completion. The <b>testing role</b> owns the <b>engineering</b> side — the <b>middle</b>: analysis, design, implementation, execution.</>,
    visual: () => <TestProcessMap initial="roles" />,
    hook: <>🧭 The <b>captain</b> holds the bookends (plan … complete) and the steering wheel (monitor & control). 🔧 The <b>engineer</b> does the engine room in between.</>,
    trap: <>A role ≠ a person: a team leader, test manager or <b>development manager</b> may play test management, and <b>one person can hold both roles</b>. In Agile, some management tasks can be handled by the <b>Agile team</b>.</>,
    check: { q: 'Which activity is MAINLY the focus of the testing role?', options: ['Test planning', 'Test control', 'Test design', 'Test completion'], answer: 2, why: 'The testing role focuses on analysis, design, implementation and execution. The others are the test management role\'s focus.' },
  },
  /* ------------------------------------------------------------ 1.5 */
  {
    chapter: 1, title: 'Generic skills of a good tester', icon: '🧰', lo: 'FL-1.5.1', ref: '1.5.1',
    story: <>Skill = ability from knowledge, practice and aptitude. Six generic skills matter especially for testers. And because testers are often the <b>bearers of bad news</b>, <b>communication</b> is crucial: results may feel like criticism of the product <i>and its author</i>, and <b>confirmation bias</b> makes unwelcome information hard to accept.</>,
    visual: () => (
      <div className="col">
        <FlipGrid color={c} min={170} items={[
          { icon: '📚', title: 'Testing knowledge', sub: '→ effectiveness', note: 'To increase EFFECTIVENESS of testing, e.g., by using test techniques.' },
          { icon: '🔍', title: 'Thorough & curious', sub: '→ hard-to-find defects', note: 'Thoroughness, carefulness, curiosity, attention to detail, being methodical — to identify defects, especially the difficult ones.' },
          { icon: '🗣️', title: 'Communication', sub: '→ stakeholders', note: 'Good communication, active listening, team player — to interact with all stakeholders, convey information, be understood, report and discuss defects.' },
          { icon: '🧠', title: 'Analytical & creative', sub: '→ effectiveness', note: 'Analytical thinking, critical thinking, creativity — to increase EFFECTIVENESS of testing.' },
          { icon: '🛠️', title: 'Technical knowledge', sub: '→ efficiency', note: 'To increase EFFICIENCY of testing, e.g., by using appropriate test tools.' },
          { icon: '🏦', title: 'Domain knowledge', sub: '→ users & business', note: 'To understand and communicate with end users / business representatives.' },
        ]} />
        <div className="card flat small">📨 <b>Bad news, delivered well:</b> <Secret>some see testing as destructive, though it contributes greatly to project success and product quality → communicate information about defects and failures in a CONSTRUCTIVE way.</Secret></div>
      </div>
    ),
    hook: <>🛠️ <b>Tools → efficiency</b> (faster). 📚🧠 <b>Techniques & thinking → effectiveness</b> (better). 🏦 <b>Domain → talk to users</b>.</>,
    trap: <>Exam pairs: technical knowledge ↔ <b>efficiency</b>; testing knowledge / analytical thinking ↔ <b>effectiveness</b>. Communication is crucial because of <b>bearer-of-bad-news</b> + <b>confirmation bias</b>.</>,
    check: { q: 'According to the syllabus, which skill primarily increases the EFFICIENCY of testing?', options: ['Domain knowledge', 'Curiosity and attention to detail', 'Technical knowledge, e.g., using appropriate test tools', 'Active listening'], answer: 2, why: 'Technical knowledge increases efficiency (e.g., appropriate tools). Testing knowledge and analytical thinking increase effectiveness.' },
  },
  {
    chapter: 1, title: 'The whole team approach', icon: '🚣', lo: 'FL-1.5.2', ref: '1.5.2',
    story: <>A practice from <b>Extreme Programming (XP)</b>: <b>anyone</b> with the necessary knowledge and skills can do <b>any task</b>, and <b>everyone is responsible for quality</b>. The team shares a workspace (physical or virtual). Testers help business reps write acceptance tests and agree test strategy and automation with developers.</>,
    visual: () => (
      <Hub color={c} center={{ icon: '🚣', title: 'Whole team', points: ['Improves team dynamics', 'Enhances communication & collaboration', 'Creates synergy: various skill sets leveraged for the project'] }} items={[
        { icon: '🔄', title: 'Anyone, any task', note: 'Any team member with the necessary knowledge and skills can perform any task.' },
        { icon: '🎯', title: 'Shared quality', note: 'Everyone is responsible for quality.' },
        { icon: '🏠', title: 'Shared workspace', note: 'Physical or virtual co-location facilitates communication and interaction.' },
        { icon: '💼', title: 'With business', note: 'Testers help business representatives create suitable acceptance tests.' },
        { icon: '🧑‍💻', title: 'With developers', note: 'Testers agree on the test strategy and decide on test automation approaches with developers → transfer testing knowledge, influence the product.' },
        { icon: '⚠️', title: 'Not always', color: '#fb7185', note: 'Not always appropriate: e.g., safety-critical contexts may need a HIGH level of test independence.' },
      ]} />
    ),
    hook: <>🚣 Everyone <b>rows</b>, everyone <b>bails water</b>. The three gifts: better <b>dynamics</b>, better <b>communication & collaboration</b>, <b>synergy</b>.</>,
    trap: <>Origin is <b>XP</b>. It does <b>not</b> mean "testers are no longer needed" or "developers do all testing". It may be <b>inappropriate</b> where high independence is needed (safety-critical).</>,
    check: { q: 'Which is an advantage of the whole team approach?', options: ['It removes the need for acceptance testing', 'It improves team dynamics, communication and collaboration, and creates synergy', 'It guarantees a high level of test independence', 'It makes the test manager responsible for all quality'], answer: 1, why: 'The syllabus lists improved team dynamics, enhanced communication & collaboration, and synergy. Everyone (not one manager) is responsible for quality.' },
  },
  {
    chapter: 1, title: 'Independence of testing: the ladder', icon: '🪜', lo: 'FL-1.5.3', ref: '1.5.3',
    story: <>Some independence makes testers more effective at finding defects because the <b>author's and tester's cognitive biases differ</b>. Climb the ladder from <b>no</b> independence (the author) to <b>very high</b> (outside the organization). But independence is <b>not a replacement for familiarity</b> — developers efficiently find many defects in their own code.</>,
    visual: () => <IndependenceLadder />,
    hook: <>🧗 The higher you climb, the <b>fresher the view</b> 👀 — but the <b>quieter the team chat</b> 🤐. Best: stand on <b>several rungs</b> at once.</>,
    trap: <>Peers in the <b>same team</b> = <b>some</b>; outside the team but <b>inside the org</b> = <b>high</b>; <b>outside the org</b> = <b>very high</b>. Classic drawback distractor-killer: "developers may <b>lose a sense of responsibility</b> for quality".</>,
    check: { q: 'Which is a potential DRAWBACK of independent testing?', options: ['Independent testers recognize different kinds of failures', 'Independent testers can challenge stakeholders\' assumptions', 'Developers may lose a sense of responsibility for quality', 'Independent testers have different cognitive biases than authors'], answer: 2, why: 'Losing responsibility for quality is a listed drawback; the others are benefits (or the reason for the benefit).' },
  },
];
