import { useEffect, useState } from "react";
import {
  Timer, CalendarDays, BarChart3, Settings as Gear,
  ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal,
  Check, X, Clock, ListChecks, FileText, GripVertical, Square,
  Loader2, Flashlight, Camera, Landmark, Wallet, Tag, Download, ListFilter, ListPlus,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   Code-recreated DayDraft app screens — the building blocks every phone on the
   landing site is made of. Surfaces (.dd-card, .dd-accent-grad, .dd-ck-surface…)
   are ported verbatim from the app's index.css and pinned to its dark theme, so
   each screen reads as the genuine product. Two greens, exactly like the app:
   `C.success` (soft teal — money / earnings / timeline "done") and `C.em`
   (checklist emerald — checklist mode only).
   ─────────────────────────────────────────────────────────────────────────── */

export const W = 290;
export const H = 600;

export const C = {
  primary: "hsl(var(--dd-primary))",
  indigo: "hsl(var(--dd-indigo))",
  fg: "hsl(var(--dd-fg))",
  fg2: "hsl(var(--dd-fg2))",
  mfg: "hsl(var(--dd-mfg))",
  success: "hsl(var(--dd-success))", // app --success: money, earnings, done
  em: "hsl(var(--dd-ck))",           // checklist emerald (checklist scene only)
  danger: "hsl(var(--dd-danger))",
  surface: "hsl(var(--dd-surface))",
  border: "hsl(var(--dd-border) / 0.45)",
  muted: "hsl(var(--dd-muted))",
};

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TABS = [
  { icon: Timer, label: "Track" },
  { icon: CalendarDays, label: "Plan" },
  { icon: BarChart3, label: "Reports" },
  { icon: Gear, label: "Settings" },
];

export type SceneProps = { active: boolean; playing?: boolean };

/* ── Chrome ─────────────────────────────────────────────────────────────── */

function StatusBar({ light = true }: { light?: boolean }) {
  const col = light ? C.fg : C.fg;
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0" style={{ color: col }}>
      <span className="text-[12.5px] font-semibold tracking-tight">14:46</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px] h-3">
          {[5, 8, 11, 13].map((h, i) => <span key={i} style={{ height: h, background: col }} className="w-[3px] rounded-sm" />)}
        </div>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C9.8 2.5 11.5 3.2 12.7 4.4L8 9.2 3.3 4.4C4.5 3.2 6.2 2.5 8 2.5Z" fill={col} opacity="0.9"/></svg>
        <div className="h-[12px] w-[22px] rounded-[3px] relative" style={{ border: `1px solid hsl(var(--dd-fg) / 0.5)` }}>
          <span className="absolute inset-[1.5px] right-[7px] rounded-[1px]" style={{ background: C.success }} />
        </div>
      </div>
    </div>
  );
}

