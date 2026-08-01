import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/format";
import { LANGUAGES, getCurrentLang, setLanguage } from "@/lib/translate";

const NAV_LEFT = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About Us", to: "/about-us" },
];

const ALL_NAV = NAV_LEFT;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState("en");

  // Reflect the active Google Translate language in the dropdown
  useEffect(() => {
    setLang(getCurrentLang());
  }, []);
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const { theme, toggleTheme } = useThemeStore();
  const toggleCart = useUIStore((s) => s.toggleCart);
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const musicPlaying = useUIStore((s) => s.musicPlaying);
  const toggleMusic = useUIStore((s) => s.toggleMusic);

  return (
    <header className="sticky top-0 z-40 border-b border-mist/70 bg-bone/90 backdrop-blur dark:border-edge/70 dark:bg-ink/90">
      <div className="shell grid h-16 grid-cols-3 items-center lg:h-20">
        {/* LEFT: desktop nav (Home, About Us) | mobile: hamburger */}
        <div className="flex items-center">
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LEFT.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "font-body text-sm font-medium transition-colors hover:text-gold",
                    isActive ? "text-gold" : "text-ink dark:text-bone",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            aria-label="Menu"
            className="p-1 text-ink dark:text-bone lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>

        {/* CENTER: Logo */}
        <div className="flex justify-center">
          <Link to="/" aria-label="Potter's Design — home">
            <img
              src="/logo.png"
              alt="Potter's Design"
              className="h-9 w-auto mix-blend-multiply dark:mix-blend-screen lg:h-10"
            />
          </Link>
        </div>

        {/* RIGHT: Shop (desktop) + utility icons */}
        <div className="flex items-center justify-end gap-2 lg:gap-4">
          {/* Language switcher */}
          <div className="notranslate hidden sm:inline-flex relative items-center">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none rounded-card border border-mist/80 bg-transparent py-1 pl-2.5 pr-6 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-gold focus:border-gold focus:outline-none dark:border-edge/80 dark:text-bone cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-bone text-ink dark:bg-carbon dark:text-bone">
                  {l.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 text-[9px] text-ink/50 dark:text-bone/50">
              ▼
            </span>
          </div>

          <button
            aria-label="Search"
            onClick={toggleSearch}
            className="p-1 text-ink hover:text-gold dark:text-bone dark:hover:text-gold"
          >
            <SearchIcon />
          </button>

          <Link to="/wishlist" aria-label="Wishlist" className="relative p-1 text-ink hover:text-gold dark:text-bone dark:hover:text-gold">
            <HeartIcon />
            {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
          </Link>

          <button
            aria-label="Cart"
            onClick={toggleCart}
            className="relative p-1 text-ink hover:text-gold dark:text-bone dark:hover:text-gold"
          >
            <BagIcon />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </button>

          {/* Shopping Music Toggle */}
          <button
            aria-label={musicPlaying ? "Mute background music" : "Play background music"}
            title={musicPlaying ? "Mute background music" : "Play background music"}
            onClick={toggleMusic}
            className="flex h-7 w-7 items-center justify-center p-1 text-ink hover:text-gold dark:text-bone dark:hover:text-gold"
          >
            {musicPlaying ? (
              <div className="flex h-4 items-end gap-[3px]">
                <span className="soundwave-bar animate-soundwave-1 h-3 w-[2px] bg-current rounded-full" />
                <span className="soundwave-bar animate-soundwave-2 h-4 w-[2px] bg-current rounded-full" />
                <span className="soundwave-bar animate-soundwave-3 h-2.5 w-[2px] bg-current rounded-full" />
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M23 9l-6 6M17 9l6 6" />
              </svg>
            )}
          </button>

          {/* Theme toggle */}
          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="p-1 text-ink hover:text-gold dark:text-bone dark:hover:text-gold"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-mist bg-bone dark:border-edge dark:bg-ink lg:hidden">
          <div className="shell flex flex-col py-2">
            {ALL_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 font-body text-sm font-medium",
                    isActive ? "text-gold" : "text-ink dark:text-bone",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Mobile Language Switcher */}
            <div className="notranslate mt-3 pt-3 border-t border-mist/50 dark:border-edge/50 flex items-center justify-between py-2">
              <span className="text-xs font-semibold text-ink/60 dark:text-bone/60 uppercase">Language</span>
              <div className="relative inline-flex items-center">
                <select
                  aria-label="Language"
                  value={lang}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none rounded-card border border-mist/80 bg-transparent py-1 pl-3 pr-7 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-gold focus:border-gold focus:outline-none dark:border-edge/80 dark:text-bone cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-bone text-ink dark:bg-carbon dark:text-bone">
                      {l.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 text-[9px] text-ink/50 dark:text-bone/50">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
      {children}
    </span>
  );
}

/* --- inline icons --- */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9Z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
