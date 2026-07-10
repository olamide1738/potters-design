import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopFilters } from "@/components/ShopFilters";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/data/products";
import { priceCeil, priceFloor } from "@/lib/format";
import type { ProductCategory, ShopFilterState, SortKey } from "@/types";

const VALID_CATEGORIES: ProductCategory[] = ["2-pieces", "Bubu", "Dresses", "Pants", "Skirt", "Top"];
const VALID_SORTS: SortKey[] = ["default", "newest", "price-asc", "price-desc", "name-asc"];

const INITIAL: ShopFilterState = {
  search: "",
  categories: [],
  tags: [],
  colors: [],
  sizes: [],
  priceMin: null,
  priceMax: null,
  inStockOnly: false,
  onSaleOnly: false,
  sort: "default",
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name-asc", label: "Name: A–Z" },
];

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");

  const categoryFromUrl =
    categoryParam && VALID_CATEGORIES.includes(categoryParam as ProductCategory)
      ? [categoryParam as ProductCategory]
      : [];
  const sortFromUrl =
    sortParam && VALID_SORTS.includes(sortParam as SortKey) ? (sortParam as SortKey) : "default";

  const [filters, setFilters] = useState<ShopFilterState>({
    ...INITIAL,
    search: qParam,
    categories: categoryFromUrl,
    sort: sortFromUrl,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Re-derive the full filter state whenever the URL's own query params
  // change (e.g. clicking a footer/search link) — a fresh link should show a
  // fresh view, not merge with whatever filters were set before navigating.
  // This does NOT re-run on manual sidebar edits, since those never touch
  // the URL.
  useEffect(() => {
    setFilters({
      ...INITIAL,
      search: qParam,
      categories: categoryFromUrl,
      sort: sortFromUrl,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, categoryParam, sortParam]);

  const priceBounds = useMemo<[number, number]>(() => {
    const lows = PRODUCTS.map((p) => priceFloor(p.price));
    const highs = PRODUCTS.map((p) => priceCeil(p.price));
    return [Math.min(...lows), Math.max(...highs)];
  }, []);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.colors.some((c) => c.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.tags.length && !filters.tags.some((t) => p.tags.includes(t))) return false;
      if (filters.colors.length && !filters.colors.some((c) => p.colors.includes(c))) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.onSaleOnly && !p.onSale) return false;
      if (filters.priceMin != null && priceCeil(p.price) < filters.priceMin) return false;
      if (filters.priceMax != null && priceFloor(p.price) > filters.priceMax) return false;
      return true;
    });

    switch (filters.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => priceFloor(a.price) - priceFloor(b.price));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => priceFloor(b.price) - priceFloor(a.price));
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        list = [...list].sort((a, b) => b.id - a.id);
        break;
    }
    return list;
  }, [filters]);

  const update = (next: Partial<ShopFilterState>) => setFilters((f) => ({ ...f, ...next }));
  const reset = () => setFilters(INITIAL);

  return (
    <>
      {/* Page header */}
      <div className="border-b border-mist bg-bone dark:border-edge dark:bg-ink">
        <div className="shell py-12">
          <span className="eyebrow">The Collection</span>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">The Authority</h1>
          <span className="mt-4 block h-1 w-14 rounded-full bg-gold" />
        </div>
      </div>

      <div className="shell grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        {/* Filters — desktop */}
        <div className="hidden lg:block">
          <ShopFilters filters={filters} onChange={update} onReset={reset} priceBounds={priceBounds} />
        </div>

        {/* Filters — mobile toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMobileFiltersOpen((v) => !v)} className="btn-ghost w-full">
            {mobileFiltersOpen ? "Hide filters" : "Show filters"}
          </button>
          {mobileFiltersOpen && (
            <div className="mt-6">
              <ShopFilters filters={filters} onChange={update} onReset={reset} priceBounds={priceBounds} />
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-ink/60 dark:text-bone/60">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink/60 dark:text-bone/60">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="rounded-card border border-mist bg-bone px-2 py-1.5 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="rounded-card border border-dashed border-mist py-20 text-center dark:border-edge">
              <p className="font-display text-xl">No pieces match those filters.</p>
              <button onClick={reset} className="mt-3 text-sm font-semibold text-gold underline underline-offset-4">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {results.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 70}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
