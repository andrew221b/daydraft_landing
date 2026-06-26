import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className="relative z-10 px-4 pb-10 pt-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass rounded-3xl px-6 py-8 sm:px-10 sm:py-9">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <Logo size={32} />
              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-dim)]">
                Plans that fit the hours you have, a timer that counts from the moment you start, and a clean report at the end of the week. Your day, drafted.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-16">
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">Product</p>
                <a href={isHome ? "#features" : "/#features"} className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Features</a>
                <a href={isHome ? "#how" : "/#how"} className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">How it works</a>
                <a href={isHome ? "#download" : "/#download"} className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Download</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">Company</p>
                <Link to="/support" className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Support</Link>
                <Link to="/legal" className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Privacy</Link>
                <Link to="/legal?tab=terms" className="text-[13.5px] text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors">Terms</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--ink)]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] text-[var(--ink-faint)]">© {new Date().getFullYear()} DayDraft. All rights reserved.</p>
            <p className="text-[12.5px] text-[var(--ink-faint)]">
              Built for people who value their time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
