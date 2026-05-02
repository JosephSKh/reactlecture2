import { useState, useEffect, useCallback } from "react";

/* ── palette ─────────────────────────────────────────── */
const C = {
  bg: "#0d1117", surface: "#161b22", border: "#21262d",
  border2: "#30363d", text: "#e6edf3", muted: "#8b949e",
  dim: "#484f58", blue: "#58a6ff", green: "#3fb950",
  purple: "#d2a8ff", red: "#ff7b72", yellow: "#e3b341",
  teal: "#61dafb", orange: "#f78166",
};

/* ── syntax hi-lighter ───────────────────────────────── */
function Code({ children, fontSize = 15 }) {
  const lines = children.trim().split("\n");
  return (
    <pre style={{
      background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 10,
      padding: "20px 26px", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize, lineHeight: 1.85, overflowX: "auto", margin: 0,
      textAlign: "left", color: C.text,
    }}>
      {lines.map((line, i) => <div key={i}>{hl(line)}</div>)}
    </pre>
  );
}
function hl(line) {
  const rules = [
    { re: /(\/\/.*$)/, c: C.dim },
    { re: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, c: "#a5d6ff" },
    { re: /\b(import|export|default|from|return|const|let|var|function|if|else|for|of|in|new|true|false|null|undefined|async|await)\b/, c: C.red },
    { re: /\b(useState|useEffect|useCallback|useRef|props|React)\b/, c: C.purple },
    { re: /(<\/?[A-Z][A-Za-z0-9]*)/, c: "#79c0ff" },
    { re: /(<\/?[a-z][a-z0-9]*)/, c: C.green },
    { re: /(\/>|>)/, c: C.green },
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
  <div style={{
    fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em",
    textTransform: "uppercase", color, marginBottom: 18,
    display: "flex", alignItems: "center", gap: 8,
  }}>{children}</div>
);
const LiveDot = () => (
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
);
const BigTitle = ({ children }) => (
  <h1 style={{
    fontFamily: "'JetBrains Mono','Courier New',monospace",
    fontSize: "clamp(28px, 4.5vw, 58px)", fontWeight: 800,
    color: C.text, margin: "0 0 20px", lineHeight: 1.1,
  }}>{children}</h1>
);
const SlideTitle = ({ children }) => (
  <h2 style={{
    fontFamily: "'JetBrains Mono','Courier New',monospace",
    fontSize: "clamp(20px, 3vw, 38px)", fontWeight: 800,
    color: C.text, margin: "0 0 24px", lineHeight: 1.15,
  }}>{children}</h2>
);
const Body = ({ children }) => (
  <p style={{ fontFamily: "monospace", fontSize: 15, color: C.muted, lineHeight: 1.85, margin: "0 0 12px" }}>{children}</p>
);
const Hl = ({ children, color = C.blue }) => <span style={{ color }}>{children}</span>;
const Card = ({ children, color, style = {} }) => (
  <div style={{
    background: C.surface, border: `1px solid ${color ? color + "44" : C.border}`,
    borderRadius: 12, padding: "18px 22px", ...style,
  }}>{children}</div>
);
const Chip = ({ children, color = C.blue }) => (
  <span style={{
    display: "inline-block", background: color + "18", border: `1px solid ${color}44`,
    borderRadius: 5, padding: "4px 12px", fontSize: 13, color,
    fontFamily: "monospace", margin: "4px 5px 4px 0",
  }}>{children}</span>
);
const Row = ({ children, gap = 24, style = {} }) => (
  <div style={{ display: "flex", gap, alignItems: "flex-start", ...style }}>{children}</div>
);
const Col = ({ children, style = {} }) => (
  <div style={{ flex: 1, ...style }}>{children}</div>
);

const TeacherNote = ({ children }) => (
  <div style={{
    background: "#e3b34112", border: `1px solid ${C.yellow}44`,
    borderLeft: `3px solid ${C.yellow}`,
    borderRadius: 8, padding: "12px 16px", marginTop: 20,
  }}>
    <div style={{ fontFamily: "monospace", fontSize: 11, color: C.yellow, letterSpacing: "0.1em", marginBottom: 6 }}>📋 TEACHER NOTE</div>
    <div style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const BulletList = ({ items, color = C.blue }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <span style={{ color, fontFamily: "monospace", fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
        <span style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{item}</span>
      </div>
    ))}
  </div>
);

/* ── live demo: kanban board ─────────────────────────── */
function KanbanDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Design component tree", done: false },
    { id: 2, text: "Lift state to App", done: true },
    { id: 3, text: "Add keyboard support", done: false },
  ]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  const moveTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const todo = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  const TaskItem = ({ task, actionLabel, actionColor }) => (
    <div style={{
      background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 8,
      padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
      marginBottom: 8,
    }}>
      <span style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: C.text }}>{task.text}</span>
      <button
        onClick={() => moveTask(task.id)}
        style={{ background: actionColor + "18", border: `1px solid ${actionColor}44`, color: actionColor, borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontFamily: "monospace", fontSize: 11, flexShrink: 0 }}
      >{actionLabel}</button>
      <button
        onClick={() => removeTask(task.id)}
        style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontSize: 15, padding: "0 2px", flexShrink: 0 }}>×</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="New task… (Enter to add)"
          aria-label="New task"
          style={{ flex: 1, background: C.bg, border: `1px solid ${C.border2}`, borderRadius: 7, color: C.text, padding: "8px 14px", fontFamily: "monospace", fontSize: 13, outline: "none" }}
        />
        <button onClick={addTask} style={{ background: "#238636", border: "1px solid #2ea043", color: "#fff", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>Add</button>
      </div>
      <Row gap={14}>
        <Col>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.blue, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            📋 To Do <span style={{ color: C.dim }}>({todo.length})</span>
          </div>
          <div style={{ minHeight: 80 }}>
            {todo.length === 0 && <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, padding: "10px 0" }}>All done! 🎉</div>}
            {todo.map(t => <TaskItem key={t.id} task={t} actionLabel="→ Done" actionColor={C.green} />)}
          </div>
        </Col>
        <Col>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.green, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            ✓ Done <span style={{ color: C.dim }}>({done.length})</span>
          </div>
          <div style={{ minHeight: 80 }}>
            {done.length === 0 && <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim, padding: "10px 0" }}>Nothing here yet.</div>}
            {done.map(t => <TaskItem key={t.id} task={t} actionLabel="← Undo" actionColor={C.yellow} />)}
          </div>
        </Col>
      </Row>
    </div>
  );
}

