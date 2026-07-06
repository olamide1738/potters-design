import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "./Toaster";
import { NavigationSpinner } from "./NavigationSpinner";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { PromoPopup } from "./PromoPopup";
import { BackToTop } from "./BackToTop";
import { useThemeStore } from "@/store/useThemeStore";

export function RootLayout() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <Toaster />
      <NavigationSpinner />
      <CartDrawer />
      <SearchOverlay />
      <PromoPopup />
      <BackToTop />
    </div>
  );
}
