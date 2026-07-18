interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DRESSES_TOPS = [
  { pd: "4",  uk: "6",  us: "2",  eu: "34", bust: "32 / 81",  waist: "24 / 61",  hip: "34 / 86" },
  { pd: "6",  uk: "8",  us: "4",  eu: "36", bust: "34 / 86",  waist: "26 / 66",  hip: "36 / 91" },
  { pd: "8",  uk: "10", us: "6",  eu: "38", bust: "36 / 91",  waist: "28 / 71",  hip: "38 / 97" },
  { pd: "10", uk: "12", us: "8",  eu: "40", bust: "38 / 97",  waist: "30 / 76",  hip: "40 / 102" },
  { pd: "12", uk: "14", us: "10", eu: "42", bust: "40 / 102", waist: "32 / 81",  hip: "44 / 112" },
  { pd: "14", uk: "16", us: "12", eu: "44", bust: "42 / 107", waist: "34 / 86",  hip: "46 / 117" },
  { pd: "16", uk: "18", us: "14", eu: "46", bust: "45 / 114", waist: "37 / 94",  hip: "49 / 124" },
  { pd: "18", uk: "20", us: "16", eu: "48", bust: "47 / 119", waist: "39 / 99",  hip: "52 / 132" },
  { pd: "20", uk: "22", us: "18", eu: "50", bust: "49 / 125", waist: "41 / 104", hip: "54 / 137" },
  { pd: "22", uk: "24", us: "20", eu: "52", bust: "51 / 129", waist: "43 / 109", hip: "57 / 145" },
];

const PANTS_TWO_PIECE = [
  { label: "XS",  pd: "Size 4",       uk: "6",     us: "2",     eu: "34" },
  { label: "S",   pd: "Size 6 - 8",   uk: "8-10",  us: "4-6",   eu: "36-38" },
  { label: "M",   pd: "Size 10 - 12", uk: "12-14", us: "8-10",  eu: "40-42" },
  { label: "L",   pd: "Size 14 - 16", uk: "16-18", us: "12-14", eu: "44-46" },
  { label: "XL",  pd: "Size 18 - 20", uk: "20-22", us: "16-18", eu: "48-50" },
  { label: "2XL", pd: "Size 22 - 24", uk: "24-26", us: "20-22", eu: "52-54" },
];

const LENGTH_DRESSES = [
  { length: "Short", garment: "58 inches", height: "5'3\" and under" },
  { length: "Regular", garment: "61 inches", height: "5'4\" - 5'7\"" },
  { length: "Tall", garment: "65 inches", height: "5'8\" and over" },
];

const LENGTH_TROUSERS = [
  { length: "Short", garment: "38 inches", height: "5'3\" and under" },
  { length: "Regular", garment: "41 inches", height: "5'4\" - 5'7\"" },
  { length: "Tall", garment: "45 inches", height: "5'8\" and over" },
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
        <div className="sticky top-0 flex items-center justify-between border-b border-mist bg-bone px-6 py-4 dark:border-edge dark:bg-carbon z-10">
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
                    {["PD Size", "UK", "US", "EU", "Bust (Inches / cm)", "Waist (Inches / cm)", "Hip (Inches / cm)"].map(
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
                      key={row.pd}
                      className={`border-b border-mist/50 dark:border-edge/50 ${
                        i % 2 === 0 ? "bg-surface/40 dark:bg-edge/10" : ""
                      }`}
                    >
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
                    {["Size Label", "PD Size Equivalent", "UK", "US", "EU"].map((h) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Length Guide */}
          <section className="border-t border-mist/50 pt-6 dark:border-edge/50">
            <h3 className="mb-4 font-display text-base font-semibold">
              Length Guide
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dresses & Jumpsuits */}
              <div>
                <h4 className="mb-2 font-display text-xs font-semibold uppercase tracking-wide text-ink/75 dark:text-bone/75">
                  Dresses & Jumpsuits
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-mist dark:border-edge">
                        {["Length", "Garment Length", "Recommended Height"].map((h) => (
                          <th
                            key={h}
                            className="px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-ink/50 dark:text-bone/50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LENGTH_DRESSES.map((row) => (
                        <tr key={row.length} className="border-b border-mist/30 dark:border-edge/30">
                          <td className="px-2 py-2 font-semibold">{row.length}</td>
                          <td className="px-2 py-2 text-xs">{row.garment}</td>
                          <td className="px-2 py-2 text-xs">{row.height}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trousers */}
              <div>
                <h4 className="mb-2 font-display text-xs font-semibold uppercase tracking-wide text-ink/75 dark:text-bone/75">
                  Trousers
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-mist dark:border-edge">
                        {["Length", "Garment Length", "Recommended Height"].map((h) => (
                          <th
                            key={h}
                            className="px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-ink/50 dark:text-bone/50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LENGTH_TROUSERS.map((row) => (
                        <tr key={row.length} className="border-b border-mist/30 dark:border-edge/30">
                          <td className="px-2 py-2 font-semibold">{row.length}</td>
                          <td className="px-2 py-2 text-xs">{row.garment}</td>
                          <td className="px-2 py-2 text-xs">{row.height}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Helpful Notes */}
          <section className="border-t border-mist/50 pt-6 dark:border-edge/50">
            <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Helpful Notes
            </h3>
            <ul className="space-y-2.5 text-xs text-ink/70 dark:text-bone/70">
              {[
                "If your measurements fall between two sizes, we recommend choosing the larger size for a more comfortable fit.",
                "All measurements are body measurements, shown in inches with centimetre equivalents.",
                "Garment lengths are measured from the highest shoulder point.",
                "If you're unsure about your size, our team is happy to assist you before you place your order.",
              ].map((note, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
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
