import { useState, useEffect, useCallback } from "react";

/* ── palette ─────────────────────────────────────────── */
const C = {
  bg: "#0d1117", surface: "#161b22", border: "#21262d",
  border2: "#30363d", text: "#e6edf3", muted: "#8b949e",
  dim: "#484f58", blue: "#58a6ff", green: "#3fb950",
  purple: "#d2a8ff", red: "#ff7b72", yellow: "#e3b341",
  teal: "#61dafb", orange: "#f78166", cyan: "#39d353",
};

/* ── syntax highlighter ──────────────────────────────── */
function Code({ children, fontSize = 14 }) {
  const lines = children.trim().split("\n");
  return (
    <pre style={{
      background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 10,
      padding: "18px 24px", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize, lineHeight: 1.85, overflowX: "auto", margin: 0,
      textAlign: "left", color: C.text,
    }}>
      {lines.map((line, i) => <div key={i}>{hl(line)}</div>)}
    </pre>
  );
}
function hl(line) {
  const rules = [
    { re: /(#.*$)/, c: C.dim },
    { re: /(\/\/.*$)/, c: C.dim },
    { re: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, c: "#a5d6ff" },
    { re: /\b(import|export|default|from|return|const|let|var|function|if|else|async|await|true|false|null|undefined)\b/, c: C.red },
    { re: /\b(describe|it|test|expect|vi|beforeEach|afterEach|render|screen|fireEvent|getByText|getByRole|page)\b/, c: C.yellow },
    { re: /\b(useState|useEffect|useCallback|useRef|React)\b/, c: C.purple },
    { re: /(<\/?[A-Z][A-Za-z0-9]*)/, c: "#79c0ff" },
    { re: /(<\/?[a-z][a-z0-9]*)/, c: C.green },
    { re: /\b(\d+)\b/, c: "#f8c8a0" },
  ];
  let rem = line, res = [], k = 0;
  while (rem.length > 0) {
    let matched = false;
    for (const { re, c } of rules) {
      const m = rem.match(new RegExp("^((?:(?!" + re.source + ")[\\s\\S])*?)" + re.source));
      if (m && m[2] !== undefined) {
        if (m[1]) res.push(<span key={k++}>{m[1]}</span>);
        res.push(<span key={k++} style={{ color: c }}>{m[2]}</span>);
        rem = rem.slice(m[1].length + m[2].length);
        matched = true; break;
      }
    }
    if (!matched) { res.push(<span key={k++}>{rem}</span>); rem = ""; }
  }
  return res;
}

/* ── atoms ───────────────────────────────────────────── */
const Label = ({ children, color = C.blue }) => (
  <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
);
const LiveDot = () => (
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
);
const BigTitle = ({ children }) => (
  <h1 style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: "clamp(26px, 4vw, 52px)", fontWeight: 800, color: C.text, margin: "0 0 18px", lineHeight: 1.1 }}>{children}</h1>
);
const SlideTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: "clamp(18px, 2.8vw, 36px)", fontWeight: 800, color: C.text, margin: "0 0 20px", lineHeight: 1.15 }}>{children}</h2>
);
const Body = ({ children }) => (
  <p style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, lineHeight: 1.85, margin: "0 0 10px" }}>{children}</p>
);
const Hl = ({ children, color = C.blue }) => <span style={{ color, fontWeight: 600 }}>{children}</span>;
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
const TeacherNote = ({ children }) => (
  <div style={{ background: "#e3b34110", border: `1px solid ${C.yellow}44`, borderLeft: `3px solid ${C.yellow}`, borderRadius: 8, padding: "11px 16px", marginTop: 18 }}>
    <div style={{ fontFamily: "monospace", fontSize: 10, color: C.yellow, letterSpacing: "0.1em", marginBottom: 5 }}>📋 TEACHER NOTE</div>
    <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{children}</div>
  </div>
);
const Tag = ({ children, color = C.blue }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 8 }}>
    <span style={{ color, fontFamily: "monospace", fontSize: 13, flexShrink: 0 }}>→</span>
    <span style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{children}</span>
  </div>
);
const Badge = ({ children, color = C.blue }) => (
  <span style={{ background: color + "22", border: `1px solid ${color}55`, borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 11, color, fontWeight: 700 }}>{children}</span>
);

/* ── interactive demos ───────────────────────────────── */

