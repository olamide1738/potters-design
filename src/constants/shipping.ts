// Zee Express / DHL Export Rate Card
// Zones are fixed per country for all weights from 0 to 30 kg.

export interface ShippingCountry {
  code: string;
  name: string;
  currency: string; // ISO 4217
  zone: number; // 0 = domestic, 1..8 = international zone
}

// 0 = domestic (no international rate)
export const SHIPPING_COUNTRIES: ShippingCountry[] = [
  // ── Domestic ────────────────────────────────────────────────
  { code: "NG", name: "Nigeria", currency: "NGN", zone: 0 },

  // ── Zone 1 ──────────────────────────────────────────────────
  { code: "GG", name: "Guernsey", currency: "GBP", zone: 1 },
  { code: "IE", name: "Ireland", currency: "EUR", zone: 1 },
  { code: "JE", name: "Jersey", currency: "GBP", zone: 1 },
  { code: "GB", name: "United Kingdom", currency: "GBP", zone: 1 },

  // ── Zone 2 (Africa) ─────────────────────────────────────────
  { code: "BJ", name: "Benin", currency: "XOF", zone: 2 },
  { code: "BF", name: "Burkina Faso", currency: "XOF", zone: 2 },
  { code: "CM", name: "Cameroon", currency: "XAF", zone: 2 },
  { code: "CV", name: "Cape Verde", currency: "CVE", zone: 2 },
  { code: "CF", name: "Central African Republic", currency: "XAF", zone: 2 },
  { code: "TD", name: "Chad", currency: "XAF", zone: 2 },
  { code: "CG", name: "Congo", currency: "XAF", zone: 2 },
  { code: "CD", name: "Congo (DPR)", currency: "CDF", zone: 2 },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", zone: 2 },
  { code: "GA", name: "Gabon", currency: "XAF", zone: 2 },
  { code: "GM", name: "Gambia", currency: "GMD", zone: 2 },
  { code: "GH", name: "Ghana", currency: "GHS", zone: 2 },
  { code: "GN", name: "Guinea", currency: "GNF", zone: 2 },
  { code: "GW", name: "Guinea-Bissau", currency: "XOF", zone: 2 },
  { code: "GQ", name: "Equatorial Guinea", currency: "XAF", zone: 2 },
  { code: "LR", name: "Liberia", currency: "LRD", zone: 2 },
  { code: "ML", name: "Mali", currency: "XOF", zone: 2 },
  { code: "NE", name: "Niger", currency: "XOF", zone: 2 },
  { code: "ST", name: "Sao Tome & Principe", currency: "STN", zone: 2 },
  { code: "SN", name: "Senegal", currency: "XOF", zone: 2 },
  { code: "SL", name: "Sierra Leone", currency: "SLL", zone: 2 },
  { code: "TG", name: "Togo", currency: "XOF", zone: 2 },

  // ── Zone 3 (North America) ──────────────────────────────────
  { code: "CA", name: "Canada", currency: "CAD", zone: 3 },
  { code: "MX", name: "Mexico", currency: "MXN", zone: 3 },
  { code: "US", name: "United States", currency: "USD", zone: 3 },

  // ── Zone 4 (Western & Central Europe) ───────────────────────
  { code: "AT", name: "Austria", currency: "EUR", zone: 4 },
  { code: "BE", name: "Belgium", currency: "EUR", zone: 4 },
  { code: "CZ", name: "Czech Republic", currency: "CZK", zone: 4 },
  { code: "DK", name: "Denmark", currency: "DKK", zone: 4 },
  { code: "FI", name: "Finland", currency: "EUR", zone: 4 },
  { code: "FR", name: "France", currency: "EUR", zone: 4 },
  { code: "DE", name: "Germany", currency: "EUR", zone: 4 },
  { code: "GR", name: "Greece", currency: "EUR", zone: 4 },
  { code: "IT", name: "Italy", currency: "EUR", zone: 4 },
  { code: "LI", name: "Liechtenstein", currency: "CHF", zone: 4 },
  { code: "LT", name: "Lithuania", currency: "EUR", zone: 4 },
  { code: "LU", name: "Luxembourg", currency: "EUR", zone: 4 },
  { code: "MT", name: "Malta", currency: "EUR", zone: 4 },
  { code: "MD", name: "Moldova", currency: "MDL", zone: 4 },
  { code: "ME", name: "Montenegro", currency: "EUR", zone: 4 },
  { code: "NL", name: "Netherlands", currency: "EUR", zone: 4 },
  { code: "MK", name: "North Macedonia", currency: "MKD", zone: 4 },
  { code: "NO", name: "Norway", currency: "NOK", zone: 4 },
  { code: "PL", name: "Poland", currency: "PLN", zone: 4 },
  { code: "PT", name: "Portugal", currency: "EUR", zone: 4 },
  { code: "RO", name: "Romania", currency: "RON", zone: 4 },
  { code: "SM", name: "San Marino", currency: "EUR", zone: 4 },
  { code: "RS", name: "Serbia", currency: "RSD", zone: 4 },
  { code: "SK", name: "Slovakia", currency: "EUR", zone: 4 },
  { code: "SI", name: "Slovenia", currency: "EUR", zone: 4 },
  { code: "ES", name: "Spain", currency: "EUR", zone: 4 },
  { code: "SE", name: "Sweden", currency: "SEK", zone: 4 },
  { code: "CH", name: "Switzerland", currency: "CHF", zone: 4 },
  { code: "VA", name: "Vatican City", currency: "EUR", zone: 4 },

  // ── Zone 5 (Rest of Africa & Europe & North Atlantic) ───────
  { code: "AL", name: "Albania", currency: "ALL", zone: 5 },
  { code: "DZ", name: "Algeria", currency: "DZD", zone: 5 },
  { code: "AD", name: "Andorra", currency: "EUR", zone: 5 },
  { code: "AO", name: "Angola", currency: "AOA", zone: 5 },
  { code: "BY", name: "Belarus", currency: "BYN", zone: 5 },
  { code: "BA", name: "Bosnia & Herzegovina", currency: "BAM", zone: 5 },
  { code: "BW", name: "Botswana", currency: "BWP", zone: 5 },
  { code: "BG", name: "Bulgaria", currency: "BGN", zone: 5 },
  { code: "BI", name: "Burundi", currency: "BIF", zone: 5 },
  { code: "IC", name: "Canary Islands", currency: "EUR", zone: 5 },
  { code: "KM", name: "Comoros", currency: "KMF", zone: 5 },
  { code: "HR", name: "Croatia", currency: "EUR", zone: 5 },
  { code: "CY", name: "Cyprus", currency: "EUR", zone: 5 },
  { code: "DJ", name: "Djibouti", currency: "DJF", zone: 5 },
  { code: "EG", name: "Egypt", currency: "EGP", zone: 5 },
  { code: "ER", name: "Eritrea", currency: "ERN", zone: 5 },
  { code: "EE", name: "Estonia", currency: "EUR", zone: 5 },
  { code: "SZ", name: "Eswatini", currency: "SZL", zone: 5 },
  { code: "ET", name: "Ethiopia", currency: "ETB", zone: 5 },
  { code: "FO", name: "Faroe Islands", currency: "DKK", zone: 5 },
  { code: "GI", name: "Gibraltar", currency: "GIP", zone: 5 },
  { code: "GL", name: "Greenland", currency: "DKK", zone: 5 },
  { code: "HU", name: "Hungary", currency: "HUF", zone: 5 },
  { code: "IS", name: "Iceland", currency: "ISK", zone: 5 },
  { code: "KE", name: "Kenya", currency: "KES", zone: 5 },
  { code: "XK", name: "Kosovo", currency: "EUR", zone: 5 },
  { code: "LV", name: "Latvia", currency: "EUR", zone: 5 },
  { code: "LS", name: "Lesotho", currency: "LSL", zone: 5 },
  { code: "LY", name: "Libya", currency: "LYD", zone: 5 },
  { code: "MG", name: "Madagascar", currency: "MGA", zone: 5 },
  { code: "MW", name: "Malawi", currency: "MWK", zone: 5 },
  { code: "MR", name: "Mauritania", currency: "MRU", zone: 5 },
  { code: "MU", name: "Mauritius", currency: "MUR", zone: 5 },
  { code: "YT", name: "Mayotte", currency: "EUR", zone: 5 },
  { code: "MC", name: "Monaco", currency: "EUR", zone: 5 },
  { code: "MA", name: "Morocco", currency: "MAD", zone: 5 },
  { code: "MZ", name: "Mozambique", currency: "MZN", zone: 5 },
  { code: "NA", name: "Namibia", currency: "NAD", zone: 5 },
  { code: "RE", name: "Réunion", currency: "EUR", zone: 5 },
  { code: "RU", name: "Russia", currency: "RUB", zone: 5 },
  { code: "RW", name: "Rwanda", currency: "RWF", zone: 5 },
  { code: "SC", name: "Seychelles", currency: "SCR", zone: 5 },
  { code: "SO", name: "Somalia", currency: "SOS", zone: 5 },
  { code: "XS", name: "Somaliland", currency: "SOS", zone: 5 },
  { code: "ZA", name: "South Africa", currency: "ZAR", zone: 5 },
  { code: "SS", name: "South Sudan", currency: "SSP", zone: 5 },
  { code: "SD", name: "Sudan", currency: "SDG", zone: 5 },
  { code: "TZ", name: "Tanzania", currency: "TZS", zone: 5 },
  { code: "TN", name: "Tunisia", currency: "TND", zone: 5 },
  { code: "TR", name: "Turkey", currency: "TRY", zone: 5 },
  { code: "UG", name: "Uganda", currency: "UGX", zone: 5 },
  { code: "UA", name: "Ukraine", currency: "UAH", zone: 5 },
  { code: "ZM", name: "Zambia", currency: "ZMW", zone: 5 },
  { code: "ZW", name: "Zimbabwe", currency: "USD", zone: 5 },

  // ── Zone 6 (Middle East & Gulf) ─────────────────────────────
  { code: "AF", name: "Afghanistan", currency: "AFN", zone: 6 },
  { code: "BH", name: "Bahrain", currency: "BHD", zone: 6 },
  { code: "IR", name: "Iran", currency: "IRR", zone: 6 },
  { code: "IQ", name: "Iraq", currency: "IQD", zone: 6 },
  { code: "IL", name: "Israel", currency: "ILS", zone: 6 },
  { code: "JO", name: "Jordan", currency: "JOD", zone: 6 },
  { code: "KW", name: "Kuwait", currency: "KWD", zone: 6 },
  { code: "LB", name: "Lebanon", currency: "LBP", zone: 6 },
  { code: "OM", name: "Oman", currency: "OMR", zone: 6 },
  { code: "QA", name: "Qatar", currency: "QAR", zone: 6 },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", zone: 6 },
  { code: "SY", name: "Syria", currency: "SYP", zone: 6 },
  { code: "AE", name: "United Arab Emirates", currency: "AED", zone: 6 },
  { code: "YE", name: "Yemen", currency: "YER", zone: 6 },

  // ── Zone 7 (Asia-Pacific & Central Asia) ────────────────────
  { code: "AM", name: "Armenia", currency: "AMD", zone: 7 },
  { code: "AU", name: "Australia", currency: "AUD", zone: 7 },
  { code: "AZ", name: "Azerbaijan", currency: "AZN", zone: 7 },
  { code: "BD", name: "Bangladesh", currency: "BDT", zone: 7 },
  { code: "BT", name: "Bhutan", currency: "BTN", zone: 7 },
  { code: "BN", name: "Brunei", currency: "BND", zone: 7 },
  { code: "KH", name: "Cambodia", currency: "KHR", zone: 7 },
  { code: "CN", name: "China", currency: "CNY", zone: 7 },
  { code: "GE", name: "Georgia", currency: "GEL", zone: 7 },
  { code: "HK", name: "Hong Kong SAR China", currency: "HKD", zone: 7 },
  { code: "IN", name: "India", currency: "INR", zone: 7 },
  { code: "ID", name: "Indonesia", currency: "IDR", zone: 7 },
  { code: "JP", name: "Japan", currency: "JPY", zone: 7 },
  { code: "KZ", name: "Kazakhstan", currency: "KZT", zone: 7 },
  { code: "KR", name: "South Korea", currency: "KRW", zone: 7 },
  { code: "KP", name: "North Korea", currency: "KPW", zone: 7 },
  { code: "KG", name: "Kyrgyzstan", currency: "KGS", zone: 7 },
  { code: "LA", name: "Laos", currency: "LAK", zone: 7 },
  { code: "MO", name: "Macau SAR China", currency: "MOP", zone: 7 },
  { code: "MY", name: "Malaysia", currency: "MYR", zone: 7 },
  { code: "MV", name: "Maldives", currency: "MVR", zone: 7 },
  { code: "MN", name: "Mongolia", currency: "MNT", zone: 7 },
  { code: "MM", name: "Myanmar", currency: "MMK", zone: 7 },
  { code: "NP", name: "Nepal", currency: "NPR", zone: 7 },
  { code: "PK", name: "Pakistan", currency: "PKR", zone: 7 },
  { code: "PW", name: "Palau", currency: "USD", zone: 7 },
  { code: "PH", name: "Philippines", currency: "PHP", zone: 7 },
  { code: "SG", name: "Singapore", currency: "SGD", zone: 7 },
  { code: "LK", name: "Sri Lanka", currency: "LKR", zone: 7 },
  { code: "TW", name: "Taiwan", currency: "TWD", zone: 7 },
  { code: "TJ", name: "Tajikistan", currency: "TJS", zone: 7 },
  { code: "TH", name: "Thailand", currency: "THB", zone: 7 },
  { code: "TL", name: "Timor-Leste", currency: "USD", zone: 7 },
  { code: "TM", name: "Turkmenistan", currency: "TMT", zone: 7 },
  { code: "UZ", name: "Uzbekistan", currency: "UZS", zone: 7 },
  { code: "VN", name: "Vietnam", currency: "VND", zone: 7 },

  // ── Zone 8 (Americas, Caribbean, Pacific Islands) ───────────
  { code: "AS", name: "American Samoa", currency: "USD", zone: 8 },
  { code: "AI", name: "Anguilla", currency: "XCD", zone: 8 },
  { code: "AG", name: "Antigua & Barbuda", currency: "XCD", zone: 8 },
  { code: "AR", name: "Argentina", currency: "ARS", zone: 8 },
  { code: "AW", name: "Aruba", currency: "AWG", zone: 8 },
  { code: "BS", name: "Bahamas", currency: "BSD", zone: 8 },
  { code: "BB", name: "Barbados", currency: "BBD", zone: 8 },
  { code: "BZ", name: "Belize", currency: "BZD", zone: 8 },
  { code: "BM", name: "Bermuda", currency: "BMD", zone: 8 },
  { code: "BO", name: "Bolivia", currency: "BOB", zone: 8 },
  { code: "XB", name: "Bonaire", currency: "USD", zone: 8 },
  { code: "BR", name: "Brazil", currency: "BRL", zone: 8 },
  { code: "KY", name: "Cayman Islands", currency: "KYD", zone: 8 },
  { code: "CL", name: "Chile", currency: "CLP", zone: 8 },
  { code: "CO", name: "Colombia", currency: "COP", zone: 8 },
  { code: "CK", name: "Cook Islands", currency: "NZD", zone: 8 },
  { code: "CR", name: "Costa Rica", currency: "CRC", zone: 8 },
  { code: "CU", name: "Cuba", currency: "CUP", zone: 8 },
  { code: "XC", name: "Curaçao", currency: "ANG", zone: 8 },
  { code: "DM", name: "Dominica", currency: "XCD", zone: 8 },
  { code: "DO", name: "Dominican Republic", currency: "DOP", zone: 8 },
  { code: "EC", name: "Ecuador", currency: "USD", zone: 8 },
  { code: "SV", name: "El Salvador", currency: "USD", zone: 8 },
  { code: "FK", name: "Falkland Islands", currency: "FKP", zone: 8 },
  { code: "FJ", name: "Fiji", currency: "FJD", zone: 8 },
  { code: "GF", name: "French Guiana", currency: "EUR", zone: 8 },
  { code: "GD", name: "Grenada", currency: "XCD", zone: 8 },
  { code: "GP", name: "Guadeloupe", currency: "EUR", zone: 8 },
  { code: "GU", name: "Guam", currency: "USD", zone: 8 },
  { code: "GT", name: "Guatemala", currency: "GTQ", zone: 8 },
  { code: "GY", name: "Guyana", currency: "GYD", zone: 8 },
  { code: "HT", name: "Haiti", currency: "HTG", zone: 8 },
  { code: "HN", name: "Honduras", currency: "HNL", zone: 8 },
  { code: "JM", name: "Jamaica", currency: "JMD", zone: 8 },
  { code: "KI", name: "Kiribati", currency: "AUD", zone: 8 },
  { code: "MP", name: "Mariana Islands", currency: "USD", zone: 8 },
  { code: "MH", name: "Marshall Islands", currency: "USD", zone: 8 },
  { code: "MQ", name: "Martinique", currency: "EUR", zone: 8 },
  { code: "FM", name: "Micronesia", currency: "USD", zone: 8 },
  { code: "MS", name: "Montserrat", currency: "XCD", zone: 8 },
  { code: "NR", name: "Nauru", currency: "AUD", zone: 8 },
  { code: "XN", name: "Nevis", currency: "XCD", zone: 8 },
  { code: "NC", name: "New Caledonia", currency: "XPF", zone: 8 },
  { code: "NZ", name: "New Zealand", currency: "NZD", zone: 8 },
  { code: "NI", name: "Nicaragua", currency: "NIO", zone: 8 },
  { code: "NU", name: "Niue", currency: "NZD", zone: 8 },
  { code: "PA", name: "Panama", currency: "USD", zone: 8 },
  { code: "PG", name: "Papua New Guinea", currency: "PGK", zone: 8 },
  { code: "PY", name: "Paraguay", currency: "PYG", zone: 8 },
  { code: "PE", name: "Peru", currency: "PEN", zone: 8 },
  { code: "PR", name: "Puerto Rico", currency: "USD", zone: 8 },
  { code: "SH", name: "Saint Helena", currency: "SHP", zone: 8 },
  { code: "WS", name: "Samoa", currency: "WST", zone: 8 },
  { code: "SB", name: "Solomon Islands", currency: "SBD", zone: 8 },
  { code: "XY", name: "St. Barthelemy", currency: "EUR", zone: 8 },
  { code: "XE", name: "St. Eustatius", currency: "USD", zone: 8 },
  { code: "KN", name: "St. Kitts & Nevis", currency: "XCD", zone: 8 },
  { code: "LC", name: "St. Lucia", currency: "XCD", zone: 8 },
  { code: "XM", name: "St. Maarten", currency: "ANG", zone: 8 },
  { code: "VC", name: "St. Vincent & the Grenadines", currency: "XCD", zone: 8 },
  { code: "SR", name: "Suriname", currency: "SRD", zone: 8 },
  { code: "PF", name: "Tahiti", currency: "XPF", zone: 8 },
  { code: "TO", name: "Tonga", currency: "TOP", zone: 8 },
  { code: "TT", name: "Trinidad & Tobago", currency: "TTD", zone: 8 },
  { code: "TC", name: "Turks & Caicos Islands", currency: "USD", zone: 8 },
  { code: "TV", name: "Tuvalu", currency: "AUD", zone: 8 },
  { code: "UY", name: "Uruguay", currency: "UYU", zone: 8 },
  { code: "VU", name: "Vanuatu", currency: "VUV", zone: 8 },
  { code: "VE", name: "Venezuela", currency: "USD", zone: 8 },
  { code: "VG", name: "Virgin Islands (British)", currency: "USD", zone: 8 },
  { code: "VI", name: "Virgin Islands (US)", currency: "USD", zone: 8 },
];

