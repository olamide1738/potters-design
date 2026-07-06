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
// Source: Zee Express Export Rate Card, June 2026
const RATE_ROWS: [number, number, number, number, number, number, number, number, number][] = [
  [0.5, 64000, 71000, 78200, 78400, 91000, 101000, 111000, 115700],
  [1,   64000, 71000, 78200, 78400, 91000, 101000, 111000, 115700],
  [1.5, 64000, 71000, 78200, 78400, 91000, 101000, 111000, 115700],
  [2,   64000, 71000, 78200, 78400, 91000, 101000, 111000, 115700],
  [2.5, 84300, 91300, 105400, 106000, 118600, 130300, 140300, 153600],
  [3,   90300, 99200, 126800, 123000, 131000, 256200, 148800, 189400],
  [3.5, 95400, 104300, 141400, 129000, 138000, 263200, 156700, 198300],
  [4,   100500, 109400, 156000, 135100, 145000, 270200, 164700, 207200],
  [4.5, 105500, 114500, 170700, 141100, 152000, 277200, 172600, 216100],
  [5,   110600, 119500, 185300, 147100, 159000, 284200, 180600, 225000],
  [6,   131700, 141500, 213600, 174200, 188100, 314900, 213700, 266300],
  [7,   152800, 163400, 241000, 201300, 217200, 345700, 246900, 307600],
  [8,   173900, 185300, 267700, 228400, 246300, 376400, 280100, 349000],
  [9,   195100, 207200, 293900, 255400, 275400, 407100, 313300, 390300],
  [10,  216200, 229200, 319800, 282500, 304500, 437900, 346500, 431600],
  [11,  235700, 249400, 343000, 307500, 331300, 466200, 377100, 469700],
  [12,  255200, 269700, 366300, 332400, 358100, 494500, 407600, 507800],
  [13,  274700, 290000, 389500, 357300, 384900, 522800, 438200, 545800],
  [14,  294200, 310200, 412700, 382300, 411700, 551100, 468800, 583900],
  [15,  313700, 330500, 436000, 407200, 438400, 579400, 499400, 622000],
  [16,  333200, 350800, 459200, 432100, 465200, 607700, 530000, 660000],
  [17,  352700, 371000, 482400, 457100, 492000, 636000, 560600, 698100],
  [18,  372200, 391300, 505700, 482000, 518800, 664300, 591100, 736200],
  [19,  391700, 411600, 528900, 507000, 545600, 692600, 621700, 774300],
  [20,  411300, 431800, 552100, 531900, 572400, 720900, 652300, 812300],
  [21,  469600, 487800, 549900, 601800, 647400, 799500, 736300, 918700],
  [22,  491900, 511000, 576100, 630400, 678200, 831900, 771400, 962400],
  [23,  514300, 534200, 602200, 659100, 709000, 864300, 806400, 1006100],
  [24,  536600, 557400, 628400, 687700, 739800, 896700, 841400, 1049800],
  [25,  558900, 580600, 654500, 716300, 770600, 929200, 876500, 1093600],
  [26,  659800, 682400, 759200, 823500, 879900, 1040100, 990000, 1215800],
  [27,  682100, 705600, 785400, 852100, 910700, 1072500, 1025000, 1259500],
  [28,  704400, 728800, 811500, 880700, 941500, 1105000, 1060100, 1303200],
  [29,  726800, 752000, 837700, 909400, 972300, 1137400, 1095100, 1346900],
  [30,  749100, 775200, 863800, 938000, 1003100, 1169800, 1130100, 1390700],
];

const RATE_STEPS = RATE_ROWS.map((r) => r[0]);

function ceilToRateStep(kg: number): number {
  return RATE_STEPS.find((s) => s >= kg) ?? 30;
}

/**
 * Returns shipping cost in NGN, or null if domestic / country not in rate card.
 * Uses the Zee Express zone rate card with weight-bracket-aware zone assignments.
 */
export function getShippingRate(countryCode: string, weightKg: number): number | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zoneLight === 0) return null; // domestic

  const zone = weightKg <= 2.5 ? country.zoneLight : country.zoneHeavy;
  const step = ceilToRateStep(Math.min(weightKg, 30));
  const row = RATE_ROWS.find((r) => r[0] === step);

  if (!row) return null;
  return row[zone]; // row[1..8] maps to zone1..zone8
}