function NpmVsNpxDemo() {
  const [active, setActive] = useState(null);
  const items = [
    {
      key: "npm", label: "npm install -g create-react-app", color: C.red,
      title: "npm — installs globally to your machine",
      points: [
        "Downloads the package to your global node_modules once",
        "Version is frozen at install time — gets stale over months",
        "Running 'create-react-app' uses that old cached version",
        "Different machines → different versions → inconsistent projects",
        "Pollutes global scope with packages you rarely use",
      ],
    },
    {
      key: "npx", label: "npx create-vite@latest my-app", color: C.green,
      title: "npx — downloads & runs the latest version, then discards",
      points: [
        "Always fetches the latest published version at run time",
        "No global installation — nothing persists after the command",
        "Every developer on the team gets the exact same scaffolder",
        "Safe: can't break existing global tools",
        "Industry standard for all modern scaffolding: Vite, Next.js, CRA",
      ],
    },
  ];
  return (
    <div>
      <Row gap={12} style={{ marginBottom: 16 }}>
        {items.map(item => (
          <Col key={item.key}>
            <button onClick={() => setActive(active === item.key ? null : item.key)}
              style={{ width: "100%", background: active === item.key ? item.color + "18" : C.surface, border: `1px solid ${active === item.key ? item.color : C.border2}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: "monospace", fontSize: 12, color: item.color, textAlign: "left" }}>
              <span style={{ fontWeight: 700 }}>{item.key.toUpperCase()}</span><br />
              <span style={{ color: C.dim, fontSize: 11 }}>{item.label}</span>
            </button>
          </Col>
        ))}
      </Row>
      {active && (() => {
        const item = items.find(i => i.key === active);
        return (
          <Card color={item.color}>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: item.color, marginBottom: 10, fontSize: 13 }}>{item.title}</div>
            {item.points.map((p, i) => <Tag key={i} color={item.color}>{p}</Tag>)}
          </Card>
        );
      })()}
      {!active && <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "20px 0" }}>Click a button to compare</div>}
    </div>
  );
}

function RenderingStrategyDemo() {
  const [mode, setMode] = useState("csr");
  const strategies = {
    csr: {
      label: "CSR — Client-Side Rendering", color: C.blue,
      steps: [
        { step: "1. Browser requests /", result: "Server returns tiny index.html + JS bundle", icon: "🌐" },
        { step: "2. JS downloads & parses", result: "User sees blank screen or spinner (FCP delayed)", icon: "⏳" },
        { step: "3. React executes", result: "Virtual DOM built, component tree rendered", icon: "⚛" },
        { step: "4. Page is visible", result: "Full interactivity — React event handlers attached", icon: "✅" },
      ],
      pros: ["Best for dashboards & apps behind auth (SEO irrelevant)", "Instant navigation after initial load (SPA feel)", "Simple to deploy — just static files on S3/CDN"],
      cons: ["Slow First Contentful Paint — empty HTML on first load", "Googlebot may miss dynamic content (SEO penalty)", "Large JS bundles block rendering on slow connections"],
    },
    ssr: {
      label: "SSR — Server-Side Rendering", color: C.green,
      steps: [
        { step: "1. Browser requests /", result: "Server runs React and renders full HTML", icon: "🖥" },
        { step: "2. Fully rendered HTML arrives", result: "User sees real content immediately (fast FMP)", icon: "⚡" },
        { step: "3. JS bundle downloads", result: "Browser parses the React bundle in background", icon: "📦" },
        { step: "4. Hydration", result: "React attaches event listeners — page becomes interactive", icon: "💧" },
      ],
      pros: ["Fast First Meaningful Paint — real HTML arrives immediately", "Googlebot indexes actual content → SEO wins", "Better perceived performance on slow networks"],
      cons: ["Server must run Node.js — more complex infrastructure", "Hydration mismatch bugs can be tricky to debug", "Higher server costs vs. pure static hosting"],
    },
  };
  const s = strategies[mode];
  return (
    <div>
      <Row gap={10} style={{ marginBottom: 16 }}>
        {Object.entries(strategies).map(([key, val]) => (
          <button key={key} onClick={() => setMode(key)}
            style={{ flex: 1, background: mode === key ? val.color + "18" : C.surface, border: `1px solid ${mode === key ? val.color : C.border2}`, borderRadius: 8, padding: "8px", cursor: "pointer", fontFamily: "monospace", fontSize: 12, color: mode === key ? val.color : C.muted, fontWeight: mode === key ? 700 : 400 }}>
            {val.label}
          </button>
        ))}
      </Row>
      <div style={{ marginBottom: 14 }}>
        {s.steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8, padding: "8px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{step.icon}</span>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: s.color, fontWeight: 700 }}>{step.step}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>{step.result}</div>
            </div>
          </div>
        ))}
      </div>
      <Row gap={12}>
        <Col>
          <Card color={C.green} style={{ padding: "12px 14px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.green, marginBottom: 8 }}>PROS</div>
            {s.pros.map((p, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>+ {p}</div>)}
          </Card>
        </Col>
        <Col>
          <Card color={C.red} style={{ padding: "12px 14px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.red, marginBottom: 8 }}>CONS</div>
            {s.cons.map((c, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>− {c}</div>)}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function TestingPyramidDemo() {
  const [active, setActive] = useState(null);
  const layers = [
    {
      key: "e2e", label: "E2E Tests", tool: "Playwright / Cypress", color: C.red,
      count: "Few", speed: "Slow (seconds)", cost: "High",
      desc: "Simulate a real user in a real browser. Full stack — frontend, backend, DB.",
      example: `// playwright — e2e/tracker.spec.ts
test('user can add and complete a task', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByLabel('New task').fill('Write tests');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByText('Write tests').click();
  await expect(page.getByText('Done (1)')).toBeVisible();
});`,
    },
    {
      key: "component", label: "Component Tests", tool: "React Testing Library", color: C.yellow,
      count: "Some", speed: "Fast (ms)", cost: "Medium",
      desc: "Mount a component in a JSDOM environment. Test user-visible behaviour, not implementation.",
      example: `// TaskInput.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import TaskInput from './TaskInput';

test('calls onAdd with trimmed text on Enter', () => {
  const onAdd = vi.fn();
  render(<TaskInput onAdd={onAdd} />);

  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: '  Buy milk  ' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(onAdd).toHaveBeenCalledWith('Buy milk');
});`,
    },
    {
      key: "unit", label: "Unit Tests", tool: "Vitest / Jest", color: C.green,
      count: "Many", speed: "Instant (μs)", cost: "Low",
      desc: "Test a single function in isolation. No DOM, no React. Pure input → output.",
      example: `// utils/tasks.test.js
import { describe, it, expect } from 'vitest';
import { filterByStatus, sortByDate } from './tasks';

describe('filterByStatus', () => {
  it('returns only incomplete tasks', () => {
    const tasks = [
      { id: 1, text: 'A', done: false },
      { id: 2, text: 'B', done: true },
    ];
    expect(filterByStatus(tasks, false)).toHaveLength(1);
    expect(filterByStatus(tasks, false)[0].id).toBe(1);
  });
});`,
    },
  ];

  return (
    <div>
      {/* pyramid visual */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 18 }}>
        {layers.map((layer, i) => (
          <button key={layer.key} onClick={() => setActive(active === layer.key ? null : layer.key)}
            style={{
              width: `${40 + i * 28}%`, padding: "10px 16px", borderRadius: 8,
              background: active === layer.key ? layer.color + "28" : layer.color + "14",
              border: `1px solid ${active === layer.key ? layer.color : layer.color + "55"}`,
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: layer.color, fontWeight: 700 }}>{layer.label}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge color={layer.color}>{layer.tool}</Badge>
              <Badge color={C.dim}>{layer.count}</Badge>
              <Badge color={C.dim}>{layer.speed}</Badge>
            </div>
          </button>
        ))}
      </div>
      {active && (() => {
        const layer = layers.find(l => l.key === active);
        return (
          <Card color={layer.color}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 10 }}>{layer.desc}</div>
            <Code fontSize={12}>{layer.example}</Code>
          </Card>
        );
      })()}
      {!active && <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "8px 0" }}>Click a layer to see an example test</div>}
    </div>
  );
}

function BuildPipelineDemo() {
  const [step, setStep] = useState(-1);
  const steps = [
    { label: "Source code", icon: "📝", color: C.blue, detail: "Your JSX, TypeScript, CSS modules — human-readable, development-friendly source files." },
    { label: "Bundling", icon: "📦", color: C.purple, detail: "Vite (powered by Rollup) traces every import and combines all modules into a small number of output files." },
    { label: "Tree-shaking", icon: "🌳", color: C.green, detail: "Dead code elimination. Functions you imported but never called are removed from the bundle entirely." },
    { label: "Minification", icon: "🗜", color: C.yellow, detail: "Variable names shortened, whitespace stripped, comments removed. 'myLongVariableName' → 'a'. Reduces bundle size 60–80%." },
    { label: "Hashed filenames", icon: "🔑", color: C.orange, detail: "Output files get a content hash: main.a3f9c12.js. Change one byte → new hash → CDN cache bust automatically." },
    { label: "dist/ output", icon: "🚀", color: C.teal, detail: "Static assets ready to upload to any CDN or hosting provider. No Node.js required to serve them." },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16, overflowX: "auto", padding: "4px 0" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setStep(step === i ? -1 : i)}
              style={{ background: step === i ? s.color + "22" : C.surface, border: `1px solid ${step === i ? s.color : C.border2}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: step === i ? s.color : C.muted, marginTop: 4 }}>{s.label}</div>
            </button>
            {i < steps.length - 1 && <div style={{ fontFamily: "monospace", color: C.dim, padding: "0 4px", fontSize: 14 }}>→</div>}
          </div>
        ))}
      </div>
      {step >= 0 ? (
        <Card color={steps[step].color}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted }}>{steps[step].detail}</div>
        </Card>
      ) : (
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, textAlign: "center", padding: "10px 0" }}>Click a step to learn what happens</div>
      )}
    </div>
  );
}