// Quick lookup by country code
export const COUNTRY_MAP: Record<string, ShippingCountry> = Object.fromEntries(
  SHIPPING_COUNTRIES.map((c) => [c.code, c]),
);

// ── Rate table ────────────────────────────────────────────────────────────────
// Columns: [weight_kg, z1, z2, z3, z4, z5, z6, z7, z8]
const RATE_ROWS: [number, number, number, number, number, number, number, number, number][] = [
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
];

const RATE_STEPS = RATE_ROWS.map((r) => r[0]);

function ceilToRateStep(kg: number): number {
  return RATE_STEPS.find((s) => s >= kg) ?? 30;
}

/**
 * Returns shipping cost in NGN, or null if domestic / country not in rate card.
 * Uses the DHL / Zee Express zone rate card (fixed zone per country from 0 to 30 kg).
 * Decimal weights are rounded up to the next integer kg (e.g. 2.1 kg -> 3 kg).
 */
export function getShippingRate(countryCode: string, weightKg: number): number | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zone === 0) return null; // domestic

  const roundedWeight = Math.ceil(weightKg);
  const step = ceilToRateStep(Math.min(roundedWeight, 30));
  const row = RATE_ROWS.find((r) => r[0] === step);

  if (!row) return null;
  return row[country.zone]; // row[1..8] maps to zone1..zone8
}

