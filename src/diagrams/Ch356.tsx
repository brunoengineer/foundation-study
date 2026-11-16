import { useState, type CSSProperties, type ReactNode } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* =====================================================================
   Custom interactive diagrams for CTFL v4.0.1 chapters 3, 5 and 6
   ===================================================================== */

const cv = (c: string): CSSProperties => ({ ['--c' as string]: c } as CSSProperties);
/** round to d decimals and drop trailing zeros */
const fmt = (n: number, d = 2) => String(Math.round(n * 10 ** d) / 10 ** d);
function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
const inputStyle: CSSProperties = {
  width: 90, padding: '6px 8px', borderRadius: 10, border: '1px solid var(--border-strong)',
  background: 'var(--panel-2)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14,
};
const rangeStyle: CSSProperties = { width: '100%', accentColor: 'var(--accent)' };

interface Fb { ok: boolean; text: ReactNode; n: number }
function Feedback({ fb }: { fb: Fb | null }) {
  if (!fb) return null;
  return <div key={fb.n} className={`feedback ${fb.ok ? 'ok' : 'no shake'}`} style={{ marginTop: 10 }}>{fb.text}</div>;
}

const Pill = ({ children, color }: { children: ReactNode; color: string }) => (
  <span className="chip" style={{ borderColor: color, color, background: `${color}1a` }}>{children}</span>
);

/* =====================================================================
   GENERIC: tap-or-drag bucket sorter (reused across chapters)
   ===================================================================== */
export interface SortBucket { id: string; icon: string; title: string; sub?: string; color: string }
export interface SortItem { text: string; bucket: string; why?: string }

