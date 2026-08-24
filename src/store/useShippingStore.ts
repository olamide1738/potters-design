import { create } from "zustand";
import type { ShippingSettings } from "@/types/shipping";
import {
  DEFAULT_SHIPPING_SETTINGS,
  saveShippingSettings,
  subscribeToShippingSettings,
} from "@/lib/shipping-db";
import { COUNTRY_MAP, NIGERIAN_STATES } from "@/constants/shipping";

interface ShippingStoreState {
  settings: ShippingSettings;
  loaded: boolean;
  subscribe: () => () => void;
  updateSettings: (newSettings: ShippingSettings) => Promise<void>;
}

export const useShippingStore = create<ShippingStoreState>((set) => {
  let unsub: (() => void) | null = null;

  return {
    settings: DEFAULT_SHIPPING_SETTINGS,
    loaded: false,

    subscribe: () => {
      if (unsub) return unsub;
      unsub = subscribeToShippingSettings(
        (data) => {
          set({ settings: data, loaded: true });
        },
        () => {
          set({ loaded: true });
        }
      );
      return () => {
        unsub?.();
        unsub = null;
      };
    },

    updateSettings: async (newSettings) => {
      set({ settings: newSettings });
      await saveShippingSettings(newSettings);
    },
  };
});

export const useShippingSettings = () => useShippingStore((s) => s.settings);

/**
 * Calculates live interstate rates for a given Nigerian state using active shipping settings.
 */
export function getLiveInterstateRates(
  stateName: string,
  settings: ShippingSettings = useShippingStore.getState().settings
) {
  const state = NIGERIAN_STATES.find((s) => s.name === stateName);
  if (!state || state.zone === "Lagos") return null;

  const stdZone = state.zone as "A" | "B" | "C" | "D" | "E";
  const expZone = (state.expressZone ?? 2) as 1 | 2 | 3;

  const stdFee = settings.interstateStandard?.[stdZone] ?? 12000;
  const expFee = settings.interstateExpress?.[expZone] ?? 20000;

  return {
    standard: {
      fee: stdFee,
      service: "Standard Delivery (5–7 Working Days)",
      deliveryDays: "5–7 Working Days",
      zoneLabel: `Zone ${stdZone}`,
    },
    express: {
      fee: expFee,
      service: "Express Delivery (1–3 Working Days)",
      deliveryDays: "1–3 Working Days",
      zoneLabel: `Zone ${expZone}`,
    },
  };
}

/**
 * Calculates live international rate for a given country code and weight using active settings.
 */
export function getLiveInternationalRate(
  countryCode: string,
  weightKg: number,
  settings: ShippingSettings = useShippingStore.getState().settings
): number | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zone === 0) return null; // domestic

  const roundedWeight = Math.ceil(weightKg);
  const zone = country.zone;
  const ratesMatrix = settings.internationalRates ?? DEFAULT_SHIPPING_SETTINGS.internationalRates;

  const steps = ratesMatrix.map((r) => r[0]);
  const step = steps.find((s) => s >= roundedWeight) ?? steps[steps.length - 1] ?? 30;
  const row = ratesMatrix.find((r) => r[0] === step);

  if (!row) return null;
  return row[zone]; // row[1..8] maps to zone1..zone8
}