export function getZoneName(countryCode: string, _weightKg?: number): string | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zone === 0) return null;
  return `Zone ${country.zone}`;
}

// ── DOMESTIC NIGERIA — Zee Express Nov 2025 Rate Card ──────────────────────────

// ── Express service (1–3 working days) · City-based · Zones 1–3 ──────────────
// Rates per Zee Express Nationwide Delivery (1-3 days) table, all NGN.
// Weight steps: 0.5 kg increments from 0.5 to 20 kg.
// Row format: [weightKg, zone1, zone2, zone3]
const DOMESTIC_EXPRESS_RATES: [number, number, number, number][] = [
  [0.5,  6300,  13700, 17100],
  [1,    6300,  13700, 17100],
  [1.5,  6300,  13700, 17100],
  [2,    6300,  13700, 17100],
  [2.5,  7800,  15800, 19600],
  [3,    9900,  17800, 21900],
  [3.5,  11900, 19800, 24200],
  [4,    13900, 21900, 26400],
  [4.5,  16000, 23900, 28700],
  [5,    18000, 25900, 31000],
  [5.5,  20000, 28000, 33300],
  [6,    22100, 30000, 35500],
  [6.5,  24100, 32000, 37800],
  [7,    26100, 34100, 40100],
  [7.5,  28200, 36100, 42400],
  [8,    30200, 38100, 44600],
  [8.5,  32200, 40200, 46900],
  [9,    34300, 42200, 49200],
  [9.5,  36300, 44200, 51500],
  [10,   38300, 46300, 53700],
  [10.5, 40400, 48300, 56000],
  [11,   42400, 50300, 58300],
  [11.5, 44400, 52400, 60600],
  [12,   46500, 54400, 62800],
  [12.5, 48500, 56500, 65100],
  [13,   50500, 58500, 67400],
  [13.5, 52600, 60500, 69700],
  [14,   54600, 62600, 71900],
  [14.5, 56700, 64600, 74200],
  [15,   58700, 66600, 76500],
  [15.5, 60700, 68700, 78800],
  [16,   62800, 70700, 81000],
  [16.5, 64800, 72700, 83300],
  [17,   66800, 74800, 85600],
  [17.5, 68900, 76800, 87900],
  [18,   70900, 78800, 90100],
  [18.5, 72900, 80900, 92400],
  [19,   75000, 82900, 94700],
  [19.5, 77000, 84900, 97000],
  [20,   79000, 87000, 99200],
];



