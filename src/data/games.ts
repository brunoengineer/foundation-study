export interface SortGame {
  id: string;
  chapter: number;
  title: string;
  icon: string;
  prompt: string;
  buckets: { id: string; label: string; icon: string; color: string }[];
  items: { text: string; bucket: string }[];
}
export interface SeqGame {
  id: string;
  chapter: number;
  title: string;
  icon: string;
  prompt: string;
  steps: string[]; // correct order
}

export const sortGames: SortGame[] = [
  // ───────── Chapter 1 ─────────
  {
    id: 'edfr', chapter: 1, title: 'Error, Defect, Failure or Root cause?', icon: '🐛',
    prompt: 'Classify each situation in the chain from root cause to failure.',
    buckets: [
      { id: 'rc', label: 'Root cause', icon: '🌱', color: '#a3e635' },
      { id: 'e', label: 'Error', icon: '🙈', color: '#fbbf24' },
      { id: 'd', label: 'Defect', icon: '🐛', color: '#fb7185' },
      { id: 'f', label: 'Failure', icon: '💥', color: '#f72585' },
    ],
    items: [
      { text: 'Team never trained on the new date library', bucket: 'rc' },
      { text: 'Constant time pressure that leads people to slip up', bucket: 'rc' },
      { text: 'Developer misreads the interest rule in the spec', bucket: 'e' },
      { text: 'Tired analyst writes the wrong VAT rate into a requirement', bucket: 'e' },
      { text: '“>” typed where “>=” belongs in the source code', bucket: 'd' },
      { text: 'Contradictory sentence in the requirements specification', bucket: 'd' },
      { text: 'Wrong path in a build file', bucket: 'd' },
      { text: 'Checkout page crashes when the user clicks Pay', bucket: 'f' },
      { text: 'Report shows a total of 90 instead of 100 in operation', bucket: 'f' },
    ],
  },
  {
    id: 'principles-a', chapter: 1, title: 'Principle detective I', icon: '🕵️',
    prompt: 'Which testing principle does each statement illustrate?',
    buckets: [
      { id: 'pres', label: 'Presence, not absence', icon: '🔦', color: '#22d3ee' },
      { id: 'exh', label: 'Exhaustive is impossible', icon: '♾️', color: '#8b6cff' },
      { id: 'early', label: 'Early testing saves', icon: '⏰', color: '#43c59e' },
      { id: 'clus', label: 'Defects cluster', icon: '🍇', color: '#f72585' },
    ],
    items: [
      { text: 'No defects found ≠ proof the software is correct', bucket: 'pres' },
      { text: 'Testing lowers the probability of undiscovered defects', bucket: 'pres' },
      { text: '10 fields × 100 values each: we can’t try every combination', bucket: 'exh' },
      { text: 'Use techniques, prioritization and risk-based testing to focus effort', bucket: 'exh' },
      { text: 'Reviewing the spec now avoids defects in the design derived from it', bucket: 'early' },
      { text: 'Start static and dynamic testing as soon as possible', bucket: 'early' },
      { text: '80% of field failures came from the payment module', bucket: 'clus' },
      { text: 'A Pareto-style hotspot feeds risk-based testing', bucket: 'clus' },
    ],
  },
  {
    id: 'principles-b', chapter: 1, title: 'Principle detective II', icon: '🔍',
    prompt: 'Which testing principle does each statement illustrate?',
    buckets: [
      { id: 'wear', label: 'Tests wear out', icon: '🦠', color: '#fbbf24' },
      { id: 'ctx', label: 'Context dependent', icon: '🌍', color: '#2ec4b6' },
      { id: 'fal', label: 'Absence-of-defects fallacy', icon: '🏜️', color: '#fb7185' },
    ],
    items: [
      { text: 'The same suite has found nothing new for 20 runs', bucket: 'wear' },
      { text: 'Modify the test data and write new tests to find new defects', bucket: 'wear' },
      { text: 'A medical device is tested differently from a game app', bucket: 'ctx' },
      { text: 'There is no single universally applicable approach to testing', bucket: 'ctx' },
      { text: 'All requirements verified, all bugs fixed — users still hate it', bucket: 'fal' },
      { text: 'Validation must be carried out in addition to verification', bucket: 'fal' },
      { text: 'Bug-free product loses to a competitor that fits the business goals', bucket: 'fal' },
    ],
  },
  {
    id: 'activity', chapter: 1, title: 'Which test activity?', icon: '🧭',
    prompt: 'Drop each task into the test activity it belongs to.',
    buckets: [
      { id: 'an', label: 'Analysis', icon: '🔍', color: '#22d3ee' },
      { id: 'de', label: 'Design', icon: '✏️', color: '#8b6cff' },
      { id: 'im', label: 'Implementation', icon: '🛠️', color: '#ffb703' },
      { id: 'ex', label: 'Execution', icon: '▶️', color: '#43c59e' },
      { id: 'co', label: 'Completion', icon: '🏁', color: '#f72585' },
    ],
    items: [
      { text: 'Analyze the test basis to identify testable features', bucket: 'an' },
      { text: 'Define and prioritize test conditions', bucket: 'an' },
      { text: 'Elaborate test conditions into test cases', bucket: 'de' },
      { text: 'Identify coverage items and test data requirements', bucket: 'de' },
      { text: 'Design the test environment', bucket: 'de' },
      { text: 'Assemble test procedures into test suites', bucket: 'im' },
      { text: 'Build the test environment and verify its setup', bucket: 'im' },
      { text: 'Arrange the test execution schedule', bucket: 'im' },
      { text: 'Compare actual results with expected results', bucket: 'ex' },
      { text: 'Analyze anomalies to find their likely causes', bucket: 'ex' },
      { text: 'Archive reusable testware and shut down the environment', bucket: 'co' },
      { text: 'Create change requests for unresolved defects', bucket: 'co' },
    ],
  },
  {
    id: 'roles', chapter: 1, title: 'Manager or tester?', icon: '👥',
    prompt: 'Which testing role is mainly focused on each item?',
    buckets: [
      { id: 'tm', label: 'Test management role', icon: '👔', color: '#8b6cff' },
      { id: 't', label: 'Testing role', icon: '🔧', color: '#22d3ee' },
    ],
    items: [
      { text: 'Overall responsibility for the test process and team', bucket: 'tm' },
      { text: 'Leadership of the test activities', bucket: 'tm' },
      { text: 'Test planning', bucket: 'tm' },
      { text: 'Test monitoring and test control', bucket: 'tm' },
      { text: 'Test completion', bucket: 'tm' },
      { text: 'Engineering (technical) aspect of testing', bucket: 't' },
      { text: 'Test analysis and test design', bucket: 't' },
      { text: 'Test implementation', bucket: 't' },
      { text: 'Test execution', bucket: 't' },
    ],
  },

  // ───────── Chapter 2 ─────────
  {
    id: 'levels', chapter: 2, title: 'Spot the test level', icon: '🪜',
    prompt: 'Which test level fits each scenario?',
    buckets: [
      { id: 'c', label: 'Component', icon: '🧩', color: '#22d3ee' },
      { id: 'ci', label: 'Component integration', icon: '🧷', color: '#8b6cff' },
      { id: 's', label: 'System', icon: '🖥️', color: '#ffb703' },
      { id: 'si', label: 'System integration', icon: '🌐', color: '#2ec4b6' },
      { id: 'a', label: 'Acceptance', icon: '🤝', color: '#f72585' },
    ],
    items: [
      { text: 'Developer tests one class in isolation with a unit test framework', bucket: 'c' },
      { text: 'Needs a test harness; done in the developer’s environment', bucket: 'c' },
      { text: 'Checks the interfaces between modules using a bottom-up strategy', bucket: 'ci' },
      { text: 'Interactions between the cart and pricing components', bucket: 'ci' },
      { text: 'Independent team runs end-to-end tasks against the system spec', bucket: 's' },
      { text: 'Usability of the complete product in a representative environment', bucket: 's' },
      { text: 'Interface between our shop and an external payment service', bucket: 'si' },
      { text: 'Needs an environment close to the operational one, with other systems', bucket: 'si' },
      { text: 'Beta testing by intended users', bucket: 'a' },
      { text: 'Demonstrates readiness for deployment against business needs', bucket: 'a' },
    ],
  },
  {
    id: 'types', chapter: 2, title: 'Which test type?', icon: '🏷️',
    prompt: 'Classify each statement into one of the four test types.',
    buckets: [
      { id: 'fn', label: 'Functional', icon: '⚙️', color: '#22d3ee' },
      { id: 'nf', label: 'Non-functional', icon: '🏎️', color: '#ffb703' },
      { id: 'bb', label: 'Black-box', icon: '⬛', color: '#8b6cff' },
      { id: 'wb', label: 'White-box', icon: '⬜', color: '#43c59e' },
    ],
    items: [
      { text: 'Checks functional completeness, correctness and appropriateness', bucket: 'fn' },
      { text: 'Evaluates WHAT the test object should do', bucket: 'fn' },
      { text: 'Evaluates HOW WELL the system behaves', bucket: 'nf' },
      { text: 'Checks that a function responds within 2 seconds', bucket: 'nf' },
      { text: 'Checks the app can be ported to a new platform', bucket: 'nf' },
      { text: 'Derives tests from documentation, not the internal structure', bucket: 'bb' },
      { text: 'Main objective: check behavior against specifications', bucket: 'bb' },
      { text: 'Derives tests from code, architecture, work flows and data flows', bucket: 'wb' },
      { text: 'Main objective: cover the underlying structure to an acceptable level', bucket: 'wb' },
    ],
  },
  {
    id: 'confreg', chapter: 2, title: 'Confirmation or regression?', icon: '🔁',
    prompt: 'Is it confirmation testing or regression testing?',
    buckets: [
      { id: 'c', label: 'Confirmation', icon: '🎯', color: '#43c59e' },
      { id: 'r', label: 'Regression', icon: '🔁', color: '#8b6cff' },
    ],
    items: [
      { text: 'Re-run all tests that failed due to the defect', bucket: 'c' },
      { text: 'Add new tests covering the changes needed for the fix', bucket: 'c' },
      { text: 'Check the original defect was successfully fixed', bucket: 'c' },
      { text: 'Repeat the steps that reproduced the failure; it no longer occurs', bucket: 'c' },
      { text: 'Preferably done by the person who ran the initial test', bucket: 'c' },
      { text: 'Check the change caused no adverse consequences', bucket: 'r' },
      { text: 'Check other connected systems after a fix', bucket: 'r' },
      { text: 'Extent decided by an impact analysis first', bucket: 'r' },
      { text: 'Suite grows every release: strong candidate for automation', bucket: 'r' },
    ],
  },
  {
    id: 'maint', chapter: 2, title: 'Maintenance trigger', icon: '🚨',
    prompt: 'Which category of maintenance trigger is it?',
    buckets: [
      { id: 'mod', label: 'Modification', icon: '✏️', color: '#22d3ee' },
      { id: 'mig', label: 'Upgrade / migration', icon: '🚚', color: '#ffb703' },
      { id: 'ret', label: 'Retirement', icon: '🪦', color: '#fb7185' },
    ],
    items: [
      { text: 'Planned enhancement in the next release', bucket: 'mod' },
      { text: 'Hot fix for a production crash', bucket: 'mod' },
      { text: 'Corrective change to a calculation', bucket: 'mod' },
      { text: 'Moving the system from one platform to another', bucket: 'mig' },
      { text: 'Testing data conversion from another application', bucket: 'mig' },
      { text: 'Testing the changed software in the new operational environment', bucket: 'mig' },
      { text: 'Application reaches the end of its life', bucket: 'ret' },
      { text: 'Testing data archiving for long retention periods', bucket: 'ret' },
      { text: 'Testing restore and retrieval after archiving', bucket: 'ret' },
    ],
  },

  // ───────── Chapter 3 ─────────
  {
    id: 'statdyn', chapter: 3, title: 'Static or dynamic?', icon: '🔬',
    prompt: 'Does each statement describe static testing or dynamic testing?',
    buckets: [
      { id: 's', label: 'Static testing', icon: '🔬', color: '#22d3ee' },
      { id: 'd', label: 'Dynamic testing', icon: '🏃', color: '#f72585' },
    ],
    items: [
      { text: 'Finds defects directly', bucket: 's' },
      { text: 'Can be applied to non-executable work products', bucket: 's' },
      { text: 'Measures maintainability', bucket: 's' },
      { text: 'Detects unreachable code and undeclared variables', bucket: 's' },
      { text: 'Easily finds defects on rarely executed paths', bucket: 's' },
      { text: 'Finds ambiguities and contradictions in requirements', bucket: 's' },
      { text: 'Causes failures; defects found by subsequent analysis', bucket: 'd' },
      { text: 'Only applicable to executable work products', bucket: 'd' },
      { text: 'Measures performance efficiency', bucket: 'd' },
    ],
  },
  {
    id: 'reviewroles', chapter: 3, title: 'Who does that in a review?', icon: '🎭',
    prompt: 'Match each responsibility to the review role.',
    buckets: [
      { id: 'mg', label: 'Manager', icon: '👔', color: '#8b6cff' },
      { id: 'au', label: 'Author', icon: '✍️', color: '#ffb703' },
      { id: 'mo', label: 'Moderator', icon: '⚖️', color: '#22d3ee' },
      { id: 'sc', label: 'Scribe', icon: '📝', color: '#43c59e' },
      { id: 'rl', label: 'Review leader', icon: '🧑‍✈️', color: '#f72585' },
    ],
    items: [
      { text: 'Decides what is to be reviewed', bucket: 'mg' },
      { text: 'Provides staff and time for the review', bucket: 'mg' },
      { text: 'Creates the work product under review', bucket: 'au' },
      { text: 'Fixes the work product after the review', bucket: 'au' },
      { text: 'Mediation and time management in the meeting', bucket: 'mo' },
      { text: 'Keeps a safe environment where everyone can speak freely', bucket: 'mo' },
      { text: 'Collates anomalies from the reviewers', bucket: 'sc' },
      { text: 'Records decisions and new anomalies found in the meeting', bucket: 'sc' },
      { text: 'Decides who will be involved', bucket: 'rl' },
      { text: 'Organizes when and where the review takes place', bucket: 'rl' },
    ],
  },
  {
    id: 'reviewtypes', chapter: 3, title: 'Name that review type', icon: '👀',
    prompt: 'Which review type is described?',
    buckets: [
      { id: 'inf', label: 'Informal review', icon: '☕', color: '#a3e635' },
      { id: 'wt', label: 'Walkthrough', icon: '🚶', color: '#22d3ee' },
      { id: 'tr', label: 'Technical review', icon: '🧑‍🔬', color: '#8b6cff' },
      { id: 'in', label: 'Inspection', icon: '🔎', color: '#f72585' },
    ],
    items: [
      { text: 'Does not follow a defined process', bucket: 'inf' },
      { text: 'No formal documented output required', bucket: 'inf' },
      { text: 'Led by the author', bucket: 'wt' },
      { text: 'Can educate reviewers; individual prep not required', bucket: 'wt' },
      { text: 'Technically qualified reviewers, led by a moderator', bucket: 'tr' },
      { text: 'Gain consensus and make decisions on a technical problem', bucket: 'tr' },
      { text: 'Most formal; follows the complete generic process', bucket: 'in' },
      { text: 'Main objective: find the maximum number of anomalies', bucket: 'in' },
      { text: 'Metrics collected to improve the SDLC', bucket: 'in' },
      { text: 'Author cannot act as review leader or scribe', bucket: 'in' },
    ],
  },

  // ───────── Chapter 4 ─────────
  {
    id: 'family', chapter: 4, title: 'Technique family', icon: '🧰',
    prompt: 'Black-box, white-box or experience-based?',
    buckets: [
      { id: 'bb', label: 'Black-box', icon: '⬛', color: '#8b6cff' },
      { id: 'wb', label: 'White-box', icon: '⬜', color: '#43c59e' },
      { id: 'eb', label: 'Experience-based', icon: '🧠', color: '#ffb703' },
    ],
    items: [
      { text: 'Test cases are independent of how the software is implemented', bucket: 'bb' },
      { text: 'Equivalence partitioning and decision table testing', bucket: 'bb' },
      { text: 'Tests stay useful if the code changes but behavior stays the same', bucket: 'bb' },
      { text: 'Can only be created after design or implementation', bucket: 'wb' },
      { text: 'Statement testing and branch testing', bucket: 'wb' },
      { text: 'Provides an objective measure of code coverage', bucket: 'wb' },
      { text: 'May miss defects of omission (unimplemented requirements)', bucket: 'wb' },
      { text: 'Effectiveness depends heavily on the tester’s skills', bucket: 'eb' },
      { text: 'Error guessing, exploratory and checklist-based testing', bucket: 'eb' },
      { text: 'Complements the other two families', bucket: 'eb' },
    ],
  },
  {
    id: 'bbtech', chapter: 4, title: 'Pick the black-box technique', icon: '⬛',
    prompt: 'Which black-box test technique fits best?',
    buckets: [
      { id: 'ep', label: 'Equivalence partitioning', icon: '🍰', color: '#22d3ee' },
      { id: 'bva', label: 'Boundary value analysis', icon: '🧱', color: '#ffb703' },
      { id: 'dt', label: 'Decision table', icon: '🗂️', color: '#8b6cff' },
      { id: 'st', label: 'State transition', icon: '🚦', color: '#f72585' },
    ],
    items: [
      { text: 'Ages 0–17, 18–64, 65+: one test per group', bucket: 'ep' },
      { text: 'Each Choice coverage across several input parameters', bucket: 'ep' },
      { text: 'Test 17 and 18, the edge between two partitions', bucket: 'bva' },
      { text: 'Only usable for ordered partitions', bucket: 'bva' },
      { text: 'Discount depends on the combination of member status AND order total', bucket: 'dt' },
      { text: 'Coverage items: feasible columns of T/F/– conditions', bucket: 'dt' },
      { text: 'Card locked after 3 wrong PIN attempts', bucket: 'st' },
      { text: 'Achieve 0-switch (valid transitions) coverage', bucket: 'st' },
      { text: 'Invalid transitions appear as empty cells', bucket: 'st' },
    ],
  },
  {
    id: 'exp', chapter: 4, title: 'Experience-based trio', icon: '🧠',
    prompt: 'Which experience-based technique is described?',
    buckets: [
      { id: 'eg', label: 'Error guessing', icon: '🔮', color: '#8b6cff' },
      { id: 'ex', label: 'Exploratory testing', icon: '🧭', color: '#22d3ee' },
      { id: 'cl', label: 'Checklist-based', icon: '☑️', color: '#43c59e' },
    ],
    items: [
      { text: 'Fault attacks from a list of possible errors and failures', bucket: 'eg' },
      { text: 'Based on the kinds of errors developers tend to make', bucket: 'eg' },
      { text: 'Failures that occurred in similar applications', bucket: 'eg' },
      { text: 'Design, execute and evaluate tests while learning the test object', bucket: 'ex' },
      { text: 'Time-boxed session guided by a test charter, then a debriefing', bucket: 'ex' },
      { text: 'Useful with few specifications and heavy time pressure', bucket: 'ex' },
      { text: 'Items often phrased as questions', bucket: 'cl' },
      { text: 'Regularly updated based on defect analysis', bucket: 'cl' },
      { text: '10 usability heuristics (Nielsen)', bucket: 'cl' },
    ],
  },

  // ───────── Chapter 5 ─────────
  {
    id: 'risktype', chapter: 5, title: 'Project or product risk?', icon: '⚠️',
    prompt: 'Is each risk a project risk or a product risk?',
    buckets: [
      { id: 'pj', label: 'Project risk', icon: '📅', color: '#ffb703' },
      { id: 'pd', label: 'Product risk', icon: '📦', color: '#f72585' },
    ],
    items: [
      { text: 'Delays in work product deliveries', bucket: 'pj' },
      { text: 'Inaccurate estimates', bucket: 'pj' },
      { text: 'Shortage of staff', bucket: 'pj' },
      { text: 'Scope creep', bucket: 'pj' },
      { text: 'Bankruptcy of a third-party supplier', bucket: 'pj' },
      { text: 'Incorrect calculations', bucket: 'pd' },
      { text: 'Inadequate response time', bucket: 'pd' },
      { text: 'Security vulnerabilities', bucket: 'pd' },
      { text: 'Poor user experience', bucket: 'pd' },
      { text: 'Missing functionality', bucket: 'pd' },
    ],
  },
  {
    id: 'riskresp', chapter: 5, title: 'Risk response', icon: '🛡️',
    prompt: 'Which response to an analyzed product risk is this?',
    buckets: [
      { id: 'mit', label: 'Mitigation by testing', icon: '🩹', color: '#43c59e' },
      { id: 'acc', label: 'Acceptance', icon: '🤷', color: '#ffb703' },
      { id: 'tra', label: 'Transfer', icon: '📤', color: '#8b6cff' },
      { id: 'con', label: 'Contingency plan', icon: '🧯', color: '#f72585' },
    ],
    items: [
      { text: 'Apply appropriate test techniques and coverage levels', bucket: 'mit' },
      { text: 'Perform reviews and static analysis', bucket: 'mit' },
      { text: 'Pick testers with the right experience for this risk type', bucket: 'mit' },
      { text: 'Apply an appropriate level of test independence', bucket: 'mit' },
      { text: 'Stakeholders consciously go live with the risk as it is', bucket: 'acc' },
      { text: 'Shift the consequences to a third party by contract or insurance', bucket: 'tra' },
      { text: 'Prepare a rollback plan in case the risk materializes', bucket: 'con' },
    ],
  },
  {
    id: 'entryexit', chapter: 5, title: 'Entry or exit criteria?', icon: '🚪',
    prompt: 'Is each item a typical entry criterion or exit criterion?',
    buckets: [
      { id: 'en', label: 'Entry criteria', icon: '🚪', color: '#22d3ee' },
      { id: 'ex', label: 'Exit criteria', icon: '🏁', color: '#f72585' },
    ],
    items: [
      { text: 'Test environment and test data are available', bucket: 'en' },
      { text: 'Testable requirements / user stories available', bucket: 'en' },
      { text: 'All smoke tests have passed', bucket: 'en' },
      { text: 'Definition of Ready', bucket: 'en' },
      { text: 'Budget and people available', bucket: 'en' },
      { text: 'Achieved level of coverage', bucket: 'ex' },
      { text: 'Number of unresolved defects / defect density', bucket: 'ex' },
      { text: 'All regression tests are automated', bucket: 'ex' },
      { text: 'Definition of Done', bucket: 'ex' },
      { text: 'Out of budget, and stakeholders accepted the risk', bucket: 'ex' },
    ],
  },
  {
    id: 'quadrants', chapter: 5, title: 'Testing quadrants', icon: '🟦',
    prompt: 'Place each test in its Marick testing quadrant.',
    buckets: [
      { id: 'q1', label: 'Q1 Tech · support team', icon: '1️⃣', color: '#22d3ee' },
      { id: 'q2', label: 'Q2 Business · support team', icon: '2️⃣', color: '#43c59e' },
      { id: 'q3', label: 'Q3 Business · critique product', icon: '3️⃣', color: '#ffb703' },
      { id: 'q4', label: 'Q4 Tech · critique product', icon: '4️⃣', color: '#f72585' },
    ],
    items: [
      { text: 'Component tests in the CI process', bucket: 'q1' },
      { text: 'Component integration tests', bucket: 'q1' },
      { text: 'User story tests and examples', bucket: 'q2' },
      { text: 'User experience prototypes', bucket: 'q2' },
      { text: 'API testing and simulations', bucket: 'q2' },
      { text: 'Exploratory testing', bucket: 'q3' },
      { text: 'Usability testing', bucket: 'q3' },
      { text: 'User acceptance testing', bucket: 'q3' },
      { text: 'Smoke tests', bucket: 'q4' },
      { text: 'Performance and security tests', bucket: 'q4' },
    ],
  },
  {
    id: 'reports', chapter: 5, title: 'Progress or completion report?', icon: '📰',
    prompt: 'Which test report typically contains or is described by each item?',
    buckets: [
      { id: 'pr', label: 'Test progress report', icon: '📈', color: '#22d3ee' },
      { id: 'co', label: 'Test completion report', icon: '📕', color: '#8b6cff' },
    ],
    items: [
      { text: 'Testing period', bucket: 'pr' },
      { text: 'Testing planned for the next period', bucket: 'pr' },
      { text: 'New and changed risks within the period', bucket: 'pr' },
      { text: 'Generated regularly, e.g. daily or weekly', bucket: 'pr' },
      { text: 'Test summary', bucket: 'co' },
      { text: 'Lessons learned', bucket: 'co' },
      { text: 'Unmitigated risks and defects not fixed', bucket: 'co' },
      { text: 'Evaluation against the original test plan’s exit criteria', bucket: 'co' },
      { text: 'Follows a set template and occurs only once', bucket: 'co' },
    ],
  },

  // ───────── Chapter 6 ─────────
  {
    id: 'tools', chapter: 6, title: 'Tool box', icon: '🧰',
    prompt: 'Which type of test tool supports each activity?',
    buckets: [
      { id: 'mg', label: 'Test management', icon: '📋', color: '#8b6cff' },
      { id: 'st', label: 'Static testing', icon: '🔬', color: '#22d3ee' },
      { id: 'ex', label: 'Execution & coverage', icon: '▶️', color: '#43c59e' },
      { id: 'nf', label: 'Non-functional', icon: '🏎️', color: '#ffb703' },
      { id: 'dv', label: 'DevOps', icon: '♾️', color: '#f72585' },
    ],
    items: [
      { text: 'Managing requirements, tests, defects and configuration', bucket: 'mg' },
      { text: 'Supporting reviews', bucket: 'st' },
      { text: 'Static analysis of source code', bucket: 'st' },
      { text: 'Automated test execution', bucket: 'ex' },
      { text: 'Code coverage measurement', bucket: 'ex' },
      { text: 'Load generation that is impossible to do manually', bucket: 'nf' },
      { text: 'CI/CD and automated build processes', bucket: 'dv' },
      { text: 'Delivery pipeline and workflow tracking', bucket: 'dv' },
    ],
  },
  {
    id: 'autobr', chapter: 6, title: 'Automation: benefit or risk?', icon: '⚖️',
    prompt: 'Is each item a potential benefit or a potential risk of test automation?',
    buckets: [
      { id: 'b', label: 'Benefit', icon: '✅', color: '#34d399' },
      { id: 'r', label: 'Risk', icon: '⚠️', color: '#fb7185' },
    ],
    items: [
      { text: 'Time saved by reducing repetitive manual work', bucket: 'b' },
      { text: 'Greater consistency and repeatability', bucket: 'b' },
      { text: 'More objective assessment, e.g. coverage', bucket: 'b' },
      { text: 'Earlier defect detection and faster feedback', bucket: 'b' },
      { text: 'More time to design new, deeper tests', bucket: 'b' },
      { text: 'Unrealistic expectations about the tool', bucket: 'r' },
      { text: 'Tool vendor goes out of business', bucket: 'r' },
      { text: 'Open-source tool gets abandoned', bucket: 'r' },
      { text: 'Relying on the tool and ignoring critical thinking', bucket: 'r' },
      { text: 'Tool not compatible with the development platform', bucket: 'r' },
    ],
  },
];

