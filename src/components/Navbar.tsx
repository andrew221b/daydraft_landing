import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useReveal } from "../contexts/reveal";
import { useTheme } from "../contexts/theme";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Support",      href: "/support" },
];

export default function Navbar() {
  const revealed = useReveal();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.08 }}
      >
        <div className="mx-auto max-w-6xl">
          <div
            className="glass glass-sheen rounded-2xl px-4 sm:px-5 flex items-center justify-between"
            style={{ height: 60 }}
          >
            <Link
              to="/"
              className="group"
              onClick={() => setOpen(false)}
            >
              <Logo size={32} className="transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => {
                const isExternal = l.href.startsWith("http") || l.href.startsWith("mailto");
                const isAnchor = l.href.startsWith("#");
                const target = isHome || isExternal ? l.href : (isAnchor ? `/${l.href}` : l.href);
                const className = "px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors";
                
                return isExternal ? (
                  <a key={l.label} href={target} className={className}>{l.label}</a>
                ) : (
                  <Link key={l.label} to={target} className={className}>{l.label}</Link>
                );
              })}
              <Link
                to="/legal"
                className="px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors"
              >
                Legal
              </Link>
              <div className="w-[1px] h-4 bg-[var(--ink)]/10 mx-2" />
              <button
                onClick={toggleTheme}
                className="px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors flex items-center gap-2"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={isHome ? "#download" : "/#download"}
                className="btn-primary pressable inline-flex h-9 items-center justify-center rounded-xl px-4 sm:px-5 text-[13px] font-semibold"
              >
                Get the app
              </a>
              {/* Burger — mobile only */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-down nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
        )}
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-x-0 z-40 px-4"
            style={{ top: 76 }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto max-w-6xl pt-2">
              <nav className="glass glass-sheen rounded-2xl p-2 flex flex-col">
                {NAV_LINKS.map((l) => {
                  const isExternal = l.href.startsWith("http") || l.href.startsWith("mailto");
                  const isAnchor = l.href.startsWith("#");
                  const target = isHome || isExternal ? l.href : (isAnchor ? `/${l.href}` : l.href);
                  const className = "px-4 py-3.5 rounded-xl text-[15px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors";
                  
                  return isExternal ? (
                    <a key={l.label} href={target} onClick={() => setOpen(false)} className={className}>{l.label}</a>
                  ) : (
                    <Link key={l.label} to={target} onClick={() => setOpen(false)} className={className}>{l.label}</Link>
                  );
                })}
                <Link
                  to="/legal"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3.5 rounded-xl text-[15px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors"
                >
                  Legal
                </Link>
                <div className="h-[1px] w-full bg-[var(--ink)]/10 my-1" />
                <button
                  onClick={() => { toggleTheme(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--ink)]/5 transition-colors text-left"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