export function BucketSort({ buckets, items, prompt }: { buckets: SortBucket[]; items: SortItem[]; prompt?: string }) {
  const [order, setOrder] = useState(() => shuffle(items.map((_, i) => i)));
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [sel, setSel] = useState<number | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [fb, setFb] = useState<Fb | null>(null);
  const [miss, setMiss] = useState(0);
  const pool = order.filter((i) => placed[i] === undefined);
  const title = (id: string) => buckets.find((b) => b.id === id)?.title ?? id;

  const drop = (b: string, idx: number | null) => {
    setOver(null);
    if (idx === null) { setFb({ ok: false, text: 'First tap a card, then tap the bucket it belongs to.', n: Date.now() }); return; }
    const it = items[idx];
    if (it.bucket === b) {
      setPlaced((p) => ({ ...p, [idx]: b }));
      setFb({ ok: true, text: <>✅ <b>{it.text}</b> → {title(b)}{it.why ? <> — {it.why}</> : null}</>, n: Date.now() });
    } else {
      setMiss((m) => m + 1);
      setFb({ ok: false, text: <>❌ <b>{it.text}</b> is not "{title(b)}". Think again!</>, n: Date.now() });
    }
    setSel(null);
  };
  const reset = () => { setOrder(shuffle(items.map((_, i) => i))); setPlaced({}); setSel(null); setFb(null); setMiss(0); };
  const done = pool.length === 0;

  return (
    <div>
      {prompt && <div className="small muted" style={{ marginBottom: 8 }}>{prompt}</div>}
      <div className="sort-pool">
        {done ? <span className="muted">🎉 All {items.length} sorted with {miss} mistake{miss === 1 ? '' : 's'}.</span>
          : pool.map((i) => (
            <span key={i} className={`token ${sel === i ? 'sel' : ''}`} draggable
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(i)); setSel(i); }}
              onClick={() => setSel(sel === i ? null : i)}>{items[i].text}</span>
          ))}
      </div>
      <div className="buckets mt" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${buckets.length > 3 ? 160 : 200}px, 1fr))` }}>
        {buckets.map((b) => (
          <div key={b.id} className={`bucket ${over === b.id ? 'over' : ''}`} style={{ ...cv(b.color), cursor: 'pointer' }}
            onClick={() => drop(b.id, sel)}
            onDragOver={(e) => { e.preventDefault(); setOver(b.id); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); const v = e.dataTransfer.getData('text/plain'); drop(b.id, v === '' ? null : Number(v)); }}>
            <h4><span style={{ fontSize: 22 }}>{b.icon}</span>{b.title}</h4>
            {b.sub && <div className="tiny muted">{b.sub}</div>}
            <div className="tokens">
              {order.filter((i) => placed[i] === b.id).map((i) => <span key={i} className="token ok">{items[i].text}</span>)}
            </div>
          </div>
        ))}
      </div>
      <Feedback fb={fb} />
      <div className="row mt" style={{ justifyContent: 'space-between' }}>
        <span className="tiny faint">Tap a card, then a bucket (or drag it). {items.length - pool.length}/{items.length} placed · {miss} miss{miss === 1 ? '' : 'es'}</span>
        <button className="btn sm ghost" onClick={reset}>↺ Reset</button>
      </div>
    </div>
  );
}

/* =====================================================================
   CHAPTER 3 — STATIC TESTING
   ===================================================================== */

/* ---------- 3.1.1 Static lens: what can be reviewed / statically analyzed ---------- */
type Fit = 'yes' | 'partial' | 'no';
const WORK_PRODUCTS: { icon: string; name: string; review: Fit; tool: Fit }[] = [
  { icon: '📋', name: 'Requirement specification', review: 'yes', tool: 'partial' },
  { icon: '💻', name: 'Source code', review: 'yes', tool: 'yes' },
  { icon: '🗺️', name: 'Test plan', review: 'yes', tool: 'partial' },
  { icon: '🧪', name: 'Test cases', review: 'yes', tool: 'partial' },
  { icon: '📌', name: 'Product backlog items', review: 'yes', tool: 'partial' },
  { icon: '🧭', name: 'Test charters', review: 'yes', tool: 'partial' },
  { icon: '📚', name: 'Project documentation', review: 'yes', tool: 'partial' },
  { icon: '📜', name: 'Contracts', review: 'yes', tool: 'partial' },
  { icon: '🧩', name: 'Models', review: 'yes', tool: 'yes' },
  { icon: '📦', name: '3rd-party executable code', review: 'no', tool: 'no' },
];
const FIT_UI: Record<Fit, { sym: string; color: string }> = {
  yes: { sym: '✓', color: 'var(--good)' },
  partial: { sym: '◐', color: 'var(--warn)' },
  no: { sym: '✖', color: 'var(--bad)' },
};

export function StaticLens() {
  const [lens, setLens] = useState<'review' | 'tool'>('review');
  const [sel, setSel] = useState(1);
  const w = WORK_PRODUCTS[sel];
  const fit = lens === 'review' ? w.review : w.tool;
  const explain = (): string => {
    if (fit === 'no') return 'NOT appropriate: difficult for humans to interpret AND should not be analyzed by tools (e.g., 3rd-party executable code, for legal reasons).';
    if (lens === 'review') return 'Any work product that can be READ and UNDERSTOOD can be the subject of a review.';
    if (fit === 'yes') return 'Has a structure a tool can check against (code, models, text with a formal syntax) → static analysis works well.';
    return 'Only partly: static analysis needs a STRUCTURE to check against (e.g., a formal syntax). Plain prose can still be checked by simple static-analysis tools like spelling checkers and readability tools.';
  };
  return (
    <div>
      <Tabs value={lens} onChange={setLens} tabs={[{ id: 'review', label: '👓 Review lens (humans)' }, { id: 'tool', label: '🤖 Static-analysis lens (tools)' }]} />
      <div className="icon-grid mt" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
        {WORK_PRODUCTS.map((p, i) => {
          const f = lens === 'review' ? p.review : p.tool;
          return (
            <div key={p.name} className={`node ${sel === i ? 'sel' : ''}`} style={{ ...cv(FIT_UI[f].color), opacity: f === 'no' ? 0.6 : 1, padding: 10 }} onClick={() => setSel(i)}>
              <span style={{ position: 'absolute', top: 6, right: 10, fontWeight: 800, color: FIT_UI[f].color }}>{FIT_UI[f].sym}</span>
              <div style={{ fontSize: 26 }}>{p.icon}</div>
              <div className="small" style={{ fontWeight: 600 }}>{p.name}</div>
            </div>
          );
        })}
      </div>
      <div className="detail" style={cv(FIT_UI[fit].color)}>
        <h4>{w.icon} {w.name} <span style={{ color: FIT_UI[fit].color }}>{FIT_UI[fit].sym}</span></h4>
        <Secret>{explain()}</Secret>
      </div>
      <div className="tiny faint center mt">✓ suitable · ◐ only with a checkable structure · ✖ not appropriate</div>
    </div>
  );
}

/* ---------- 3.2.1 Feedback drift ---------- */
const FEEDBACK_LEVELS = [
  { label: '😶 Only at the end', pts: [] as number[] },
  { label: '📅 Once mid-project', pts: [250] },
  { label: '🔁 Every iteration', pts: [100, 200, 300, 400] },
  { label: '💬 Early & frequent', pts: [50, 100, 150, 200, 250, 300, 350, 400, 450] },
];
export function FeedbackDrift() {
  const [lvl, setLvl] = useState(0);
  const vision = (x: number) => 100 + 40 * Math.sin(x / 90) - x * 0.06;
  const pts = FEEDBACK_LEVELS[lvl].pts;
  const build = (x: number) => {
    const last = [0, ...pts].filter((p) => p <= x).pop() ?? 0;
    return vision(last) + 0.12 * (x - last);
  };
  const xs = Array.from({ length: 101 }, (_, i) => i * 5);
  const vPath = xs.map((x) => `${x + 10},${200 - vision(x)}`).join(' ');
  const bPath: string[] = [];
  xs.forEach((x) => {
    if (pts.includes(x)) {
      // value just before the correction (end of the previous drift segment)
      const prev = [0, ...pts].filter((p) => p < x).pop() ?? 0;
      bPath.push(`${x + 10},${200 - (vision(prev) + 0.12 * (x - prev))}`);
    }
    bPath.push(`${x + 10},${200 - build(x)}`);
  });
  const gap = Math.abs(vision(500) - build(500));
  const maxGap = Math.abs(vision(500) - (vision(0) + 0.12 * 500));
  const pct = Math.round((gap / maxGap) * 100);
  const bad = pct > 35;
  return (
    <div>
      <div className="row wrap" style={{ justifyContent: 'space-between' }}>
        <b>How often do stakeholders give feedback?</b>
        <span className={`chip ${bad ? 'bad' : 'good'}`}>Gap at release: {pct}%</span>
      </div>
      <input type="range" min={0} max={3} value={lvl} onChange={(e) => setLvl(Number(e.target.value))} style={{ ...rangeStyle, marginTop: 8 }} />
      <div className="row tiny muted" style={{ justifyContent: 'space-between' }}>
        {FEEDBACK_LEVELS.map((l, i) => <span key={l.label} style={{ fontWeight: i === lvl ? 700 : 400, color: i === lvl ? 'var(--text)' : undefined }}>{l.label}</span>)}
      </div>
      <svg viewBox="0 0 540 210" style={{ width: '100%', marginTop: 8 }}>
        <polyline points={vPath} fill="none" stroke="#2ec4b6" strokeWidth="3" />
        <polyline points={bPath.join(' ')} fill="none" stroke="#ff7a59" strokeWidth="3" strokeDasharray="7 4" />
        {pts.map((p) => <text key={p} x={p + 10} y={200 - vision(p) - 10} textAnchor="middle" fontSize="14">💬</text>)}
        <line x1="510" y1={200 - vision(500)} x2="510" y2={200 - build(500)} stroke={bad ? 'var(--bad)' : 'var(--good)'} strokeWidth="4" />
        <text x="10" y="18" fontSize="12" fill="#2ec4b6" fontWeight="700">━ What stakeholders want (original → current vision)</text>
        <text x="10" y="34" fontSize="12" fill="#ff7a59" fontWeight="700">┅ What the team is building</text>
        <text x="505" y="205" fontSize="11" fill="var(--muted)" textAnchor="end">release →</text>
      </svg>
      <div className="grid g2 mt">
        <div className="vs-col" style={{ borderTop: '4px solid var(--bad)', opacity: bad ? 1 : 0.45 }}>
          <b className="con">✖ Little stakeholder involvement</b>
          <ul className="small">
            <Secret as="li">Product may not meet the stakeholder's original or current vision</Secret>
            <Secret as="li">Costly rework & missed deadlines</Secret>
            <Secret as="li">Blame games</Secret>
            <Secret as="li">Might even lead to complete project failure</Secret>
          </ul>
        </div>
        <div className="vs-col" style={{ borderTop: '4px solid var(--good)', opacity: bad ? 0.45 : 1 }}>
          <b className="pro">✚ Early & frequent feedback</b>
          <ul className="small">
            <Secret as="li">Early communication of potential quality problems</Secret>
            <Secret as="li">Prevents misunderstandings about requirements</Secret>
            <Secret as="li">Requirement changes understood & implemented earlier</Secret>
            <Secret as="li">Team better understands what it is building</Secret>
            <Secret as="li">Focus on features with most stakeholder value & most positive impact on identified risks</Secret>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3.2.2 Review process as a dinner party ---------- */
const REVIEW_STEPS = [
  { icon: '🗓️', name: 'Planning', party: 'Plan the party', color: '#ff7a59',
    points: ['Define the SCOPE of the review:', 'purpose · work product to review · quality characteristics to evaluate', 'areas to focus on · exit criteria', 'supporting information such as standards', 'effort and timeframes'] },
  { icon: '📨', name: 'Review initiation', party: 'Send the invitations', color: '#ffb703',
    points: ['Goal: everyone & everything is prepared to start', 'Every participant has ACCESS to the work product', '…UNDERSTANDS their role and responsibilities', '…RECEIVES everything needed to perform the review'] },
  { icon: '🔍', name: 'Individual review', party: 'Each guest cooks at home', color: '#22d3ee',
    points: ['EVERY reviewer assesses the quality of the work product alone', 'Identifies anomalies, recommendations and questions', 'Applies review techniques, e.g., checklist-based or scenario-based reviewing', 'Reviewers LOG all their anomalies, recommendations and questions'] },
  { icon: '💬', name: 'Communication & analysis', party: 'The dinner conversation', color: '#8b6cff',
    points: ['Anomalies are NOT necessarily defects → analyze & discuss them all', 'For every anomaly decide: STATUS, OWNERSHIP and required ACTIONS', 'Typically in a review meeting', 'Decide the quality level of the work product and follow-up actions', 'A follow-up review may be required'] },
  { icon: '🛠️', name: 'Fixing & reporting', party: 'Clean up & send thank-you notes', color: '#2ec4b6',
    points: ['A DEFECT REPORT for every defect, so corrective actions can be followed up', 'Once EXIT CRITERIA are reached → work product can be accepted', 'Review results are reported'] },
];
const LOG = [
  { id: 'A1', kind: '🐞 anomaly', text: 'Req 4.2 says max 3 items, req 7.1 says max 5', decided: 'Defect · owner: author · fix it', ok: true },
  { id: 'R1', kind: '💡 recommendation', text: 'Use a decision table for the fee rules', decided: 'Accepted improvement · owner: author', ok: true },
  { id: 'Q1', kind: '❓ question', text: 'What if a voucher expires mid-checkout?', decided: 'Not a defect — answered in section 9 · close', ok: false },
];
export function ReviewPipeline() {
  const [s, setS] = useState(0);
  const st = REVIEW_STEPS[s];
  return (
    <div>
      <div className="flow">
        {REVIEW_STEPS.map((r, i) => (
          <div key={r.name} style={{ display: 'contents' }}>
            {i > 0 && <div className="flow-arrow">➜</div>}
            <div className={`node ${s === i ? 'sel' : ''}`} style={{ ...cv(r.color), opacity: i <= s ? 1 : 0.55 }} onClick={() => setS(i)}>
              <div className="n-ico">{r.icon}</div>
              <div className="n-title small">{r.name}</div>
              <div className="n-sub">🎉 <Secret>{r.party}</Secret></div>
            </div>
          </div>
        ))}
      </div>
      <div className="detail" style={cv(st.color)}>
        <h4>{st.icon} {s + 1}. {st.name}</h4>
        <ul>{st.points.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul>
        {s >= 2 && (
          <table className="cmp mt">
            <thead><tr><th>Log</th><th>Type</th><th>Entry</th>{s >= 3 && <th>Decision (status · owner · action)</th>}</tr></thead>
            <tbody>
              {LOG.map((l) => (
                <tr key={l.id}>
                  <td><b>{l.id}</b></td><td className="small">{l.kind}</td><td className="small">{l.text}</td>
                  {s >= 3 && <td className="small" style={{ color: l.ok ? 'var(--text)' : 'var(--muted)' }}><Secret>{l.decided}</Secret></td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {s === 4 && (
          <div className="row wrap mt" style={{ gap: 8 }}>
            <Pill color="#ff7a59">📄 DR-17 created for A1</Pill><span className="faint">→</span>
            <Pill color="#2ec4b6">🛠️ author fixes</Pill><span className="faint">→</span>
            <Pill color="#34d399">🏁 exit criteria met → accepted</Pill><span className="faint">→</span>
            <Pill color="#8b6cff">📣 results reported</Pill>
          </div>
        )}
      </div>
      <div className="row mt" style={{ justifyContent: 'space-between' }}>
        <button className="btn sm" disabled={s === 0} onClick={() => setS(s - 1)}>◀ Back</button>
        <span className="tiny faint">ISO/IEC 20246 generic process · more formal ⇒ more of these tasks · big work products ⇒ run it several times</span>
        <button className="btn sm primary" disabled={s === 4} onClick={() => setS(s + 1)}>Next ▶</button>
      </div>
    </div>
  );
}

/* ---------- 3.2.3 Review roles around a table ---------- */
const ROLES = [
  { id: 'mgr', icon: '💼', name: 'Manager', color: '#ffb703', key: 'WHAT + resources', does: 'Decides WHAT is to be reviewed and provides RESOURCES, such as staff and time for the review.' },
  { id: 'lead', icon: '🧭', name: 'Review leader', color: '#f72585', key: 'WHO, WHEN, WHERE', does: 'Takes OVERALL responsibility for the review, e.g., deciding WHO will be involved and organizing WHEN and WHERE it will take place.' },
  { id: 'mod', icon: '🎙️', name: 'Moderator (facilitator)', color: '#8b6cff', key: 'runs the meeting', does: 'Ensures the effective running of review MEETINGS: mediation, time management, and a safe review environment in which everyone can speak freely.' },
  { id: 'author', icon: '✍️', name: 'Author', color: '#ff7a59', key: 'creates & fixes', does: 'CREATES and FIXES the work product under review.' },
  { id: 'scribe', icon: '📝', name: 'Scribe (recorder)', color: '#22d3ee', key: 'collates & records', does: 'COLLATES anomalies from reviewers and RECORDS review information, such as decisions and new anomalies found during the review meeting.' },
  { id: 'rev', icon: '🔍', name: 'Reviewer', color: '#2ec4b6', key: 'performs reviews', does: 'PERFORMS reviews. May be someone working on the project, a subject matter expert, or any other stakeholder.' },
];
const ROLE_TASKS = [
  { t: 'Grants two days of staff time so the architecture document can be reviewed', r: 'mgr' },
  { t: 'Picks the security architect and two testers as participants and books Thursday 10:00 in room B', r: 'lead' },
  { t: 'Calms a heated argument and makes sure the junior tester can speak freely', r: 'mod' },
  { t: 'Rewrites section 3 to fix the agreed defects', r: 'author' },
  { t: 'Merges everyone\'s anomaly lists and notes the decisions taken in the meeting', r: 'scribe' },
  { t: 'A subject matter expert reads the spec and logs anomalies', r: 'rev' },
  { t: 'Keeps the review meeting on time', r: 'mod' },
  { t: 'Decides which work product is to be reviewed', r: 'mgr' },
];
export function RoleTable() {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [sel, setSel] = useState('mod');
  const [q, setQ] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const [score, setScore] = useState(0);
  const role = ROLES.find((r) => r.id === sel)!;
  const click = (id: string) => {
    if (mode === 'learn') { setSel(id); return; }
    const task = ROLE_TASKS[q % ROLE_TASKS.length];
    const right = ROLES.find((r) => r.id === task.r)!;
    if (id === task.r) { setScore(score + 1); setFb({ ok: true, text: <>✅ {right.icon} <b>{right.name}</b>: {right.does}</>, n: Date.now() }); setQ(q + 1); }
    else setFb({ ok: false, text: <>❌ Not the {ROLES.find((r) => r.id === id)!.name}. Re-read the task — who is responsible?</>, n: Date.now() });
  };
  return (
    <div>
      <div className="row wrap" style={{ justifyContent: 'space-between' }}>
        <Tabs value={mode} onChange={(m) => { setMode(m); setFb(null); }} tabs={[{ id: 'learn', label: '🪑 Meet the roles' }, { id: 'quiz', label: '🎯 Who does it?' }]} />
        {mode === 'quiz' && <span className="chip good">Score {score}</span>}
      </div>
      {mode === 'quiz' && <div className="q-scenario mt" style={{ padding: 12, borderRadius: 12, background: 'var(--panel-2)' }}>🗣️ "{ROLE_TASKS[q % ROLE_TASKS.length].t}" → click the seat.</div>}
      <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: 360, margin: '12px auto 0' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '38%', height: '34%', borderRadius: '50%', background: 'var(--panel-2)', border: '2px solid var(--border-strong)', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div><div style={{ fontSize: 30 }}>📄</div><div className="tiny muted">work product<br />under review</div></div>
        </div>
        {ROLES.map((r, i) => {
          const a = (i / ROLES.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={r.id} className={`node ${mode === 'learn' && sel === r.id ? 'sel' : ''}`} onClick={() => click(r.id)}
              style={{ ...cv(r.color), position: 'absolute', left: `${50 + Math.cos(a) * 35}%`, top: `${50 + Math.sin(a) * 38}%`, transform: 'translate(-50%,-50%)', width: 124, padding: 8 }}>
              <div style={{ fontSize: 26 }}>{r.icon}</div>
              <div className="small" style={{ fontWeight: 700, fontFamily: 'var(--display)' }}>{r.name}</div>
              {mode === 'learn' && <div className="tiny muted"><Secret>{r.key}</Secret></div>}
            </div>
          );
        })}
      </div>
      {mode === 'learn' ? (
        <div className="detail" style={cv(role.color)}>
          <h4>{role.icon} {role.name}</h4>
          <Secret>{role.does}</Secret>
          <div className="tiny muted mt">One person may take on several roles. In an <b>inspection</b> the author can NOT act as review leader or scribe.</div>
        </div>
      ) : <Feedback fb={fb} />}
    </div>
  );
}

/* ---------- 3.2.4 Review formality slider ---------- */
const REVIEW_TYPES = [
  { name: 'Informal review', icon: '☕', color: '#34d399', lead: '—', process: 'Does NOT follow a defined process', output: 'No formal documented output required',
    main: 'Detecting anomalies', other: [] as string[], special: [] as string[], indiv: '—' },
  { name: 'Walkthrough', icon: '🚶', color: '#22d3ee', lead: 'The AUTHOR', process: '—', output: '—',
    main: 'Can serve MANY objectives', other: ['Evaluating quality & building confidence in the work product', 'EDUCATING reviewers', 'Gaining consensus', 'Generating new ideas', 'Motivating & enabling authors to improve', 'Detecting anomalies'], special: [], indiv: 'Possible, but NOT required' },
  { name: 'Technical review', icon: '🛠️', color: '#8b6cff', lead: 'A MODERATOR', process: 'Performed by TECHNICALLY QUALIFIED reviewers', output: '—',
    main: 'Gain consensus & make DECISIONS regarding a technical problem', other: ['Detect anomalies', 'Evaluate quality & build confidence in the work product', 'Generate new ideas', 'Motivate & enable authors to improve'], special: [], indiv: '—' },
  { name: 'Inspection', icon: '🔬', color: '#f72585', lead: '—', process: 'Follows the COMPLETE generic review process (incl. individual review)', output: 'METRICS collected & used to improve the SDLC, including the inspection process',
    main: 'Find the MAXIMUM number of anomalies', other: ['Evaluate quality', 'Build confidence in the work product', 'Motivate & enable authors to improve'], special: ['MOST formal review type', 'The author can NOT act as review leader or scribe'], indiv: '—' },
];
export function FormalitySlider() {
  const [v, setV] = useState(0);
  const t = REVIEW_TYPES[v];
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="small muted">☕ informal</span>
        <b style={{ fontFamily: 'var(--display)', fontSize: 18, color: t.color }}>{t.icon} {t.name}</b>
        <span className="small muted">formal 🔬</span>
      </div>
      <input type="range" min={0} max={3} value={v} onChange={(e) => setV(Number(e.target.value))} style={{ ...rangeStyle, accentColor: t.color, marginTop: 6 }} />
      <div className="bar mt" style={{ height: 14 }}><i style={{ width: `${(v + 1) * 25}%`, background: `linear-gradient(90deg, #34d399, ${t.color})` }} /></div>
      <div className="row wrap mt" style={{ gap: 6 }}>
        {REVIEW_TYPES.map((r, i) => (
          <button key={r.name} className={`chip click ${i === v ? 'on' : ''}`} style={i === v ? { background: r.color } : undefined} onClick={() => setV(i)}>{r.icon} {r.name}</button>
        ))}
      </div>
      <div className="detail" style={cv(t.color)}>
        <table className="cmp">
          <tbody>
            {t.lead !== '—' && <tr><th style={{ width: 170 }}>👑 Led by</th><td><Secret>{t.lead}</Secret></td></tr>}
            {t.process !== '—' && <tr><th style={{ width: 170 }}>⚙️ Process</th><td><Secret>{t.process}</Secret></td></tr>}
            {t.indiv !== '—' && <tr><th>🔍 Individual review before?</th><td><Secret>{t.indiv}</Secret></td></tr>}
            <tr><th>🎯 Main objective</th><td><b><Secret>{t.main}</Secret></b></td></tr>
            {t.other.length > 0 && <tr><th>➕ Other objectives</th><td><ul style={{ margin: 0, paddingLeft: 18 }}>{t.other.map((o) => <Secret as="li" key={o}>{o}</Secret>)}</ul></td></tr>}
            {t.output !== '—' && <tr><th>📄 Output</th><td><Secret>{t.output}</Secret></td></tr>}
            {t.special.length > 0 && <tr><th>⭐ Special</th><td><ul style={{ margin: 0, paddingLeft: 18 }}>{t.special.map((o) => <Secret as="li" key={o}>{o}</Secret>)}</ul></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="vs-col mt">
        <b>🎚️ What sets the required formality?</b>
        <div className="row wrap small mt" style={{ gap: 6 }}>
          {['SDLC followed', 'Maturity of the development process', 'Criticality & complexity of the work product', 'Legal or regulatory requirements', 'Need for an audit trail'].map((f) => <span key={f} className="chip"><Secret>{f}</Secret></span>)}
        </div>
        <div className="tiny muted mt">The same work product can be reviewed with different types — e.g., first informally, later more formally.</div>
      </div>
    </div>
  );
}