/* ── immutability demo ───────────────────────────────── */
function ImmutabilityDemo() {
  const [log, setLog] = useState([]);
  const [arr, setArr] = useState([1, 2, 3]);

  const doPush = () => {
    const copy = [...arr];
    copy.push(copy.length + 1);
    // Mutating directly — won't trigger re-render
    setLog(l => [{ id: Date.now(), msg: "push() mutates: React may miss this!", color: C.red }, ...l.slice(0, 5)]);
    // We force re-render here just to show the log, but in real code this fails silently
  };

  const doSpread = () => {
    const next = [...arr, arr.length + 1];
    setArr(next);
    setLog(l => [{ id: Date.now(), msg: `spread: new array [${next.join(", ")}] ✓`, color: C.green }, ...l.slice(0, 5)]);
  };

  return (
    <div>
      <Row gap={14} style={{ marginBottom: 14 }}>
        <Col>
          <button onClick={doPush}
            style={{ width: "100%", background: C.red + "18", border: `1px solid ${C.red}44`, color: C.red, borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "monospace", fontSize: 13 }}>
            ❌ arr.push() — mutate
          </button>
        </Col>
        <Col>
          <button onClick={doSpread}
            style={{ width: "100%", background: C.green + "18", border: `1px solid ${C.green}44`, color: C.green, borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "monospace", fontSize: 13 }}>
            ✅ [...arr, item] — spread
          </button>
        </Col>
      </Row>
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", minHeight: 100, fontFamily: "monospace", fontSize: 13 }}>
        {log.length === 0 && <span style={{ color: C.dim }}>Click a button to see what happens…</span>}
        {log.map(l => <div key={l.id} style={{ color: l.color, marginBottom: 5 }}>▶ {l.msg}</div>)}
      </div>
    </div>
  );
}