export function getZoneName(countryCode: string, weightKg: number): string | null {
  const country = COUNTRY_MAP[countryCode];
  if (!country || country.zoneLight === 0) return null;
  const zone = weightKg <= 2.5 ? country.zoneLight : country.zoneHeavy;
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

// ── Standard service (5–7 working days) · State-based · Zones A–E ────────────
// Row format: [weightKg, zoneA, zoneB, zoneC, zoneD, zoneE]
const DOMESTIC_STANDARD_RATES: [number, number, number, number, number, number][] = [
  [1,  6700,  8200,  9000,  9400,  9800],
  [2,  6700,  8200,  9000,  9400,  9800],
  [3,  6700,  8200,  9000,  9400,  9800],
  [4,  6700,  8200,  9000,  9400,  9800],
  [5,  8200,  9700,  10500, 10900, 11300],
  [6,  9600,  11200, 12000, 12400, 12800],
  [7,  11100, 12700, 13500, 13800, 14200],
  [8,  12600, 14200, 14900, 15300, 15700],
  [9,  14100, 15600, 16400, 16800, 17200],
  [10, 15600, 17100, 17900, 18300, 18700],
  [11, 17000, 18600, 19400, 19800, 20200],
  [12, 18500, 20100, 20900, 21200, 21600],
  [13, 20000, 21600, 22300, 22700, 23100],
  [14, 21500, 23000, 23800, 24200, 24600],
  [15, 23000, 24500, 25300, 25700, 26100],
  [16, 24400, 26000, 26800, 27200, 27600],
  [17, 25900, 27500, 28300, 28700, 29000],
  [18, 27400, 29000, 29700, 30100, 30500],
  [19, 28900, 30400, 31200, 31600, 32000],
  [20, 30400, 31900, 32700, 33100, 33500],
  [21, 31800, 33400, 34200, 34600, 35000],
  [22, 33300, 34900, 35700, 36100, 36400],
  [23, 34800, 36400, 37100, 37500, 37900],
  [24, 36300, 37800, 38600, 39000, 39400],
  [25, 37800, 39300, 40100, 40500, 40900],
  [26, 39300, 40800, 41600, 42000, 42400],
  [27, 40700, 42300, 43100, 43500, 43900],
  [28, 42200, 43800, 44600, 44900, 45300],
  [29, 43700, 45300, 46000, 46400, 46800],
  [30, 45200, 46700, 47500, 47900, 48300],
  [31, 46700, 48200, 49000, 49400, 49800],
  [32, 48100, 49700, 50500, 50900, 51300],
  [33, 49600, 51200, 52000, 52300, 52700],
  [34, 51100, 52700, 53400, 53800, 54200],
  [35, 52600, 54100, 54900, 55300, 55700],
  [36, 54100, 55600, 56400, 56800, 57200],
  [37, 55500, 57100, 57900, 58300, 58700],
  [38, 57000, 58600, 59400, 59800, 60100],
  [39, 58500, 60100, 60800, 61200, 61600],
  [40, 60000, 61500, 62300, 62700, 63100],
];

/** Nigerian states with their shipping zone for the 5–7 day standard service. */
export interface NigerianState {
  name: string;
  zone: "A" | "B" | "C" | "D" | "E" | "Lagos";
}

export const NIGERIAN_STATES: NigerianState[] = [
  { name: "Lagos", zone: "Lagos" },
  // Zone A (Southwest)
  { name: "Ekiti", zone: "A" },
  { name: "Ogun", zone: "A" },
  { name: "Ondo", zone: "A" },
  { name: "Osun", zone: "A" },
  { name: "Oyo", zone: "A" },
  // Zone B (South + Middle Belt)
  { name: "Abia", zone: "B" },
  { name: "Anambra", zone: "B" },
  { name: "Bayelsa", zone: "B" },
  { name: "Delta", zone: "B" },
  { name: "Ebonyi", zone: "B" },
  { name: "Edo", zone: "B" },
  { name: "Enugu", zone: "B" },
  { name: "Imo", zone: "B" },
  { name: "Kwara", zone: "B" },
  { name: "Rivers", zone: "B" },
  // Zone C (FCT)
  { name: "FCT (Abuja)", zone: "C" },
  // Zone D (North)
  { name: "Adamawa", zone: "D" },
  { name: "Bauchi", zone: "D" },
  { name: "Benue", zone: "D" },
  { name: "Borno", zone: "D" },
  { name: "Gombe", zone: "D" },
  { name: "Jigawa", zone: "D" },
  { name: "Kaduna", zone: "D" },
  { name: "Kano", zone: "D" },
  { name: "Katsina", zone: "D" },
  { name: "Kebbi", zone: "D" },
  { name: "Kogi", zone: "D" },
  { name: "Nasarawa", zone: "D" },
  { name: "Niger", zone: "D" },
  { name: "Plateau", zone: "D" },
  { name: "Sokoto", zone: "D" },
  { name: "Taraba", zone: "D" },
  { name: "Yobe", zone: "D" },
  { name: "Zamfara", zone: "D" },
  // Zone E (Southeast coast)
  { name: "Akwa Ibom", zone: "E" },
  { name: "Cross River", zone: "E" },
];

const STATE_ZONE_MAP: Record<string, NigerianState["zone"]> = Object.fromEntries(
  NIGERIAN_STATES.map((s) => [s.name, s.zone]),
);

function ceilDomesticExpressStep(kg: number): number {
  const steps = DOMESTIC_EXPRESS_RATES.map((r) => r[0]);
  return steps.find((s) => s >= kg) ?? 20;
}

function ceilDomesticStandardStep(kg: number): number {
  const steps = DOMESTIC_STANDARD_RATES.map((r) => r[0]);
  return steps.find((s) => s >= kg) ?? 40;
}

export interface DomesticRate {
  fee: number;
  service: "Express · 1–3 days" | "Standard · 5–7 days";
  remoteFee: number;
}

/**
 * Returns the domestic (Nigeria) shipping rate.
 * Lagos uses the Express service Zone 1 (origin city).
 * All other states use the Standard service by state zone.
 * Returns null only if state is unrecognised.
 */
export function getDomesticRate(stateName: string, weightKg: number): DomesticRate | null {
  const zone = STATE_ZONE_MAP[stateName];
  if (!zone) return null;

  const REMOTE_FEE = 2700;

  if (zone === "Lagos") {
    const step = ceilDomesticExpressStep(Math.min(weightKg, 20));
    const row = DOMESTIC_EXPRESS_RATES.find((r) => r[0] === step);
    if (!row) return null;
    return { fee: row[1], service: "Express · 1–3 days", remoteFee: REMOTE_FEE };
  }

  const zoneIndex = { A: 1, B: 2, C: 3, D: 4, E: 5 } as const;
  const idx = zoneIndex[zone as keyof typeof zoneIndex];
  const step = ceilDomesticStandardStep(Math.min(weightKg, 40));
  const row = DOMESTIC_STANDARD_RATES.find((r) => r[0] === step);
  if (!row) return null;
  return { fee: row[idx], service: "Standard · 5–7 days", remoteFee: REMOTE_FEE };
}
