import { useState, useEffect, useCallback, useRef } from "react";

/* ── palette ─────────────────────────────────────────── */
const C = {
  bg: "#0d1117", surface: "#161b22", border: "#21262d",
  border2: "#30363d", text: "#e6edf3", muted: "#8b949e",
  dim: "#484f58", blue: "#58a6ff", green: "#3fb950",
  purple: "#d2a8ff", red: "#ff7b72", yellow: "#e3b341",
  teal: "#61dafb", orange: "#f78166", cyan: "#39d353",
};

/* ── syntax highlighter ──────────────────────────────── */
function Code({ children, fontSize = 13 }) {
  const lines = children.trim().split("\n");
  return (
    <pre style={{
      background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 10,
      padding: "16px 20px", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize, lineHeight: 1.8, overflowX: "auto", margin: 0,
      textAlign: "left", color: C.text,
    }}>
      {lines.map((line, i) => <div key={i}>{hl(line)}</div>)}
    </pre>
  );
}
function hl(line) {
  const rules = [
    { re: /(\/\/.*$)/, c: C.dim },
    { re: /(#.*$)/, c: C.dim },
    { re: /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, c: "#a5d6ff" },
    { re: /\b(import|export|default|from|return|const|let|var|function|class|extends|new|this|typeof|instanceof|if|else|for|while|do|switch|case|break|continue|async|await|true|false|null|undefined|void|delete|in|of|throw|try|catch|finally|static|super|yield)\b/, c: C.red },
    { re: /\b(describe|it|test|expect|vi|beforeEach|afterEach|beforeAll|afterAll|render|screen|fireEvent|getByText|getByRole|page|userEvent)\b/, c: C.yellow },
    { re: /\b(useState|useEffect|useCallback|useRef|useMemo|useContext|useReducer|React|Suspense|lazy)\b/, c: C.purple },
    { re: /(<\/?[A-Z][A-Za-z0-9]*)/, c: "#79c0ff" },
    { re: /(<\/?[a-z][a-z0-9-]*)/, c: C.green },
    { re: /\b([A-Z][A-Za-z0-9]*)/, c: "#79c0ff" },
    { re: /\b(\d+(?:\.\d+)?)\b/, c: "#f8c8a0" },
  ];
  // Find the earliest match across all rules (not just the first rule that matches anywhere)
  let rem = line, res = [], k = 0;
  while (rem.length > 0) {
    let bestStart = rem.length, bestText = null, bestColor = null;
    for (const { re, c } of rules) {
      const m = rem.match(re);
      if (m !== null && m.index < bestStart) {
        bestStart = m.index;
        bestText = m[0];
        bestColor = c;
      }
    }
    if (bestText === null) { res.push(<span key={k++}>{rem}</span>); break; }
    if (bestStart > 0) res.push(<span key={k++}>{rem.slice(0, bestStart)}</span>);
    res.push(<span key={k++} style={{ color: bestColor }}>{bestText}</span>);
    rem = rem.slice(bestStart + bestText.length);
  }
  return res;
}

/* ── atoms ───────────────────────────────────────────── */
const LiveDot = () => (
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
);
const BigTitle = ({ children }) => (
  <h1 style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: "clamp(24px, 3.5vw, 48px)", fontWeight: 800, color: C.text, margin: "0 0 16px", lineHeight: 1.1 }}>{children}</h1>
);
const SlideTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: "clamp(16px, 2.4vw, 30px)", fontWeight: 800, color: C.text, margin: "0 0 20px", lineHeight: 1.15 }}>{children}</h2>
);
const Hl = ({ children, color = C.blue }) => <span style={{ color, fontWeight: 700 }}>{children}</span>;
const Card = ({ children, color, style = {} }) => (
  <div style={{ background: C.surface, border: `1px solid ${color ? color + "44" : C.border}`, borderRadius: 12, padding: "16px 20px", ...style }}>{children}</div>
);
const Chip = ({ children, color = C.blue }) => (
  <span style={{ display: "inline-block", background: color + "18", border: `1px solid ${color}44`, borderRadius: 5, padding: "3px 10px", fontSize: 12, color, fontFamily: "monospace", margin: "3px 4px 3px 0" }}>{children}</span>
);
const Row = ({ children, gap = 20, style = {} }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-start", ...style }}>{children}</div>
);
const Col = ({ children, style = {} }) => (
  <div style={{ flex: 1, ...style }}>{children}</div>
);
const Badge = ({ children, color = C.blue }) => (
  <span style={{ background: color + "22", border: `1px solid ${color}55`, borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 11, color, fontWeight: 700 }}>{children}</span>
);

/* ── collapsible teacher note ────────────────────────── */
function TeacherNote({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: "#e3b34110", border: `1px solid ${C.yellow}44`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, color: C.yellow, display: "flex", alignItems: "center", gap: 6 }}>
        📋 {open ? "Hide" : "Show"} teacher note
      </button>
      {open && (
        <div style={{ background: "#e3b34108", border: `1px solid ${C.yellow}33`, borderLeft: `3px solid ${C.yellow}`, borderRadius: "0 8px 8px 8px", padding: "10px 14px", marginTop: 4 }}>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   INTERACTIVE DEMOS
══════════════════════════════════════════════════════ */

/* ── Terminal simulator ──────────────────────────────── */
function TerminalSim({ lines, speed = 60 }) {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  const start = () => {
    setShown(0);
    setRunning(true);
  };
  useEffect(() => {
    if (!running) return;
    if (shown >= lines.length) { setRunning(false); return; }
    timer.current = setTimeout(() => setShown(s => s + 1), speed);
    return () => clearTimeout(timer.current);
  }, [running, shown, lines.length, speed]);

  return (
    <div>
      <pre style={{
        background: "#0a0e14", border: `1px solid ${C.border2}`, borderRadius: 10,
        padding: "16px 20px", fontFamily: "monospace", fontSize: 13, lineHeight: 2,
        minHeight: 120, margin: "0 0 12px",
      }}>
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} style={{ color: l.color || C.text }}>
            {l.prompt && <span style={{ color: C.green }}>$ </span>}
            {l.text}
            {i === shown - 1 && running && <span style={{ animation: "blink 1s infinite" }}>█</span>}
          </div>
        ))}
        {shown === 0 && <span style={{ color: C.dim }}>Press Run to execute…</span>}
      </pre>
      <button onClick={start} disabled={running}
        style={{ background: running ? C.border : C.green + "22", border: `1px solid ${running ? C.border2 : C.green}`, borderRadius: 6, padding: "6px 18px", cursor: running ? "default" : "pointer", fontFamily: "monospace", fontSize: 12, color: running ? C.dim : C.green }}>
        {running ? "Running…" : shown > 0 ? "↺ Run again" : "▶ Run"}
      </button>
    </div>
  );
}

