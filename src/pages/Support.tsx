import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Bug, Trash2, LifeBuoy } from "lucide-react";

export default function Support() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  const validTabs = ["feedback", "bug", "delete"] as const;
  type TabType = typeof validTabs[number];
  const isValidTab = (t: string | null): t is TabType => validTabs.includes(t as TabType);
  const initial: TabType = isValidTab(initialTab) ? initialTab : "feedback";
  const [tab, setTab] = useState<TabType>(initial);

  useEffect(() => {
    setSearchParams({ tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab, setSearchParams]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:pt-40">
      <div className="text-center mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[0.04] border border-white/5 mb-5 shadow-sm">
          <LifeBuoy className="h-6 w-6 text-[var(--ink)]" strokeWidth={2} />
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.03em] text-[var(--ink)] leading-none">
          Help & Support
        </h1>
        <p className="mt-3 text-[15px] font-medium text-[var(--ink-dim)]">How can we help you today?</p>
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
              className={`relative flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl px-3 py-2.5 sm:px-5 sm:py-3 text-[12px] sm:text-[13.5px] font-semibold transition-colors ${tab === id ? "text-white" : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="support-tab"
                  className={id === "delete" ? "absolute inset-0 rounded-xl bg-red-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" : "btn-primary absolute inset-0 rounded-xl"}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" strokeWidth={2.2} />
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
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] mb-6">Leave Feedback</h1>
              <p>
                We're always looking for ways to improve DayDraft. If you have a feature request, a suggestion, or just want to share your thoughts, let us know.
              </p>

              <h2>In the app (Recommended)</h2>
              <p>The fastest way to share your thoughts is directly through the app.</p>
              <ol>
                <li>Open DayDraft.</li>
                <li>Go to <strong>Settings</strong>.</li>
                <li>Tap <strong>Help & Feedback</strong>, then select <strong>Leave Feedback</strong>.</li>
              </ol>

              <h2>Via email</h2>
              <p>You can also reach us directly at <a href="mailto:support@daydraft.app?subject=App%20Feedback">support@daydraft.app</a>.</p>
            </div>
          )}

          {tab === "bug" && (
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] mb-6">Report a Bug</h1>
              <p>
                If something isn't working correctly, please tell us. The more detail you provide about what happened and what you expected, the faster we can investigate and deploy a fix.
              </p>

              <h2>In the app (Recommended)</h2>
              <p>Reporting bugs from within the app is highly recommended because it automatically links the report to your account context, speeding up the investigation.</p>
              <ol>
                <li>Open DayDraft.</li>
                <li>Go to <strong>Settings</strong>.</li>
                <li>Tap <strong>Help & Feedback</strong>, then select <strong>Report a Bug</strong>.</li>
              </ol>

              <h2>Via email</h2>
              <p>If the app won't open or you can't access settings, email us at <a href="mailto:support@daydraft.app?subject=Bug%20Report">support@daydraft.app</a>.</p>
            </div>
          )}

          {tab === "delete" && (
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] mb-6">Account & Data Deletion</h1>
              <p>
                We respect your right to privacy. You can permanently delete your DayDraft account and all associated data at any time.
              </p>

              <h2>How to delete your account inside the app</h2>
              <p>This is the quickest method and takes effect immediately.</p>
              <ol>
                <li>Open DayDraft and go to <strong>Settings</strong>.</li>
                <li>Scroll to the bottom and tap <strong>Delete account</strong>.</li>
                <li>Confirm your password to permanently delete your data.</li>
              </ol>

              <h2>How to request manual deletion</h2>
              <p>If you no longer have the app installed or cannot log in, you can request a manual deletion:</p>
              <ol>
                <li>Send an email to <a href="mailto:support@daydraft.app?subject=Account%20Deletion%20Request">support@daydraft.app</a> from the address associated with your DayDraft account.</li>
                <li>Use the subject line: <strong>Account Deletion Request</strong>.</li>
              </ol>
              <p><em>Note: We must verify your identity to process manual requests. We will act on your request within 30 days.</em></p>

              <h2>What happens to your data</h2>
              <p>When your account is deleted, the following data is permanently removed from our active systems:</p>
              <ul>
                <li>Your profile (email address, display name, preferences).</li>
                <li>All your productivity data: tasks, daily plans, time entries, and checklists.</li>
                <li>Your AI personalisation profile and history.</li>
                <li>Your billing and payment method settings.</li>
              </ul>

              <h2>Data retention</h2>
              <p>
                When you initiate deletion, your data is removed immediately from our active databases. Residual copies may remain in encrypted system backups for disaster recovery purposes. These backups are securely overwritten within 30 days. Diagnostic logs that do not contain personal content may be retained for up to 90 days.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
