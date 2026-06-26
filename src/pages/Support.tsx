import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Bug, Trash2, LifeBuoy } from "lucide-react";

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  const validTabs = ["feedback", "bug", "delete"] as const;
  const initial = validTabs.includes(initialTab as any) ? (initialTab as any) : "feedback";
  const [tab, setTab] = useState<"feedback" | "bug" | "delete">(initial);

  useEffect(() => {
    setSearchParams({ tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab, setSearchParams]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:pt-40">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[0.04] border border-white/5 mb-4 shadow-sm">
          <LifeBuoy className="h-6 w-6 text-[var(--ink)]" strokeWidth={2} />
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.03em] text-[var(--ink)] leading-none">
          Help & Support
        </h1>
        <p className="mt-3 text-[15px] text-[var(--ink-dim)]">How can we help you today?</p>
      </div>

      {/* Tab switcher */}
      <div className="mb-10 flex justify-center">
        <div className="glass inline-flex flex-wrap gap-1 rounded-2xl p-1.5 justify-center">
          {([
            { id: "feedback", label: "Leave Feedback", Icon: MessageSquare },
            { id: "bug", label: "Report a Bug", Icon: Bug },
            { id: "delete", label: "Delete Account", Icon: Trash2 },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 sm:px-5 text-[13.5px] font-semibold transition-colors ${
                tab === id ? "text-white" : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="support-tab"
                  className={id === "delete" ? "absolute inset-0 rounded-xl bg-red-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" : "btn-primary absolute inset-0 rounded-xl"}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong rounded-3xl p-7 sm:p-12"
      >
        <div className="legal-prose">
          {tab === "feedback" && (
            <div>
              <h2 className="!mt-0 text-[var(--ink)] text-2xl font-bold tracking-tight mb-4">Leave Feedback</h2>
              <p className="text-[var(--ink)] leading-relaxed">
                Have an idea for a new feature, a suggestion for improvement, or just want to tell us what you think about DayDraft? We'd love to hear from you.
              </p>
              <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-0">In the app</h3>
                <p className="mb-4 text-[14px]">The easiest way to send feedback is directly through the DayDraft app.</p>
                <ol className="list-decimal pl-5 text-[14px] space-y-2 text-[var(--ink-dim)]">
                  <li>Open the DayDraft app on your device.</li>
                  <li>Go to <strong>Settings</strong> (the gear icon).</li>
                  <li>Tap on <strong>Help & Feedback</strong>.</li>
                  <li>Select <strong>Leave Feedback</strong>.</li>
                </ol>
              </div>
              <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-0">Via email</h3>
                <p className="text-[14px] mb-4">You can also email us directly at:</p>
                <a href="mailto:support@daydraft.app?subject=App%20Feedback" className="inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline">
                  support@daydraft.app
                </a>
              </div>
            </div>
          )}

          {tab === "bug" && (
            <div>
              <h2 className="!mt-0 text-[var(--ink)] text-2xl font-bold tracking-tight mb-4">Report a Bug</h2>
              <p className="text-[var(--ink)] leading-relaxed">
                Something broken or not working as expected? Let us know so we can squash it. Providing details like what you were doing when the issue occurred helps us fix it faster.
              </p>
              <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-0">In the app</h3>
                <p className="mb-4 text-[14px]">Reporting bugs from within the app helps us automatically link it to your account context.</p>
                <ol className="list-decimal pl-5 text-[14px] space-y-2 text-[var(--ink-dim)]">
                  <li>Open the DayDraft app on your device.</li>
                  <li>Go to <strong>Settings</strong> (the gear icon).</li>
                  <li>Tap on <strong>Help & Feedback</strong>.</li>
                  <li>Select <strong>Report a Bug</strong>.</li>
                </ol>
              </div>
              <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-0">Via email</h3>
                <p className="text-[14px] mb-4">If the app won't open or you can't access settings, email us at:</p>
                <a href="mailto:support@daydraft.app?subject=Bug%20Report" className="inline-flex items-center gap-2 font-semibold text-[var(--primary)] hover:underline">
                  support@daydraft.app
                </a>
              </div>
            </div>
          )}

          {tab === "delete" && (
            <div>
              <h2 className="!mt-0 text-[var(--ink)] text-2xl font-bold tracking-tight mb-4">Account & Data Deletion</h2>
              <p className="text-[var(--ink)] leading-relaxed mb-6">
                We respect your right to privacy and full control over your data. You can delete your DayDraft account and all associated data at any time.
              </p>
              
              <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 mb-6">
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-0 text-red-400">How to request deletion</h3>
                <p className="mb-4 text-[14px]"><strong>Method 1: Inside the app (Instant)</strong></p>
                <ol className="list-decimal pl-5 text-[14px] space-y-2 text-[var(--ink-dim)] mb-6">
                  <li>Open the DayDraft app on your device.</li>
                  <li>Go to <strong>Settings</strong> (the gear icon).</li>
                  <li>Scroll down and tap <strong>Delete account</strong>.</li>
                  <li>Confirm your password to permanently delete your account.</li>
                </ol>
                
                <p className="mb-4 text-[14px]"><strong>Method 2: On the web (If you can't access the app)</strong></p>
                <p className="text-[14px] mb-4 text-[var(--ink-dim)]">
                  If you no longer have the app installed or cannot log in, you can request a manual account deletion:
                </p>
                <ol className="list-decimal pl-5 text-[14px] space-y-2 text-[var(--ink-dim)] mb-4">
                  <li>Send an email to <a href="mailto:support@daydraft.app?subject=Account%20Deletion%20Request" className="text-[var(--primary)] hover:underline">support@daydraft.app</a> from the email address associated with your DayDraft account.</li>
                  <li>Use the exact subject line: <strong>Account Deletion Request</strong>.</li>
                </ol>
                <p className="text-[13px] text-red-400/80 italic mt-2">
                  * Note: We must verify your identity to process manual requests. We will act on your request within 30 days.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-8">Data that is deleted</h3>
              <p className="mb-3 text-[14px]">When your account is deleted, the following data is permanently removed from our active systems:</p>
              <ul className="list-disc pl-5 text-[14px] space-y-2 text-[var(--ink-dim)] mb-6">
                <li>Your profile (email address, display name, preferences).</li>
                <li>All your productivity data: tasks, daily plans, time entries, and checklists.</li>
                <li>Your AI personalisation profile and history.</li>
                <li>Your billing and payment method settings.</li>
              </ul>

              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2 mt-8">Data retention</h3>
              <p className="text-[14px] text-[var(--ink-dim)] leading-relaxed">
                When you initiate deletion, your data is removed immediately from our active databases. Residual copies of your data may remain in encrypted, air-gapped system backups for disaster recovery purposes. These backups are subject to our standard rotation schedule and are securely overwritten within <strong>30 days</strong>. Diagnostic logs that do not contain personal content may be retained for up to 90 days for security purposes.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