/* ── npm vs npx ──────────────────────────────────────── */
function NpmVsNpxDemo() {
  const [tab, setTab] = useState("npm");

  const scenarios = {
    npm: {
      color: C.red,
      label: "npm install -g",
      subtitle: "Install once, regret later",
      terminal: [
        { text: "npm install -g create-react-app", prompt: true, color: C.text },
        { text: "# Downloads v5.0.1 → saved globally", color: C.dim },
        { text: "# ... 6 months pass ...", color: C.dim },
        { text: "create-react-app my-app", prompt: true, color: C.text },
        { text: "# ⚠ Using cached v5.0.1 (latest is v5.0.8)", color: C.yellow },
        { text: "# Your teammate has v5.0.3. Different output!", color: C.red },
      ],
      facts: [
        { icon: "📦", text: "Saved permanently to your machine" },
        { icon: "🕰", text: "Version freezes at install time" },
        { icon: "⚠️", text: "Team gets different versions" },
        { icon: "🗑", text: "Pollutes global node_modules" },
      ],
    },
    npx: {
      color: C.green,
      label: "npx create-vite@latest",
      subtitle: "Always fresh, always consistent",
      terminal: [
        { text: "npx create-vite@latest my-app", prompt: true, color: C.text },
        { text: "# Fetching latest version from npm…", color: C.dim },
        { text: "# ✓ Using v5.4.0 (always the newest)", color: C.green },
        { text: "# ✓ Your teammate runs same command → same version", color: C.green },
        { text: "# ✓ Package discarded after scaffolding", color: C.green },
        { text: "✔ Project created. Run: cd my-app && npm install", color: C.teal },
      ],
      facts: [
        { icon: "⬇️", text: "Downloads fresh on every run" },
        { icon: "✅", text: "Always the latest published version" },
        { icon: "🤝", text: "Every developer gets identical output" },
        { icon: "🧹", text: "Nothing left behind after running" },
      ],
    },
  };

  const s = scenarios[tab];

  return (
    <div>
      {/* toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.entries(scenarios).map(([key, val]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 13, fontWeight: 700, transition: "all 0.2s", background: tab === key ? val.color + "20" : C.surface, border: `2px solid ${tab === key ? val.color : C.border2}`, color: tab === key ? val.color : C.muted }}>
            {val.label}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: "monospace", fontSize: 12, color: s.color, marginBottom: 12, fontWeight: 700 }}>
        {s.subtitle}
      </div>

      <Row gap={16}>
        <Col style={{ flex: 1.4 }}>
          <TerminalSim lines={s.terminal} speed={80} />
        </Col>
        <Col>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {s.facts.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: C.bg, border: `1px solid ${s.color}33`, borderRadius: 8, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{f.text}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}

/* ── CSR vs SSR request race ─────────────────────────── */
function RenderingRaceDemo() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef(null);
  const MAX = 22; // 22 × 100ms = 2.2s

  const start = () => { setTick(0); setRunning(true); };
  useEffect(() => {
    if (!running) return;
    if (tick >= MAX) { setRunning(false); return; }
    timer.current = setTimeout(() => setTick(t => t + 1), 100);
    return () => clearTimeout(timer.current);
  }, [running, tick]);

  // timeline events in 100ms ticks
  const csrEvents = [
    { at: 4,  label: "HTML arrives (empty)", color: C.blue },
    { at: 4,  label: "😶 Blank screen", color: C.red },
    { at: 18, label: "JS bundle loaded", color: C.yellow },
    { at: 21, label: "✅ Content visible", color: C.green },
  ];
  const ssrEvents = [
    { at: 5,  label: "Full HTML arrives", color: C.green },
    { at: 5,  label: "✅ Content visible", color: C.green },
    { at: 18, label: "JS bundle loaded", color: C.yellow },
    { at: 21, label: "💧 Hydrated (interactive)", color: C.teal },
  ];

  const Bar = ({ events, color, label }) => {
    const pct = Math.min((tick / MAX) * 100, 100);
    const visible = events.filter(e => tick >= e.at);
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color, fontWeight: 700, marginBottom: 8 }}>{label}</div>
        {/* progress track */}
        <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 5, transition: "width 0.1s linear" }} />
        </div>
        {/* events */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", opacity: tick >= e.at ? 1 : 0.2, transition: "opacity 0.3s" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: C.dim, minWidth: 40 }}>{e.at * 100}ms</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: e.color }}>{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, marginBottom: 16 }}>
        Simulated page load on a slow 3G connection
      </div>
      <Bar events={csrEvents} color={C.blue} label="CSR — Client-Side Rendering" />
      <Bar events={ssrEvents} color={C.green} label="SSR — Server-Side Rendering" />
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
        <button onClick={start} disabled={running}
          style={{ background: running ? C.border : C.teal + "22", border: `1px solid ${running ? C.border2 : C.teal}`, borderRadius: 6, padding: "6px 18px", cursor: running ? "default" : "pointer", fontFamily: "monospace", fontSize: 12, color: running ? C.dim : C.teal }}>
          {running ? "Loading…" : tick > 0 ? "↺ Replay" : "▶ Simulate load"}
        </button>
        {tick >= MAX && (
          <span style={{ fontFamily: "monospace", fontSize: 12, color: C.green }}>
            SSR showed content {(21 - 5) * 100}ms sooner ✅
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Vite vs Next.js toggle ──────────────────────────── */
function ViteVsNextDemo() {
  const [active, setActive] = useState(null);

  const tools = {
    vite: {
      color: C.teal, label: "Vite", tag: "Build Tool",
      emoji: "⚡",
      oneliner: "You own the architecture. Vite just bundles it.",
      when: ["SPA / dashboard", "Auth-gated app (SEO irrelevant)", "Maximum flexibility needed", "Internal tooling"],
      notWhen: ["You need SSR/SSG out of the box", "Public marketing site", "File-based routing"],
      cmd: `npx create-vite@latest my-app --template react-ts`,
    },
    next: {
      color: C.purple, label: "Next.js", tag: "Full Framework",
      emoji: "🔺",
      oneliner: "Routing + SSR + API routes — batteries included.",
      when: ["Public website (SEO matters)", "E-commerce / blog / SaaS", "Per-page rendering strategy", "Need API routes"],
      notWhen: ["Simple SPA behind login", "Team wants full control", "Non-Node.js infra"],
      cmd: `npx create-next-app@latest my-app --typescript --app`,
    },
  };

  return (
    <div>
      {/* big toggle buttons */}
      <Row gap={12} style={{ marginBottom: 20 }}>
        {Object.entries(tools).map(([key, t]) => (
          <button key={key} onClick={() => setActive(active === key ? null : key)}
            style={{ flex: 1, padding: "18px 20px", borderRadius: 12, cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s", background: active === key ? t.color + "18" : C.surface, border: `2px solid ${active === key ? t.color : C.border2}`, textAlign: "left" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{t.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: active === key ? t.color : C.text }}>{t.label}</div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{t.tag}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>{t.oneliner}</div>
          </button>
        ))}
      </Row>

      {active && (() => {
        const t = tools[active];
        return (
          <div>
            <Row gap={12} style={{ marginBottom: 12 }}>
              <Col>
                <Card color={C.green} style={{ padding: "12px 14px" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: C.green, marginBottom: 8 }}>✅ CHOOSE WHEN</div>
                  {t.when.map((w, i) => (
                    <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>→ {w}</div>
                  ))}
                </Card>
              </Col>
              <Col>
                <Card color={C.red} style={{ padding: "12px 14px" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: C.red, marginBottom: 8 }}>❌ NOT WHEN</div>
                  {t.notWhen.map((w, i) => (
                    <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>→ {w}</div>
                  ))}
                </Card>
              </Col>
            </Row>
            <Code fontSize={12}>{t.cmd}</Code>
          </div>
        );
      })()}
      {!active && (
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "16px 0" }}>
          Click a tool to see when to use it
        </div>
      )}
    </div>
  );
}

/* ── Testing pyramid (interactive) ──────────────────── */
function TestingPyramidDemo() {
  const [active, setActive] = useState(null);
  const layers = [
    {
      key: "e2e", label: "E2E", sublabel: "Playwright / Cypress",
      color: C.red, width: "60%", count: "Few", speed: "Seconds",
      desc: "Real browser. Real user. Full stack.",
      example: `// e2e/tracker.spec.ts
test('user can add a task', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByLabel('New task').fill('Write tests');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Write tests')).toBeVisible();
});`,
    },
    {
      key: "component", label: "Component", sublabel: "React Testing Library",
      color: C.yellow, width: "75%", count: "Some", speed: "Milliseconds",
      desc: "Mount one component. Test what the user sees.",
      example: `// TaskInput.test.jsx
test('calls onAdd with trimmed text', () => {
  const onAdd = vi.fn();
  render(<TaskInput onAdd={onAdd} />);

  fireEvent.change(screen.getByRole('textbox'),
    { target: { value: '  Buy milk  ' } });
  fireEvent.keyDown(screen.getByRole('textbox'),
    { key: 'Enter' });

  expect(onAdd).toHaveBeenCalledWith('Buy milk');
});`,
    },
    {
      key: "unit", label: "Unit", sublabel: "Vitest / Jest",
      color: C.green, width: "100%", count: "Many", speed: "Microseconds",
      desc: "One function. Pure input → output. No DOM.",
      example: `// utils/tasks.test.js
import { filterByStatus } from './tasks';

it('returns only incomplete tasks', () => {
  const tasks = [
    { id: 1, text: 'A', done: false },
    { id: 2, text: 'B', done: true },
  ];
  expect(filterByStatus(tasks, false)).toHaveLength(1);
  expect(filterByStatus(tasks, false)[0].id).toBe(1);
});`,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 16 }}>
        {layers.map((layer) => (
          <button key={layer.key} onClick={() => setActive(active === layer.key ? null : layer.key)}
            style={{
              width: layer.width, padding: "12px 20px", borderRadius: 8, cursor: "pointer",
              background: active === layer.key ? layer.color + "28" : layer.color + "12",
              border: `2px solid ${active === layer.key ? layer.color : layer.color + "44"}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all 0.2s",
            }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: layer.color, fontWeight: 800 }}>{layer.label}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>{layer.sublabel}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Badge color={layer.color}>{layer.count}</Badge>
              <Badge color={C.dim}>{layer.speed}</Badge>
            </div>
          </button>
        ))}
      </div>

      {active && (() => {
        const layer = layers.find(l => l.key === active);
        return (
          <Card color={layer.color}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: layer.color, fontWeight: 700, marginBottom: 10 }}>
              {layer.desc}
            </div>
            <Code fontSize={12}>{layer.example}</Code>
          </Card>
        );
      })()}
      {!active && (
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "8px 0" }}>
          Click a layer → see a real test
        </div>
      )}
    </div>
  );
}

/* ── Build pipeline ──────────────────────────────────── */
function BuildPipelineDemo() {
  const [step, setStep] = useState(-1);
  const steps = [
    { label: "Source", icon: "📝", color: C.blue, detail: "JSX + TypeScript + CSS — human-readable dev files.", before: "myLongVariableName = true", after: null },
    { label: "Bundle", icon: "📦", color: C.purple, detail: "Vite traces every import and merges all modules into a few output files.", before: null, after: null },
    { label: "Tree-shake", icon: "🌳", color: C.green, detail: "Unused exports are deleted entirely. Import 1 of 10 functions → only 1 ships.", before: "export const a, b, c, d… (10 fns)", after: "export const a (1 fn used)" },
    { label: "Minify", icon: "🗜", color: C.yellow, detail: "Variable names shortened, whitespace stripped, comments removed.", before: "function handleClick(event) {", after: "function a(e){" },
    { label: "Hash", icon: "🔑", color: C.orange, detail: "Content hash in filename = automatic CDN cache-busting on every deploy.", before: "index.js", after: "index.a3f9c12.js" },
    { label: "dist/", icon: "🚀", color: C.teal, detail: "Static files ready for any CDN. No Node.js needed to serve them.", before: null, after: null },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16, overflowX: "auto", padding: "4px 0" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setStep(step === i ? -1 : i)}
              style={{ background: step === i ? s.color + "22" : C.surface, border: `2px solid ${step === i ? s.color : C.border2}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "center", minWidth: 80, transition: "all 0.2s" }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: step === i ? s.color : C.muted, marginTop: 4, fontWeight: step === i ? 700 : 400 }}>{s.label}</div>
            </button>
            {i < steps.length - 1 && <div style={{ fontFamily: "monospace", color: C.dim, padding: "0 4px", fontSize: 16 }}>→</div>}
          </div>
        ))}
      </div>

      {step >= 0 ? (
        <Card color={steps[step].color}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, marginBottom: steps[step].before ? 12 : 0 }}>
            {steps[step].detail}
          </div>
          {steps[step].before && (
            <Row gap={12} style={{ marginTop: 8 }}>
              <Col>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: C.red, marginBottom: 4 }}>BEFORE</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, background: C.bg, padding: "8px 12px", borderRadius: 6, color: C.red, border: `1px solid ${C.red}33` }}>
                  {steps[step].before}
                </div>
              </Col>
              <Col style={{ flex: 0, display: "flex", alignItems: "center", paddingTop: 16 }}>
                <span style={{ color: C.dim, fontSize: 18 }}>→</span>
              </Col>
              <Col>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: C.green, marginBottom: 4 }}>AFTER</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, background: C.bg, padding: "8px 12px", borderRadius: 6, color: C.green, border: `1px solid ${C.green}33` }}>
                  {steps[step].after}
                </div>
              </Col>
            </Row>
          )}
        </Card>
      ) : (
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "12px 0" }}>
          Click each step to see what happens
        </div>
      )}
    </div>
  );
}