/* ── slides ─────────────────────────────────────────── */
const SLIDES = [
  // 0 — title
  {
    section: "Welcome", title: "React in Motion",
    render: () => (
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto", paddingTop: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: C.green, marginBottom: 28, letterSpacing: "0.06em" }}>
          {">"} npx create vite@latest progress-tracker -- --template react<span style={{ animation: "blink 1s infinite", display: "inline-block" }}>█</span>
        </div>
        <BigTitle>React in Motion:<br /><span style={{ color: C.teal }}>From Design to Functional Component</span></BigTitle>
        <Body>A 1.5-hour live-coding session. We'll build a Kanban-style Progress Tracker from scratch.</Body>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          {["Declarative UI", "Component Tree", "State Strategy", "Lifting State Up", "Immutability", "Accessibility"].map(t => <Chip key={t} color={C.teal}>{t}</Chip>)}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 28 }}>Use ← → arrow keys or the buttons below to navigate</div>
      </div>
    ),
  },

  // 1 — agenda
  {
    section: "Overview", title: "Session Roadmap",
    render: () => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Label>90-minute plan</Label>
        <SlideTitle>What we're building & how we'll get there</SlideTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["The Why", "Vanilla JS → React. Imperative vs Declarative.", "10 min", C.blue],
            ["The Blueprint", "Component tree & design breakdown.", "10 min", C.purple],
            ["The State Strategy", "Single Source of Truth & Lifting State Up.", "15 min", C.yellow],
            ["Phase 1", "Project setup & folder structure.", "10 min", C.teal],
            ["Phase 2", "Static components & props.", "15 min", C.green],
            ["Phase 3", "Interactive: useState & events.", "20 min", C.orange],
            ["Phase 4", "UX & Accessibility polish.", "10 min", C.red],
          ].map(([phase, desc, time, color], i) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "monospace", fontSize: 14, color, minWidth: 110 }}>{phase}</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: C.muted, flex: 1 }}>{desc}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 2 — the why: imperative vs declarative
  {
    section: "The Why", title: "Imperative vs. Declarative",
    render: () => (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Label color={C.red}>The problem with Vanilla JS</Label>
        <SlideTitle>You tell the DOM <Hl color={C.red}>every step.</Hl> React lets you say <Hl color={C.green}>what you want.</Hl></SlideTitle>
        <Row gap={18}>
          <Col>
            <Card color={C.red} style={{ marginBottom: 0 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 10, fontSize: 13 }}>❌ Imperative — Vanilla JS</div>
              <Code fontSize={12}>{`// Move task to "Done": manual DOM surgery
const item = document.getElementById('task-3');
item.classList.add('done');

const todoCol = document.getElementById('todo');
todoCol.removeChild(item);

const doneCol = document.getElementById('done');
doneCol.appendChild(item);

updateCounterBadge();   // forgot? bug!
syncLocalStorage();     // forgot? bug!
// Order matters. One mistake = silent failure.`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green} style={{ marginBottom: 0 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 10, fontSize: 13 }}>✅ Declarative — React</div>
              <Code fontSize={12}>{`// Move task to "Done": flip one boolean
const moveTask = (id) => {
  setTasks(prev =>
    prev.map(t =>
      t.id === id
        ? { ...t, done: true }
        : t
    )
  );
};

// React handles EVERY DOM update automatically.
// Counters, columns, styles — all derived from state.`}</Code>
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 18 }}>
          <Body><Hl color={C.blue}>Key insight:</Hl> In React, your UI is a <Hl color={C.text}>function of state</Hl>. When state changes, the view updates automatically — no querySelector, no classList, no imperative gymnastics.</Body>
        </Card>
      </div>
    ),
  },

  // 3 — the why: why React wins at scale
  {
    section: "The Why", title: "Why React at Scale?",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.blue}>Motivation</Label>
        <SlideTitle>The problems React was built to solve</SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { icon: "🔁", title: "Synchronization hell", color: C.red, body: "Vanilla JS state lives in the DOM — you must keep every element in sync by hand. One missed update = visual bug." },
            { icon: "🧩", title: "Reusability", color: C.purple, body: "With raw HTML you copy-paste markup. React components are self-contained, reusable units that own their own logic." },
            { icon: "📦", title: "Predictable data flow", color: C.green, body: "Data flows one direction: parent → child via props. The UI always reflects the same state deterministically." },
            { icon: "🚀", title: "Ecosystem & jobs", color: C.blue, body: "React powers Facebook, Airbnb, Notion. The ecosystem (Next.js, React Native) means one skill set scales to web, mobile, and beyond." },
          ].map(({ icon, title, color, body }) => (
            <Card key={title} color={color} style={{ padding: "20px" }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 14, color, marginBottom: 8 }}>{title}</div>
              <Body>{body}</Body>
            </Card>
          ))}
        </div>
        <TeacherNote>This is NOT a comprehensive React intro. Students have context from prior sessions. Spend ≤8 min here, then move quickly to the blueprint.</TeacherNote>
      </div>
    ),
  },

  // 4 — the blueprint: what we're building
  {
    section: "The Blueprint", title: "What We're Building",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.teal}><LiveDot /> Preview — Target App</Label>
        <SlideTitle>Progress Tracker — <Hl color={C.teal}>live preview</Hl></SlideTitle>
        <Body>Two columns: <Hl color={C.blue}>To Do</Hl> and <Hl color={C.green}>Done</Hl>. Add tasks, move them, remove them. All state in one place.</Body>
        <KanbanDemo />
        <TeacherNote>Show the finished app first so students have a mental target. Let them interact with it before diving into the component tree.</TeacherNote>
      </div>
    ),
  },

  // 5 — component tree
  {
    section: "The Blueprint", title: "The Component Tree",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.purple}>Architecture</Label>
        <SlideTitle>Breaking the UI into <Hl color={C.purple}>components</Hl></SlideTitle>
        <Body>Before writing code, map the UI to a component hierarchy. This is your contract.</Body>
        <Card style={{ marginBottom: 18, padding: "28px 32px" }}>
          {/* ASCII-style tree */}
          <div style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 2.2 }}>
            <div style={{ color: C.teal, fontWeight: 800, fontSize: 16 }}>{"<App />"}</div>
            <div style={{ paddingLeft: 24, color: C.dim }}>│</div>
            <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 0 }}>
              <div><span style={{ color: C.dim }}>├─ </span><span style={{ color: C.blue, fontWeight: 700 }}>{"<TaskInput />"}</span> <span style={{ color: C.dim, fontSize: 12 }}>// controlled input + Add button</span></div>
              <div style={{ paddingLeft: 20, color: C.dim }}>│</div>
              <div><span style={{ color: C.dim }}>└─ </span><span style={{ color: C.purple, fontWeight: 700 }}>{"<Column />"}</span> <span style={{ color: C.dim, fontSize: 12 }}>// rendered twice (To Do & Done)</span></div>
              <div style={{ paddingLeft: 40, color: C.dim }}>│</div>
              <div style={{ paddingLeft: 40 }}><span style={{ color: C.dim }}>└─ </span><span style={{ color: C.green, fontWeight: 700 }}>{"<TaskItem />"}</span> <span style={{ color: C.dim, fontSize: 12 }}>// one per task, rendered via .map()</span></div>
            </div>
          </div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { name: "<App />", color: C.teal, owns: "All state (tasks[])", receives: "Nothing" },
            { name: "<TaskInput />", color: C.blue, owns: "input string (local)", receives: "onAdd prop" },
            { name: "<Column />", color: C.purple, owns: "Nothing", receives: "title, tasks, onMove, onRemove" },
            { name: "<TaskItem />", color: C.green, owns: "Nothing", receives: "task, onMove, onRemove" },
          ].map(({ name, color, owns, receives }) => (
            <Card key={name} color={color} style={{ padding: "14px 16px" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color, marginBottom: 8 }}>{name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, marginBottom: 4 }}><span style={{ color: C.yellow }}>owns:</span> {owns}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}><span style={{ color: C.blue }}>receives:</span> {receives}</div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },

  // 6 — folder structure preview
  {
    section: "The Blueprint", title: "Folder Structure",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.teal}>Phase 1 preview</Label>
        <SlideTitle>Planned file layout before we open the terminal</SlideTitle>
        <Row gap={20}>
          <Col>
            <Code fontSize={14}>{`src/
├── App.jsx          // root — owns all state
├── App.css
├── components/
│   ├── TaskInput.jsx
│   ├── Column.jsx
│   └── TaskItem.jsx
└── main.jsx

// One component per file.
// Filenames match component names.`}</Code>
          </Col>
          <Col>
            <BulletList color={C.teal} items={[
              "One component per file keeps things scannable",
              "components/ folder signals what's reusable",
              "App.jsx is the single entry point for state",
              "main.jsx just mounts <App /> — never touch it again",
            ]} />
          </Col>
        </Row>
        <TeacherNote>Open VS Code now. Scaffold the project with Vite live. Students should follow along on their own machines or watch the screen.</TeacherNote>
      </div>
    ),
  },

  // 7 — single source of truth
  {
    section: "State Strategy", title: "Single Source of Truth",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.yellow}>Core principle</Label>
        <SlideTitle><Hl color={C.yellow}>One place</Hl> for the data. Every component reads from it.</SlideTitle>
        <Body>Your <code style={{ fontFamily: "monospace", color: C.purple }}>tasks[]</code> array lives in exactly one component. All other components are <Hl color={C.text}>displays</Hl> — they receive data as props and report back via callbacks.</Body>
        <Row gap={18} style={{ marginTop: 8 }}>
          <Col>
            <Card color={C.red}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 10, fontSize: 13 }}>❌ Anti-pattern: Distributed state</div>
              <Code fontSize={12}>{`// tasks[] lives in Column.jsx
// Column.jsx has its own tasks state
// App.jsx has its OWN tasks state
// → They drift apart. Bugs guaranteed.`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 10, fontSize: 13 }}>✅ Single Source of Truth</div>
              <Code fontSize={12}>{`// App.jsx — only place tasks[] lives
const [tasks, setTasks] = useState([]);

// Column and TaskItem only READ tasks.
// They never own or duplicate it.`}</Code>
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.blue}>Rule of thumb:</Hl> If two components need the same piece of data, that data belongs in their closest common ancestor.</Body>
        </Card>
      </div>
    ),
  },

  // 8 — lifting state up
  {
    section: "State Strategy", title: "Lifting State Up",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.yellow}>Core pattern</Label>
        <SlideTitle>Child needs to change state? <Hl color={C.yellow}>Lift it up.</Hl></SlideTitle>
        <Body>Children can't push data up. Instead, the parent passes a <Hl color={C.blue}>callback function</Hl> as a prop. The child calls it to trigger a state change.</Body>
        <Code fontSize={14}>{`// App.jsx — owns state AND the setter logic
function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (text) => {               // defined in parent
    setTasks(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  const moveTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <>
      <TaskInput onAdd={addTask} />          {/* callback passed down */}
      <Column tasks={tasks.filter(t => !t.done)} onMove={moveTask} />
      <Column tasks={tasks.filter(t => t.done)}  onMove={moveTask} />
    </>
  );
}`}</Code>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.purple}>{"<TaskInput />"}</Hl> calls <code style={{ fontFamily: "monospace", color: C.blue }}>props.onAdd(text)</code> — it never touches state directly. State lives only in App.</Body>
        </Card>
        <TeacherNote>This is the hardest concept of the session. Draw the data flow on the whiteboard: App → props down, callbacks up. Pause for questions before moving to Phase 2.</TeacherNote>
      </div>
    ),
  },

  // 9 — data flow diagram
  {
    section: "State Strategy", title: "Data Flow Diagram",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.yellow}>Visual summary</Label>
        <SlideTitle>Props flow <Hl color={C.green}>↓ down</Hl>. Callbacks flow <Hl color={C.blue}>↑ up</Hl>.</SlideTitle>
        <Card style={{ padding: "32px", fontFamily: "monospace", fontSize: 13, lineHeight: 2.5 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", background: C.teal + "18", border: `2px solid ${C.teal}`, borderRadius: 8, padding: "8px 24px", color: C.teal, fontWeight: 800 }}>App.jsx — tasks[ ], setTasks</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: C.green, fontSize: 20 }}>↓</div>
                <div style={{ fontSize: 10, color: C.green }}>tasks, onAdd</div>
                <div style={{ background: C.blue + "18", border: `1px solid ${C.blue}`, borderRadius: 6, padding: "6px 14px", color: C.blue }}>TaskInput</div>
                <div style={{ fontSize: 10, color: C.blue, marginTop: 4 }}>calls onAdd(text)</div>
                <div style={{ color: C.blue, fontSize: 20 }}>↑</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: C.green, fontSize: 20 }}>↓</div>
                <div style={{ fontSize: 10, color: C.green }}>tasks, onMove, onRemove</div>
                <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}`, borderRadius: 6, padding: "6px 14px", color: C.purple }}>Column (×2)</div>
                <div style={{ color: C.green, fontSize: 16 }}>↓</div>
                <div style={{ background: C.green + "18", border: `1px solid ${C.green}`, borderRadius: 6, padding: "4px 12px", color: C.green }}>TaskItem (×n)</div>
                <div style={{ fontSize: 10, color: C.blue, marginTop: 4 }}>calls onMove(id)</div>
                <div style={{ color: C.blue, fontSize: 20 }}>↑</div>
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Chip color={C.green}>↓ Data (props)</Chip>
          <Chip color={C.blue}>↑ Actions (callbacks)</Chip>
          <Chip color={C.dim}>State never moves sideways</Chip>
        </div>
      </div>
    ),
  },

  // 10 — phase 1: setup
  {
    section: "Phase 1", title: "Project Setup & Folder Structure",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.teal}>Phase 1 — 10 min</Label>
        <SlideTitle>Scaffold the project. Create the files. <Hl color={C.teal}>Don't code yet.</Hl></SlideTitle>
        <Code fontSize={14}>{`# 1. Create the Vite + React project