/** Nigerian states with their shipping zones for standard (A–E) and express (1–3) services. */
export interface NigerianState {
  name: string;
  zone: "A" | "B" | "C" | "D" | "E" | "Lagos";
  expressZone?: 1 | 2 | 3;
}

export const INTERSTATE_STANDARD_RATES: Record<"A" | "B" | "C" | "D" | "E", number> = {
  A: 11000,
  B: 12000,
  C: 12000,
  D: 13000,
  E: 13500,
};

export const INTERSTATE_EXPRESS_RATES: Record<1 | 2 | 3, number> = {
  1: 15000,
  2: 20000,
  3: 22000,
};

export const NIGERIAN_STATES: NigerianState[] = [
  { name: "Lagos", zone: "Lagos" },
  // Zone A (Southwest) → Standard Zone A (₦11,000) · Express Zone 1 (₦15,000)
  { name: "Ekiti", zone: "A", expressZone: 1 },
  { name: "Ogun", zone: "A", expressZone: 1 },
  { name: "Ondo", zone: "A", expressZone: 1 },
  { name: "Osun", zone: "A", expressZone: 1 },
  { name: "Oyo", zone: "A", expressZone: 1 },
  // Zone B (South + Middle Belt) → Standard Zone B (₦12,000) · Express Zone 2 (₦20,000)
  { name: "Abia", zone: "B", expressZone: 2 },
  { name: "Anambra", zone: "B", expressZone: 2 },
  { name: "Bayelsa", zone: "B", expressZone: 2 },
  { name: "Delta", zone: "B", expressZone: 2 },
  { name: "Ebonyi", zone: "B", expressZone: 2 },
  { name: "Edo", zone: "B", expressZone: 2 },
  { name: "Enugu", zone: "B", expressZone: 2 },
  { name: "Imo", zone: "B", expressZone: 2 },
  { name: "Kwara", zone: "B", expressZone: 2 },
  { name: "Rivers", zone: "B", expressZone: 2 },
  // Zone C (FCT) → Standard Zone C (₦12,000) · Express Zone 2 (₦20,000)
  { name: "FCT (Abuja)", zone: "C", expressZone: 2 },
  // Zone D (North) → Standard Zone D (₦13,000)
  // Express Zone 2 (₦20,000) for regional hubs, Express Zone 3 (₦22,000) for far North
  { name: "Benue", zone: "D", expressZone: 2 },
  { name: "Kaduna", zone: "D", expressZone: 2 },
  { name: "Kano", zone: "D", expressZone: 2 },
  { name: "Kogi", zone: "D", expressZone: 2 },
  { name: "Nasarawa", zone: "D", expressZone: 2 },
  { name: "Niger", zone: "D", expressZone: 2 },
  { name: "Plateau", zone: "D", expressZone: 2 },
  { name: "Adamawa", zone: "D", expressZone: 3 },
  { name: "Bauchi", zone: "D", expressZone: 3 },
  { name: "Borno", zone: "D", expressZone: 3 },
  { name: "Gombe", zone: "D", expressZone: 3 },
  { name: "Jigawa", zone: "D", expressZone: 3 },
  { name: "Katsina", zone: "D", expressZone: 3 },
  { name: "Kebbi", zone: "D", expressZone: 3 },
  { name: "Sokoto", zone: "D", expressZone: 3 },
  { name: "Taraba", zone: "D", expressZone: 3 },
  { name: "Yobe", zone: "D", expressZone: 3 },
  { name: "Zamfara", zone: "D", expressZone: 3 },
  // Zone E (Southeast coast) → Standard Zone E (₦13,500) · Express Zone 3 (₦22,000)
  { name: "Akwa Ibom", zone: "E", expressZone: 3 },
  { name: "Cross River", zone: "E", expressZone: 3 },
];

