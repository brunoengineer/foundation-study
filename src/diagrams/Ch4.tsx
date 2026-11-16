import { useId, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Secret, Tabs } from '../components/SceneKit';

/* =====================================================================
   Chapter 4 — Test Analysis and Design: custom interactive diagrams
   ===================================================================== */

const ACC = '#f72585';
const VALID = '#34d399';
const INVALID = '#fb7185';
const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 1000) / 10);
const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`;
const box: CSSProperties = { border: '1px solid var(--border)', borderRadius: 14, padding: 14, background: 'var(--panel-2)' };
const mono: CSSProperties = { fontFamily: 'var(--mono)' };
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

/** Coverage meter: label · n/d = % with a bar */
function Meter({ label, n, d, color = ACC, hint }: { label: ReactNode; n: number; d: number; color?: string; hint?: ReactNode }) {
  const p = pct(n, d);
  const full = d > 0 && n === d;
  return (
    <div style={{ flex: '1 1 190px', minWidth: 170 }}>
      <div className="row small" style={{ justifyContent: 'space-between', gap: 8 }}>
        <b>{label}</b>
        <span style={{ ...mono, color: full ? 'var(--good)' : 'var(--text)' }}>{n}/{d} = {p}%</span>
      </div>
      <div className="bar" style={{ marginTop: 4 }}><i style={{ width: `${p}%`, background: full ? 'var(--good)' : color }} /></div>
      {hint && <div className="tiny faint" style={{ marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

function NumberAdder({ onAdd, placeholder = 'value', min, max }: { onAdd: (v: number) => void; placeholder?: string; min?: number; max?: number }) {
  const [txt, setTxt] = useState('');
  const add = () => {
    const v = Math.round(Number(txt));
    if (txt.trim() === '' || Number.isNaN(v)) return;
    const c = Math.max(min ?? -1e9, Math.min(max ?? 1e9, v));
    onAdd(c);
    setTxt('');
  };
  return (
    <span className="row" style={{ gap: 6 }}>
      <input type="number" value={txt} placeholder={placeholder} onChange={(e) => setTxt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        style={{ width: 100, padding: '7px 10px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--panel-solid)', color: 'var(--text)', fontFamily: 'var(--mono)' }} />
      <button className="btn sm" onClick={add}>➕ Add test</button>
    </span>
  );
}

/* =====================================================================
   4.1.1  Three families of test techniques
   ===================================================================== */
type Fam = 'bb' | 'wb' | 'xp';
const FAM: Record<Fam, { icon: string; name: string; aka: string; basis: string; color: string; examples: string; img: string }> = {
  bb: { icon: '⬛', name: 'Black-box', aka: 'a.k.a. specification-based', color: '#22d3ee', img: '📜 → ⬛ → ?',
    basis: 'Based on an analysis of the SPECIFIED BEHAVIOUR of the test object, without reference to its internal structure. Test cases are independent of the implementation → if the code changes but the required behaviour stays the same, the tests are still useful.',
    examples: 'Equivalence partitioning · Boundary value analysis · Decision tables · State transitions' },
  wb: { icon: '🔍', name: 'White-box', aka: 'a.k.a. structure-based', color: ACC, img: '🧩 code → 🔍',
    basis: 'Based on an analysis of the test object\'s INTERNAL STRUCTURE and processing. Test cases depend on how the software is designed → they can only be created AFTER the design or implementation exists.',
    examples: 'Statement testing · Branch testing' },
  xp: { icon: '🧠', name: 'Experience-based', aka: 'tester knowledge & skill', color: '#ffb703', img: '👩‍🔬 + 20 years',
    basis: 'Uses the KNOWLEDGE and EXPERIENCE of testers. Effectiveness depends heavily on the tester\'s skills. Can detect defects missed by black-box and white-box → COMPLEMENTARY to them.',
    examples: 'Error guessing · Exploratory testing · Checklist-based testing' },
};
const LENS_Q: { t: string; a: Fam }[] = [
  { t: 'The developer refactors the code; behaviour is unchanged — the tests are still useful.', a: 'bb' },
  { t: 'Test cases can only be created after the design or implementation exists.', a: 'wb' },
  { t: 'Effectiveness depends heavily on the tester\'s skills.', a: 'xp' },
  { t: 'Also known as specification-based.', a: 'bb' },
  { t: 'Also known as structure-based.', a: 'wb' },
  { t: 'Complements the others: may find defects they miss.', a: 'xp' },
  { t: 'Decision table testing', a: 'bb' },
  { t: 'Branch testing', a: 'wb' },
  { t: 'Checklist-based testing', a: 'xp' },
];

export function TechniqueLenses() {
  const [sel, setSel] = useState<Fam>('bb');
  const [ans, setAns] = useState<Record<number, Fam>>({});
  const score = LENS_Q.filter((q, i) => ans[i] === q.a).length;
  const f = FAM[sel];
  return (
    <div>
      <div className="grid g3">
        {(Object.keys(FAM) as Fam[]).map((k) => (
          <div key={k} className={`node ${sel === k ? 'sel' : ''}`} style={{ ['--c' as string]: FAM[k].color }} onClick={() => setSel(k)}>
            <div style={{ fontSize: 42 }}>{FAM[k].icon}</div>
            <div className="n-title">{FAM[k].name}</div>
            <div className="n-sub">{FAM[k].aka}</div>
            <div className="tiny faint" style={{ marginTop: 6, ...mono }}>{FAM[k].img}</div>
          </div>
        ))}
      </div>
      <div className="detail" style={{ ['--c' as string]: f.color }}>
        <h4>{f.icon} {f.name} — based on…</h4>
        <Secret as="div">{f.basis}</Secret>
        <div className="small mt" style={{ color: f.color }}><b>Techniques: </b><Secret>{f.examples}</Secret></div>
      </div>
      <div className="mt">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>🎯 Sort it: which family?</b>
          <span className="chip">{score}/{LENS_Q.length} correct</span>
        </div>
        <div className="col mt" style={{ gap: 6 }}>
          {LENS_Q.map((q, i) => {
            const a = ans[i];
            return (
              <div key={q.t} className="row wrap" style={{ ...box, padding: '8px 12px', gap: 8, borderColor: a ? (a === q.a ? 'var(--good)' : 'var(--bad)') : 'var(--border)' }}>
                <span className="small" style={{ flex: '1 1 260px' }}>{q.t}</span>
                {(Object.keys(FAM) as Fam[]).map((k) => (
                  <button key={k} className={`chip click ${a === k ? 'on' : ''}`} onClick={() => setAns((s) => ({ ...s, [i]: k }))}
                    style={a === k ? { background: k === q.a ? 'var(--good)' : 'var(--bad)' } : undefined}>{FAM[k].icon} {FAM[k].name}</button>
                ))}
                {a && <span>{a === q.a ? '✅' : `❌ → ${FAM[q.a].name}`}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.2.1  Equivalence partitioning playground
   ===================================================================== */
interface Part { id: string; label: string; short: string; min: number; max: number; valid: boolean }
const partOf = (parts: Part[], v: number) => parts.find((p) => v >= p.min && v <= p.max);

const AGE: Part[] = [
  { id: 'neg', label: 'negative age', short: '< 0', min: -Infinity, max: -1, valid: false },
  { id: 'child', label: 'child → €5', short: '0–12', min: 0, max: 12, valid: true },
  { id: 'adult', label: 'adult → €10', short: '13–64', min: 13, max: 64, valid: true },
  { id: 'senior', label: 'senior → €7', short: '65–120', min: 65, max: 120, valid: true },
  { id: 'big', label: 'impossible age', short: '> 120', min: 121, max: Infinity, valid: false },
];

export function EpPlayground() {
  const [tests, setTests] = useState<number[]>([30]);
  const D0 = -20, D1 = 140, X0 = 30, X1 = 670;
  const sx = (v: number) => X0 + ((Math.max(D0, Math.min(D1, v)) - D0) / (D1 - D0)) * (X1 - X0);
  const add = (v: number) => setTests((t) => (t.includes(v) ? t : [...t, v]));
  const byPart = AGE.map((p) => ({ p, vals: tests.filter((v) => partOf(AGE, v)?.id === p.id) }));
  const covered = byPart.filter((b) => b.vals.length > 0);
  const vCov = covered.filter((b) => b.p.valid).length;
  const iCov = covered.length - vCov;
  const onSvgClick = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 700;
    if (x < X0 || x > X1) return;
    add(Math.floor(D0 + ((x - X0) / (X1 - X0)) * (D1 - D0)));
  };
  return (
    <div>
      <div className="small muted">🎬 Cinema ticket price by <b>age</b> (whole years). Click the number line (or type a value) to add a test value.</div>
      <svg viewBox="0 0 700 135" style={{ width: '100%', cursor: 'crosshair', marginTop: 6 }} onClick={onSvgClick}>
        {AGE.map((p) => {
          const a = sx(p.min === -Infinity ? D0 : p.min);
          const b = sx(p.max === Infinity ? D1 : p.max + 1);
          const col = p.valid ? VALID : INVALID;
          const isCov = tests.some((v) => partOf(AGE, v)?.id === p.id);
          return (
            <g key={p.id}>
              <rect x={a} y={38} width={b - a} height={34} rx={4} fill={mix(col, isCov ? 55 : 14)} stroke={col} strokeWidth={isCov ? 2 : 1} />
              <text x={(a + b) / 2} y={60} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--text)">{p.short}</text>
              <text x={(a + b) / 2} y={28} textAnchor="middle" fontSize={11} fill={col}>{p.valid ? '✔' : '✖'} {p.label}</text>
            </g>
          );
        })}
        <text x={X0 - 4} y={60} textAnchor="end" fontSize={14} fill="var(--faint)">…</text>
        <text x={X1 + 4} y={60} fontSize={14} fill="var(--faint)">…</text>
        {[0, 13, 65, 121].map((v) => (
          <text key={v} x={sx(v)} y={86} textAnchor="middle" fontSize={10} fill="var(--muted)" style={mono}>{v - 1}|{v}</text>
        ))}
        {tests.map((v, i) => {
          const x = sx(v + 0.5);
          return (
            <g key={v}>
              <line x1={x} y1={72} x2={x} y2={98} stroke="var(--text)" strokeWidth={1.5} />
              <circle cx={x} cy={100} r={5} fill={ACC} />
              <text x={x} y={i % 2 ? 128 : 118} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--text)" style={mono}>{v}</text>
            </g>
          );
        })}
      </svg>
      <div className="row wrap" style={{ gap: 8 }}>
        <NumberAdder onAdd={add} placeholder="age" min={-999} max={999} />
        <button className="btn sm ghost" onClick={() => setTests([])}>↺ Clear</button>
        <button className="btn sm ghost" onClick={() => setTests([-5, 7, 30, 80, 150])}>💡 Minimal full set</button>
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label="EP coverage" n={covered.length} d={AGE.length} hint="partitions exercised ÷ ALL identified partitions" />
        <Meter label="Valid partitions" n={vCov} d={3} color={VALID} />
        <Meter label="Invalid partitions" n={iCov} d={2} color={INVALID} />
      </div>
      <div className="grid mt" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 8 }}>
        {byPart.map(({ p, vals }) => (
          <div key={p.id} style={{ ...box, padding: 10, borderColor: vals.length ? (p.valid ? VALID : INVALID) : 'var(--border)' }}>
            <div className="tiny" style={{ color: p.valid ? VALID : INVALID, fontWeight: 700 }}>{p.valid ? 'VALID' : 'INVALID'}</div>
            <div className="small"><b>{p.short}</b></div>
            <div className="row wrap" style={{ gap: 4, marginTop: 4 }}>
              {vals.length === 0 && <span className="tiny faint">not covered</span>}
              {vals.map((v, k) => (
                <span key={v} className={`chip click ${k === 0 ? 'good' : ''}`} title={k === 0 ? 'covers the partition' : 'redundant for EP'} onClick={() => setTests((t) => t.filter((x) => x !== v))}>
                  {v}{k > 0 ? ' (extra)' : ''} ✕
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="tiny faint mt">One value per partition is enough — a 2nd value from the same partition adds <b>no</b> EP coverage (marked "extra").</div>
    </div>
  );
}

/* ---------- Each Choice coverage (multiple parameters) ---------- */
const EC_PARAMS = [
  { id: 'age', name: 'Age group', icon: '🎂', parts: ['child', 'adult', 'senior'] },
  { id: 'seat', name: 'Seat', icon: '💺', parts: ['standard', 'premium'] },
  { id: 'pay', name: 'Payment', icon: '💳', parts: ['card', 'cash', 'voucher', 'app'] },
];
const EC_TOTAL = EC_PARAMS.reduce((s, p) => s + p.parts.length, 0);

export function EachChoice() {
  const [rows, setRows] = useState<number[][]>([[0, 0, 0]]);
  const covered = EC_PARAMS.map((_, pi) => new Set(rows.map((r) => r[pi])));
  const nCov = covered.reduce((s, c) => s + c.size, 0);
  const set = (ri: number, pi: number, v: number) => setRows((rs) => rs.map((r, i) => (i === ri ? r.map((x, j) => (j === pi ? v : x)) : r)));
  return (
    <div>
      <div className="grid g3" style={{ gap: 10 }}>
        {EC_PARAMS.map((p, pi) => (
          <div key={p.id} style={box}>
            <b>{p.icon} {p.name}</b> <span className="tiny faint">({p.parts.length} partitions)</span>
            <div className="row wrap" style={{ gap: 4, marginTop: 6 }}>
              {p.parts.map((n, k) => <span key={n} className={`chip ${covered[pi].has(k) ? 'good' : ''}`}>{covered[pi].has(k) ? '✔' : '○'} {n}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="col mt" style={{ gap: 6 }}>
        {rows.map((r, ri) => (
          <div key={ri} className="row wrap" style={{ ...box, padding: '8px 12px', gap: 10 }}>
            <b style={{ ...mono, width: 44 }}>TC{ri + 1}</b>
            {EC_PARAMS.map((p, pi) => (
              <span key={p.id} className="row" style={{ gap: 3, flexWrap: 'wrap' }}>
                <span>{p.icon}</span>
                {p.parts.map((n, k) => (
                  <button key={n} className={`chip click ${r[pi] === k ? 'on' : ''}`} onClick={() => set(ri, pi, k)}>{n}</button>
                ))}
              </span>
            ))}
            <span className="spacer" />
            {rows.length > 1 && <button className="btn sm ghost" onClick={() => setRows((rs) => rs.filter((_, i) => i !== ri))}>✕</button>}
          </div>
        ))}
      </div>
      <div className="row wrap mt" style={{ gap: 8 }}>
        <button className="btn sm" onClick={() => setRows((rs) => [...rs, [0, 0, 0]])}>➕ Add test case</button>
        <button className="btn sm ghost" onClick={() => setRows([[0, 0, 0]])}>↺ Reset</button>
        <button className="btn sm ghost" onClick={() => setRows([[0, 0, 0], [1, 1, 1], [2, 0, 2], [0, 1, 3]])}>💡 Show a minimal set</button>
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label="Each Choice coverage" n={nCov} d={EC_TOTAL} hint="every partition of every parameter used at least once" />
        <div style={{ ...box, flex: '1 1 220px' }} className="small">
          Test cases: <b>{rows.length}</b>{nCov === EC_TOTAL && rows.length > 4 ? ' — can you do it with fewer?' : ''}<br />
          <Secret>Minimum = size of the LARGEST set = max(3, 2, 4) = <b>4</b>. All combinations would be 3 × 2 × 4 = 24 — Each Choice ignores combinations.</Secret>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.2.2  Boundary value analysis lab (2-value vs 3-value)
   ===================================================================== */
interface BvaScenario { id: string; name: string; rule: string; parts: Part[] }
const BVA_SC: BvaScenario[] = [
  { id: 'drive', name: '🚗 Driver age', rule: 'Car rental accepts drivers aged 18 to 65 (whole years).', parts: [
    { id: 'y', label: 'too young', short: '≤ 17', min: -Infinity, max: 17, valid: false },
    { id: 'ok', label: 'accepted', short: '18–65', min: 18, max: 65, valid: true },
    { id: 'o', label: 'too old', short: '≥ 66', min: 66, max: Infinity, valid: false },
  ] },
  { id: 'temp', name: '🌡️ Sensor', rule: 'Temperature (whole °C) is OK from 0 to 2; below is "too low", above is "too high".', parts: [
    { id: 'lo', label: 'too low', short: '≤ −1', min: -Infinity, max: -1, valid: false },
    { id: 'ok', label: 'OK', short: '0–2', min: 0, max: 2, valid: true },
    { id: 'hi', label: 'too high', short: '≥ 3', min: 3, max: Infinity, valid: false },
  ] },
  { id: 'grade', name: '🎓 Exam score', rule: 'Score 0–100: 0–49 fail, 50–74 pass, 75–100 distinction. Anything else is rejected.', parts: [
    { id: 'n', label: 'invalid', short: '≤ −1', min: -Infinity, max: -1, valid: false },
    { id: 'f', label: 'fail', short: '0–49', min: 0, max: 49, valid: true },
    { id: 'p', label: 'pass', short: '50–74', min: 50, max: 74, valid: true },
    { id: 'd', label: 'distinction', short: '75–100', min: 75, max: 100, valid: true },
    { id: 'x', label: 'invalid', short: '≥ 101', min: 101, max: Infinity, valid: false },
  ] },
];
const PART_COLORS = ['#22d3ee', '#a78bfa', '#ffb703', '#2ec4b6', '#ff7a59'];

function bvaItems(parts: Part[]) {
  const bv = new Set<number>();
  parts.forEach((p) => { if (Number.isFinite(p.min)) bv.add(p.min); if (Number.isFinite(p.max)) bv.add(p.max); });
  const bvs = [...bv].sort((a, b) => a - b);
  // 2-value: each BV + its closest neighbour in the adjacent partition (= the adjacent partition's BV) → just the BVs
  const two = new Set(bvs);
  // 3-value: each BV + BOTH neighbours (union, so shared neighbours are counted once)
  const three = new Set<number>();
  bvs.forEach((b) => { three.add(b - 1); three.add(b); three.add(b + 1); });
  return { bvs, two, three };
}

export function BvaLab() {
  const [sc, setSc] = useState(0);
  const [mode, setMode] = useState<'2' | '3'>('2');
  const [show, setShow] = useState(true);
  const [tests, setTests] = useState<number[]>([]);
  const S = BVA_SC[sc];
  const { bvs, two, three } = useMemo(() => bvaItems(S.parts), [S]);
  const items = mode === '2' ? two : three;
  const tested = new Set(tests);
  const hit = [...items].filter((v) => tested.has(v)).length;
  const wasted = tests.filter((v) => !items.has(v));

  // zoomed number line: all 3-value context cells + tested values, with ⋯ gaps
  const vals = [...new Set([...three, ...tests])].sort((a, b) => a - b);
  type Cell = { gap: true; part: number } | { gap: false; v: number; part: number };
  const cells: Cell[] = [];
  vals.forEach((v, i) => {
    const pi = S.parts.findIndex((p) => v >= p.min && v <= p.max);
    if (i > 0 && v - vals[i - 1] > 1) cells.push({ gap: true, part: pi });
    cells.push({ gap: false, v, part: pi });
  });
  const runs: { part: number; n: number }[] = [];
  cells.forEach((c) => { const last = runs[runs.length - 1]; if (last && last.part === c.part) last.n++; else runs.push({ part: c.part, n: 1 }); });
  const toggle = (v: number) => setTests((t) => (t.includes(v) ? t.filter((x) => x !== v) : [...t, v]));
  const W = 44;

  return (
    <div>
      <div className="row wrap" style={{ gap: 10 }}>
        <Tabs value={String(sc)} onChange={(v) => { setSc(Number(v)); setTests([]); }} tabs={BVA_SC.map((s, i) => ({ id: String(i), label: s.name }))} />
        <Tabs value={mode} onChange={setMode} tabs={[{ id: '2', label: '2️⃣ 2-value BVA' }, { id: '3', label: '3️⃣ 3-value BVA' }]} />
        <label className="row small" style={{ gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> show coverage items
        </label>
      </div>
      <div className="small muted mt">📋 {S.rule} <i>Click cells to add/remove test values.</i></div>
      <div style={{ overflowX: 'auto', paddingBottom: 6, marginTop: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, ${W}px)`, gap: 3, width: 'max-content' }}>
          {runs.map((r, i) => {
            const p = S.parts[r.part];
            const col = PART_COLORS[r.part % PART_COLORS.length];
            return (
              <div key={i} style={{ gridColumn: `span ${r.n}`, textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '3px 2px', borderRadius: 6,
                background: mix(col, 22), color: 'var(--text)', borderBottom: `3px solid ${col}`, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {p.valid ? '✔' : '✖'} {p.label} <span className="faint">{p.short}</span>
              </div>
            );
          })}
          {cells.map((c, i) => {
            if (c.gap) return <div key={`g${i}`} style={{ textAlign: 'center', color: 'var(--faint)', alignSelf: 'center' }}>⋯</div>;
            const isItem = items.has(c.v);
            const isBv = bvs.includes(c.v);
            const t = tested.has(c.v);
            const border = t ? (isItem ? 'var(--good)' : 'var(--warn)') : show && isItem ? ACC : 'var(--border)';
            return (
              <button key={c.v} onClick={() => toggle(c.v)} title={isItem ? 'coverage item' : 'not a coverage item in this mode'}
                style={{ height: 54, borderRadius: 10, border: `2px ${t || !show || !isItem ? 'solid' : 'dashed'} ${border}`, padding: 0,
                  background: t ? (isItem ? mix('var(--good)', 30) : mix('var(--warn)', 22)) : show && isItem ? mix(ACC, 10) : 'var(--panel-2)',
                  opacity: show && !isItem && !t ? 0.45 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...mono, fontWeight: isBv ? 800 : 500, fontSize: 14 }}>{c.v}</span>
                <span style={{ fontSize: 9, color: 'var(--muted)' }}>{t ? (isItem ? '✔' : 'waste') : show && isBv ? 'BV' : show && isItem ? 'nbr' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        <NumberAdder onAdd={(v) => setTests((t) => (t.includes(v) ? t : [...t, v]))} placeholder="value" />
        <button className="btn sm ghost" onClick={() => setTests([])}>↺ Clear</button>
        <button className="btn sm ghost" onClick={() => setTests([...items])}>💡 Fill all items</button>
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label={`${mode}-value BVA coverage`} n={hit} d={items.size}
          hint={mode === '2' ? 'items = boundary values (each BV + closest neighbour in the adjacent partition)' : 'items = each boundary value + BOTH neighbours (count shared ones once)'} />
        <div style={{ ...box, flex: '1 1 260px' }} className="small">
          <div>Boundary values ({bvs.length}): <Secret><b style={mono}>{bvs.join(', ')}</b></Secret></div>
          <div>2-value items: <Secret><b>{two.size}</b></Secret> · 3-value items: <Secret><b>{three.size}</b> <span style={mono}>({[...three].sort((a, b) => a - b).join(', ')})</span></Secret></div>
          {wasted.length > 0 && <div style={{ color: 'var(--warn)' }}>⚠️ Not coverage items here: {wasted.join(', ')}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Why 3-value is more rigorous: boundary bug hunt ---------- */
const IMPLS: { id: string; code: string; f: (x: number) => boolean; note: string }[] = [
  { id: 'ok', code: 'if (x <= 10) accept', f: (x) => x <= 10, note: 'Correct implementation — nothing to find.' },
  { id: 'lt', code: 'if (x < 10) accept', f: (x) => x < 10, note: 'Boundary misplaced one step BELOW the intended position.' },
  { id: 'up', code: 'if (x <= 11) accept', f: (x) => x <= 11, note: 'Boundary misplaced one step ABOVE the intended position.' },
  { id: 'eq', code: 'if (x == 10) accept', f: (x) => x === 10, note: 'The syllabus example: "≤" implemented as "=". Only the inside neighbour 9 reveals it.' },
];
const BH_SETS = [
  { name: '2-value BVA', vals: [10, 11] },
  { name: '3-value BVA', vals: [9, 10, 11, 12] },
];

export function BoundaryBugHunt() {
  const [im, setIm] = useState('eq');
  const I = IMPLS.find((x) => x.id === im)!;
  const exp = (x: number) => x <= 10;
  return (
    <div>
      <div className="small muted">Requirement: <b style={mono}>accept if x ≤ 10</b> → partitions {'{… 9, 10}'} and {'{11, 12 …}'}; boundary values <b>10</b> and <b>11</b>. Pick the developer's implementation:</div>
      <div className="row wrap mt" style={{ gap: 6 }}>
        {IMPLS.map((x) => <button key={x.id} className={`chip click ${im === x.id ? 'on' : ''}`} style={mono} onClick={() => setIm(x.id)}>{x.code}</button>)}
      </div>
      <div className="small mt"><Secret>{I.note}</Secret></div>
      <div className="grid g2 mt">
        {BH_SETS.map((s) => {
          const fails = s.vals.filter((v) => I.f(v) !== exp(v));
          return (
            <div key={s.name} style={{ ...box, borderColor: fails.length ? 'var(--good)' : im === 'ok' ? 'var(--border)' : 'var(--bad)' }}>
              <b>{s.name}</b> <span className="tiny faint">tests: {s.vals.join(', ')}</span>
              <table className="cmp" style={{ marginTop: 6 }}>
                <thead><tr><th>x</th><th>expected</th><th>actual</th><th></th></tr></thead>
                <tbody>
                  {s.vals.map((v) => {
                    const bad = I.f(v) !== exp(v);
                    return (
                      <tr key={v}>
                        <td style={mono}><b>{v}</b></td>
                        <td>{exp(v) ? 'accept' : 'reject'}</td>
                        <td>{I.f(v) ? 'accept' : 'reject'}</td>
                        <td>{bad ? '💥 FAIL' : '✓'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="small mt" style={{ fontWeight: 700, color: im === 'ok' ? 'var(--muted)' : fails.length ? 'var(--good)' : 'var(--bad)' }}>
                {im === 'ok' ? 'All pass — correct code.' : fails.length ? `🎯 Defect detected (by ${fails.join(', ')})` : '🙈 Defect slips through!'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================================
   4.2.3  Decision table lab
   ===================================================================== */
type TF = 'T' | 'F' | '–';
interface DtCol { id: string; c: TF[]; a: number | null }
const DT_COND = ['Age < 18', 'Age ≥ 65', 'Has student card'];
const DT_ACT = ['50% child discount', '30% senior discount', '20% student discount', 'Full price'];
const DT_FULL: DtCol[] = [
  { id: 'R1', c: ['T', 'T', 'T'], a: null },
  { id: 'R2', c: ['T', 'T', 'F'], a: null },
  { id: 'R3', c: ['T', 'F', 'T'], a: 0 },
  { id: 'R4', c: ['T', 'F', 'F'], a: 0 },
  { id: 'R5', c: ['F', 'T', 'T'], a: 1 },
  { id: 'R6', c: ['F', 'T', 'F'], a: 1 },
  { id: 'R7', c: ['F', 'F', 'T'], a: 2 },
  { id: 'R8', c: ['F', 'F', 'F'], a: 3 },
];
const DT_MIN: DtCol[] = [
  { id: 'M1', c: ['T', 'F', '–'], a: 0 },
  { id: 'M2', c: ['F', 'T', '–'], a: 1 },
  { id: 'M3', c: ['F', 'F', 'T'], a: 2 },
  { id: 'M4', c: ['F', 'F', 'F'], a: 3 },
];
const DT_TESTS: { id: string; who: string; v: boolean[] }[] = [
  { id: 'mia', who: 'Mia · 9 y · card', v: [true, false, true] },
  { id: 'leo', who: 'Leo · 15 y · no card', v: [true, false, false] },
  { id: 'ada', who: 'Ada · 70 y · card', v: [false, true, true] },
  { id: 'bo', who: 'Bo · 80 y · no card', v: [false, true, false] },
  { id: 'kim', who: 'Kim · 22 y · card', v: [false, false, true] },
  { id: 'zoe', who: 'Zoe · 31 y · card', v: [false, false, true] },
  { id: 'tom', who: 'Tom · 40 y · no card', v: [false, false, false] },
];
const dtMatch = (col: DtCol, v: boolean[]) => col.a !== null && col.c.every((x, i) => x === '–' || (x === 'T') === v[i]);

export function DecisionTableLab() {
  const [view, setView] = useState<'full' | 'simple' | 'min'>('full');
  const [sel, setSel] = useState<string[]>([]);
  const [n, setN] = useState(3);
  const cols = view === 'full' ? DT_FULL : view === 'simple' ? DT_FULL.filter((c) => c.a !== null) : DT_MIN;
  const feasible = cols.filter((c) => c.a !== null);
  const chosen = DT_TESTS.filter((t) => sel.includes(t.id));
  const exercised = feasible.filter((c) => chosen.some((t) => dtMatch(c, t.v)));
  const cell = (x: TF) => ({ color: x === 'T' ? 'var(--good)' : x === 'F' ? 'var(--bad)' : 'var(--muted)', fontWeight: 800, ...mono });
  const hatch = `repeating-linear-gradient(45deg, ${mix(INVALID, 14)} 0 6px, transparent 6px 12px)`;
  return (
    <div>
      <div style={{ ...box, marginBottom: 12 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <b>🌳 Rule explosion:</b>
          {[1, 2, 3, 4, 5, 6].map((k) => <button key={k} className={`chip click ${n === k ? 'on' : ''}`} onClick={() => setN(k)}>{k} cond.</button>)}
          <span style={mono}>→ 2<sup>{n}</sup> = <b>{2 ** n}</b> columns</span>
        </div>
        <div className="row wrap" style={{ gap: 2, marginTop: 8 }}>
          {Array.from({ length: 2 ** n }, (_, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 2, background: ACC, opacity: 0.75 }} />)}
        </div>
      </div>
      <div className="small muted">🎟️ Ticket discount rule: only ONE discount applies, the biggest wins (child 50% &gt; senior 30% &gt; student 20%).</div>
      <div className="row wrap mt" style={{ gap: 10 }}>
        <Tabs value={view} onChange={setView} tabs={[
          { id: 'full', label: '① Full: 2³ = 8' },
          { id: 'simple', label: '② Delete infeasible: 6' },
          { id: 'min', label: '③ Merge with "–": 4' },
        ]} />
      </div>
      <div style={{ overflowX: 'auto', marginTop: 10 }}>
        <table className="cmp" style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th />
              {cols.map((c) => {
                const ex = exercised.includes(c);
                return <th key={c.id} style={{ textAlign: 'center', background: ex ? mix('var(--good)', 25) : c.a === null ? hatch : undefined, color: ex ? 'var(--text)' : undefined }}>{c.id}{ex ? ' ✔' : ''}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {DT_COND.map((name, ci) => (
              <tr key={name}>
                <td><span className="tiny faint">C{ci + 1}</span> {name}</td>
                {cols.map((c) => <td key={c.id} style={{ textAlign: 'center', background: c.a === null ? hatch : undefined, ...cell(c.c[ci]) }}>{c.c[ci]}</td>)}
              </tr>
            ))}
            {DT_ACT.map((name, ai) => (
              <tr key={name}>
                <td><span className="tiny faint">A{ai + 1}</span> {name}</td>
                {cols.map((c) => <td key={c.id} style={{ textAlign: 'center', fontWeight: 800, background: c.a === null ? hatch : undefined, color: c.a === null ? 'var(--bad)' : ACC }}>
                  {c.a === null ? (ai === 0 ? 'N/A' : '') : c.a === ai ? 'X' : ''}
                </td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tiny faint" style={{ marginTop: 4 }}>
        {view === 'full' && 'R1, R2 are INFEASIBLE (N/A): nobody is under 18 AND 65+. They are not coverage items.'}
        {view === 'simple' && 'Simplified: infeasible columns deleted. 6 feasible columns = 6 coverage items.'}
        {view === 'min' && 'Minimized: for children and seniors the student card does not affect the outcome → "–" (irrelevant) merges 2 columns into 1.'}
      </div>
      <div className="mt"><b>🧪 Pick test cases</b> <span className="tiny faint">(each test = one combination of conditions + expected action)</span></div>
      <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
        {DT_TESTS.map((t) => {
          const on = sel.includes(t.id);
          const col = cols.find((c) => dtMatch(c, t.v));
          return (
            <button key={t.id} className={`chip click ${on ? 'on' : ''}`} onClick={() => setSel((s) => (on ? s.filter((x) => x !== t.id) : [...s, t.id]))}>
              {t.who} → {col?.id}{on && col && col.a !== null ? ` · ${DT_ACT[col.a]}` : ''}
            </button>
          );
        })}
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label="Decision table coverage" n={exercised.length} d={feasible.length} hint="exercised columns ÷ FEASIBLE columns (N/A never counts)" />
        <button className="btn sm ghost" onClick={() => setSel([])}>↺ Clear tests</button>
      </div>
    </div>
  );
}

/* =====================================================================
   4.2.4  State transition lab (login with lockout)
   ===================================================================== */
type St = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
type Ev = 'ok' | 'bad' | 'logout' | 'unlock';
const STATES: Record<St, { name: string; icon: string; x: number; y: number }> = {
  S1: { name: 'Login', icon: '🔑', x: 80, y: 125 },
  S2: { name: '1 fail', icon: '⚠️', x: 240, y: 125 },
  S3: { name: '2 fails', icon: '🚨', x: 400, y: 125 },
  S4: { name: 'Locked', icon: '🔒', x: 560, y: 125 },
  S5: { name: 'Logged in', icon: '🏠', x: 320, y: 270 },
};
const ST_IDS = Object.keys(STATES) as St[];
const EVENTS: { id: Ev; label: string }[] = [
  { id: 'ok', label: '✅ correct PW' },
  { id: 'bad', label: '❌ wrong PW' },
  { id: 'logout', label: '🚪 logout' },
  { id: 'unlock', label: '🔓 admin unlock' },
];
interface Tr { id: string; from: St; ev: Ev; to: St; act?: string; q?: [number, number]; lx?: number; ly?: number }
const TRS: Tr[] = [
  { id: 't1', from: 'S1', ev: 'ok', to: 'S5', lx: -14, ly: 4 },
  { id: 't2', from: 'S1', ev: 'bad', to: 'S2', ly: -8 },
  { id: 't3', from: 'S2', ev: 'ok', to: 'S5', lx: -12, ly: 4 },
  { id: 't4', from: 'S2', ev: 'bad', to: 'S3', ly: -8 },
  { id: 't5', from: 'S3', ev: 'ok', to: 'S5', lx: 14, ly: 4 },
  { id: 't6', from: 'S3', ev: 'bad', to: 'S4', act: 'lock account', ly: -8 },
  { id: 't7', from: 'S4', ev: 'unlock', to: 'S1', q: [320, -35], ly: -6 },
  { id: 't8', from: 'S5', ev: 'logout', to: 'S1', q: [80, 295], ly: 14 },
];
const findTr = (s: St, e: Ev) => TRS.find((t) => t.from === s && t.ev === e);
const DEMO: Ev[] = ['bad', 'bad', 'bad', 'unlock', 'ok', 'logout', 'bad', 'ok', 'logout', 'bad', 'bad', 'ok'];
interface Step { from: St; ev: Ev; to: St | null }
const runSeq = (evs: Ev[]): Step[] => {
  let s: St = 'S1';
  return evs.map((ev) => { const t = findTr(s, ev); const st: Step = { from: s, ev, to: t ? t.to : null }; if (t) s = t.to; return st; });
};

export function StateMachineLab() {
  const uid = safeId(useId());
  const [tests, setTests] = useState<Step[][]>([[]]);
  const [view, setView] = useState<'diagram' | 'table'>('diagram');
  const curTest = tests[tests.length - 1];
  const cur: St = curTest.reduce<St>((s, st) => st.to ?? s, 'S1');
  const all = tests.flat();
  const visited = new Set<St>(['S1', ...all.filter((s) => s.to).map((s) => s.to as St)]);
  const validCov = new Set(all.filter((s) => s.to).map((s) => findTr(s.from, s.ev)!.id));
  const allCov = new Set(all.map((s) => `${s.from}:${s.ev}`));
  const invalidInCur = curTest.filter((s) => !s.to).length;
  const lastTr = curTest.length ? curTest[curTest.length - 1] : null;
  const total = ST_IDS.length * EVENTS.length;

  const fire = (ev: Ev) => setTests((ts) => {
    const c = ts[ts.length - 1];
    const s = c.reduce<St>((acc, st) => st.to ?? acc, 'S1');
    const t = findTr(s, ev);
    return [...ts.slice(0, -1), [...c, { from: s, ev, to: t ? t.to : null }]];
  });
  const R = 34;
  const geom = (t: Tr) => {
    const A = STATES[t.from], B = STATES[t.to];
    const unit = (x: number, y: number) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
    if (t.q) {
      const [qx, qy] = t.q;
      const [ux, uy] = unit(qx - A.x, qy - A.y);
      const [vx, vy] = unit(qx - B.x, qy - B.y);
      const sx = A.x + ux * R, sy = A.y + uy * R, ex = B.x + vx * (R + 4), ey = B.y + vy * (R + 4);
      return { d: `M${sx},${sy} Q${qx},${qy} ${ex},${ey}`, mx: 0.25 * sx + 0.5 * qx + 0.25 * ex, my: 0.25 * sy + 0.5 * qy + 0.25 * ey };
    }
    const [ux, uy] = unit(B.x - A.x, B.y - A.y);
    const sx = A.x + ux * R, sy = A.y + uy * R, ex = B.x - ux * (R + 4), ey = B.y - uy * (R + 4);
    return { d: `M${sx},${sy} L${ex},${ey}`, mx: (sx + ex) / 2, my: (sy + ey) / 2 };
  };

  return (
    <div>
      <div className="row wrap" style={{ gap: 10 }}>
        <Tabs value={view} onChange={setView} tabs={[{ id: 'diagram', label: '🗺️ State diagram' }, { id: 'table', label: '📋 State table' }]} />
        <span className="small muted">Current state: <b>{STATES[cur].icon} {cur} {STATES[cur].name}</b></span>
      </div>
      {view === 'diagram' ? (
        <svg viewBox="0 0 640 315" style={{ width: '100%', maxWidth: 720, display: 'block', margin: '8px auto 0' }}>
          <defs>
            {[['dim', 'var(--faint)'], ['cov', 'var(--good)'], ['go', ACC]].map(([k, c]) => (
              <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={c} />
              </marker>
            ))}
          </defs>
          {TRS.map((t) => {
            const g = geom(t);
            const cov = validCov.has(t.id);
            const avail = t.from === cur;
            const k = avail ? 'go' : cov ? 'cov' : 'dim';
            const color = avail ? ACC : cov ? 'var(--good)' : 'var(--faint)';
            const label = `${t.ev}${t.act ? ` / ${t.act}` : ''}`;
            return (
              <g key={t.id} onClick={() => avail && fire(t.ev)} style={{ cursor: avail ? 'pointer' : 'default' }}>
                <path d={g.d} fill="none" stroke="transparent" strokeWidth={14} />
                <path d={g.d} fill="none" stroke={color} strokeWidth={avail || cov ? 2.6 : 1.4} strokeDasharray={avail || cov ? undefined : '5 4'} markerEnd={`url(#${uid}-${k})`} />
                <text x={g.mx + (t.lx ?? 0)} y={g.my + (t.ly ?? 0)} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}
                  style={{ paintOrder: 'stroke', stroke: 'var(--panel-solid)', strokeWidth: 3 }}>{label}</text>
              </g>
            );
          })}
          {ST_IDS.map((s) => {
            const S = STATES[s];
            const isCur = s === cur;
            return (
              <g key={s}>
                {isCur && <circle cx={S.x} cy={S.y} r={R + 7} fill="none" stroke={ACC} strokeWidth={2} opacity={0.5} />}
                <circle cx={S.x} cy={S.y} r={R} fill={isCur ? mix(ACC, 30) : visited.has(s) ? mix(VALID, 22) : 'var(--panel-solid)'}
                  stroke={isCur ? ACC : visited.has(s) ? 'var(--good)' : 'var(--border-strong)'} strokeWidth={2} />
                <text x={S.x} y={S.y - 4} textAnchor="middle" fontSize={16}>{S.icon}</text>
                <text x={S.x} y={S.y + 14} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--text)">{S.name}</text>
              </g>
            );
          })}
          <text x={20} y={80} fontSize={11} fill="var(--muted)">start ➜</text>
        </svg>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table className="cmp">
            <thead><tr><th>state ＼ event</th>{EVENTS.map((e) => <th key={e.id} style={{ textAlign: 'center' }}>{e.label}</th>)}</tr></thead>
            <tbody>
              {ST_IDS.map((s) => (
                <tr key={s} style={s === cur ? { outline: `2px solid ${ACC}` } : undefined}>
                  <td><b>{STATES[s].icon} {s}</b> {STATES[s].name}</td>
                  {EVENTS.map((e) => {
                    const t = findTr(s, e.id);
                    const tried = allCov.has(`${s}:${e.id}`);
                    const bg = t ? (tried ? mix('var(--good)', 25) : undefined) : tried ? mix('var(--bad)', 28) : mix('var(--bad)', 6);
                    return (
                      <td key={e.id} onClick={() => s === cur && fire(e.id)} style={{ textAlign: 'center', background: bg, cursor: s === cur ? 'pointer' : 'default' }}>
                        {t ? <span>{STATES[t.to].icon} {t.to}{t.act ? <span className="tiny muted"> / {t.act}</span> : null}</span> : <span className="faint">{tried ? '⛔ tried' : '— invalid'}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tiny faint" style={{ marginTop: 4 }}>Empty cells = INVALID transitions — the state table shows them explicitly, the diagram does not. Click a cell in the current state's row to fire that event.</div>
        </div>
      )}
      <div className="row wrap mt" style={{ gap: 6 }}>
        <b className="small">Fire event:</b>
        {EVENTS.map((e) => {
          const ok = !!findTr(cur, e.id);
          return <button key={e.id} className="btn sm" style={{ borderColor: ok ? ACC : 'var(--border)', opacity: ok ? 1 : 0.75 }} onClick={() => fire(e.id)} title={ok ? 'valid transition' : 'INVALID in this state — attempt it'}>{e.label}{ok ? '' : ' ⛔'}</button>;
        })}
      </div>
      {lastTr && !lastTr.to && (
        <div className={`feedback ${invalidInCur > 1 ? 'no' : 'ok'}`} style={{ marginTop: 10, padding: '10px 14px' }}>
          ⛔ <b>{lastTr.ev}</b> in {STATES[lastTr.from].name} is an <b>invalid transition</b> — the system must reject it and stay in {lastTr.from}.
          {invalidInCur > 1 && <> ⚠️ This test case now has {invalidInCur} invalid attempts → risk of <b>defect masking</b>. Test only ONE invalid transition per test case.</>}
        </div>
      )}
      <div className="col mt" style={{ gap: 4 }}>
        {tests.map((t, i) => (
          <div key={i} className="small" style={{ ...mono, opacity: i === tests.length - 1 ? 1 : 0.65 }}>
            TC{i + 1}: S1{t.map((s, k) => <span key={k} style={{ color: s.to ? 'var(--text)' : 'var(--bad)' }}> –{s.ev}→ {s.to ?? '⛔'}</span>)}
          </div>
        ))}
      </div>
      <div className="row wrap" style={{ gap: 8, marginTop: 8 }}>
        <button className="btn sm" disabled={curTest.length === 0} onClick={() => setTests((ts) => [...ts, []])}>➕ New test case (back to Login)</button>
        <button className="btn sm ghost" onClick={() => setTests([[]])}>↺ Reset</button>
        <button className="btn sm ghost" onClick={() => setTests([runSeq(DEMO)])}>💡 One test case → 100% valid transitions</button>
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label="All states" n={visited.size} d={ST_IDS.length} color="#22d3ee" hint="states visited" />
        <Meter label="Valid transitions (0-switch)" n={validCov.size} d={TRS.length} hint="arrows travelled" />
        <Meter label="All transitions" n={allCov.size} d={total} color="#ffb703" hint={`${TRS.length} valid + ${total - TRS.length} invalid table cells`} />
      </div>
      <div className="mt" style={{ border: '2px solid #ffb703', borderRadius: 16, padding: 8 }}>
        <div className="tiny" style={{ color: '#ffb703', fontWeight: 700 }}>ALL TRANSITIONS (valid + invalid) — minimum for mission/safety-critical</div>
        <div style={{ border: `2px solid ${ACC}`, borderRadius: 12, padding: 8, marginTop: 4 }}>
          <div className="tiny" style={{ color: ACC, fontWeight: 700 }}>VALID TRANSITIONS (0-switch) — most widely used</div>
          <div style={{ border: '2px solid #22d3ee', borderRadius: 10, padding: 6, marginTop: 4 }}>
            <div className="tiny" style={{ color: '#22d3ee', fontWeight: 700 }}>ALL STATES — weakest</div>
          </div>
        </div>
        <div className="tiny faint" style={{ marginTop: 4 }}>100% of an outer box guarantees 100% of every inner box — never the other way round.</div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.3.1 / 4.3.2  Statement & branch coverage lab
   ===================================================================== */
interface CNode { x: number; y: number; ln: number; dec?: boolean; label: string; lp?: 'l' | 'r' | 'ur' }
interface CEdge { from: string; to: string; cond?: 'T' | 'F'; via?: [number, number][] }
interface Prog {
  id: 'A' | 'B'; name: string;
  lines: { txt: string; node?: string }[];
  nodes: Record<string, CNode>;
  edges: CEdge[];
}
const PROG_A: Prog = {
  id: 'A', name: '🎟️ if + if/else',
  lines: [
    { txt: 'read(age, member)', node: 'a1' },
    { txt: 'price = 10', node: 'a2' },
    { txt: 'if (age < 12) {', node: 'a3' },
    { txt: '    price = 5', node: 'a4' },
    { txt: '}' },
    { txt: 'if (member) {', node: 'a5' },
    { txt: '    price = price - 2', node: 'a6' },
    { txt: '} else {' },
    { txt: '    log("no member")', node: 'a7' },
    { txt: '}' },
    { txt: 'print(price)', node: 'a8' },
  ],
  nodes: {
    a1: { x: 120, y: 22, ln: 1, label: 'read' },
    a2: { x: 120, y: 66, ln: 2, label: 'price=10' },
    a3: { x: 120, y: 112, ln: 3, dec: true, label: 'age<12?', lp: 'ur' },
    a4: { x: 195, y: 158, ln: 4, label: 'price=5' },
    a5: { x: 120, y: 204, ln: 6, dec: true, label: 'member?', lp: 'l' },
    a6: { x: 60, y: 254, ln: 7, label: 'price-=2' },
    a7: { x: 180, y: 254, ln: 9, label: 'log' },
    a8: { x: 120, y: 304, ln: 11, label: 'print' },
  },
  edges: [
    { from: 'a1', to: 'a2' }, { from: 'a2', to: 'a3' },
    { from: 'a3', to: 'a4', cond: 'T' }, { from: 'a3', to: 'a5', cond: 'F' },
    { from: 'a4', to: 'a5' },
    { from: 'a5', to: 'a6', cond: 'T' }, { from: 'a5', to: 'a7', cond: 'F' },
    { from: 'a6', to: 'a8' }, { from: 'a7', to: 'a8' },
  ],
};
const PROG_B: Prog = {
  id: 'B', name: '🔁 while loop',
  lines: [
    { txt: 'read(n)', node: 'b1' },
    { txt: 'total = 0', node: 'b2' },
    { txt: 'while (n > 0) {', node: 'b3' },
    { txt: '    total = total + n', node: 'b4' },
    { txt: '    n = n - 1', node: 'b5' },
    { txt: '}' },
    { txt: 'print(total)', node: 'b6' },
  ],
  nodes: {
    b1: { x: 120, y: 22, ln: 1, label: 'read' },
    b2: { x: 120, y: 74, ln: 2, label: 'total=0' },
    b3: { x: 120, y: 130, ln: 3, dec: true, label: 'n>0?', lp: 'ur' },
    b4: { x: 120, y: 192, ln: 4, label: 'total+=n' },
    b5: { x: 120, y: 250, ln: 5, label: 'n-=1' },
    b6: { x: 205, y: 304, ln: 7, label: 'print' },
  },
  edges: [
    { from: 'b1', to: 'b2' }, { from: 'b2', to: 'b3' },
    { from: 'b3', to: 'b4', cond: 'T' }, { from: 'b4', to: 'b5' },
    { from: 'b5', to: 'b3', via: [[45, 250], [45, 130]] },
    { from: 'b3', to: 'b6', cond: 'F', via: [[205, 130]] },
  ],
};
type CovTest = { label: string; seq: string[] };
const runA = (age: number, member: boolean): string[] => {
  const s = ['a1', 'a2', 'a3'];
  if (age < 12) s.push('a4');
  s.push('a5', member ? 'a6' : 'a7', 'a8');
  return s;
};
const runB = (n: number): string[] => {
  const s = ['b1', 'b2'];
  let k = n;
  for (;;) { s.push('b3'); if (k > 0) { s.push('b4', 'b5'); k--; } else break; }
  s.push('b6');
  return s;
};
const edgeId = (a: string, b: string) => `${a}>${b}`;

function Cfg({ prog, covN, covE, lastN, lastE }: { prog: Prog; covN: Set<string>; covE: Set<string>; lastN: Set<string>; lastE: Set<string> }) {
  const uid = safeId(useId());
  const r = 15;
  return (
    <svg viewBox="0 0 250 325" style={{ width: '100%', maxWidth: 260 }}>
      <defs>
        {[['dim', 'var(--faint)'], ['cov', 'var(--good)'], ['last', ACC]].map(([k, c]) => (
          <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} />
          </marker>
        ))}
      </defs>
      {prog.edges.map((e) => {
        const A = prog.nodes[e.from], B = prog.nodes[e.to];
        const pts: [number, number][] = [[A.x, A.y], ...(e.via ?? []), [B.x, B.y]];
        const sh = (p: [number, number], q: [number, number], d: number): [number, number] => {
          const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
          return [p[0] + ((q[0] - p[0]) / l) * d, p[1] + ((q[1] - p[1]) / l) * d];
        };
        const P = [...pts];
        P[0] = sh(pts[0], pts[1], r);
        P[P.length - 1] = sh(pts[pts.length - 1], pts[pts.length - 2], r + 3);
        const id = edgeId(e.from, e.to);
        const k = lastE.has(id) ? 'last' : covE.has(id) ? 'cov' : 'dim';
        const color = k === 'last' ? ACC : k === 'cov' ? 'var(--good)' : 'var(--faint)';
        const lx = (pts[0][0] + pts[1][0]) / 2, ly = (pts[0][1] + pts[1][1]) / 2;
        return (
          <g key={id}>
            <polyline points={P.map((p) => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={k === 'dim' ? 1.3 : 2.6}
              strokeDasharray={k === 'dim' ? '4 3' : undefined} markerEnd={`url(#${uid}-${k})`} />
            {e.cond && <text x={lx + (e.cond === 'T' ? 8 : -8)} y={ly - 2} fontSize={11} fontWeight={800} textAnchor="middle" fill={color}>{e.cond}</text>}
          </g>
        );
      })}
      {Object.entries(prog.nodes).map(([id, n]) => {
        const fill = lastN.has(id) ? mix(ACC, 35) : covN.has(id) ? mix(VALID, 28) : 'var(--panel-solid)';
        const stroke = lastN.has(id) ? ACC : covN.has(id) ? 'var(--good)' : 'var(--border-strong)';
        return (
          <g key={id}>
            {n.dec
              ? <polygon points={`${n.x},${n.y - r - 3} ${n.x + r + 3},${n.y} ${n.x},${n.y + r + 3} ${n.x - r - 3},${n.y}`} fill={fill} stroke={stroke} strokeWidth={2} />
              : <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke={stroke} strokeWidth={2} />}
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--text)">{n.ln}</text>
            {(() => {
              const lp = n.lp ?? (n.x < 90 ? 'l' : 'r');
              const lx = lp === 'l' ? n.x - r - 6 : lp === 'ur' ? n.x + 13 : n.x + r + 5;
              const ly = lp === 'ur' ? n.y - 17 : n.y + 4;
              return <text x={lx} y={ly} textAnchor={lp === 'l' ? 'end' : 'start'} fontSize={9} fill="var(--muted)">{n.label}</text>;
            })()}
          </g>
        );
      })}
    </svg>
  );
}

export function CoverageLab({ focus = 'statement' }: { focus?: 'statement' | 'branch' }) {
  const [pid, setPid] = useState<'A' | 'B'>('A');
  const [testsA, setTestsA] = useState<CovTest[]>([]);
  const [testsB, setTestsB] = useState<CovTest[]>([]);
  const [age, setAge] = useState('8');
  const [member, setMember] = useState(true);
  const [n, setN] = useState('0');
  const prog = pid === 'A' ? PROG_A : PROG_B;
  const tests = pid === 'A' ? testsA : testsB;
  const setTests = pid === 'A' ? setTestsA : setTestsB;
  const nodeIds = Object.keys(prog.nodes);
  const edgesOf = (seq: string[]) => seq.slice(1).map((x, i) => edgeId(seq[i], x));
  const covN = new Set(tests.flatMap((t) => t.seq));
  const covE = new Set(tests.flatMap((t) => edgesOf(t.seq)));
  const last = tests[tests.length - 1];
  const lastN = new Set(last?.seq ?? []);
  const lastE = new Set(last ? edgesOf(last.seq) : []);
  const condEdges = prog.edges.filter((e) => e.cond);
  const condCov = condEdges.filter((e) => covE.has(edgeId(e.from, e.to))).length;
  const sCov = nodeIds.filter((x) => covN.has(x)).length;
  const bCov = prog.edges.filter((e) => covE.has(edgeId(e.from, e.to))).length;
  const sFull = sCov === nodeIds.length, bFull = bCov === prog.edges.length;
  // was there ever a moment (after test k) with 100% statement but < 100% branch?
  const everStmtNotBranch = tests.some((_, k) => {
    const pre = tests.slice(0, k + 1);
    const n2 = new Set(pre.flatMap((t) => t.seq));
    const e2 = new Set(pre.flatMap((t) => edgesOf(t.seq)));
    return nodeIds.every((x) => n2.has(x)) && prog.edges.some((e) => !e2.has(edgeId(e.from, e.to)));
  });

  const runA1 = (a: number, m: boolean) => setTestsA((t) => [...t, { label: `age=${a}, member=${m}`, seq: runA(a, m) }]);
  const runB1 = (k: number) => setTestsB((t) => [...t, { label: `n=${k}`, seq: runB(Math.max(-5, Math.min(20, k))) }]);

  const inp: CSSProperties = { width: 70, padding: '6px 8px', borderRadius: 10, border: '1px solid var(--border-strong)', background: 'var(--panel-solid)', color: 'var(--text)', ...mono };
  const challenges = pid === 'A'
    ? focus === 'statement'
      ? [{ t: 'Reach 100% statement coverage', ok: sFull }, { t: '…with only 2 test cases', ok: sFull && tests.length <= 2 }]
      : [{ t: 'Get 100% statement while branch < 100% (statement ⇏ branch)', ok: everStmtNotBranch }, { t: 'Now reach 100% branch (⇒ statement is 100% too)', ok: bFull }]
    : [{ t: 'n = 0: which lines never run?', ok: tests.some((t) => t.label === 'n=0') }, { t: 'One test with n ≥ 1 → 100% branch (loop continue AND exit)', ok: bFull }];

  return (
    <div>
      <div className="row wrap" style={{ gap: 10 }}>
        <Tabs value={pid} onChange={setPid} tabs={[{ id: 'A', label: PROG_A.name }, { id: 'B', label: PROG_B.name }]} />
      </div>
      <div className="grid mt" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14, alignItems: 'start' }}>
        <div>
          <div style={{ ...box, padding: 8, ...mono, fontSize: 13.5 }}>
            {prog.lines.map((l, i) => {
              const exec = !!l.node;
              const inLast = exec && lastN.has(l.node!);
              const cov = exec && covN.has(l.node!);
              const dec = exec && prog.nodes[l.node!].dec;
              const outs = dec ? prog.edges.filter((e) => e.from === l.node && e.cond) : [];
              return (
                <div key={i} className="row" style={{ gap: 8, padding: '2px 6px', borderRadius: 6,
                  background: inLast ? mix(ACC, 26) : cov ? mix(VALID, 16) : 'transparent',
                  borderLeft: `3px solid ${exec ? (cov ? 'var(--good)' : 'var(--bad)') : 'transparent'}`, opacity: exec ? 1 : 0.5 }}>
                  <span className="faint" style={{ width: 18, textAlign: 'right' }}>{i + 1}</span>
                  <span style={{ whiteSpace: 'pre', flex: 1 }}>{l.txt}</span>
                  {outs.map((e) => {
                    const c = covE.has(edgeId(e.from, e.to));
                    return <span key={e.cond} className={`chip ${c ? 'good' : ''}`} style={{ padding: '0 7px', fontSize: 10 }}>{e.cond} {c ? '✔' : '○'}</span>;
                  })}
                </div>
              );
            })}
          </div>
          <div className="tiny faint" style={{ marginTop: 4 }}>Red edge = executable statement never run · faded lines (braces, else) are not executable statements.</div>
          <div className="row wrap mt" style={{ gap: 8 }}>
            {pid === 'A' ? (
              <>
                <label className="small">age <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inp} /></label>
                <label className="small row" style={{ gap: 4, cursor: 'pointer' }}><input type="checkbox" checked={member} onChange={(e) => setMember(e.target.checked)} /> member</label>
                <button className="btn sm primary" onClick={() => runA1(Math.round(Number(age) || 0), member)}>▶ Run test</button>
              </>
            ) : (
              <>
                <label className="small">n <input type="number" value={n} onChange={(e) => setN(e.target.value)} style={inp} /></label>
                <button className="btn sm primary" onClick={() => runB1(Math.round(Number(n) || 0))}>▶ Run test</button>
              </>
            )}
            <button className="btn sm ghost" onClick={() => setTests([])}>↺ Reset</button>
          </div>
          <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
            <span className="tiny faint">Quick:</span>
            {pid === 'A'
              ? ([[8, true], [8, false], [30, false], [30, true]] as [number, boolean][]).map(([a, m]) => (
                <button key={`${a}${m}`} className="chip click" onClick={() => runA1(a, m)}>({a}, {m ? 'member' : 'non-member'})</button>))
              : [0, 1, 3].map((k) => <button key={k} className="chip click" onClick={() => runB1(k)}>n={k}</button>)}
          </div>
          {tests.length > 0 && (
            <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
              {tests.map((t, i) => (
                <span key={i} className="chip click" style={i === tests.length - 1 ? { borderColor: ACC } : undefined} onClick={() => setTests((ts) => ts.filter((_, k) => k !== i))}>T{i + 1}: {t.label} ✕</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ ...box, padding: 8, textAlign: 'center' }}>
          <div className="tiny faint">Control flow graph · every arrow is a branch</div>
          <Cfg prog={prog} covN={covN} covE={covE} lastN={lastN} lastE={lastE} />
        </div>
      </div>
      <div className="row wrap mt" style={{ gap: 14 }}>
        <Meter label="Statement coverage" n={sCov} d={nodeIds.length} color={focus === 'statement' ? ACC : '#22d3ee'} hint="executed statements ÷ executable statements" />
        <Meter label="Branch coverage" n={bCov} d={prog.edges.length} color={focus === 'branch' ? ACC : '#22d3ee'}
          hint={<>all branches (unconditional + conditional) · decision outcomes: {condCov}/{condEdges.length}</>} />
      </div>
      <div className="row wrap mt" style={{ gap: 8 }}>
        {challenges.map((c) => <span key={c.t} className={`chip ${c.ok ? 'good' : ''}`}>{c.ok ? '🏆' : '🎯'} {c.t}</span>)}
      </div>
    </div>
  );
}

/* =====================================================================
   4.4.1  Error guessing: fault-attack dartboard
   ===================================================================== */
const ATTACKS = [
  { icon: '⌨️', name: 'Input', ex: 'correct input not accepted · parameters wrong or missing', attack: 'Leave a mandatory field empty, paste 5,000 characters, type letters into the amount field.' },
  { icon: '🖨️', name: 'Output', ex: 'wrong format · wrong result', attack: 'Check dates, currencies and decimals in the receipt; does €1,000.5 show as €1,000.50?' },
  { icon: '🧠', name: 'Logic', ex: 'missing cases · wrong operator', attack: 'Empty cart + coupon? Exactly on the limit (≥ vs >)? What if two rules apply at once?' },
  { icon: '🧮', name: 'Computation', ex: 'incorrect operand · wrong computation', attack: 'Average of zero items (÷0), rounding of 0.1 + 0.2, very large totals.' },
  { icon: '🔌', name: 'Interfaces', ex: 'parameter mismatch · incompatible types', attack: 'Send a string where the API expects an int; swap two parameters; omit an optional one.' },
  { icon: '🗄️', name: 'Data', ex: 'incorrect initialization · wrong type', attack: 'First run on an empty database; counter not reset; null where an object is expected.' },
];

export function FaultAttackBoard() {
  const [sel, setSel] = useState<number[]>([]);
  const [focus, setFocus] = useState(0);
  const cx = 160, cy = 160, r0 = 52, r1 = 150;
  const sector = (i: number) => {
    const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
    const p = (r: number, a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    return `M${p(r0, a0)} L${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`;
  };
  const click = (i: number) => { setFocus(i); setSel((s) => (s.includes(i) ? s : [...s, i])); };
  const A = ATTACKS[focus];
  return (
    <div>
      <div className="row wrap" style={{ gap: 6 }}>
        <span className="small"><b>Tester's knowledge:</b></span>
        <span className="chip">🕰️ how the app worked in the past</span>
        <span className="chip">👩‍💻 errors developers tend to make</span>
        <span className="chip">🏚️ failures in similar apps</span>
      </div>
      <div className="grid g2 mt" style={{ alignItems: 'center' }}>
        <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'block' }}>
          {ATTACKS.map((a, i) => {
            const am = ((i + 0.5) / 6) * Math.PI * 2 - Math.PI / 2;
            const on = sel.includes(i);
            return (
              <g key={a.name} onClick={() => click(i)} style={{ cursor: 'pointer' }}>
                <path d={sector(i)} fill={focus === i ? mix(ACC, 45) : on ? mix(ACC, 22) : 'var(--panel-2)'} stroke="var(--border-strong)" strokeWidth={1.5} />
                <text x={cx + 100 * Math.cos(am)} y={cy + 100 * Math.sin(am) - 4} textAnchor="middle" fontSize={22}>{a.icon}</text>
                <text x={cx + 100 * Math.cos(am)} y={cy + 100 * Math.sin(am) + 16} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--text)">{a.name}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={r0 - 4} fill={mix(ACC, 30)} stroke={ACC} strokeWidth={2} />
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize={22}>🎯</text>
          <text x={cx} y={cy + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--text)">{sel.length}/6 aimed</text>
        </svg>
        <div>
          <div className="detail" style={{ ['--c' as string]: ACC, marginTop: 0 }}>
            <h4>{A.icon} {A.name} errors</h4>
            <div className="small muted">Syllabus examples: <Secret><b>{A.ex}</b></Secret></div>
            <div className="small mt">🗡️ Attack: <Secret>{A.attack}</Secret></div>
          </div>
          <div style={{ ...box, marginTop: 10 }}>
            <b className="small">📝 My fault-attack list</b>
            {sel.length === 0 && <div className="tiny faint">Click sectors to add attacks to the list.</div>}
            <ol className="small" style={{ margin: '6px 0 0', paddingLeft: 20 }}>
              {sel.map((i) => <li key={i}>{ATTACKS[i].icon} {ATTACKS[i].name}: {ATTACKS[i].attack}</li>)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.4.3  Checklist doctor
   ===================================================================== */
const CL_ITEMS: { t: string; keep: boolean; why: string }[] = [
  { t: 'Is every error message understandable for a non-technical user?', keep: true, why: 'A question, checkable separately and directly — a good usability item.' },
  { t: 'Does the code compile without warnings?', keep: false, why: 'Can be checked AUTOMATICALLY (compiler / static analysis) → does not belong on a checklist.' },
  { t: 'Is the software good?', keep: false, why: 'Too GENERAL — cannot be checked directly.' },
  { t: 'Has the test environment been set up and smoke-tested?', keep: false, why: 'Better suited as an ENTRY criterion.' },
  { t: 'Can the user undo the last action?', keep: true, why: 'Specific, separately checkable (cf. Nielsen\'s usability heuristics).' },
  { t: 'Are all planned tests executed with no critical defects open?', keep: false, why: 'Better suited as an EXIT criterion.' },
  { t: 'Does each mandatory field show the expected format?', keep: true, why: 'Concrete question about a GUI property — checkable directly.' },
  { t: 'Is every line of code ≤ 120 characters?', keep: false, why: 'A linter checks that automatically → not on a checklist.' },
];

export function ChecklistDoctor() {
  const [ans, setAns] = useState<Record<number, boolean>>({});
  const done = Object.keys(ans).length;
  const right = CL_ITEMS.filter((it, i) => ans[i] === it.keep).length;
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>🩺 Keep or drop each checklist item?</b>
        <span className="chip">{right}/{done} right · {CL_ITEMS.length - done} left</span>
      </div>
      <div className="col mt" style={{ gap: 6 }}>
        {CL_ITEMS.map((it, i) => {
          const a = ans[i];
          const answered = a !== undefined;
          return (
            <div key={it.t} style={{ ...box, padding: '8px 12px', borderColor: answered ? (a === it.keep ? 'var(--good)' : 'var(--bad)') : 'var(--border)' }}>
              <div className="row wrap" style={{ gap: 8 }}>
                <span style={{ fontSize: 18 }}>{answered ? (it.keep ? '☑️' : '🗑️') : '❔'}</span>
                <span className="small" style={{ flex: '1 1 240px' }}>{it.t}</span>
                <button className={`chip click ${a === true ? 'on' : ''}`} onClick={() => setAns((s) => ({ ...s, [i]: true }))}>✔ keep</button>
                <button className={`chip click ${a === false ? 'on' : ''}`} onClick={() => setAns((s) => ({ ...s, [i]: false }))}>✖ drop</button>
              </div>
              {answered && <div className="tiny" style={{ marginTop: 4, color: a === it.keep ? 'var(--good)' : 'var(--bad)' }}>{a === it.keep ? '✅' : '❌'} {it.why}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================================
   4.5.1  User story: 3 Cs + INVEST smell detector
   ===================================================================== */
const INVEST = [
  { l: 'I', w: 'Independent', d: 'Can be developed and delivered without depending on another story.' },
  { l: 'N', w: 'Negotiable', d: 'Not a fixed contract — details are worked out in the conversation.' },
  { l: 'V', w: 'Valuable', d: 'Delivers value to a user or purchaser.' },
  { l: 'E', w: 'Estimable', d: 'The team can estimate its size/effort.' },
  { l: 'S', w: 'Small', d: 'Fits in an iteration.' },
  { l: 'T', w: 'Testable', d: 'Someone knows how to test it — acceptance criteria can be written.' },
];
const SMELLS: { t: string; a: string }[] = [
  { t: '"As a user, I want the app to be user-friendly."', a: 'T' },
  { t: '"As a customer, I want the complete online shop, so that I can buy things."', a: 'S' },
  { t: '"Upgrade the logging library to v3.2." (no user or purchaser benefits)', a: 'V' },
  { t: '"Edit profile" — can only be built and released together with "Create profile" and "Upload avatar".', a: 'I' },
  { t: '"Use exactly this DB schema and these 14 screens. No discussion."', a: 'N' },
  { t: '"As a trader, I want an AI that predicts tomorrow\'s stock market." Nobody can size it.', a: 'E' },
];

export function StoryInvest() {
  const [c, setC] = useState(0);
  const [inv, setInv] = useState<number | null>(null);
  const [ans, setAns] = useState<Record<number, string>>({});
  const Cs = [
    { icon: '🗂️', name: 'Card', d: 'The MEDIUM describing the story — an index card, an entry on an electronic board.' },
    { icon: '💬', name: 'Conversation', d: 'Explains HOW the software will be used. Can be documented or verbal. Business + development + testing perspectives → shared vision.' },
    { icon: '✅', name: 'Confirmation', d: 'The ACCEPTANCE CRITERIA — how we confirm the story is done.' },
  ];
  return (
    <div>
      <div className="grid g2" style={{ alignItems: 'center' }}>
        <div style={{ background: '#fff8dc', color: '#3b3320', borderRadius: 6, padding: '18px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: 'rotate(-1.2deg)', fontFamily: 'var(--display)' }}>
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6 }}>USER STORY #42</div>
          <div style={{ fontSize: 17, lineHeight: 1.6, marginTop: 6 }}>
            As a <span style={{ background: '#bfe9ff', padding: '0 4px', borderRadius: 4 }}>frequent traveller</span>,<br />
            I want <span style={{ background: '#ffd6e8', padding: '0 4px', borderRadius: 4 }}>to save my passport details</span>,<br />
            so that I can <span style={{ background: '#d4f7d4', padding: '0 4px', borderRadius: 4 }}>book flights in under a minute</span>.
          </div>
          <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>🔵 role · 🔴 goal · 🟢 business value — followed by acceptance criteria</div>
        </div>
        <div className="col" style={{ gap: 8 }}>
          {Cs.map((x, i) => (
            <div key={x.name} className={`node ${c === i ? 'sel' : ''}`} style={{ ['--c' as string]: ACC, textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center', padding: 10 }} onClick={() => setC(i)}>
              <span style={{ fontSize: 26 }}>{x.icon}</span>
              <div><b>{x.name}</b>{c === i && <div className="small muted"><Secret>{x.d}</Secret></div>}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt">
        <b>💰 INVEST in good stories</b> <span className="tiny faint">(click a letter)</span>
        <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
          {INVEST.map((x, i) => (
            <button key={x.l} className={`btn sm ${inv === i ? 'primary' : ''}`} onClick={() => setInv(i)} style={{ minWidth: 46 }}>
              <b style={{ fontSize: 18 }}>{x.l}</b>{inv === i ? <span className="small"> {x.w}</span> : null}
            </button>
          ))}
        </div>
        {inv !== null && <div className="small mt"><b>{INVEST[inv].w}:</b> <Secret>{INVEST[inv].d}</Secret></div>}
      </div>
      <div className="mt">
        <b>👃 Smell detector — which INVEST letter is violated?</b>
        <div className="col" style={{ gap: 6, marginTop: 6 }}>
          {SMELLS.map((s, i) => {
            const a = ans[i];
            return (
              <div key={s.t} className="row wrap" style={{ ...box, padding: '8px 12px', gap: 6, borderColor: a ? (a === s.a ? 'var(--good)' : 'var(--bad)') : 'var(--border)' }}>
                <span className="small" style={{ flex: '1 1 260px' }}>{s.t}</span>
                {INVEST.map((x) => (
                  <button key={x.l} className={`chip click ${a === x.l ? 'on' : ''}`} onClick={() => setAns((p) => ({ ...p, [i]: x.l }))}>{x.l}</button>
                ))}
                {a && <span className="small">{a === s.a ? `✅ ${INVEST.find((x) => x.l === s.a)!.w}` : '❌ try again'}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.5.2  Acceptance criteria formats
   ===================================================================== */
const AC_SNIPS: { t: string; a: 'scenario' | 'rule' }[] = [
  { t: 'Given I am logged in, When I click "Pay", Then I see the receipt.', a: 'scenario' },
  { t: '• Password has ≥ 8 characters  • contains a digit  • is not the username', a: 'rule' },
  { t: 'Table: age 17 → rejected | age 18 → accepted | age 65 → accepted', a: 'rule' },
  { t: 'Scenario: expired card — Given an expired card, When I pay, Then the payment is declined.', a: 'scenario' },
];

export function AcFormats() {
  const [tab, setTab] = useState<'scenario' | 'rule'>('scenario');
  const [ans, setAns] = useState<Record<number, string>>({});
  const kw = (k: string, c: string) => <b style={{ color: c, ...mono }}>{k}</b>;
  return (
    <div>
      <div style={{ ...box, marginBottom: 10 }} className="small">
        🗂️ <i>As a shopper, I want to apply a discount code at checkout, so that I pay less.</i>
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'scenario', label: '🎬 Scenario-oriented' }, { id: 'rule', label: '📏 Rule-oriented' }]} />
      {tab === 'scenario' ? (
        <div className="grid g2 mt">
          {[
            { n: 'Valid code', g: 'a cart of €100 and the code SAVE10', w: 'I apply the code', t: 'the total is €90' },
            { n: 'Expired code', g: 'the code OLD5 has expired', w: 'I apply the code', t: 'I see "Code expired" and the total is unchanged' },
          ].map((s) => (
            <div key={s.n} style={{ ...box, ...mono, fontSize: 13 }}>
              <div className="tiny faint">Scenario: {s.n}</div>
              <div>{kw('Given', '#22d3ee')} <Secret>{s.g}</Secret></div>
              <div>{kw('When', '#ffb703')} <Secret>{s.w}</Secret></div>
              <div>{kw('Then', VALID)} <Secret>{s.t}</Secret></div>
            </div>
          ))}
          <div className="small muted" style={{ gridColumn: '1 / -1' }}>Given/When/Then — the format used in <b>BDD</b>. Reads like a little film script.</div>
        </div>
      ) : (
        <div className="grid g2 mt">
          <div style={box} className="small">
            <b>Bullet-point verification list</b>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <Secret as="li">A valid code reduces the total by its percentage</Secret>
              <Secret as="li">An expired code is rejected with "Code expired"</Secret>
              <Secret as="li">Only one code per order</Secret>
            </ul>
          </div>
          <div style={box} className="small">
            <b>Tabulated input → output mapping</b>
            <table className="cmp" style={{ marginTop: 6 }}>
              <thead><tr><th>code</th><th>cart</th><th>total</th></tr></thead>
              <tbody>
                <tr><td style={mono}>SAVE10</td><td>€100</td><td><Secret>€90</Secret></td></tr>
                <tr><td style={mono}>SAVE20</td><td>€50</td><td><Secret>€40</Secret></td></tr>
                <tr><td style={mono}>OLD5</td><td>€100</td><td><Secret>€100 + error</Secret></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="mt">
        <b>🎯 Classify the format</b>
        <div className="col" style={{ gap: 6, marginTop: 6 }}>
          {AC_SNIPS.map((s, i) => {
            const a = ans[i];
            return (
              <div key={s.t} className="row wrap" style={{ ...box, padding: '8px 12px', gap: 6, borderColor: a ? (a === s.a ? 'var(--good)' : 'var(--bad)') : 'var(--border)' }}>
                <span className="small" style={{ flex: '1 1 260px', ...mono }}>{s.t}</span>
                <button className={`chip click ${a === 'scenario' ? 'on' : ''}`} onClick={() => setAns((p) => ({ ...p, [i]: 'scenario' }))}>🎬 scenario</button>
                <button className={`chip click ${a === 'rule' ? 'on' : ''}`} onClick={() => setAns((p) => ({ ...p, [i]: 'rule' }))}>📏 rule</button>
                {a && <span>{a === s.a ? '✅' : '❌'}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   4.5.3  ATDD workshop
   ===================================================================== */
type AtddKind = 'pos' | 'neg' | 'nfr' | 'rej';
const ATDD_KIND: Record<AtddKind, { icon: string; name: string; color: string }> = {
  pos: { icon: '😀', name: 'Positive', color: VALID },
  neg: { icon: '😈', name: 'Negative', color: INVALID },
  nfr: { icon: '🏎️', name: 'Non-functional', color: '#ffb703' },
  rej: { icon: '🚫', name: 'Reject', color: 'var(--muted)' },
};
const ATDD_CANDS: { t: string; a: AtddKind; why: string }[] = [
  { t: 'Given a €100 cart and valid code SAVE10, when I apply it, then the total is €90.', a: 'pos', why: 'Happy path for AC1 — confirms correct behaviour without exceptions.' },
  { t: 'Given expired code OLD5, when I apply it, then "Code expired" is shown and the total is unchanged.', a: 'neg', why: 'Error condition from AC2.' },
  { t: 'Given SAVE10 is already applied, when I enter SAVE20, then it is rejected ("one code per order").', a: 'neg', why: 'Negative test for AC3.' },
  { t: 'When a valid code is applied, the new total appears within 1 second.', a: 'nfr', why: 'Performance efficiency — AC4. Non-functional comes last.' },
  { t: 'Given a €100 cart and code SAVE10 on a Tuesday, when I apply it, then the total is €90.', a: 'rej', why: 'Describes the SAME characteristic as test 1 → no two test cases should describe the same characteristic.' },
  { t: 'The shopper can pay the order with PayPal.', a: 'rej', why: 'Goes BEYOND the story — tests must not exceed the user story.' },
];
const ATDD_STEPS = ['🗣️ Specification workshop', '✍️ Tests from acceptance criteria', '😀 Positive', '😈 Negative', '🏎️ Non-functional', '🤖 Automate → executable requirements'];

export function AtddWorkshop() {
  const [ans, setAns] = useState<Record<number, AtddKind>>({});
  const all = Object.keys(ans).length === ATDD_CANDS.length;
  const right = ATDD_CANDS.filter((c, i) => ans[i] === c.a).length;
  const order: AtddKind[] = ['pos', 'neg', 'nfr'];
  return (
    <div>
      <div className="row wrap" style={{ gap: 4 }}>
        {ATDD_STEPS.map((s, i) => (
          <span key={s} className="row" style={{ gap: 4 }}>
            {i > 0 && <span className="faint">➜</span>}
            <span className="chip" style={i >= 2 && i <= 4 ? { borderColor: ACC } : undefined}>{s}</span>
          </span>
        ))}
      </div>
      <div className="grid g2 mt">
        <div style={box} className="small">
          <b>🗂️ Story</b><div><i>As a shopper, I want to apply a discount code at checkout, so that I pay less.</i></div>
        </div>
        <div style={box} className="small">
          <b>✅ Acceptance criteria</b>
          <ol style={{ margin: '4px 0 0', paddingLeft: 18 }}>
            <li>Valid code reduces the total by its %</li>
            <li>Expired code is rejected with "Code expired"</li>
            <li>Only one code per order</li>
            <li>New total shown within 1 s</li>
          </ol>
        </div>
      </div>
      <div className="mt"><b>🧪 Candidate test cases — classify each</b> <span className="chip">{right}/{ATDD_CANDS.length}</span></div>
      <div className="col" style={{ gap: 6, marginTop: 6 }}>
        {ATDD_CANDS.map((c, i) => {
          const a = ans[i];
          return (
            <div key={c.t} style={{ ...box, padding: '8px 12px', borderColor: a ? (a === c.a ? 'var(--good)' : 'var(--bad)') : 'var(--border)' }}>
              <div className="row wrap" style={{ gap: 6 }}>
                <span className="small" style={{ flex: '1 1 260px' }}>{c.t}</span>
                {(Object.keys(ATDD_KIND) as AtddKind[]).map((k) => (
                  <button key={k} className={`chip click ${a === k ? 'on' : ''}`} onClick={() => setAns((p) => ({ ...p, [i]: k }))}>{ATDD_KIND[k].icon} {ATDD_KIND[k].name}</button>
                ))}
              </div>
              {a && <div className="tiny" style={{ marginTop: 4, color: a === c.a ? 'var(--good)' : 'var(--bad)' }}>{a === c.a ? '✅' : `❌ It's ${ATDD_KIND[c.a].name}.`} {c.why}</div>}
            </div>
          );
        })}
      </div>
      {all && (
        <div className="detail" style={{ ['--c' as string]: ACC }}>
          <h4>📜 Your ATDD suite, in the right order</h4>
          {order.map((k) => (
            <div key={k} className="small" style={{ margin: '4px 0' }}>
              <b style={{ color: ATDD_KIND[k].color }}>{ATDD_KIND[k].icon} {ATDD_KIND[k].name}:</b>{' '}
              {ATDD_CANDS.filter((c) => c.a === k).map((c) => c.t).join('  ·  ')}
            </div>
          ))}
          <div className="tiny faint mt">Written BEFORE the code, in natural language stakeholders understand (preconditions, inputs, postconditions). Automated → executable requirements.</div>
        </div>
      )}
    </div>
  );
}
