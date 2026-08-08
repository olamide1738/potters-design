// Zee Express Export Rate Card — June 2026
// Zone assignments differ by weight bracket: ≤2.5 kg (light) vs ≥3 kg (heavy)

export interface ShippingCountry {
  code: string;
  name: string;
  currency: string; // ISO 4217
  zoneLight: number; // for packages ≤2.5 kg
  zoneHeavy: number; // for packages ≥3 kg
}

// 0 = domestic (no international rate)
export const SHIPPING_COUNTRIES: ShippingCountry[] = [
  // ── Domestic ────────────────────────────────────────────────
  { code: "NG", name: "Nigeria", currency: "NGN", zoneLight: 0, zoneHeavy: 0 },

  // ── ZONE 1 both tables ────────────────────────────────────
  { code: "GB", name: "United Kingdom", currency: "GBP", zoneLight: 1, zoneHeavy: 1 },
  { code: "IE", name: "Ireland", currency: "EUR", zoneLight: 1, zoneHeavy: 1 },
  { code: "SL", name: "Sierra Leone", currency: "SLL", zoneLight: 1, zoneHeavy: 1 },
  { code: "CM", name: "Cameroon", currency: "XAF", zoneLight: 1, zoneHeavy: 1 },

  // ── ZONE 2 both tables ────────────────────────────────────
  { code: "GH", name: "Ghana", currency: "GHS", zoneLight: 2, zoneHeavy: 2 },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", zoneLight: 2, zoneHeavy: 2 },
  { code: "UG", name: "Uganda", currency: "UGX", zoneLight: 2, zoneHeavy: 2 },

  // ── ZONE 2 light → ZONE 3 heavy ──────────────────────────
  { code: "EG", name: "Egypt", currency: "EGP", zoneLight: 2, zoneHeavy: 3 },

  // ── ZONE 3 light → ZONE 5 heavy ──────────────────────────
  { code: "ZA", name: "South Africa", currency: "ZAR", zoneLight: 3, zoneHeavy: 5 },
  { code: "KE", name: "Kenya", currency: "KES", zoneLight: 3, zoneHeavy: 5 },

  // ── ZONE 4 light → ZONE 2 heavy ──────────────────────────
  { code: "US", name: "United States", currency: "USD", zoneLight: 4, zoneHeavy: 2 },

  // ── ZONE 4 light → ZONE 3 heavy ──────────────────────────
  { code: "CA", name: "Canada", currency: "CAD", zoneLight: 4, zoneHeavy: 3 },
  { code: "MX", name: "Mexico", currency: "MXN", zoneLight: 4, zoneHeavy: 3 },

  // ── ZONE 5 light → ZONE 4 heavy (EUROPE + Turkey) ────────
  { code: "TR", name: "Turkey", currency: "TRY", zoneLight: 5, zoneHeavy: 4 },
  { code: "DE", name: "Germany", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "FR", name: "France", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "IT", name: "Italy", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "ES", name: "Spain", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "NL", name: "Netherlands", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "BE", name: "Belgium", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "PT", name: "Portugal", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "PL", name: "Poland", currency: "PLN", zoneLight: 5, zoneHeavy: 4 },
  { code: "SE", name: "Sweden", currency: "SEK", zoneLight: 5, zoneHeavy: 4 },
  { code: "NO", name: "Norway", currency: "NOK", zoneLight: 5, zoneHeavy: 4 },
  { code: "DK", name: "Denmark", currency: "DKK", zoneLight: 5, zoneHeavy: 4 },
  { code: "FI", name: "Finland", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "AT", name: "Austria", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "CH", name: "Switzerland", currency: "CHF", zoneLight: 5, zoneHeavy: 4 },
  { code: "GR", name: "Greece", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "CZ", name: "Czech Republic", currency: "CZK", zoneLight: 5, zoneHeavy: 4 },
  { code: "HU", name: "Hungary", currency: "HUF", zoneLight: 5, zoneHeavy: 4 },
  { code: "RO", name: "Romania", currency: "RON", zoneLight: 5, zoneHeavy: 4 },
  { code: "BG", name: "Bulgaria", currency: "BGN", zoneLight: 5, zoneHeavy: 4 },
  { code: "HR", name: "Croatia", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "SK", name: "Slovakia", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "SI", name: "Slovenia", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "LT", name: "Lithuania", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "LV", name: "Latvia", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "EE", name: "Estonia", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "LU", name: "Luxembourg", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "MT", name: "Malta", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "CY", name: "Cyprus", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "RS", name: "Serbia", currency: "RSD", zoneLight: 5, zoneHeavy: 4 },
  { code: "BA", name: "Bosnia & Herzegovina", currency: "BAM", zoneLight: 5, zoneHeavy: 4 },
  { code: "MK", name: "North Macedonia", currency: "MKD", zoneLight: 5, zoneHeavy: 4 },
  { code: "AL", name: "Albania", currency: "ALL", zoneLight: 5, zoneHeavy: 4 },
  { code: "ME", name: "Montenegro", currency: "EUR", zoneLight: 5, zoneHeavy: 4 },
  { code: "IS", name: "Iceland", currency: "ISK", zoneLight: 5, zoneHeavy: 4 },
  { code: "UA", name: "Ukraine", currency: "UAH", zoneLight: 5, zoneHeavy: 4 },

  // ── ZONE 6 both tables (Gulf / Middle East) ───────────────
  { code: "KW", name: "Kuwait", currency: "KWD", zoneLight: 6, zoneHeavy: 6 },
  { code: "QA", name: "Qatar", currency: "QAR", zoneLight: 6, zoneHeavy: 6 },
  { code: "AE", name: "United Arab Emirates", currency: "AED", zoneLight: 6, zoneHeavy: 6 },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", zoneLight: 6, zoneHeavy: 6 },
  { code: "BH", name: "Bahrain", currency: "BHD", zoneLight: 6, zoneHeavy: 6 },
  { code: "OM", name: "Oman", currency: "OMR", zoneLight: 6, zoneHeavy: 6 },
  { code: "JO", name: "Jordan", currency: "JOD", zoneLight: 6, zoneHeavy: 6 },
  { code: "IL", name: "Israel", currency: "ILS", zoneLight: 6, zoneHeavy: 6 },

  // ── ZONE 7 both tables (Asia-Pacific) ────────────────────
  { code: "AU", name: "Australia", currency: "AUD", zoneLight: 7, zoneHeavy: 7 },
  { code: "CN", name: "China", currency: "CNY", zoneLight: 7, zoneHeavy: 7 },
  { code: "IN", name: "India", currency: "INR", zoneLight: 7, zoneHeavy: 7 },
  { code: "JP", name: "Japan", currency: "JPY", zoneLight: 7, zoneHeavy: 7 },
  { code: "KR", name: "South Korea", currency: "KRW", zoneLight: 7, zoneHeavy: 7 },
  { code: "HK", name: "Hong Kong", currency: "HKD", zoneLight: 7, zoneHeavy: 7 },
  { code: "TW", name: "Taiwan", currency: "TWD", zoneLight: 7, zoneHeavy: 7 },
  { code: "SG", name: "Singapore", currency: "SGD", zoneLight: 7, zoneHeavy: 7 },
  { code: "MY", name: "Malaysia", currency: "MYR", zoneLight: 7, zoneHeavy: 7 },
  { code: "TH", name: "Thailand", currency: "THB", zoneLight: 7, zoneHeavy: 7 },
  { code: "ID", name: "Indonesia", currency: "IDR", zoneLight: 7, zoneHeavy: 7 },
  { code: "PH", name: "Philippines", currency: "PHP", zoneLight: 7, zoneHeavy: 7 },
  { code: "VN", name: "Vietnam", currency: "VND", zoneLight: 7, zoneHeavy: 7 },
  { code: "PK", name: "Pakistan", currency: "PKR", zoneLight: 7, zoneHeavy: 7 },
  { code: "BD", name: "Bangladesh", currency: "BDT", zoneLight: 7, zoneHeavy: 7 },
  { code: "LK", name: "Sri Lanka", currency: "LKR", zoneLight: 7, zoneHeavy: 7 },
  { code: "NP", name: "Nepal", currency: "NPR", zoneLight: 7, zoneHeavy: 7 },
  { code: "KZ", name: "Kazakhstan", currency: "KZT", zoneLight: 7, zoneHeavy: 7 },
  { code: "UZ", name: "Uzbekistan", currency: "UZS", zoneLight: 7, zoneHeavy: 7 },

  // ── ZONE 8 (Americas, Oceania excl. AU, Caribbean) ───────
  { code: "NZ", name: "New Zealand", currency: "NZD", zoneLight: 8, zoneHeavy: 8 },
  { code: "BR", name: "Brazil", currency: "BRL", zoneLight: 8, zoneHeavy: 8 },
  { code: "AR", name: "Argentina", currency: "ARS", zoneLight: 8, zoneHeavy: 8 },
  { code: "CL", name: "Chile", currency: "CLP", zoneLight: 8, zoneHeavy: 8 },
  { code: "CO", name: "Colombia", currency: "COP", zoneLight: 8, zoneHeavy: 8 },
  { code: "PE", name: "Peru", currency: "PEN", zoneLight: 8, zoneHeavy: 8 },
  { code: "VE", name: "Venezuela", currency: "USD", zoneLight: 8, zoneHeavy: 8 },
  { code: "EC", name: "Ecuador", currency: "USD", zoneLight: 8, zoneHeavy: 8 },
  { code: "UY", name: "Uruguay", currency: "UYU", zoneLight: 8, zoneHeavy: 8 },
  { code: "PY", name: "Paraguay", currency: "PYG", zoneLight: 8, zoneHeavy: 8 },
  { code: "BO", name: "Bolivia", currency: "BOB", zoneLight: 8, zoneHeavy: 8 },
  { code: "JM", name: "Jamaica", currency: "JMD", zoneLight: 8, zoneHeavy: 8 },
  { code: "TT", name: "Trinidad & Tobago", currency: "TTD", zoneLight: 8, zoneHeavy: 8 },
  { code: "BB", name: "Barbados", currency: "BBD", zoneLight: 8, zoneHeavy: 8 },
  { code: "BS", name: "Bahamas", currency: "BSD", zoneLight: 8, zoneHeavy: 8 },
  { code: "GT", name: "Guatemala", currency: "GTQ", zoneLight: 8, zoneHeavy: 8 },
  { code: "CR", name: "Costa Rica", currency: "CRC", zoneLight: 8, zoneHeavy: 8 },
  { code: "PA", name: "Panama", currency: "USD", zoneLight: 8, zoneHeavy: 8 },
  { code: "HN", name: "Honduras", currency: "HNL", zoneLight: 8, zoneHeavy: 8 },
  { code: "SV", name: "El Salvador", currency: "USD", zoneLight: 8, zoneHeavy: 8 },
  { code: "NI", name: "Nicaragua", currency: "NIO", zoneLight: 8, zoneHeavy: 8 },
  { code: "BZ", name: "Belize", currency: "BZD", zoneLight: 8, zoneHeavy: 8 },
  { code: "FJ", name: "Fiji", currency: "FJD", zoneLight: 8, zoneHeavy: 8 },

  // ── Additional countries from Zee Express Nov 2025 rate card ────────────────
  // zoneLight/zoneHeavy = 0 → not in June 2026 export card, shows "Calculated
  // separately" for shipping but currency auto-switches correctly.

  // Africa
  { code: "DZ", name: "Algeria", currency: "DZD", zoneLight: 0, zoneHeavy: 0 },
  { code: "AO", name: "Angola", currency: "AOA", zoneLight: 0, zoneHeavy: 0 },
  { code: "BJ", name: "Benin", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "BW", name: "Botswana", currency: "BWP", zoneLight: 0, zoneHeavy: 0 },
  { code: "BF", name: "Burkina Faso", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "BI", name: "Burundi", currency: "BIF", zoneLight: 0, zoneHeavy: 0 },
  { code: "CV", name: "Cape Verde", currency: "CVE", zoneLight: 0, zoneHeavy: 0 },
  { code: "CF", name: "Central African Republic", currency: "XAF", zoneLight: 0, zoneHeavy: 0 },
  { code: "TD", name: "Chad", currency: "XAF", zoneLight: 0, zoneHeavy: 0 },
  { code: "KM", name: "Comoros", currency: "KMF", zoneLight: 0, zoneHeavy: 0 },
  { code: "CG", name: "Congo", currency: "XAF", zoneLight: 0, zoneHeavy: 0 },
  { code: "CD", name: "Congo (DPR)", currency: "CDF", zoneLight: 0, zoneHeavy: 0 },
  { code: "DJ", name: "Djibouti", currency: "DJF", zoneLight: 0, zoneHeavy: 0 },
  { code: "ER", name: "Eritrea", currency: "ERN", zoneLight: 0, zoneHeavy: 0 },
  { code: "SZ", name: "Eswatini", currency: "SZL", zoneLight: 0, zoneHeavy: 0 },
  { code: "ET", name: "Ethiopia", currency: "ETB", zoneLight: 0, zoneHeavy: 0 },
  { code: "GA", name: "Gabon", currency: "XAF", zoneLight: 0, zoneHeavy: 0 },
  { code: "GM", name: "Gambia", currency: "GMD", zoneLight: 0, zoneHeavy: 0 },
  { code: "GN", name: "Guinea", currency: "GNF", zoneLight: 0, zoneHeavy: 0 },
  { code: "GW", name: "Guinea-Bissau", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "GQ", name: "Equatorial Guinea", currency: "XAF", zoneLight: 0, zoneHeavy: 0 },
  { code: "LS", name: "Lesotho", currency: "LSL", zoneLight: 0, zoneHeavy: 0 },
  { code: "LR", name: "Liberia", currency: "LRD", zoneLight: 0, zoneHeavy: 0 },
  { code: "LY", name: "Libya", currency: "LYD", zoneLight: 0, zoneHeavy: 0 },
  { code: "MG", name: "Madagascar", currency: "MGA", zoneLight: 0, zoneHeavy: 0 },
  { code: "MW", name: "Malawi", currency: "MWK", zoneLight: 0, zoneHeavy: 0 },
  { code: "ML", name: "Mali", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "MA", name: "Morocco", currency: "MAD", zoneLight: 0, zoneHeavy: 0 },
  { code: "MR", name: "Mauritania", currency: "MRU", zoneLight: 0, zoneHeavy: 0 },
  { code: "MU", name: "Mauritius", currency: "MUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "YT", name: "Mayotte", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "MZ", name: "Mozambique", currency: "MZN", zoneLight: 0, zoneHeavy: 0 },
  { code: "NA", name: "Namibia", currency: "NAD", zoneLight: 0, zoneHeavy: 0 },
  { code: "NE", name: "Niger", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "RE", name: "Réunion", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "RW", name: "Rwanda", currency: "RWF", zoneLight: 0, zoneHeavy: 0 },
  { code: "ST", name: "Sao Tome & Principe", currency: "STN", zoneLight: 0, zoneHeavy: 0 },
  { code: "SN", name: "Senegal", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "SC", name: "Seychelles", currency: "SCR", zoneLight: 0, zoneHeavy: 0 },
  { code: "SO", name: "Somalia", currency: "SOS", zoneLight: 0, zoneHeavy: 0 },
  { code: "SS", name: "South Sudan", currency: "SSP", zoneLight: 0, zoneHeavy: 0 },
  { code: "SD", name: "Sudan", currency: "SDG", zoneLight: 0, zoneHeavy: 0 },
  { code: "TZ", name: "Tanzania", currency: "TZS", zoneLight: 0, zoneHeavy: 0 },
  { code: "TG", name: "Togo", currency: "XOF", zoneLight: 0, zoneHeavy: 0 },
  { code: "TN", name: "Tunisia", currency: "TND", zoneLight: 0, zoneHeavy: 0 },
  { code: "ZM", name: "Zambia", currency: "ZMW", zoneLight: 0, zoneHeavy: 0 },
  { code: "ZW", name: "Zimbabwe", currency: "USD", zoneLight: 0, zoneHeavy: 0 },

  // Middle East / Central Asia
  { code: "AF", name: "Afghanistan", currency: "AFN", zoneLight: 0, zoneHeavy: 0 },
  { code: "IR", name: "Iran", currency: "IRR", zoneLight: 0, zoneHeavy: 0 },
  { code: "IQ", name: "Iraq", currency: "IQD", zoneLight: 0, zoneHeavy: 0 },
  { code: "LB", name: "Lebanon", currency: "LBP", zoneLight: 0, zoneHeavy: 0 },
  { code: "SY", name: "Syria", currency: "SYP", zoneLight: 0, zoneHeavy: 0 },
  { code: "YE", name: "Yemen", currency: "YER", zoneLight: 0, zoneHeavy: 0 },

  // Caucasus / Central Asia (new)
  { code: "AM", name: "Armenia", currency: "AMD", zoneLight: 0, zoneHeavy: 0 },
  { code: "AZ", name: "Azerbaijan", currency: "AZN", zoneLight: 0, zoneHeavy: 0 },
  { code: "GE", name: "Georgia", currency: "GEL", zoneLight: 0, zoneHeavy: 0 },
  { code: "KG", name: "Kyrgyzstan", currency: "KGS", zoneLight: 0, zoneHeavy: 0 },
  { code: "TJ", name: "Tajikistan", currency: "TJS", zoneLight: 0, zoneHeavy: 0 },
  { code: "TM", name: "Turkmenistan", currency: "TMT", zoneLight: 0, zoneHeavy: 0 },

  // Southeast / South / East Asia (new)
  { code: "BN", name: "Brunei", currency: "BND", zoneLight: 0, zoneHeavy: 0 },
  { code: "BT", name: "Bhutan", currency: "BTN", zoneLight: 0, zoneHeavy: 0 },
  { code: "KH", name: "Cambodia", currency: "KHR", zoneLight: 0, zoneHeavy: 0 },
  { code: "KP", name: "North Korea", currency: "KPW", zoneLight: 0, zoneHeavy: 0 },
  { code: "LA", name: "Laos", currency: "LAK", zoneLight: 0, zoneHeavy: 0 },
  { code: "MO", name: "Macau", currency: "MOP", zoneLight: 0, zoneHeavy: 0 },
  { code: "MV", name: "Maldives", currency: "MVR", zoneLight: 0, zoneHeavy: 0 },
  { code: "MN", name: "Mongolia", currency: "MNT", zoneLight: 0, zoneHeavy: 0 },
  { code: "MM", name: "Myanmar", currency: "MMK", zoneLight: 0, zoneHeavy: 0 },
  { code: "PW", name: "Palau", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "TL", name: "Timor-Leste", currency: "USD", zoneLight: 0, zoneHeavy: 0 },

  // Europe (new)
  { code: "AD", name: "Andorra", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "BY", name: "Belarus", currency: "BYN", zoneLight: 0, zoneHeavy: 0 },
  { code: "FO", name: "Faroe Islands", currency: "DKK", zoneLight: 0, zoneHeavy: 0 },
  { code: "GI", name: "Gibraltar", currency: "GIP", zoneLight: 0, zoneHeavy: 0 },
  { code: "GL", name: "Greenland", currency: "DKK", zoneLight: 0, zoneHeavy: 0 },
  { code: "GG", name: "Guernsey", currency: "GBP", zoneLight: 0, zoneHeavy: 0 },
  { code: "JE", name: "Jersey", currency: "GBP", zoneLight: 0, zoneHeavy: 0 },
  { code: "XK", name: "Kosovo", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "LI", name: "Liechtenstein", currency: "CHF", zoneLight: 0, zoneHeavy: 0 },
  { code: "MC", name: "Monaco", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "MD", name: "Moldova", currency: "MDL", zoneLight: 0, zoneHeavy: 0 },
  { code: "RU", name: "Russia", currency: "RUB", zoneLight: 0, zoneHeavy: 0 },
  { code: "SM", name: "San Marino", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "VA", name: "Vatican City", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },

  // Caribbean & Atlantic
  { code: "AG", name: "Antigua & Barbuda", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "AI", name: "Anguilla", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "AW", name: "Aruba", currency: "AWG", zoneLight: 0, zoneHeavy: 0 },
  { code: "BM", name: "Bermuda", currency: "BMD", zoneLight: 0, zoneHeavy: 0 },
  { code: "KY", name: "Cayman Islands", currency: "KYD", zoneLight: 0, zoneHeavy: 0 },
  { code: "CU", name: "Cuba", currency: "CUP", zoneLight: 0, zoneHeavy: 0 },
  { code: "CW", name: "Curaçao", currency: "ANG", zoneLight: 0, zoneHeavy: 0 },
  { code: "DM", name: "Dominica", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "DO", name: "Dominican Republic", currency: "DOP", zoneLight: 0, zoneHeavy: 0 },
  { code: "GD", name: "Grenada", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "GP", name: "Guadeloupe", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "HT", name: "Haiti", currency: "HTG", zoneLight: 0, zoneHeavy: 0 },
  { code: "KN", name: "St. Kitts & Nevis", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "LC", name: "St. Lucia", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "MQ", name: "Martinique", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "MS", name: "Montserrat", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "PR", name: "Puerto Rico", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "VC", name: "St. Vincent & the Grenadines", currency: "XCD", zoneLight: 0, zoneHeavy: 0 },
  { code: "SR", name: "Suriname", currency: "SRD", zoneLight: 0, zoneHeavy: 0 },
  { code: "TC", name: "Turks & Caicos Islands", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "VG", name: "British Virgin Islands", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "VI", name: "US Virgin Islands", currency: "USD", zoneLight: 0, zoneHeavy: 0 },

  // Central America (new)
  { code: "GF", name: "French Guiana", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
  { code: "GY", name: "Guyana", currency: "GYD", zoneLight: 0, zoneHeavy: 0 },

  // South America (new)
  { code: "FK", name: "Falkland Islands", currency: "FKP", zoneLight: 0, zoneHeavy: 0 },

  // Pacific & Oceania (new)
  { code: "AS", name: "American Samoa", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "CK", name: "Cook Islands", currency: "NZD", zoneLight: 0, zoneHeavy: 0 },
  { code: "GU", name: "Guam", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "KI", name: "Kiribati", currency: "AUD", zoneLight: 0, zoneHeavy: 0 },
  { code: "MH", name: "Marshall Islands", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "FM", name: "Micronesia", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "MP", name: "Northern Mariana Islands", currency: "USD", zoneLight: 0, zoneHeavy: 0 },
  { code: "NC", name: "New Caledonia", currency: "XPF", zoneLight: 0, zoneHeavy: 0 },
  { code: "NR", name: "Nauru", currency: "AUD", zoneLight: 0, zoneHeavy: 0 },
  { code: "NU", name: "Niue", currency: "NZD", zoneLight: 0, zoneHeavy: 0 },
  { code: "PG", name: "Papua New Guinea", currency: "PGK", zoneLight: 0, zoneHeavy: 0 },
  { code: "PF", name: "French Polynesia (Tahiti)", currency: "XPF", zoneLight: 0, zoneHeavy: 0 },
  { code: "WS", name: "Samoa", currency: "WST", zoneLight: 0, zoneHeavy: 0 },
  { code: "SB", name: "Solomon Islands", currency: "SBD", zoneLight: 0, zoneHeavy: 0 },
  { code: "TK", name: "Tokelau", currency: "NZD", zoneLight: 0, zoneHeavy: 0 },
  { code: "TO", name: "Tonga", currency: "TOP", zoneLight: 0, zoneHeavy: 0 },
  { code: "TV", name: "Tuvalu", currency: "AUD", zoneLight: 0, zoneHeavy: 0 },
  { code: "VU", name: "Vanuatu", currency: "VUV", zoneLight: 0, zoneHeavy: 0 },

  // North Atlantic / other territories
  { code: "SH", name: "Saint Helena", currency: "SHP", zoneLight: 0, zoneHeavy: 0 },
  { code: "IC", name: "Canary Islands", currency: "EUR", zoneLight: 0, zoneHeavy: 0 },
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
 * Uses the Zee Express zone rate card with weight-bracket-aware zone assignments.
 * Decimal weights are rounded up to the next integer kg (e.g. 2.1 kg -> 3 kg).
 */
export function getShippingRate(countryCode: string, weightKg: number): number | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zoneLight === 0) return null; // domestic

  const roundedWeight = Math.ceil(weightKg);
  const zone = roundedWeight <= 2 ? country.zoneLight : country.zoneHeavy;
  const step = ceilToRateStep(Math.min(roundedWeight, 30));
  const row = RATE_ROWS.find((r) => r[0] === step);

  if (!row) return null;
  return row[zone]; // row[1..8] maps to zone1..zone8
}

export function getZoneName(countryCode: string, weightKg: number): string | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zoneLight === 0) return null;
  const roundedWeight = Math.ceil(weightKg);
  const zone = roundedWeight <= 2 ? country.zoneLight : country.zoneHeavy;
  return `Zone ${zone}`;
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
