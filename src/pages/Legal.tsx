import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, FileText } from "lucide-react";

const UPDATED = "June 19, 2026";

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("tab") === "terms" ? "terms" : "privacy";
  const [tab, setTab] = useState<"privacy" | "terms">(initial);

  useEffect(() => {
    setSearchParams({ tab }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab, setSearchParams]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:pt-40">
      {/* Tab switcher */}
      <div className="mb-10 flex justify-center">
        <div className="glass inline-flex gap-1 rounded-2xl p-1.5">
          {([
            { id: "privacy", label: "Privacy Policy", Icon: Shield },
            { id: "terms", label: "Terms of Service", Icon: FileText },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                tab === id ? "text-white" : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="legal-tab"
                  className="btn-primary absolute inset-0 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{label}</span>
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
          {tab === "privacy" ? <Privacy /> : <Terms />}
        </div>
      </motion.div>
    </div>
  );
}

function DocHead({ title }: { title: string }) {
  return (
    <>
      <h1 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] font-bold tracking-[-0.03em] text-[var(--ink)]">{title}</h1>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">Last updated: {UPDATED}</p>
    </>
  );
}

function Privacy() {
  return (
    <div>
      <DocHead title="Privacy Policy" />
      <p className="mt-6 text-[var(--ink)]">
        DayDraft ("we", "our", "us", "the app") is operated by Andrew Plashevskyi. We respect your privacy. This policy
        explains what personal data we collect, why we collect it, how we use it, and your rights. It applies to all
        versions of DayDraft (iOS, Android, and web) and supplements our Terms of Service.
      </p>

      <h2>1. Who we are and how to contact us</h2>
      <p>DayDraft is an AI-assisted daily planning application. The data controller responsible for your personal data is:</p>
      <p><strong>DayDraft / Andrew Plashevskyi</strong><br />Contact: <a href="mailto:support@daydraft.app">support@daydraft.app</a></p>
      <p>For privacy-related requests, questions, or complaints, write to us at the address above. We respond within 30 days.</p>

      <h2>2. Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> email address, display name, hashed password.</li>
        <li><strong>Productivity data:</strong> tasks, plans, time entries, focus sessions, checklist items — all stored encrypted at rest.</li>
        <li><strong>Billing details (optional):</strong> if you use billing features, your hourly rate and payment instructions you enter (bank name, IBAN, crypto wallet, payment link, notes). Stored encrypted at rest, used only to populate your own exports. Never sold or shared with advertisers.</li>
        <li><strong>Optional integrations:</strong> Google Calendar OAuth tokens (only if you connect your calendar); push notification tokens (only if you enable nudges).</li>
        <li><strong>Technical &amp; diagnostic:</strong> minimal error logs and performance data that do not contain the personal content of your tasks.</li>
      </ul>
      <p>We do <strong>not</strong> collect: precise location, contacts, photos, or microphone audio (voice input, if available, is processed locally in your browser only), device identifiers for cross-app tracking, or advertising IDs. If you enable biometric unlock, Face ID / fingerprint matching is performed entirely on your device — we never receive or store any biometric data.</p>

      <h2>3. Legal basis for processing (GDPR)</h2>
      <p>If you are in the European Economic Area (EEA) or the United Kingdom, we process your personal data on the following legal bases under GDPR Article 6:</p>
      <ul>
        <li><strong>Performance of a contract (Art. 6(1)(b)):</strong> account data, productivity data, and billing data — necessary to provide the service you signed up for.</li>
        <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> technical and diagnostic data, security logging, and fraud prevention — we have a legitimate interest in keeping the service secure and stable, and these interests are not overridden by your rights.</li>
        <li><strong>Consent (Art. 6(1)(a)):</strong> push notifications, Google Calendar integration, and AI personalisation — you opt in explicitly and can withdraw consent at any time in Settings without penalty.</li>
      </ul>

      <h2>4. How we use your data</h2>
      <p>Solely to operate and improve the service:</p>
      <ul>
        <li>Generate AI-assisted daily plans and responses to your questions.</li>
        <li>Personalise your plans using your own history (see Section 5).</li>
        <li>Sync your data across your devices.</li>
        <li>Send push nudges and reminders you have opted into.</li>
        <li>Produce usage reports visible only to you.</li>
        <li>Maintain service security and fix bugs.</li>
      </ul>
      <p>We do <strong>not</strong> use your data for advertising, sell your data to third parties, or share it with any party except as described in Section 6 below.</p>

      <h2>5. Personalisation &amp; learning</h2>
      <p>To make your plans realistic, DayDraft learns from <strong>your own activity</strong> — how long your tasks actually take versus your estimates, the hours you tend to finish work, and tasks you repeatedly put off. This profile stays in your account, is never sold or used to target ads, and is rebuilt from the last 30 days of activity. You can turn AI personalisation off at any time in Settings → AI, or reset it by clearing your history. Deleting your account removes the profile entirely.</p>

      <h2>6. Third-party processors</h2>
      <p>We engage the following third-party processors, each acting only on our instructions and bound by data processing agreements (DPAs):</p>
      <ul>
        <li><strong>Supabase</strong> — database hosting (EU/US regions). Your data is stored with row-level security so only your account can access it. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</li>
        <li><strong>Google (Gemini API)</strong> — AI text generation. When you ask DayDraft to plan or assist, your task text and any context you added is sent to Google Gemini to generate a reply. Inputs are processed transiently; they are not used to train Google's foundation models under our API agreement. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
        <li><strong>RevenueCat</strong> — subscription management. Receives your purchase receipt and a pseudonymous user ID to activate and restore subscriptions. We never receive or store your card details. <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">RevenueCat Privacy Policy</a>.</li>
        <li><strong>Apple App Store / Google Play</strong> — payment processing for in-app purchases, governed by their own privacy policies.</li>
      </ul>
      <p>We do not use any advertising networks, analytics trackers, or data brokers.</p>

      <h2>7. International data transfers</h2>
      <p>Our servers and processors may be located outside your country of residence, including in the United States. Where data is transferred from the EEA or UK, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission, or equivalent safeguards required by applicable law, to ensure an adequate level of protection.</p>

      <h2>8. Storage, security &amp; retention</h2>
      <p>All data is stored on Supabase with row-level security enforced at the database level. Transport uses HTTPS/TLS. Passwords are bcrypt-hashed and never stored in plain text.</p>
      <p><strong>Retention periods:</strong> We keep your account data and productivity data for as long as your account is active. Diagnostic logs are retained for up to 90 days. When you delete your account, your data is removed promptly from active systems; residual copies in encrypted backups are overwritten within our standard backup rotation (typically 30 days). Your personalisation profile is derived from the last 30 days of activity and ages out automatically.</p>

      <h2>9. Your rights</h2>
      <p>Depending on your location, you have the following rights:</p>
      <p><strong>For everyone:</strong></p>
      <ul>
        <li><strong>Access &amp; export:</strong> download a copy of all your data from Settings → Delete account → Export data.</li>
        <li><strong>Correction:</strong> edit your profile and data from in-app Settings.</li>
        <li><strong>Deletion:</strong> permanently delete your account and all data from Settings → Delete account. We act within 30 days.</li>
        <li><strong>Withdraw consent:</strong> disconnect Calendar, push notifications, or AI personalisation at any time in Settings without any penalty to your account.</li>
      </ul>
      <p><strong>EEA / UK residents (GDPR / UK GDPR):</strong></p>
      <ul>
        <li><strong>Right to data portability (Art. 20):</strong> receive your data in a structured, machine-readable format — use the Export function in Settings.</li>
        <li><strong>Right to restrict processing (Art. 18):</strong> request that we limit how we use your data while a dispute is pending.</li>
        <li><strong>Right to object (Art. 21):</strong> object to processing based on legitimate interests. We will stop unless we can demonstrate compelling grounds that override your interests.</li>
        <li><strong>Right to lodge a complaint:</strong> you have the right to lodge a complaint with the data protection supervisory authority in your country of residence at any time. A list of EU supervisory authorities is available at <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>. UK residents may contact the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ICO</a>.</li>
      </ul>
      <p><strong>California residents (CCPA / CPRA):</strong></p>
      <ul>
        <li><strong>We do not sell or share your personal information</strong> for cross-context behavioural advertising. You do not need to opt out — we simply do not engage in these activities.</li>
        <li><strong>Right to know:</strong> you can request disclosure of the categories of personal information collected, the purposes for collection, and the categories of third parties with whom it is shared.</li>
        <li><strong>Right to delete:</strong> request deletion of your personal information (subject to limited exceptions, e.g., legal obligation to retain).</li>
        <li><strong>Right to non-discrimination:</strong> we will not discriminate against you for exercising any of the above rights.</li>
      </ul>
      <p>To exercise any right, contact us at <a href="mailto:support@daydraft.app">support@daydraft.app</a>. We may need to verify your identity before fulfilling a request.</p>

      <h2>10. Children</h2>
      <p>DayDraft is not directed to children under 13 (or the applicable minimum age of digital consent in your country — 16 in certain EU member states). We do not knowingly collect personal data from children below that age. If you believe a child has provided us data without appropriate consent, please contact us and we will delete it promptly.</p>

      <h2>11. Changes to this policy</h2>
      <p>We will notify you of material changes via email and an in-app banner at least 14 days before the change takes effect, giving you time to review and, where required, provide fresh consent or delete your account.</p>

      <h2>12. Contact</h2>
      <p>Privacy questions or requests: <a href="mailto:support@daydraft.app">support@daydraft.app</a>. We respond within 30 days.</p>
    </div>
  );
}

function Terms() {
  return (
    <div>
      <DocHead title="Terms of Service" />
      <p className="mt-6 text-[var(--ink)]">
        These Terms of Service ("Terms") form a legally binding agreement between you and DayDraft, operated by Andrew
        Plashevskyi ("DayDraft", "we", "us", "our"). By creating an account or using DayDraft on any platform (iOS,
        Android, web), you confirm that you have read, understood, and agree to these Terms. If you do not agree, please
        do not use the app.
      </p>

      <h2>1. The service</h2>
      <p>DayDraft is an AI-assisted daily planning tool that helps you organise your day, track time, and produce billing-ready reports. We may update, add, or remove features from time to time. Where a change materially reduces a core feature you rely on, we will give you at least 14 days' notice by email or in-app notification before it takes effect.</p>

      <h2>2. Your account</h2>
      <p>You must be at least 13 years old (or the minimum digital age of consent in your country) to create an account. You are responsible for keeping your login credentials confidential and for all activity that occurs under your account. Notify us immediately at <a href="mailto:support@daydraft.app">support@daydraft.app</a> if you suspect unauthorised access.</p>

      <h2>3. Acceptable use</h2>
      <p>You may use DayDraft only for lawful personal or professional productivity purposes. You must not:</p>
      <ul>
        <li>Reverse-engineer, decompile, or attempt to extract the source code of the app.</li>
        <li>Use automated scripts, bots, or other means to abuse AI quotas or circumvent usage limits.</li>
        <li>Upload, store, or transmit unlawful, harmful, or infringing content.</li>
        <li>Attempt to access, probe, or test the security of our systems or other users' data.</li>
        <li>Use DayDraft to distribute spam, phishing, or misleading content.</li>
        <li>Use AI-generated outputs to train or build competing AI models or products without our written consent.</li>
        <li>Impersonate another person or entity, or misrepresent your affiliation with any person or entity.</li>
      </ul>
      <p>Violation may result in immediate account suspension or termination, with notice where reasonable.</p>

      <h2>4. Your content and licence to us</h2>
      <p>You retain full ownership of all content you enter into DayDraft — your tasks, plans, notes, time entries, and any other data ("Your Content"). You grant DayDraft a limited, non-exclusive, royalty-free licence to store, process, and transmit Your Content solely to the extent necessary to operate and provide the service to you (including sending task text to our AI provider as described in our Privacy Policy). This licence ends when you delete the content or your account.</p>
      <p>You represent that you have all necessary rights to the content you submit and that doing so does not infringe any third-party rights.</p>

      <h2>5. Subscriptions and billing</h2>
      <p>DayDraft offers a free plan with limited AI planning days and a <strong>Pro</strong> subscription that unlocks unlimited plans and advanced features.</p>
      <p><strong>Pricing:</strong> Subscription prices are displayed in the app before you confirm a purchase and are charged in the currency of your App Store or Google Play account. Prices are inclusive of any applicable taxes where required by law. We may adjust prices on 30 days' notice for future billing periods.</p>
      <p><strong>Billing cycles:</strong> Pro is offered as an auto-renewing subscription in weekly, monthly, or annual periods. Your account is charged at the start of each period. Your subscription renews automatically for the same period and at the same price (subject to any notified change) unless you cancel at least 24 hours before the end of the current period.</p>
      <p><strong>Free trial:</strong> Where offered, the free trial period (currently 3 days on the annual plan) begins on the date of purchase. Any unused portion of the trial is forfeited when you purchase any paid subscription period. After the trial, your account is charged the applicable subscription price.</p>
      <p><strong>Cancellation:</strong> Manage or cancel your subscription at any time in your App Store (Settings → Apple ID → Subscriptions) or Google Play (Play Store → Subscriptions) account settings. Deleting the app does not cancel a subscription. Cancellation takes effect at the end of the current paid period; you retain access until then.</p>
      <p><strong>Refunds:</strong> Subscription fees are non-refundable except where required by applicable law or Apple / Google's own refund policies (which may grant refunds at their discretion). If you believe you are entitled to a refund, contact us and we will do our best to assist or direct you to the appropriate platform process.</p>

      <h2>6. AI output disclaimer</h2>
      <p>AI-generated schedules, suggestions, estimates, and responses are generated automatically and may contain errors, inaccuracies, or omissions, including hallucinations (plausible-sounding but incorrect information). They are provided as suggestions only and do not constitute professional advice of any kind — financial, medical, legal, or otherwise. You are solely responsible for reviewing AI outputs and for all decisions you make in reliance on them. We do not guarantee that AI outputs are accurate, complete, timely, or suitable for any particular purpose.</p>

      <h2>7. Intellectual property</h2>
      <p>DayDraft and all of its content, features, functionality, branding, trademarks, trade names, logos, design, software, and underlying code are owned by DayDraft / Andrew Plashevskyi or our licensors and are protected by applicable intellectual property laws. These Terms do not grant you any right, title, or interest in DayDraft's intellectual property other than the limited right to use the app in accordance with these Terms. You must not copy, reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any part of DayDraft without our prior written consent.</p>

      <h2>8. Termination</h2>
      <p>You may delete your account and terminate your use of DayDraft at any time through Settings → Delete account. We may suspend or terminate your account if you materially breach these Terms, with notice where practicable. Upon termination, your licence to use the app ends immediately. Sections 4, 6, 7, 9, 10, and 11 survive termination.</p>

      <h2>9. Disclaimers</h2>
      <p>To the maximum extent permitted by applicable law, DayDraft is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, title, non-infringement, or continuous availability. We do not warrant that the service will be uninterrupted, error-free, or free of viruses or other harmful components. Some jurisdictions do not allow the exclusion of implied warranties, so the above may not apply to you in full.</p>

      <h2>10. Limitation of liability</h2>
      <p>To the maximum extent permitted by applicable law, in no event shall DayDraft or Andrew Plashevskyi be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or business opportunities, arising from or in connection with your use of or inability to use the service, even if advised of the possibility of such damages.</p>
      <p>To the extent that we are found liable for any direct damages, our total aggregate liability to you shall not exceed the greater of (a) the total amounts you paid us in the 12 months immediately preceding the event giving rise to the claim, or (b) USD $10.00.</p>
      <p>Some jurisdictions (including the EU and certain US states) do not allow the limitation or exclusion of liability for certain types of loss. In those jurisdictions, our liability will be limited to the maximum extent permitted by law. Nothing in these Terms excludes liability that cannot be excluded by law, including liability for death or personal injury caused by our negligence, or for fraud.</p>

      <h2>11. Governing law and dispute resolution</h2>
      <p>These Terms and any dispute arising out of or in connection with them shall be governed by and construed in accordance with applicable consumer protection laws of your country of residence, which prevail where they provide greater protection than the following. To the extent a specific jurisdiction applies, these Terms shall be governed by the laws of Ukraine, without regard to its conflict-of-law principles.</p>
      <p>We encourage you to contact us first at <a href="mailto:support@daydraft.app">support@daydraft.app</a> to resolve any dispute informally. Most issues can be resolved this way within 30 days. If informal resolution fails, you may bring a claim in a court of competent jurisdiction in your country of residence, or, where required by local law, in the jurisdiction of Ukraine.</p>
      <p>Nothing in these Terms prevents you from filing a complaint with a consumer protection authority in your country.</p>

      <h2>12. Changes to these Terms</h2>
      <p>We may update these Terms from time to time. If we make a material change, we will notify you at least 14 days in advance by email and an in-app notice. Your continued use of DayDraft after a change takes effect constitutes acceptance of the updated Terms. If you do not agree to the updated Terms, you may delete your account before the change takes effect.</p>

      <h2>13. Severability</h2>
      <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision will be limited or severed to the minimum extent necessary, and the remaining provisions will continue in full force and effect.</p>

      <h2>14. Entire agreement</h2>
      <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and DayDraft with respect to your use of the service and supersede all prior or contemporaneous agreements, representations, warranties, and understandings, written or oral, relating to the subject matter herein.</p>

      <h2>15. Contact</h2>
      <p>Questions about these Terms: <a href="mailto:support@daydraft.app">support@daydraft.app</a></p>
    </div>
  );
}