/* ── CI/CD animated pipeline ─────────────────────────── */
function CIPipelineDemo() {
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  const steps = [
    { icon: "💻", label: "git push", color: C.blue, detail: "Developer pushes a feature branch to GitHub." },
    { icon: "🔔", label: "PR opened", color: C.muted, detail: "GitHub notifies the CI system. Pipeline triggers automatically." },
    { icon: "📥", label: "npm ci", color: C.teal, detail: "Clean install from package-lock.json. Reproducible every time." },
    { icon: "🧪", label: "npm test", color: C.yellow, detail: "Vitest runs all tests. One failure = pipeline stops. PR is blocked." },
    { icon: "🏗", label: "npm run build", color: C.orange, detail: "Vite production build. TypeScript errors surface here." },
    { icon: "🔗", label: "Preview URL", color: C.purple, detail: "Vercel/Netlify deploy a preview. Team reviews on real URL." },
    { icon: "✅", label: "Merge → Prod", color: C.green, detail: "Merge to main auto-deploys to production. Zero manual steps." },
  ];

  const run = () => {
    setActive(-1);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    if (active >= steps.length - 1) { setRunning(false); return; }
    timer.current = setTimeout(() => setActive(a => a + 1), 600);
    return () => clearTimeout(timer.current);
  }, [running, active]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 16, overflowX: "auto" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ textAlign: "center", padding: "10px 10px", borderRadius: 10, minWidth: 72, background: i <= active ? s.color + "20" : C.surface, border: `2px solid ${i <= active ? s.color : C.border}`, transition: "all 0.4s", transform: i === active ? "scale(1.08)" : "scale(1)" }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: 9, color: i <= active ? s.color : C.dim, marginTop: 4, fontWeight: i <= active ? 700 : 400 }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 20, height: 2, background: i < active ? C.green : C.border, transition: "background 0.4s", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {active >= 0 && (
        <Card color={steps[active].color} style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>
            {steps[active].detail}
          </div>
        </Card>
      )}

      <button onClick={run} disabled={running}
        style={{ background: running ? C.border : C.green + "22", border: `1px solid ${running ? C.border2 : C.green}`, borderRadius: 6, padding: "6px 18px", cursor: running ? "default" : "pointer", fontFamily: "monospace", fontSize: 12, color: running ? C.dim : C.green }}>
        {running ? "Pipeline running…" : active >= 0 ? "↺ Run again" : "▶ Run pipeline"}
      </button>
    </div>
  );
}