function TabBar({ activeTab }: { activeTab: number }) {
  return (
    <div className="flex items-stretch justify-around px-2 pt-2 pb-3.5 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
      {TABS.map((t, i) => {
        const on = i === activeTab;
        const Icon = t.icon;
        return (
          <div key={t.label} className="flex flex-col items-center gap-1 flex-1" style={{ color: on ? C.primary : C.mfg }}>
            <div className="h-7 px-3.5 rounded-full flex items-center justify-center transition-all duration-300"
                 style={{ background: on ? "hsl(var(--dd-primary) / 0.16)" : "transparent" }}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={on ? 2.4 : 2} />
            </div>
            <span className="text-[9.5px] font-semibold tracking-tight">{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** A full app screen: status bar · scrollless content · tab bar. */
function AppScreen({ tab, children, className = "" }: { tab: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex h-full flex-col ${className}`} style={{ background: "hsl(var(--dd-bg))" }}>
      <StatusBar />
      <div className="relative flex-1 overflow-hidden">{children}</div>
      <TabBar activeTab={tab} />
    </div>
  );
}

function TodayHeader() {
  return (
    <div className="dd-card flex items-center justify-between px-3.5 mb-2.5" style={{ height: 44, borderRadius: 15 }}>
      <ChevronLeft className="w-4 h-4" style={{ color: C.mfg }} />
      <span className="font-display text-[15px] font-semibold" style={{ color: C.fg }}>Today</span>
      <div className="flex items-center gap-3" style={{ color: C.mfg }}>
        <ChevronRight className="w-4 h-4" />
        <MoreHorizontal className="w-4 h-4" />
      </div>
    </div>
  );
}

function PlanPill({ mode }: { mode: "timeline" | "checklist" }) {
  const Seg = ({ on, children }: { on: boolean; children: React.ReactNode }) => (
    <div className="relative z-10 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold rounded-xl transition-colors duration-300"
         style={{ color: on ? "#fff" : "hsl(var(--dd-fg2) / 0.7)" }}>{children}</div>
  );
  return (
    <div className="relative h-10 rounded-2xl p-1 mb-2.5" style={{ background: "hsl(var(--dd-muted) / 0.55)", border: `1px solid ${C.border}` }}>
      <div className="absolute top-1 bottom-1 rounded-xl shadow-sm"
           style={{
             left: 4, width: "calc(50% - 4px)",
             background: mode === "checklist" ? C.em : C.primary,
             transform: mode === "timeline" ? "translateX(0)" : "translateX(100%)",
             transition: "transform 0.4s cubic-bezier(0.65,0,0.35,1), background 0.3s",
           }} />
      <div className="relative grid grid-cols-2 h-full">
        <Seg on={mode === "timeline"}><Clock className="w-3.5 h-3.5" /> Timeline</Seg>
        <Seg on={mode === "checklist"}><ListChecks className="w-3.5 h-3.5" /> Checklist</Seg>
      </div>
    </div>
  );
}

/* ── Timeline ─────────────────────────────────────────────────────────────── */

export type TLTask = { time: string; title: string; dur: string; bar: string; done: boolean };

const TL: TLTask[] = [
  { time: "14:45", title: "Call dad", dur: "30m", bar: C.primary, done: true },
  { time: "15:15", title: "Do coding for a client", dur: "1h", bar: C.indigo, done: false },
  { time: "16:45", title: "Send report to client", dur: "30m", bar: "hsl(var(--dd-accent))", done: false },
  { time: "17:30", title: "Dinner with Vicky", dur: "1h", bar: "hsl(38 92% 52%)", done: false },
];

export function TimelineScene({ active, tasks = TL, totalLabel = "3h" }: SceneProps & { tasks?: TLTask[]; totalLabel?: string }) {
  const TL = tasks;
  const done = TL.filter((t) => t.done).length;
  const pct = Math.round((done / TL.length) * 100);
  return (
    <AppScreen tab={1}>
      <div className="h-full px-3.5 pt-1 pb-2 flex flex-col">
        <TodayHeader />
        <PlanPill mode="timeline" />

        {/* Progress summary — primary-tinted, matches DayView */}
        <div className="rounded-2xl px-4 py-3 mb-2.5"
             style={{ border: "1px solid hsl(var(--dd-primary) / 0.2)", background: "linear-gradient(180deg, hsl(var(--dd-primary) / 0.13) 0%, hsl(var(--dd-primary) / 0.05) 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-[18px] font-bold leading-none" style={{ color: C.fg }}>{done}</span>
              <span className="text-[12px] font-medium" style={{ color: "hsl(var(--dd-mfg) / 0.65)" }}>/ {TL.length} done</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] tabular-nums" style={{ color: "hsl(var(--dd-mfg) / 0.55)" }}>{totalLabel}</span>
              <span className="text-[14px] font-bold tabular-nums leading-none" style={{ color: C.primary }}>{pct}%</span>
            </div>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--dd-primary) / 0.12)", boxShadow: "inset 0 1px 2px hsl(0 0% 0% / 0.18)" }}>
            <div className="h-full rounded-full" style={{
              width: active ? `${pct}%` : "5%",
              background: `linear-gradient(90deg, ${C.primary}, ${C.indigo})`,
              boxShadow: "0 0 10px hsl(var(--dd-primary) / 0.5)",
              transition: "width 0.9s ease 0.35s",
            }} />
          </div>
        </div>

        {/* Inline Start CTA */}
        <button className="h-11 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 mb-2.5"
                style={{ background: C.primary, color: "#fff", border: "1px solid hsl(var(--dd-primary) / 0.2)", boxShadow: "0 8px 24px -6px hsl(var(--dd-primary) / 0.5)" }}>
          <Play className="w-4 h-4" /> Focus on next block
        </button>

        <div className="flex flex-col gap-1.5">
          {TL.map((t, i) => (
            <div key={t.title} className="flex items-center gap-2 rounded-2xl px-2.5 py-2"
                 style={{
                   border: `1px solid ${C.border}`,
                   background: "linear-gradient(168deg, hsl(var(--dd-surface) / 0.85) 0%, hsl(var(--dd-surface) / 0.7) 100%)",
                   opacity: active ? 1 : 0,
                   transform: active ? "translateY(0)" : "translateY(12px)",
                   transition: `opacity 0.45s ease ${0.2 + i * 0.12}s, transform 0.45s ease ${0.2 + i * 0.12}s`,
                 }}>
              {/* Time column */}
              <div className="w-[40px] shrink-0 text-center">
                <span className="text-[13px] font-semibold tabular-nums" style={{ color: t.done ? "hsl(var(--dd-mfg) / 0.7)" : "hsl(var(--dd-fg2) / 0.9)" }}>{t.time}</span>
              </div>
              {/* Accent stripe */}
              <span className="w-[4px] h-9 rounded-full shrink-0" style={{ background: t.bar }} />
              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate leading-tight" style={{ color: t.done ? "hsl(var(--dd-fg) / 0.6)" : C.fg, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</p>
                <p className="text-[10.5px] mt-[3px] tabular-nums leading-none" style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}>{t.dur}{t.done ? " planned" : ""}</p>
              </div>
              <Circle done={t.done} accent={C.success} />
              <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--dd-mfg) / 0.45)" }} />
            </div>
          ))}
        </div>
      </div>
    </AppScreen>
  );
}

/* ── Composer (brain-dump → plan) ───────────────────────────────────────────── */

const DUMP_LINES = ["Call dad", "Do coding for a client", "Send report to client", "Dinner with Vicky"];

export function ComposerScene({ active, lines = DUMP_LINES }: SceneProps & { lines?: string[] }) {
  const [typed, setTyped] = useState(0);
  const [building, setBuilding] = useState(false);
  useEffect(() => {
    if (!active) { setTyped(0); setBuilding(false); return; }
    const timers: number[] = [];
    lines.forEach((_, i) => timers.push(window.setTimeout(() => setTyped(i + 1), 500 + i * 520)));
    timers.push(window.setTimeout(() => setBuilding(true), 600 + lines.length * 520));
    return () => timers.forEach(clearTimeout);
  }, [active, lines]);

  return (
    <AppScreen tab={1}>
      {/* dimmed plan behind the sheet */}
      <div className="h-full px-3.5 pt-1 flex flex-col" style={{ opacity: 0.4 }}>
        <TodayHeader />
        <PlanPill mode="timeline" />
      </div>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />

      {/* bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 px-4 pt-4 pb-4 flex flex-col"
           style={{
             background: "hsl(var(--dd-surface))",
             borderTop: `1px solid hsl(var(--dd-border) / 0.6)`,
             borderTopLeftRadius: 26, borderTopRightRadius: 26,
             boxShadow: "0 -18px 50px -10px rgba(0,0,0,0.7)",
             transform: active ? "translateY(0)" : "translateY(100%)",
             transition: "transform 0.55s cubic-bezier(0.32,0.72,0,1)",
           }}>
        <div className="mx-auto mb-3 h-1 w-9 rounded-full" style={{ background: "hsl(var(--dd-mfg) / 0.4)" }} />
        <div className="flex items-center gap-2 mb-2">
          <ListPlus className="w-4 h-4" style={{ color: C.primary }} />
          <span className="text-[14px] font-bold" style={{ color: C.fg }}>Add tasks</span>
        </div>
        <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: C.mfg }}>
          Type or paste your tasks — one per line, bullets, commas, anything. We'll split them into blocks.
        </p>

        <div className="rounded-2xl px-3 py-2.5 min-h-[132px]"
             style={{ background: "hsl(var(--dd-bg))", border: `1px solid hsl(var(--dd-border) / 0.5)` }}>
          {lines.map((line, i) => (
            <div key={line} className="flex items-center gap-1.5 py-[3px] text-[12.5px]"
                 style={{ opacity: i < typed ? 1 : 0, transform: i < typed ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.3s ease, transform 0.3s ease", color: C.fg2 }}>
              <span style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}>•</span> {line}
              {i === typed - 1 && !building && <span className="ml-0.5 inline-block w-[2px] h-[13px] align-middle" style={{ background: C.primary }} />}
            </div>
          ))}
        </div>

        <button className="mt-3 h-12 rounded-2xl text-[13.5px] font-semibold flex items-center justify-center gap-2"
                style={{ background: C.primary, color: "#fff", boxShadow: "0 8px 20px -6px hsl(var(--dd-primary) / 0.8)" }}>
          {building
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Reading your tasks…</>
            : "Continue"}
        </button>
      </div>
    </AppScreen>
  );
}

/* ── Checklist ──────────────────────────────────────────────────────────────── */

const CL = [
  { t: "Buy groceries", end: "done" as const },
  { t: "Email the client", end: "done" as const },
  { t: "Send the report", end: "done" as const },
  { t: "Renew gym pass", end: "failed" as const },
  { t: "Book dentist", end: "open" as const },
];

export function ChecklistScene({ active }: SceneProps) {
  const doneCount = CL.filter((c) => c.end === "done").length;
  const failCount = CL.filter((c) => c.end === "failed").length;
  const total = CL.length;
  const shownDone = active ? doneCount : 0;
  return (
    <AppScreen tab={1} className="ck">
      <div className="ck h-full px-3.5 pt-1 pb-2 flex flex-col">
        <TodayHeader />
        <PlanPill mode="checklist" />

        {/* Top progress card (ChecklistView) */}
        <div className="rounded-[18px] px-4 py-3 mb-2.5" style={{ border: `1px solid ${C.border}`, background: "linear-gradient(168deg, hsl(var(--dd-surface) / 0.85), hsl(var(--dd-surface) / 0.62))" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[13px] tabular-nums" style={{ color: C.fg }}>
              <span className="font-bold text-[15px]">{shownDone}</span>
              <span style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}> / {total} done</span>
            </div>
            <span className="text-[12px] font-semibold" style={{ color: C.em }}>{shownDone === total ? "All done!" : "Keep going!"}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--dd-muted) / 0.6)" }}>
            <div className="dd-accent-grad-h h-full rounded-full origin-left"
                 style={{ width: "100%", transform: active ? `scaleX(${shownDone / total})` : "scaleX(0.04)", boxShadow: "0 0 10px hsl(var(--dd-ck) / 0.5)", transition: "transform 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.3s" }} />
          </div>
        </div>

        {/* Category card — matches ChecklistGroup */}
        <div className="overflow-hidden" style={{ borderRadius: 20, border: `1px solid ${C.border}`, background: "linear-gradient(90deg, hsl(var(--dd-ck) / 0.06) 0%, transparent 100%), linear-gradient(168deg, hsl(var(--dd-surface) / 0.9), hsl(var(--dd-surface) / 0.72))" }}>
          <div className="flex items-center gap-2 px-3 pt-3 pb-2.5">
            <ChevronDown className="w-4 h-4 shrink-0" strokeWidth={2.5} style={{ color: "hsl(var(--dd-mfg) / 0.4)" }} />
            <ListChecks className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} style={{ color: C.em }} />
            <span className="flex-1 min-w-0 text-[13px] font-bold uppercase tracking-[0.1em] truncate" style={{ color: C.em }}>Errands</span>
            <ChecklistRing done={shownDone} total={total} failed={active ? failCount : 0} />
            <MoreHorizontal className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--dd-mfg) / 0.5)" }} />
          </div>
          <div className="mx-3 h-px" style={{ background: "hsl(var(--dd-ck) / 0.18)" }} />
          <div className="px-3 pb-1.5">
            {CL.map((c, i) => {
              const delay = 0.5 + i * 0.4;
              const isDone = active && c.end === "done";
              const isFail = active && c.end === "failed";
              return (
                <div key={c.t} className="flex items-center gap-2.5 py-[7px]" style={{ borderTop: i ? `1px solid hsl(var(--dd-border) / 0.25)` : "none" }}>
                  <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--dd-mfg) / 0.45)" }} />
                  <span className="flex-1 min-w-0 text-[13.5px] truncate" style={{
                    color: isDone ? "hsl(var(--dd-fg) / 0.4)" : isFail ? "hsl(var(--dd-fg2) / 0.6)" : C.fg,
                    textDecoration: isDone ? "line-through" : "none",
                    transition: `color 0.3s ease ${delay}s`,
                  }}>{c.t}</span>
                  <ChecklistCircle done={isDone} failed={isFail} delay={delay} />
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[10px] text-center mt-3 leading-relaxed" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>
          Tap to tick off · double-tap to skip · hold for options
        </p>
      </div>
    </AppScreen>
  );
}

/** Compact circular progress ring with X/Y inside — matches ChecklistGroup's ProgressRing. */
function ChecklistRing({ done, total, failed = 0 }: { done: number; total: number; failed: number }) {
  const size = 28, r = 11, circ = 2 * Math.PI * r;
  const doneLen = total > 0 ? (done / total) * circ : 0;
  const failLen = total > 0 ? (failed / total) * circ : 0;
  if (total > 0 && done === total) {
    return (
      <span className="dd-accent-grad dd-accent-glow flex items-center justify-center rounded-full shrink-0" style={{ height: size, width: size }}>
        <Check className="text-white" strokeWidth={3} style={{ width: 13, height: 13 }} />
      </span>
    );
  }
  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ height: size, width: size }}>
      <svg className="-rotate-90 absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--dd-mfg) / 0.25)" strokeWidth="2" />
        {done > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--dd-ck))" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${doneLen} ${circ - doneLen}`} className="transition-[stroke-dasharray] duration-500 ease-out" />}
        {failLen > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--dd-danger))" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${failLen} ${circ - failLen}`} strokeDashoffset={-doneLen} className="transition-[stroke-dasharray] duration-500 ease-out" />}
      </svg>
      <span className="relative dd-mono font-bold leading-none" style={{ fontSize: 8, color: C.em }}>{done}/{total}</span>
    </div>
  );
}

/* ── Tracker ────────────────────────────────────────────────────────────────── */

export function TrackerScene({ active, playing = true }: SceneProps) {
  const [sec, setSec] = useState(2538); // 00:42:18
  useEffect(() => {
    if (!active || !playing) return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active, playing]);

  const earn = (sec / 3600) * 500;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tstr = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;

  return (
    <AppScreen tab={0}>
      <div className="h-full px-4 pt-1.5 pb-2 flex flex-col">
        {/* Greeting */}
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>Friday, June 20</p>
        <h3 className="font-display text-[22px] font-bold mb-3.5 tracking-tight" style={{ color: C.fg }}>Good afternoon</h3>

        {/* Tracker hero — RECORDING (faithful to HomeTrackerHero active state) */}
        <div
          className="rounded-[24px] px-5 pt-5 pb-5"
          style={{
            border: "1px solid hsl(var(--dd-primary) / 0.4)",
            background:
              "radial-gradient(120% 130% at 50% 0%, hsl(var(--dd-primary) / 0.12) 0%, transparent 58%), linear-gradient(168deg, hsl(var(--dd-surface) / 0.92) 0%, hsl(var(--dd-surface) / 0.72) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 36px -10px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--dd-mfg) / 0.75)" }}>Recording</span>
            <span className="text-[11px] font-medium" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>All stats →</span>
          </div>

          <div className="mt-4 flex flex-col items-center text-center">
            {/* Category pill */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "hsl(var(--dd-fg) / 0.07)", border: `1px solid ${C.border}` }}>
              <span className={`h-1.5 w-1.5 rounded-full ${active && playing ? "animate-pulse" : ""}`} style={{ background: C.primary, boxShadow: "0 0 0 3px hsl(var(--dd-primary) / 0.22)" }} />
              <span className="text-[12px] font-medium" style={{ color: "hsl(var(--dd-fg) / 0.85)" }}>NeoDimmer project</span>
            </div>

            {/* Task | Note row */}
            <div className="mt-2.5 flex items-center gap-2 text-[12px]" style={{ color: "hsl(var(--dd-mfg) / 0.75)" }}>
              <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3" /> Task</span>
              <span className="h-3 w-px" style={{ background: C.border }} />
              <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" /> Note</span>
            </div>

            {/* Big timer */}
            <div className="mt-3.5 dd-mono font-semibold tabular-nums leading-none tracking-[-0.03em]" style={{ fontSize: 47, color: C.fg }}>{tstr}</div>

            {/* Earnings pill */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: "hsl(var(--dd-success) / 0.1)", border: "1px solid hsl(var(--dd-success) / 0.22)" }}>
              <span className="text-[11px] font-medium" style={{ color: "hsl(var(--dd-success) / 0.7)" }}>earned</span>
              <span className="dd-mono text-[14px] font-semibold tabular-nums" style={{ color: C.success }}>+US${earn.toFixed(2)}</span>
            </div>

            {/* Stop */}
            <button className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold text-white"
                    style={{ background: `linear-gradient(180deg, hsl(var(--dd-danger)), hsl(3 75% 54%))`, boxShadow: "0 8px 20px -6px hsl(var(--dd-danger) / 0.6), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
              <Square className="w-3.5 h-3.5" fill="currentColor" /> Stop
            </button>
          </div>
        </div>

        {/* Today's timeline progress */}
        <div className="mt-3.5 rounded-[24px] px-4 py-4" style={{ border: `1px solid ${C.border}`, background: "linear-gradient(168deg, hsl(var(--dd-surface) / 0.6), hsl(var(--dd-surface) / 0.4))" }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>Today's timeline</span>
            <span className="text-[11px] tabular-nums" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>1/4</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--dd-muted) / 0.5)" }}>
            <div className="h-full rounded-full" style={{ width: "25%", background: `linear-gradient(90deg, ${C.primary}, ${C.indigo})` }} />
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] shrink-0" style={{ color: "hsl(var(--dd-mfg) / 0.55)" }}>Next</span>
            <span className="text-[12px] font-medium truncate" style={{ color: "hsl(var(--dd-fg) / 0.9)" }}>Do coding for a client</span>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}

/* ── Focus ring (the planned-block timer — "you do the work") ─────────────────── */

export function FocusScene({ active }: SceneProps) {
  const planned = 3600; // 1h
  const [sec, setSec] = useState(1384);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tstr = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
  const ratio = Math.min(1, sec / planned);
  const R = 92;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: "hsl(var(--dd-bg))" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44" style={{ background: "radial-gradient(60% 100% at 50% 0%, hsl(var(--dd-primary) / 0.2), transparent 70%)" }} />
      <StatusBar />
      <div className="relative flex-1 flex flex-col items-center px-6">
        {/* Cancel */}
        <div className="absolute top-1 left-0 h-9 w-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.border}`, background: "hsl(var(--dd-bg) / 0.6)" }}>
          <X className="w-4 h-4" style={{ color: C.mfg }} />
        </div>

        {/* Focus pill */}
        <div className="mt-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
             style={{ background: "hsl(var(--dd-primary) / 0.1)", border: "1px solid hsl(var(--dd-primary) / 0.3)", color: C.primary }}>
          Focus
        </div>

        <h1 className="mt-4 font-display text-[21px] font-semibold text-center leading-tight tracking-[-0.02em]" style={{ color: C.fg }}>
          Do coding for a client
        </h1>

        {/* Isometric 3D ring */}
        <div className="relative mt-7 h-[200px] w-[200px] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(55deg)" }}>
            <div className="absolute inset-0 rounded-full" style={{ transform: "translateZ(-34px)", background: "radial-gradient(circle, hsl(var(--dd-primary) / 0.24) 0%, transparent 72%)" }} />
            {[0, 9, 18, 27].map((z, i) => (
              <svg key={i} className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200" style={{ transform: `translateZ(-${z}px)`, opacity: 1 - i * 0.2 }}>
                <circle cx="100" cy="100" r={R} fill="none" stroke="hsl(var(--dd-muted))" strokeWidth="8" />
                {i === 0 && (
                  <circle
                    cx="100" cy="100" r={R} fill="none" stroke="hsl(var(--dd-primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${CIRC} ${CIRC}`} strokeDashoffset={CIRC * (1 - ratio)}
                    style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 4px hsl(var(--dd-primary) / 0.5))" }}
                  />
                )}
              </svg>
            ))}
          </div>
          <div className="relative z-10 flex flex-col items-center" style={{ transform: "translateZ(40px)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1" style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.primary }} /> NeoDimmer
            </div>
            <div className="dd-mono font-semibold tabular-nums leading-none mt-1.5" style={{ fontSize: 40, color: C.fg }}>{tstr}</div>
            <div className="text-[11px] mt-1.5" style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}>of 1h</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 w-[256px] flex flex-col gap-2">
          <button className="w-full flex items-center justify-center gap-2 rounded-[18px] text-[15px] font-semibold text-white"
                  style={{ height: 50, background: C.primary, boxShadow: "0 0 28px -4px hsl(var(--dd-primary) / 0.5)" }}>
            <Check className="w-5 h-5" strokeWidth={2.75} /> Done
          </button>
          <button className="w-full flex items-center justify-center rounded-[18px] text-[13px] font-medium"
                  style={{ height: 44, border: `1px solid ${C.border}`, color: C.mfg, background: "hsl(var(--dd-surface) / 0.5)" }}>
            Skip
          </button>
        </div>

        <p className="mt-auto mb-4 text-[12px]" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>
          Next up: <span style={{ color: "hsl(var(--dd-fg) / 0.9)", fontWeight: 500 }}>Dinner with Vicky</span>
        </p>
      </div>
    </div>
  );
}

