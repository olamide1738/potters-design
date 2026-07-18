interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Straight sizes: XS–L (PD 4–14) · Plus sizes: L–2XL (PD 16–22)
const DRESSES_TOPS = [
  { label: "XS",  pd: "4",  uk: "6",  us: "2",  eu: "34", bust: "32 / 81",  waist: "24 / 61",  hip: "34 / 86",  length: "36 / 91" },
  { label: "S",   pd: "6",  uk: "8",  us: "4",  eu: "36", bust: "34 / 86",  waist: "26 / 66",  hip: "36 / 91",  length: "36.5 / 92" },
  { label: "S",   pd: "8",  uk: "10", us: "6",  eu: "38", bust: "36 / 91",  waist: "28 / 71",  hip: "38 / 97",  length: "37 / 94" },
  { label: "M",   pd: "10", uk: "12", us: "8",  eu: "40", bust: "38 / 97",  waist: "30 / 76",  hip: "40 / 102", length: "37.5 / 95" },
  { label: "M",   pd: "12", uk: "14", us: "10", eu: "42", bust: "40 / 102", waist: "32 / 81",  hip: "42 / 107", length: "38 / 96" },
  { label: "L",   pd: "14", uk: "16", us: "12", eu: "44", bust: "42 / 107", waist: "34 / 86",  hip: "44 / 112", length: "38.5 / 97" },
  { label: "L",   pd: "16", uk: "18", us: "14", eu: "46", bust: "45 / 114", waist: "37 / 94",  hip: "47 / 119", length: "39 / 99" },
  { label: "XL",  pd: "18", uk: "20", us: "16", eu: "48", bust: "47 / 119", waist: "39 / 99",  hip: "49 / 125", length: "39.5 / 100" },
  { label: "XL",  pd: "20", uk: "22", us: "18", eu: "50", bust: "49 / 125", waist: "41 / 104", hip: "51 / 130", length: "40 / 101" },
  { label: "2XL", pd: "22", uk: "24", us: "20", eu: "52", bust: "51 / 129", waist: "43 / 109", hip: "53 / 135", length: "40.5 / 103" },
];

const PANTS_TWO_PIECE = [
  { label: "XS",  pd: "Size 4",       uk: "6",     us: "2",     eu: "34", waist: "24 / 61",  hip: "34 / 86",  length: "38 / 96" },
  { label: "S",   pd: "Size 6 – 8",   uk: "8–10",  us: "4–6",   eu: "36–38", waist: "26-28 / 66-71", hip: "36-38 / 91-97", length: "39 / 99" },
  { label: "M",   pd: "Size 10 – 12", uk: "12–14", us: "8–10",  eu: "40–42", waist: "30-32 / 76-81", hip: "40-42 / 102-107", length: "40 / 101" },
  { label: "L",   pd: "Size 14 – 16", uk: "16–18", us: "12–14", eu: "44–46", waist: "34-37 / 86-94", hip: "44-47 / 112-119", length: "41 / 104" },
  { label: "XL",  pd: "Size 18 – 20", uk: "20–22", us: "16–18", eu: "48–50", waist: "39-41 / 99-104", hip: "49-51 / 125-130", length: "42 / 107" },
  { label: "2XL", pd: "Size 22",      uk: "24",    us: "20",    eu: "52", waist: "43 / 109", hip: "53 / 135", length: "43 / 109" },
];

export function SizeGuide({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-label="Size guide"
        className="fixed inset-x-4 top-[5%] z-50 mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-bone shadow-2xl dark:bg-carbon"
      >
        {/* Sticky header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-mist bg-bone px-6 py-4 dark:border-edge dark:bg-carbon">
          <h2 className="font-display text-lg font-semibold">
            Potter's Design Size Guide
          </h2>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="grid h-9 w-9 place-items-center rounded-full border border-mist text-ink/50 transition-colors hover:border-ink hover:text-ink dark:border-edge dark:text-bone/50 dark:hover:border-bone dark:hover:text-bone"
          >
            <XIcon />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          {/* Dresses & Tops */}
          <section>
            <h3 className="mb-1 font-display text-base font-semibold">
              Dresses & Tops (Outfits)
            </h3>
            <p className="mb-4 text-xs text-ink/50 dark:text-bone/50">
              Measurements in inches / cm
            </p>
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-mist dark:border-edge">
                    {["Size", "PD", "UK", "US", "EU", "Bust", "Waist", "Hip", "Length"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/50 dark:text-bone/50"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {DRESSES_TOPS.map((row, i) => (
                    <tr
                      key={`${row.label}-${row.pd}`}
                      className={`border-b border-mist/50 dark:border-edge/50 ${
                        i % 2 === 0 ? "bg-surface/40 dark:bg-edge/10" : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 font-bold">{row.label}</td>
                      <td className="px-3 py-2.5 font-semibold text-gold">
                        {row.pd}
                      </td>
                      <td className="px-3 py-2.5">{row.uk}</td>
                      <td className="px-3 py-2.5">{row.us}</td>
                      <td className="px-3 py-2.5">{row.eu}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.bust}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.waist}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.hip}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pants / Two-Piece Sets */}
          <section>
            <h3 className="mb-4 font-display text-base font-semibold">
              Pants / Two-Piece Sets
            </h3>
            <div className="-mx-2 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-mist dark:border-edge">
                    {[
                      "Size",
                      "PD",
                      "UK",
                      "US",
                      "EU",
                      "Waist",
                      "Hip",
                      "Length",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/50 dark:text-bone/50"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PANTS_TWO_PIECE.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-mist/50 dark:border-edge/50 ${
                        i % 2 === 0 ? "bg-surface/40 dark:bg-edge/10" : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 font-bold">{row.label}</td>
                      <td className="px-3 py-2.5 font-semibold text-gold">
                        {row.pd}
                      </td>
                      <td className="px-3 py-2.5">{row.uk}</td>
                      <td className="px-3 py-2.5">{row.us}</td>
                      <td className="px-3 py-2.5">{row.eu}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.waist}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.hip}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {row.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-xs italic text-ink/40 dark:text-bone/40">
            Measurements are approximate. For the best fit, we recommend getting
            professionally measured. Questions? Email us at
            hello@pottersdesign.com
          </p>
        </div>
      </div>
    </>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
