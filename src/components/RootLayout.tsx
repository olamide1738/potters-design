import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "./Toaster";
import { NavigationSpinner } from "./NavigationSpinner";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { PromoPopup } from "./PromoPopup";
import { BackToTop } from "./BackToTop";
import { GoogleTranslate } from "./GoogleTranslate";
import { useThemeStore } from "@/store/useThemeStore";
import { useUIStore } from "@/store/useUIStore";

import { loungeAudio } from "@/lib/ambient-music";

export function RootLayout() {
  const theme = useThemeStore((s) => s.theme);
  const location = useLocation();
  const musicPlaying = useUIStore((s) => s.musicPlaying);
  const setMusicPlaying = useUIStore((s) => s.setMusicPlaying);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Slow, soothing wine & magazine lounge audio engine effect
  useEffect(() => {
    if (musicPlaying) {
      void loungeAudio.play().catch((err) => {
        console.warn("Audio playback blocked", err);
        setMusicPlaying(false);
      });
    } else {
      loungeAudio.pause();
    }
  }, [musicPlaying, setMusicPlaying]);

  // Clean up audio on page destroy
  useEffect(() => {
    return () => {
      loungeAudio.pause();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <div key={location.pathname} className="animate-fade-in motion-reduce:animate-none">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
      <Toaster />
      <NavigationSpinner />
      <CartDrawer />
      <SearchOverlay />
      <PromoPopup />
      <BackToTop />
      <GoogleTranslate />
    </div>
  );
}
