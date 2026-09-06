import { useState } from "react";

const FAQS = [
  {
    category: "Orders & Payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse the shop, select your size and colour, then click 'Add to cart'. When you're ready, head to checkout, fill in your details, choose a payment method, and you're done. We'll send you a confirmation email straight away.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank deposit/transfer to our Naira (NGN) or Dollar (USD) accounts. Paystack (card, bank, USSD) is coming soon. Full payment details are shown at checkout.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Because most of our pieces are made-to-order and production begins quickly, we're unable to guarantee changes or cancellations once an order is confirmed. Please reach out to us on WhatsApp (+234 701 737 7822) as soon as possible and we'll do our very best to help.",
      },
      {
        q: "Do you offer custom or bespoke orders?",
        a: "Yes! We love collaborating on custom pieces. Send us a message via WhatsApp or email us at pottersdesigning@gmail.com with your vision and we'll take it from there.",
      },
    ],
  },
  {
    category: "Sizing",
    items: [
      {
        q: "What sizes do you carry?",
        a: "Our pieces come in sizes XS to 2XL, corresponding to PD sizes 4–22. Straight sizes run XS–L (PD 4–14) and plus sizes run L–2XL (PD 16–22). Some styles are also available in Free Size. Check the size guide on each product page for measurements.",
      },
      {
        q: "How do I find the right size for me?",
        a: "Click 'Size guide' on any product page — it shows your PD size alongside UK, US, EU equivalents and bust/waist/hip measurements. When in doubt, go up a size. You can also chat with us on WhatsApp and we'll help you pick the best fit.",
      },
      {
        q: "Do prices vary by size?",
        a: "Yes, for most products. Straight sizes (XS–M, PD 4–12) are priced slightly lower than plus sizes (L–2XL, PD 14–22). The exact price breakdown is shown on each product page.",
      },
    ],
  },
  {
    category: "Production & Delivery",
    items: [
      {
        q: "How long will it take to receive my order?",
        a: "Most pieces are made-to-order. Production typically takes 5–10 business days, after which your order is shipped. International delivery usually takes a further 3–5 business days from dispatch. We'll send you a tracking number once your order is on its way.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide. Shipping costs are calculated at checkout based on your destination and order weight. Please note that international customers are responsible for any customs duties or import charges that may apply in their country.",
      },
      {
        q: "How are shipping costs calculated?",
        a: "Shipping is calculated by the weight of your order (including packaging) and your delivery destination. You'll see the exact shipping fee at checkout before you pay — no surprises.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, we'll send you a confirmation email with a tracking number. You can use it to follow your package every step of the way. If you haven't received tracking info after 10 business days, drop us a message.",
      },
      {
        q: "Can I pick up my order in store?",
        a: "Absolutely! Select 'Pick up in store' at checkout. We'll notify you when your order is ready — usually within 24 hours of production completing. Our studio is at No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos. Open Monday–Saturday, 9 AM–6 PM.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "Returns must be requested within 24 hours of receiving your order. Items must be unworn, unwashed, in perfect condition, with all original labels and packaging intact. Return shipping costs are the customer's responsibility. To start a return, email pottersdesigning@gmail.com.",
      },
      {
        q: "How do exchanges work?",
        a: "We accept exchanges for items of equal value, subject to availability. If the replacement is of lesser value, we issue a store credit for the difference. If it's higher, you'll pay the difference before we ship. All exchange shipping costs are covered by the customer.",
      },
      {
        q: "Do you offer refunds?",
        a: "As a general policy, Potter’s Design does not offer refunds on purchases. Refunds or replacements will only be considered where an item is confirmed to be defective or damaged upon delivery. Please contact us within 24 hours of delivery with clear video evidence. Once inspected and confirmed, we will, at our discretion, offer either a replacement or a full refund for the affected item. Please refer to Terms & Conditions for more details.",
      },
      {
        q: "Are sale items returnable?",
        a: "Items purchased during sales, promotions, or clearance events are final sale and are not eligible for returns, exchanges, or store credit.",
      },
    ],
  },
  {
    category: "Care & Quality",
    items: [
      {
        q: "How do I care for my garment?",
        a: "Care instructions vary by fabric. Aso Oke and similar woven pieces should be dry cleaned. Akwete fabric should be hand washed cold and laid flat to dry. You'll find specific care instructions on each product page and on the label inside your garment.",
      },
      {
        q: "Will the colours fade over time?",
        a: "Our fabrics are selected for quality and durability. Following the care instructions on the label (especially avoiding machine washing for delicate weaves) will keep your piece looking its best for years.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-mist dark:border-edge">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left text-sm font-semibold"
      >
        <span>{q}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-ink/70 dark:text-bone/70">
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQPage() {
  return (
    <>
      <section className="bg-carbon py-20 text-bone">
        <div className="shell max-w-2xl">
          <span className="eyebrow text-gold">Help centre</span>
          <h1 className="mt-4 text-4xl font-semibold">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-bone/70">
            Everything you might want to know before, during, or after your
            order. Can't find your answer? We're one message away.
          </p>
        </div>
      </section>

      <div className="shell max-w-2xl py-16">
        <div className="space-y-12">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="mb-2 font-display text-lg font-semibold text-gold">
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 rounded-card border border-mist bg-surface/60 p-8 text-center dark:border-edge dark:bg-edge/10">
          <h3 className="font-display text-xl font-semibold">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm text-ink/60 dark:text-bone/60">
            Our team is ready and happy to help. Chat with us directly on
            WhatsApp for the fastest response.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/2347017377822"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:pottersdesigning@gmail.com"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