const STATE_ZONE_MAP: Record<string, NigerianState["zone"]> = Object.fromEntries(
  NIGERIAN_STATES.map((s) => [s.name, s.zone]),
);

function ceilDomesticExpressStep(kg: number): number {
  const steps = DOMESTIC_EXPRESS_RATES.map((r) => r[0]);
  return steps.find((s) => s >= kg) ?? 20;
}

export interface DomesticDeliveryOption {
  fee: number;
  service: string;
  deliveryDays: string;
  zoneLabel: string;
}

export interface DomesticDeliveryRates {
  standard: DomesticDeliveryOption;
  express: DomesticDeliveryOption;
}

export function getInterstateRates(stateName: string): DomesticDeliveryRates | null {
  const state = NIGERIAN_STATES.find((s) => s.name === stateName);
  if (!state || state.zone === "Lagos") return null;

  const stdZone = state.zone as "A" | "B" | "C" | "D" | "E";
  const expZone = (state.expressZone ?? 2) as 1 | 2 | 3;

  return {
    standard: {
      fee: INTERSTATE_STANDARD_FEES[stdZone] ?? INTERSTATE_STANDARD_RATES[stdZone],
      service: "Standard Delivery (5–7 Working Days)",
      deliveryDays: "5–7 Working Days",
      zoneLabel: `Zone ${stdZone}`,
    },
    express: {
      fee: INTERSTATE_EXPRESS_RATES[expZone],
      service: "Express Delivery (1–3 Working Days)",
      deliveryDays: "1–3 Working Days",
      zoneLabel: `Zone ${expZone}`,
    },
  };
}

// Re-export constant alias
export const INTERSTATE_STANDARD_FEES = INTERSTATE_STANDARD_RATES;

export interface DomesticRate {
  fee: number;
  service: string;
  remoteFee: number;
}

/**
 * Returns the domestic (Nigeria) shipping rate.
 * Lagos uses local city zones.
 * Interstate uses standard (5–7 days) or express (1–3 days) rates.
 */
export function getDomesticRate(
  stateName: string,
  weightKg: number,
  speed: "standard" | "express" = "standard",
): DomesticRate | null {
  const interstate = getInterstateRates(stateName);
  if (interstate) {
    const opt = interstate[speed];
    return {
      fee: opt.fee,
      service: opt.service,
      remoteFee: 0,
    };
  }

  const zone = STATE_ZONE_MAP[stateName];
  if (!zone) return null;

  if (zone === "Lagos") {
    const step = ceilDomesticExpressStep(Math.min(weightKg, 20));
    const row = DOMESTIC_EXPRESS_RATES.find((r) => r[0] === step);
    if (!row) return null;
    return { fee: row[1], service: "Express · 1–3 days", remoteFee: 0 };
  }

  return null;
}