npm create vite@latest progress-tracker -- --template react
cd progress-tracker
npm install
npm run dev

# 2. Clean up boilerplate
# Delete: src/assets/, src/App.css content
# Keep:   src/main.jsx, src/App.jsx, src/index.css

# 3. Create your component files (empty for now)
mkdir src/components
touch src/components/TaskInput.jsx
touch src/components/Column.jsx
touch src/components/TaskItem.jsx`}</Code>
        <BulletList color={C.teal} items={[
          "Verify the dev server runs at localhost:5173 before moving on",
          "Replace App.jsx with: export default function App() { return <h1>Progress Tracker</h1>; }",
          "Each component file gets a skeleton: function Name() { return <div>Name</div>; } export default Name;",
        ]} />
        <TeacherNote>Live-code this step. Show students that the project runs before any real code is written. Checkpoint: everyone should see 'Progress Tracker' in the browser.</TeacherNote>
      </div>
    ),
  },

  // 11 — phase 2: static components
  {
    section: "Phase 2", title: "Static Components & Props",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Phase 2 — 15 min</Label>
        <SlideTitle>Build the <Hl color={C.green}>skeleton</Hl> first. No state. No events. Just markup.</SlideTitle>
        <Body>Props make components reusable. Start by hard-coding data, then refactor to props.</Body>
        <Code fontSize={13}>{`// components/TaskItem.jsx
