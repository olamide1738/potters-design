import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyAndSavePaystackOrder, saveBankOrder, type OrderPayload } from "@/lib/orders";

declare global {
  interface Window {
    PaystackPop?: {
      setup(config: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }): { openIframe(): void };
    };
  }
}
import { useStore } from "@/store/useStore";
import { useToastStore } from "@/store/useToastStore";
import { useProducts } from "@/store/useProductStore";
import { formatPrice } from "@/lib/format";

import {
  SHIPPING_COUNTRIES,
  COUNTRY_MAP,
  getShippingRate,
  getZoneName,
  NIGERIAN_STATES,
  getDomesticRate,
} from "@/constants/shipping";

const PICKUP_ADDRESS = "No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos";

// ── Currency metadata ─────────────────────────────────────────────────────────
const CURRENCY_INFO: Record<string, { symbol: string; name: string }> = {
  NGN: { symbol: "₦", name: "Nigerian Naira" },
  GBP: { symbol: "£", name: "British Pound" },
  EUR: { symbol: "€", name: "Euro" },
  USD: { symbol: "$", name: "US Dollar" },
  CAD: { symbol: "CA$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  ZAR: { symbol: "R", name: "South African Rand" },
  GHS: { symbol: "₵", name: "Ghanaian Cedi" },
  KES: { symbol: "KSh", name: "Kenyan Shilling" },
  EGP: { symbol: "E£", name: "Egyptian Pound" },
  UGX: { symbol: "USh", name: "Ugandan Shilling" },
  XOF: { symbol: "CFA", name: "West African CFA Franc" },
  XAF: { symbol: "FCFA", name: "Central African CFA Franc" },
  SLL: { symbol: "Le", name: "Sierra Leonean Leone" },
  MXN: { symbol: "MX$", name: "Mexican Peso" },
  TRY: { symbol: "₺", name: "Turkish Lira" },
  PLN: { symbol: "zł", name: "Polish Złoty" },
  SEK: { symbol: "kr", name: "Swedish Krona" },
  NOK: { symbol: "kr", name: "Norwegian Krone" },
  DKK: { symbol: "kr", name: "Danish Krone" },
  CHF: { symbol: "Fr", name: "Swiss Franc" },
  CZK: { symbol: "Kč", name: "Czech Koruna" },
  HUF: { symbol: "Ft", name: "Hungarian Forint" },
  RON: { symbol: "lei", name: "Romanian Leu" },
  BGN: { symbol: "лв", name: "Bulgarian Lev" },
  KWD: { symbol: "KD", name: "Kuwaiti Dinar" },
  QAR: { symbol: "﷼", name: "Qatari Riyal" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  SAR: { symbol: "﷼", name: "Saudi Riyal" },
  BHD: { symbol: "BD", name: "Bahraini Dinar" },
  OMR: { symbol: "﷼", name: "Omani Rial" },
  JOD: { symbol: "JD", name: "Jordanian Dinar" },
  ILS: { symbol: "₪", name: "Israeli Shekel" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  KRW: { symbol: "₩", name: "South Korean Won" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar" },
  TWD: { symbol: "NT$", name: "Taiwan Dollar" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  MYR: { symbol: "RM", name: "Malaysian Ringgit" },
  THB: { symbol: "฿", name: "Thai Baht" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah" },
  PHP: { symbol: "₱", name: "Philippine Peso" },
  PKR: { symbol: "₨", name: "Pakistani Rupee" },
  BDT: { symbol: "৳", name: "Bangladeshi Taka" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar" },
  BRL: { symbol: "R$", name: "Brazilian Real" },
  ARS: { symbol: "$", name: "Argentine Peso" },
  CLP: { symbol: "$", name: "Chilean Peso" },
  COP: { symbol: "$", name: "Colombian Peso" },
  PEN: { symbol: "S/", name: "Peruvian Sol" },
  VND: { symbol: "₫", name: "Vietnamese Dong" },
};

// Curated base list shown in the currency dropdown
const BASE_CURRENCIES = [
  "NGN", "USD", "GBP", "EUR", "CAD", "AUD", "GHS", "ZAR",
  "KES", "EGP", "SAR", "AED", "KWD", "INR", "CNY", "JPY",
  "SGD", "BRL", "MXN", "TRY",
];

// Countries sorted: Nigeria first, then A–Z
const SORTED_COUNTRIES = [
  SHIPPING_COUNTRIES[0], // Nigeria
  ...SHIPPING_COUNTRIES.slice(1).sort((a, b) => a.name.localeCompare(b.name)),
];

interface RatesState {
  status: "idle" | "loading" | "ok" | "error";
  rates: Record<string, number>;
  date: string;
}

const LAGOS_ZONES = [
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
];

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function CheckoutPage() {
  const cart = useStore((s) => s.cart);
  const subtotal = useStore((s) => s.cartSubtotal());
  const navigate = useNavigate();
  const products = useProducts();

  // Auto-calculate shipping weight from cart (product weight incl. packaging)
  const weightKg = useMemo(() => {
    const total = cart.reduce((acc, line) => {
      const product = products.find((p) => p.id === line.productId);
      const unitWeight = product?.shippingWeightKg ?? 1.2;
      return acc + line.quantity * unitWeight;
    }, 0);
    return Math.max(0.5, Math.round(total * 10) / 10);
  }, [cart, products]);

  const [currency, setCurrency] = useState("NGN");
  const [ratesState, setRatesState] = useState<RatesState>({
    status: "idle",
    rates: {},
    date: "",
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    countryCode: "NG",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paystackLoadFailed, setPaystackLoadFailed] = useState(false);
  const addToast = useToastStore((s) => s.addToast);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "paystack">("bank");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [locating, setLocating] = useState(false);
  const isPickup = fulfillment === "pickup";

  // Auto-detect Lagos zone based on city/address input
  const detectedLagosZone = useMemo(() => {
    if (form.state !== "Lagos") return null;
    
    const searchTerms = [form.city, form.address].filter(Boolean).join(" ").toLowerCase();
    if (!searchTerms) return null;
    
    const foundZone = LAGOS_ZONES.find((z) =>
      z.areas.some((area) => searchTerms.includes(area.toLowerCase()))
    );
    return foundZone?.id || null;
  }, [form.city, form.address, form.state]);

  // Geolocation function with fallback geocoding services
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Try multiple geocoding services for better accuracy
      let addressData = null;
      
      // Try Nominatim first (OpenStreetMap)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          { headers: { 'User-Agent': 'PottersDesign/1.0' } }
        );
        addressData = await response.json();
      } catch (e) {
        console.error("Nominatim failed:", e);
      }
      
      // Fallback to BigDataCloud if Nominatim fails or returns poor data
      if (!addressData || !addressData.address) {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          addressData = await response.json();
        } catch (e) {
          console.error("BigDataCloud failed:", e);
        }
      }
      
      if (addressData && (addressData.address || addressData.city)) {
        const addr = addressData.address || addressData;
        
        // Better address parsing with fallbacks
        const streetParts = [];
        if (addr.house_number) streetParts.push(addr.house_number);
        if (addr.road) streetParts.push(addr.road);
        if (addr.building) streetParts.push(addr.building);
        if (addr.street) streetParts.push(addr.street);
        
        // Try to get the most specific city name available
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.district || addr.county || addr.locality || '';
        
        // For Nigeria specifically, try to get the state correctly
        let state = addr.state || addr.state_code || '';
        if (!state && addr.region) state = addr.region;
        if (!state && addr.province) state = addr.province;
        
        setForm((prev) => ({
          ...prev,
          address: streetParts.length > 0 ? streetParts.join(' ') : prev.address,
          city: city || prev.city,
          state: state || prev.state,
          zip: addr.postcode || addr.postal_code || prev.zip,
          countryCode: addr.country_code?.toUpperCase() || addr.country?.toUpperCase?.() || prev.countryCode,
        }));
        
        // Show more specific success message
        const locationName = city || state || 'your location';
        addToast(`Location detected: ${locationName}. Please verify and edit if needed.`);
      } else {
        addToast("Could not determine address from location. Please enter manually.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      addToast("Failed to get address from location. Please enter manually.");
    } finally {
      setLocating(false);
    }
  };

  // Auto-switch display currency when country changes
  const prevCode = useRef("NG");
  useEffect(() => {
    if (form.countryCode !== prevCode.current) {
      prevCode.current = form.countryCode;
      const c = COUNTRY_MAP[form.countryCode];
      if (c?.currency) setCurrency(c.currency);
    }
  }, [form.countryCode]);

  // Loads (or reloads) the Paystack inline widget. Safe to call more than
  // once — it always tears down any stale/failed tag first.
  const loadPaystackScript = () => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }
    document.getElementById("paystack-inline")?.remove();
    const script = document.createElement("script");
    script.id = "paystack-inline";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
      setPaystackLoadFailed(false);
    };
    script.onerror = () => setPaystackLoadFailed(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadPaystackScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch live rates once
  useEffect(() => {
    setRatesState((s) => ({ ...s, status: "loading" }));
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ngn.json",
    )
      .then((r) => r.json())
      .then((data) => {
        const raw: Record<string, number> = data.ngn ?? {};
        const rates: Record<string, number> = {};
        Object.entries(raw).forEach(([k, v]) => {
          rates[k.toUpperCase()] = v as number;
        });
        setRatesState({ status: "ok", rates, date: data.date ?? "" });
      })
      .catch(() => setRatesState((s) => ({ ...s, status: "error" })));
  }, []);

  // Shipping calculation — domestic vs international
  const isDomestic = form.countryCode === "NG";

  const domesticRate = useMemo(() => {
    if (!isDomestic || isPickup) return null;
    if (form.state === "Lagos") {
      if (!detectedLagosZone) return null;
      const zone = LAGOS_ZONES.find((z) => z.id === detectedLagosZone);
      return {
        fee: zone?.fee ?? 0,
        service: `${detectedLagosZone} Delivery`,
        remoteFee: 0,
      };
    }
    return getDomesticRate(form.state, weightKg);
  }, [isDomestic, isPickup, form.state, detectedLagosZone, weightKg]);

  const intlFee = useMemo(
    () => (!isDomestic && !isPickup ? getShippingRate(form.countryCode, weightKg) : null),
    [isDomestic, isPickup, form.countryCode, weightKg],
  );

  const zoneName = useMemo(
    () => (!isDomestic && !isPickup ? getZoneName(form.countryCode, weightKg) : null),
    [isDomestic, isPickup, form.countryCode, weightKg],
  );

  const shippingFee = isPickup ? 0 : isDomestic ? (domesticRate?.fee ?? null) : intlFee;
  const total = subtotal + (shippingFee ?? 0);



  // Build currency dropdown — always include the active currency even if not in base list
  const currencyOptions = useMemo(() => {
    const codes = BASE_CURRENCIES.includes(currency)
      ? BASE_CURRENCIES
      : [...BASE_CURRENCIES, currency];
    return codes.map((code) => {
      const info = CURRENCY_INFO[code];
      return {
        code,
        label: info ? `${info.symbol} ${code} — ${info.name}` : code,
        symbol: info?.symbol ?? code,
      };
    });
  }, [currency]);

  if (cart.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <p className="font-display text-xl">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  function convert(ngnAmount: number): string {
    if (currency === "NGN") return formatPrice(ngnAmount);
    const rate = ratesState.rates[currency];
    if (!rate) return formatPrice(ngnAmount);
    const info = CURRENCY_INFO[currency];
    const sym = info?.symbol ?? currency;
    return `${sym}${(ngnAmount * rate).toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const lagosAreaFilled = !isDomestic || form.state !== "Lagos" || detectedLagosZone !== null;
  const formFilled = isPickup
    ? [form.firstName, form.lastName, form.email, form.phone].every(
        (v) => v.trim() !== "",
      )
    : [
        form.firstName,
        form.lastName,
        form.email,
        form.phone,
        form.address,
        form.city,
        form.state,
        form.countryCode,
      ].every((v) => v.trim() !== "") && lagosAreaFilled;
  const allFilled = formFilled && termsAccepted;

  const buildOrderPayload = (): OrderPayload => ({
    customer: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
    },
    fulfillment: fulfillment,
    shippingAddress: isPickup
      ? undefined
      : {
          address: form.address,
          city: form.city,
          state: form.state === "Lagos" && detectedLagosZone ? `${form.state} (${detectedLagosZone})` : form.state,
          countryCode: form.countryCode,
          zip: form.zip,
        },
    items: cart,
    subtotal,
    shippingFee: shippingFee ?? 0,
    total,
    weightKg,
    orderNote,
    paymentMethod,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFilled) return;

    if (paymentMethod === "paystack") {
      if (!window.PaystackPop) {
        // Script never finished loading (slow network, blocked by an ad-blocker,
        // etc). Give the user real feedback instead of doing nothing, and retry
        // the load so a second click has a chance of working.
        addToast("Payment couldn't start — please try again in a moment.");
        setPaystackLoadFailed(true);
        loadPaystackScript();
        return;
      }

      try {
        const orderData = buildOrderPayload();
        const ref = `PD-${Date.now()}`;
        const handler = window.PaystackPop.setup({
          key: "pk_live_bd55418082459fe2f518a87d043323461a3d029a",
          email: form.email,
          amount: Math.round(total * 100),
          currency: "NGN",
          ref,
          // Paystack's SDK rejects async functions here ("Attribute callback
          // must be a valid function") — must be a plain function that
          // kicks off the async work itself, not one that returns a Promise.
          callback: (response) => {
            setSubmitting(true);
            verifyAndSavePaystackOrder(response.reference, orderData)
              .then((orderId) => {
                navigate("/order-confirmation", {
                  state: { orderId, paymentMethod: "paystack", email: form.email },
                });
              })
              .catch(() => {
                setSubmitting(false);
                // Payment verified on Paystack but backend save failed — surface reference
                navigate("/order-confirmation", {
                  state: { orderId: response.reference, paymentMethod: "paystack", email: form.email },
                });
              });
          },
          onClose: () => {},
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack initialization failed:", err);
        addToast("Payment couldn't start. Please refresh the page and try again.");
      }
      return;
    }

    // Bank transfer — save pending order
    setSubmitting(true);
    saveBankOrder(buildOrderPayload())
      .then((orderId) => {
        navigate("/order-confirmation", {
          state: { orderId, paymentMethod: "bank", email: form.email },
        });
      })
      .catch(() => {
        // Fallback: still show confirmation with timestamp ref
        navigate("/order-confirmation", {
          state: {
            orderId: `PD-${Date.now()}`,
            paymentMethod: "bank",
            email: form.email,
          },
        });
      })
      .finally(() => setSubmitting(false));
  };



  return (
    <div className="shell py-10 lg:py-16">
      {/* Breadcrumb */}
      <nav className="relative mb-8 flex items-center justify-center gap-2 text-sm text-ink/50 dark:text-bone/50">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 flex items-center gap-1.5 transition-colors hover:text-gold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <Link to="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-gold">Cart</Link>
        <span>/</span>
        <span className="text-ink dark:text-bone">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* ── LEFT: Customer details ─────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-2xl font-semibold">Checkout</h1>

          {/* Contact */}
          <fieldset className="mt-8 space-y-5">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <input
                  type="text"
                  placeholder="Ada"
                  required
                  className="input-field"
                  {...field("firstName")}
                />
              </Field>
              <Field label="Last name" required>
                <input
                  type="text"
                  placeholder="Okafor"
                  required
                  className="input-field"
                  {...field("lastName")}
                />
              </Field>
            </div>
            <Field label="Email address" required>
              <input
                type="email"
                placeholder="ada@example.com"
                required
                className="input-field"
                {...field("email")}
              />
            </Field>
            <Field label="Phone number" required>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                required
                className="input-field"
                {...field("phone")}
              />
            </Field>
          </fieldset>

          {/* Fulfillment method */}
          <fieldset className="mt-10">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Fulfillment method
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors ${
                  fulfillment === "delivery"
                    ? "border-ink dark:border-bone"
                    : "border-mist hover:border-ink/30 dark:border-edge dark:hover:border-bone/30"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={fulfillment === "delivery"}
                  onChange={() => setFulfillment("delivery")}
                  className="mt-0.5 h-4 w-4 accent-gold"
                />
                <div>
                  <p className="text-sm font-semibold">Delivery</p>
                  <p className="mt-0.5 text-xs text-ink/50 dark:text-bone/50">
                    Ships to your address
                  </p>
                </div>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors ${
                  fulfillment === "pickup"
                    ? "border-ink dark:border-bone"
                    : "border-mist hover:border-ink/30 dark:border-edge dark:hover:border-bone/30"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={fulfillment === "pickup"}
                  onChange={() => setFulfillment("pickup")}
                  className="mt-0.5 h-4 w-4 accent-gold"
                />
                <div>
                  <p className="text-sm font-semibold">Pick up in store</p>
                  <p className="mt-0.5 text-xs text-ink/50 dark:text-bone/50">
                    Free · Ready in 24 hrs
                  </p>
                </div>
              </label>
            </div>

            {fulfillment === "pickup" && (
              <div className="mt-4 flex items-start gap-3 rounded-card border border-mist bg-surface/50 p-4 dark:border-edge dark:bg-edge/10">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-ink/50 dark:text-bone/50"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold">Potter's Design Studio</p>
                  <p className="mt-0.5 text-ink/60 dark:text-bone/60">
                    {PICKUP_ADDRESS}
                  </p>
                  <p className="mt-1 text-xs text-ink/50 dark:text-bone/50">
                    Monday – Saturday · 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            )}
          </fieldset>

          {/* Shipping address — hidden when pickup */}
          {!isPickup && (
          <fieldset className="mt-10 space-y-5">
            <div className="flex items-center justify-between">
              <legend className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
                Shipping address
              </legend>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-2 text-xs font-semibold text-gold hover:text-gold/80 disabled:text-ink/30 disabled:cursor-not-allowed transition-colors"
              >
                {locating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Detecting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Use my current location
                  </>
                )}
              </button>
            </div>
            <Field label="Street address" required>
              <input
                type="text"
                placeholder="12 Broad Street"
                required
                className="input-field"
                {...field("address")}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" required>
                <input
                  type="text"
                  placeholder="Lagos"
                  required
                  className="input-field"
                  {...field("city")}
                />
              </Field>
              <Field label={isDomestic ? "State" : "State / Region"} required>
                {isDomestic ? (
                  <div className="relative">
                    <select
                      required
                      className="input-field appearance-none pr-8"
                      {...field("state")}
                    >
                      <option value="">— Select state —</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-bone/40">
                      ▾
                    </span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="State / Region"
                    required
                    className="input-field"
                    {...field("state")}
                  />
                )}
              </Field>
            </div>

            {isDomestic && form.state === "Lagos" && (
              <div className="space-y-3 border-t border-mist/30 pt-4 dark:border-edge/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink/70 dark:text-bone/70">
                    Lagos Delivery Zone
                  </span>
                  {detectedLagosZone && (
                    <span className="text-xs font-bold text-gold uppercase tracking-wider">
                      {detectedLagosZone} - ₦{LAGOS_ZONES.find((z) => z.id === detectedLagosZone)?.fee.toLocaleString()}
                    </span>
                  )}
                </div>
                {detectedLagosZone ? (
                  <p className="text-xs text-ink/60 dark:text-bone/60">
                    Zone auto-detected from your address: <span className="font-semibold text-gold">{detectedLagosZone}</span>
                  </p>
                ) : (
                  <p className="text-xs text-ink/50 dark:text-bone/50">
                    Enter your city and address to auto-detect delivery zone
                  </p>
                )}
                {!detectedLagosZone && (
                  <p className="text-[10px] italic text-ink/40 dark:text-bone/40">
                    If your location is not auto-detected, please contact us before placing your order so we can provide an accurate delivery quote.
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Country" required>
                <div className="relative">
                  <select
                    required
                    className="input-field appearance-none pr-8"
                    {...field("countryCode")}
                  >
                    {SORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-bone/40">
                    ▾
                  </span>
                </div>
              </Field>
              <Field label="Postal / ZIP code">
                <input
                  type="text"
                  placeholder="100001"
                  className="input-field"
                  {...field("zip")}
                />
              </Field>
            </div>

          </fieldset>
          )}

          {/* Payment */}
          <fieldset className="mt-10">
            <legend className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Payment
            </legend>
            <p className="mb-4 text-xs text-ink/50 dark:text-bone/50">
              All transactions are secure and encrypted.
            </p>

            {/* Payment method selector */}
            <div className="divide-y divide-mist overflow-hidden rounded-card border border-mist dark:divide-edge dark:border-edge">
              {/* Bank Transfer */}
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="h-4 w-4 accent-gold"
                />
                <span className="text-sm font-medium">Bank Deposit | Transfer</span>
              </label>

              {paymentMethod === "bank" && (
                <div className="bg-surface/40 px-4 pb-5 pt-4 text-sm dark:bg-edge/10">
                  <p className="mb-4 font-semibold">Payment Details</p>
                  <p className="mb-3 text-xs text-ink/60 dark:text-bone/60">
                    Please transfer your order amount to any of the accounts below.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
                        Pay into our Naira Account (NGN)
                      </p>
                      <div className="space-y-2">
                        <BankRow name="The Potter's Design Ltd" bank="Wema Bank" account="0127024387" />
                        <BankRow name="The Potters Design Limited" bank="First Bank" account="2046299408" />
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
                        Pay into our Dollar Account (USD)
                      </p>
                      <div className="space-y-2">
                        <BankRow name="The Potter's Design Ltd" bank="First Bank" account="2046300632" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-ink/60 dark:text-bone/60">
                    After payment, kindly send your payment receipt along with your order
                    number to our customer care via WhatsApp:{" "}
                    <a
                      href="https://wa.me/2347017377822"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline underline-offset-2 hover:text-gold dark:text-bone"
                    >
                      +234 701 737 7822
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:pottersdesigning@gmail.com"
                      className="font-semibold text-ink underline underline-offset-2 hover:text-gold dark:text-bone"
                    >
                      pottersdesigning@gmail.com
                    </a>
                  </p>
                </div>
              )}

              {/* Paystack */}
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                <input
                  type="radio"
                  name="payment"
                  value="paystack"
                  checked={paymentMethod === "paystack"}
                  onChange={() => setPaymentMethod("paystack")}
                  className="h-4 w-4 accent-gold"
                />
                <span className="text-sm font-medium">Paystack</span>
                <span className="ml-auto text-xs font-semibold text-[#0BA4DB]">paystack</span>
              </label>

              {paymentMethod === "paystack" && (
                <div className="bg-surface/40 px-4 py-4 text-sm dark:bg-edge/10">
                  <p className="text-ink/70 dark:text-bone/70">
                    Complete your payment securely with card, bank transfer, or USSD via Paystack.
                  </p>
                  {!paystackLoaded && !paystackLoadFailed && (
                    <p className="mt-2 text-xs text-ink/40 dark:text-bone/40">
                      Loading secure payment…
                    </p>
                  )}
                  {paystackLoadFailed && !paystackLoaded && (
                    <p className="mt-2 text-xs text-sale">
                      Couldn&rsquo;t load the payment gateway.{" "}
                      <button
                        type="button"
                        onClick={loadPaystackScript}
                        className="font-semibold underline underline-offset-2"
                      >
                        Retry
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </fieldset>

          {/* Order note */}
          <div className="mt-8">
            <label className="mb-1.5 block text-xs font-semibold text-ink/70 dark:text-bone/70">
              Add a note to your order{" "}
              <span className="font-normal text-ink/40 dark:text-bone/40">(optional)</span>
            </label>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Special instructions, colour preferences, occasion details…"
              rows={3}
              className="input-field w-full resize-none"
            />
          </div>

          {/* T&C checkbox */}
          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm border-mist accent-gold dark:border-edge"
            />
            <span className="text-sm text-ink/70 dark:text-bone/70">
              I have read and understood the{" "}
              <Link
                to="/terms"
                target="_blank"
                className="font-semibold text-ink underline underline-offset-2 hover:text-gold dark:text-bone"
              >
                Terms &amp; Conditions
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !allFilled || (paymentMethod === "paystack" && !paystackLoaded)}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Placing order…"
              : paymentMethod === "paystack"
              ? "Pay with Paystack"
              : "Place order"}
          </button>
        </div>

        {/* ── RIGHT: Order summary ──────────────────────────────────────── */}
        <aside className="h-fit rounded-card border border-mist p-6 dark:border-edge lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>
            <Link to="/cart" className="text-xs text-gold underline underline-offset-4">
              Edit
            </Link>
          </div>

          {/* Currency switcher */}
          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Display currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-card border border-mist bg-bone py-2 pl-3 pr-8 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
              >
                {currencyOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 dark:text-bone/40">
                ▾
              </span>
            </div>
            {ratesState.status === "loading" && (
              <p className="mt-1.5 text-[11px] text-ink/40 dark:text-bone/40">
                Fetching live rates…
              </p>
            )}
            {ratesState.status === "ok" && currency !== "NGN" && (
              <p className="mt-1.5 text-[11px] text-ink/40 dark:text-bone/40">
                Live rate · {ratesState.date} · fawazahmed0/currency-api
              </p>
            )}
            {ratesState.status === "error" && (
              <p className="mt-1.5 text-[11px] text-sale">
                Could not fetch live rates — showing NGN.
              </p>
            )}
          </div>

          {/* Items */}
          <ul className="mt-5 divide-y divide-mist dark:divide-edge">
            {cart.map((line) => (
              <li
                key={`${line.productId}-${line.size}-${line.color}-${line.length}`}
                className="flex items-start gap-3 py-4"
              >
                <div className="relative shrink-0">
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-16 w-14 rounded-card object-cover"
                  />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-bone dark:bg-bone dark:text-ink">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex flex-1 justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium leading-snug">{line.name}</p>
                  </div>
                  <p className="shrink-0 font-mono text-sm font-semibold">
                    {convert(line.unitPrice * line.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="mt-4 space-y-2 border-t border-mist pt-4 text-sm dark:border-edge">
            <div className="flex justify-between text-ink/60 dark:text-bone/60">
              <span>Subtotal</span>
              <span className="font-mono">{convert(subtotal)}</span>
            </div>

            {/* Shipping line */}
            <div className="flex items-start justify-between text-ink/60 dark:text-bone/60">
              <span className="leading-snug">
                Shipping
                {isPickup ? (
                  <span className="ml-1 block text-[11px] text-ink/40 dark:text-bone/40">
                    Store pickup
                  </span>
                ) : domesticRate ? (
                  <span className="ml-1 block text-[11px] text-ink/40 dark:text-bone/40">
                    {domesticRate.service}
                  </span>
                ) : !isDomestic && zoneName ? (
                  <span className="ml-1 text-[11px]">({zoneName})</span>
                ) : null}
              </span>
              {isPickup ? (
                <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                  Free
                </span>
              ) : isDomestic ? (
                domesticRate ? (
                  <span className="font-mono text-right">
                    {convert(domesticRate.fee)}
                    <br />
                    <span className="text-[10px] text-ink/40 dark:text-bone/40">
                      {weightKg} kg est.
                    </span>
                  </span>
                ) : (
                  <span className="text-xs">
                    {form.state === "Lagos" && !detectedLagosZone
                      ? "Enter address"
                      : form.state
                      ? "Rate unavailable"
                      : "Select a state"}
                  </span>
                )
              ) : shippingFee !== null ? (
                <span className="font-mono text-right">
                  {convert(shippingFee)}
                  <br />
                  <span className="text-[10px] text-ink/40 dark:text-bone/40">
                    {weightKg} kg est.
                  </span>
                </span>
              ) : (
                <span className="text-xs">Calculated separately</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-mist pt-4 font-semibold dark:border-edge">
            <span>Total</span>
            <span className="font-mono text-gold">{convert(total)}</span>
          </div>

          {!isPickup && shippingFee !== null && (
            <p className="mt-3 text-[11px] text-ink/40 dark:text-bone/40">
              Weight calculated from your cart ({weightKg} kg incl. packaging).{" "}
              {isDomestic
                ? form.state === "Lagos"
                  ? "Local delivery. Rate confirmed based on your selected zone."
                  : "Via Zee Express. Remote location surcharge (₦2,700) may apply. Final rate confirmed at dispatch."
                : "Via Zee Express. Excludes customs duties and other surcharges. Final rate confirmed at dispatch."}
            </p>
          )}

          {/* Delivery timeline */}
          <div className="mt-4 border-t border-mist pt-4 dark:border-edge">
            <p className="text-[11px] text-ink/50 dark:text-bone/50">
              We would notify you when your order is ready for pick up
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/70 dark:text-bone/70">
        {label}
        {required && <span className="ml-0.5 text-sale">*</span>}
      </label>
      {children}
    </div>
  );
}

function BankRow({
  name,
  bank,
  account,
}: {
  name: string;
  bank: string;
  account: string;
}) {
  return (
    <div className="rounded-card border border-mist bg-bone px-3 py-2.5 dark:border-edge dark:bg-carbon">
      <p className="text-xs font-semibold">{name}</p>
      <p className="mt-0.5 text-xs text-ink/60 dark:text-bone/60">{bank}</p>
      <p className="mt-1 font-mono text-sm font-semibold tracking-wider">{account}</p>
    </div>
  );
}

