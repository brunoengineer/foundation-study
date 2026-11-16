import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* Shared helpers ------------------------------------------------------------ */
const cv = (c: string): CSSProperties => ({ ['--c' as string]: c } as CSSProperties);
const PURPLE = '#8b6cff';
const CYAN = '#22d3ee';

function KF() {
  return (
    <style>{`
@keyframes fsPulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.0)}50%{box-shadow:0 0 0 6px rgba(251,191,36,.35)}}
@keyframes fsPop{from{transform:scale(.6);opacity:0}}
@keyframes fsShake{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes fsDash{to{stroke-dashoffset:-24}}
@keyframes fsSpin{to{transform:rotate(360deg)}}
`}</style>
  );
}

function Line({ children, color, icon }: { children: ReactNode; color?: string; icon?: string }) {
  return (
    <div className="row small" style={{ padding: '8px 12px', borderRadius: 12, background: 'var(--panel-2)', borderLeft: `3px solid ${color ?? 'var(--accent)'}`, alignItems: 'flex-start' }}>
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/* ===================================================================== */
/* 1.2.3  Root cause → error → defect → failure                          */
/* ===================================================================== */
type ChainKey = 'root' | 'error' | 'defect' | 'failure';
const CHAIN_DEF: Record<ChainKey, { icon: string; name: string; alias: string; def: string; color: string }> = {
  root: { icon: '🌱', name: 'Root cause', alias: 'the deep WHY', color: '#ffb703', def: 'A fundamental reason for the occurrence of a problem (e.g., a situation that leads to an error). Identified through root cause analysis, typically when a failure occurs or a defect is identified. Addressing (e.g., removing) it can prevent similar failures/defects or reduce their frequency.' },
  error: { icon: '🧠', name: 'Error', alias: 'a.k.a. mistake — human', color: '#f72585', def: 'A human mistake. Humans make errors because of time pressure, complexity of work products, processes, infrastructure or interactions — or simply because they are tired or lack adequate training.' },
  defect: { icon: '🐛', name: 'Defect', alias: 'a.k.a. fault, bug — in a work product', color: '#ff7a59', def: 'Lives in a work product: documentation (requirements spec, test script), source code, or a supporting work product such as a build file. Undetected defects in early work products often lead to defective work products later in the lifecycle.' },
  failure: { icon: '💥', name: 'Failure', alias: 'observed when executed', color: '#fb7185', def: 'If defective code is executed, the system may fail to do what it should, or do something it shouldn\'t. Some defects ALWAYS fail when executed, some only in SPECIFIC circumstances, and some NEVER fail.' },
};
interface Scen { label: string; root: string; error: string | null; defect: string; failure: string; inputs: { v: string; fail: boolean; why: string }[] }
const SCEN: Scen[] = [
  {
    label: '👵 Senior discount', root: 'Deadline crunch → time pressure, no time for a careful read',
    error: 'Developer reads "65 and older" as "older than 65"', defect: 'Code: if (age > 65) applyDiscount()', failure: 'A 65-year-old customer pays full price',
    inputs: [
      { v: 'age 30', fail: false, why: 'No discount expected, none given. The defect sits there silently.' },
      { v: 'age 65', fail: true, why: 'Expected the discount, got full price → FAILURE. Only this specific circumstance reveals the defect.' },
      { v: 'age 70', fail: false, why: 'Discount given correctly. The defect is executed but the result is still right.' },
    ],
  },
  {
    label: '📄 Wrong VAT in the spec', root: 'Analyst lacks adequate training in the tax domain',
    error: 'Analyst copies last year\'s VAT rate into the requirement', defect: 'Requirements spec states the old rate → code built faithfully from it', failure: 'Every invoice shows the wrong tax amount',
    inputs: [
      { v: 'any invoice', fail: true, why: 'This defect fails EVERY time it is executed. Note how a defect in an early work product (the spec) produced a defective later one (the code).' },
    ],
  },
  {
    label: '☢️ Radiation', root: 'Environmental condition: radiation / electromagnetic field',
    error: null, defect: 'Flipped bits corrupt the firmware', failure: 'Device behaves erratically in the field',
    inputs: [
      { v: 'power on', fail: true, why: 'Failures are NOT only caused by human errors: environmental conditions can cause defects in firmware too.' },
    ],
  },
];

export function CausalChain() {
  const [si, setSi] = useState(0);
  const [sel, setSel] = useState<ChainKey>('error');
  const [run, setRun] = useState<number | null>(null);
  const [rca, setRca] = useState(false);
  const s = SCEN[si];
  const keys: ChainKey[] = ['root', 'error', 'defect', 'failure'];
  const verbs = ['leads to', 'produces', 'may cause'];
  const res = run === null ? null : s.inputs[run];
  return (
    <div>
      <KF />
      <div className="row wrap" style={{ gap: 8 }}>
        <span className="small muted">Story:</span>
        {SCEN.map((x, i) => (
          <button key={x.label} className={`chip click ${i === si ? 'on' : ''}`} onClick={() => { setSi(i); setRun(null); setRca(false); }}>{x.label}</button>
        ))}
      </div>
      <div className="flow mt" key={si}>
        {keys.map((k, i) => {
          const d = CHAIN_DEF[k];
          const txt = s[k];
          const off = txt === null || (k === 'failure' && res !== null && !res.fail);
          const boom = k === 'failure' && res?.fail;
          return (
            <div key={k} style={{ display: 'contents' }}>
              {i > 0 && (
                <div className="flow-arrow" style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                  <span>➜</span><span className="tiny faint">{verbs[i - 1]}</span>
                </div>
              )}
              <div className={`node ${sel === k ? 'sel' : ''}`} onClick={() => setSel(k)}
                style={{ ...cv(d.color), flex: '1 1 0', minWidth: 130, opacity: off ? 0.35 : 1, animation: boom ? 'fsShake .5s' : 'fsPop .35s', animationDelay: boom ? '0s' : `${i * 0.12}s`, animationFillMode: 'both' }}>
                <div className="n-ico">{d.icon}</div>
                <div className="n-title">{d.name}</div>
                <div className="tiny faint">{d.alias}</div>
                <div className="small" style={{ marginTop: 6 }}><Secret>{txt ?? '— no human error here —'}</Secret></div>
              </div>
            </div>
          );
        })}
      </div>
      <div onClick={() => setRca((r) => !r)} className="small"
        style={{ cursor: 'pointer', marginTop: 4, padding: '8px 12px', borderRadius: 12, textAlign: 'center', border: `2px dashed ${rca ? '#ffb703' : 'var(--border-strong)'}`, background: rca ? 'rgba(255,183,3,0.10)' : undefined }}>
        {rca
          ? <>⟵⟵ 🔍 <b>Root cause analysis</b> traced the failure back to: <b style={{ color: '#ffb703' }}>{s.root}</b>. Remove it → fewer similar defects in future.</>
          : <>⟵ 🔍 Click to run <b>root cause analysis</b> (walk back from the failure)</>}
      </div>
      <div className="row wrap mt" style={{ gap: 8 }}>
        <span className="small"><b>▶ Execute the code with:</b></span>
        {s.inputs.map((x, i) => (
          <button key={x.v} className={`btn sm ${run === i ? 'primary' : ''}`} onClick={() => setRun(i)}>{x.v}</button>
        ))}
      </div>
      {res && <div className={`feedback ${res.fail ? 'no' : 'ok'}`}>{res.fail ? '💥 ' : '😶 No failure. '}{res.why}</div>}
      <div className="detail" style={cv(CHAIN_DEF[sel].color)}>
        <h4>{CHAIN_DEF[sel].icon} {CHAIN_DEF[sel].name} <span className="tiny faint">({CHAIN_DEF[sel].alias})</span></h4>
        <Secret>{CHAIN_DEF[sel].def}</Secret>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 1.1.2  Testing vs debugging swimlanes                                 */
/* ===================================================================== */
interface LaneStep { lane: 'test' | 'debug'; icon: string; t: string; note: string; skip?: boolean }
const DYN: LaneStep[] = [
  { lane: 'test', icon: '🧪', t: 'Dynamic test triggers a FAILURE', note: 'Testing (dynamic) can only TRIGGER failures caused by defects. It does not locate the defect.' },
  { lane: 'debug', icon: '🔁', t: 'Reproduce the failure', note: 'Debugging step 1: reproduction of the failure.' },
  { lane: 'debug', icon: '🩺', t: 'Diagnose = find the defect', note: 'Debugging step 2: diagnosis, finding the defect (the cause of the failure).' },
  { lane: 'debug', icon: '🔧', t: 'Fix the defect', note: 'Debugging step 3: fixing the defect. Debugging = find, analyze & eliminate causes.' },
  { lane: 'test', icon: '✅', t: 'Confirmation testing', note: 'Back to TESTING: did the fix solve the problem? Preferably done by the SAME person who performed the initial test.' },
  { lane: 'test', icon: '🕸️', t: 'Regression testing', note: 'Back to TESTING: is the fix causing failures in OTHER parts of the test object?' },
];
const STAT: LaneStep[] = [
  { lane: 'test', icon: '👓', t: 'Review / static analysis finds a DEFECT directly', note: 'Static testing finds defects DIRECTLY in the test object. It cannot cause failures (nothing is executed).' },
  { lane: 'debug', icon: '🚫', t: 'Reproduce', skip: true, note: 'Not needed: there is no failure to reproduce.' },
  { lane: 'debug', icon: '🚫', t: 'Diagnose', skip: true, note: 'Not needed: the defect has already been pinpointed.' },
  { lane: 'debug', icon: '🧹', t: 'Remove the defect', note: 'With static testing, debugging is only concerned with REMOVING the defect.' },
];

export function TestDebugLanes() {
  const [mode, setMode] = useState<'dyn' | 'stat'>('dyn');
  const [cur, setCur] = useState(0);
  const steps = mode === 'dyn' ? DYN : STAT;
  const laneColor = { test: CYAN, debug: '#ff7a59' };
  return (
    <div>
      <Tabs value={mode} onChange={(m) => { setMode(m); setCur(0); }} tabs={[{ id: 'dyn', label: '▶ Dynamic testing' }, { id: 'stat', label: '👓 Static testing' }]} />
      <div style={{ overflowX: 'auto' }} className="mt">
        <div style={{ display: 'grid', gridTemplateColumns: `96px repeat(${steps.length}, minmax(112px, 1fr))`, gap: 8, minWidth: 96 + steps.length * 120 }}>
          {(['test', 'debug'] as const).map((lane) => (
            <Fragment key={lane}>
              <div className="small" style={{ fontWeight: 800, display: 'grid', placeItems: 'center', textAlign: 'center', borderRadius: 12, padding: 6, background: `color-mix(in srgb, ${laneColor[lane]} 18%, transparent)`, color: laneColor[lane] }}>
                {lane === 'test' ? '🧪 TESTING' : '🔧 DEBUGGING'}
              </div>
              {steps.map((st, i) => st.lane === lane ? (
                <div key={i} className={`node ${i === cur ? 'sel' : ''}`} onClick={() => setCur(i)}
                  style={{ ...cv(laneColor[lane]), padding: 10, opacity: i > cur ? 0.25 : st.skip ? 0.55 : 1, transition: 'opacity .4s' }}>
                  <div style={{ fontSize: 24 }}>{st.icon}</div>
                  <div className="small" style={{ fontWeight: 600, textDecoration: st.skip ? 'line-through' : undefined }}>{st.t}</div>
                </div>
              ) : <div key={i} style={{ borderTop: '1px dashed var(--border)', alignSelf: 'center' }} />)}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="row wrap mt">
        <button className="btn sm" disabled={cur === 0} onClick={() => setCur((c) => c - 1)}>◀</button>
        <button className="btn sm primary" disabled={cur === steps.length - 1} onClick={() => setCur((c) => c + 1)}>Next step ▶</button>
        <span className="small"><b>Step {cur + 1}:</b> <Secret>{steps[cur].note}</Secret></span>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 1.3.1  Seven principles carousel (each with its own mini-toy)         */
/* ===================================================================== */
function Flashlight() {
  const [p, setP] = useState({ x: 90, y: 70 });
  const bugs: [number, number][] = [[40, 40], [100, 75], [150, 30], [205, 95], [255, 45], [285, 118], [60, 118], [170, 122]];
  const R = 36;
  const seen = bugs.filter(([x, y]) => Math.hypot(x - p.x, y - p.y) < R).length;
  return (
    <div>
      <svg viewBox="0 0 320 150" style={{ width: '100%', cursor: 'crosshair', borderRadius: 12, touchAction: 'none' }}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: ((e.clientX - r.left) / r.width) * 320, y: ((e.clientY - r.top) / r.height) * 150 }); }}>
        <defs><clipPath id="fs-beam"><circle cx={p.x} cy={p.y} r={R} /></clipPath></defs>
        <rect width="320" height="150" fill="#07081a" />
        <g clipPath="url(#fs-beam)">
          <rect width="320" height="150" fill="#4a4466" />
          {bugs.map(([x, y], i) => <text key={i} x={x} y={y} fontSize="18" textAnchor="middle" dominantBaseline="middle">🐛</text>)}
        </g>
        <circle cx={p.x} cy={p.y} r={R} fill="none" stroke="#fbbf24" strokeOpacity="0.7" />
      </svg>
      <div className="small muted">Move the flashlight (= your tests). Bugs in the beam: <b>{seen}</b>. Bugs in the dark: <b>?</b> Testing can never show that number is zero.</div>
    </div>
  );
}

function Exhaustive() {
  const [n, setN] = useState(4);
  const combos = Math.pow(10, n);
  const secs = combos / 1000;
  const human = secs < 60 ? `${secs < 1 ? secs.toFixed(2) : secs.toFixed(0)} seconds`
    : secs < 3600 ? `${(secs / 60).toFixed(0)} minutes`
      : secs < 86400 ? `${(secs / 3600).toFixed(1)} hours`
        : secs < 31536000 ? `${(secs / 86400).toFixed(0)} days`
          : `${Math.round(secs / 31536000).toLocaleString()} years`;
  return (
    <div className="col" style={{ gap: 8 }}>
      <label className="small">Input fields on one form: <b>{n}</b> (10 possible values each)</label>
      <input type="range" min={1} max={14} value={n} onChange={(e) => setN(+e.target.value)} />
      <div className="row wrap" style={{ gap: 4 }}>{Array.from({ length: n }).map((_, i) => <span key={i} className="chip">0‑9</span>)}</div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22 }}>{combos.toLocaleString()} combinations</div>
      <div className="small">At 1,000 tests per second: <b style={{ color: secs > 86400 ? 'var(--bad)' : 'var(--good)' }}>{human}</b></div>
      <div className="tiny faint">…and that's ONE form, valid digits only. Hence: test techniques, prioritization, risk-based testing.</div>
    </div>
  );
}

function EarlyCost() {
  const phases = ['Requirements', 'Design', 'Code', 'Test', 'Operation'];
  const h = [12, 24, 42, 66, 100];
  const [f, setF] = useState(0);
  return (
    <div>
      <div className="small">A defect is born in the <b>requirements</b>. Where do you find it?</div>
      <div className="row" style={{ alignItems: 'flex-end', height: 120, gap: 6, marginTop: 8 }}>
        {phases.map((p, i) => (
          <div key={p} onClick={() => setF(i)} style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}>
            <div className="tiny">{i <= f ? '❌' : ''}</div>
            <div style={{ height: h[i], borderRadius: 8, transition: 'all .4s', background: i === f ? 'var(--bad)' : i < f ? 'color-mix(in srgb, var(--bad) 35%, transparent)' : 'var(--panel-2)', border: '1px solid var(--border)' }} />
          </div>
        ))}
      </div>
      <div className="row" style={{ gap: 6 }}>{phases.map((p, i) => <div key={p} className="tiny center" style={{ flex: 1, fontWeight: i === f ? 800 : 400 }}>{p}</div>)}</div>
      <div className="small mt">
        {f === 0
          ? '✅ Found in the spec: fix one sentence. No derived work product is affected.'
          : `❌ ${f} derived work product${f > 1 ? 's' : ''} built on the defect (${phases.slice(1, f + 1).join(', ')}) must be reworked${f === 4 ? ' — and real users saw failures.' : '.'}`}
      </div>
      <div className="tiny faint">Bar height = relative cost (illustrative). Click a phase.</div>
    </div>
  );
}

function Clusters() {
  const mods: [string, string, number][] = [['🔐', 'Login', 3], ['🛒', 'Cart', 2], ['💳', 'Payment', 21], ['🔎', 'Search', 1], ['🧾', 'Invoicing', 14], ['👤', 'Profile', 1]];
  const total = mods.reduce((s, m) => s + m[2], 0);
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="grid g3" style={{ gap: 8 }}>
        {mods.map(([i, n, d]) => (
          <div key={n} className="node" style={{ padding: 10, background: show ? `rgba(251,113,133,${0.08 + (d / 21) * 0.6})` : undefined, transition: 'background .5s' }}>
            <div style={{ fontSize: 22 }}>{i}</div><div className="small" style={{ fontWeight: 700 }}>{n}</div>
            {show && <div className="tiny">{'🐞'.repeat(Math.min(d, 6))}{d > 6 ? ` ×${d}` : ''}</div>}
          </div>
        ))}
      </div>
      <button className="btn sm mt" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'} defect heat map 🔥</button>
      {show && <div className="small mt">2 of 6 components hold <b>{Math.round(((21 + 14) / total) * 100)}%</b> of the defects (Pareto). Predicted & observed clusters feed <b>risk-based testing</b>.</div>}
    </div>
  );
}

function WearOut() {
  const [runs, setRuns] = useState<{ n: number; fresh: boolean }[]>([{ n: 9, fresh: true }]);
  const last = runs[runs.length - 1].n;
  const max = 10;
  return (
    <div>
      <div className="small">New defects found per run of the suite:</div>
      <div className="row" style={{ alignItems: 'flex-end', height: 110, gap: 4, marginTop: 6, overflowX: 'auto' }}>
        {runs.map((r, i) => (
          <div key={i} style={{ flex: '0 0 22px', textAlign: 'center' }}>
            <div className="tiny">{r.n}</div>
            <div style={{ height: Math.max(3, (r.n / max) * 90), borderRadius: 6, background: r.fresh ? 'var(--good)' : 'var(--warn)', animation: 'fsPop .3s' }} />
          </div>
        ))}
      </div>
      <div className="row wrap mt" style={{ gap: 6 }}>
        <button className="btn sm" disabled={runs.length > 14} onClick={() => setRuns((r) => [...r, { n: Math.floor(last / 2), fresh: false }])}>🔁 Run the SAME tests again</button>
        <button className="btn sm primary" disabled={runs.length > 14} onClick={() => setRuns((r) => [...r, { n: 7, fresh: true }])}>✏️ Modify tests & data / add new ones</button>
        <button className="btn sm ghost" onClick={() => setRuns([{ n: 9, fresh: true }])}>↺</button>
      </div>
      <div className="tiny faint mt">Exception: repeating the same tests is beneficial for automated REGRESSION testing.</div>
    </div>
  );
}

function ContextToy() {
  const ctx = [
    { icon: '🫀', name: 'Pacemaker firmware', how: 'Safety-critical & regulated → rigorous techniques, high coverage, detailed testware, high independence.' },
    { icon: '🎮', name: 'Casual mobile game', how: 'Time-to-market rules → lightweight testware, exploratory sessions, beta testing with players.' },
    { icon: '🏦', name: 'Online banking', how: 'Security & regulation → strong security testing, heavy automated regression, traceability for audits.' },
  ];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>{ctx.map((c, j) => <button key={c.name} className={`chip click ${i === j ? 'on' : ''}`} onClick={() => setI(j)}>{c.icon} {c.name}</button>)}</div>
      <div className="center" style={{ fontSize: 64, marginTop: 10 }} key={i}><span style={{ display: 'inline-block', animation: 'fsPop .35s' }}>{ctx[i].icon}</span></div>
      <div className="small center">{ctx[i].how}</div>
      <div className="tiny faint center mt">Example contexts. There is NO single universally applicable approach.</div>
    </div>
  );
}

