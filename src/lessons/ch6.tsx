import type { Scene } from './types';
import { BucketSort, ToolBelt, AutomationScale } from '../diagrams/Ch356';

export const ch6: Scene[] = [
  /* ---------------- 6.1.1 ---------------- */
  {
    chapter: 6, title: 'The tester\'s toolbox', icon: '🧰', lo: 'FL-6.1.1', ref: '6.1.1',
    story: <>Test tools <b>support and facilitate</b> many test activities. The syllabus lists <b>eight tool types</b>, plus a catch-all: <b>any other tool</b> that assists in testing — even a <b>spreadsheet</b>. Open each drawer, then match real situations to the right tool type.</>,
    visual: () => <ToolBelt />,
    hook: <>"<b>M</b>y <b>S</b>tatic <b>D</b>esign <b>E</b>xecutes <b>N</b>icely; <b>D</b>evOps <b>C</b>ollaborates at <b>S</b>cale" = <b>M</b>anagement · <b>S</b>tatic testing · <b>D</b>esign & implementation · <b>E</b>xecution & coverage · <b>N</b>on-functional · <b>D</b>evOps · <b>C</b>ollaboration · <b>S</b>calability & deployment standardization (+ 📊 any other tool).</>,
    trap: <><b>Virtual machines and containerization</b> = scalability & deployment standardization tools (not DevOps, not execution). Non-functional tools exist because those tests are <b>difficult or impossible to perform manually</b>. And yes — a spreadsheet counts as a test tool.</>,
    check: {
      q: 'Which tool type facilitates the generation of test cases, test data and test procedures?',
      options: ['Test management tools', 'Test design and test implementation tools', 'Test execution and test coverage tools', 'Collaboration tools'],
      answer: 1,
      why: 'Test design and test implementation tools facilitate generation of test cases, test data and test procedures.',
    },
  },

  /* ---------------- 6.2.1 (a) ---------------- */
  {
    chapter: 6, title: 'Automation on the scales', icon: '⚖️', lo: 'FL-6.2.1', ref: '6.2.1',
    story: <><b>Simply acquiring a tool does not guarantee success.</b> Every new tool needs effort — introduction, maintenance, training — and brings <b>risks</b> that need analysis and mitigation. Right now the open risks outweigh the benefits. Tap items to reveal details, and tick 🛡️ on each risk as you "mitigate" it — watch the scale tip.</>,
    visual: () => <AutomationScale />,
    hook: <>✚ Benefits: ⏱️ <b>Time</b> · 🎯 fewer human <b>Errors</b> · 📏 <b>Objective</b> measures · 📊 <b>Information</b> · ⚡ <b>Faster</b> feedback · 🧠 <b>More</b> time for better tests. ✖ Risks: 3 <b>misjudgements</b> (expectations, estimates, using a tool where manual fits better) + <b>over-reliance</b> + 3 <b>dependencies</b> (vendor, open source, platform) + <b>regulation</b>.</>,
    trap: <>"The tool will reduce the effort for maintaining test scripts" is <b>not</b> a benefit — <b>underestimating</b> the effort to maintain scripts and change the manual process is a listed <b>risk</b>.</>,
    check: {
      q: 'Which of the following is a RISK of test automation?',
      options: ['More objective assessment, such as coverage', 'Reduced test execution times', 'Dependency on a tool vendor who may retire the tool', 'Easier access to information about testing'],
      answer: 2,
      why: 'Dependency on the tool vendor (going out of business, retiring or selling the tool, poor support) is a listed risk; the others are benefits.',
    },
  },

  /* ---------------- 6.2.1 (b) ---------------- */
  {
    chapter: 6, title: 'Benefit or risk? Quick sort', icon: '🧺', lo: 'FL-6.2.1', ref: '6.2.1',
    story: <>Exam options often sound alike — "consistency" vs "relying on the tool", "faster" vs "underestimated effort". Sort each statement into the right basket as fast as you can.</>,
    visual: () => <BucketSort
      buckets={[
        { id: 'b', icon: '✚', title: 'Benefit', sub: 'the tool works for you', color: '#34d399' },
        { id: 'r', icon: '✖', title: 'Risk', sub: 'people misjudge or depend', color: '#fb7185' },
      ]}
      items={[
        { text: 'Regression tests run without repetitive manual work', bucket: 'b', why: 'time saved' },
        { text: 'Tests executed in the same order with the same frequency', bucket: 'b', why: 'consistency & repeatability' },
        { text: 'Measures too complicated for humans to determine', bucket: 'b', why: 'more objective assessment' },
        { text: 'Statistics & graphs on progress and failure rates', bucket: 'b', why: 'easier access to information' },
        { text: 'Faster feedback and faster time to market', bucket: 'b', why: 'reduced execution times' },
        { text: 'Testers get time for deeper, more effective tests', bucket: 'b', why: 'more time for test design' },
        { text: 'Expecting the tool to be easy and do everything', bucket: 'r', why: 'unrealistic expectations' },
        { text: 'Underestimating script maintenance effort', bucket: 'r', why: 'inaccurate estimations' },
        { text: 'Automating a test that is better done manually', bucket: 'r', why: 'tool used where manual testing is more appropriate' },
        { text: 'Ignoring human critical thinking', bucket: 'r', why: 'relying on a tool too much' },
        { text: 'Open-source tool gets abandoned', bucket: 'r', why: 'no further updates' },
        { text: 'Tool not compatible with the development platform', bucket: 'r' },
        { text: 'Tool does not comply with safety standards', bucket: 'r', why: 'unsuitable tool for regulatory/safety requirements' },
      ]} />,
    hook: <>If the sentence is about the <b>TOOL doing work for you</b> → benefit. If it is about <b>PEOPLE misjudging, over-trusting or depending</b> → risk.</>,
    trap: <>"Prevention of simple human errors" (benefit) and "relying on a tool too much" (risk) sound alike but sit on <b>opposite</b> sides of the scale.</>,
    check: {
      q: 'Which is a BENEFIT of test automation according to the syllabus?',
      options: ['Test scripts need no maintenance', 'Greater consistency and repeatability, preventing simple human errors', 'Testers no longer need critical thinking', 'The tool vendor guarantees long-term support'],
      answer: 1,
      why: 'Prevention of simple human errors through greater consistency and repeatability is a listed benefit; the other options contradict listed risks.',
    },
  },
];
