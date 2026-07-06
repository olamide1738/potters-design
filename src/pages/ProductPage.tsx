import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useToastStore } from "@/store/useToastStore";
import { cn, formatProductPrice } from "@/lib/format";
import {
  computeDeliveryTimeline,
  formatDeliveryDate,
  type DeliveryTimeline,
} from "@/lib/delivery";
import { ProductCard } from "@/components/ProductCard";
import { SizeGuide } from "@/components/SizeGuide";

const PLACEHOLDER = "/hanger-placeholder.svg";

type Tab = "description" | "ordering" | "shipping";

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  const addToCart = useStore((s) => s.addToCart);
  const addToast = useToastStore((s) => s.addToast);
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [storeInfoOpen, setStoreInfoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [timeline, setTimeline] = useState<DeliveryTimeline>(
    computeDeliveryTimeline,
  );

  useEffect(() => {
    const id = setInterval(() => setTimeline(computeDeliveryTimeline()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Auto-advance carousel
  const imgs = product?.gallery?.length ? product.gallery : product ? [product.image] : [];
  useEffect(() => {
    if (imgs.length <= 1) return;
    const startTimer = () => {
      if (carouselTimer.current) clearInterval(carouselTimer.current);
      carouselTimer.current = setInterval(() => {
        setActiveImg((prev) => (prev + 1) % imgs.length);
      }, 10_000);
    };
    startTimer();
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const pickThumb = (i: number) => {
    setActiveImg(i);
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    carouselTimer.current = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % imgs.length);
    }, 10_000);
  };

  if (!product) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="btn-primary mt-6">
          Back to shop
        </Link>
      </div>
    );
  }

  const needsSize = product.sizes.length > 0 && product.sizes[0] !== "Free Size";
  const needsColor = product.colors.length > 0;
  const canAdd =
    product.inStock && (!needsSize || size) && (!needsColor || color);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const handleAdd = () => {
    setAdding(true);
    addToCart(product, { size, color, quantity: qty });
    addToast("Added to cart");
    setTimeout(() => setAdding(false), 700);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Potter's Design — ${product.name}`,
      text:
        product.description?.split("\n\n")[0] ??
        `Check out ${product.name} from Potter's Design`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast("Link copied to clipboard");
      } catch {
        addToast("Copy the URL from your address bar to share");
      }
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "description", label: "Product description" },
    { key: "ordering", label: "Ordering process" },
    { key: "shipping", label: "Shipping & Return" },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="shell py-5">
        <div className="relative flex items-center justify-center text-sm text-ink/50 dark:text-bone/50">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold">Shop</Link>
            <span>/</span>
            <span className="text-ink dark:text-bone">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="shell grid gap-12 pb-12 lg:grid-cols-2">
        {/* Gallery */}
        {(() => {
          const current = imgs[activeImg] ?? imgs[0];
          const thumbs = imgs.map((src, i) => ({ src, i })).filter(({ i }) => i !== activeImg);
          return (
            <div className="space-y-3">
              <div className="aspect-[3/4] overflow-hidden rounded-card bg-surface dark:bg-carbon">
                <img
                  key={current}
                  src={current}
                  alt={product.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1.5">
                  {thumbs.map(({ src, i }) => (
                    <button
                      key={i}
                      onClick={() => pickThumb(i)}
                      className="aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-card border border-mist transition-colors hover:border-ink/60 dark:border-edge dark:hover:border-bone/60"
                    >
                      <img
                        src={src}
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Detail */}
        <div className="lg:pt-4">
          {/* Category + Share */}
          <div className="flex items-center justify-between">
            <span className="eyebrow">{product.category}</span>
            <button
              onClick={handleShare}
              aria-label="Share this product"
              className="grid h-9 w-9 place-items-center rounded-full border border-mist text-ink/50 transition-colors hover:border-ink hover:text-ink dark:border-edge dark:text-bone/50 dark:hover:border-bone dark:hover:text-bone"
            >
              <ShareIcon />
            </button>
          </div>

          <h1 className="mt-2 text-4xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-gold">
            {formatProductPrice(product.price)}
          </p>

          {product.priceNote && (
            <p className="mt-1.5 text-xs text-ink/50 dark:text-bone/50">
              {product.priceNote}
            </p>
          )}

          {product.description && (
            <div className="mt-6 max-w-prose space-y-3 text-sm leading-relaxed text-ink/70 dark:text-bone/70">
              {product.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Colour */}
          {needsColor && (
            <div className="mt-8">
              <p className="mb-2 text-sm font-semibold">
                Colour
                {color && (
                  <span className="ml-1 font-normal text-ink/50 dark:text-bone/50">
                    · {color}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "rounded-card border px-4 py-2 text-sm transition-colors",
                      color === c
                        ? "border-ink bg-ink text-bone dark:border-bone dark:bg-bone dark:text-ink"
                        : "border-mist hover:border-ink dark:border-edge dark:hover:border-bone",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {needsSize && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Size
                  {size && (
                    <span className="ml-1 font-normal text-ink/50 dark:text-bone/50">
                      · {size}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-ink/50 underline underline-offset-4 transition-colors hover:text-ink dark:text-bone/50 dark:hover:text-bone"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-10 rounded-card border px-3 py-2 text-sm transition-colors",
                      size === s
                        ? "border-ink bg-ink text-bone dark:border-bone dark:bg-bone dark:text-ink"
                        : "border-mist hover:border-ink dark:border-edge dark:hover:border-bone",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!needsSize && product.sizes[0] === "Free Size" && (
            <p className="mt-6 text-sm text-ink/60 dark:text-bone/60">
              <span className="font-semibold text-ink dark:text-bone">One size</span>{" "}
              — fits most.
            </p>
          )}

          {/* Qty + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-card border border-mist dark:border-edge">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-lg">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-lg">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!canAdd || adding}
              className="btn-accent flex-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {adding ? <SpinnerIcon /> : !product.inStock ? "Sold out" : "Add to cart"}
            </button>
          </div>

          {!canAdd && product.inStock && (
            <p className="mt-3 text-xs text-gold">
              Select{" "}
              {[needsColor && !color && "a colour", needsSize && !size && "a size"]
                .filter(Boolean)
                .join(" and ")}{" "}
              to continue.
            </p>
          )}

          {/* Pickup */}
          <div className="mt-7 rounded-card border border-mist p-4 dark:border-edge">
            <div className="flex items-start gap-3">
              <CheckCircleIcon />
              <div className="flex-1">
                <p className="text-sm">
                  Pickup available at{" "}
                  <span className="font-semibold">Potter's Design Studio</span>
                  <span className="ml-2 text-ink/50 dark:text-bone/50">
                    — Usually ready in 24 hours
                  </span>
                </p>
                <button
                  onClick={() => setStoreInfoOpen((v) => !v)}
                  className="mt-1 text-xs underline underline-offset-4 transition-colors hover:text-gold"
                >
                  {storeInfoOpen ? "Hide store information" : "View store information"}
                </button>
                {storeInfoOpen && (
                  <div className="mt-3 space-y-0.5 rounded-card bg-surface/60 p-3 text-xs text-ink/70 dark:bg-edge/20 dark:text-bone/70">
                    <p className="font-semibold text-ink dark:text-bone">Potter's Design</p>
                    <p>No 4, Akinsanmi Street</p>
                    <p>Obanikoro Estate, Mainland Lagos</p>
                    <p className="mt-2 text-ink/50 dark:text-bone/50">
                      Monday – Saturday · 9:00 AM – 6:00 PM
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery timeline */}
          <div className="mt-4 flex items-start gap-2.5 text-sm text-ink/70 dark:text-bone/70">
            <TruckIcon />
            <p className="leading-relaxed">
              {timeline.hoursLeft !== null && timeline.hoursLeft > 0 ? (
                <>
                  Order in the next{" "}
                  <span className="font-semibold text-ink dark:text-bone">
                    {timeline.hoursLeft} Hour{timeline.hoursLeft !== 1 ? "s" : ""}{" "}
                    {timeline.minsLeft} Min{timeline.minsLeft !== 1 ? "s" : ""}
                  </span>{" "}
                  to get it between{" "}
                  <span className="font-semibold text-ink underline decoration-dotted underline-offset-4 dark:text-bone">
                    {formatDeliveryDate(timeline.earliest)}
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-ink underline decoration-dotted underline-offset-4 dark:text-bone">
                    {formatDeliveryDate(timeline.latest)}
                  </span>
                </>
              ) : (
                <>
                  Order now — estimated delivery between{" "}
                  <span className="font-semibold text-ink underline decoration-dotted underline-offset-4 dark:text-bone">
                    {formatDeliveryDate(timeline.earliest)}
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-ink underline decoration-dotted underline-offset-4 dark:text-bone">
                    {formatDeliveryDate(timeline.latest)}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Action row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-mist pt-5 dark:border-edge">
            <Link
              to="/faq"
              className="flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-ink dark:text-bone/55 dark:hover:text-bone"
            >
              <QuestionIcon />
              Ask a question
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-ink dark:text-bone/55 dark:hover:text-bone"
            >
              <ShareIcon />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* ── Product tabs ──────────────────────────────────────────────────── */}
      <div className="shell pb-20">
        {/* Tab bar */}
        <div className="border-b border-mist dark:border-edge">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 border-b-2 px-5 py-4 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "border-ink text-ink dark:border-bone dark:text-bone"
                    : "border-transparent text-ink/45 hover:text-ink/70 dark:text-bone/45 dark:hover:text-bone/70",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-2xl py-8 text-sm leading-relaxed text-ink/70 dark:text-bone/70">
          {activeTab === "description" && (
            <div className="space-y-6">
              {product.description && (
                <div className="space-y-3">
                  {product.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
              {(product.fabric || product.careInstructions || product.weightKg || product.dimensions) && (
                <dl className="mt-6 divide-y divide-mist dark:divide-edge">
                  {product.fabric && (
                    <div className="flex gap-4 py-3">
                      <dt className="w-32 shrink-0 font-semibold text-ink dark:text-bone">Fabric</dt>
                      <dd>{product.fabric}</dd>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div className="flex gap-4 py-3">
                      <dt className="w-32 shrink-0 font-semibold text-ink dark:text-bone">Care</dt>
                      <dd>{product.careInstructions}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex gap-4 py-3">
                      <dt className="w-32 shrink-0 font-semibold text-ink dark:text-bone">Dimensions</dt>
                      <dd>{product.dimensions}</dd>
                    </div>
                  )}
                  {product.weightKg && (
                    <div className="flex gap-4 py-3">
                      <dt className="w-32 shrink-0 font-semibold text-ink dark:text-bone">Weight</dt>
                      <dd>{product.weightKg}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          )}

          {activeTab === "ordering" && (
            <div className="space-y-8">
              <Section title="Order processing">
                <p>
                  Most of our pieces are made-to-order and produced after purchase
                  in standard sizing to ensure exceptional quality, craftsmanship,
                  and attention to detail. Once your order is placed, our team
                  begins carefully creating your garment.
                </p>
                <p>
                  Production typically takes{" "}
                  <strong className="text-ink dark:text-bone">
                    5–10 business days
                  </strong>
                  .
                </p>
              </Section>

              <Section title="Order confirmation">
                <p>
                  Once your order is successfully placed, you will receive an order
                  confirmation email containing your purchase details.
                </p>
                <p>
                  When your order is ready for dispatch, we will send a shipping
                  confirmation email with your tracking information, allowing you
                  to monitor your package every step of the way.
                </p>
              </Section>

              <Section title="Feedback">
                <p>
                  Your satisfaction is important to us. After delivery, we may
                  reach out to request your feedback and to share your experience
                  with us through a review.
                </p>
              </Section>

              <Section title="Need assistance?">
                <p>
                  For inquiries or support regarding your order, please contact us
                  at{" "}
                  <a
                    href="mailto:pottersdesigning@gmail.com"
                    className="font-medium text-ink underline underline-offset-4 hover:text-gold dark:text-bone"
                  >
                    pottersdesigning@gmail.com
                  </a>
                  . Our team is committed to responding promptly.
                </p>
              </Section>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-8">
              <Section title="Shipping">
                <p>
                  Shipping costs are calculated based on the weight of your order
                  and delivery destination. Shipping fees are not included in the
                  listed product prices and are the sole responsibility of the
                  customer. You can view the applicable shipping charges at checkout
                  before completing your purchase.
                </p>
                <p>
                  <strong className="text-ink dark:text-bone">
                    International delivery time:
                  </strong>{" "}
                  Orders are typically delivered within{" "}
                  <strong className="text-ink dark:text-bone">
                    3–5 business days
                  </strong>{" "}
                  from the shipping date.
                </p>
                <p>
                  Shipping is handled by third-party logistics providers. If a
                  delivery is refused, missed, or unsuccessful, the order may be
                  returned and the customer will be responsible for any additional
                  fees incurred.
                </p>
                <div className="rounded-card border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
                  <p className="font-semibold">Important notice — U.S. orders</p>
                  <p className="mt-1">
                    Due to recent changes in U.S. trade regulations, shipments to
                    the United States may attract customs duties or import charges
                    upon arrival. These are determined by U.S. customs authorities
                    and are the responsibility of the customer.
                  </p>
                </div>
              </Section>

              <Section title="Returns">
                <p>
                  You may request a return within{" "}
                  <strong className="text-ink dark:text-bone">
                    24 hours of receiving your order
                  </strong>
                  . All return requests are subject to review and approval.
                </p>
                <p>Once approved, dispatch timelines are:</p>
                <ul className="mt-2 space-y-1.5 pl-4">
                  {[
                    "Lagos customers — within 24 hours",
                    "Other Nigerian customers — within 72 hours",
                    "International customers — within 7 business days",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40 dark:bg-bone/40" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Returned items must be unworn, unwashed, in perfect condition,
                  with all original labels attached and in original packaging.
                  Return shipping costs are the responsibility of the customer.
                </p>
                <p>
                  To initiate a return, email{" "}
                  <a
                    href="mailto:pottersdesigning@gmail.com"
                    className="font-medium text-ink underline underline-offset-4 hover:text-gold dark:text-bone"
                  >
                    pottersdesigning@gmail.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="Refund policy">
                <p>
                  As a general policy, Potter's Design does not offer refunds on
                  purchases. Refunds will only be considered where an item is
                  confirmed defective or damaged upon delivery.
                </p>
              </Section>

              <Section title="Exchanges">
                <p>
                  We accept exchanges for items of equal value, subject to product
                  availability.
                </p>
                <ul className="mt-2 space-y-1.5 pl-4">
                  {[
                    "If the replacement is of lesser value, a store credit will be issued for the difference.",
                    "If the replacement is of higher value, you'll pay the price difference before we ship.",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40 dark:bg-bone/40" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Items purchased during sales, promotions, or clearance events are
                  not eligible for exchange, store credit, or refund.
                </p>
              </Section>

              <Section title="Defective items">
                <p>
                  If you receive a defective item, contact us within{" "}
                  <strong className="text-ink dark:text-bone">
                    24 hours of delivery
                  </strong>
                  . Upon inspection, if the defect is confirmed, we will offer a
                  replacement or full refund.
                </p>
              </Section>
            </div>
          )}
        </div>

        {/* WhatsApp CTA for further questions */}
        <div className="mt-2 flex items-center gap-3 border-t border-mist pt-6 dark:border-edge">
          <p className="text-sm text-ink/60 dark:text-bone/60">
            Have a specific question about this product?
          </p>
          <a
            href="https://wa.me/2347017377822"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 transition-colors hover:text-gold dark:text-bone"
          >
            Chat with us on WhatsApp →
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="shell pb-24">
          <h2 className="mb-8 text-2xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold text-ink dark:text-bone">
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────────── */

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-green-500">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-ink/40 dark:text-bone/40">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