function Fallacy() {
  const [ask, setAsk] = useState(false);
  return (
    <div>
      <div className="col" style={{ gap: 6 }}>
        {['REQ-1 Fax invoices to customers', 'REQ-2 Print a monthly paper report', 'REQ-3 Export data to floppy disk'].map((r) => <Line key={r} color="var(--good)" icon="✅">{r}</Line>)}
        <div className="row"><span className="chip good">🏆 All specified requirements tested</span><span className="chip good">0 open defects</span></div>
      </div>
      <button className="btn sm mt" onClick={() => setAsk((a) => !a)}>{ask ? 'Hide' : '🗣️ Ask the users (validation)'}</button>
      {ask && <div className="feedback no">😞 "We needed e-mail invoices and a mobile app. The competitor has both." Verified ≠ successful. <b>Validation</b> is needed too.</div>}
    </div>
  );
}

const PRINCIPLES: { icon: string; title: string; text: string; hook: string; Img: () => ReactNode }[] = [
  { icon: '🔦', title: 'Testing shows the presence, not the absence of defects', Img: Flashlight, hook: 'A flashlight shows bugs where it shines. It never proves the dark is empty.', text: 'Testing can show that defects are present, but cannot prove there are none. It reduces the probability of undiscovered defects, but even if no defects are found, it cannot prove correctness.' },
  { icon: '♾️', title: 'Exhaustive testing is impossible', Img: Exhaustive, hook: 'Infinity doesn\'t fit in a sprint. Focus instead.', text: 'Testing everything is not feasible except in trivial cases. Instead, use test techniques, test case prioritization and risk-based testing to focus the effort.' },
  { icon: '⏰', title: 'Early testing saves time and money', Img: EarlyCost, hook: 'Fix the crack in the blueprint, not in the skyscraper.', text: 'Defects removed early do not cause subsequent defects in derived work products. Cost of quality drops because fewer failures occur later. Start BOTH static and dynamic testing as early as possible.' },
  { icon: '🍇', title: 'Defects cluster together', Img: Clusters, hook: 'Bugs are like grapes: they come in bunches (Pareto).', text: 'A small number of components usually contain most of the defects or cause most operational failures (Pareto principle). Predicted and actual clusters are an important input for risk-based testing.' },
  { icon: '🥾', title: 'Tests wear out', Img: WearOut, hook: 'Old boots lose their grip. Re-sole your tests. (Formerly: "pesticide paradox".)', text: 'Repeating the same tests makes them increasingly ineffective at detecting NEW defects. Modify existing tests and test data, write new tests. Exception: repeating tests is beneficial in automated regression testing.' },
  { icon: '🌍', title: 'Testing is context dependent', Img: ContextToy, hook: 'You don\'t test a pacemaker like a phone game.', text: 'There is no single universally applicable approach to testing. Testing is done differently in different contexts.' },
  { icon: '🪤', title: 'Absence-of-defects fallacy', Img: Fallacy, hook: 'A perfectly built bridge… to the wrong island.', text: 'It is a misconception that verification alone ensures success. A system with all specified requirements tested and all defects fixed may still not meet user needs, business goals, or be inferior to competitors. Validation must also be carried out.' },
];