/* ── Lock screen + Live Activity (running total on the lock screen) ──────────── */

export function LockScene({ active }: SceneProps) {
  const [sec, setSec] = useState(2538);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tstr = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
  const earn = ((sec / 3600) * 500).toFixed(2);

  return (
    <div className="h-full flex flex-col items-center relative overflow-hidden"
         style={{ background: "radial-gradient(120% 80% at 50% -5%, #1a2740 0%, #0a0f1c 46%, #05070d 100%)" }}>
      {/* glow blobs */}
      <div className="absolute -top-10 -left-8 w-44 h-44 rounded-full blur-3xl opacity-40" style={{ background: "hsl(var(--dd-primary) / 0.5)" }} />
      <div className="absolute top-24 -right-10 w-44 h-44 rounded-full blur-3xl opacity-30" style={{ background: "hsl(var(--dd-indigo) / 0.5)" }} />

      {/* Clock (the frame supplies the live Dynamic Island above) */}
      <div className="relative z-10 mt-[58px] text-center" style={{ color: "#fff" }}>
        <p className="text-[13px] font-medium opacity-80">Friday, June 20</p>
        <p className="font-display font-bold leading-none mt-1" style={{ fontSize: 76, letterSpacing: "-0.03em" }}>14:46</p>
      </div>

      {/* Live Activity card */}
      <div className="relative z-10 mt-9 w-[244px] rounded-[22px] px-4 py-3.5"
           style={{ background: "rgba(20,24,33,0.66)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 10px 30px -8px rgba(0,0,0,0.7)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="dd-accent-grad flex h-7 w-7 items-center justify-center rounded-[9px]"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.indigo})` }}>
            <Timer className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold leading-tight" style={{ color: "#fff" }}>NeoDimmer project</p>
            <p className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.55)" }}>DayDraft · tracking</p>
          </div>
          <span className="ml-auto h-2 w-2 rounded-full animate-pulse" style={{ background: C.success }} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Elapsed</p>
            <p className="dd-mono text-[22px] font-semibold leading-none" style={{ color: "#fff" }}>{tstr}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Earned</p>
            <p className="dd-mono text-[22px] font-bold leading-none" style={{ color: C.success }}>US${earn}</p>
          </div>
        </div>
      </div>

      {/* bottom controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-9 pb-5">
        <span className="h-11 w-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.14)" }}>
          <Flashlight className="w-5 h-5" style={{ color: "#fff" }} />
        </span>
        <span className="h-11 w-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.14)" }}>
          <Camera className="w-5 h-5" style={{ color: "#fff" }} />
        </span>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
    </div>
  );
}

/* ── Reports ────────────────────────────────────────────────────────────────── */

export function ReportsScene({ active }: SceneProps) {
  const periods = ["Day", "Week", "Month", "Custom"];
  const cats = [
    { n: "NeoDimmer project", meta: "8h 20m · US$500/h", pay: "US$4,166", c: C.primary, w: 66 },
    { n: "Client — Acme", meta: "4h 10m · US$500/h", pay: "US$2,084", c: C.indigo, w: 34 },
  ];
  return (
    <AppScreen tab={2}>
      <div className="h-full px-4 pt-1 pb-2 flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>Reports</p>
        <h3 className="font-display text-[20px] font-bold mb-2.5 tracking-tight" style={{ color: C.fg }}>Time insights</h3>

        {/* Period segmented control */}
        <div className="grid grid-cols-4 p-1 rounded-2xl mb-2.5 w-full max-w-[240px]" style={{ background: "hsl(var(--dd-muted) / 0.5)", border: `1px solid ${C.border}` }}>
          {periods.map((p) => {
            const on = p === "Week";
            return (
              <div key={p} className="h-8 rounded-xl flex items-center justify-center text-[12px] font-semibold transition-colors"
                   style={{ background: on ? "hsl(var(--dd-surface-elevated))" : "transparent", color: on ? C.fg : "hsl(var(--dd-fg2) / 0.7)", border: on ? `1px solid ${C.border}` : "1px solid transparent", boxShadow: on ? "0 1px 2px rgba(0,0,0,0.3)" : "none" }}>{p}</div>
            );
          })}
        </div>

        {/* Category filter chip */}
        <span className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium mb-2.5" style={{ border: `1px solid ${C.border}`, color: "hsl(var(--dd-fg2) / 0.85)" }}>
          <ListFilter className="w-3 h-3" /> All categories
        </span>

        {/* Summary card */}
        <div
          className="rounded-[20px] px-4 py-3 mb-2.5"
          style={{
            border: "1px solid hsl(var(--dd-primary) / 0.35)",
            background: "radial-gradient(120% 130% at 50% 0%, hsl(var(--dd-primary) / 0.1) 0%, transparent 58%), linear-gradient(168deg, hsl(var(--dd-surface) / 0.85) 0%, hsl(var(--dd-surface) / 0.65) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="min-w-0">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] truncate" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>Total tracked</p>
              <p className="mt-0.5 font-display text-[24px] font-semibold dd-mono tabular-nums leading-none" style={{ color: C.fg }}>12h 30m</p>
            </div>
            <div className="min-w-0 pl-4" style={{ borderLeft: `1px solid ${C.border}` }}>
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] truncate" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>Estimated pay</p>
              <p className="mt-0.5 font-display text-[20px] font-semibold dd-mono tabular-nums leading-none" style={{ color: C.success }}>US$6,250</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[11px]" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>15 Jun – 19 Jun 2026</span>
            <span className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "hsl(var(--dd-success) / 0.15)", border: "1px solid hsl(var(--dd-success) / 0.3)", color: C.success }}>USD <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>

        {/* By category */}
        <div className="rounded-[20px] px-4 py-3 mb-2.5" style={{ border: `1px solid ${C.border}`, background: "linear-gradient(168deg, hsl(var(--dd-surface) / 0.55), hsl(var(--dd-surface) / 0.38))" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>By category</span>
            <span className="text-[11px] font-semibold" style={{ color: C.primary }}>Expand all</span>
          </div>
          {/* Stacked proportion bar */}
          <div className="h-2 w-full rounded-full overflow-hidden flex mb-2.5" style={{ background: "hsl(var(--dd-muted) / 0.4)" }}>
            {cats.map((c, i) => (
              <div key={c.n} className={`h-full ${i === 0 ? "rounded-l-full" : ""} ${i === cats.length - 1 ? "rounded-r-full" : ""}`} style={{ width: `${c.w}%`, background: c.c }} />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {cats.map((r, i) => (
              <div key={r.n} className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                   style={{ border: `1px solid ${C.border}`, background: "hsl(var(--dd-muted) / 0.3)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(8px)", transition: `opacity 0.4s ease ${0.15 + i * 0.1}s, transform 0.4s ease ${0.15 + i * 0.1}s` }}>
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: r.c }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: C.fg }}>{r.n}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: C.mfg }}>{r.meta}</p>
                </div>
                <span className="dd-mono text-[12.5px] font-bold shrink-0" style={{ color: C.success }}>{r.pay}</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--dd-mfg) / 0.5)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Export — PDF + CSV cards (faithful to Reports export section) */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button className="relative h-[58px] rounded-2xl flex flex-col items-center justify-center gap-0.5 overflow-hidden"
                  style={{ border: "1px solid hsl(var(--dd-primary) / 0.55)", background: "hsl(var(--dd-primary) / 0.16)" }}>
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dd-primary) / 0.5), transparent)" }} />
            <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: C.primary }}><FileText className="w-3.5 h-3.5" /> Export PDF</span>
            <span className="text-[10px] font-medium" style={{ color: "hsl(var(--dd-primary) / 0.65)" }}>All categories</span>
          </button>
          <button className="relative h-[58px] rounded-2xl flex flex-col items-center justify-center gap-0.5 overflow-hidden"
                  style={{ border: "1px solid hsl(var(--dd-success) / 0.45)", background: "hsl(var(--dd-success) / 0.13)" }}>
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--dd-success) / 0.4), transparent)" }} />
            <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: C.success }}><Download className="w-3.5 h-3.5" /> Export CSV</span>
            <span className="text-[10px] font-medium" style={{ color: "hsl(var(--dd-success) / 0.65)" }}>All categories</span>
          </button>
        </div>
      </div>
    </AppScreen>
  );
}

