import { useEffect, useState } from "react";
import { useShippingStore } from "@/store/useShippingStore";
import { useToastStore } from "@/store/useToastStore";
import { DEFAULT_SHIPPING_SETTINGS } from "@/lib/shipping-db";
import type { ShippingSettings, LagosDeliveryZoneSetting } from "@/types/shipping";
import { NIGERIAN_STATES, SHIPPING_COUNTRIES } from "@/constants/shipping";
import { formatPrice } from "@/lib/format";

type SubTab = "interstate" | "international" | "routing";

export function ShippingRatesManager() {
  const settings = useShippingStore((s) => s.settings);
  const updateSettings = useShippingStore((s) => s.updateSettings);
  const addToast = useToastStore((s) => s.addToast);

  const [activeSubTab, setActiveSubTab] = useState<SubTab>("interstate");
  const [form, setForm] = useState<ShippingSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  // Sync form state when live settings arrive from Firestore
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      addToast("Shipping & delivery rates updated successfully!");
    } catch (err) {
      console.error("Save shipping settings error:", err);
      addToast("Failed to save shipping rates. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all shipping rates to original default cards?")) {
      setForm(DEFAULT_SHIPPING_SETTINGS);
      addToast("Reset to default rate cards. Click 'Save Changes' to apply.");
    }
  };

  // Bulk rate adjustment for International matrix
  const [bulkZone, setBulkZone] = useState<number | "all">("all");
  const [bulkPercent, setBulkPercent] = useState<number>(10);

  const applyBulkAdjustment = (direction: "increase" | "decrease") => {
    const factor = direction === "increase" ? 1 + bulkPercent / 100 : 1 - bulkPercent / 100;
    const newRates = form.internationalRates.map((row) => {
      const updatedRow = [...row] as [number, number, number, number, number, number, number, number, number];
      if (bulkZone === "all") {
        for (let i = 1; i <= 8; i++) {
          updatedRow[i] = Math.round((updatedRow[i] * factor) / 100) * 100;
        }
      } else {
        const z = Number(bulkZone);
        updatedRow[z] = Math.round((updatedRow[z] * factor) / 100) * 100;
      }
      return updatedRow;
    });

    setForm({ ...form, internationalRates: newRates });
    addToast(`Bulk ${direction} of ${bulkPercent}% applied to ${bulkZone === "all" ? "all zones" : `Zone ${bulkZone}`}`);
  };

  const handleAddWeightRow = () => {
    const lastRow = form.internationalRates[form.internationalRates.length - 1];
    const newWeight = lastRow ? Number((lastRow[0] + 1).toFixed(1)) : 1;
    const baseRow: [number, number, number, number, number, number, number, number, number] = [
      newWeight,
      lastRow ? Math.round(lastRow[1] * 1.05) : 80000,
      lastRow ? Math.round(lastRow[2] * 1.05) : 80000,
      lastRow ? Math.round(lastRow[3] * 1.05) : 95000,
      lastRow ? Math.round(lastRow[4] * 1.05) : 115000,
      lastRow ? Math.round(lastRow[5] * 1.05) : 105000,
      lastRow ? Math.round(lastRow[6] * 1.05) : 115000,
      lastRow ? Math.round(lastRow[7] * 1.05) : 125000,
      lastRow ? Math.round(lastRow[8] * 1.05) : 130000,
    ];
    setForm({ ...form, internationalRates: [...form.internationalRates, baseRow] });
  };

  const handleRemoveWeightRow = (idx: number) => {
    const newRates = form.internationalRates.filter((_, i) => i !== idx);
    setForm({ ...form, internationalRates: newRates });
  };

  const handleAddLagosZone = () => {
    const newZone: LagosDeliveryZoneSetting = {
      id: `New Zone ${form.lagosZones.length + 1}`,
      fee: 5000,
      areas: ["Area 1", "Area 2"],
    };
    setForm({ ...form, lagosZones: [...form.lagosZones, newZone] });
  };

  const handleRemoveLagosZone = (idx: number) => {
    const newZones = form.lagosZones.filter((_, i) => i !== idx);
    setForm({ ...form, lagosZones: newZones });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-card border border-mist bg-surface/50 p-5 dark:border-edge dark:bg-edge/10">
        <div>
          <h2 className="font-display text-xl font-semibold">Shipping & Delivery Rates Manager</h2>
          <p className="mt-1 text-xs text-ink/60 dark:text-bone/60">
            Manage comprehensive delivery fees, weight brackets, Lagos zones, and international carrier rates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn border-mist hover:border-ink dark:border-edge dark:hover:border-bone px-4 py-2 text-xs"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn bg-gold !text-white hover:bg-gold/90 px-5 py-2 text-xs font-semibold shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Rate Settings"}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-mist dark:border-edge">
        <button
          onClick={() => setActiveSubTab("interstate")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeSubTab === "interstate"
              ? "border-gold text-gold"
              : "border-transparent text-ink/60 hover:text-ink dark:text-bone/60 dark:hover:text-bone"
          }`}
        >
          🇳🇬 Domestic Nigeria (Standard, Express & Lagos)
        </button>
        <button
          onClick={() => setActiveSubTab("international")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeSubTab === "international"
              ? "border-gold text-gold"
              : "border-transparent text-ink/60 hover:text-ink dark:text-bone/60 dark:hover:text-bone"
          }`}
        >
          ✈️ International Rate Card (Zones 1–8 Matrix)
        </button>
        <button
          onClick={() => setActiveSubTab("routing")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeSubTab === "routing"
              ? "border-gold text-gold"
              : "border-transparent text-ink/60 hover:text-ink dark:text-bone/60 dark:hover:text-bone"
          }`}
        >
          🗺️ State & Country Routing Rules
        </button>
      </div>

      {/* ── TAB 1: INTERSTATE & LAGOS RATES ────────────────────────────────── */}
      {activeSubTab === "interstate" && (
        <div className="space-y-8">
          {/* Interstate Standard Delivery (5–7 Days) */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="flex items-center justify-between border-b border-mist pb-3 dark:border-edge">
              <div>
                <h3 className="font-display text-base font-semibold">Standard Interstate Delivery (5–7 Working Days)</h3>
                <p className="text-xs text-ink/50 dark:text-bone/50">
                  Fixed standard delivery rates by state zone A through E.
                </p>
              </div>
              <span className="rounded bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
                Zones A–E
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {(["A", "B", "C", "D", "E"] as const).map((z) => (
                <div key={z} className="rounded-card border border-mist bg-surface/40 p-3 dark:border-edge dark:bg-edge/10">
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-bone/70">
                    Zone {z} Rate (₦)
                  </span>
                  <input
                    type="number"
                    value={form.interstateStandard[z] ?? 12000}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        interstateStandard: {
                          ...form.interstateStandard,
                          [z]: Number(e.target.value),
                        },
                      })
                    }
                    className="input-field mt-1.5 font-mono text-sm font-bold text-gold"
                  />
                  <p className="mt-1 text-[11px] text-ink/50 dark:text-bone/50">
                    Formatted: {formatPrice(form.interstateStandard[z] ?? 12000)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interstate Express Delivery (1–3 Days) */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="flex items-center justify-between border-b border-mist pb-3 dark:border-edge">
              <div>
                <h3 className="font-display text-base font-semibold">Express Interstate Delivery (1–3 Working Days)</h3>
                <p className="text-xs text-ink/50 dark:text-bone/50">
                  Fast express delivery rates by express zone 1 through 3.
                </p>
              </div>
              <span className="rounded bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold uppercase tracking-wider">
                Zones 1–3
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {([1, 2, 3] as const).map((z) => (
                <div key={z} className="rounded-card border border-mist bg-surface/40 p-3 dark:border-edge dark:bg-edge/10">
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink/70 dark:text-bone/70">
                    Express Zone {z} Rate (₦)
                  </span>
                  <input
                    type="number"
                    value={form.interstateExpress[z] ?? 20000}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        interstateExpress: {
                          ...form.interstateExpress,
                          [z]: Number(e.target.value),
                        },
                      })
                    }
                    className="input-field mt-1.5 font-mono text-sm font-bold text-gold"
                  />
                  <p className="mt-1 text-[11px] text-ink/50 dark:text-bone/50">
                    Formatted: {formatPrice(form.interstateExpress[z] ?? 20000)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lagos City Local Delivery Zones */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="flex items-center justify-between border-b border-mist pb-3 dark:border-edge">
              <div>
                <h3 className="font-display text-base font-semibold">Lagos Local Delivery Zones & Fees</h3>
                <p className="text-xs text-ink/50 dark:text-bone/50">
                  Auto-detected delivery zones for addresses within Lagos State.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLagosZone}
                className="btn border-gold text-gold hover:bg-gold hover:!text-white px-3 py-1.5 text-xs font-semibold"
              >
                + Add Lagos Zone
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {form.lagosZones.map((zone, idx) => (
                <div
                  key={zone.id + idx}
                  className="rounded-card border border-mist bg-surface/40 p-4 dark:border-edge dark:bg-edge/10"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink/70 dark:text-bone/70">
                        Zone Title / Name
                      </label>
                      <input
                        type="text"
                        value={zone.id}
                        onChange={(e) => {
                          const updated = [...form.lagosZones];
                          updated[idx] = { ...updated[idx], id: e.target.value };
                          setForm({ ...form, lagosZones: updated });
                        }}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink/70 dark:text-bone/70">
                        Delivery Fee (₦)
                      </label>
                      <input
                        type="number"
                        value={zone.fee}
                        onChange={(e) => {
                          const updated = [...form.lagosZones];
                          updated[idx] = { ...updated[idx], fee: Number(e.target.value) };
                          setForm({ ...form, lagosZones: updated });
                        }}
                        className="input-field mt-1 font-mono font-bold text-gold"
                      />
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-ink/70 dark:text-bone/70">
                          Covered Areas (comma separated)
                        </label>
                        <input
                          type="text"
                          value={zone.areas.join(", ")}
                          onChange={(e) => {
                            const updated = [...form.lagosZones];
                            updated[idx] = {
                              ...updated[idx],
                              areas: e.target.value.split(",").map((a) => a.trim()).filter(Boolean),
                            };
                            setForm({ ...form, lagosZones: updated });
                          }}
                          className="input-field mt-1 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLagosZone(idx)}
                        className="rounded border border-sale/40 p-2 text-xs font-semibold text-sale hover:bg-sale/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: INTERNATIONAL RATE MATRIX (ZONES 1–8) ────────────────── */}
      {activeSubTab === "international" && (
        <div className="space-y-6">
          {/* Bulk Matrix Adjustments Tool */}
          <div className="rounded-card border border-gold/40 bg-gold/5 p-4 dark:border-gold/30 dark:bg-gold/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Bulk Matrix Price Adjustment Tool</h4>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-ink/70 dark:text-bone/70">Adjust</span>
              <select
                value={bulkZone}
                onChange={(e) => setBulkZone(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="input-field !w-auto !py-1 text-xs"
              >
                <option value="all">All Zones (1–8)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((z) => (
                  <option key={z} value={z}>
                    Zone {z} Only
                  </option>
                ))}
              </select>
              <span className="text-xs text-ink/70 dark:text-bone/70">by</span>
              <input
                type="number"
                value={bulkPercent}
                onChange={(e) => setBulkPercent(Number(e.target.value))}
                className="input-field !w-20 !py-1 text-xs font-bold"
              />
              <span className="text-xs text-ink/70 dark:text-bone/70">%</span>
              <button
                type="button"
                onClick={() => applyBulkAdjustment("increase")}
                className="btn bg-gold !text-white hover:bg-gold/90 px-3 py-1 text-xs font-semibold"
              >
                + Increase Prices
              </button>
              <button
                type="button"
                onClick={() => applyBulkAdjustment("decrease")}
                className="btn border-mist hover:border-ink dark:border-edge dark:hover:border-bone px-3 py-1 text-xs"
              >
                - Decrease Prices
              </button>
            </div>
          </div>

          {/* Rate Matrix Table */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold">International Rate Card Matrix (Zones 1–8)</h3>
                <p className="text-xs text-ink/50 dark:text-bone/50">
                  Weight-based rates in NGN. Row 0.5kg to 30kg. Click any cell to edit fee.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWeightRow}
                className="btn border-gold text-gold hover:bg-gold hover:!text-white px-3 py-1.5 text-xs font-semibold"
              >
                + Add Weight Step
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-mist bg-surface/50 text-[11px] font-bold text-ink/70 dark:border-edge dark:bg-edge/20 dark:text-bone/70">
                    <th className="p-2.5">Weight (kg)</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((z) => (
                      <th key={z} className="p-2.5 text-center">
                        Zone {z}
                      </th>
                    ))}
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.internationalRates.map((row, rIdx) => (
                    <tr
                      key={row[0] + "-" + rIdx}
                      className="border-b border-mist/40 hover:bg-surface/30 dark:border-edge/40 dark:hover:bg-edge/10"
                    >
                      <td className="p-2 font-bold font-mono text-gold">
                        <input
                          type="number"
                          step="0.5"
                          value={row[0]}
                          onChange={(e) => {
                            const newRates = [...form.internationalRates];
                            newRates[rIdx][0] = Number(e.target.value);
                            setForm({ ...form, internationalRates: newRates });
                          }}
                          className="input-field !w-20 !py-1 font-mono text-xs font-bold"
                        />
                      </td>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((zIdx) => (
                        <td key={zIdx} className="p-1">
                          <input
                            type="number"
                            value={row[zIdx]}
                            onChange={(e) => {
                              const newRates = [...form.internationalRates];
                              newRates[rIdx][zIdx] = Number(e.target.value);
                              setForm({ ...form, internationalRates: newRates });
                            }}
                            className="input-field text-center font-mono !py-1 text-xs"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveWeightRow(rIdx)}
                          className="text-sale hover:underline text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: STATE & COUNTRY ROUTING RULES ────────────────────────── */}
      {activeSubTab === "routing" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nigerian States Routing */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Nigerian States Zone Routing</h3>
              <input
                type="text"
                placeholder="Search state..."
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="input-field !w-44 !py-1 text-xs"
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-mist text-ink/50 dark:border-edge dark:text-bone/50">
                    <th className="py-2">State Name</th>
                    <th className="py-2">Standard Zone</th>
                    <th className="py-2">Express Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {NIGERIAN_STATES.filter((s) => s.name.toLowerCase().includes(searchState.toLowerCase())).map((s) => (
                    <tr key={s.name} className="border-b border-mist/30 dark:border-edge/30">
                      <td className="py-2 font-medium">{s.name}</td>
                      <td className="py-2 font-bold text-gold">{s.zone === "Lagos" ? "Lagos City" : `Zone ${s.zone}`}</td>
                      <td className="py-2 text-ink/70 dark:text-bone/70">
                        {s.expressZone ? `Express Zone ${s.expressZone}` : "Local Delivery"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* International Country Zone Assignments */}
          <div className="rounded-card border border-mist bg-bone p-5 dark:border-edge dark:bg-carbon">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Country International Zones</h3>
              <input
                type="text"
                placeholder="Search country..."
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="input-field !w-44 !py-1 text-xs"
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-mist text-ink/50 dark:border-edge dark:text-bone/50">
                    <th className="py-2">Country</th>
                    <th className="py-2">Code</th>
                    <th className="py-2">Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_COUNTRIES.filter((c) => c.name.toLowerCase().includes(searchCountry.toLowerCase())).map(
                    (c) => (
                      <tr key={c.code} className="border-b border-mist/30 dark:border-edge/30">
                        <td className="py-2 font-medium">{c.name}</td>
                        <td className="py-2 font-mono text-ink/50">{c.code}</td>
                        <td className="py-2 font-semibold text-gold">
                          {c.zone === 0 ? "Domestic" : `Zone ${c.zone}`}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