/* ── Senior checklist ────────────────────────────────── */
function SeniorChecklist() {
  const items = [
    { icon: "🛡", label: "Used npx for scaffolding?", color: C.blue },
    { icon: "🌐", label: "Right rendering strategy for this page?", color: C.purple },
    { icon: "🔑", label: "Secrets in .env, not in source code?", color: C.red },
    { icon: "⚡", label: "Unit tests pass?", color: C.green },
    { icon: "🧩", label: "Component tests pass?", color: C.yellow },
    { icon: "🌳", label: "Build runs clean — no TS errors?", color: C.orange },
    { icon: "📦", label: "Bundle size reasonable?", color: C.teal },
    { icon: "♿", label: "Tab navigation + ARIA labels work?", color: C.muted },
    { icon: "🔗", label: "Tested on preview URL, not just localhost?", color: C.purple },
    { icon: "🔁", label: "CI green on the PR?", color: C.green },
  ];
  const [checked, setChecked] = useState(new Set());
  const toggle = (i) => setChecked(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  const pct = Math.round((checked.size / items.length) * 100);

  return (
    <div>
      {/* progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.green : C.blue, borderRadius: 3, transition: "width 0.3s ease" }} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: pct === 100 ? C.green : C.muted, minWidth: 40 }}>
          {pct === 100 ? "🚀 Ship it!" : `${pct}%`}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            style={{ display: "flex", gap: 10, padding: "10px 14px", background: checked.has(i) ? item.color + "15" : C.surface, border: `1px solid ${checked.has(i) ? item.color : C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", alignItems: "center", transition: "all 0.2s" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: checked.has(i) ? item.color : C.muted, flex: 1, textDecoration: checked.has(i) ? "line-through" : "none" }}>
              {item.label}
            </span>
            <span style={{ fontSize: 14 }}>{checked.has(i) ? "✅" : "⬜"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── CSS Variables demo ─────────────────────────────── */
function CSSVariablesDemo() {
  const palettes = {
    ocean:    { name: "Ocean 🌊",    primary: "#58a6ff", bg: "#0d1117", surface: "#161b22", text: "#e6edf3", accent: "#3fb950" },
    sunset:   { name: "Sunset 🌅",   primary: "#f78166", bg: "#1a0e0e", surface: "#2b1515", text: "#f0ddd9", accent: "#e3b341" },
    forest:   { name: "Forest 🌿",   primary: "#3fb950", bg: "#0d1a0f", surface: "#111f13", text: "#d2f0d2", accent: "#61dafb" },
    lavender: { name: "Lavender 💜", primary: "#d2a8ff", bg: "#110d1a", surface: "#1b1228", text: "#ead9f5", accent: "#ff7b72" },
  };

  const [theme, setTheme] = useState("ocean");
  const p = palettes[theme];

  // React allows CSS custom property names as inline style keys — children
  // that reference var(--c-*) inherit them, giving a real live demo.
  const cssVars = {
    "--c-primary": p.primary,
    "--c-bg":      p.bg,
    "--c-surface": p.surface,
    "--c-text":    p.text,
    "--c-accent":  p.accent,
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {Object.entries(palettes).map(([key, val]) => (
          <button key={key} onClick={() => setTheme(key)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, transition: "all 0.25s", background: theme === key ? val.primary + "22" : C.surface, border: `2px solid ${theme === key ? val.primary : C.border2}`, color: theme === key ? val.primary : C.muted }}>
            {val.name}
          </button>
        ))}
      </div>

      <Row gap={14}>
        <Col style={{ flex: 1.2 }}>
          <div style={{ ...cssVars, background: "var(--c-bg)", border: `2px solid var(--c-primary)`, borderRadius: 12, padding: 20, transition: "all 0.4s ease", fontFamily: "monospace" }}>
            <div style={{ fontSize: 13, color: "var(--c-primary)", fontWeight: 800, marginBottom: 10 }}>Live Preview Card</div>
            <div style={{ fontSize: 12, color: "var(--c-text)", marginBottom: 14, lineHeight: 1.7 }}>
              These colors come from CSS variables — click any theme and <span style={{ color: "var(--c-accent)", fontWeight: 700 }}>everything updates instantly.</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1, background: "var(--c-surface)", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "var(--c-accent)", border: `1px solid var(--c-primary)` }}>
                --c-surface / --c-accent
              </div>
              <div style={{ flex: 1, background: "var(--c-primary)", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "var(--c-bg)", fontWeight: 700 }}>
                --c-primary
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--c-text)", opacity: 0.6 }}>No JS needed to update — just swap the variable values on <code>:root</code>.</div>
          </div>
        </Col>
        <Col>
          <Code fontSize={12}>{`:root {
  --c-primary: ${p.primary};
  --c-bg:      ${p.bg};
  --c-surface: ${p.surface};
  --c-text:    ${p.text};
  --c-accent:  ${p.accent};
}
/* Use anywhere — no import needed */
.card {
  background: var(--c-bg);
  color: var(--c-text);
  border: 2px solid var(--c-primary);
}
.badge {
  /* fallback if var is missing */
  color: var(--c-accent, #61dafb);
}`}</Code>
        </Col>
      </Row>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SLIDES
══════════════════════════════════════════════════════ */
const SLIDES = [
  // 0 — title
  {
    section: "Welcome", title: "React Beyond the Basics",
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto", paddingTop: 8 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: C.green, marginBottom: 28, letterSpacing: "0.06em" }}>
          {">"} npx create-vite@latest my-app<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>█</span>
        </div>
        <BigTitle>React Beyond the Basics:<br /><span style={{ color: C.teal }}>Infrastructure, Rendering & Deployment</span></BigTitle>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 24 }}>
          From <Hl color={C.red}>"it works on my machine"</Hl> → <Hl color={C.green}>production-grade app</Hl>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {["npm vs npx", "CSR vs SSR", "Vite vs Next.js", "CSS Variables", "Testing Pyramid", "Build Pipeline", "CI/CD"].map(t => (
            <Chip key={t} color={C.teal}>{t}</Chip>
          ))}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 28 }}>← → arrow keys to navigate</div>
      </div>
    ),
  },

  // 1 — roadmap (visual timeline, minimal text)
  {
    section: "Overview", title: "Session Roadmap",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <SlideTitle>90 minutes. 6 topics. <Hl color={C.teal}>All interactive.</Hl></SlideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["⚡", "npm vs npx",        "10 min", C.blue],
            ["🌐", "CSR vs SSR",        "15 min", C.purple],
            ["🔧", "Vite vs Next.js",   "15 min", C.teal],
            ["🎨", "CSS Variables",     "10 min", C.purple],
            ["🧪", "Testing Pyramid",   "20 min", C.yellow],
            ["📦", "Build Pipeline",    "15 min", C.orange],
            ["🚀", "Deploy & Security", "10 min", C.green],
            ["💻", "Live Coding",       "5 min",  C.red],
          ].map(([icon, phase, time, color], i) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontFamily: "monospace", fontSize: 14, color, fontWeight: 700, flex: 1 }}>{phase}</span>
              <Badge color={color}>{time}</Badge>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 2 — npm vs npx (interactive only)
  {
    section: "Entry Point", title: "npm vs npx",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle><Hl color={C.red}>npm install -g</Hl> vs <Hl color={C.green}>npx</Hl></SlideTitle>
        <NpmVsNpxDemo />
        <TeacherNote>Ask: "What happens if you installed create-react-app 6 months ago and your teammate installed it today?" Let them answer before clicking npx.</TeacherNote>
      </div>
    ),
  },

  // 3 — npm rule (one slide, one rule)
  {
    section: "Entry Point", title: "The Rule",
    render: () => (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>📏</div>
        <SlideTitle>One rule to remember</SlideTitle>
        <Card color={C.green} style={{ padding: "28px 32px", marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, marginBottom: 16 }}>
            <span style={{ color: C.red }}>npm install</span> → project dependencies (goes in package.json)
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>
            <span style={{ color: C.green }}>npx</span> → one-time tools (scaffolding, codegen, migrations)
          </div>
        </Card>
        <Code fontSize={13}>{`# ✅ Correct — project deps
npm install react react-dom
npm install --save-dev vitest

# ✅ Correct — one-time tools
npx create-vite@latest my-app
npx prisma migrate dev
npx shadcn-ui@latest add button`}</Code>
      </div>
    ),
  },

  // 4 — CSR vs SSR race (interactive)
  {
    section: "Rendering", title: "CSR vs SSR — Race",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Who shows content <Hl color={C.green}>faster?</Hl></SlideTitle>
        <RenderingRaceDemo />
        <Card style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>
            <Hl color={C.yellow}>Hydration:</Hl> SSR sends real HTML immediately. React then attaches event listeners to the existing DOM — no re-render needed.
          </div>
        </Card>
        <TeacherNote>After the demo: "You're building a university portal — public landing page AND a student dashboard. Which strategy for each?" Landing → SSR. Dashboard → CSR (behind auth, SEO irrelevant).</TeacherNote>
      </div>
    ),
  },

  // 5 — CSR vs SSR: when to use (visual grid, minimal text)
  {
    section: "Rendering", title: "When to Use Each",
    render: () => (
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <SlideTitle>Pick the strategy for <Hl color={C.purple}>your use case</Hl></SlideTitle>
        <Row gap={14}>
          {[
            { label: "CSR", color: C.blue, emoji: "⚛️", host: "CDN / S3", useFor: ["Dashboards", "Admin panels", "Apps behind auth", "Internal tools"], avoid: ["Public landing pages", "SEO-critical content", "Slow networks"] },
            { label: "SSR", color: C.green, emoji: "🖥", host: "Node.js server", useFor: ["Marketing sites", "E-commerce", "Blogs", "Any public page"], avoid: ["Simple SPAs", "Auth-only apps", "Static content only"] },
          ].map(({ label, color, emoji, host, useFor, avoid }) => (
            <Col key={label}>
              <Card color={color} style={{ padding: "20px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
                <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 20, color, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginBottom: 14 }}>Host: {host}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.green, marginBottom: 6 }}>USE FOR</div>
                {useFor.map((u, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 4 }}>✓ {u}</div>)}
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.red, margin: "10px 0 6px" }}>AVOID IF</div>
                {avoid.map((a, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 4 }}>✗ {a}</div>)}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    ),
  },

  // 6 — Vite vs Next.js (interactive)
  {
    section: "Tooling", title: "Vite vs Next.js",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle><Hl color={C.teal}>Build Tool</Hl> vs <Hl color={C.purple}>Full Framework</Hl></SlideTitle>
        <ViteVsNextDemo />
        <TeacherNote>Ask: "For a commercial project — when would you choose Vite+React over Next.js?" Key: when all pages are behind auth, or when the team needs full infra control.</TeacherNote>
      </div>
    ),
  },

  // 7 — Next.js routing (visual, minimal text)
  {
    section: "Tooling", title: "Next.js File-System Routing",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Folder = Route. <Hl color={C.purple}>No config needed.</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <Code fontSize={13}>{`app/
├── page.tsx          →  /
├── about/
│   └── page.tsx      →  /about
├── blog/
│   ├── page.tsx      →  /blog
│   └── [slug]/
│       └── page.tsx  →  /blog/:slug
└── api/
    └── tasks/
        └── route.ts  →  GET /api/tasks`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Per-page rendering strategy</div>
            <Code fontSize={13}>{`// SSR — fresh data every request
export const dynamic = 'force-dynamic';

// SSG — built once at deploy time
export const dynamic = 'force-static';

// ISR — rebuild every N seconds
export const revalidate = 60;`}</Code>
            <Card color={C.purple} style={{ marginTop: 12, padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>
                Mix strategies <Hl color={C.purple}>per page</Hl>. Landing page → SSG. Dashboard → SSR. Blog → ISR.
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 8 — CSS variables (interactive)
  {
    section: "Styling", title: "CSS Variables",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle>One value change. <Hl color={C.purple}>Everything updates.</Hl></SlideTitle>
        <CSSVariablesDemo />
        <Row gap={14} style={{ marginTop: 16 }}>
          <Col>
            <Card color={C.purple} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.purple, marginBottom: 6 }}>Dark / light toggle from JS</div>
              <Code fontSize={12}>{`// one line — no re-render needed
document.documentElement
  .style.setProperty(
    '--c-primary', '#f78166'
  );`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.yellow} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.yellow, marginBottom: 6 }}>vs Sass / preprocessors</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                Sass <code style={{ color: C.yellow }}>$vars</code> compile away at build time — they can't change at runtime. CSS custom properties live in the browser and respond to JS instantly.
              </div>
            </Card>
          </Col>
        </Row>
        <TeacherNote>Ask: "How would you implement a dark/light mode toggle using only CSS variables?" Answer: keep two sets of values and swap them by toggling a class on &lt;html&gt; — e.g. `html.dark {"{"} --c-bg: #000; {"}"}`.</TeacherNote>
      </div>
    ),
  },

  // 9 — testing pyramid (interactive)
  {
    section: "Testing", title: "The Testing Pyramid",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Click each layer → see a <Hl color={C.yellow}>real test</Hl></SlideTitle>
        <TestingPyramidDemo />
        <TeacherNote>Walk each test type slowly. Unit: no DOM, pure function. Component: getByRole tests accessibility too. E2E: doesn't know about React — it's just a user with a browser.</TeacherNote>
      </div>
    ),
  },

  // 9 — RTL philosophy (before/after, no prose)
  {
    section: "Testing", title: "Test Behaviour, Not Implementation",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle>Refactor internals → <Hl color={C.green}>tests still pass</Hl></SlideTitle>
        <Row gap={14}>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 10 }}>❌ Testing implementation</div>
              <Code fontSize={12}>{`// Breaks on any refactor
const btn = wrapper.find('.add-btn');
expect(component.state.tasks)
  .toHaveLength(1);`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 10 }}>✅ Testing behaviour</div>
              <Code fontSize={12}>{`// Survives any refactor
await user.type(
  screen.getByRole('textbox'), 'Buy milk');
await user.click(
  screen.getByRole('button', { name: /add/i }));
expect(screen.getByText('Buy milk'))
  .toBeInTheDocument();`}</Code>
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>
            <Hl color={C.blue}>RTL rule:</Hl> Query by <Hl color={C.text}>role, label, or text</Hl> — the same things a screen reader uses. If your test can't find it, neither can a screen reader.
          </div>
        </Card>
      </div>
    ),
  },

  // 10 — vitest setup (concise)
  {
    section: "Testing", title: "Vitest Setup in 3 Steps",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Zero config. <Hl color={C.teal}>Reuses your Vite setup.</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, marginBottom: 6 }}>① Install</div>
            <Code fontSize={12}>{`npm install --save-dev \\
  vitest \\
  @testing-library/react \\
  @testing-library/jest-dom \\
  jsdom`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, margin: "14px 0 6px" }}>② vite.config.ts</div>
            <Code fontSize={12}>{`export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, marginBottom: 6 }}>③ setup.ts + scripts</div>
            <Code fontSize={12}>{`// src/test/setup.ts
import '@testing-library/jest-dom';`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, margin: "14px 0 6px" }}>package.json</div>
            <Code fontSize={12}>{`"scripts": {
  "test":     "vitest",
  "test:ui":  "vitest --ui",
  "coverage": "vitest run --coverage"
}`}</Code>
            <Card color={C.green} style={{ marginTop: 12, padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>
                <span style={{ color: C.green }}>npm test</span> → watch mode<br />
                <span style={{ color: C.green }}>npm run coverage</span> → % report
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 11 — build pipeline (interactive)
  {
    section: "Build Pipeline", title: "npm run build",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle>Click each step → see <Hl color={C.orange}>what changes</Hl></SlideTitle>
        <BuildPipelineDemo />
        <Row gap={14} style={{ marginTop: 16 }}>
          <Col>
            <Card color={C.teal} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.teal, marginBottom: 6 }}>dist/ output</div>
              <Code fontSize={12}>{`dist/
├── index.html
└── assets/
    ├── index-a3f9c12.js  # hashed
    └── index-b7e2d45.css # hashed`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.yellow} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.yellow, marginBottom: 8 }}>Typical sizes</div>
              {[["Source", "~2.4 MB"], ["Minified", "~420 KB"], ["Gzipped", "~140 KB"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>
                  <span>{k}</span><span style={{ color: C.yellow }}>{v}</span>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
        <TeacherNote>Run `npm run build` live. Show dist/. Open index.html — nearly empty. Open the .js — unreadable by design. Ask: "Why don't we deploy source code?"</TeacherNote>
      </div>
    ),
  },

  // 12 — code splitting (concise + visual)
  {
    section: "Build Pipeline", title: "Code Splitting",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Users download only the pages <Hl color={C.orange}>they visit</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <Card color={C.red} style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 8 }}>❌ One giant bundle</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>User visits <code>/home</code> → downloads code for <em>every</em> page. Slow initial load.</div>
            </Card>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 8 }}>✅ Split by route</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>User visits <code>/home</code> → downloads only home code. Other chunks load on demand.</div>
            </Card>
          </Col>
          <Col>
            <Code fontSize={12}>{`import { lazy, Suspense } from 'react';

// Each page = separate JS chunk
const Dashboard = lazy(
  () => import('./pages/Dashboard'));
const Settings = lazy(
  () => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard"
          element={<Dashboard />} />
        <Route path="/settings"
          element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`}</Code>
          </Col>
        </Row>
      </div>
    ),
  },

  // 13 — deployment (visual cards, minimal text)
  {
    section: "Deployment", title: "Hosting Options",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>Pick your <Hl color={C.green}>hosting tier</Hl></SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[
            { name: "Vercel", emoji: "▲", color: C.text, tag: "Best for Next.js", cmd: "npx vercel deploy", pros: ["Git push → live", "Preview per PR", "Edge network"] },
            { name: "Netlify", emoji: "🌐", color: C.teal, tag: "Best for Vite SPAs", cmd: "netlify deploy --dir=dist", pros: ["Drag & drop dist/", "Generous free tier", "Branch deploys"] },
            { name: "AWS S3", emoji: "☁️", color: C.yellow, tag: "Enterprise scale", cmd: "aws s3 sync dist/ s3://bucket", pros: ["Lowest cost at scale", "Full control", "CI/CD integration"] },
          ].map(({ name, emoji, color, tag, cmd, pros }) => (
            <Card key={name} color={color} style={{ padding: "16px" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 15, color, marginBottom: 4 }}>{name}</div>
              <Chip color={color}>{tag}</Chip>
              <div style={{ marginTop: 10 }}>
                {pros.map((p, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, marginBottom: 4 }}>✓ {p}</div>)}
              </div>
              <div style={{ marginTop: 10 }}>
                <Code fontSize={10}>{cmd}</Code>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>
            <Hl color={C.yellow}>Rule:</Hl> Personal / startup → Vercel. Client needing custom infra → AWS. The <code>dist/</code> folder is provider-agnostic — you can switch anytime.
          </div>
        </Card>
      </div>
    ),
  },

  // 14 — env vars (before/after, no prose)
  {
    section: "Deployment", title: "Secrets & .env",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <SlideTitle>API keys belong in <Hl color={C.red}>.env</Hl> — never in <Hl color={C.red}>Git</Hl></SlideTitle>
        <Row gap={14} style={{ marginBottom: 14 }}>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 8 }}>❌ Leaked key</div>
              <Code fontSize={12}>{`// App.jsx
const API_KEY = 'sk-prod-a1b2c3...';
// Now in Git history forever.
// Anyone can view-source and steal it.`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 8 }}>✅ Correct</div>
              <Code fontSize={12}>{`// .env.local (never committed)
VITE_API_URL=https://api.example.com

// App.jsx
const url = import.meta.env.VITE_API_URL;`}</Code>
            </Card>
          </Col>
        </Row>
        <Row gap={14}>
          <Col>
            <Code fontSize={12}>{`# .gitignore — must include:
.env.local
.env.*.local
.env.production`}</Code>
          </Col>
          <Col>
            <Card color={C.yellow} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>
                <div style={{ color: C.yellow, fontWeight: 700, marginBottom: 6 }}>VITE_ prefix rule</div>
                Variables <em>without</em> <code>VITE_</code> are stripped from the bundle.<br /><br />
                <span style={{ color: C.red }}>Never put private secrets in VITE_ vars</span> — they end up in the JS bundle.
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 15 — CI/CD (animated pipeline)
  {
    section: "Deployment", title: "CI/CD Pipeline",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle>Automate everything. <Hl color={C.green}>Ship with confidence.</Hl></SlideTitle>
        <CIPipelineDemo />
        <div style={{ marginTop: 16 }}>
          <Code fontSize={12}>{`# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build`}</Code>
        </div>
      </div>
    ),
  },

  // 16 — live coding
  {
    section: "Live Coding", title: "Live Coding",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SlideTitle><Hl color={C.teal}>Init → Test → Build</Hl> — one terminal session</SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, marginBottom: 6, fontWeight: 700 }}>① Scaffold</div>
            <Code fontSize={12}>{`npx create-vite@latest task-app \\
  --template react-ts
cd task-app && npm install && npm run dev`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.yellow, margin: "12px 0 6px", fontWeight: 700 }}>② Add Vitest</div>
            <Code fontSize={12}>{`npm install --save-dev vitest \\
  @testing-library/react \\
  @testing-library/jest-dom jsdom`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.green, margin: "12px 0 6px", fontWeight: 700 }}>③ Write + run a test</div>
            <Code fontSize={12}>{`// src/utils/tasks.test.ts
it('filters done tasks', () => {
  const result = filterDone([
    { id: 1, done: true },
    { id: 2, done: false },
  ]);
  expect(result).toHaveLength(1);
});
// npm test → ✅`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.red, marginBottom: 6, fontWeight: 700 }}>④ Watch it fail</div>
            <Code fontSize={12}>{`// Break it intentionally:
export const filterDone = (tasks) =>
  tasks.filter(t => !t.done); // ← wrong!
// Vitest → ✗ red immediately
// Fix → ✅ green. This is TDD.`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.orange, margin: "12px 0 6px", fontWeight: 700 }}>⑤ Build</div>
            <Code fontSize={12}>{`npm run build
# ✓ built in 1.24s
# dist/assets/index-a3f.js  142 kB
# dist/assets/index-a3f.css   4 kB`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.purple, margin: "12px 0 6px", fontWeight: 700 }}>⑥ Deploy</div>
            <Code fontSize={12}>{`npx vercel deploy --prebuilt
# → https://task-app-abc.vercel.app ✅`}</Code>
          </Col>
        </Row>
        <TeacherNote>Keep terminal and browser side-by-side. The emotional payoff of seeing their code on a real URL matters — don't skip the deploy step.</TeacherNote>
      </div>
    ),
  },

  // 17 — senior checklist (interactive)
  {
    section: "Summary", title: "Before You Ship",
    live: true,
    render: () => (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <SlideTitle>The senior engineer <Hl color={C.green}>checklist</Hl></SlideTitle>
        <SeniorChecklist />
      </div>
    ),
  },

  // 18 — what's next
  {
    section: "Next Steps", title: "What to Explore Next",
    render: () => (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
        <BigTitle>You now think like a <Hl color={C.teal}>software architect</Hl></BigTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left", margin: "20px 0" }}>
          {[
            ["📡", "React Query", "Server-state, caching, background refetch"],
            ["🔐", "NextAuth.js", "Auth patterns for Next.js"],
            ["🐋", "Docker", "Package app + environment together"],
            ["📊", "Lighthouse CI", "Automate perf audits in CI"],
            ["🧪", "Playwright E2E", "Full browser automation"],
            ["📈", "Sentry", "Real-time production error alerts"],
          ].map(([icon, title, desc]) => (
            <Card key={title} style={{ padding: "14px" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: C.blue, marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>{desc}</div>
            </Card>
          ))}
        </div>
        <Code fontSize={12}>{`# Assignment: take any past project and
# 1. Add Vitest unit tests
# 2. npm run build — fix any errors
# 3. Deploy to Vercel — share the URL`}</Code>
      </div>
    ),
  },
];

/* ── shell ───────────────────────────────────────────── */
export default function ReactBeyondBasics() {
  const [cur, setCur] = useState(0);
  const [anim, setAnim] = useState(null);

  const go = useCallback((d) => {
    const n = cur + d;
    if (n < 0 || n >= SLIDES.length) return;
    setAnim(d > 0 ? "out-left" : "out-right");
    setTimeout(() => { setCur(n); setAnim("in"); setTimeout(() => setAnim(null), 250); }, 180);
  }, [cur]);

  const jump = useCallback((i) => {
    if (i === cur) return;
    setAnim(i > cur ? "out-left" : "out-right");
    setTimeout(() => { setCur(i); setAnim("in"); setTimeout(() => setAnim(null), 250); }, 180);
  }, [cur]);

  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  const slide = SLIDES[cur];
  const pct = (cur / (SLIDES.length - 1)) * 100;

  const sectionColors = {
    "Welcome": C.teal, "Overview": C.blue, "Entry Point": C.blue,
    "Rendering": C.purple, "Tooling": C.teal, "Styling": C.purple,
    "Testing": C.yellow, "Build Pipeline": C.orange, "Deployment": C.green,
    "Live Coding": C.teal, "Summary": C.green, "Next Steps": C.blue,
  };
  const sectionColor = sectionColors[slide.section] || C.blue;

  const animStyle = ({
    "out-left":  { opacity: 0, transform: "translateX(-30px)", transition: "all 0.18s ease" },
    "out-right": { opacity: 0, transform: "translateX(30px)",  transition: "all 0.18s ease" },
    "in":        { opacity: 0, transform: "translateY(10px)" },
  })[anim] || { opacity: 1, transform: "none", transition: "all 0.22s ease" };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border2}; border-radius: 2px; }
      `}</style>

      {/* top bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "9px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "monospace", fontSize: 11, color: C.dim }}>
          <span>ReactBeyondBasics.jsx</span>
          {slide.live && <span style={{ color: C.green, display: "flex", alignItems: "center", gap: 4 }}><LiveDot />interactive</span>}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>{cur + 1} / {SLIDES.length}</div>
      </div>

      {/* minimap */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "5px 20px", display: "flex", alignItems: "center", gap: 5, overflowX: "auto" }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: sectionColor, whiteSpace: "nowrap", marginRight: 6 }}>{slide.section}</span>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => jump(i)} title={s.title}
            style={{ width: i === cur ? 16 : 6, height: 6, borderRadius: 3, background: i === cur ? sectionColor : i < cur ? C.green + "88" : C.border, border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "all 0.25s" }} />
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "monospace", fontSize: 9, color: C.dim, whiteSpace: "nowrap" }}>← → keys</span>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "28px 36px", width: "100%", maxWidth: 1020, margin: "0 auto", ...animStyle }}>
          {slide.render()}
        </div>
      </div>

      {/* nav */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "9px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={() => go(-1)} disabled={cur === 0}
          style={{ fontFamily: "monospace", fontSize: 11, padding: "5px 16px", background: cur === 0 ? "transparent" : C.border, border: `1px solid ${cur === 0 ? C.border : C.border2}`, borderRadius: 6, color: cur === 0 ? C.dim : C.text, cursor: cur === 0 ? "default" : "pointer" }}>
          ← prev
        </button>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sectionColor, transition: "width 0.35s ease" }} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: C.muted, maxWidth: 200, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slide.title}</span>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sectionColor, transition: "width 0.35s ease" }} />
        </div>
        <button onClick={() => go(1)} disabled={cur === SLIDES.length - 1}
          style={{ fontFamily: "monospace", fontSize: 11, padding: "5px 16px", background: cur === SLIDES.length - 1 ? "transparent" : C.border, border: `1px solid ${cur === SLIDES.length - 1 ? C.border : C.border2}`, borderRadius: 6, color: cur === SLIDES.length - 1 ? C.dim : C.text, cursor: cur === SLIDES.length - 1 ? "default" : "pointer" }}>
          next →
        </button>
      </div>
    </div>
  );
}