export default function TaskItem({ task }) {
  return (
    <li className="task-item">
      <span>{task.text}</span>
      <button>Move</button>
      <button aria-label={"Remove " + task.text}>×</button>
    </li>
  );
}

// components/Column.jsx
export default function Column({ title, tasks }) {
  return (
    <section aria-label={title + " column"}>
      <h2>{title} ({tasks.length})</h2>
      <ul>
        {tasks.map(t => <TaskItem key={t.id} task={t} />)}
      </ul>
    </section>
  );
}`}</Code>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.yellow}>Goal at end of Phase 2:</Hl> Hard-coded tasks render in two columns. No interaction yet. Styling can be minimal — focus on structure.</Body>
        </Card>
        <TeacherNote>Remind students: get the structure right before making it move. It's easier to add interactivity to working markup than to fix broken markup while debugging state.</TeacherNote>
      </div>
    ),
  },

  // 12 — phase 2: TaskInput
  {
    section: "Phase 2", title: "TaskInput — Controlled Component",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Phase 2 continued</Label>
        <SlideTitle>The input is a <Hl color={C.green}>controlled component</Hl></SlideTitle>
        <Body>A controlled component's value is always driven by React state — not the DOM. You're the boss.</Body>
        <Code fontSize={14}>{`// components/TaskInput.jsx