export function PrinciplesCarousel() {
  const [i, setI] = useState(0);
  const p = PRINCIPLES[i];
  const Img = p.Img;
  return (
    <div>
      <KF />
      <div className="row wrap" style={{ gap: 6 }}>
        {PRINCIPLES.map((x, j) => (
          <button key={x.title} className={`chip click ${j === i ? 'on' : ''}`} onClick={() => setI(j)} title={x.title}>{j + 1} {x.icon}</button>
        ))}
      </div>
      <div className="grid g2 mt" style={{ alignItems: 'center', animation: 'fsPop .3s' }} key={i}>
        <div className="col">
          <div className="kicker">Principle {i + 1} of 7</div>
          <h3 style={{ fontSize: 22 }}><span style={{ fontSize: 30 }}>{p.icon}</span> {p.title}</h3>
          <div className="small"><Secret>{p.text}</Secret></div>
          <div className="hook small"><span className="h-ico" style={{ fontSize: 20 }}>💡</span><span>{p.hook}</span></div>
        </div>
        <div className="card flat"><Img /></div>
      </div>
      <div className="row mt">
        <button className="btn sm" disabled={i === 0} onClick={() => setI(i - 1)}>◀ Prev</button>
        <div className="spacer" />
        <span className="tiny faint">P-E-E-D-T-C-A · "Please Explain Early Defects; Tests Change Always"</span>
        <div className="spacer" />
        <button className="btn sm primary" disabled={i === PRINCIPLES.length - 1} onClick={() => setI(i + 1)}>Next ▶</button>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 1.4.1 / 1.4.3 / 1.4.5  Test process map (tasks · testware · roles)    */
/* ===================================================================== */
type ActId = 'plan' | 'mc' | 'ana' | 'des' | 'imp' | 'exe' | 'comp';
const ACTS: Record<ActId, { icon: string; name: string; q?: string; color: string; role: 'mgmt' | 'test'; tasks: string[]; ware: string[] }> = {
  plan: { icon: '🗺️', name: 'Planning', color: '#8b6cff', role: 'mgmt', q: 'WHY & with what approach?',
    tasks: ['Define the test objectives', 'Select an approach that best achieves the objectives within the constraints of the overall context'],
    ware: ['Test plan', 'Test schedule', 'Risk register (risks + likelihood, impact, mitigation)', 'Entry criteria & exit criteria', '(Schedule, risk register, entry/exit criteria are often PART of the test plan)'] },
  mc: { icon: '📡', name: 'Monitoring & control', color: '#ffb703', role: 'mgmt', q: 'On track? Steer!',
    tasks: ['Monitoring: ongoing checking of ALL test activities', 'Monitoring: compare actual progress against the plan', 'Control: take the actions necessary to meet the test objectives'],
    ware: ['Test progress reports', 'Documentation of control directives', 'Information about risks'] },
  ana: { icon: '🔍', name: 'Analysis', color: '#22d3ee', role: 'test', q: 'WHAT to test?',
    tasks: ['Analyze the test basis to identify testable features', 'Define & prioritize associated test conditions, considering risks and risk levels', 'Evaluate the test basis & test object to find defects and assess testability', 'Often supported by test techniques', 'Answers "what to test?" in terms of measurable coverage criteria'],
    ware: ['(Prioritized) test conditions — e.g., acceptance criteria', 'Defect reports about defects in the TEST BASIS (if not fixed directly)'] },
  des: { icon: '📐', name: 'Design', color: '#2ec4b6', role: 'test', q: 'HOW to test?',
    tasks: ['Elaborate test conditions into test cases and other testware (e.g., test charters)', 'Identify coverage items (a guide to specify test case inputs)', 'Define test data REQUIREMENTS', 'Design the test environment; identify needed infrastructure & tools', 'Answers "how to test?"'],
    ware: ['(Prioritized) test cases', 'Test charters', 'Coverage items', 'Test data REQUIREMENTS', 'Test environment REQUIREMENTS'] },
  imp: { icon: '🧰', name: 'Implementation', color: '#43c59e', role: 'test', q: 'Get it READY to run',
    tasks: ['Create or acquire the testware needed for execution (e.g., test data)', 'Organize test cases into test procedures, often assembled into test suites', 'Create manual and automated test scripts', 'Prioritize & arrange test procedures in a test execution schedule', 'Build the test environment and verify it is set up correctly'],
    ware: ['Test procedures', 'Manual & automated test scripts', 'Test suites', 'Test DATA (the actual data)', 'Test execution schedule', 'Test environment items: stubs, drivers, simulators, service virtualizations'] },
  exe: { icon: '▶️', name: 'Execution', color: '#ff7a59', role: 'test', q: 'RUN & compare',
    tasks: ['Run tests per the execution schedule (test runs) — manual or automated; e.g., continuous testing, pair testing sessions', 'Compare actual results with expected results', 'Log the test results', 'Analyze anomalies to identify their likely causes', 'Report anomalies based on the failures observed'],
    ware: ['Test logs', 'Defect reports'] },
  comp: { icon: '🏁', name: 'Completion', color: '#f72585', role: 'mgmt', q: 'Wrap up & learn',
    tasks: ['Usually at milestones: release, end of iteration, test level completion', 'Create change requests or product backlog items for unresolved defects', 'Identify useful testware → archive it or hand it over to the appropriate teams', 'Shut down the test environment to an agreed state', 'Analyze test activities → lessons learned & improvements', 'Create and communicate a test completion report to stakeholders'],
    ware: ['Test completion report', 'Action items for improvement of subsequent projects/iterations', 'Documented lessons learned', 'Change requests (e.g., as product backlog items)'] },
};
const FLOW_IDS: ActId[] = ['plan', 'ana', 'des', 'imp', 'exe', 'comp'];

export function TestProcessMap({ initial = 'tasks' }: { initial?: 'tasks' | 'ware' | 'roles' }) {
  const [mode, setMode] = useState<'tasks' | 'ware' | 'roles'>(initial);
  const [sel, setSel] = useState<ActId>(initial === 'roles' ? 'plan' : 'ana');
  const colorOf = (id: ActId) => (mode === 'roles' ? (ACTS[id].role === 'mgmt' ? PURPLE : CYAN) : ACTS[id].color);
  const a = ACTS[sel];
  const node = (id: ActId) => (
    <div className={`node ${sel === id ? 'sel' : ''}`} onClick={() => setSel(id)} style={{ ...cv(colorOf(id)), flex: '1 1 0', minWidth: 112, padding: 10, borderTop: `4px solid ${colorOf(id)}` }}>
      <div style={{ fontSize: 26 }}>{ACTS[id].icon}</div>
      <div className="n-title" style={{ fontSize: 14 }}>{ACTS[id].name}</div>
      {mode === 'roles'
        ? <div className="tiny" style={{ color: colorOf(id), fontWeight: 700 }}>{ACTS[id].role === 'mgmt' ? '🧭 test mgmt' : '🔧 testing'}</div>
        : <div className="tiny faint"><Secret>{ACTS[id].q}</Secret></div>}
    </div>
  );
  return (
    <div>
      <Tabs value={mode} onChange={setMode} tabs={[{ id: 'tasks', label: '🛠️ Tasks' }, { id: 'ware', label: '📦 Testware produced' }, { id: 'roles', label: '🎭 Who leads it' }]} />
      <div className="flow mt">
        {FLOW_IDS.map((id, i) => (
          <div key={id} style={{ display: 'contents' }}>
            {i > 0 && <div className="flow-arrow">➜</div>}
            {node(id)}
          </div>
        ))}
      </div>
      <div className={`node ${sel === 'mc' ? 'sel' : ''}`} onClick={() => setSel('mc')}
        style={{ ...cv(colorOf('mc')), padding: '8px 12px', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' }}>
        <span style={{ fontSize: 22 }}>📡</span>
        <b style={{ fontFamily: 'var(--display)' }}>Test monitoring & control</b>
        <span className="small muted">— runs alongside ALL the other activities {mode === 'roles' && <b style={{ color: PURPLE }}>· 🧭 test mgmt</b>}</span>
      </div>
      <div className="center tiny faint" style={{ marginTop: 6 }}>↺ Looks sequential, but activities are often iterative or in parallel, and tailored to the system & project.</div>
      <div className="detail" style={cv(colorOf(sel))}>
        <h4>{a.icon} Test {a.name.toLowerCase()} {a.q && mode === 'tasks' && <span className="chip">{a.q}</span>}</h4>
        {mode === 'tasks' && <ul>{a.tasks.map((t) => <Secret as="li" key={t}>{t}</Secret>)}</ul>}
        {mode === 'ware' && <ul>{a.ware.map((t) => <Secret as="li" key={t}>📄 {t}</Secret>)}</ul>}
        {mode === 'roles' && (
          <div className="small">
            {a.role === 'mgmt'
              ? <Secret>🧭 <b>Test management role</b>: overall responsibility for the test process, test team and leadership of test activities. Mainly planning, monitoring, control and completion. In Agile, some of these tasks may be handled by the Agile team; tasks spanning several teams or the whole organization may be done by test managers outside the dev team.</Secret>
              : <Secret>🔧 <b>Testing role</b>: overall responsibility for the engineering (technical) aspect of testing. Mainly analysis, design, implementation and execution.</Secret>}
          </div>
        )}
      </div>
      {mode === 'roles' && (
        <div className="grid g2 mt">
          <Line icon="🎩" color={PURPLE}><Secret>The management role can be played by a team leader, a test manager, a development manager, etc.</Secret></Line>
          <Line icon="🤹" color={CYAN}><Secret>One person may hold BOTH roles at the same time. Tasks per role depend on project & product context, people's skills and the organization.</Secret></Line>
        </div>
      )}
    </div>
  );
}

/* ===================================================================== */
/* 1.4.3  Testware sorter game                                           */
/* ===================================================================== */
const WARE: [string, ActId][] = [
  ['Test plan', 'plan'], ['Risk register', 'plan'], ['Entry & exit criteria', 'plan'], ['Test schedule', 'plan'],
  ['Test progress report', 'mc'], ['Documented control directives', 'mc'],
  ['Prioritized test conditions (e.g., acceptance criteria)', 'ana'], ['Defect report about an ambiguous requirement', 'ana'],
  ['Test cases', 'des'], ['Test charters', 'des'], ['Coverage items', 'des'], ['Test data requirements', 'des'], ['Test environment requirements', 'des'],
  ['Test procedures', 'imp'], ['Automated test scripts', 'imp'], ['Test suites', 'imp'], ['Test data', 'imp'], ['Test execution schedule', 'imp'], ['Stubs, drivers & service virtualization', 'imp'],
  ['Test logs', 'exe'], ['Defect report for a failure seen in a test run', 'exe'],
  ['Test completion report', 'comp'], ['Documented lessons learned', 'comp'], ['Backlog items for unresolved defects', 'comp'],
];
const ACT_ORDER: ActId[] = ['plan', 'mc', 'ana', 'des', 'imp', 'exe', 'comp'];

export function TestwareSorter() {
  const [order, setOrder] = useState(() => shuffle(WARE.map((_, i) => i)).slice(0, 12));
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<ActId | null>(null);
  const done = pos >= order.length;
  const item = done ? null : WARE[order[pos]];
  const choose = (a: ActId) => {
    if (pick || !item) return;
    setPick(a);
    if (a === item[1]) setScore((s) => s + 1);
  };
  const restart = () => { setOrder(shuffle(WARE.map((_, i) => i)).slice(0, 12)); setPos(0); setScore(0); setPick(null); };
  return (
    <div className="card flat">
      <div className="row"><b>🎯 Which activity produces this?</b><div className="spacer" /><span className="chip">{Math.min(pos + 1, order.length)} / {order.length}</span><span className="chip good">⭐ {score}</span></div>
      {item ? (
        <>
          <div className="center" style={{ margin: '16px 0', fontSize: 20, fontFamily: 'var(--display)', fontWeight: 700 }} key={pos}>
            <span style={{ display: 'inline-block', animation: 'fsPop .3s' }}>📄 {item[0]}</span>
          </div>
          <div className="row wrap" style={{ justifyContent: 'center', gap: 6 }}>
            {ACT_ORDER.map((a) => {
              const st = !pick ? '' : a === item[1] ? 'ok' : a === pick ? 'no' : '';
              return <button key={a} className={`token ${st}`} onClick={() => choose(a)} style={{ cursor: pick ? 'default' : 'pointer' }}>{ACTS[a].icon} {ACTS[a].name}</button>;
            })}
          </div>
          {pick && (
            <div className={`feedback ${pick === item[1] ? 'ok' : 'no'}`}>
              {pick === item[1] ? '✅ Right: ' : `❌ It's test ${ACTS[item[1]].name.toLowerCase()}: `}
              {item[1] === 'des' && item[0].includes('requirements') ? 'design defines the REQUIREMENTS; implementation creates the real data/environment items.' : `produced by test ${ACTS[item[1]].name.toLowerCase()}.`}
              <button className="btn sm" style={{ marginLeft: 10 }} onClick={() => { setPos((p) => p + 1); setPick(null); }}>Next ▶</button>
            </div>
          )}
        </>
      ) : (
        <div className="center mt">
          <div style={{ fontSize: 44 }}>{score >= 10 ? '🏆' : score >= 7 ? '👍' : '🔁'}</div>
          <b>{score} / {order.length}</b>
          <div><button className="btn sm primary mt" onClick={restart}>Play again</button></div>
        </div>
      )}
    </div>
  );
}

/* ===================================================================== */
/* 1.4.4  Traceability graph                                             */
/* ===================================================================== */
type TKind = 'req' | 'risk' | 'cond' | 'case' | 'pass' | 'fail' | 'defect';
interface TN { id: string; col: number; y: number; label: string; kind: TKind }
const TCOL = ['Test basis & risks', 'Test conditions', 'Test cases', 'Test results', 'Defects'];
const TKC: Record<TKind, string> = { req: '#8b6cff', risk: '#ffb703', cond: '#22d3ee', case: '#2ec4b6', pass: '#34d399', fail: '#fb7185', defect: '#f72585' };
const TNODES: TN[] = [
  { id: 'R1', col: 0, y: 30, label: 'REQ-1 Login', kind: 'req' },
  { id: 'R2', col: 0, y: 100, label: 'REQ-2 Transfer', kind: 'req' },
  { id: 'R3', col: 0, y: 170, label: 'REQ-3 PDF export', kind: 'req' },
  { id: 'K1', col: 0, y: 240, label: '⚠ Risk: fraud', kind: 'risk' },
  { id: 'C1', col: 1, y: 30, label: 'Valid/invalid login', kind: 'cond' },
  { id: 'C2', col: 1, y: 88, label: 'Lockout after 3 tries', kind: 'cond' },
  { id: 'C3', col: 1, y: 160, label: 'Transfer limits', kind: 'cond' },
  { id: 'C4', col: 1, y: 230, label: 'Currency conversion', kind: 'cond' },
  { id: 'T1', col: 2, y: 30, label: 'TC-1 wrong password', kind: 'case' },
  { id: 'T2', col: 2, y: 82, label: 'TC-2 3 bad tries', kind: 'case' },
  { id: 'T3', col: 2, y: 134, label: 'TC-3 limit + 1 €', kind: 'case' },
  { id: 'T4', col: 2, y: 186, label: 'TC-4 limit exactly', kind: 'case' },
  { id: 'T5', col: 2, y: 240, label: 'TC-5 EUR → USD', kind: 'case' },
  { id: 'X1', col: 3, y: 30, label: '✅ TC-1 passed', kind: 'pass' },
  { id: 'X2', col: 3, y: 82, label: '✅ TC-2 passed', kind: 'pass' },
  { id: 'X3', col: 3, y: 134, label: '❌ TC-3 failed', kind: 'fail' },
  { id: 'X4', col: 3, y: 186, label: '✅ TC-4 passed', kind: 'pass' },
  { id: 'X5', col: 3, y: 240, label: '✅ TC-5 passed', kind: 'pass' },
  { id: 'D1', col: 4, y: 134, label: '🐞 DEF-7 limit bypass', kind: 'defect' },
];
const TEDGES: [string, string][] = [
  ['R1', 'C1'], ['R1', 'C2'], ['K1', 'C2'], ['R2', 'C3'], ['K1', 'C3'], ['R2', 'C4'],
  ['C1', 'T1'], ['C2', 'T2'], ['C3', 'T3'], ['C3', 'T4'], ['C4', 'T5'],
  ['T1', 'X1'], ['T2', 'X2'], ['T3', 'X3'], ['T4', 'X4'], ['T5', 'X5'], ['X3', 'D1'],
];
const walk = (start: string, dir: 'up' | 'down') => {
  const out = new Set<string>();
  const st = [start];
  while (st.length) {
    const n = st.pop()!;
    for (const [a, b] of TEDGES) {
      const nxt = dir === 'down' ? (a === n ? b : null) : (b === n ? a : null);
      if (nxt && !out.has(nxt)) { out.add(nxt); st.push(nxt); }
    }
  }
  return out;
};
const TQ = [
  { id: 'cover', icon: '📏', q: 'Are all requirements covered by test cases?', a: 'REQ-3 has no test conditions and no test cases → a coverage gap. Tracing test cases to requirements verifies that requirements are covered.' },
  { id: 'risk', icon: '🎯', q: 'What is the residual risk for "fraud"?', a: 'Results traced to the risk show 1 failed test + an open defect → residual risk remains. Tracing test results to risks evaluates the level of residual risk.' },
  { id: 'impact', icon: '💥', q: 'REQ-2 changes. What is impacted?', a: '2 conditions, 3 test cases, their results and a defect must be revisited. Traceability lets you determine the impact of changes.' },
  { id: 'audit', icon: '🕵️', q: 'Auditor: why does TC-4 exist?', a: 'TC-4 → "Transfer limits" → REQ-2 and the fraud risk. Traceability facilitates audits and helps meet IT governance criteria.' },
] as const;
type TQId = (typeof TQ)[number]['id'];

export function TraceGraph() {
  const [node, setNode] = useState<string | null>(null);
  const [q, setQ] = useState<TQId | null>(null);
  let lit = new Set<string>();
  let bad = new Set<string>();
  if (node) lit = new Set([node, ...walk(node, 'up'), ...walk(node, 'down')]);
  if (q === 'cover') { lit = new Set(['R1', 'R2', 'R3', ...walk('R1', 'down'), ...walk('R2', 'down')]); bad = new Set(['R3']); }
  if (q === 'risk') { lit = new Set(['K1', ...walk('K1', 'down')]); bad = new Set(['X3', 'D1']); }
  if (q === 'impact') lit = new Set(['R2', ...walk('R2', 'down')]);
  if (q === 'audit') lit = new Set(['T4', ...walk('T4', 'up')]);
  const any = lit.size > 0;
  const X = (c: number) => 6 + c * 152;
  const W = 140, H = 30;
  const pos = Object.fromEntries(TNODES.map((n) => [n.id, n]));
  return (
    <div>
      <KF />
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 760 282" style={{ width: '100%', minWidth: 620 }}>
          {TCOL.map((t, i) => <text key={t} x={X(i) + W / 2} y={16} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--muted)">{t}</text>)}
          {TEDGES.map(([a, b]) => {
            const A = pos[a], B = pos[b];
            const on = any && lit.has(a) && lit.has(b);
            const x1 = X(A.col) + W, y1 = A.y + H / 2, x2 = X(B.col), y2 = B.y + H / 2;
            return <path key={a + b} d={`M${x1} ${y1} C ${x1 + 20} ${y1}, ${x2 - 20} ${y2}, ${x2} ${y2}`} fill="none"
              stroke={on ? 'var(--text)' : 'var(--border-strong)'} strokeWidth={on ? 2 : 1.2} opacity={any && !on ? 0.25 : 1}
              strokeDasharray={on ? '6 6' : undefined} style={on ? { animation: 'fsDash 1s linear infinite' } : undefined} />;
          })}
          {TNODES.map((n) => {
            const c = bad.has(n.id) ? '#fb7185' : TKC[n.kind];
            const dim = any && !lit.has(n.id);
            return (
              <g key={n.id} style={{ cursor: 'pointer' }} opacity={dim ? 0.25 : 1} onClick={() => { setQ(null); setNode(node === n.id ? null : n.id); }}>
                <rect x={X(n.col)} y={n.y} width={W} height={H} rx={8} style={{ fill: `color-mix(in srgb, ${c} ${node === n.id || bad.has(n.id) ? 40 : 16}%, var(--panel-solid))` }}
                  stroke={c} strokeWidth={node === n.id || bad.has(n.id) ? 2.5 : 1.2} />
                <text x={X(n.col) + W / 2} y={n.y + H / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="600">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="tiny faint center">Click any box to trace it both ways ⇆, or ask the graph a question:</div>
      <div className="row wrap mt" style={{ gap: 6, justifyContent: 'center' }}>
        {TQ.map((x) => <button key={x.id} className={`btn sm ${q === x.id ? 'primary' : ''}`} onClick={() => { setNode(null); setQ(q === x.id ? null : x.id); }}>{x.icon} {x.q}</button>)}
      </div>
      {q && <div className="detail" style={cv(PURPLE)}><Secret>{TQ.find((x) => x.id === q)!.a}</Secret></div>}
    </div>
  );
}

/* ===================================================================== */
/* 1.5.3  Independence ladder                                            */
/* ===================================================================== */
const IND = [
  { icon: '🧑‍💻', lvl: 'No independence', who: 'The AUTHOR tests their own work product', bias: 12, close: 95 },
  { icon: '👥', lvl: 'Some independence', who: 'The author\'s PEERS from the same team', bias: 40, close: 72 },
  { icon: '🏢', lvl: 'High independence', who: 'Testers OUTSIDE the author\'s team but INSIDE the organization', bias: 70, close: 42 },
  { icon: '🌍', lvl: 'Very high independence', who: 'Testers from OUTSIDE the organization', bias: 95, close: 15 },
];

export function IndependenceLadder() {
  const [lv, setLv] = useState(0);
  const rungY = (i: number) => 220 - i * 56;
  const L = IND[lv];
  const meter = (label: string, v: number, c: string) => (
    <div>
      <div className="small row"><span>{label}</span><div className="spacer" /></div>
      <div className="bar"><i style={{ width: `${v}%`, background: c }} /></div>
    </div>
  );
  return (
    <div>
      <div className="grid g2" style={{ alignItems: 'center' }}>
        <svg viewBox="0 0 220 250" style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}>
          <line x1="50" y1="15" x2="50" y2="245" stroke="var(--border-strong)" strokeWidth="6" strokeLinecap="round" />
          <line x1="170" y1="15" x2="170" y2="245" stroke="var(--border-strong)" strokeWidth="6" strokeLinecap="round" />
          {IND.map((x, i) => (
            <g key={x.lvl} style={{ cursor: 'pointer' }} onClick={() => setLv(i)}>
              <rect x="40" y={rungY(i) - 14} width="140" height="28" fill="transparent" />
              <line x1="50" y1={rungY(i)} x2="170" y2={rungY(i)} stroke={i <= lv ? PURPLE : 'var(--border-strong)'} strokeWidth={i === lv ? 7 : 4} strokeLinecap="round" />
              <text x="190" y={rungY(i) + 5} fontSize="16">{x.icon}</text>
            </g>
          ))}
          <g style={{ transform: `translateY(${rungY(lv) - 220}px)`, transition: 'transform .6s cubic-bezier(.3,1.4,.5,1)' }}>
            <text x="110" y="212" fontSize="26" textAnchor="middle">🧗</text>
          </g>
        </svg>
        <div className="col">
          <div className="kicker">Rung {lv + 1} of 4</div>
          <h3>{L.icon} {L.lvl}</h3>
          <div className="small"><Secret>{L.who}</Secret></div>
          {meter('👀 Different biases → spots different defects', L.bias, 'var(--good)')}
          {meter('🤝 Familiarity & closeness to the dev team', L.close, CYAN)}
          <div className="tiny faint">Meters are illustrative. Click the rungs.</div>
        </div>
      </div>
      <div className="grid g2 mt">
        <div className="vs-col" style={{ borderTop: '4px solid var(--good)' }}>
          <b className="pro">✚ Benefits</b>
          <ul className="small">
            <Secret as="li">Recognizes DIFFERENT kinds of failures & defects than developers (different backgrounds, technical perspectives, biases)</Secret>
            <Secret as="li">Can verify, challenge or disprove assumptions made by stakeholders during specification & implementation</Secret>
          </ul>
        </div>
        <div className="vs-col" style={{ borderTop: '4px solid var(--bad)' }}>
          <b className="con">✖ Drawbacks</b>
          <ul className="small">
            <Secret as="li">Isolation from the dev team → lack of collaboration, communication problems, adversarial relationship</Secret>
            <Secret as="li">Developers may lose their sense of responsibility for quality</Secret>
            <Secret as="li">Seen as a bottleneck, or blamed for release delays</Secret>
          </ul>
        </div>
      </div>
      <div className="mt small"><b>🧩 Best for most projects: MULTIPLE levels</b></div>
      <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
        <span className="chip">🧑‍💻 Developers → component & component integration testing</span>
        <span className="chip">🏢 Test team → system & system integration testing</span>
        <span className="chip">💼 Business representatives → acceptance testing</span>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.1.1  SDLC impact timelines                                          */
/* ===================================================================== */
export function SdlcTimeline() {
  const [m, setM] = useState<'seq' | 'it' | 'ag'>('seq');
  return (
    <div>
      <Tabs value={m} onChange={setM} tabs={[{ id: 'seq', label: '🪜 Sequential' }, { id: 'it', label: '🔁 Iterative / incremental' }, { id: 'ag', label: '🏃 Agile' }]} />
      <div className="mt" key={m} style={{ animation: 'fsPop .3s' }}>
        <KF />
        {m === 'seq' && (
          <svg viewBox="0 0 520 165" style={{ width: '100%' }}>
            <rect x="10" y="12" width="300" height="24" rx="8" fill="rgba(52,211,153,0.2)" stroke="#34d399" />
            <text x="160" y="28" textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="700">👓 Static: requirement reviews, test analysis & design</text>
            <rect x="214" y="44" width="300" height="24" rx="8" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" />
            <text x="364" y="60" textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="700">▶ Dynamic testing — only once code exists</text>
            {['Requirements', 'Design', 'Code', 'Test', 'Deploy'].map((p, i) => (
              <g key={p}>
                <rect x={10 + i * 102} y={84} width="96" height="32" rx="8" fill="var(--panel-2)" stroke="var(--border-strong)" />
                <text x={58 + i * 102} y={104} textAnchor="middle" fontSize="12" fill="var(--text)" fontWeight="600">{p}</text>
                {i < 4 && <text x={106 + i * 102} y={104} fontSize="12" fill="var(--faint)">›</text>}
              </g>
            ))}
            <line x1="10" y1="140" x2="505" y2="140" stroke="var(--faint)" />
            <text x="505" y="156" textAnchor="end" fontSize="10" fill="var(--faint)">time ➜ (e.g., waterfall, V-model)</text>
          </svg>
        )}
        {m === 'it' && (
          <svg viewBox="0 0 520 165" style={{ width: '100%' }}>
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <rect x={10 + k * 170} y={10} width="160" height="92" rx="12" fill="var(--panel-2)" stroke="#22d3ee" />
                <text x={90 + k * 170} y={30} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text)">Increment {k + 1} 📦</text>
                {['R', 'D', 'C', 'T'].map((p, j) => (
                  <g key={p}><circle cx={40 + k * 170 + j * 34} cy={54} r={12} fill="rgba(139,108,255,0.25)" stroke="#8b6cff" /><text x={40 + k * 170 + j * 34} y={58} textAnchor="middle" fontSize="11" fill="var(--text)">{p}</text></g>
                ))}
                <text x={90 + k * 170} y={88} textAnchor="middle" fontSize="10" fill="#34d399">👓 static + ▶ dynamic, all levels</text>
                <rect x={10 + k * 170} y={112} width={50 + k * 55} height={16} rx="6" fill="rgba(251,191,36,0.3)" stroke="#fbbf24" style={{ animation: 'fsPop .5s', animationDelay: `${k * 0.2}s`, animationFillMode: 'both' }} />
                <text x={14 + k * 170} y={124} fontSize="9" fill="var(--text)">regression {'↑'.repeat(k + 1)}</text>
              </g>
            ))}
            <text x="260" y="152" textAnchor="middle" fontSize="10" fill="var(--faint)">Each iteration delivers a working prototype / increment → fast feedback + extensive regression testing</text>
          </svg>
        )}
        {m === 'ag' && (
          <div className="grid g2" style={{ alignItems: 'center' }}>
            <svg viewBox="0 0 200 160" style={{ width: '100%', maxWidth: 260, margin: '0 auto', display: 'block' }}>
              <circle cx="100" cy="80" r="56" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="20 10" style={{ animation: 'fsSpin 10s linear infinite', transformOrigin: '100px 80px' }} />
              <text x="100" y="76" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--text)">Sprint</text>
              <text x="100" y="94" textAnchor="middle" fontSize="10" fill="#22d3ee">change welcome anytime</text>
            </svg>
            <div className="col" style={{ gap: 6 }}>
              <Line icon="📝" color={CYAN}><Secret>LIGHTWEIGHT work product documentation</Secret></Line>
              <Line icon="🤖" color={CYAN}><Secret>EXTENSIVE test automation → easier regression testing</Secret></Line>
              <Line icon="🧭" color={CYAN}><Secret>Manual testing mostly uses EXPERIENCE-BASED techniques (little prior analysis & design)</Secret></Line>
            </div>
          </div>
        )}
      </div>
      <div className="mt small"><b>The SDLC you pick changes…</b></div>
      <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
        {['⏱️ Scope & timing of test activities (levels, types)', '📚 Level of detail of test documentation', '🧪 Choice of test techniques & approach', '🤖 Extent of test automation', '🎭 Role & responsibilities of a tester'].map((t) => <span key={t} className="chip"><Secret>{t}</Secret></span>)}
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.1.3  Test-first trio: TDD · ATDD · BDD                              */
/* ===================================================================== */
export function TestFirstTrio() {
  const [t, setT] = useState<'tdd' | 'atdd' | 'bdd'>('tdd');
  const [ph, setPh] = useState(0);
  const [exec, setExec] = useState(false);
  const TDD = [
    { c: '#fb7185', t: '1 · Write the test', s: 'Tests first (it fails — no code yet)' },
    { c: '#34d399', t: '2 · Write the code', s: 'Just enough code to satisfy the test' },
    { c: '#8b6cff', t: '3 · Refactor', s: 'Refactor BOTH tests and code' },
  ];
  const pts: [number, number][] = [[120, 34], [205, 160], [35, 160]];
  return (
    <div>
      <Tabs value={t} onChange={setT} tabs={[{ id: 'tdd', label: '🔴 TDD' }, { id: 'atdd', label: '🤝 ATDD' }, { id: 'bdd', label: '🗣️ BDD' }]} />
      <div className="mt">
        {t === 'tdd' && (
          <div className="grid g2" style={{ alignItems: 'center' }}>
            <svg viewBox="0 0 240 200" style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}>
              {pts.map(([x, y], i) => {
                const [nx, ny] = pts[(i + 1) % 3];
                const mx = (x + nx) / 2, my = (y + ny) / 2;
                const qx = mx + (mx - 120) * 0.6, qy = my + (my - 118) * 0.6;
                return <path key={i} d={`M${x} ${y} Q ${qx} ${qy} ${nx} ${ny}`} fill="none" stroke={i === ph ? TDD[i].c : 'var(--border-strong)'} strokeWidth={i === ph ? 3 : 1.5} strokeDasharray="5 5" />;
              })}
              {pts.map(([x, y], i) => (
                <g key={i} style={{ cursor: 'pointer' }} onClick={() => setPh(i)}>
                  <circle cx={x} cy={y} r={i === ph ? 30 : 24} stroke={TDD[i].c} strokeWidth="2" style={{ fill: `color-mix(in srgb, ${TDD[i].c} ${i === ph ? 55 : 20}%, transparent)`, transition: 'all .3s' }} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text)">{['TEST', 'CODE', 'REF'][i]}</text>
                </g>
              ))}
            </svg>
            <div className="col">
              <h3 style={{ color: TDD[ph].c }}>{TDD[ph].t}</h3>
              <div className="small">{TDD[ph].s}</div>
              <button className="btn sm primary" style={{ alignSelf: 'flex-start' }} onClick={() => setPh((p) => (p + 1) % 3)}>Next turn of the cycle ↻</button>
              <Line icon="🧭"><Secret>TDD directs the CODING through test cases (instead of extensive software design).</Secret></Line>
            </div>
          </div>
        )}
        {t === 'atdd' && (
          <div className="flow">
            {[
              { i: '📋', t: 'Acceptance criteria', s: 'agreed as part of SYSTEM DESIGN' },
              { i: '🧪', t: 'Derive the tests', s: 'from the acceptance criteria' },
              { i: '🛠️', t: 'Develop that part', s: 'to satisfy the tests' },
            ].map((x, i) => (
              <div key={x.t} style={{ display: 'contents' }}>
                {i > 0 && <div className="flow-arrow">➜</div>}
                <div className="node" style={{ ...cv('#2ec4b6'), flex: '1 1 0', minWidth: 130 }}><div className="n-ico">{x.i}</div><div className="n-title">{x.t}</div><div className="n-sub"><Secret>{x.s}</Secret></div></div>
              </div>
            ))}
          </div>
        )}
        {t === 'bdd' && (
          <div className="grid g2">
            <pre className="small" style={{ margin: 0, padding: 14, borderRadius: 12, background: 'var(--panel-2)', border: '1px solid var(--border)', fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>
              {'Scenario: 65-year-old gets the senior discount\n'}
              <span style={{ color: '#a78bfa' }}>  Given</span>{' a customer aged 65\n'}
              <span style={{ color: '#22d3ee' }}>  When</span>{' she buys a €100 ticket\n'}
              <span style={{ color: '#34d399' }}>  Then</span>{' she pays €80'}
            </pre>
            <div className="col">
              <div className="small">Simple natural language that <b>stakeholders understand</b>, usually <b>Given / When / Then</b>.</div>
              <button className="btn sm primary" style={{ alignSelf: 'flex-start' }} onClick={() => setExec((e) => !e)}>⚙️ {exec ? 'Hide' : 'Translate into an executable test'}</button>
              {exec && (
                <pre className="small" style={{ margin: 0, padding: 12, borderRadius: 12, background: 'color-mix(in srgb, var(--good) 10%, transparent)', border: '1px solid var(--good)', fontFamily: 'var(--mono)', animation: 'fsPop .3s', whiteSpace: 'pre-wrap' }}>
                  {"test('senior discount', () => {\n  const c = customer({ age: 65 });\n  expect(buy(c, 100)).toBe(80);\n}); // ✅ runs automatically"}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
      <KF />
      <div className="detail" style={cv('#ffb703')}>
        <h4>🧲 What all three share</h4>
        <ul className="small">
          <Secret as="li">Tests are defined BEFORE the code is written, as a means of directing development</Secret>
          <Secret as="li">They implement the principle of EARLY testing and follow SHIFT LEFT</Secret>
          <Secret as="li">They support an ITERATIVE development model</Secret>
          <Secret as="li">Tests may persist as automated tests to ensure code quality in future adaptations / refactoring</Secret>
        </ul>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.1.4  DevOps infinity loop                                           */
/* ===================================================================== */
const INF = 'M150,100 C190,40 270,40 270,100 C270,160 190,160 150,100 C110,40 30,40 30,100 C30,160 110,160 150,100 Z';
export function DevOpsLoop() {
  const [side, setSide] = useState<'ben' | 'risk'>('ben');
  const BEN = [
    ['⚡', 'Fast feedback on code quality and on whether changes adversely affect existing code'],
    ['⬅️', 'CI promotes SHIFT LEFT: devs submit high-quality code with component tests & static analysis'],
    ['🏗️', 'Automated processes like CI/CD help establish STABLE test environments'],
    ['📈', 'More visibility on NON-FUNCTIONAL characteristics (e.g., performance efficiency, reliability)'],
    ['🤖', 'Automation through a delivery pipeline reduces the need for REPETITIVE manual testing'],
    ['🛡️', 'Risk of regression minimized thanks to the scale & range of automated regression tests'],
  ];
  const RISK = [
    ['🧱', 'The DevOps delivery pipeline must be defined and established'],
    ['🔧', 'CI / CD tools must be introduced and maintained'],
    ['💰', 'Test automation requires additional resources; may be difficult to establish and maintain'],
  ];
  return (
    <div>
      <div className="grid g2" style={{ alignItems: 'center' }}>
        <svg viewBox="0 0 300 200" style={{ width: '100%' }}>
          <defs>
            <linearGradient id="fs-devops" x1="0" x2="1"><stop offset="0" stopColor="#8b6cff" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
          </defs>
          <path d={INF} fill="none" stroke="url(#fs-devops)" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
          <circle r="7" fill="#fbbf24"><animateMotion dur="5s" repeatCount="indefinite" path={INF} /></circle>
          <text x="80" y="96" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text)">DEV</text>
          <text x="80" y="112" textAnchor="middle" fontSize="9" fill="var(--muted)">incl. testing 🧪</text>
          <text x="220" y="96" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text)">OPS</text>
          <text x="220" y="112" textAnchor="middle" fontSize="9" fill="var(--muted)">operations 🚀</text>
          <text x="150" y="190" textAnchor="middle" fontSize="10" fill="var(--faint)">one pipeline · common goals · equal value</text>
        </svg>
        <div className="col" style={{ gap: 6 }}>
          <div className="small">DevOps = an <b>organizational approach</b> + <b>cultural shift</b>. It promotes:</div>
          <div className="row wrap" style={{ gap: 6 }}>
            {['🧑‍🚀 Team autonomy', '⚡ Fast feedback', '🔗 Integrated toolchains', '🔄 CI', '🚚 CD'].map((x) => <span key={x} className="chip">{x}</span>)}
          </div>
          <div className="small muted">→ build, test and release high-quality code faster through a DevOps delivery pipeline.</div>
        </div>
      </div>
      <div className="mt"><Tabs value={side} onChange={setSide} tabs={[{ id: 'ben', label: '✚ Benefits for testing (6)' }, { id: 'risk', label: '⚠️ Risks & challenges (3)' }]} /></div>
      <div className="col mt" style={{ gap: 6 }}>
        {(side === 'ben' ? BEN : RISK).map(([i, t]) => <Line key={t} icon={i} color={side === 'ben' ? 'var(--good)' : 'var(--bad)'}><Secret>{t}</Secret></Line>)}
      </div>
      <div className="feedback ok small" style={{ marginTop: 10 }}>🧑 Even with heavy automation, <b>manual testing — especially from the user's perspective — is still needed</b>.</div>
    </div>
  );
}

/* ===================================================================== */
/* 2.1.5  Shift-left slider                                              */
/* ===================================================================== */
const PH = ['Reqs', 'Design', 'Code', 'Comp. test', 'Integr.', 'System', 'Accept.'];
const SL = [
  { icon: '👓', t: 'Review specs from a tester\'s perspective', s: 'finds ambiguities, incompleteness, inconsistencies', from: 5, to: 0 },
  { icon: '📝', t: 'Write test cases BEFORE the code; run code in a test harness while implementing', s: '', from: 5, to: 2 },
  { icon: '🔄', t: 'CI — even better CD — with automated component tests on every commit', s: 'fast feedback', from: 4, to: 2 },
  { icon: '🔬', t: 'Static analysis of source code before dynamic testing (or automated)', s: '', from: 5, to: 2 },
  { icon: '⚡', t: 'Non-functional testing from the COMPONENT test level, where possible', s: 'NF tests tend to be done late, when a full system & representative environment exist', from: 5, to: 3 },
];
export function ShiftLeftSlider() {
  const [on, setOn] = useState<boolean[]>(SL.map(() => false));
  const all = on.every(Boolean);
  const pct = (i: number) => ((i + 0.5) / PH.length) * 100;
  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn sm primary" onClick={() => setOn(SL.map(() => !all))}>{all ? '↺ Reset' : '⬅️ SHIFT LEFT!'}</button>
        <span className="small muted">or click a practice to move it</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 560 }}>
          <div className="row" style={{ gap: 0, paddingLeft: '34%' }}>
            {PH.map((p) => <div key={p} className="tiny center" style={{ flex: 1, fontWeight: 700, color: 'var(--muted)' }}>{p}</div>)}
          </div>
          {SL.map((x, i) => (
            <div key={x.t} className="row" style={{ gap: 0, marginTop: 6, cursor: 'pointer' }} onClick={() => setOn((o) => o.map((v, j) => (j === i ? !v : v)))}>
              <div className="small" style={{ width: '34%', paddingRight: 8 }}>{x.icon} <b>{x.t}</b>{x.s && <div className="tiny faint"><Secret>{x.s}</Secret></div>}</div>
              <div style={{ flex: 1, position: 'relative', height: 38, borderRadius: 10, background: 'linear-gradient(90deg, color-mix(in srgb, var(--good) 22%, transparent), color-mix(in srgb, var(--bad) 22%, transparent))' }}>
                <span style={{ position: 'absolute', left: `${pct(x.from)}%`, top: '50%', transform: 'translate(-50%,-50%)', opacity: on[i] ? 0.35 : 0, fontSize: 18, transition: 'opacity .5s' }} title="later testing is still done">👻</span>
                <span style={{ position: 'absolute', left: `${pct(on[i] ? x.to : x.from)}%`, top: '50%', transform: 'translate(-50%,-50%)', fontSize: 24, transition: 'left .8s cubic-bezier(.3,1.3,.5,1)' }}>{x.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid g3 mt">
        <Line icon="👻" color="var(--warn)"><Secret>Shift left ≠ neglecting later testing. The ghost stays: late test levels still happen.</Secret></Line>
        <Line icon="💸" color="var(--warn)"><Secret>May cost extra training, effort or money EARLY — expected to save effort/cost LATER.</Secret></Line>
        <Line icon="🤝" color="var(--warn)"><Secret>Stakeholders must be convinced and bought into the concept.</Secret></Line>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.2.1  Test levels — "from brick to family home"                      */
/* ===================================================================== */
const LEVELS = [
  { id: 'comp', art: '🧱', name: 'Component testing', aka: 'a.k.a. unit testing', c: '#8b6cff', img: 'One brick, tested on its own',
    rows: [['🎯 Focus', 'Components in ISOLATION'], ['🧰 Needs', 'Specific support: test harnesses or unit test frameworks'], ['👤 Who', 'Normally DEVELOPERS, in their development environments']] },
  { id: 'cit', art: '🧱🔗🧱', name: 'Component integration testing', aka: 'a.k.a. unit integration testing', c: '#22d3ee', img: 'Bricks + mortar: do they hold together?',
    rows: [['🎯 Focus', 'INTERFACES and INTERACTIONS between components'], ['🧭 Depends on', 'The integration strategy: bottom-up, top-down or big-bang'], ['👤 Who', 'Typically developers (multi-level independence example)']] },
  { id: 'sys', art: '🏠', name: 'System testing', aka: 'whole product', c: '#2ec4b6', img: 'The whole house, inspected room by room',
    rows: [['🎯 Focus', 'Overall behavior & capabilities of the ENTIRE system: functional end-to-end tasks + non-functional quality characteristics'], ['🌍 Environment', 'Some NF characteristics (e.g., usability) are best tested on the complete system in a REPRESENTATIVE test environment; simulations of sub-systems are possible'], ['📄 Basis', 'Related to the specifications for the system'], ['👤 Who', 'May be an INDEPENDENT test team']] },
  { id: 'sit', art: '🏠⚡🌐', name: 'System integration testing', aka: 'system ↔ other systems', c: '#ffb703', img: 'House hooked up to power, water & internet',
    rows: [['🎯 Focus', 'Interfaces of the SUT with OTHER SYSTEMS and EXTERNAL SERVICES'], ['🌍 Environment', 'Suitable test environments, preferably SIMILAR TO OPERATIONAL'], ['👤 Who', 'Typically the test team (multi-level independence example)']] },
  { id: 'acc', art: '👨‍👩‍👧🔑', name: 'Acceptance testing', aka: 'ready to move in?', c: '#f72585', img: 'The family gets the keys: does it meet THEIR needs?',
    rows: [['🎯 Focus', 'VALIDATION and demonstrating READINESS FOR DEPLOYMENT: the system fulfills the user\'s business needs'], ['👤 Who', 'Ideally the INTENDED USERS'], ['🗂️ Main forms', 'User acceptance (UAT), operational acceptance, contractual acceptance, regulatory acceptance, alpha testing, beta testing']] },
];
export function TestLevelsStairs() {
  const [i, setI] = useState(0);
  const L = LEVELS[i];
  return (
    <div>
      <KF />
      <div className="row" style={{ alignItems: 'flex-end', gap: 6, height: 200 }}>
        {LEVELS.map((l, j) => (
          <div key={l.id} className={`node ${i === j ? 'sel' : ''}`} onClick={() => setI(j)}
            style={{ ...cv(l.c), flex: 1, height: `${38 + j * 15}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 8, borderBottom: `5px solid ${l.c}` }}>
            <div style={{ fontSize: j === 4 ? 20 : 24 }}>{l.art}</div>
            <div className="tiny" style={{ fontWeight: 700 }}>{l.name.replace(' testing', '')}</div>
          </div>
        ))}
      </div>
      <div className="tiny faint center" style={{ marginTop: 4 }}>Scope grows ➜ from a single component to a system of systems</div>
      <div className="detail" style={cv(L.c)} key={L.id}>
        <h4><span style={{ fontSize: 24 }}>{L.art}</span> {L.name} <span className="tiny faint">({L.aka})</span></h4>
        <div className="small muted" style={{ marginBottom: 6 }}>🖼️ {L.img}</div>
        <table className="cmp"><tbody>
          {L.rows.map(([k, v]) => <tr key={k}><td style={{ width: 130, fontWeight: 700 }}>{k}</td><td><Secret>{v}</Secret></td></tr>)}
        </tbody></table>
      </div>
      <div className="mt small"><b>Levels are told apart by:</b></div>
      <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
        {['🎯 Test object', '🏁 Test objectives', '📄 Test basis', '🐞 Defects & failures', '👥 Approach & responsibilities'].map((x) => <span key={x} className="chip">{x}</span>)}
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.2.2  Test types explorer                                            */
/* ===================================================================== */
const TYPES = [
  { id: 'f', icon: '⚙️', name: 'Functional', q: 'WHAT does it do?', c: '#8b6cff', pts: ['Evaluates the functions a component/system should perform — the "what"', 'Main objective: functional COMPLETENESS, CORRECTNESS and APPROPRIATENESS'] },
  { id: 'nf', icon: '🏎️', name: 'Non-functional', q: 'HOW WELL does it behave?', c: '#22d3ee', pts: ['Evaluates attributes other than functional characteristics — "how well"', 'Objective: the non-functional quality characteristics (ISO/IEC 25010)', 'Can start early (reviews, component testing); often reuses functional tests + checks a constraint', 'Late discovery of NF defects can seriously threaten a project', 'May need a very specific environment, e.g., a usability lab'] },
  { id: 'bb', icon: '📘', name: 'Black-box', q: 'Tests from the SPEC', c: '#ffb703', pts: ['SPECIFICATION-based: derived from documentation not related to the internal structure', 'Main objective: check behavior against its specifications'] },
  { id: 'wb', icon: '🔩', name: 'White-box', q: 'Tests from the STRUCTURE', c: '#2ec4b6', pts: ['STRUCTURE-based: derived from implementation / internal structure (code, architecture, work flows, data flows)', 'Main objective: cover the underlying structure to an acceptable level'] },
];
const ISO = [
  { i: '🏎️', n: 'Performance efficiency', ex: 'Does the search answer within 2 s at peak load?' },
  { i: '🔌', n: 'Compatibility', ex: 'Does our app co-exist and exchange data with the CRM?' },
  { i: '🙂', n: 'Usability', aka: 'interaction capability', ex: 'Can a first-time user complete checkout without help?' },
  { i: '🛡️', n: 'Reliability', ex: 'Does the service stay available and recover after a crash?' },
  { i: '🔐', n: 'Security', ex: 'Can one customer read another customer\'s data?' },
  { i: '🔧', n: 'Maintainability', ex: 'How easily can the code be analyzed and modified?' },
  { i: '🧳', n: 'Portability', aka: 'flexibility', ex: 'Can the function be ported to a new platform?' },
  { i: '🦺', n: 'Safety', ex: 'Does the machine go to a safe state if a sensor fails?' },
];
const SORT = [
  { s: 'Tests derived from the code\'s decisions to reach 100% branch coverage', a: 'wb' },
  { s: 'Tests derived only from the requirements document, ignoring the internals', a: 'bb' },
  { s: 'Check that "transfer" moves the right amount to the right account', a: 'f' },
  { s: 'Check that 1,000 concurrent users get a response within 2 seconds', a: 'nf' },
  { s: 'Check that the app still works after porting it to a new OS', a: 'nf' },
  { s: 'Tests derived from the data flow through the payment module', a: 'wb' },
];
export function TestTypesExplorer() {
  const [tab, setTab] = useState<'map' | 'iso' | 'sort'>('map');
  const [ty, setTy] = useState('f');
  const [iso, setIso] = useState(0);
  const [ans, setAns] = useState<Record<number, string>>({});
  const T = TYPES.find((x) => x.id === ty)!;
  const card = (id: string) => {
    const x = TYPES.find((y) => y.id === id)!;
    return (
      <div className={`node ${ty === id ? 'sel' : ''}`} style={{ ...cv(x.c), flex: 1 }} onClick={() => setTy(id)}>
        <div className="n-ico">{x.icon}</div><div className="n-title">{x.name}</div><div className="n-sub">{x.q}</div>
      </div>
    );
  };
  return (
    <div>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'map', label: '🗺️ The 4 types' }, { id: 'iso', label: '🎡 ISO 25010 wheel' }, { id: 'sort', label: '🎯 Classify!' }]} />
      {tab === 'map' && (
        <div className="mt">
          <div className="kicker">What is evaluated?</div>
          <div className="row" style={{ marginTop: 6 }}>{card('f')}<span className="faint">vs</span>{card('nf')}</div>
          <div className="kicker mt">Where do the tests come from?</div>
          <div className="row" style={{ marginTop: 6 }}>{card('bb')}<span className="faint">vs</span>{card('wb')}</div>
          <div className="detail" style={cv(T.c)}>
            <h4>{T.icon} {T.name} testing</h4>
            <ul>{T.pts.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul>
          </div>
          <div className="small muted mt">🧩 ALL four types can be applied at ALL test levels — the focus differs per level.</div>
        </div>
      )}
      {tab === 'iso' && (
        <div className="grid g2 mt" style={{ alignItems: 'center' }}>
          <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block' }}>
            <circle cx="150" cy="150" r="108" fill="none" stroke="var(--border-strong)" strokeDasharray="4 6" />
            <circle cx="150" cy="150" r="44" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" />
            <text x="150" y="146" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--text)">ISO/IEC 25010</text>
            <text x="150" y="162" textAnchor="middle" fontSize="9" fill="var(--muted)">non-functional</text>
            {ISO.map((x, j) => {
              const a = (j / ISO.length) * Math.PI * 2 - Math.PI / 2;
              const cx = 150 + Math.cos(a) * 108, cy = 150 + Math.sin(a) * 108;
              return (
                <g key={x.n} style={{ cursor: 'pointer' }} onClick={() => setIso(j)}>
                  <circle cx={cx} cy={cy} r={iso === j ? 27 : 22} fill={iso === j ? 'rgba(139,108,255,0.45)' : 'var(--panel-solid)'} stroke={iso === j ? '#8b6cff' : 'var(--border-strong)'} style={{ transition: 'all .25s' }} />
                  <text x={cx} y={cy + 7} textAnchor="middle" fontSize="20">{x.i}</text>
                </g>
              );
            })}
          </svg>
          <div className="col" key={iso} style={{ animation: 'fsPop .25s' }}>
            <div className="kicker">{iso + 1} / 8</div>
            <h3>{ISO[iso].i} {ISO[iso].n}</h3>
            {ISO[iso].aka && <span className="chip warn" style={{ alignSelf: 'flex-start' }}>also known as: {ISO[iso].aka}</span>}
            <div className="small">Example test: <Secret>{ISO[iso].ex}</Secret></div>
            <div className="tiny faint">Examples are illustrative. Mnemonic: <b>P</b>ilots <b>C</b>an <b>U</b>se <b>R</b>eliable <b>S</b>hips <b>M</b>ade <b>P</b>roperly <b>S</b>afe.</div>
          </div>
        </div>
      )}
      {tab === 'sort' && (
        <div className="col mt" style={{ gap: 8 }}>
          {SORT.map((x, j) => (
            <div key={x.s} className="card flat" style={{ padding: 12 }}>
              <div className="small" style={{ fontWeight: 600 }}>{x.s}</div>
              <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
                {TYPES.map((t) => {
                  const st = ans[j] === undefined ? '' : t.id === x.a ? 'ok' : t.id === ans[j] ? 'no' : '';
                  return <button key={t.id} className={`token ${st}`} onClick={() => ans[j] === undefined && setAns((a) => ({ ...a, [j]: t.id }))}>{t.icon} {t.name}</button>;
                })}
              </div>
            </div>
          ))}
          <div className="row"><span className="chip good">⭐ {SORT.filter((x, j) => ans[j] === x.a).length} / {SORT.length}</span><button className="btn sm ghost" onClick={() => setAns({})}>↺ Reset</button></div>
        </div>
      )}
    </div>
  );
}

/* ===================================================================== */
/* 2.2.3  Fix → confirm → impact analysis → regression                   */
/* ===================================================================== */
type MStat = 'idle' | 'fail' | 'fix' | 'pass' | 'scope' | 'run';
const MODS = [
  { id: 'login', i: '🔐', n: 'Login' }, { id: 'cart', i: '🛒', n: 'Cart' }, { id: 'pay', i: '💳', n: 'Payment' },
  { id: 'search', i: '🔎', n: 'Search' }, { id: 'inv', i: '🧾', n: 'Invoice' }, { id: 'mail', i: '✉️', n: 'E-mail' },
  { id: 'prof', i: '👤', n: 'Profile' }, { id: 'rep', i: '📊', n: 'Reports' }, { id: 'bank', i: '🏦', n: 'Bank API (connected system)' },
];
const IMPACTED = ['cart', 'pay', 'inv', 'bank'];
const CR_STEPS = [
  { tag: '▶ Test execution', c: CYAN, t: 'TC-17 on 💳 Payment FAILS. A defect is lurking.' },
  { tag: '🔧 Debugging (NOT testing)', c: '#ff7a59', t: 'A developer reproduces, diagnoses and FIXES the defect in Payment.' },
  { tag: '✅ Confirmation testing', c: '#34d399', t: 'Re-execute the tests that failed due to the defect (and/or add new tests covering the changes made for the fix). If time/money is short: at least re-run the steps that reproduced the failure. → "Is THE defect gone?" YES.' },
  { tag: '🧭 Impact analysis', c: '#ffb703', t: 'Which parts could be affected by the change? Same component, other components, connected systems… → this sets the EXTENT of regression testing.' },
  { tag: '🕸️ Regression testing', c: '#f72585', t: 'Re-run tests in UNCHANGED areas. 🧾 Invoice now fails: an adverse side effect of the fix — even though the fix itself was confirmed!' },
  { tag: '🧠 Takeaway', c: PURPLE, t: 'Confirmation = "is the ORIGINAL defect fixed?" Regression = "did the change break ANYTHING else (incl. the environment)?" Regression suites run many times and grow every release → a strong candidate for automation, ideally in CI.' },
];
const mstat = (step: number, id: string): MStat => {
  if (step === 0) return id === 'pay' ? 'fail' : 'idle';
  if (step === 1) return id === 'pay' ? 'fix' : 'idle';
  if (step === 2) return id === 'pay' ? 'pass' : 'idle';
  if (step === 3) return id === 'pay' ? 'pass' : IMPACTED.includes(id) ? 'scope' : 'idle';
  return id === 'inv' ? 'fail' : IMPACTED.includes(id) || step === 5 ? 'pass' : 'run';
};
export function FixRetestRegress() {
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const h = setInterval(() => setStep((s) => { if (s >= CR_STEPS.length - 1) { setPlay(false); return s; } return s + 1; }), 2600);
    return () => clearInterval(h);
  }, [play]);
  const S = CR_STEPS[step];
  const look: Record<MStat, { bg: string; bd: string; badge: string }> = {
    idle: { bg: 'var(--panel-2)', bd: 'var(--border)', badge: '' },
    fail: { bg: 'color-mix(in srgb, var(--bad) 22%, transparent)', bd: 'var(--bad)', badge: '❌' },
    fix: { bg: 'color-mix(in srgb, #ff7a59 20%, transparent)', bd: '#ff7a59', badge: '🔧' },
    pass: { bg: 'color-mix(in srgb, var(--good) 18%, transparent)', bd: 'var(--good)', badge: '✅' },
    scope: { bg: 'color-mix(in srgb, var(--warn) 14%, transparent)', bd: 'var(--warn)', badge: '🎯' },
    run: { bg: 'color-mix(in srgb, var(--good) 10%, transparent)', bd: 'var(--border-strong)', badge: '✅' },
  };
  return (
    <div>
      <KF />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="grid g3" style={{ gap: 8 }}>
          {MODS.map((m) => {
            const st = mstat(step, m.id);
            const L = look[st];
            return (
              <div key={m.id} className="node" style={{ padding: 8, background: L.bg, borderColor: L.bd, borderStyle: st === 'scope' ? 'dashed' : 'solid', borderWidth: 2,
                animation: st === 'fail' ? 'fsShake .5s' : st === 'scope' ? 'fsPulse 1.4s infinite' : undefined }}>
                <div style={{ fontSize: 22 }}>{m.i} <span style={{ fontSize: 14 }}>{L.badge}</span></div>
                <div className="tiny" style={{ fontWeight: 700 }}>{m.n}</div>
              </div>
            );
          })}
        </div>
        <div className="col">
          <div className="row wrap" style={{ gap: 4 }}>
            {CR_STEPS.map((x, j) => <button key={x.tag} className={`chip click ${j === step ? 'on' : ''}`} onClick={() => { setPlay(false); setStep(j); }}>{j + 1}</button>)}
          </div>
          <div className="detail" style={{ ...cv(S.c), marginTop: 0 }} key={step}>
            <h4>{S.tag}</h4>
            <div className="small"><Secret>{S.t}</Secret></div>
          </div>
          <div className="row">
            <button className="btn sm" disabled={step === 0} onClick={() => { setPlay(false); setStep(step - 1); }}>◀</button>
            <button className="btn sm primary" onClick={() => { if (step >= CR_STEPS.length - 1) setStep(0); setPlay((p) => !p); }}>{play ? '⏸ Pause' : '▶ Play the story'}</button>
            <button className="btn sm" disabled={step === CR_STEPS.length - 1} onClick={() => { setPlay(false); setStep(step + 1); }}>▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 2.3.1  Maintenance trigger sorter                                     */
/* ===================================================================== */
type Trig = 'mod' | 'mig' | 'ret';
const TRIG: Record<Trig, { icon: string; name: string; c: string }> = {
  mod: { icon: '🛠️', name: 'Modification', c: '#8b6cff' },
  mig: { icon: '🚚', name: 'Upgrade / migration', c: '#22d3ee' },
  ret: { icon: '🪦', name: 'Retirement', c: '#ff7a59' },
};
const EVENTS: { e: string; t: Trig; test: string }[] = [
  { e: 'Planned release adds a loyalty-points feature', t: 'mod', test: 'Planned enhancement (release-based): test the change + regression of the unchanged parts.' },
  { e: 'Emergency hot fix for a production crash', t: 'mod', test: 'Unplanned release (hot fix): confirm the fix, check for regressions.' },
  { e: 'Corrective change for a wrong tax calculation', t: 'mod', test: 'Corrective change: confirmation + regression testing.' },
  { e: 'Moving the system from on-prem servers to a new cloud platform', t: 'mig', test: 'Tests associated with the NEW ENVIRONMENT as well as the changed software.' },
  { e: 'Customer data from a legacy app is migrated into the system', t: 'mig', test: 'Tests of DATA CONVERSION.' },
  { e: 'The app reaches end of life; records must be kept for 10 years', t: 'ret', test: 'Test DATA ARCHIVING (long retention) + RESTORE & RETRIEVAL procedures in case data is needed.' },
];
export function MaintenanceTriggers() {
  const [ans, setAns] = useState<Record<number, Trig>>({});
  const score = EVENTS.filter((x, j) => ans[j] === x.t).length;
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        {(Object.keys(TRIG) as Trig[]).map((k) => <span key={k} className="chip" style={{ borderColor: TRIG[k].c }}>{TRIG[k].icon} {TRIG[k].name}</span>)}
        <div className="spacer" /><span className="chip good">⭐ {score} / {EVENTS.length}</span>
        <button className="btn sm ghost" onClick={() => setAns({})}>↺</button>
      </div>
      <div className="col mt" style={{ gap: 8 }}>
        {EVENTS.map((x, j) => (
          <div key={x.e} className="card flat" style={{ padding: 12 }}>
            <div className="row wrap" style={{ gap: 6 }}>
              <span className="small" style={{ fontWeight: 600, flex: '1 1 260px' }}>📣 {x.e}</span>
              {(Object.keys(TRIG) as Trig[]).map((k) => {
                const st = ans[j] === undefined ? '' : k === x.t ? 'ok' : k === ans[j] ? 'no' : '';
                return <button key={k} className={`token ${st}`} style={{ padding: '6px 10px' }} onClick={() => ans[j] === undefined && setAns((a) => ({ ...a, [j]: k }))}>{TRIG[k].icon}</button>;
              })}
            </div>
            {ans[j] !== undefined && <div className="tiny" style={{ marginTop: 6, color: 'var(--muted)', animation: 'fsPop .25s' }}>{TRIG[x.t].icon} <b>{TRIG[x.t].name}</b> → {x.test}</div>}
          </div>
        ))}
      </div>
      <KF />
      <div className="grid g3 mt">
        {[['⚠️', 'Degree of RISK of the change'], ['🏢', 'SIZE of the existing system'], ['📏', 'SIZE of the change']].map(([i, t]) => (
          <Line key={t} icon={i} color="var(--warn)"><span className="tiny faint">Scope depends on</span><br /><Secret>{t}</Secret></Line>
        ))}
      </div>
    </div>
  );
}
