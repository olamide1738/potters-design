import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { ShippingSettings } from "@/types/shipping";

const SETTINGS_DOC = "settings/shipping";

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  interstateStandard: {
    A: 11000,
    B: 12000,
    C: 12000,
    D: 13000,
    E: 13500,
  },
  interstateExpress: {
    1: 15000,
    2: 20000,
    3: 22000,
  },
  lagosZones: [
    {
      id: "Lagos Mainland",
      fee: 4000,
      areas: [
        "Yaba", "Surulere", "Ebute Metta", "Mushin", "Somolu", "Bariga", "Gbagada", "Maryland",
        "Anthony", "Ilupeju", "Oshodi", "Isolo", "Palmgrove", "Fadeyi", "Ojota", "Ketu",
        "Alapere", "Ogudu", "Magodo", "Ikeja", "Allen", "Opebi", "GRA Ikeja", "Agege", "Ogba",
        "Iju", "Abule Egba", "Ipaja", "Gowon Estate", "Egbeda", "Ayobo", "Iyana Ipaja",
        "Alimosho", "Festac", "Amuwo Odofin", "Iganmu", "Apapa", "Orile", "Coker", "Satellite Town",
        "Kirikiri", "Mile 2", "Badagry"
      ],
    },
    {
      id: "Lagos Island",
      fee: 6000,
      areas: [
        "Victoria Island", "Ikoyi", "Banana Island", "Lekki Phase 1", "Ikate", "Oniru",
        "Chevron Drive", "Orchid Road", "VGC", "Ikota", "Osapa London", "Jakande",
        "Ajah", "Marina", "Lagos Island", "Falomo", "Eko Atlantic"
      ],
    },
    {
      id: "Ajah Corridor",
      fee: 7000,
      areas: [
        "Abraham Adesanya", "Ogombo", "Sangotedo", "Monastery Road", "LBS", "Crown Estate",
        "Novare Mall", "Abijo", "Awoyaya", "Lakowe", "Bogije"
      ],
    },
    {
      id: "Ogun Border Axis",
      fee: 7000,
      areas: [
        "Akute", "Alagbole", "Berger Extension", "Arepo", "Warewa", "OPIC", "Mowe", "Magboro"
      ],
    },
  ],
  internationalRates: [
    [0.5, 75000, 75000, 90000, 110000, 100000, 110000, 120000, 125000],
    [1,   75000, 75000, 90000, 110000, 100000, 110000, 120000, 125000],
    [1.5, 75000, 75000, 90000, 110000, 100000, 110000, 120000, 125000],
    [2,   75000, 75000, 90000, 110000, 100000, 110000, 120000, 125000],
    [3,   93000, 94000, 112000, 144000, 122000, 136000, 148000, 156000],
    [4,   111000, 113000, 193000, 178000, 146000, 162000, 176000, 187000],
    [5,   129000, 132000, 156000, 172100, 169000, 188000, 204000, 218000],
    [6,   146100, 159100, 273600, 246000, 201800, 344900, 245000, 297000],
    [7,   165000, 171000, 200000, 280000, 218000, 240000, 260000, 280000],
    [8,   183000, 189000, 222000, 314000, 242000, 266000, 288000, 311000],
    [9,   201000, 208000, 244000, 348000, 266000, 292000, 316000, 342000],
    [10,  219000, 227000, 266000, 382000, 290000, 318000, 344000, 373000],
    [11,  237000, 246000, 288000, 416000, 314000, 344000, 372000, 404000],
    [12,  255000, 265000, 310000, 450000, 338000, 370000, 400000, 435000],
    [13,  273000, 284000, 332000, 484000, 362000, 396000, 428000, 466000],
    [14,  291000, 303000, 354000, 518000, 386000, 422000, 456000, 497000],
    [15,  309000, 322000, 376000, 552000, 410000, 448000, 484000, 528000],
    [16,  327000, 341000, 398000, 586000, 434000, 474000, 512000, 559000],
    [17,  345000, 360000, 420000, 620000, 458000, 500000, 540000, 590000],
    [18,  363000, 379000, 442000, 654000, 482000, 526000, 568000, 621000],
    [19,  381000, 398000, 464000, 688000, 506000, 552000, 596000, 652000],
    [20,  399000, 417000, 486000, 722000, 530000, 578000, 624000, 683000],
    [21,  417000, 436000, 508000, 756000, 554000, 604000, 652000, 714000],
    [22,  435000, 455000, 530000, 790000, 578000, 630000, 680000, 745000],
    [23,  453000, 474000, 552000, 824000, 602000, 656000, 708000, 776000],
    [24,  471000, 493000, 574000, 858000, 626000, 682000, 736000, 807000],
    [25,  489000, 512000, 596000, 892000, 650000, 708000, 764000, 838000],
    [26,  507000, 531000, 618000, 926000, 674000, 734000, 792000, 869000],
    [27,  525000, 550000, 640000, 960000, 698000, 760000, 820000, 900000],
    [28,  543000, 569000, 662000, 994000, 722000, 786000, 848000, 931000],
    [29,  561000, 588000, 684000, 1028000, 746000, 812000, 876000, 962000],
    [30,  579000, 607000, 706000, 1062000, 770000, 838000, 904000, 993000],
  ],
};

export function subscribeToShippingSettings(
  onData: (settings: ShippingSettings) => void,
  onError?: (err: Error) => void
): () => void {
  const ref = doc(db, SETTINGS_DOC);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as ShippingSettings);
      } else {
        onData(DEFAULT_SHIPPING_SETTINGS);
      }
    },
    (err) => {
      console.warn("Firestore shipping settings listener error, using default:", err);
      onError?.(err);
    }
  );
}

export async function saveShippingSettings(settings: ShippingSettings): Promise<void> {
  const ref = doc(db, SETTINGS_DOC);
  await setDoc(ref, {
    ...settings,
    updatedAt: Date.now(),
  });
}