/* ── Rate & Billing entry — the real billing sheet (PaymentMethodFields) with
      details being typed in. "Your bank or wallet details, filled in for you." ── */

const BILL_FIELDS = [
  { label: "Payee name", value: "Alex Rivera" },
  { label: "Bank", value: "Monzo Bank" },
  { label: "Account / SWIFT", value: "GB29 NWBK 6016 1331 9268 19" },
];

export function BillingScene({ active }: SceneProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const timers: number[] = [];
    BILL_FIELDS.forEach((_, i) => timers.push(window.setTimeout(() => setStep(i + 1), 750 + i * 880)));
    return () => timers.forEach(clearTimeout);
  }, [active]);
  const acc = "215 80% 56%"; // Bank-transfer accent (sapphire), matches the app
  const methods = [
    { id: "Bank transfer", Icon: Landmark, on: true },
    { id: "Wise", Icon: Wallet, on: false },
    { id: "PayPal", Icon: Wallet, on: false },
  ];

  return (
    <AppScreen tab={0}>
      {/* dimmed tracker behind the sheet */}
      <div className="h-full px-4 pt-1.5 flex flex-col" style={{ opacity: 0.35 }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "hsl(var(--dd-mfg) / 0.8)" }}>Friday, June 20</p>
        <h3 className="font-display text-[22px] font-bold" style={{ color: C.fg }}>Good afternoon</h3>
      </div>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />

      {/* bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 px-4 pt-3.5 pb-4 flex flex-col"
           style={{
             background: "hsl(var(--dd-surface))",
             borderTop: "1px solid hsl(var(--dd-border) / 0.6)",
             borderTopLeftRadius: 26, borderTopRightRadius: 26,
             boxShadow: "0 -18px 50px -10px rgba(0,0,0,0.7)",
             transform: active ? "translateY(0)" : "translateY(100%)",
             transition: "transform 0.55s cubic-bezier(0.32,0.72,0,1)",
           }}>
        <div className="mx-auto mb-2.5 h-1 w-9 rounded-full" style={{ background: "hsl(var(--dd-mfg) / 0.4)" }} />
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] mb-0.5" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>Payment for</p>
        <h3 className="font-display text-[18px] font-bold mb-3" style={{ color: C.fg }}>NeoDimmer project</h3>

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1.5" style={{ color: "hsl(var(--dd-mfg) / 0.6)" }}>Payment method</p>
        <div className="flex gap-1.5 mb-3">
          {methods.map((m) => (
            <div key={m.id} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold"
                 style={m.on
                   ? { background: `hsl(${acc} / 0.16)`, border: `1px solid hsl(${acc} / 0.5)`, color: `hsl(${acc})` }
                   : { background: "hsl(var(--dd-muted) / 0.5)", border: `1px solid ${C.border}`, color: "hsl(var(--dd-fg2) / 0.7)" }}>
              <m.Icon className="w-3.5 h-3.5" /> {m.id}
            </div>
          ))}
        </div>

        {/* detail card with fields typing in */}
        <div className="rounded-2xl p-3.5 space-y-2.5" style={{ border: `1px solid hsl(${acc} / 0.35)`, background: `linear-gradient(135deg, hsl(${acc} / 0.08), hsl(${acc} / 0.03))` }}>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em]" style={{ color: `hsl(${acc})` }}>
            <Landmark className="w-3 h-3" /> Bank transfer
          </div>
          {BILL_FIELDS.map((f, i) => {
            const filled = step > i;
            const isCurrent = step === i + 1;
            return (
              <div key={f.label}>
                <p className="text-[10px] font-medium mb-1" style={{ color: "hsl(var(--dd-mfg) / 0.7)" }}>{f.label}</p>
                <div className="h-9 rounded-xl px-3 flex items-center text-[12px] tabular-nums truncate"
                     style={{ background: "hsl(var(--dd-bg) / 0.6)", border: `1px solid ${filled ? `hsl(${acc} / 0.4)` : C.border}`, color: filled ? C.fg : "hsl(var(--dd-mfg) / 0.45)", transition: "border-color 0.3s, color 0.3s" }}>
                  {filled ? f.value : `${f.label}…`}
                  {isCurrent && <span className="ml-0.5 inline-block w-[2px] h-[14px] shrink-0" style={{ background: `hsl(${acc})` }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-3 flex gap-2">
          <div className="h-11 flex-1 rounded-2xl flex items-center justify-center text-[13px] font-medium" style={{ border: `1px solid ${C.border}`, color: "hsl(var(--dd-fg2) / 0.85)" }}>Cancel</div>
          <div className="h-11 flex-[2] rounded-2xl flex items-center justify-center text-[13px] font-semibold text-white" style={{ background: C.primary, boxShadow: "0 8px 20px -6px hsl(var(--dd-primary) / 0.6)" }}>Save details</div>
        </div>
      </div>
    </AppScreen>
  );
}

/* ── Report / PDF preview (one tap turns logged hours into a PDF) ───────────── */

export function InvoiceScene({ active }: SceneProps) {
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!active) { setToast(false); return; }
    const t = window.setTimeout(() => setToast(true), 1500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="h-full flex flex-col relative" style={{ background: "hsl(var(--dd-bg))" }}>
      <StatusBar />
      <div className="px-4 pt-1 pb-2 flex items-center justify-between shrink-0">
        <ChevronLeft className="w-5 h-5" style={{ color: C.primary }} />
        <span className="text-[13px] font-semibold" style={{ color: C.fg }}>Report.pdf</span>
        <MoreHorizontal className="w-5 h-5" style={{ color: C.primary }} />
      </div>

      {/* PDF sheet */}
      <div className="flex-1 overflow-hidden px-3.5 pb-3">
        <div className="h-full rounded-[14px] overflow-hidden flex flex-col"
             style={{ background: "#fff", boxShadow: "0 18px 50px -12px rgba(0,0,0,0.7)",
                      opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                      transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.32,0.72,0,1)" }}>
          {/* dark header band */}
          <div className="px-4 pt-4 pb-5" style={{ background: "linear-gradient(135deg, #11151f, #1c2233)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px]" style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.indigo})` }}>
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              <div>
                <p className="text-[12px] font-bold leading-none" style={{ color: "#fff" }}>DayDraft</p>
                <p className="text-[7px] tracking-[0.2em] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>TIME REPORT</p>
              </div>
            </div>
            <p className="font-display text-[26px] font-bold leading-none" style={{ color: "#fff" }}>Week</p>
            <p className="text-[10.5px] mt-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>15 Jun – 19 Jun 2026</p>
          </div>

          {/* summary cards */}
          <div className="px-3.5 -mt-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl px-3 py-2.5" style={{ background: "#f4f6fa", border: "1px solid #e6e9f0" }}>
                <p className="text-[7.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7a8194" }}>Total tracked</p>
                <p className="text-[16px] font-bold dd-mono" style={{ color: "#11151f" }}>12h 30m</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: "#eefaf3", border: "1px solid #cdeede" }}>
                <p className="text-[7.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "#4a8f72" }}>Total earned</p>
                <p className="text-[16px] font-bold dd-mono" style={{ color: "#0f7a4f" }}>US$6,250</p>
              </div>
            </div>
          </div>

          {/* category table */}
          <div className="px-3.5 mt-3">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: "#9aa1b2" }}>By category</p>
            {[
              { n: "NeoDimmer project", h: "8h 20m", pay: "US$4,166" },
              { n: "Client — Acme", h: "4h 10m", pay: "US$2,084" },
            ].map((r, i) => (
              <div key={r.n} className="flex items-center justify-between py-1.5" style={{ borderTop: i ? "1px solid #eef0f5" : "none" }}>
                <span className="text-[11px] font-medium" style={{ color: "#2a2f3c" }}>{r.n}</span>
                <span className="text-[10px] dd-mono" style={{ color: "#7a8194" }}>{r.h}</span>
                <span className="text-[11px] font-bold dd-mono" style={{ color: "#0f7a4f" }}>{r.pay}</span>
              </div>
            ))}
          </div>

          {/* payment details */}
          <div className="px-3.5 mt-auto mb-3.5">
            <div className="rounded-xl px-3 py-2.5" style={{ background: "#f4f6fa", border: "1px solid #e6e9f0" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Landmark className="w-3 h-3" style={{ color: "#7a8194" }} />
                <p className="text-[8px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7a8194" }}>Payment details</p>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: "#9aa1b2" }}>Wise · EUR</span>
                <span className="dd-mono" style={{ color: "#2a2f3c" }}>BE71 0961 2345 6769</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* saved toast */}
      <div className="dd-card absolute left-3.5 right-3.5 bottom-3 flex items-center gap-3 px-4 py-3"
           style={{
             borderColor: "hsl(var(--dd-success) / 0.5)",
             opacity: toast ? 1 : 0,
             transform: toast ? "translateY(0)" : "translateY(16px)",
             transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.4,0.64,1)",
             pointerEvents: "none",
           }}>
        <span className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ background: C.success }}>
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </span>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: C.fg }}>Report.pdf ready</p>
          <p className="text-[10.5px]" style={{ color: C.mfg }}>Sent to client · 12h 30m</p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────────────── */

function Circle({ done, accent }: { done: boolean; accent: string }) {
  return (
    <span className="relative inline-flex h-[20px] w-[20px] items-center justify-center shrink-0">
      <span className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${done ? "transparent" : "hsl(var(--dd-mfg) / 0.5)"}`, transition: "border-color 0.25s" }} />
      <span className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: accent, opacity: done ? 1 : 0, transform: done ? "scale(1)" : "scale(0.4)", transition: "opacity 0.25s, transform 0.25s" }}>
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </span>
    </span>
  );
}

function ChecklistCircle({ done, failed, delay }: { done: boolean; failed: boolean; delay: number }) {
  return (
    <span className="relative inline-flex h-[20px] w-[20px] items-center justify-center shrink-0">
      <span className="absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${done ? "transparent" : failed ? C.danger : "hsl(var(--dd-mfg) / 0.45)"}`, transition: `border-color 0.25s ease ${delay}s` }} />
      <span className="dd-accent-grad dd-accent-glow absolute inset-0 rounded-full flex items-center justify-center"
            style={{ opacity: done ? 1 : 0, transform: done ? "scale(1)" : "scale(0.4)", transition: `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s` }}>
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
      <span className="absolute inset-0 flex items-center justify-center"
            style={{ color: C.danger, opacity: failed ? 1 : 0, transform: failed ? "scale(1)" : "scale(0.4)", transition: `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s` }}>
        <X className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
    </span>
  );
}

function Play({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M8 5v14l11-7z" fill="currentColor" /></svg>;
}

/* Wallet kept for potential payment icons */
export { Wallet };
