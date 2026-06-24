import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";

import Home from "./pages/Home";
import Legal from "./pages/Legal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticlesCanvas from "./components/ParticlesBackground";
import { RevealContext } from "./contexts/reveal";

// Resets on every full page refresh; survives SPA navigation.
// ?nointro forces a skip for screenshot/testing.
let introPlayed = false;

function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("nointro")) return false;
  if (introPlayed) return false;
  introPlayed = true;
  return true;
}

export default function App() {
  const [playIntro] = useState(shouldPlayIntro);
  const [revealed,  setRevealed] = useState(!playIntro);
  const reveal = useCallback(() => setRevealed(true), []);

  return (
    <BrowserRouter>
      <RevealContext.Provider value={revealed}>
        <div
          className="grain relative min-h-screen flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {/* Ambient room glows — a faint, uniform brand wash. Kept very low
             so the page reads as one calm dark surface, not a colour field. */}
          <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
            <div
              className="drift absolute -top-[12%] -left-[8%] w-[55vw] h-[55vw] rounded-full"
              style={{ background: "radial-gradient(circle, var(--ambient-glow-1), transparent 64%)", filter: "blur(48px)" }}
            />
            <div
              className="drift absolute top-[35%] -right-[12%] w-[50vw] h-[50vw] rounded-full"
              style={{ background: "radial-gradient(circle, var(--ambient-glow-2), transparent 64%)", filter: "blur(48px)", animationDelay: "-6s" }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 45%, var(--ambient-vignette) 100%)" }}
            />
          </div>

          {/* Particle intro — sits above page while D is visible */}
          {playIntro && <ParticlesCanvas onAssembled={reveal} />}

          {/* Page content — no wrapper transform, each section/element animates itself */}
          <div className="relative z-10 flex-1 flex flex-col w-full">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/"      element={<Home />} />
                <Route path="/legal" element={<Legal />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </RevealContext.Provider>
    </BrowserRouter>
  );
}