/* ── slides ─────────────────────────────────────────── */
const SLIDES = [
  // 0 — title
  {
    section: "Welcome", title: "React Beyond the Basics",
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto", paddingTop: 16 }}>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, marginBottom: 24, letterSpacing: "0.06em" }}>
          {">"} npx create-vite@latest my-app -- --template react<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>█</span>
        </div>
        <BigTitle>React Beyond the Basics:<br /><span style={{ color: C.teal }}>Infrastructure, Rendering & Deployment</span></BigTitle>
        <Body>From "it works on my machine" to a production-grade, tested, deployed React application.</Body>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          {["npm vs npx", "CSR vs SSR", "Vite vs Next.js", "Testing Pyramid", "Build Pipeline", "CI/CD & Deployment"].map(t => <Chip key={t} color={C.teal}>{t}</Chip>)}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 24 }}>← → arrow keys to navigate</div>
      </div>
    ),
  },

  // 1 — roadmap
  {
    section: "Overview", title: "Session Roadmap",
    render: () => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Label>90-minute plan</Label>
        <SlideTitle>Shifting from "how to code" to <Hl color={C.teal}>"how to ship"</Hl></SlideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            ["The Modern Entry Point", "npm vs npx — why version control matters", "10 min", C.blue],
            ["Rendering Strategies", "CSR, SSR — trade-offs and when to use each", "15 min", C.purple],
            ["Tooling Battle", "Vite vs Next.js — build tool vs full framework", "15 min", C.teal],
            ["The Testing Pyramid", "Unit → Component → E2E with real code", "20 min", C.yellow],
            ["The Production Pipeline", "npm run build: bundling, tree-shaking, minification", "15 min", C.orange],
            ["Deployment & Security", "Hosting options + .env secrets management", "10 min", C.green],
            ["Live Coding", "Init → Test → Build, all in one terminal session", "5 min", C.red],
          ].map(([phase, desc, time, color], i) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, color, minWidth: 160, fontWeight: 700 }}>{phase}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, flex: 1 }}>{desc}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 2 — npm vs npx concept
  {
    section: "Entry Point", title: "npm vs npx",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.blue}>The Modern Entry Point</Label>
        <SlideTitle>Two commands. Very different <Hl color={C.blue}>behaviors.</Hl></SlideTitle>
        <Row gap={16} style={{ marginBottom: 18 }}>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 15, color: C.red, marginBottom: 10 }}>npm</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
                <div><Hl color={C.text}>Node Package Manager</Hl></div>
                <div style={{ marginTop: 8 }}>Installs packages <Hl color={C.yellow}>into your project</Hl> or globally onto your machine.</div>
                <div style={{ marginTop: 8 }}>Global install persists. Gets stale. Different developers → different versions.</div>
              </div>
              <Code fontSize={12}>{`# Global install (avoid for scaffolding)
npm install -g create-react-app

# Later — now stuck on this version forever:
create-react-app my-app  # may be outdated`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 15, color: C.green, marginBottom: 10 }}>npx</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
                <div><Hl color={C.text}>Node Package eXecute</Hl></div>
                <div style={{ marginTop: 8 }}>Downloads the package, runs it, <Hl color={C.yellow}>then discards it.</Hl> Always fetches latest.</div>
                <div style={{ marginTop: 8 }}>No global pollution. Team-wide consistency. Zero version drift.</div>
              </div>
              <Code fontSize={12}>{`# Always uses the latest published version
npx create-vite@latest my-app
npx create-next-app@latest my-next-app

# Pinning a version is also explicit:
npx create-vite@5.2.0 my-app`}</Code>
            </Card>
          </Col>
        </Row>
        <Card>
          <Body><Hl color={C.yellow}>Industry rule:</Hl> Never <code style={{ fontFamily: "monospace", color: C.red }}>npm install -g</code> a scaffolding tool. Always <code style={{ fontFamily: "monospace", color: C.green }}>npx</code>. The "x" stands for execute — download, run, discard.</Body>
        </Card>
        <TeacherNote>Ask the class: "What happens if you installed create-react-app 6 months ago and your teammate installed it today?" This makes the version-drift problem concrete before the demo.</TeacherNote>
      </div>
    ),
  },

  // 3 — npm vs npx interactive
  {
    section: "Entry Point", title: "npm vs npx — interactive comparison",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Interactive</Label>
        <SlideTitle>Click to explore the <Hl color={C.green}>difference in practice</Hl></SlideTitle>
        <NpmVsNpxDemo />
        <Card style={{ marginTop: 16 }}>
          <Row gap={20}>
            <Col>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Project dependencies — npm install IS correct here:</div>
              <Code fontSize={12}>{`# These go in package.json — correct use of npm
npm install react react-dom
npm install --save-dev vitest
npm install @tanstack/react-query`}</Code>
            </Col>
            <Col>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>One-time tools — npx is the right choice:</div>
              <Code fontSize={12}>{`# Scaffolding, codegen, migrations — use npx
npx create-vite@latest
npx prisma migrate dev
npx shadcn-ui@latest add button`}</Code>
            </Col>
          </Row>
        </Card>
      </div>
    ),
  },

  // 4 — CSR vs SSR concept
  {
    section: "Rendering", title: "Rendering Strategies",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.purple}>Architecture decision</Label>
        <SlideTitle>How your HTML reaches the user — and <Hl color={C.purple}>when it matters</Hl></SlideTitle>
        <Body>The rendering strategy determines: who builds the HTML, when, and on which machine. This affects SEO, performance, and infrastructure cost.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {[
            { label: "CSR", full: "Client-Side Rendering", color: C.blue, who: "Browser", when: "On every visit", infra: "Static file server / CDN", usecase: "Dashboards, admin panels, apps behind auth" },
            { label: "SSR", full: "Server-Side Rendering", color: C.green, who: "Server (Node.js)", when: "On every request", infra: "Node.js server (Vercel, Railway)", usecase: "Public pages, e-commerce, blogs, landing pages" },
          ].map(({ label, full, color, who, when, infra, usecase }) => (
            <Card key={label} color={color} style={{ padding: "18px 20px" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 22, color, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 12 }}>{full}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[["Who renders?", who], ["When?", when], ["Infrastructure", infra], ["Best for", usecase]].map(([k, v]) => (
                  <div key={k} style={{ fontFamily: "monospace", fontSize: 12 }}>
                    <span style={{ color: C.dim }}>{k}: </span><span style={{ color: C.muted }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <Body><Hl color={C.yellow}>The core trade-off:</Hl> CSR is simpler to host but hurts SEO and shows an empty page first. SSR solves both — at the cost of a server and hydration complexity.</Body>
        </Card>
      </div>
    ),
  },

  // 5 — CSR vs SSR interactive
  {
    section: "Rendering", title: "CSR vs SSR — step by step",
    live: true,
    render: () => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Label color={C.purple}><LiveDot /> Interactive</Label>
        <SlideTitle>Trace the request lifecycle for each strategy</SlideTitle>
        <RenderingStrategyDemo />
        <TeacherNote>After the demo, ask: "You're building the university course portal — public landing page AND a student dashboard. Which strategy for each, and why?" Let students debate before revealing: landing page → SSR, dashboard → CSR (or SSG for the landing).</TeacherNote>
      </div>
    ),
  },

  // 6 — SSR: First Meaningful Paint
  {
    section: "Rendering", title: "The First Meaningful Paint Problem",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.purple}>Deep dive — SSR</Label>
        <SlideTitle>Why the <Hl color={C.red}>blank screen</Hl> kills conversion rates</SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>CSR timeline on a 3G connection</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.4 }}>
              {[
                ["0ms", "Request sent", C.muted],
                ["400ms", "index.html arrives (3KB, empty)", C.blue],
                ["400ms", "User sees: blank white screen 😶", C.red],
                ["1800ms", "React bundle downloads (200KB)", C.yellow],
                ["2100ms", "JS parses & React executes", C.orange],
                ["2200ms", "User finally sees content ✅", C.green],
              ].map(([t, label, color]) => (
                <div key={t} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: C.dim, minWidth: 55 }}>{t}</span>
                  <span style={{ color }}>→ {label}</span>
                </div>
              ))}
            </div>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>SSR timeline on the same connection</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.4 }}>
              {[
                ["0ms", "Request sent", C.muted],
                ["450ms", "Full HTML arrives from server", C.green],
                ["450ms", "User sees real content ✅", C.green],
                ["1800ms", "React bundle downloads", C.yellow],
                ["2100ms", "Hydration — page interactive ✅", C.teal],
              ].map(([t, label, color]) => (
                <div key={t} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: C.dim, minWidth: 55 }}>{t}</span>
                  <span style={{ color }}>→ {label}</span>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.yellow}>Hydration:</Hl> SSR sends real HTML the browser renders immediately. React then "hydrates" it — attaches event listeners to the existing DOM without re-rendering. Users see content 4× faster on slow connections.</Body>
        </Card>
        <Tag color={C.red}>Google's Core Web Vitals penalise poor LCP (Largest Contentful Paint). CSR apps rank lower unless they implement SSG or SSR.</Tag>
      </div>
    ),
  },

  // 7 — Vite vs Next.js
  {
    section: "Tooling", title: "Vite vs Next.js",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.teal}>Tooling battle</Label>
        <SlideTitle><Hl color={C.teal}>Build Tool</Hl> vs. <Hl color={C.purple}>Full Framework</Hl> — choose deliberately</SlideTitle>
        <Row gap={14} style={{ marginBottom: 16 }}>
          <Col>
            <Card color={C.teal} style={{ height: "100%" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 18, color: C.teal, marginBottom: 4 }}>Vite</div>
              <Chip color={C.teal}>Build Tool</Chip>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "10px 0", lineHeight: 1.8 }}>
                A <Hl color={C.text}>bundler and dev server</Hl>, not a framework. You own the architecture.
              </div>
              {["Blazing-fast HMR using native ES modules", "Zero-config start — no opinions enforced", "You choose: routing, data fetching, SSR", "Ships to a static dist/ — host anywhere", "Best for: SPAs, dashboards, internal tools"].map((p, i) => <Tag key={i} color={C.teal}>{p}</Tag>)}
              <Code fontSize={12}>{`npx create-vite@latest my-app \\
  --template react-ts`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.purple} style={{ height: "100%" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 18, color: C.purple, marginBottom: 4 }}>Next.js</div>
              <Chip color={C.purple}>Full Framework</Chip>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "10px 0", lineHeight: 1.8 }}>
                Built on top of Vite/Turbopack. Adds <Hl color={C.text}>routing, SSR, SSG, API routes</Hl> out of the box.
              </div>
              {["File-system routing: app/page.tsx = /page", "Per-page rendering: SSR, SSG, ISR per route", "Built-in SEO: metadata API, structured data", "API routes: /app/api/route.ts = serverless fn", "Best for: public sites, e-commerce, SaaS"].map((p, i) => <Tag key={i} color={C.purple}>{p}</Tag>)}
              <Code fontSize={12}>{`npx create-next-app@latest my-app \\
  --typescript --tailwind --app`}</Code>
            </Card>
          </Col>
        </Row>
      </div>
    ),
  },

  // 8 — Next.js routing & SEO
  {
    section: "Tooling", title: "Next.js: Routing & SEO",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.purple}>Next.js deep dive</Label>
        <SlideTitle>File-system routing & <Hl color={C.purple}>built-in SEO</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Folder structure → URL</div>
            <Code fontSize={13}>{`app/
├── page.tsx          →  /
├── about/
│   └── page.tsx      →  /about
├── blog/
│   ├── page.tsx      →  /blog
│   └── [slug]/
│       └── page.tsx  →  /blog/my-post
└── api/
    └── tasks/
        └── route.ts  →  GET /api/tasks`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>Per-page rendering strategy</div>
            <Code fontSize={13}>{`// app/blog/[slug]/page.tsx
// This page is Server-Side Rendered
export const dynamic = 'force-dynamic';

// app/about/page.tsx
// This page is statically generated at build time
export const dynamic = 'force-static';`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Metadata API — structured SEO</div>
            <Code fontSize={13}>{`// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default function BlogPost({ params }) {
  // This runs on the SERVER — fully SEO-indexed
  return <Article slug={params.slug} />;
}`}</Code>
            <Card color={C.green} style={{ marginTop: 12, padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, marginBottom: 6 }}>GSO — Google Search Optimisation</div>
              <Body>Every server-rendered page delivers real HTML to Googlebot. No JS execution required for indexing. Open Graph tags drive social sharing previews.</Body>
            </Card>
          </Col>
        </Row>
        <TeacherNote>Ask: "Given what you know about CSR vs SSR — when would you choose Vite+React over Next.js for a commercial project?" Key answer: when all pages are behind auth (dashboard), or when you need maximum infrastructure flexibility and your team will handle SSR manually.</TeacherNote>
      </div>
    ),
  },

  // 9 — testing intro
  {
    section: "Testing", title: "The Testing Pyramid",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.yellow}>Quality assurance</Label>
        <SlideTitle>Three levels of confidence. <Hl color={C.yellow}>Know which to use when.</Hl></SlideTitle>
        <Body>The pyramid shape is intentional: many cheap unit tests form the foundation. A few expensive E2E tests sit at the top. Inverting it (many E2E, few unit) is a common expensive mistake.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Unit", icon: "⚡", color: C.green, tool: "Vitest / Jest", what: "One function or hook in isolation", speed: "Microseconds", count: "Hundreds" },
            { label: "Component", icon: "🧩", color: C.yellow, tool: "React Testing Library", what: "One component, rendered in JSDOM", speed: "Milliseconds", count: "Dozens" },
            { label: "E2E", icon: "🌐", color: C.red, tool: "Playwright / Cypress", what: "Real browser, real user flow", speed: "Seconds", count: "Handful" },
          ].map(({ label, icon, color, tool, what, speed, count }) => (
            <Card key={label} color={color} style={{ padding: "16px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 15, color, marginBottom: 8 }}>{label}</div>
              <Chip color={color}>{tool}</Chip>
              {[["Tests", what], ["Speed", speed], ["How many", count]].map(([k, v]) => (
                <div key={k} style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, marginTop: 6 }}><span style={{ color: C.dim }}>{k}: </span>{v}</div>
              ))}
            </Card>
          ))}
        </div>
        <Card>
          <Body><Hl color={C.blue}>Philosophy:</Hl> Test behaviour, not implementation. A good test verifies <Hl color={C.text}>what the user experiences</Hl>, not how your component is structured internally. Refactoring internals should never break a well-written test.</Body>
        </Card>
      </div>
    ),
  },

  // 10 — testing pyramid interactive
  {
    section: "Testing", title: "Testing Pyramid — code examples",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.yellow}><LiveDot /> Interactive</Label>
        <SlideTitle>Click each layer to see a <Hl color={C.yellow}>real test</Hl></SlideTitle>
        <TestingPyramidDemo />
        <TeacherNote>Walk through each test type slowly. For unit: emphasise no DOM, pure function. For component: explain getByRole over getByTestId — it tests accessibility at the same time. For E2E: show that it doesn't know about React at all — it's a user with a browser.</TeacherNote>
      </div>
    ),
  },

  // 11 — vitest setup
  {
    section: "Testing", title: "Setting Up Vitest",
    render: () => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Label color={C.yellow}>Tooling</Label>
        <SlideTitle>Vitest — the natural choice for <Hl color={C.teal}>Vite projects</Hl></SlideTitle>
        <Body>Vitest reuses your Vite config, supports TypeScript natively, and is API-compatible with Jest. Zero context-switching.</Body>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>1. Install</div>
            <Code fontSize={13}>{`npm install --save-dev \\
  vitest \\
  @testing-library/react \\
  @testing-library/jest-dom \\
  @testing-library/user-event \\
  jsdom`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>2. vite.config.ts</div>
            <Code fontSize={13}>{`/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>3. src/test/setup.ts</div>
            <Code fontSize={13}>{`import '@testing-library/jest-dom';
// Extends expect() with:
// .toBeInTheDocument()
// .toHaveTextContent()
// .toBeDisabled() etc.`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>4. package.json scripts</div>
            <Code fontSize={13}>{`{
  "scripts": {
    "dev":      "vite",
    "build":    "vite build",
    "test":     "vitest",
    "test:ui":  "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>5. Run</div>
            <Code fontSize={13}>{`npm test          # watch mode
npm run coverage  # with % report`}</Code>
          </Col>
        </Row>
      </div>
    ),
  },

  // 12 — RTL philosophy
  {
    section: "Testing", title: "React Testing Library — Philosophy",
    render: () => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Label color={C.yellow}>Component testing</Label>
        <SlideTitle>Test <Hl color={C.yellow}>what users see</Hl>, not what developers wrote</SlideTitle>
        <Row gap={16} style={{ marginBottom: 16 }}>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 8, fontSize: 12 }}>❌ Testing implementation</div>
              <Code fontSize={12}>{`// Breaks if you rename a class
// or refactor internal state
const btn = wrapper.find('.add-btn');
expect(component.state.tasks).toHaveLength(1);
expect(wrapper.find('TaskItem').props().text)
  .toBe('Buy milk');

// These tests know too much about internals.
// Refactor = broken tests even if UX is fine.`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 8, fontSize: 12 }}>✅ Testing behaviour</div>
              <Code fontSize={12}>{`// Survives any internal refactor
import userEvent from '@testing-library/user-event';

test('adds a task when form submitted', async () => {
  render(<App />);
  const user = userEvent.setup();

  await user.type(
    screen.getByRole('textbox', { name: /new task/i }),
    'Buy milk'
  );
  await user.click(screen.getByRole('button', { name: /add/i }));

  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});`}</Code>
            </Card>
          </Col>
        </Row>
        <Card>
          <Body><Hl color={C.blue}>RTL's guiding principle:</Hl> Query by role, label, or text — the same things a screen reader uses. If your test can't find an element by role, your app may not be accessible either.</Body>
        </Card>
      </div>
    ),
  },

  // 13 — build pipeline
  {
    section: "Build Pipeline", title: "What Happens at npm run build?",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.orange}>Production pipeline</Label>
        <SlideTitle>From source code to <Hl color={C.orange}>shippable artifacts</Hl></SlideTitle>
        <Body>Running <code style={{ fontFamily: "monospace", color: C.teal }}>npm run build</code> triggers Vite's production build. Every step is intentional.</Body>
        <BuildPipelineDemo />
        <Row gap={14} style={{ marginTop: 16 }}>
          <Col>
            <Card color={C.teal} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.teal, marginBottom: 6 }}>dist/ output structure</div>
              <Code fontSize={12}>{`dist/
├── index.html
├── assets/
│   ├── index-a3f9c12.js   # hashed bundle
│   ├── index-b7e2d45.css  # hashed styles
│   └── logo-c1d3f67.svg`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.yellow} style={{ padding: "12px 14px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.yellow, marginBottom: 6 }}>Typical bundle analysis</div>
              {[["Source", "~2.4 MB"], ["After minify", "~420 KB"], ["Gzipped", "~140 KB"], ["Tree-shaken", "Only used code"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 5 }}>
                  <span>{k}</span><span style={{ color: C.yellow }}>{v}</span>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
        <TeacherNote>Run `npm run build` live in the terminal. Show students the dist/ folder. Open index.html — show it's nearly empty (just script tags). Then show the minified .js file — unreadable by design. Ask: "Why don't we deploy our source code?"</TeacherNote>
      </div>
    ),
  },

  // 14 — tree-shaking & code splitting
  {
    section: "Build Pipeline", title: "Tree-shaking & Code Splitting",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.orange}>Advanced build concepts</Label>
        <SlideTitle>Ship only what users <Hl color={C.orange}>actually need</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Tree-shaking in action</div>
            <Code fontSize={13}>{`// utils.js — you export 10 functions
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
// ... 7 more functions

// App.jsx — you only use one
import { add } from './utils';

// After build: only add() is in the bundle.
// The other 9 functions are gone. 🌳
// Condition: must use ES modules (import/export)
// CommonJS (require) cannot be tree-shaken.`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Code splitting — lazy loading routes</div>
            <Code fontSize={13}>{`import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Dynamically imported — separate chunk per route
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
  // Users only download the JS for pages they visit.
}`}</Code>
          </Col>
        </Row>
        <Card style={{ marginTop: 14 }}>
          <Body><Hl color={C.yellow}>Real impact:</Hl> A monolithic bundle forces users to download all page code upfront. Code splitting makes the initial load small and fast — users download each page's code on demand.</Body>
        </Card>
      </div>
    ),
  },

  // 15 — deployment options
  {
    section: "Deployment", title: "Hosting & Deployment",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.green}>Going to production</Label>
        <SlideTitle>Three production-grade hosting options</SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            {
              name: "Vercel", color: C.text, tier: "Recommended for Next.js",
              pros: ["Zero-config deploys", "Git push → live in 30s", "Edge network in 40+ regions", "Preview URLs per PR"],
              cons: ["Vendor lock-in risk", "Gets expensive at scale"],
              cmd: "npx vercel deploy",
            },
            {
              name: "Netlify", color: C.teal, tier: "Great for Vite SPAs",
              pros: ["Drag-and-drop dist/ upload", "Form handling built-in", "Generous free tier", "Branch deploys"],
              cons: ["Less Next.js native support", "Functions have cold starts"],
              cmd: "netlify deploy --dir=dist",
            },
            {
              name: "AWS S3 + CloudFront", color: C.yellow, tier: "Enterprise / Full control",
              pros: ["Lowest cost at scale", "Full infrastructure control", "Integrates with CI/CD pipelines"],
              cons: ["Manual configuration", "Requires AWS knowledge", "No preview URLs by default"],
              cmd: "aws s3 sync dist/ s3://my-bucket",
            },
          ].map(({ name, color, tier, pros, cons, cmd }) => (
            <Card key={name} color={color} style={{ padding: "14px 16px" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 16, color, marginBottom: 4 }}>{name}</div>
              <Chip color={color}>{tier}</Chip>
              <div style={{ marginTop: 10 }}>
                {pros.map((p, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 11, color: C.green, marginBottom: 4 }}>+ {p}</div>)}
                {cons.map((c, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 11, color: C.red, marginBottom: 4 }}>− {c}</div>)}
              </div>
              <div style={{ marginTop: 10 }}>
                <Code fontSize={11}>{cmd}</Code>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <Body><Hl color={C.yellow}>Decision guide:</Hl> Personal project or startup → Vercel/Netlify. Client work needing custom infra → AWS. Your company already on Azure/GCP → match the ecosystem. The dist/ folder is provider-agnostic.</Body>
        </Card>
      </div>
    ),
  },

  // 16 — environment variables
  {
    section: "Deployment", title: "Environment Variables & Security",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.red}>Security — critical</Label>
        <SlideTitle>Secrets belong in <Hl color={C.red}>.env</Hl> — never in <Hl color={C.red}>Git</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <Card color={C.red} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 8, fontSize: 12 }}>❌ The leaking API key</div>
              <Code fontSize={12}>{`// App.jsx — NEVER do this
const API_KEY = 'sk-prod-a1b2c3d4e5f6...';

// This string is in your Git history forever.
// It will be in your minified bundle.
// Anyone can view-source and steal it.
// Rotating the key requires a new deployment.`}</Code>
            </Card>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 8, fontSize: 12 }}>✅ Correct approach</div>
              <Code fontSize={12}>{`// .env.local — NOT committed to Git
VITE_API_URL=https://api.myservice.com
VITE_PUBLIC_KEY=pk_live_abc123

// App.jsx — read at build time
const url = import.meta.env.VITE_API_URL;

// On Vercel/Netlify: set in dashboard UI
// CI/CD: inject as build-time env vars`}</Code>
            </Card>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Vite env file hierarchy</div>
            <Code fontSize={12}>{`.env             # all environments (safe values only)
.env.local       # local overrides, never committed
.env.development # loaded in dev (npm run dev)
.env.production  # loaded in build (npm run build)
.env.test        # loaded during npm test`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>Critical .gitignore entries</div>
            <Code fontSize={12}>{`# .gitignore — these must never reach GitHub
.env.local
.env.*.local
.env.production

# Only .env with non-secret public config
# is safe to commit`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "12px 0 8px" }}>Vite prefix rule</div>
            <Tag color={C.yellow}>Variables must start with VITE_ to be exposed to browser code. Unprefixed vars are server-only — they are stripped from the bundle entirely.</Tag>
            <Tag color={C.red}>NEVER store private API secrets in VITE_ vars — they end up in the JS bundle which anyone can read.</Tag>
          </Col>
        </Row>
      </div>
    ),
  },

  // 17 — CI/CD pipeline
  {
    section: "Deployment", title: "The Professional CI/CD Pipeline",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.green}>Industry standard</Label>
        <SlideTitle>Automate everything. <Hl color={C.green}>Ship with confidence.</Hl></SlideTitle>
        <Body>Every professional team runs code through a pipeline before it reaches users. This is not optional — it is the baseline expectation.</Body>
        <Card style={{ marginBottom: 16, padding: "20px 24px" }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2.8 }}>
            {[
              ["Developer pushes code", C.muted, "git push origin feature/my-feature"],
              ["Pull Request opened", C.blue, "GitHub / GitLab notified"],
              ["CI pipeline triggers", C.purple, "GitHub Actions, GitLab CI, CircleCI"],
              ["npm ci", C.teal, "Clean install from package-lock.json"],
              ["npm test", C.yellow, "Vitest runs — must pass or PR is blocked"],
              ["npm run build", C.orange, "Vite production build — must succeed"],
              ["Preview deploy", C.green, "Vercel/Netlify deploy preview URL"],
              ["Code review", C.muted, "Team reviews at the preview URL"],
              ["Merge to main", C.green, "Auto-deploys to production ✅"],
            ].map(([step, color, detail], i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                <span style={{ color: C.dim, minWidth: 20, fontSize: 11 }}>{i + 1}.</span>
                <span style={{ color, minWidth: 180, fontWeight: i > 1 && i < 7 ? 700 : 400 }}>{step}</span>
                <span style={{ color: C.dim, fontSize: 12 }}>→ {detail}</span>
              </div>
            ))}
          </div>
        </Card>
        <Code fontSize={12}>{`# .github/workflows/ci.yml (GitHub Actions)
name: CI
on: [push, pull_request]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --run   # vitest single run
      - run: npm run build`}</Code>
      </div>
    ),
  },

  // 18 — live coding guide
  {
    section: "Live Coding", title: "Live Coding — Full Session",
    live: true,
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.teal}><LiveDot /> Live coding guide</Label>
        <SlideTitle>Init → Test → Build — <Hl color={C.teal}>all in one terminal session</Hl></SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.blue, marginBottom: 8, fontWeight: 700 }}>① Scaffold — 2 min</div>
            <Code fontSize={12}>{`npx create-vite@latest task-app \\
  --template react-ts
cd task-app
npm install
npm run dev
# Open localhost:5173 — confirm it works`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.yellow, margin: "12px 0 8px", fontWeight: 700 }}>② Add Vitest — 2 min</div>
            <Code fontSize={12}>{`npm install --save-dev vitest \\
  @testing-library/react \\
  @testing-library/jest-dom jsdom

# Add to vite.config.ts:
#   test: { environment: 'jsdom', globals: true }`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, margin: "12px 0 8px", fontWeight: 700 }}>③ Write & run a unit test — 3 min</div>
            <Code fontSize={12}>{`# src/utils/tasks.ts
export const filterDone = (tasks) =>
  tasks.filter(t => t.done);

# src/utils/tasks.test.ts
import { describe, it, expect } from 'vitest';
import { filterDone } from './tasks';

it('returns only done tasks', () => {
  const result = filterDone([
    { id: 1, text: 'A', done: true },
    { id: 2, text: 'B', done: false },
  ]);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

# npm test → watch mode, test passes ✅`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.red, marginBottom: 8, fontWeight: 700 }}>④ Watch a test fail — 1 min</div>
            <Code fontSize={12}>{`# Break the function intentionally:
export const filterDone = (tasks) =>
  tasks.filter(t => !t.done); // ← wrong!

# Vitest immediately shows red:
# ✗ returns only done tasks
#   Expected length: 1
#   Received length: 1  (wrong item)

# Fix it — green again. This is TDD.`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.orange, margin: "12px 0 8px", fontWeight: 700 }}>⑤ Production build — 2 min</div>
            <Code fontSize={12}>{`npm run build

# Output:
# ✓ built in 1.24s
# dist/index.html          0.46 kB
# dist/assets/index-a3f.js 142.30 kB │ gzip: 45.80 kB

ls dist/assets/
# Show the hashed filenames
# Open index.html — show it's empty HTML
# Open .js — show minified unreadable code`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.purple, margin: "12px 0 8px", fontWeight: 700 }}>⑥ Deploy preview — 1 min</div>
            <Code fontSize={12}>{`# Install Vercel CLI
npm install -g vercel

vercel deploy --prebuilt
# Paste the preview URL into the browser
# Students see it live on the internet ✅`}</Code>
          </Col>
        </Row>
        <TeacherNote>Keep the terminal and browser side-by-side throughout. The goal is students witnessing the full cycle: write code → test passes → build succeeds → URL is live. The emotional payoff of seeing their code on a real URL matters.</TeacherNote>
      </div>
    ),
  },

  // 19 — senior checklist
  {
    section: "Summary", title: "The Senior Engineer Checklist",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Before you ship — every time</Label>
        <SlideTitle>Questions a senior asks <Hl color={C.green}>before merging</Hl></SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["🛡", "npx for scaffolding?", "No stale global tools. Consistent versions."],
            ["🌐", "Right rendering strategy?", "CSR for auth-gated. SSR/SSG for public pages."],
            ["🔑", "Secrets in .env?", "Zero API keys in source code or Git history."],
            ["⚡", "Unit tests pass?", "All business logic covered. Fast feedback loop."],
            ["🧩", "Component tests pass?", "User-visible behaviour verified, not internals."],
            ["🌳", "Build runs clean?", "No TS errors, no broken imports, dist/ produced."],
            ["📦", "Bundle size checked?", "vite-bundle-visualizer run. No surprise 1MB deps."],
            ["♿", "Accessibility checked?", "Tab navigation works. ARIA labels present."],
            ["🚀", "Preview deploy tested?", "QA'd on the preview URL, not just localhost."],
            ["🔁", "CI green on PR?", "Pipeline passes: lint + test + build + deploy."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 12, padding: "10px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: C.text }}>{title}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 20 — what's next
  {
    section: "Next Steps", title: "What to Explore Next",
    render: () => (
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
        <BigTitle>You now think like a <Hl color={C.teal}>software architect</Hl></BigTitle>
        <Body>These are the tools and patterns that separate hobby projects from production systems. The next level is connecting them all.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left", margin: "22px 0" }}>
          {[
            ["📡", "React Query / SWR", "Data fetching, caching, and server-state management."],
            ["🔐", "NextAuth.js", "Authentication patterns for Next.js applications."],
            ["🐋", "Docker + containers", "Package your app and its environment together."],
            ["📊", "Lighthouse CI", "Automate performance and accessibility audits in CI."],
            ["🧪", "Playwright E2E", "Full browser automation — the final test layer."],
            ["📈", "Error monitoring", "Sentry: real-time alerts when production breaks."],
          ].map(([icon, title, desc]) => (
            <Card key={title}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: C.blue, marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>{desc}</div>
            </Card>
          ))}
        </div>
        <Code fontSize={12}>{`# Your assignment: take any past project and
# 1. Add Vitest unit tests for business logic
# 2. Run npm run build — fix any errors
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
    "Rendering": C.purple, "Tooling": C.teal, "Testing": C.yellow,
    "Build Pipeline": C.orange, "Deployment": C.green,
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

      {/* section + minimap */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "5px 20px", display: "flex", alignItems: "center", gap: 5, overflowX: "auto" }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: sectionColor, whiteSpace: "nowrap", marginRight: 6 }}>{slide.section}</span>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => jump(i)} title={s.title}
            style={{ width: i === cur ? 16 : 6, height: 6, borderRadius: 3, background: i === cur ? sectionColor : i < cur ? C.green + "88" : C.border, border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "all 0.25s" }} />
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "monospace", fontSize: 9, color: C.dim, whiteSpace: "nowrap" }}>← → keys</span>
      </div>

      {/* slide content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "32px 40px", width: "100%", maxWidth: 1040, margin: "0 auto", ...animStyle }}>
          {slide.render()}
        </div>
      </div>

      {/* nav bar */}
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