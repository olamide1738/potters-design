import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/useUIStore";
import { PRODUCTS } from "@/data/products";
import { formatProductPrice } from "@/lib/format";

const MAX_RESULTS = 6;
const PLACEHOLDER = "/hanger-placeholder.svg";

export function SearchOverlay() {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q)),
    ).slice(0, MAX_RESULTS);
  }, [query]);

  // Reset + focus on open, lock scroll, esc to close
  useEffect(() => {
    if (!searchOpen) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  const viewAll = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    closeSearch();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Search products" className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div aria-hidden onClick={closeSearch} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />

      {/* Panel — anchored below the header */}
      <div className="relative mx-auto max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto rounded-b-2xl bg-bone shadow-2xl dark:bg-carbon sm:mt-20 sm:rounded-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            viewAll();
          }}
          className="flex items-center gap-3 border-b border-mist px-5 py-4 dark:border-edge"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink/50 dark:text-bone/50">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dresses, skirts, colours…"
            className="flex-1 bg-transparent text-base text-ink placeholder:text-ink/40 focus:outline-none dark:text-bone dark:placeholder:text-bone/40"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/50 transition-colors hover:bg-surface hover:text-ink dark:text-bone/50 dark:hover:bg-edge/40 dark:hover:text-bone"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </form>

        <div className="px-5 py-4">
          {query.trim() === "" && (
            <p className="py-6 text-center text-sm text-ink/50 dark:text-bone/50">
              Start typing to search the collection.
            </p>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <p className="py-6 text-center text-sm text-ink/50 dark:text-bone/50">
              No pieces match &ldquo;{query.trim()}&rdquo;.
            </p>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-mist dark:divide-edge">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/shop/${p.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 py-3 transition-colors hover:text-gold"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER;
                      }}
                      className="h-16 w-12 shrink-0 rounded-card object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm font-medium leading-snug">{p.name}</p>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-ink/50 dark:text-bone/50">
                        {p.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gold">
                      {formatProductPrice(p.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim() !== "" && (
            <button
              onClick={viewAll}
              className="mt-3 w-full rounded-card border border-mist py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold dark:border-edge dark:text-bone"
            >
              View all results for &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