export const seqGames: SeqGame[] = [
  { id: 'rc-chain', chapter: 1, title: 'From root cause to failure', icon: '💥', prompt: 'Order the chain of cause and effect.', steps: ['Root cause (e.g. time pressure)', 'Error: a human mistake', 'Defect: fault/bug in a work product', 'Failure: the system misbehaves when the defect is executed'] },
  { id: 'process', chapter: 1, title: 'Test process', icon: '🧭', prompt: 'Order the test activities in their logical sequence (monitoring & control run alongside).', steps: ['Test planning', 'Test analysis', 'Test design', 'Test implementation', 'Test execution', 'Test completion'] },
  { id: 'debug', chapter: 1, title: 'Fix a failure', icon: '🔧', prompt: 'Order the steps after dynamic testing triggers a failure.', steps: ['Reproduce the failure', 'Diagnose (find the defect)', 'Fix the defect', 'Confirmation testing', 'Regression testing'] },
  { id: 'indep', chapter: 1, title: 'Independence ladder', icon: '🕶️', prompt: 'Order from no independence to very high independence.', steps: ['The author tests their own work', 'Peers from the same team', 'Testers outside the team, inside the organization', 'Testers from outside the organization'] },
  { id: 'tdd', chapter: 2, title: 'TDD cycle', icon: '🔴', prompt: 'Order one TDD iteration.', steps: ['Write the tests first', 'Write the code to satisfy the tests', 'Refactor the tests and the code'] },
  { id: 'levels', chapter: 2, title: 'Test levels', icon: '🪜', prompt: 'Order the five test levels from individual components to the complete system in use.', steps: ['Component testing', 'Component integration testing', 'System testing', 'System integration testing', 'Acceptance testing'] },
  { id: 'review', chapter: 3, title: 'Review process', icon: '🔁', prompt: 'Order the review process activities (ISO/IEC 20246).', steps: ['Planning', 'Review initiation', 'Individual review', 'Communication and analysis', 'Fixing and reporting'] },
  { id: 'atdd', chapter: 4, title: 'ATDD flow', icon: '🧾', prompt: 'Order the ATDD steps.', steps: ['Specification workshop: analyze, discuss and write the user story & acceptance criteria', 'Create test cases based on the acceptance criteria', 'Developers automate the tests while implementing the story', 'Acceptance tests become executable requirements'] },
  { id: 'atdd-tests', chapter: 4, title: 'ATDD test order', icon: '➕', prompt: 'In ATDD, which tests come first?', steps: ['Positive tests (happy path)', 'Negative tests', 'Non-functional quality characteristics'] },
  { id: 'stcov', chapter: 4, title: 'State transition coverage', icon: '🚥', prompt: 'Order from weakest to strongest coverage criterion.', steps: ['All states coverage', 'Valid transitions (0-switch) coverage', 'All transitions coverage'] },
  { id: 'risk', chapter: 5, title: 'Risk management', icon: '🧯', prompt: 'Order the risk management activities.', steps: ['Risk identification', 'Risk assessment', 'Risk mitigation', 'Risk monitoring'] },
  { id: 'delphi', chapter: 5, title: 'Wideband Delphi', icon: '🃏', prompt: 'Order the Wideband Delphi estimation steps.', steps: ['Each expert estimates in isolation', 'Results are collected', 'Experts with out-of-range estimates discuss', 'Each expert re-estimates in isolation', 'Repeat until consensus is reached'] },
  { id: 'pyramid', chapter: 5, title: 'Test pyramid', icon: '🔺', prompt: 'Order the layers from bottom (many, fast) to top (few, slow).', steps: ['Unit (component) tests', 'Integration (component integration) tests', 'End-to-end tests'] },
  { id: 'defect', chapter: 5, title: 'Defect workflow', icon: '🗃️', prompt: 'Order the defect management workflow activities.', steps: ['Log the reported anomaly', 'Analyze and classify it', 'Decide on a response (fix or keep as is)', 'Close the defect report'] },
];
