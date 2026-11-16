import type { Scene } from './types';
import { C } from './types';
import { Hub, FlipGrid, Versus } from '../components/SceneKit';
import { StaticLens, BucketSort, FeedbackDrift, ReviewPipeline, RoleTable, FormalitySlider } from '../diagrams/Ch356';

export const ch3: Scene[] = [
  /* ---------------- 3.1.1 ---------------- */
  {
    chapter: 3, title: 'What can be tested without running it?', icon: '📚', lo: 'FL-3.1.1', ref: '3.1.1',
    story: <>In <b>static testing</b> the software is <b>not executed</b>. Work products are examined by people (<b>reviews</b>) or by tools (<b>static analysis</b>). Almost <i>any</i> work product qualifies — requirements, code, test plans, test cases, backlog items, test charters, project documentation, contracts, models. Switch lenses: each lens has <b>one simple rule</b>.</>,
    visual: () => <StaticLens />,
    hook: <>👓 Review lens: <b>"Can a human READ and UNDERSTAND it?"</b> · 🤖 Tool lens: <b>"Does it have a STRUCTURE a tool can check?"</b> (code, models, formal syntax) · 📦🚫 3rd-party executables: <b>neither</b>.</>,
    trap: <>"Static analysis can be applied to any work product" is false — tools need a <b>structure</b> to check against. And reviews are not only for code: contracts, test charters and backlog items are classic review targets.</>,
    check: {
      q: 'Which work product is NOT appropriate for static testing?',
      options: ['A contract', 'A test charter', 'Third-party executable code that must not be analyzed for legal reasons', 'A model of the system architecture'],
      answer: 2,
      why: 'Work products that are difficult for humans to interpret and should not be analyzed by tools (e.g., 3rd-party executable code for legal reasons) are not appropriate.',
    },
  },

  /* ---------------- 3.1.2 ---------------- */
  {
    chapter: 3, title: 'Why bother? The value of static testing', icon: '💎', lo: 'FL-3.1.2', ref: '3.1.2',
    story: <>Testers, business people and developers sit together in <b>example mapping</b>, <b>collaborative user story writing</b> and <b>backlog refinement</b>, asking the right questions before a line of code exists. Static analysis runs in <b>CI</b> and finds problems before dynamic testing — with less effort, because no test cases are needed. Static testing serves <b>both verification and validation</b>. Click each satellite.</>,
    visual: () => <Hub color={C[3]} center={{ icon: '🔦', title: 'Static testing', note: 'Evaluates work products without executing them — manually (reviews) or with tools (static analysis). Objectives: improve quality, detect defects, assess readability, completeness, correctness, testability, consistency.' }} items={[
      { icon: '⏰', title: 'Early', sub: 'earliest SDLC phases', note: 'Detects defects in the earliest phases of the SDLC, fulfilling the principle of early testing.' },
      { icon: '🕳️', title: 'Sees the invisible', sub: 'dynamic can\'t', points: ['Finds defects dynamic testing cannot detect:', 'unreachable code', 'design patterns not implemented as desired', 'defects in non-executable work products'] },
      { icon: '🏅', title: 'Quality & confidence', sub: 'in work products', note: 'Provides the ability to evaluate the quality of, and build confidence in, work products.' },
      { icon: '🎯', title: 'Right requirements', sub: 'real needs', note: 'By verifying documented requirements, stakeholders make sure they describe their ACTUAL needs.' },
      { icon: '🤝', title: 'Shared understanding', sub: 'better communication', note: 'Performed early, it creates a shared understanding and improves communication among stakeholders → involve a WIDE VARIETY of stakeholders.' },
      { icon: '💰', title: 'Lower total cost', sub: 'less late fixing', points: ['Reviews can be costly, but overall project costs are usually MUCH LOWER than without reviews (less time & effort fixing defects later)', 'Static analysis finds certain code defects more efficiently than dynamic testing → fewer code defects and lower overall development effort'] },
    ]} />,
    hook: <>🔦 A flashlight in the early morning: you see <b>EARLY</b>, you see what is <b>INVISIBLE</b> to running code, you see it <b>TOGETHER</b> — and you <b>SAVE</b> money on the way.</>,
    trap: <>"Reviews are expensive, so they raise total project cost" — the syllabus says the opposite: overall costs are usually much <b>lower</b>. Also, static testing is for verification <b>and</b> validation, not verification only.</>,
    check: {
      q: 'Which statement describes a value of static testing?',
      options: ['It can identify defects such as unreachable code that dynamic testing cannot detect', 'It makes dynamic testing unnecessary', 'It measures the performance efficiency of the running system', 'It guarantees that the requirements are complete'],
      answer: 0,
      why: 'Static testing can find defects that cannot be detected by dynamic testing, e.g., unreachable code, design patterns not implemented as desired, defects in non-executable work products.',
    },
  },

  /* ---------------- 3.1.3 (a) ---------------- */
  {
    chapter: 3, title: 'Two detectives: static vs dynamic', icon: '🕵️', lo: 'FL-3.1.3', ref: '3.1.3',
    story: <>Both detectives hunt <b>defects</b> and they <b>complement</b> each other — some defect types can only be found by one of them. The 🔍 static detective reads the evidence and spots the <b>defect directly</b>. The ▶️ dynamic detective runs the system, sees a <b>failure</b>, and finds the defect only through <b>subsequent analysis</b>.</>,
    visual: () => <Versus cols={[
      { icon: '🔍', title: 'Static testing', color: C[3], points: [
        'Finds DEFECTS directly',
        'Works on NON-executable work products too',
        'More easily finds defects on code paths that are rarely executed or hard to reach',
        'Measures quality characteristics NOT dependent on executing code (e.g., maintainability)',
      ], foot: 'X-ray 🩻: look inside without switching it on.' },
      { icon: '▶️', title: 'Dynamic testing', color: '#22d3ee', points: [
        'Causes FAILURES → defects found by subsequent analysis',
        'Only for EXECUTABLE work products',
        'Needs a test that actually reaches the path',
        'Measures quality characteristics dependent on executing code (e.g., performance efficiency)',
      ], foot: 'Test drive 🚗: you only notice the noise when driving.' },
    ]} />,
    hook: <>🩻 Static = <b>X-ray</b> → sees the <b>cause</b> (defect). 🚗 Dynamic = <b>test drive</b> → feels the <b>symptom</b> (failure), then the mechanic investigates.</>,
    trap: <>"Static testing finds failures" — wrong: a failure needs execution. And "dynamic testing can be applied to a requirements document" — wrong: dynamic testing needs something executable.</>,
    check: {
      q: 'Which statement about static and dynamic testing is correct?',
      options: ['Static testing finds failures, dynamic testing finds defects', 'Static testing finds defects directly, while dynamic testing causes failures from which the defects are determined by analysis', 'Dynamic testing can be applied to non-executable work products', 'Static testing is best suited to measure performance efficiency'],
      answer: 1,
      why: 'Static testing finds defects directly; dynamic testing causes failures, and the associated defects are determined through subsequent analysis.',
    },
  },

  /* ---------------- 3.1.3 (b) ---------------- */
  {
    chapter: 3, title: 'Defect hunt: which detective catches it cheaper?', icon: '🎯', lo: 'FL-3.1.3', ref: '3.1.3',
    story: <>The syllabus lists <b>seven families</b> of defects that are <b>easier and/or cheaper</b> to find statically: requirements, design, certain coding defects, deviations from standards, interface specifications, specific security vulnerabilities, and gaps in test basis coverage. Anything that only shows up <b>while running</b> belongs to the dynamic detective. Sort the cards.</>,
    visual: () => <BucketSort
      buckets={[
        { id: 's', icon: '🔍', title: 'Easier/cheaper statically', sub: 'found without execution', color: C[3] },
        { id: 'd', icon: '▶️', title: 'Needs dynamic testing', sub: 'shows up when executing', color: '#22d3ee' },
      ]}
      items={[
        { text: 'Two requirements contradict each other', bucket: 's', why: 'requirements defect (contradiction)' },
        { text: 'Ambiguous requirement wording', bucket: 's', why: 'requirements defect (ambiguity)' },
        { text: 'Inefficient database structure', bucket: 's', why: 'design defect' },
        { text: 'Poor modularization', bucket: 's', why: 'design defect' },
        { text: 'Variable used with an undefined value', bucket: 's', why: 'coding defect' },
        { text: 'Unreachable or duplicated code', bucket: 's', why: 'coding defect' },
        { text: 'Excessive code complexity', bucket: 's', why: 'coding defect' },
        { text: 'Naming conventions not followed', bucket: 's', why: 'deviation from standards' },
        { text: 'Interface spec: wrong order of parameters', bucket: 's', why: 'incorrect interface specification' },
        { text: 'Buffer overflow vulnerability', bucket: 's', why: 'specific type of security vulnerability' },
        { text: 'No test for acceptance criterion AC-3', bucket: 's', why: 'gap in test basis coverage' },
        { text: 'Response time too slow under load', bucket: 'd', why: 'performance efficiency depends on executing code' },
        { text: 'Wrong total displayed while running a test case', bucket: 'd', why: 'a failure — visible only when executing' },
      ]} />,
    hook: <><b>R</b>eal <b>D</b>etectives <b>C</b>atch <b>S</b>muggled <b>I</b>llegal <b>S</b>ecret <b>G</b>oods = <b>R</b>equirements · <b>D</b>esign · <b>C</b>oding · <b>S</b>tandards · <b>I</b>nterfaces · <b>S</b>ecurity · <b>G</b>aps in test basis coverage.</>,
    trap: <><b>Buffer overflows</b> (specific security vulnerabilities) are on the <i>static</i> list. Measuring <b>performance efficiency</b> needs execution (dynamic); measuring <b>maintainability</b> does not (static).</>,
    check: {
      q: 'Which defect is typically EASIER and CHEAPER to find with static testing than with dynamic testing?',
      options: ['Too slow response time under peak load', 'A mismatch in the number of parameters in an interface specification', 'A crash that only occurs after 48 hours of continuous operation', 'A wrong total shown on screen during system testing'],
      answer: 1,
      why: 'Incorrect interface specifications (mismatched number, type or order of parameters) are listed among defects easier/cheaper to find statically.',
    },
  },

  /* ---------------- 3.2.1 ---------------- */
  {
    chapter: 3, title: 'Early & frequent stakeholder feedback', icon: '📣', lo: 'FL-3.2.1', ref: '3.2.1',
    story: <>Two lines leave the same starting point: <b>what stakeholders want</b> (which keeps moving — original <i>and</i> current vision) and <b>what the team builds</b>. Every feedback moment snaps them back together. Drag the slider and watch the <b>gap at release</b> — and which consequences light up.</>,
    visual: () => <FeedbackDrift />,
    hook: <>🧭 Feedback is the <b>GPS recalculating</b>: the more often it recalculates, the smaller the detour. No GPS → you arrive at the wrong city: <b>rework, missed deadlines, blame games</b>.</>,
    trap: <>The benefits are about <b>understanding and focus</b>: early communication of quality problems, fewer requirement misunderstandings, changes implemented earlier, focus on most-valuable features and on identified risks. Feedback does not "eliminate requirement changes" — it makes them understood earlier.</>,
    check: {
      q: 'Which is a benefit of early and frequent stakeholder feedback?',
      options: ['It eliminates requirement changes', 'It allows potential quality problems to be communicated early', 'It removes the need for test estimation', 'It makes reviews unnecessary'],
      answer: 1,
      why: 'Early and frequent feedback allows for the early communication of potential quality problems and prevents misunderstandings about requirements.',
    },
  },

  /* ---------------- 3.2.2 ---------------- */
  {
    chapter: 3, title: 'The review process: a dinner party in 5 courses', icon: '🍽️', lo: 'FL-3.2.2', ref: '3.2.2',
    story: <>ISO/IEC 20246 defines a <b>generic review process</b>: structured but flexible, tailored to the situation. The <b>more formal</b> the review, the more of its tasks you perform; big work products may need the process <b>several times</b>. Think of a dinner party — step through it and watch the anomaly log evolve.</>,
    visual: () => <ReviewPipeline />,
    hook: <>🎉 <b>P</b>lan the party → <b>I</b>nvite → each guest cooks <b>I</b>ndividually at home → <b>C</b>onversation at dinner → <b>F</b>ix the mess & send thank-you notes. "<b>P</b>lease <b>I</b>nvite <b>I</b>ndividuals to <b>C</b>hat & <b>F</b>ix".</>,
    trap: <>Anomalies are <b>not necessarily defects</b>. Status, ownership and actions are decided in <b>communication & analysis</b> (not during individual review). Exit criteria are defined in <b>planning</b>; making sure everyone has access is <b>review initiation</b>; defect reports are created in <b>fixing & reporting</b>.</>,
    check: {
      q: 'In which review activity is the status, ownership and required action decided for every anomaly?',
      options: ['Individual review', 'Communication and analysis', 'Fixing and reporting', 'Review initiation'],
      answer: 1,
      why: 'Since anomalies are not necessarily defects, they are analyzed and discussed during communication and analysis, typically in a review meeting.',
    },
  },

  /* ---------------- 3.2.3 ---------------- */
  {
    chapter: 3, title: 'Who sits at the review table?', icon: '🪑', lo: 'FL-3.2.3', ref: '3.2.3',
    story: <>Six <b>principal roles</b> gather around the work product. One person may wear several hats (other, more detailed roles exist in ISO/IEC 20246). Meet them, then switch to the quiz and seat each task with the right person.</>,
    visual: () => <RoleTable />,
    hook: <>💼 <b>M</b>anager = <b>M</b>oney & <b>M</b>inutes (what + resources) · 🧭 Review <b>L</b>eader = <b>L</b>ogistics (who, when, where) · 🎙️ <b>Mod</b>erator = meeting referee · ✍️ Author = writes & repairs · 📝 Scribe = secretary · 🔍 Reviewer = reads.</>,
    trap: <><b>Manager</b> decides WHAT is reviewed and provides staff & time; <b>review leader</b> decides WHO is involved and organizes WHEN & WHERE. The <b>moderator</b> runs the meeting (mediation, time, safe environment) — it is not the overall owner of the review.</>,
    check: {
      q: 'Who decides who will be involved in a review and organizes when and where it takes place?',
      options: ['Manager', 'Moderator', 'Review leader', 'Scribe'],
      answer: 2,
      why: 'The review leader takes overall responsibility, e.g., deciding who will be involved and organizing when and where the review takes place.',
    },
  },

  /* ---------------- 3.2.4 ---------------- */
  {
    chapter: 3, title: 'The formality slider: four review types', icon: '🎚️', lo: 'FL-3.2.4', ref: '3.2.4',
    story: <>Review types range from a coffee-chat <b>informal review</b> to a strict <b>inspection</b>. The required formality depends on the <b>SDLC</b>, process <b>maturity</b>, <b>criticality & complexity</b>, <b>legal/regulatory</b> needs and the need for an <b>audit trail</b>. Slide and compare who leads and what each type is really for.</>,
    visual: () => <FormalitySlider />,
    hook: <>"<b>I W</b>ant <b>T</b>o <b>I</b>nspect" = Informal → Walkthrough → Technical review → Inspection. Signatures: ☕ just anomalies · 🚶 <b>author</b> leads, educates · 🛠️ <b>moderator</b>, technical <b>decisions</b> · 🔬 <b>max</b> anomalies + <b>metrics</b>, author never leader/scribe.</>,
    trap: <>A <b>walkthrough</b> is led by the <b>author</b> (individual review beforehand is <i>not required</i>); a <b>technical review</b> is led by a <b>moderator</b>. Only the <b>inspection</b> follows the <i>complete</i> generic process and collects metrics.</>,
    check: {
      q: 'Which review type is led by the author and may have "educating reviewers" as one of its objectives?',
      options: ['Inspection', 'Technical review', 'Walkthrough', 'Informal review'],
      answer: 2,
      why: 'A walkthrough is led by the author and can serve many objectives, including educating reviewers.',
    },
  },

  /* ---------------- 3.2.5 ---------------- */
  {
    chapter: 3, title: 'Review rescue: symptoms & cures', icon: '🏆', lo: 'FL-3.2.5', ref: '3.2.5',
    story: <>Reviews fail in predictable ways. Each card shows a <b>symptom</b> from a real team; flip it to see the <b>success factor</b> that cures it. Say the cure out loud before flipping.</>,
    visual: () => <FlipGrid color={C[3]} min={180} items={[
      { icon: '🎯', title: '"Let\'s see who makes the most mistakes"', sub: 'no clear goal', note: 'Clear objectives & MEASURABLE exit criteria. Evaluating participants should NEVER be an objective.' },
      { icon: '🔧', title: 'An inspection for a quick idea session', sub: 'wrong tool', note: 'Choose the APPROPRIATE review type for the objectives, work product, participants, project needs and context.' },
      { icon: '📚', title: '200 pages in one sitting', sub: 'reviewers zone out', note: 'Review SMALL CHUNKS so reviewers don\'t lose concentration.' },
      { icon: '🗄️', title: 'Findings vanish in a drawer', sub: 'nobody learns', note: 'Provide FEEDBACK from reviews to stakeholders and authors so they can improve product and activities.' },
      { icon: '⏰', title: 'Document sent 10 minutes before', sub: 'no preparation', note: 'Provide ADEQUATE TIME for participants to prepare.' },
      { icon: '💼', title: 'Reviews cancelled when deadlines loom', sub: 'no backing', note: 'SUPPORT FROM MANAGEMENT for the review process.' },
      { icon: '🏛️', title: '"Reviews? Just bureaucracy."', sub: 'one-off event', note: 'Make reviews part of the organization\'s CULTURE to promote learning and process improvement.' },
      { icon: '🎓', title: 'Scribe has no idea what to record', sub: 'unclear roles', note: 'Provide adequate TRAINING for all participants so they know how to fulfil their role.' },
      { icon: '🎙️', title: 'Meeting turns into a shouting match', sub: 'chaos', note: 'FACILITATING meetings.' },
    ]} />,
    hook: <>🏋️ A good review is a good workout: clear <b>goal</b>, the right <b>exercise</b>, small <b>sets</b>, a coach's <b>feedback</b>, warm-up <b>time</b>, a <b>boss</b> who pays the gym, a gym <b>culture</b>, proper <b>training</b> and a <b>trainer</b> running the class.</>,
    trap: <>Any option that uses review results to <b>evaluate people</b> is wrong. "Review the whole document at once" is wrong — <b>small chunks</b> succeed.</>,
    check: {
      q: 'Which of the following is a success factor for reviews?',
      options: ['Using review results to evaluate the performance of the author', 'Reviewing the entire document in one session to keep the context', 'Providing adequate time for participants to prepare', 'Keeping management out of the review process'],
      answer: 2,
      why: 'Adequate preparation time is a listed success factor; evaluating participants must never be an objective; small chunks and management support are success factors.',
    },
  },
];