import { useState } from 'react';

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('');  // local state ✓

  const handleAdd = () => {
    if (!text.trim()) return;            // guard empty input
    onAdd(text.trim());                  // lift the value up
    setText('');                         // reset after submit
  };

  return (
    <div>
      <input
        value={text}                     // controlled
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Add a task…"
        aria-label="New task"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}`}</Code>
        <Card style={{ marginTop: 16 }}>
          <Body><Hl color={C.blue}>Notice:</Hl> <code style={{ fontFamily: "monospace", color: C.purple }}>text</code> is local state — it belongs in TaskInput. But the final value goes up to App via <code style={{ fontFamily: "monospace", color: C.blue }}>onAdd</code>.</Body>
        </Card>
      </div>
    ),
  },

  // 13 — immutability (senior insight)
  {
    section: "Senior Insight", title: "Immutability & the Spread Operator",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.orange}>⚡ Senior insight</Label>
        <SlideTitle>Why <Hl color={C.red}>.push()</Hl> breaks React — and why <Hl color={C.green}>[...spread]</Hl> doesn't</SlideTitle>
        <Body>React detects state changes by checking if the <Hl color={C.text}>reference</Hl> changed. Mutating the same array doesn't change its reference — React sees no change and skips the re-render.</Body>
        <Row gap={18} style={{ marginBottom: 16 }}>
          <Col>
            <Code fontSize={13}>{`// ❌ Mutates — same reference
tasks.push(newTask);
setTasks(tasks);   // React: "same array, skip"

// ✅ New array — new reference
setTasks([...tasks, newTask]);
// React: "new array! re-render ✓"