/* =====================================================================
   CHAPTER 5 — MANAGING THE TEST ACTIVITIES
   ===================================================================== */

/* ---------- 5.1.1 Test plan: CAS-CRAB ---------- */
const PLAN_SECTIONS = [
  { l: 'C', name: 'Context of testing', ex: 'Test scope, test objectives, test basis' },
  { l: 'A', name: 'Assumptions & constraints', ex: 'Assumptions and constraints of the test project' },
  { l: 'S', name: 'Stakeholders', ex: 'Roles, responsibilities, relevance to testing, hiring and training needs' },
  { l: 'C', name: 'Communication', ex: 'Forms and frequency of communication, documentation templates' },
  { l: 'R', name: 'Risk register', ex: 'Product risks, project risks' },
  { l: 'A', name: 'Test approach', ex: 'Test levels, test types, test techniques, test deliverables, entry & exit criteria, independence of testing, metrics to be collected, test data requirements, test environment requirements, deviations from the test policy & test strategy' },
  { l: 'B', name: 'Budget & schedule', ex: 'Budget and schedule' },
];
const PLAN_SNIPPETS = [
  { t: '"Component testing ends when 80% statement coverage is reached."', a: 5, why: 'Exit criteria are part of the test approach.' },
  { t: '"Weekly status e-mail every Friday, using template T-3."', a: 3, why: 'Forms & frequency of communication, documentation templates.' },
  { t: '"The payment module may calculate interest incorrectly — high likelihood, high impact."', a: 4, why: 'A product risk → risk register.' },
  { t: '"Scope: release 2.3 checkout flow; test basis: user stories US-10 to US-25."', a: 0, why: 'Test scope and test basis = context of testing.' },
  { t: '"Ana (test lead) needs training on the new performance tool; one more tester must be hired."', a: 2, why: 'Roles, hiring and training needs = stakeholders.' },
  { t: '"Only one test environment will be available until March."', a: 1, why: 'A constraint of the test project.' },
  { t: '"Test effort budget: 120 person-days, executed in sprints 5–7."', a: 6, why: 'Budget and schedule.' },
  { t: '"System integration testing is skipped although the test strategy requires it, because …"', a: 5, why: 'Deviations from the test policy/strategy are listed in the test approach.' },
];
export function TestPlanCrab() {
  const [tab, setTab] = useState<'purpose' | 'content' | 'quiz'>('content');
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const snip = PLAN_SNIPPETS[q % PLAN_SNIPPETS.length];
  const answer = (i: number) => {
    if (i === snip.a) { setFb({ ok: true, text: <>✅ <b>{PLAN_SECTIONS[i].name}</b> — {snip.why}</>, n: Date.now() }); setQ(q + 1); }
    else setFb({ ok: false, text: <>❌ Not "{PLAN_SECTIONS[i].name}". Try again.</>, n: Date.now() });
  };
  return (
    <div>
      <Tabs value={tab} onChange={(t) => { setTab(t); setFb(null); }} tabs={[{ id: 'purpose', label: '🎯 Why a plan?' }, { id: 'content', label: '🦀 What\'s inside (CAS-CRAB)' }, { id: 'quiz', label: '🧩 Where does it go?' }]} />
      {tab === 'purpose' && (
        <div className="grid g2 mt">
          {[
            ['🗓️', 'Documents the MEANS and SCHEDULE for achieving the test objectives'],
            ['✅', 'Helps ensure the performed test activities will MEET the established CRITERIA'],
            ['📣', 'Serves as a means of COMMUNICATION with team members and other stakeholders'],
            ['📏', 'Demonstrates that testing will ADHERE to the test policy & test strategy — or EXPLAINS why it deviates'],
          ].map(([i, t]) => <div key={t} className="vs-col"><span style={{ fontSize: 26 }}>{i}</span> <Secret>{t}</Secret></div>)}
          <div className="vs-col" style={{ gridColumn: '1 / -1', borderTop: '4px solid var(--warn)' }}>
            🧠 <b>Planning is thinking:</b> <Secret>it guides the testers' thinking and forces them to confront future challenges — risks, schedules, people, tools, costs, effort.</Secret>
          </div>
        </div>
      )}
      {tab === 'content' && (
        <div className="mt">
          <div className="row wrap" style={{ justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 40 }}>🦀</span>
            {PLAN_SECTIONS.map((p, i) => (
              <button key={p.name} className={`chip click ${sel === i ? 'on' : ''}`} style={{ fontSize: 15, fontWeight: 800, ...(sel === i ? { background: '#2ec4b6' } : {}) }} onClick={() => setSel(i)}>
                {p.l}<span className="tiny" style={{ fontWeight: 500, marginLeft: 4 }}>{p.name}</span>
              </button>
            ))}
          </div>
          <div className="detail" style={cv('#2ec4b6')}>
            <h4>{PLAN_SECTIONS[sel].l} · {PLAN_SECTIONS[sel].name}</h4>
            <Secret>{PLAN_SECTIONS[sel].ex}</Secret>
          </div>
          <div className="tiny faint center mt">Details: ISO/IEC/IEEE 29119-3</div>
        </div>
      )}
      {tab === 'quiz' && (
        <div className="mt">
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--panel-2)', fontSize: 16 }}>📄 {snip.t}</div>
          <div className="row wrap mt" style={{ gap: 6 }}>
            {PLAN_SECTIONS.map((p, i) => <button key={p.name} className="btn sm" onClick={() => answer(i)}>{p.l} · {p.name}</button>)}
          </div>
          <Feedback fb={fb} />
          <div className="tiny faint mt">Snippet {(q % PLAN_SNIPPETS.length) + 1}/{PLAN_SNIPPETS.length}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.1.4 Metrics-based estimation: ratios & extrapolation ---------- */
export function MetricsEstimationLab() {
  const [tab, setTab] = useState<'ratio' | 'hist' | 'extra'>('ratio');
  const [dev, setDev] = useState(3);
  const [test, setTest] = useState(2);
  const [newDev, setNewDev] = useState(600);
  const [hist, setHist] = useState([[400, 80], [600, 150], [500, 110], [900, 160]]);
  const [newDev2, setNewDev2] = useState(720);
  const [acts, setActs] = useState([10, 14, 12, 15, 18]);
  const [model, setModel] = useState<'avg3' | 'w'>('avg3');

  const est1 = dev > 0 ? (newDev * test) / dev : 0;
  const avgDev = hist.reduce((s, r) => s + r[0], 0) / hist.length;
  const avgTest = hist.reduce((s, r) => s + r[1], 0) / hist.length;
  const ratio = avgDev > 0 ? avgTest / avgDev : 0;
  const n = acts.length;
  const fc = model === 'avg3' ? (acts[n - 1] + acts[n - 2] + acts[n - 3]) / 3 : (3 * acts[n - 1] + acts[n - 2]) / 4;
  const maxBar = Math.max(30, ...acts, fc);

  return (
    <div>
      <div className="row wrap" style={{ gap: 8 }}>
        <span className="chip" style={{ borderColor: '#2ec4b6', color: '#2ec4b6' }}>📊 metrics-based</span>
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'ratio', label: '➗ Ratio (syllabus example)' }, { id: 'hist', label: '🗄️ Ratio from history' }, { id: 'extra', label: '📈 Extrapolation' }]} />
      </div>

      {tab === 'ratio' && (
        <div className="mt">
          <div className="row wrap" style={{ gap: 14 }}>
            <label className="small">Previous project dev : test ratio&nbsp;
              <input type="number" min={1} value={dev} onChange={(e) => setDev(Number(e.target.value))} style={{ ...inputStyle, width: 60 }} /> :{' '}
              <input type="number" min={0} value={test} onChange={(e) => setTest(Number(e.target.value))} style={{ ...inputStyle, width: 60 }} />
            </label>
            <label className="small">New project dev effort&nbsp;
              <input type="number" min={0} value={newDev} onChange={(e) => setNewDev(Number(e.target.value))} style={inputStyle} /> person-days
            </label>
          </div>
          <svg viewBox="0 0 520 110" style={{ width: '100%', marginTop: 12 }}>
            <rect x="10" y="15" width="300" height="34" rx="8" fill="rgba(139,108,255,0.25)" stroke="#8b6cff" />
            <text x="160" y="37" textAnchor="middle" fill="var(--text)" fontSize="13" fontWeight="700">🧑‍💻 dev {fmt(newDev)} pd</text>
            <rect x="10" y="62" width={Math.max(4, Math.min(500, dev > 0 ? (300 * test) / dev : 0))} height="34" rx="8" fill="rgba(46,196,182,0.25)" stroke="#2ec4b6" />
            <text x="16" y="84" fill="var(--text)" fontSize="13" fontWeight="700">🧪 test {fmt(est1)} pd</text>
          </svg>
          <div className="detail" style={cv('#2ec4b6')}>
            <b style={{ fontFamily: 'var(--mono)' }}>test = {fmt(newDev)} × {test}/{dev} = {fmt(est1)} person-days</b>
            <div className="small muted mt"><Secret>Figures from your OWN organization's previous projects (historical data) are generally the best source for "standard" ratios.</Secret></div>
          </div>
        </div>
      )}

      {tab === 'hist' && (
        <div className="mt">
          <table className="cmp">
            <thead><tr><th>Project</th><th>Dev effort</th><th>Test effort</th><th className="tiny">test/dev</th></tr></thead>
            <tbody>
              {hist.map((r, i) => (
                <tr key={i}>
                  <td>P{i + 1}</td>
                  {[0, 1].map((k) => (
                    <td key={k}><input type="number" min={0} value={r[k]} style={inputStyle}
                      onChange={(e) => setHist(hist.map((row, j) => (j === i ? row.map((v, kk) => (kk === k ? Number(e.target.value) : v)) : row)))} /></td>
                  ))}
                  <td className="tiny muted">{r[0] ? fmt((r[1] / r[0]) * 100, 1) : '—'}%</td>
                </tr>
              ))}
              <tr><td><b>Average</b></td><td><b>{fmt(avgDev)}</b></td><td><b>{fmt(avgTest)}</b></td><td className="small"><b>{fmt(ratio * 100, 2)}%</b></td></tr>
            </tbody>
          </table>
          <label className="small row mt">New project dev effort <input type="number" min={0} value={newDev2} onChange={(e) => setNewDev2(Number(e.target.value))} style={inputStyle} /></label>
          <div className="detail" style={cv('#2ec4b6')}>
            <div style={{ fontFamily: 'var(--mono)' }}>① ratio = avg test / avg dev = {fmt(avgTest)} / {fmt(avgDev)} = <b>{fmt(ratio, 4)}</b></div>
            <div style={{ fontFamily: 'var(--mono)' }}>② test = {fmt(newDev2)} × {fmt(ratio, 4)} = <b>{fmt(newDev2 * ratio)}</b></div>
            <div className="tiny muted mt">This is the method used in the official sample exam (average efforts → ratio). Defaults: 125/600 → 720 × 125/600 = 150.</div>
          </div>
        </div>
      )}

      {tab === 'extra' && (
        <div className="mt">
          <Tabs value={model} onChange={setModel} tabs={[{ id: 'avg3', label: 'Average of last 3 (syllabus)' }, { id: 'w', label: 'Weighted model (sample-exam style)' }]} />
          <svg viewBox="0 0 520 190" style={{ width: '100%', marginTop: 10 }}>
            {acts.map((a, i) => {
              const h = (a / maxBar) * 140;
              const used = model === 'avg3' ? i >= n - 3 : i >= n - 2;
              return (
                <g key={i}>
                  <rect x={20 + i * 82} y={160 - h} width="56" height={h} rx="6" fill={used ? 'rgba(46,196,182,0.55)' : 'rgba(150,150,200,0.25)'} stroke={used ? '#2ec4b6' : 'transparent'} />
                  <text x={48 + i * 82} y={154 - h} textAnchor="middle" fontSize="12" fill="var(--text)">{a}</text>
                  <text x={48 + i * 82} y="178" textAnchor="middle" fontSize="11" fill="var(--muted)">It {i + 1}</text>
                </g>
              );
            })}
            <rect x={20 + n * 82} y={160 - (fc / maxBar) * 140} width="56" height={(fc / maxBar) * 140} rx="6" fill="rgba(255,183,3,0.25)" stroke="#ffb703" strokeDasharray="5 3" />
            <text x={48 + n * 82} y={154 - (fc / maxBar) * 140} textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffb703">{fmt(fc)}</text>
            <text x={48 + n * 82} y="178" textAnchor="middle" fontSize="11" fill="#ffb703">It {n + 1}?</text>
          </svg>
          <div className="grid g3 small">
            {acts.map((a, i) => (
              <label key={i} className="col" style={{ gap: 2 }}>Iteration {i + 1} actual: <b>{a}</b>
                <input type="range" min={1} max={30} value={a} style={rangeStyle} onChange={(e) => setActs(acts.map((v, j) => (j === i ? Number(e.target.value) : v)))} />
              </label>
            ))}
          </div>
          <div className="detail" style={cv('#ffb703')}>
            {model === 'avg3'
              ? <b style={{ fontFamily: 'var(--mono)' }}>E(6) = (A3 + A4 + A5) / 3 = ({acts[2]} + {acts[3]} + {acts[4]}) / 3 = {fmt(fc)}</b>
              : <b style={{ fontFamily: 'var(--mono)' }}>E(n) = (3·A(n−1) + A(n−2)) / 4 = (3·{acts[4]} + {acts[3]}) / 4 = {fmt(fc)}</b>}
            <div className="small muted mt"><Secret>Measure as EARLY as possible in the CURRENT project, then extrapolate (usually with a mathematical model). Very suitable for iterative SDLCs.</Secret></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.1.4 Expert-based: Wideband Delphi & Planning Poker ---------- */
const DELPHI_EXPERTS = ['🧑‍💻 Dev lead', '🧪 Test lead', '📊 Analyst', '🧓 Veteran'];
const DELPHI_ROUNDS = [[8, 10, 12, 25], [9, 10, 12, 16], [10, 11, 12, 12]];
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const CARDS = [1, 2, 3, 5, 8, 13, 21];
const POKER_TEAM = [[3, 5, 13], [5, 5, 5]];

export function DelphiPoker() {
  const [tab, setTab] = useState<'delphi' | 'poker'>('delphi');
  const [r, setR] = useState(0);
  const [pr, setPr] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const est = DELPHI_ROUNDS[r];
  const med = median(est);
  const lo = med * 0.8, hi = med * 1.2;
  const outliers = est.map((e) => e < lo || e > hi);
  const consensus = !outliers.some(Boolean);

  const team = POKER_TEAM[pr];
  const all = pick === null ? [] : [...team, pick];
  const pokerResult = (): { ok: boolean; text: string } | null => {
    if (pick === null) return null;
    if (all.every((x) => x === all[0])) return { ok: true, text: `🎉 Consensus: everybody shows ${pick}. Done.` };
    const idx = (v: number) => CARDS.indexOf(v);
    const spread = idx(Math.max(...all)) - idx(Math.min(...all));
    if (pr === 1 && spread <= 1) return { ok: true, text: `Small variation (neighbouring cards) → a rule like "take the number with the most votes" can settle it → 5.` };
    return { ok: false, text: `Spread too wide (${Math.min(...all)} … ${Math.max(...all)}). The lowest and highest estimators explain their reasoning, then everybody estimates AGAIN.` };
  };
  const pres = pokerResult();

  return (
    <div>
      <div className="row wrap" style={{ gap: 8 }}>
        <span className="chip" style={{ borderColor: '#f72585', color: '#f72585' }}>🧠 expert-based</span>
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'delphi', label: '🏛️ Wideband Delphi' }, { id: 'poker', label: '🃏 Planning Poker' }]} />
      </div>
      {tab === 'delphi' ? (
        <div className="mt">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <b>Round {r + 1}</b>
            <span className="small muted">agreed boundary: within ±20% of the median ({fmt(lo, 1)} – {fmt(hi, 1)} person-days)</span>
          </div>
          <div className="grid g4 mt">
            {est.map((e, i) => (
              <div key={DELPHI_EXPERTS[i]} className="box" style={{ borderColor: outliers[i] ? 'var(--bad)' : 'var(--good)' }}>
                <div className="tiny">🙈 in isolation</div>
                <div className="small">{DELPHI_EXPERTS[i]}</div>
                <b>{e}</b>
                <div className="tiny" style={{ color: outliers[i] ? 'var(--bad)' : 'var(--good)' }}>{outliers[i] ? 'out of range → explain!' : 'in range'}</div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 520 50" style={{ width: '100%', marginTop: 8 }}>
            <line x1="10" y1="25" x2="510" y2="25" stroke="var(--border-strong)" strokeWidth="2" />
            <rect x={10 + lo * 18} y="12" width={(hi - lo) * 18} height="26" rx="6" fill="rgba(52,211,153,0.2)" stroke="var(--good)" />
            {est.map((e, i) => <circle key={i} cx={10 + e * 18} cy="25" r="7" fill={outliers[i] ? 'var(--bad)' : 'var(--good)'} />)}
            {[0, 5, 10, 15, 20, 25].map((t) => <text key={t} x={10 + t * 18} y="48" fontSize="9" fill="var(--muted)" textAnchor="middle">{t}</text>)}
          </svg>
          <div className={`feedback ${consensus ? 'ok' : 'no'}`}>
            {consensus ? '🎉 All estimates within the boundaries → consensus reached (≈ 11–12 person-days).' : '🗣️ Deviations out of range → experts DISCUSS their estimates, then each re-estimates again IN ISOLATION.'}
          </div>
          <div className="row mt" style={{ justifyContent: 'space-between' }}>
            <button className="btn sm ghost" onClick={() => setR(0)}>↺ Restart</button>
            <button className="btn sm primary" disabled={consensus} onClick={() => setR(Math.min(r + 1, DELPHI_ROUNDS.length - 1))}>Discuss & re-estimate ▶</button>
          </div>
        </div>
      ) : (
        <div className="mt">
          <div className="small muted">Round {pr + 1}: you are the 4th team member. Pick a card — all cards are revealed at the same time.</div>
          <div className="row wrap mt" style={{ gap: 8 }}>
            {CARDS.map((c) => (
              <button key={c} className="btn" onClick={() => setPick(c)}
                style={{ width: 54, height: 74, fontSize: 22, fontWeight: 800, borderColor: pick === c ? '#f72585' : undefined, background: pick === c ? 'rgba(247,37,133,0.2)' : undefined }}>{c}</button>
            ))}
          </div>
          {pick !== null && (
            <div className="row wrap mt" style={{ gap: 10 }}>
              {['🧑‍💻', '🧪', '📊'].map((who, i) => (
                <div key={who} className="box" style={{ width: 80 }}><div>{who}</div><b>{team[i]}</b></div>
              ))}
              <div className="box" style={{ width: 80, borderColor: '#f72585' }}><div>🫵 you</div><b>{pick}</b></div>
            </div>
          )}
          {pres && <div className={`feedback ${pres.ok ? 'ok' : 'no'}`} style={{ marginTop: 10 }}>{pres.text}</div>}
          <div className="row mt" style={{ justifyContent: 'space-between' }}>
            <button className="btn sm ghost" onClick={() => { setPr(0); setPick(null); }}>↺ Restart</button>
            <button className="btn sm primary" disabled={pick === null || pr === 1 || !!pres?.ok} onClick={() => { setPr(1); setPick(null); }}>Discuss & play again ▶</button>
          </div>
          <div className="tiny faint mt">Planning Poker = a VARIANT of Wideband Delphi, common in Agile; cards carry numbers representing effort size.</div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.1.4 Three-point estimation calculator ---------- */
const PRESETS = [
  { label: 'Syllabus: 6 · 9 · 18', a: 6, m: 9, b: 18, n: 1 },
  { label: 'Sample A: 2 · 11 · 14', a: 2, m: 11, b: 14, n: 1 },
  { label: 'Sample D: 1 · 3 · 8 per TC × 4 TCs', a: 1, m: 3, b: 8, n: 4 },
];
function S({ label, v, set, min, max, color }: { label: string; v: number; set: (x: number) => void; min: number; max: number; color: string }) {
  return (
    <label className="col" style={{ gap: 2 }}>
      <span className="small"><b style={{ color }}>{label}</b> = <b>{v}</b></span>
      <input type="range" min={min} max={max} value={v} onChange={(e) => set(Number(e.target.value))} style={{ ...rangeStyle, accentColor: color }} />
    </label>
  );
}
export function ThreePointCalc() {
  const [a, setA] = useState(6);
  const [m, setM] = useState(9);
  const [b, setB] = useState(18);
  const [n, setN] = useState(1);
  const E = (a + 4 * m + b) / 6;
  const SD = (b - a) / 6;
  const X = (v: number) => 20 + (v / 40) * 480;
  const setAll = (p: typeof PRESETS[number]) => { setA(p.a); setM(p.m); setB(p.b); setN(p.n); };
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        {PRESETS.map((p) => <button key={p.label} className="btn sm" onClick={() => setAll(p)}>{p.label}</button>)}
      </div>
      <div className="grid g3 mt">
        <S label="a (most optimistic)" v={a} min={0} max={m} set={setA} color="#34d399" />
        <S label="m (most likely)" v={m} min={a} max={b} set={setM} color="#ffb703" />
        <S label="b (most pessimistic)" v={b} min={m} max={40} set={setB} color="#fb7185" />
      </div>
      <svg viewBox="0 0 520 90" style={{ width: '100%', marginTop: 10 }}>
        <line x1="20" y1="50" x2="500" y2="50" stroke="var(--border-strong)" strokeWidth="2" />
        <rect x={X(E - SD)} y="36" width={Math.max(2, X(E + SD) - X(E - SD))} height="28" rx="6" fill="rgba(46,196,182,0.22)" stroke="#2ec4b6" />
        {[[a, 'a', '#34d399'], [m, 'm', '#ffb703'], [b, 'b', '#fb7185']].map(([v, l, c]) => (
          <g key={l as string}>
            <circle cx={X(v as number)} cy="50" r="6" fill={c as string} />
            <text x={X(v as number)} y="84" fontSize="12" textAnchor="middle" fill={c as string} fontWeight="700">{l}={v}</text>
          </g>
        ))}
        <line x1={X(E)} y1="20" x2={X(E)} y2="66" stroke="#2ec4b6" strokeWidth="3" />
        <text x={X(E)} y="15" fontSize="12" textAnchor="middle" fill="#2ec4b6" fontWeight="700">E = {fmt(E)} ± {fmt(SD)}</text>
      </svg>
      <div className="detail" style={cv('#2ec4b6')}>
        <div style={{ fontFamily: 'var(--mono)', lineHeight: 1.9 }}>
          E  = (a + 4·m + b) / 6 = ({a} + 4·{m} + {b}) / 6 = {a + 4 * m + b} / 6 = <b>{fmt(E)}</b><br />
          SD = (b − a) / 6 = ({b} − {a}) / 6 = <b>{fmt(SD)}</b><br />
          → estimate <b>{fmt(E)} ± {fmt(SD)}</b>, i.e., between {fmt(E - SD)} and {fmt(E + SD)}
        </div>
        <div className="row mt" style={{ gap: 8 }}>
          <span className="small">Number of identical items:</span>
          <input type="number" min={1} value={n} onChange={(e) => setN(Math.max(1, Number(e.target.value)))} style={{ ...inputStyle, width: 70 }} />
          {n > 1 && <b style={{ fontFamily: 'var(--mono)' }}>total = {n} × {fmt(E)} = {fmt(n * E)}</b>}
        </div>
      </div>
    </div>
  );
}

/* ---------- 5.1.5 Test case prioritization lab ---------- */
interface PTc { id: string; name: string; p: number; deps: string[] }
const P_TCS: PTc[] = [
  { id: 'TC1', name: 'Pay by card', p: 1, deps: ['TC4'] },
  { id: 'TC2', name: 'Create account', p: 3, deps: [] },
  { id: 'TC3', name: 'Apply voucher', p: 2, deps: ['TC4'] },
  { id: 'TC4', name: 'Add to cart', p: 2, deps: ['TC5'] },
  { id: 'TC5', name: 'Search product', p: 3, deps: [] },
  { id: 'TC6', name: 'View order history', p: 3, deps: ['TC2'] },
];
const COV_REQS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
const COV_TCS: Record<string, string[]> = { TC1: ['R1', 'R2', 'R3', 'R4'], TC2: ['R1', 'R2', 'R3'], TC3: ['R5', 'R6'], TC4: ['R4', 'R5'] };

function nextExpected(done: string[]): string | null {
  const rem = P_TCS.filter((t) => !done.includes(t.id));
  if (!rem.length) return null;
  const unmet = (t: PTc) => t.deps.filter((d) => !done.includes(d));
  const best = (list: PTc[]) => [...list].sort((x, y) => x.p - y.p || unmet(x).length - unmet(y).length || x.id.localeCompare(y.id))[0];
  const resolve = (t: PTc): PTc => { const u = unmet(t); return u.length ? resolve(best(P_TCS.filter((x) => u.includes(x.id)))) : t; };
  return resolve(best(rem)).id;
}

export function PrioritizationLab() {
  const [tab, setTab] = useState<'dep' | 'cov'>('dep');
  const [done, setDone] = useState<string[]>([]);
  const [fb, setFb] = useState<Fb | null>(null);
  const [cov, setCov] = useState<string[]>([]);
  const [cfb, setCfb] = useState<Fb | null>(null);

  const clickDep = (t: PTc) => {
    if (done.includes(t.id)) return;
    const missing = t.deps.filter((d) => !done.includes(d));
    if (missing.length) { setFb({ ok: false, text: <>⛔ {t.id} is BLOCKED — it depends on {missing.join(', ')}, which has not run yet.</>, n: Date.now() }); return; }
    const exp = nextExpected(done);
    if (t.id === exp) {
      const nd = [...done, t.id];
      setDone(nd);
      setFb({ ok: true, text: nd.length === P_TCS.length ? <>🏁 Perfect schedule: {nd.join(' → ')}</> : <>✅ {t.id} scheduled as #{nd.length}.</>, n: Date.now() });
    } else setFb({ ok: false, text: <>🤔 {t.id} can run, but it is not the best choice now. Which <b>highest-priority</b> test can you unlock soonest — and what must run before it?</>, n: Date.now() });
  };
  const covered = new Set(cov.flatMap((t) => COV_TCS[t]));
  const addCov = (t: string) => COV_TCS[t].filter((r) => !covered.has(r)).length;
  const clickCov = (t: string) => {
    if (cov.includes(t)) return;
    const rem = Object.keys(COV_TCS).filter((x) => !cov.includes(x));
    const max = Math.max(...rem.map(addCov));
    if (addCov(t) === max) {
      const nc = [...cov, t];
      setCov(nc);
      setCfb({ ok: true, text: <>✅ {t} adds {max} new requirement{max === 1 ? '' : 's'}{max === 0 && rem.length > 1 ? ' — everything is covered already, so the rest is a tie' : ''}.{nc.length === 4 ? ` Order: ${nc.join(' → ')}` : ''}</>, n: Date.now() });
    } else setCfb({ ok: false, text: <>❌ {t} adds only {addCov(t)} NEW requirement(s). Another test adds {max}. Additional coverage counts only what is not yet covered!</>, n: Date.now() });
  };

  return (
    <div>
      <div className="grid g3 small">
        {[
          ['⚠️', 'Risk-based', 'Order from risk analysis: tests covering the most important risks first', '#fb7185'],
          ['🗺️', 'Coverage-based', 'Highest coverage first (variant: ADDITIONAL coverage — each next test adds the most new coverage)', '#22d3ee'],
          ['📋', 'Requirements-based', 'Priorities of the traced requirements (defined by stakeholders) — most important first', '#ffb703'],
        ].map(([i, t, d, c]) => (
          <div key={t} className="vs-col" style={{ borderTop: `4px solid ${c}` }}><b>{i} {t}</b><div className="muted"><Secret>{d}</Secret></div></div>
        ))}
      </div>
      <div className="mt"><Tabs value={tab} onChange={setTab} tabs={[{ id: 'dep', label: '🔗 Priorities + dependencies' }, { id: 'cov', label: '🧮 Additional coverage' }]} /></div>

      {tab === 'dep' ? (
        <div className="mt">
          <div className="small muted">Click the test cases in the order you would execute them. <b>P1 = highest priority.</b> A test can only run after the tests it depends on.</div>
          <div className="icon-grid mt" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {P_TCS.map((t) => {
              const pos = done.indexOf(t.id);
              const col = t.p === 1 ? '#fb7185' : t.p === 2 ? '#ffb703' : '#22d3ee';
              return (
                <div key={t.id} className={`node ${pos >= 0 ? 'sel' : ''}`} style={{ ...cv('#34d399'), opacity: pos >= 0 ? 0.6 : 1, padding: 10 }} onClick={() => clickDep(t)}>
                  {pos >= 0 && <span style={{ position: 'absolute', top: 6, left: 10, fontWeight: 800, color: 'var(--good)' }}>#{pos + 1}</span>}
                  <span className="chip" style={{ position: 'absolute', top: 6, right: 6, padding: '2px 8px', color: col, borderColor: col }}>P{t.p}</span>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--display)', marginTop: 16 }}>{t.id}</div>
                  <div className="small">{t.name}</div>
                  <div className="tiny muted">{t.deps.length ? `needs ${t.deps.join(', ')}` : 'no dependency'}</div>
                </div>
              );
            })}
          </div>
          <div className="row wrap mt" style={{ gap: 6 }}>
            <b className="small">Schedule:</b>
            {done.length === 0 ? <span className="small faint">empty</span> : done.map((d, i) => <span key={d} className="chip good">{i + 1}. {d}</span>)}
          </div>
          <Feedback fb={fb} />
          <div className="row mt" style={{ justifyContent: 'space-between' }}>
            <span className="tiny faint">Also check resource availability (tools, environments, people available only in a time window).</span>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn sm ghost" onClick={() => { const e = nextExpected(done); setFb(e ? { ok: true, text: <>💡 Next: {e}</>, n: Date.now() } : null); }}>💡 Hint</button>
              <button className="btn sm ghost" onClick={() => { setDone([]); setFb(null); }}>↺ Reset</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt">
          <div className="small muted">Traceability matrix (✗ = test covers requirement). Pick tests using <b>additional coverage prioritization</b>. Covered columns turn green.</div>
          <table className="cmp mt" style={{ textAlign: 'center' }}>
            <thead><tr><th>Test</th>{COV_REQS.map((r) => <th key={r} style={{ textAlign: 'center', color: covered.has(r) ? 'var(--good)' : undefined }}>{r}</th>)}<th>total</th><th /></tr></thead>
            <tbody>
              {Object.entries(COV_TCS).map(([t, rs]) => (
                <tr key={t} style={{ opacity: cov.includes(t) ? 0.5 : 1 }}>
                  <td><b>{t}</b></td>
                  {COV_REQS.map((r) => <td key={r} style={{ textAlign: 'center', background: rs.includes(r) && covered.has(r) ? 'color-mix(in srgb, var(--good) 18%, transparent)' : undefined }}>{rs.includes(r) ? '✗' : ''}</td>)}
                  <td>{rs.length}</td>
                  <td>{cov.includes(t) ? <span className="chip good">#{cov.indexOf(t) + 1}</span> : <button className="btn sm" onClick={() => clickCov(t)}>run ▶</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Feedback fb={cfb} />
          <div className="row mt" style={{ justifyContent: 'space-between' }}>
            <span className="tiny faint">Plain coverage-based order would be TC1 (4) → TC2 (3) → … — spot the difference!</span>
            <button className="btn sm ghost" onClick={() => { setCov([]); setCfb(null); }}>↺ Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.1.6 Test pyramid ---------- */
const PYR_MODELS = {
  cohn: { label: 'Cohn 2009 (original)', layers: ['UI tests', 'Service tests', 'Unit tests'] },
  alt: { label: 'Another popular model', layers: ['End-to-end tests', 'Integration (component integration) tests', 'Unit (component) tests'] },
};
const PYR_INFO = [
  { tag: 'TOP', count: '🔺 just a few', text: 'Complex, high-level, end-to-end tests. Slower than lower layers, check a LARGE piece of functionality → usually just a few needed for reasonable coverage.' },
  { tag: 'MIDDLE', count: '🔸 some', text: 'In between: coarser than unit tests, finer than end-to-end tests. Number and naming of layers may differ between models.' },
  { tag: 'BOTTOM', count: '🟩🟩🟩 a lot', text: 'Small, isolated, fast tests checking a SMALL piece of functionality → usually a lot of them needed for reasonable coverage.' },
];
export function TestPyramid() {
  const [model, setModel] = useState<'cohn' | 'alt'>('cohn');
  const [sel, setSel] = useState(2);
  const polys = ['280,10 340,90 220,90', '220,90 340,90 400,170 160,170', '160,170 400,170 460,250 100,250'];
  const colors = ['#fb7185', '#ffb703', '#2ec4b6'];
  const L = PYR_MODELS[model].layers;
  return (
    <div>
      <Tabs value={model} onChange={setModel} tabs={[{ id: 'cohn', label: PYR_MODELS.cohn.label }, { id: 'alt', label: PYR_MODELS.alt.label }]} />
      <svg viewBox="0 0 560 270" style={{ width: '100%', maxWidth: 640, display: 'block', margin: '10px auto 0' }}>
        <defs>
          <marker id="pyr-ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="var(--muted)" /></marker>
        </defs>
        {polys.map((p, i) => (
          <polygon key={i} points={p} fill={`${colors[i]}${sel === i ? '66' : '2e'}`} stroke={colors[i]} strokeWidth={sel === i ? 3 : 1.5} style={{ cursor: 'pointer' }} onClick={() => setSel(i)} />
        ))}
        {[72, 136, 216].map((y, i) => (
          <text key={i} x="280" y={y} textAnchor="middle" fontSize={i === 0 ? 11 : 13} fontWeight="700" fill="var(--text)" style={{ pointerEvents: 'none' }}>
            {L[i].length > 22 && i === 1 ? L[i].replace(' (component integration)', '') : L[i]}
          </text>
        ))}
        <line x1="60" y1="245" x2="60" y2="20" stroke="var(--muted)" strokeWidth="2" markerEnd="url(#pyr-ah)" />
        <text x="45" y="135" fontSize="11" fill="var(--muted)" textAnchor="middle" transform="rotate(-90 45 135)">granularity ↓ · isolation ↓ · execution time ↑</text>
        <line x1="500" y1="20" x2="500" y2="245" stroke="var(--muted)" strokeWidth="2" markerEnd="url(#pyr-ah)" />
        <text x="518" y="135" fontSize="11" fill="var(--muted)" textAnchor="middle" transform="rotate(90 518 135)">number of tests needed ↑</text>
      </svg>
      <div className="detail" style={cv(colors[sel])}>
        <h4>{PYR_INFO[sel].tag}: {L[sel]} <span className="small muted">({PYR_INFO[sel].count})</span></h4>
        <Secret>{PYR_INFO[sel].text}</Secret>
      </div>
      <div className="small muted mt">The pyramid shows that tests may have different <b>granularity</b>. It supports the team in <b>test automation</b> and <b>test effort allocation</b>: different test objectives are supported by different levels of test automation.</div>
    </div>
  );
}

/* ---------- 5.1.7 Testing quadrants ---------- */
const QUADS = [
  { q: 'Q2', pos: 'tl', color: '#ffb703', face: 'Business facing', role: 'Support the team', auto: 'manual or automated',
    items: ['Functional tests', 'Examples', 'User story tests', 'User experience prototypes', 'API testing', 'Simulations'], note: 'Check the acceptance criteria.' },
  { q: 'Q3', pos: 'tr', color: '#f72585', face: 'Business facing', role: 'Critique the product', auto: 'often manual',
    items: ['Exploratory testing', 'Usability testing', 'User acceptance testing'], note: 'User-oriented.' },
  { q: 'Q1', pos: 'bl', color: '#2ec4b6', face: 'Technology facing', role: 'Support the team', auto: 'automated, in CI',
    items: ['Component tests', 'Component integration tests'], note: 'Should be automated and included in the CI process.' },
  { q: 'Q4', pos: 'br', color: '#8b6cff', face: 'Technology facing', role: 'Critique the product', auto: 'often automated',
    items: ['Smoke tests', 'Non-functional tests (except usability)'], note: 'e.g., performance, security, reliability tests.' },
];
const QUAD_QUIZ: [string, string][] = [
  ['Component tests', 'Q1'], ['Usability testing', 'Q3'], ['Smoke tests', 'Q4'], ['User story tests', 'Q2'], ['Exploratory testing', 'Q3'],
  ['Performance testing', 'Q4'], ['Component integration tests', 'Q1'], ['API testing', 'Q2'], ['User acceptance testing', 'Q3'],
  ['Security testing', 'Q4'], ['User experience prototypes', 'Q2'], ['Reliability testing', 'Q4'], ['Simulations', 'Q2'],
];
export function TestingQuadrants() {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [sel, setSel] = useState('Q1');
  const [qi, setQi] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const [score, setScore] = useState(0);
  const cur = QUAD_QUIZ[qi % QUAD_QUIZ.length];
  const click = (q: string) => {
    if (mode === 'learn') { setSel(q); return; }
    if (q === cur[1]) { setScore(score + 1); setFb({ ok: true, text: <>✅ {cur[0]} → {q}</>, n: Date.now() }); setQi(qi + 1); }
    else setFb({ ok: false, text: <>❌ Not {q}. Ask: business- or technology-facing? Supports the team or critiques the product?</>, n: Date.now() });
  };
  const Q = (q: typeof QUADS[number]) => (
    <div key={q.q} className={`node ${mode === 'learn' && sel === q.q ? 'sel' : ''}`} style={{ ...cv(q.color), textAlign: 'left', minHeight: 150 }} onClick={() => click(q.q)}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b style={{ fontFamily: 'var(--display)', fontSize: 24, color: q.color }}>{q.q}</b>
        <span className="tiny muted">{q.auto}</span>
      </div>
      {mode === 'learn' && <ul className="small" style={{ margin: '6px 0 0', paddingLeft: 18 }}>{q.items.map((i) => <Secret as="li" key={i}>{i}</Secret>)}</ul>}
    </div>
  );
  const s = QUADS.find((q) => q.q === sel)!;
  return (
    <div>
      <div className="row wrap" style={{ justifyContent: 'space-between' }}>
        <Tabs value={mode} onChange={(m) => { setMode(m); setFb(null); }} tabs={[{ id: 'learn', label: '🧭 Explore' }, { id: 'quiz', label: '🎯 Place the test' }]} />
        {mode === 'quiz' && <span className="chip good">Score {score}</span>}
      </div>
      {mode === 'quiz' && <div className="mt" style={{ padding: 12, borderRadius: 12, background: 'var(--panel-2)', fontSize: 17 }}>Where does <b>{cur[0]}</b> live? Click its quadrant.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr', gridTemplateRows: 'auto 1fr 1fr', gap: 8, marginTop: 12 }}>
        <div />
        <div className="center small" style={{ fontWeight: 700, color: 'var(--good)' }}>🤝 SUPPORT THE TEAM<div className="tiny muted">(guide development)</div></div>
        <div className="center small" style={{ fontWeight: 700, color: 'var(--bad)' }}>🧐 CRITIQUE THE PRODUCT<div className="tiny muted">(measure behavior vs expectations)</div></div>
        <div className="small" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 700, color: '#ffb703' }}>👔 BUSINESS FACING</div>
        {Q(QUADS[0])}{Q(QUADS[1])}
        <div className="small" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 700, color: '#2ec4b6' }}>⚙️ TECHNOLOGY FACING</div>
        {Q(QUADS[2])}{Q(QUADS[3])}
      </div>
      {mode === 'learn' ? (
        <div className="detail" style={cv(s.color)}>
          <h4>{s.q}: {s.face} · {s.role}</h4>
          <Secret>{s.note} Execution: {s.auto}.</Secret>
        </div>
      ) : <Feedback fb={fb} />}
      <div className="tiny faint mt">Brian Marick's model: groups test levels with test types, activities, techniques and work products in Agile — helps make sure all appropriate test types & levels are included, and gives all stakeholders a common language.</div>
    </div>
  );
}

/* ---------- 5.2.1 Risk matrix & quantitative risk level ---------- */
const RISKS = [
  { id: 'R1', name: 'Wrong interest calculation', l: 3, i: 5 },
  { id: 'R2', name: 'Search page slow at peak', l: 4, i: 2 },
  { id: 'R3', name: 'Typo in help text', l: 2, i: 1 },
  { id: 'R4', name: 'Payment data leaked', l: 2, i: 5 },
  { id: 'R5', name: 'Crash on login (old phones)', l: 3, i: 3 },
];
const levelOf = (s: number) => (s >= 15 ? { n: 'Very high', c: '#fb7185' } : s >= 8 ? { n: 'High', c: '#ff9f1c' } : s >= 4 ? { n: 'Medium', c: '#ffb703' } : { n: 'Low', c: '#34d399' });
export function RiskMatrix() {
  const [tab, setTab] = useState<'matrix' | 'calc'>('matrix');
  const [sel, setSel] = useState('R1');
  const [p1, setP1] = useState(20);
  const [i1, setI1] = useState(50000);
  const [p2, setP2] = useState(50);
  const [i2, setI2] = useState(15000);
  const r = RISKS.find((x) => x.id === sel)!;
  const sorted = [...RISKS].sort((a, b) => b.l * b.i - a.l * a.i);
  const lv1 = (p1 / 100) * i1, lv2 = (p2 / 100) * i2;
  return (
    <div>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'matrix', label: '🟥 Qualitative: risk matrix' }, { id: 'calc', label: '🧮 Quantitative: likelihood × impact' }]} />
      {tab === 'matrix' ? (
        <div className="grid g2 mt" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(5, 1fr)', gap: 4 }}>
              {[5, 4, 3, 2, 1].map((l) => (
                <div key={l} style={{ display: 'contents' }}>
                  <div className="tiny muted" style={{ display: 'grid', placeItems: 'center' }}>{l}</div>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const lv = levelOf(l * i);
                    const here = RISKS.filter((x) => x.l === l && x.i === i);
                    return (
                      <div key={i} style={{ aspectRatio: '1', borderRadius: 8, background: `${lv.c}${here.some((h) => h.id === sel) ? 'cc' : '40'}`, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, border: here.some((h) => h.id === sel) ? '2px solid var(--text)' : '1px solid var(--border)' }}>
                        {here.map((h) => <span key={h.id} style={{ cursor: 'pointer' }} onClick={() => setSel(h.id)}>{h.id}</span>)}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div />
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="tiny muted center">{i}</div>)}
            </div>
            <div className="row tiny muted" style={{ justifyContent: 'space-between', marginTop: 4 }}><span>↑ likelihood</span><span>impact →</span></div>
          </div>
          <div>
            <div className="kicker">Risk register (sorted by level)</div>
            <div className="col mt" style={{ gap: 6 }}>
              {sorted.map((x, k) => {
                const lv = levelOf(x.l * x.i);
                return (
                  <div key={x.id} className={`seq-item ${x.id === sel ? 'ok' : ''}`} style={{ cursor: 'pointer', padding: '8px 10px' }} onClick={() => setSel(x.id)}>
                    <span className="num">{k + 1}</span>
                    <div style={{ flex: 1 }}><b className="small">{x.id}</b> <span className="small">{x.name}</span></div>
                    <span className="chip" style={{ color: lv.c, borderColor: lv.c }}>{x.l}×{x.i}={x.l * x.i}</span>
                  </div>
                );
              })}
            </div>
            <div className="detail" style={cv(levelOf(r.l * r.i).c)}>
              <b>{r.id} {r.name}</b>: likelihood {r.l} × impact {r.i} → <b>{levelOf(r.l * r.i).n}</b> risk level. <Secret>The higher the risk level, the more important its treatment.</Secret>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt">
          <div className="small muted">Likelihood is a probability: <b>greater than 0 and less than 1</b>. Impact = the harm (here in €).</div>
          <div className="grid g2 mt">
            {[
              { name: 'Risk A', p: p1, sp: setP1, im: i1, si: setI1, lv: lv1 },
              { name: 'Risk B', p: p2, sp: setP2, im: i2, si: setI2, lv: lv2 },
            ].map((x) => (
              <div key={x.name} className="vs-col" style={{ borderTop: `4px solid ${x.lv >= Math.max(lv1, lv2) ? 'var(--bad)' : 'var(--warn)'}` }}>
                <b>{x.name}</b>
                <label className="small col mt" style={{ gap: 2 }}>likelihood = {fmt(x.p / 100)}
                  <input type="range" min={1} max={99} value={x.p} onChange={(e) => x.sp(Number(e.target.value))} style={rangeStyle} /></label>
                <label className="small col" style={{ gap: 2 }}>impact = €{x.im.toLocaleString('en-US')}
                  <input type="range" min={1000} max={100000} step={1000} value={x.im} onChange={(e) => x.si(Number(e.target.value))} style={rangeStyle} /></label>
                <div className="mt" style={{ fontFamily: 'var(--mono)' }}>risk level = {fmt(x.p / 100)} × {x.im.toLocaleString('en-US')} = <b>€{Math.round(x.lv).toLocaleString('en-US')}</b></div>
              </div>
            ))}
          </div>
          <div className="feedback ok" style={{ marginTop: 10 }}>{lv1 === lv2 ? 'Both risks have the same level.' : `${lv1 > lv2 ? 'Risk A' : 'Risk B'} has the higher risk level → treat it first.`}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.2.3 Product risk analysis → thoroughness & scope ---------- */
const INFLUENCE = [
  { icon: '🔭', what: 'Determine the test SCOPE to be carried out', ex: ['Light check of the main flow', 'Main flows + key alternatives', 'All flows incl. error & edge cases'] },
  { icon: '🪜', what: 'Determine the test LEVELS and propose test TYPES', ex: ['System-level functional tests', '+ integration tests', 'Several levels + non-functional types (e.g., security, performance)'] },
  { icon: '🧰', what: 'Determine the test TECHNIQUES and the COVERAGE to be achieved', ex: ['Experience-based, low coverage target', 'EP + BVA, moderate coverage', 'Rigorous techniques, high coverage target'] },
  { icon: '⏱️', what: 'ESTIMATE the test effort for each task', ex: ['Small effort', 'Moderate effort', 'Largest share of the effort'] },
  { icon: '🥇', what: 'PRIORITIZE testing to find critical defects as early as possible', ex: ['Run late', 'Run in the middle', 'Run first'] },
  { icon: '➕', what: 'Decide on activities IN ADDITION to testing to reduce risk', ex: ['None', 'Maybe', 'e.g., training, extra design work'] },
];
export function RiskThoroughness() {
  const [lvl, setLvl] = useState(2);
  const names = ['🟢 Low', '🟡 Medium', '🔴 High'];
  const cols = ['#34d399', '#ffb703', '#fb7185'];
  return (
    <div>
      <div className="flow">
        <div className="node" style={cv('#ff7a59')}><div className="n-ico">🕵️</div><div className="n-title small">Risk identification</div><div className="n-sub"><Secret>comprehensive list via brainstorming, workshops, interviews, cause-effect diagrams</Secret></div></div>
        <div className="flow-arrow">➜</div>
        <div className="node" style={cv('#8b6cff')}><div className="n-ico">⚖️</div><div className="n-title small">Risk assessment</div><div className="n-sub"><Secret>categorize · likelihood, impact & level · prioritize · propose ways to handle</Secret></div></div>
        <div className="flow-arrow">➜</div>
        <div className="node" style={cv('#2ec4b6')}><div className="n-ico">🎛️</div><div className="n-title small">Shape the testing</div><div className="n-sub"><Secret>thoroughness & test scope → minimize RESIDUAL product risk</Secret></div></div>
      </div>
      <div className="row mt" style={{ gap: 10 }}>
        <b className="small">Risk level of the feature:</b>
        <Tabs value={String(lvl) as '0' | '1' | '2'} onChange={(v) => setLvl(Number(v))} tabs={[{ id: '0', label: names[0] }, { id: '1', label: names[1] }, { id: '2', label: names[2] }]} />
      </div>
      <div className="grid g2 mt">
        {INFLUENCE.map((f) => (
          <div key={f.what} className="vs-col" style={{ borderLeft: `4px solid ${cols[lvl]}` }}>
            <div className="small"><span style={{ fontSize: 20 }}>{f.icon}</span> <Secret>{f.what}</Secret></div>
            <div className="small mt" style={{ color: cols[lvl], fontWeight: 600 }}>e.g. {f.ex[lvl]}</div>
          </div>
        ))}
      </div>
      <div className="tiny faint mt">The six uses are from the syllabus; the "e.g." values are illustrative only. Assessment can be quantitative (likelihood × impact), qualitative (risk matrix) or mixed. Ideally starts EARLY in the SDLC.</div>
    </div>
  );
}

/* ---------- 5.2.4 Risk response options ---------- */
const RESPONSES = [
  { id: 'mit', icon: '🛠️', name: 'Mitigation by testing', nick: 'Fix it', color: '#2ec4b6' },
  { id: 'acc', icon: '🤷', name: 'Risk acceptance', nick: 'Live with it', color: '#ffb703' },
  { id: 'tra', icon: '📤', name: 'Risk transfer', nick: 'Pass it on', color: '#8b6cff' },
  { id: 'con', icon: '🅱️', name: 'Contingency plan', nick: 'Plan B', color: '#fb7185' },
];
const RESP_SCEN = [
  { t: 'Add performance tests and assign testers experienced in load testing for the booking engine.', a: 'mit' },
  { t: 'A cosmetic misalignment on an internal admin page: the product owner decides to live with it.', a: 'acc' },
  { t: 'An external provider contractually takes over responsibility for data-center outages.', a: 'tra' },
  { t: 'Prepare a rollback procedure and a manual fallback process in case the new billing run fails in production.', a: 'con' },
  { t: 'Perform reviews and static analysis of the encryption module.', a: 'mit' },
  { t: 'Use an independent test team and branch coverage for the safety-critical module.', a: 'mit' },
];
export function RiskResponse() {
  const [q, setQ] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const sc = RESP_SCEN[q % RESP_SCEN.length];
  const pick = (id: string) => {
    const r = RESPONSES.find((x) => x.id === id)!;
    if (id === sc.a) { setFb({ ok: true, text: <>✅ {r.icon} {r.name} ("{r.nick}")</>, n: Date.now() }); setQ(q + 1); }
    else setFb({ ok: false, text: <>❌ Not {r.name}. Is the risk reduced, tolerated, handed to someone else, or prepared for?</>, n: Date.now() });
  };
  return (
    <div>
      <div className="grid g2">
        <div className="vs-col" style={{ borderTop: '4px solid #2ec4b6' }}>
          <b>🛠️ Risk mitigation</b>
          <div className="small muted"><Secret>Implement the actions proposed in risk assessment to REDUCE the risk level.</Secret></div>
        </div>
        <div className="vs-col" style={{ borderTop: '4px solid #22d3ee' }}>
          <b>📡 Risk monitoring</b>
          <ul className="small" style={{ margin: '4px 0 0', paddingLeft: 18 }}>
            <Secret as="li">Ensure mitigation actions are EFFECTIVE</Secret>
            <Secret as="li">Obtain further information to IMPROVE risk assessment</Secret>
            <Secret as="li">Identify EMERGING risks</Secret>
          </ul>
        </div>
      </div>
      <div className="kicker mt">Response options — what is happening here?</div>
      <div className="mt" style={{ padding: 14, borderRadius: 12, background: 'var(--panel-2)', fontSize: 16 }}>📌 {sc.t}</div>
      <div className="grid g4 mt">
        {RESPONSES.map((r) => (
          <div key={r.id} className="node" style={{ ...cv(r.color), padding: 10 }} onClick={() => pick(r.id)}>
            <div style={{ fontSize: 28 }}>{r.icon}</div>
            <div className="small" style={{ fontWeight: 700 }}>{r.name}</div>
            <div className="tiny muted">"{r.nick}"</div>
          </div>
        ))}
      </div>
      <Feedback fb={fb} />
      <div className="vs-col mt" style={{ borderTop: '4px solid #2ec4b6' }}>
        <b>🛠️ Mitigating product risks BY TESTING — 6 actions</b>
        <ol className="small" style={{ margin: '6px 0 0', paddingLeft: 20 }}>
          <Secret as="li">Select testers with the right level of experience and skills for the risk type</Secret>
          <Secret as="li">Apply an appropriate level of independence of testing</Secret>
          <Secret as="li">Perform reviews and static analysis</Secret>
          <Secret as="li">Apply appropriate test techniques and coverage levels</Secret>
          <Secret as="li">Apply appropriate test types addressing the affected quality characteristics</Secret>
          <Secret as="li">Perform dynamic testing, including regression testing</Secret>
        </ol>
      </div>
    </div>
  );
}

/* ---------- 5.3 / 5.3.1 Monitoring, control, completion & metrics ---------- */
const METRIC_FAM = [
  { id: 'proj', icon: '📅', name: 'Project progress', color: '#8b6cff', ex: 'task completion, resource usage, test effort' },
  { id: 'test', icon: '🧪', name: 'Test progress', color: '#22d3ee', ex: 'test case implementation progress, test environment preparation progress, # test cases run/not run, passed/failed, test execution time' },
  { id: 'qual', icon: '💎', name: 'Product quality', color: '#2ec4b6', ex: 'availability, response time, mean time to failure' },
  { id: 'def', icon: '🐞', name: 'Defect', color: '#fb7185', ex: 'number & priorities of defects found/fixed, defect density, defect detection percentage' },
  { id: 'risk', icon: '⚠️', name: 'Risk', color: '#ff9f1c', ex: 'residual risk level' },
  { id: 'cov', icon: '🗺️', name: 'Coverage', color: '#ffb703', ex: 'requirements coverage, code coverage' },
  { id: 'cost', icon: '💰', name: 'Cost', color: '#34d399', ex: 'cost of testing, organizational cost of quality' },
];
const METRIC_QUIZ: [string, string][] = [
  ['Mean time to failure', 'qual'], ['Defect detection percentage', 'def'], ['Residual risk level', 'risk'], ['Number of test cases passed/failed', 'test'],
  ['Requirements coverage', 'cov'], ['Organizational cost of quality', 'cost'], ['Resource usage', 'proj'], ['Test environment preparation progress', 'test'],
  ['Availability', 'qual'], ['Defect density', 'def'], ['Test effort', 'proj'], ['Test execution time', 'test'], ['Response time', 'qual'], ['Code coverage', 'cov'],
];
export function MetricsCockpit() {
  const [tab, setTab] = useState<'loop' | 'metrics'>('loop');
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState<string | null>('test');
  const [qi, setQi] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const LOOP = [
    { icon: '📡', name: 'Test monitoring', color: '#22d3ee', pts: ['GATHERS information about testing', 'Assesses test progress', 'Measures whether exit criteria (or their tasks) are satisfied — e.g., coverage of product risks, requirements, acceptance criteria'] },
    { icon: '🕹️', name: 'Test control', color: '#ff7a59', pts: ['USES monitoring info to give guidance & corrective actions as CONTROL DIRECTIVES, e.g.:', 'Reprioritize tests when an identified risk becomes an issue', 'Re-evaluate whether a test item meets entry/exit criteria due to rework', 'Adjust the test schedule for a delayed test environment', 'Add new resources when and where needed'] },
    { icon: '🏁', name: 'Test completion', color: '#2ec4b6', pts: ['Collects data from completed test activities to consolidate experience, testware and other relevant information', 'At milestones: test level completed, agile iteration finished, test project completed (or cancelled), system released, maintenance release completed'] },
  ];
  const cur = METRIC_QUIZ[qi % METRIC_QUIZ.length];
  const answer = (id: string) => {
    const f = METRIC_FAM.find((x) => x.id === id)!;
    if (id === cur[1]) { setFb({ ok: true, text: <>✅ {cur[0]} → {f.icon} {f.name} metrics</>, n: Date.now() }); setQi(qi + 1); }
    else setFb({ ok: false, text: <>❌ Not {f.name}. Try again.</>, n: Date.now() });
  };
  return (
    <div>
      <Tabs value={tab} onChange={(t) => { setTab(t); setFb(null); }} tabs={[{ id: 'loop', label: '🔁 Monitor → Control → Complete' }, { id: 'metrics', label: '📊 Metrics cockpit' }]} />
      {tab === 'loop' ? (
        <div className="mt">
          <div className="flow">
            {LOOP.map((l, i) => (
              <div key={l.name} style={{ display: 'contents' }}>
                {i > 0 && <div className="flow-arrow">➜</div>}
                <div className={`node ${step === i ? 'sel' : ''}`} style={cv(l.color)} onClick={() => setStep(i)}>
                  <div className="n-ico">{l.icon}</div><div className="n-title">{l.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="center small muted">↺ monitoring feeds control continuously; completion happens at milestones</div>
          <div className="detail" style={cv(LOOP[step].color)}>
            <h4>{LOOP[step].icon} {LOOP[step].name}</h4>
            <ul>{LOOP[step].pts.map((p) => <Secret as="li" key={p}>{p}</Secret>)}</ul>
          </div>
        </div>
      ) : (
        <div className="mt">
          <div className="small muted">Metrics show progress vs schedule & budget, current quality of the test object, and effectiveness of test activities. Tap a gauge to open it.</div>
          <div className="icon-grid mt" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {METRIC_FAM.map((f) => (
              <div key={f.id} className={`node ${open === f.id ? 'sel' : ''}`} style={{ ...cv(f.color), padding: 10 }} onClick={() => setOpen(f.id)}>
                <div style={{ fontSize: 26 }}>{f.icon}</div>
                <div className="small" style={{ fontWeight: 700 }}>{f.name}</div>
              </div>
            ))}
          </div>
          {open && (() => { const f = METRIC_FAM.find((x) => x.id === open)!; return (
            <div className="detail" style={cv(f.color)}><h4>{f.icon} {f.name} metrics</h4><Secret>e.g., {f.ex}</Secret></div>
          ); })()}
          <div className="mt" style={{ padding: 12, borderRadius: 12, background: 'var(--panel-2)' }}>
            🎯 Which family does <b>{cur[0]}</b> belong to?
            <div className="row wrap mt" style={{ gap: 6 }}>
              {METRIC_FAM.map((f) => <button key={f.id} className="btn sm" onClick={() => answer(f.id)}>{f.icon} {f.name}</button>)}
            </div>
            <Feedback fb={fb} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 5.4.1 Configuration management: baselines ---------- */
const BASELINES = [
  { id: 'B1', when: 'Sprint 7', build: 'Webshop 2.3.0', env: 'OS image v12 · DB 14.2', tcs: 'Test cases v7', scripts: 'Scripts v31', run: 'Run #118 · 2 failed' },
  { id: 'B2', when: 'Sprint 8', build: 'Webshop 2.3.1', env: 'OS image v12 · DB 14.2', tcs: 'Test cases v8', scripts: 'Scripts v34', run: 'Run #131 · all passed' },
  { id: 'B3', when: 'Sprint 9', build: 'Webshop 2.4.0', env: 'OS image v13 · DB 15.0', tcs: 'Test cases v9', scripts: 'Scripts v40', run: 'Run #150 · 1 failed' },
];
export function BaselineTimeline() {
  const [sel, setSel] = useState(2);
  const [msg, setMsg] = useState<Fb | null>(null);
  const b = BASELINES[sel];
  const rows: [string, string][] = [['🎯 Test object', b.build], ['🖥️ Test environment', b.env], ['🧪 Test cases', b.tcs], ['📜 Test scripts', b.scripts], ['📊 Test results / logs', b.run]];
  return (
    <div>
      <div className="small muted">🐛 A customer reports a failure in <b>Webshop 2.3.1</b>. Check out the right baseline to reassemble everything and reproduce it.</div>
      <svg viewBox="0 0 520 70" style={{ width: '100%', marginTop: 8 }}>
        <line x1="20" y1="35" x2="500" y2="35" stroke="var(--border-strong)" strokeWidth="3" />
        {BASELINES.map((x, i) => (
          <g key={x.id} style={{ cursor: 'pointer' }} onClick={() => { setSel(i); setMsg(i === 1 ? { ok: true, text: '✅ Baseline B2 restored: same build, environment, testware versions → failure can be reproduced and analyzed.', n: Date.now() } : null); }}>
            <circle cx={80 + i * 180} cy="35" r={sel === i ? 16 : 12} fill={sel === i ? '#2ec4b6' : 'var(--panel-2)'} stroke="#2ec4b6" strokeWidth="3" />
            <text x={80 + i * 180} y="40" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--text)">{x.id}</text>
            <text x={80 + i * 180} y="66" textAnchor="middle" fontSize="11" fill="var(--muted)">{x.when}</text>
          </g>
        ))}
      </svg>
      <div className="detail" style={cv('#2ec4b6')}>
        <h4>🔒 Baseline {b.id} — {b.when}</h4>
        <table className="cmp"><tbody>{rows.map(([k, v]) => <tr key={k}><th style={{ width: 190 }}>{k}</th><td style={{ fontFamily: 'var(--mono)' }}>{v}</td></tr>)}</tbody></table>
        <div className="row wrap mt" style={{ gap: 8 }}>
          <button className="btn sm" onClick={() => setMsg({ ok: false, text: '⛔ Approved for testing = baseline. It can only be changed through a FORMAL CHANGE CONTROL process.', n: Date.now() })}>✏️ Quick-edit the baselined test environment</button>
          <button className="btn sm" onClick={() => setMsg({ ok: true, text: '↩️ CM keeps a record of changed items per baseline, so you can REVERT to a previous baseline and reproduce previous test results.', n: Date.now() })}>↩️ Revert to an older baseline</button>
        </div>
        <Feedback fb={msg} />
      </div>
      <div className="grid g2 mt">
        <div className="vs-col"><b>🧾 CM ensures…</b><ul className="small">
          <Secret as="li">All configuration items (incl. test items) are uniquely identified, version controlled, tracked for changes and related to each other → traceability</Secret>
          <Secret as="li">All documentation and software items are referenced unambiguously in testware</Secret>
        </ul></div>
        <div className="vs-col"><b>📦 Configuration items in testing</b><div className="small muted"><Secret>test plans, test strategies, test conditions, test cases, test scripts, test results, test logs, test reports — and complex items like a test environment (records its parts, relationships and versions). In DevOps pipelines CM is normally automated.</Secret></div></div>
      </div>
    </div>
  );
}

/* ---------- 5.5.1 Defect report builder ---------- */
const DR_FIELDS = [
  { k: 'id', label: 'Unique identifier', val: 'DEF-1087', auto: true, miss: 'How do we even refer to this one? Duplicates everywhere…' },
  { k: 'title', label: 'Title (short summary)', val: 'Voucher SPRING10 not deducted from cart total', auto: false, miss: 'A list full of "bug" titles — nobody can triage that.' },
  { k: 'date', label: 'Date observed · issuing organization · author & role', val: '2026-03-12 · System test team · J. Doe (test analyst)', auto: true, miss: 'Who found this and when? Whom do I ask?' },
  { k: 'env', label: 'Test object & test environment', val: 'Webshop build 4.2.1 · staging · Chrome 124 / Windows 11', auto: false, miss: '🤷 Which build? Which environment? "Works on my machine."' },
  { k: 'ctx', label: 'Context', val: 'Running TC-42 during system testing (sprint 9); technique: BVA; test data: voucher SPRING10', auto: false, miss: 'In which test activity / with which test data did this happen?' },
  { k: 'steps', label: 'Description to reproduce (steps, logs, screenshots…)', val: '1) Add items worth €80  2) Enter SPRING10  3) Click Apply · screenshot + console log attached', auto: false, miss: '❓ I cannot reproduce it without the steps.' },
  { k: 'exp', label: 'Expected & actual results', val: 'Expected: total €72.00 · Actual: total €80.00, no error message', auto: false, miss: 'So what SHOULD have happened? Maybe it works as designed?' },
  { k: 'sev', label: 'Severity (degree of impact)', val: 'High — customers are overcharged', auto: false, miss: 'How bad is it for stakeholders?' },
  { k: 'prio', label: 'Priority to fix', val: 'P1 — fix before release', auto: false, miss: 'Fix now or next quarter?' },
  { k: 'status', label: 'Status', val: 'Open', auto: true, miss: 'Is anyone working on it? Is it closed, deferred, a duplicate?' },
  { k: 'ref', label: 'References', val: 'TC-42 · US-118 (vouchers)', auto: false, miss: 'Which test case / requirement is this linked to?' },
];
const SPOT = [
  { report: ['DEF-311 · "App hangs on user creation"', '2026-05-03 · J. Doe (tester)', 'Steps: enter "Test input: $ä" in Name on the new-user screen → app hangs', 'Expected: user created · Actual: app hangs, log attached', 'Severity: high · Priority: P1 · Status: open · Ref: TC-1305, REQ-0012'],
    options: ['Expected result', 'Test object version & test environment', 'Severity', 'Reference to the test case'], a: 1, why: 'Nothing says which build or which environment the failure occurred in — a typical sample-exam gap.' },
  { report: ['DEF-312 · "Discount wrong"', '2026-05-04 · QA team · A. Lee (test analyst)', 'Webshop 4.2.1 on staging', 'Steps: 1) add 3 items 2) apply 10% voucher', 'Actual: total €54.00', 'Severity: medium · Priority: P2 · Status: open'],
    options: ['Expected result', 'Author', 'Status', 'Unique identifier'], a: 0, why: 'Only the actual result is given — without the expected result the developer cannot tell what is wrong.' },
  { report: ['DEF-313 · "Report export fails"', '2026-05-05 · B. Kim (tester)', 'Reporting module 1.9 · test env T2', 'Expected: PDF downloaded · Actual: error 500', 'Severity: high · Status: open · Ref: TC-77'],
    options: ['Severity', 'Steps to reproduce', 'Test environment', 'Actual result'], a: 1, why: 'No steps/test data to reproduce the failure (priority is also missing, but steps are the critical gap for the developer).' },
];
export function DefectReportBuilder() {
  const [tab, setTab] = useState<'build' | 'spot'>('build');
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(DR_FIELDS.map((f) => [f.k, f.auto])));
  const [si, setSi] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const count = DR_FIELDS.filter((f) => on[f.k]).length;
  const missing = DR_FIELDS.filter((f) => !on[f.k]);
  const sp = SPOT[si % SPOT.length];
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        {['📝 Log', '🔎 Analyze & classify', '⚖️ Decide response (fix / keep as is)', '✅ Close'].map((s, i) => (
          <span key={s} className="row" style={{ gap: 6 }}>{i > 0 && <span className="faint">→</span>}<span className="chip">{s}</span></span>
        ))}
      </div>
      <div className="tiny faint" style={{ marginTop: 4 }}>A reported anomaly may turn out to be a real defect — or a false positive, a change request…</div>
      <div className="mt"><Tabs value={tab} onChange={(t) => { setTab(t); setFb(null); }} tabs={[{ id: 'build', label: '🏗️ Build the report' }, { id: 'spot', label: '🕵️ Spot the gap' }]} /></div>
      {tab === 'build' ? (
        <div className="grid g2 mt" style={{ alignItems: 'start' }}>
          <div className="col" style={{ gap: 6 }}>
            <div className="small muted">Story: running TC-42, the voucher SPRING10 (10%) on an €80 cart still shows €80. Tick each field to add it.</div>
            {DR_FIELDS.map((f) => (
              <label key={f.k} className="row small" style={{ gap: 8, cursor: 'pointer', padding: '6px 10px', borderRadius: 10, background: on[f.k] ? 'color-mix(in srgb, var(--good) 12%, transparent)' : 'var(--panel-2)' }}>
                <input type="checkbox" checked={!!on[f.k]} onChange={() => setOn({ ...on, [f.k]: !on[f.k] })} style={{ accentColor: 'var(--good)' }} />
                <span style={{ flex: 1 }}>{f.label}</span>
                {f.auto && <span className="tiny chip">🤖 tool can auto-fill</span>}
              </label>
            ))}
          </div>
          <div>
            <div style={{ border: '1px solid var(--border-strong)', borderRadius: 14, padding: 14, background: 'var(--panel-solid)', fontSize: 13 }}>
              <div className="kicker">🐞 Defect report</div>
              {DR_FIELDS.filter((f) => on[f.k]).map((f) => (
                <div key={f.k} style={{ marginTop: 6 }}><span className="tiny muted">{f.label}</span><div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{f.val}</div></div>
              ))}
              {count === 0 && <div className="faint mt">empty…</div>}
            </div>
            <div className="bar mt"><i style={{ width: `${(count / DR_FIELDS.length) * 100}%` }} /></div>
            <div className="tiny muted" style={{ marginTop: 4 }}>{count}/{DR_FIELDS.length} typical fields</div>
            {missing.length > 0 ? (
              <div className="feedback no" style={{ marginTop: 10 }}>
                <b>🧑‍💻 Developer reading it:</b>
                <ul className="small" style={{ margin: '4px 0 0', paddingLeft: 18 }}>{missing.slice(0, 3).map((m) => <li key={m.k}>{m.miss}</li>)}</ul>
              </div>
            ) : <div className="feedback ok" style={{ marginTop: 10 }}>🎉 Complete: enough information to reproduce, resolve and track the defect.</div>}
          </div>
        </div>
      ) : (
        <div className="mt">
          <div style={{ border: '1px solid var(--border-strong)', borderRadius: 14, padding: 14, background: 'var(--panel-solid)', fontFamily: 'var(--mono)', fontSize: 13 }}>
            {sp.report.map((l) => <div key={l}>{l}</div>)}
          </div>
          <div className="small mt"><b>What critical information is MISSING?</b></div>
          <div className="grid g2 mt">
            {sp.options.map((o, i) => (
              <button key={o} className="btn" onClick={() => setFb(i === sp.a ? { ok: true, text: <>✅ {sp.why}</>, n: Date.now() } : { ok: false, text: <>❌ "{o}" is in the report. Look again.</>, n: Date.now() })}>{o}</button>
            ))}
          </div>
          <Feedback fb={fb} />
          <div className="row mt" style={{ justifyContent: 'flex-end' }}><button className="btn sm primary" onClick={() => { setSi(si + 1); setFb(null); }}>Next report ▶</button></div>
        </div>
      )}
      <div className="grid g3 mt small">
        {['🛠️ Give those resolving it enough info to resolve the issue', '📈 Provide a means of tracking the quality of the work product', '💡 Provide ideas to improve the development & test process'].map((o) => (
          <div key={o} className="vs-col"><Secret>{o}</Secret></div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   CHAPTER 6 — TEST TOOLS
   ===================================================================== */

const TOOLS = [
  { id: 'mgmt', icon: '🗂️', name: 'Test management', color: '#8b6cff', text: 'Increase test process efficiency by facilitating management of the SDLC, requirements, tests, defects, configuration.' },
  { id: 'static', icon: '🔍', name: 'Static testing', color: '#ff7a59', text: 'Support the tester in performing reviews and static analysis.' },
  { id: 'design', icon: '✏️', name: 'Test design & implementation', color: '#f72585', text: 'Facilitate generation of test cases, test data and test procedures.' },
  { id: 'exec', icon: '▶️', name: 'Test execution & coverage', color: '#22d3ee', text: 'Facilitate automated test execution and coverage measurement.' },
  { id: 'nonf', icon: '🏋️', name: 'Non-functional testing', color: '#2ec4b6', text: 'Allow non-functional testing that is difficult or impossible to perform manually.' },
  { id: 'devops', icon: '♾️', name: 'DevOps', color: '#ffb703', text: 'Support the DevOps delivery pipeline, workflow tracking, automated build process(es), CI/CD.' },
  { id: 'collab', icon: '💬', name: 'Collaboration', color: '#34d399', text: 'Facilitate communication.' },
  { id: 'scale', icon: '📦', name: 'Scalability & deployment standardization', color: '#a78bfa', text: 'e.g., virtual machines, containerization tools.' },
  { id: 'other', icon: '📊', name: 'Any other tool', color: '#94a3b8', text: 'Any other tool that assists in testing — e.g., a spreadsheet is a test tool in the context of testing.' },
];
const TOOL_QUIZ: [string, string][] = [
  ['Spin up identical, disposable test environments in containers', 'scale'],
  ['Build every commit automatically and push it through the CI/CD pipeline', 'devops'],
  ['Keep requirements, tests and defects linked in one place', 'mgmt'],
  ['Generate test data and test cases automatically', 'design'],
  ['Run the regression suite unattended and measure statement coverage', 'exec'],
  ['Simulate 10,000 concurrent users', 'nonf'],
  ['Find unreachable code and coding-standard violations without running the code', 'static'],
  ['A team chat channel for discussing test results', 'collab'],
  ['A spreadsheet tracking which test cases passed', 'other'],
];
export function ToolBelt() {
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [sel, setSel] = useState('mgmt');
  const [qi, setQi] = useState(0);
  const [fb, setFb] = useState<Fb | null>(null);
  const cur = TOOL_QUIZ[qi % TOOL_QUIZ.length];
  const click = (id: string) => {
    if (mode === 'learn') { setSel(id); return; }
    const t = TOOLS.find((x) => x.id === id)!;
    if (id === cur[1]) { setFb({ ok: true, text: <>✅ {t.icon} {t.name} — {t.text}</>, n: Date.now() }); setQi(qi + 1); }
    else setFb({ ok: false, text: <>❌ Not {t.name}. Try again.</>, n: Date.now() });
  };
  const t = TOOLS.find((x) => x.id === sel)!;
  return (
    <div>
      <Tabs value={mode} onChange={(m) => { setMode(m); setFb(null); }} tabs={[{ id: 'learn', label: '🧰 Open the toolbox' }, { id: 'quiz', label: '🎯 Which tool?' }]} />
      {mode === 'quiz' && <div className="mt" style={{ padding: 12, borderRadius: 12, background: 'var(--panel-2)', fontSize: 16 }}>🛠️ "{cur[0]}"</div>}
      <div className="icon-grid mt" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {TOOLS.map((x) => (
          <div key={x.id} className={`node ${mode === 'learn' && sel === x.id ? 'sel' : ''}`} style={{ ...cv(x.color), padding: 10 }} onClick={() => click(x.id)}>
            <div style={{ fontSize: 28 }}>{x.icon}</div>
            <div className="small" style={{ fontWeight: 700 }}>{x.name}</div>
          </div>
        ))}
      </div>
      {mode === 'learn' ? <div className="detail" style={cv(t.color)}><h4>{t.icon} {t.name} tools</h4><Secret>{t.text}</Secret></div> : <Feedback fb={fb} />}
    </div>
  );
}

/* ---------- 6.2.1 Benefits vs risks of test automation ---------- */
const AUTO_BENEFITS = [
  ['⏱️', 'Time saved by reducing repetitive manual work', 'e.g., run regression tests, re-enter the same test data, compare expected vs actual results, check against coding standards'],
  ['🎯', 'Prevention of simple human errors', 'greater consistency & repeatability: tests consistently derived from requirements, test data created systematically, tests executed in the same order with the same frequency'],
  ['📏', 'More objective assessment', 'e.g., coverage — and measures too complicated for humans to determine'],
  ['📊', 'Easier access to information about testing', 'statistics, graphs, aggregated data about test progress, failure rates and execution duration → test management & reporting'],
  ['⚡', 'Reduced test execution times', 'earlier defect detection, faster feedback, faster time to market'],
  ['🧠', 'More time for testers', 'to design new, deeper and more effective tests'],
];
const AUTO_RISKS = [
  ['🦄', 'Unrealistic expectations', 'about the benefits of a tool (incl. functionality and ease of use)'],
  ['🧮', 'Inaccurate estimations', 'of time, costs, effort to introduce a tool, maintain test scripts and change the existing manual test process'],
  ['🙅', 'Using a tool where manual testing is more appropriate', ''],
  ['🧟', 'Relying on a tool too much', 'e.g., ignoring the need for human critical thinking'],
  ['🏚️', 'Dependency on the tool vendor', 'which may go out of business, retire or sell the tool, or provide poor support (queries, upgrades, defect fixes)'],
  ['🪦', 'Open-source software abandoned', '…or its internal components require quite frequent updates'],
  ['🔌', 'Tool not compatible with the development platform', ''],
  ['⚖️', 'Unsuitable tool not complying with regulatory and/or safety standards', ''],
];
export function AutomationScale() {
  const [mit, setMit] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const unmit = AUTO_RISKS.length - Object.values(mit).filter(Boolean).length;
  const diff = AUTO_BENEFITS.length - unmit; // >0 tilts toward benefits
  const angle = Math.max(-12, Math.min(12, -diff * 3));
  return (
    <div>
      <svg viewBox="0 0 520 150" style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}>
        <polygon points="260,60 240,140 280,140" fill="var(--panel-2)" stroke="var(--border-strong)" />
        <g transform={`rotate(${angle} 260 60)`} style={{ transition: 'transform .5s' }}>
          <line x1="70" y1="60" x2="450" y2="60" stroke="var(--muted)" strokeWidth="5" strokeLinecap="round" />
          <line x1="90" y1="60" x2="90" y2="95" stroke="var(--muted)" /><line x1="430" y1="60" x2="430" y2="95" stroke="var(--muted)" />
          <rect x="30" y="95" width="120" height="34" rx="10" fill="rgba(52,211,153,0.25)" stroke="var(--good)" />
          <text x="90" y="117" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">✚ {AUTO_BENEFITS.length} benefits</text>
          <rect x="370" y="95" width="120" height="34" rx="10" fill="rgba(251,113,133,0.25)" stroke="var(--bad)" />
          <text x="430" y="117" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">✖ {unmit} open risks</text>
        </g>
        <text x="260" y="22" textAnchor="middle" fontSize="12" fill="var(--muted)">Simply acquiring a tool does not guarantee success — introduction, maintenance & training take effort</text>
      </svg>
      <div className="grid g2 mt">
        <div className="vs-col" style={{ borderTop: '4px solid var(--good)' }}>
          <b className="pro">✚ Potential benefits</b>
          <div className="col mt" style={{ gap: 6 }}>
            {AUTO_BENEFITS.map(([i, t, d]) => (
              <div key={t} className="small" style={{ cursor: 'pointer' }} onClick={() => setOpen(open === t ? null : t)}>
                {i} <b>{t}</b>{open === t && <div className="muted"><Secret>{d}</Secret></div>}
              </div>
            ))}
          </div>
        </div>
        <div className="vs-col" style={{ borderTop: '4px solid var(--bad)' }}>
          <b className="con">✖ Potential risks</b> <span className="tiny muted">— tick 🛡️ to analyze & mitigate</span>
          <div className="col mt" style={{ gap: 6 }}>
            {AUTO_RISKS.map(([i, t, d], k) => (
              <div key={t} className="small row" style={{ alignItems: 'flex-start', gap: 6, opacity: mit[k] ? 0.5 : 1 }}>
                <button className="btn sm ghost" style={{ padding: '0 6px' }} title="mitigate" onClick={() => setMit({ ...mit, [k]: !mit[k] })}>{mit[k] ? '🛡️' : '⬜'}</button>
                <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setOpen(open === t ? null : t)}>
                  {i} <b style={{ textDecoration: mit[k] ? 'line-through' : undefined }}>{t}</b>{open === t && d && <div className="muted"><Secret>{d}</Secret></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
