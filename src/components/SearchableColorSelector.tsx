import { useState, useRef, useEffect } from "react";
import { PRODUCT_COLORS } from "@/data/products";

interface Props {
  selected: string[];
  onToggle: (color: string) => void;
  showLabel?: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchableColorSelector({
  selected,
  onToggle,
  showLabel = true,
  placeholder = "Search color (e.g. Red, Blue)...",
  className = "",
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = PRODUCT_COLORS.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const isExactMatch = PRODUCT_COLORS.some(
    (c) => c.toLowerCase() === query.trim().toLowerCase(),
  );

  const canAddCustom = query.trim() && !isExactMatch;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {showLabel && <span className="mb-1 block text-sm font-semibold">Colors</span>}

      {/* Selected Color Pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-card border border-gold bg-gold/15 px-2 py-0.5 text-xs font-semibold text-ink dark:text-bone"
            >
              <span className="h-2 w-2 rounded-full bg-gold border border-mist inline-block"></span>
              {c}
              <button
                type="button"
                onClick={() => onToggle(c)}
                className="text-ink/60 hover:text-sale dark:text-bone/60 dark:hover:text-sale ml-0.5 text-xs font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="input-field py-1 text-xs w-full"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink dark:text-bone/40 dark:hover:text-bone"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-card border border-mist bg-bone shadow-xl dark:border-edge dark:bg-ink p-1">
          {canAddCustom && (
            <button
              type="button"
              onClick={() => {
                const custom = query.trim();
                if (!selected.includes(custom)) {
                  onToggle(custom);
                }
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10 rounded flex items-center gap-1.5"
            >
              <span>+ Add custom color "{query.trim()}"</span>
            </button>
          )}

          {filtered.length > 0 ? (
            filtered.map((color) => {
              const isSelected = selected.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onToggle(color);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-gold/20 font-semibold text-ink dark:text-bone"
                      : "hover:bg-mist/50 dark:hover:bg-edge/50 text-ink/80 dark:text-bone/80"
                  }`}
                >
                  <span>{color}</span>
                  {isSelected && <span className="text-[10px] text-gold font-bold">Selected</span>}
                </button>
              );
            })
          ) : (
            !canAddCustom && (
              <p className="px-2.5 py-1.5 text-xs italic text-ink/50 dark:text-bone/50">No colors found</p>
            )
          )}
        </div>
      )}
    </div>
  );
}