// ✅ Updating an item
setTasks(tasks.map(t =>
  t.id === id ? { ...t, done: true } : t
));
// Spread on the object too — new object reference`}</Code>
          </Col>
          <Col>
            <ImmutabilityDemo />
          </Col>
        </Row>
        <Card>
          <Body><Hl color={C.yellow}>Rule:</Hl> Never use <code style={{ fontFamily: "monospace", color: C.red }}>.push()</code>, <code style={{ fontFamily: "monospace", color: C.red }}>.splice()</code>, or direct assignment on state. Always return a <Hl color={C.text}>new array or object</Hl>.</Body>
        </Card>
      </div>
    ),
  },

  // 14 — phase 3: useState & events
  {
    section: "Phase 3", title: "Making It Interactive",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.orange}>Phase 3 — 20 min</Label>
        <SlideTitle>Add <Hl color={C.purple}>useState</Hl> to App. Wire <Hl color={C.orange}>events</Hl> through props.</SlideTitle>
        <Code fontSize={13}>{`// App.jsx — the complete state layer
import { useState } from 'react';
import TaskInput from './components/TaskInput';
import Column    from './components/Column';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Design component tree', done: false },
  ]);

  const addTask = (text) =>
    setTasks(prev => [...prev, { id: Date.now(), text, done: false }]);

  const moveTask = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const removeTask = (id) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const todo = tasks.filter(t => !t.done);
  const done = tasks.filter(t =>  t.done);

  return (
    <main>
      <h1>Progress Tracker</h1>
      <TaskInput onAdd={addTask} />
      <div className="board">
        <Column title="To Do" tasks={todo} onMove={moveTask} onRemove={removeTask} />
        <Column title="Done"  tasks={done} onMove={moveTask} onRemove={removeTask} />
      </div>
    </main>
  );
}`}</Code>
        <TeacherNote>Implement addTask first, verify it works, then add moveTask, then removeTask. One handler at a time. Students should test after each addition.</TeacherNote>
      </div>
    ),
  },

  // 15 — phase 3: wiring Column & TaskItem
  {
    section: "Phase 3", title: "Wiring Column & TaskItem",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.orange}>Phase 3 continued</Label>
        <SlideTitle>Pass callbacks all the way down the tree</SlideTitle>
        <Row gap={16}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Column.jsx — passes to TaskItem</div>
            <Code fontSize={12}>{`export default function Column({
  title, tasks, onMove, onRemove
}) {
  return (
    <section>
      <h2>{title} ({tasks.length})</h2>
      <ul>
        {tasks.map(t => (
          <TaskItem
            key={t.id}
            task={t}
            onMove={onMove}
            onRemove={onRemove}
          />
        ))}
      </ul>
      {tasks.length === 0 &&
        <p>Nothing here yet.</p>
      }
    </section>
  );
}`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>TaskItem.jsx — calls callbacks</div>
            <Code fontSize={12}>{`export default function TaskItem({
  task, onMove, onRemove
}) {
  return (
    <li>
      <span
        style={{
          textDecoration: task.done
            ? 'line-through'
            : 'none'
        }}
      >
        {task.text}
      </span>
      <button
        onClick={() => onMove(task.id)}
      >
        {task.done ? '← Undo' : '→ Done'}
      </button>
      <button
        onClick={() => onRemove(task.id)}
      >×</button>
    </li>
  );
}`}</Code>
          </Col>
        </Row>
        <Card style={{ marginTop: 14 }}>
          <Body><Hl color={C.yellow}>Checkpoint:</Hl> At this point the app should be fully functional. Add tasks, move them, remove them. Verify before Phase 4.</Body>
        </Card>
      </div>
    ),
  },

  // 16 — accessibility check
  {
    section: "Phase 4", title: "Accessibility in JSX",
    render: () => (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Label color={C.red}>⚠ Phase 4 — Accessibility Check</Label>
        <SlideTitle>Semantic HTML & ARIA inside <Hl color={C.teal}>JSX</Hl></SlideTitle>
        <Body>You already know this from your Accessibility session. JSX is still HTML — the same rules apply.</Body>
        <Row gap={18}>
          <Col>
            <Card color={C.red} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.red, marginBottom: 10, fontSize: 13 }}>❌ Inaccessible</div>
              <Code fontSize={12}>{`// Div soup
<div onClick={handleAdd}>Add</div>

// Unlabelled icon button
<button>×</button>

// Column with no landmark
<div className="column">...</div>

// Input with no label
<input placeholder="Task…" />`}</Code>
            </Card>
          </Col>
          <Col>
            <Card color={C.green}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: C.green, marginBottom: 10, fontSize: 13 }}>✅ Accessible</div>
              <Code fontSize={12}>{`// Real button
<button onClick={handleAdd}>Add</button>

// Descriptive aria-label
<button aria-label={"Remove " + task.text}>×</button>

// Landmark role
<section aria-label="To Do column">...</section>

// Linked label
<label htmlFor="task-input">New task</label>
<input id="task-input" />`}</Code>
            </Card>
          </Col>
        </Row>
        <BulletList color={C.red} items={[
          "Use <main>, <section>, <ul>, <li> — not <div> for everything",
          "Every icon/action button needs aria-label",
          "Colour alone must not convey task status — add text or icon",
          "Test with Tab key: can you operate the full app without a mouse?",
        ]} />
      </div>
    ),
  },

  // 17 — phase 4: keyboard support + conditional
  {
    section: "Phase 4", title: "Keyboard Support & Conditional Rendering",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.red}>Phase 4 — UX Polish</Label>
        <SlideTitle>Small touches. <Hl color={C.red}>Big impact</Hl> on real users.</SlideTitle>
        <Row gap={18}>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Keyboard: Enter to add</div>
            <Code fontSize={13}>{`// TaskInput.jsx
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleAdd();
  }}
/>`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "14px 0 8px" }}>Focus management after add</div>
            <Code fontSize={13}>{`const inputRef = useRef(null);

const handleAdd = () => {
  onAdd(text.trim());
  setText('');
  inputRef.current?.focus(); // return focus
};

<input ref={inputRef} />`}</Code>
          </Col>
          <Col>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, marginBottom: 8 }}>Conditional empty states</div>
            <Code fontSize={13}>{`// Column.jsx
{tasks.length === 0 ? (
  <p className="empty-state">
    {title === 'Done'
      ? 'Nothing done yet. Get to it! 💪'
      : 'All clear! Great work. 🎉'}
  </p>
) : (
  <ul>
    {tasks.map(t => (
      <TaskItem key={t.id} task={t}
        onMove={onMove}
        onRemove={onRemove}
      />
    ))}
  </ul>
)}`}</Code>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.muted, margin: "14px 0 8px" }}>Disable Add on empty input</div>
            <Code fontSize={13}>{`<button
  onClick={handleAdd}
  disabled={!text.trim()}
>
  Add
</button>`}</Code>
          </Col>
        </Row>
        <TeacherNote>Run a keyboard-only walkthrough with students: Tab to input, type, Enter to add, Tab to first task, Enter or click Move. This is where accessibility becomes tangible.</TeacherNote>
      </div>
    ),
  },

  // 18 — live app review
  {
    section: "Phase 4", title: "The Finished App",
    live: true,
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}><LiveDot /> Final result</Label>
        <SlideTitle>All four phases combined</SlideTitle>
        <Body>Try it with keyboard only. Tab, Enter, and arrow keys should get you everywhere.</Body>
        <KanbanDemo />
        <TeacherNote>At this point students should have a working app. Do a round of the room — help anyone who's behind. Then compare each student's code to the intended architecture.</TeacherNote>
      </div>
    ),
  },

  // 19 — concepts recap
  {
    section: "Summary", title: "Concepts Recap",
    render: () => (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Label color={C.green}>Wrap-up</Label>
        <SlideTitle>What you built — and <Hl color={C.green}>why it matters</Hl></SlideTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["⚡", "Declarative UI", "Describe the result, not the steps. React handles the DOM."],
            ["🌳", "Component Tree", "Break UI into reusable pieces before writing a line of code."],
            ["🎯", "Single Source of Truth", "One tasks[] array. One owner. No duplication."],
            ["⬆", "Lifting State Up", "Parent owns state, passes callbacks down, receives data up."],
            ["🧊", "Immutability", "Always return a new array/object. Never mutate state directly."],
            ["🎛", "Controlled Inputs", "React drives the value. The DOM never owns data."],
            ["⌨", "Keyboard Support", "Enter to submit. focus() management. Tab-navigable UI."],
            ["♿", "Accessibility", "Semantic HTML + aria-label inside JSX — same rules as HTML."],
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
    section: "Next Steps", title: "Where to Go From Here",
    render: () => (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
        <BigTitle>Extend the <Hl color={C.green}>tracker</Hl> yourself</BigTitle>
        <Body>The best learning is building. Here are four extensions to try on your own.</Body>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left", margin: "24px 0" }}>
          {[
            ["💾", "Persist to localStorage", "Wrap setTasks in useEffect — tasks survive a page refresh."],
            ["🏷", "Task priority tags", "Add a 'priority' field. Render a colour chip. Use filter."],
            ["🌐", "Fetch tasks from API", "Replace hard-coded data with fetch() inside useEffect."],
            ["🗂", "Multiple boards", "Add a board selector. Lift state one level higher into a boards[] array."],
          ].map(([icon, title, desc]) => (
            <Card key={title}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: C.blue, marginBottom: 4 }}>{title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>{desc}</div>
            </Card>
          ))}
        </div>
        <Code fontSize={13}>{`# Resources
# docs.react.dev          — official docs (excellent)
# react.dev/learn         — interactive tutorial
# vitejs.dev              — Vite docs
# web.dev/accessibility   — accessibility deep-dive`}</Code>
      </div>
    ),
  },
];

