import type { ProductCategory, ShopFilterState } from "@/types";
import { CATEGORIES, PRODUCT_SIZES, PRODUCT_TAGS } from "@/data/products";
import { useProducts } from "@/store/useProductStore";
import { formatPrice } from "@/lib/format";

const CATEGORY_DISPLAY: Record<ProductCategory, string> = {
  "Bubu": "Bubu",
  "Dresses": "Dresses",
  "Pants": "Pants",
  "Skirt": "Skirt",
  "Top": "Tops",
  "2-pieces": "2 Pieces",
};

interface Props {
  filters: ShopFilterState;
  onChange: (next: Partial<ShopFilterState>) => void;
  onReset: () => void;
  priceBounds: [number, number];
}

export function ShopFilters({ filters, onChange, onReset, priceBounds }: Props) {
  const products = useProducts();
  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <aside className="flex flex-col gap-8">
      {/* Search */}
      <FilterBlock title="Search">
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Text search…"
          className="w-full rounded-card border border-mist bg-bone px-3 py-2 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone dark:placeholder:text-bone/40"
        />
      </FilterBlock>

      {/* Price */}
      <FilterBlock title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin ?? ""}
            min={priceBounds[0]}
            max={priceBounds[1]}
            placeholder={String(priceBounds[0])}
            onChange={(e) => onChange({ priceMin: e.target.value ? Number(e.target.value) : null })}
            className="w-full rounded-card border border-mist bg-bone px-2 py-1.5 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
          />
          <span className="text-ink/30 dark:text-bone/30">—</span>
          <input
            type="number"
            value={filters.priceMax ?? ""}
            min={priceBounds[0]}
            max={priceBounds[1]}
            placeholder={String(priceBounds[1])}
            onChange={(e) => onChange({ priceMax: e.target.value ? Number(e.target.value) : null })}
            className="w-full rounded-card border border-mist bg-bone px-2 py-1.5 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
          />
        </div>
        <p className="mt-2 text-xs text-ink/50 dark:text-bone/50">
          {formatPrice(priceBounds[0])} – {formatPrice(priceBounds[1])}
        </p>
      </FilterBlock>

      {/* Availability */}
      <FilterBlock title="Availability">
        <Check
          label="In stock"
          checked={filters.inStockOnly}
          onChange={(v) => onChange({ inStockOnly: v })}
        />
        <Check
          label="On sale"
          checked={filters.onSaleOnly}
          onChange={(v) => onChange({ onSaleOnly: v })}
        />
      </FilterBlock>

      {/* Categories */}
      <FilterBlock title="Product categories">
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c).length;
          return (
            <Check
              key={c}
              label={`${CATEGORY_DISPLAY[c] ?? c} (${count})`}
              checked={filters.categories.includes(c)}
              onChange={() =>
                onChange({
                  categories: toggle<ProductCategory>(filters.categories, c),
                })
              }
            />
          );
        })}
      </FilterBlock>

      {/* Colors */}
      {(() => {
        const availableColors = Array.from(
          new Set(
            products
              .flatMap((p) => p.colors ?? [])
              .map((c) => c.trim())
              .filter(Boolean)
          )
        ).sort();

        if (availableColors.length === 0) return null;

        return (
          <FilterBlock title="Product color">
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((c) => {
                const on = filters.colors.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChange({ colors: toggle(filters.colors, c) })}
                    className={
                      "rounded-card border px-2.5 py-1 text-xs transition-colors " +
                      (on
                        ? "border-ink bg-ink text-bone dark:border-bone dark:bg-bone dark:text-ink"
                        : "border-mist text-ink hover:border-ink dark:border-edge dark:text-bone dark:hover:border-bone")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </FilterBlock>
        );
      })()}

      {/* Sizes */}
      <FilterBlock title="Product size">
        <div className="flex flex-wrap gap-1.5">
          {PRODUCT_SIZES.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => onChange({ sizes: toggle(filters.sizes, s) })}
                className={
                  "min-w-9 rounded-card border px-2 py-1 text-xs transition-colors " +
                  (on
                    ? "border-ink bg-ink text-bone dark:border-bone dark:bg-bone dark:text-ink"
                    : "border-mist text-ink hover:border-ink dark:border-edge dark:text-bone dark:hover:border-bone")
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* Tags */}
      <FilterBlock title="Product tags">
        <div className="flex flex-wrap gap-1.5">
          {PRODUCT_TAGS.map((t) => {
            const on = filters.tags.includes(t);
            return (
              <button
                key={t}
                onClick={() => onChange({ tags: toggle(filters.tags, t) })}
                className={
                  "rounded-card border px-2.5 py-1 text-xs transition-colors " +
                  (on
                    ? "border-gold bg-gold !text-white"
                    : "border-mist text-ink/70 hover:border-gold dark:border-edge dark:text-bone/70 dark:hover:border-gold")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <button onClick={onReset} className="self-start text-sm font-semibold text-gold underline underline-offset-4">
        Reset all filters
      </button>
    </aside>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-mist/70 pb-6 last:border-0 dark:border-edge/70">
      <h3 className="mb-3 font-display text-base font-semibold">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-sm border-mist text-gold focus:ring-gold dark:border-edge"
      />
      <span>{label}</span>
    </label>
  );
}
