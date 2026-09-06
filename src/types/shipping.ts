export interface LagosDeliveryZoneSetting {
  id: string;
  fee: number;
  areas: string[];
}

export interface ShippingSettings {
  interstateStandard: Record<"A" | "B" | "C" | "D" | "E", number>;
  interstateExpress: Record<1 | 2 | 3, number>;
  /** Array of [weightKg, standardRate, expressRate] for 0–20kg weight-based card */
  interstateRates?: [number, number, number][];
  lagosZones: LagosDeliveryZoneSetting[];
  /** Array of [weightKg, z1, z2, z3, z4, z5, z6, z7, z8] */
  internationalRates: [number, number, number, number, number, number, number, number, number][];
  updatedAt?: number;
}