/* ── shell ─────────────────────────────────────────── */
export default function ReactInMotionLecture() {
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

  const animStyle = {
    "out-left":  { opacity: 0, transform: "translateX(-32px)", transition: "all 0.18s ease" },
    "out-right": { opacity: 0, transform: "translateX(32px)",  transition: "all 0.18s ease" },
    "in":        { opacity: 0, transform: "translateY(10px)" },
    null:        { opacity: 1, transform: "none",               transition: "all 0.22s ease" },
  }[anim] || {};

  // Section color map
  const sectionColors = {
    "Welcome": C.teal, "Overview": C.blue, "The Why": C.red, "The Blueprint": C.purple,
    "State Strategy": C.yellow, "Phase 1": C.teal, "Phase 2": C.green,
    "Phase 3": C.orange, "Senior Insight": C.orange, "Phase 4": C.red,
    "Summary": C.green, "Next Steps": C.blue,
  };
  const sectionColor = sectionColors[slide.section] || C.blue;

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
        input[type=range] { accent-color: ${C.blue}; }
      `}</style>

      {/* top bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "monospace", fontSize: 12, color: C.dim }}>
          <span>ReactInMotionLecture.jsx</span>
          {slide.live && <span style={{ color: C.green, display: "flex", alignItems: "center", gap: 5 }}><LiveDot />interactive</span>}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dim }}>{cur + 1} / {SLIDES.length}</div>
      </div>

      {/* section + minimap */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "5px 22px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: sectionColor, whiteSpace: "nowrap", marginRight: 6 }}>{slide.section}</span>
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => jump(i)} title={s.title}
            style={{ width: i === cur ? 18 : 6, height: 6, borderRadius: 3, background: i === cur ? sectionColor : i < cur ? C.green + "88" : C.border, border: "none", cursor: "pointer", flexShrink: 0, padding: 0, transition: "all 0.25s" }} />
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "monospace", fontSize: 9, color: C.dim, whiteSpace: "nowrap" }}>← → keys</span>
      </div>

      {/* slide content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "36px 44px", width: "100%", maxWidth: 1020, margin: "0 auto", ...animStyle }}>
          {slide.render()}
        </div>
      </div>

      {/* nav */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "10px 22px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <button onClick={() => go(-1)} disabled={cur === 0}
          style={{ fontFamily: "monospace", fontSize: 12, padding: "6px 18px", background: cur === 0 ? "transparent" : C.border, border: `1px solid ${cur === 0 ? C.border : C.border2}`, borderRadius: 7, color: cur === 0 ? C.dim : C.text, cursor: cur === 0 ? "default" : "pointer" }}>
          ← prev
        </button>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sectionColor, transition: "width 0.35s ease" }} />
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, maxWidth: 220, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slide.title}</span>
        <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sectionColor, transition: "width 0.35s ease" }} />
        </div>
        <button onClick={() => go(1)} disabled={cur === SLIDES.length - 1}
          style={{ fontFamily: "monospace", fontSize: 12, padding: "6px 18px", background: cur === SLIDES.length - 1 ? "transparent" : C.border, border: `1px solid ${cur === SLIDES.length - 1 ? C.border : C.border2}`, borderRadius: 7, color: cur === SLIDES.length - 1 ? C.dim : C.text, cursor: cur === SLIDES.length - 1 ? "default" : "pointer" }}>
          next →
        </button>
      </div>
    </div>
  );
}