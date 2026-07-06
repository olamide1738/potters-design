const FEATURES = [
  {
    title: "Quality materials",
    body: "Every piece is made with carefully selected fabrics designed for comfort, durability, and style.",
  },
  {
    title: "Bold designs",
    body: "Potter's Design is about expression — modern silhouettes met with distinctive heritage detail.",
  },
  {
    title: "Worldwide shipping",
    body: "Wherever you are, we deliver on time. We ship globally so the culture can travel.",
  },
  {
    title: "Easy shopping",
    body: "Clear product details, size guides, and smooth navigation help you find what you want fast.",
  },
];

export function FeatureGrid() {
  return (
    <section className="shell py-20">
      <div className="mb-12 max-w-xl">
        <span className="eyebrow">Why Potter&rsquo;s Design</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">What sets us apart</h2>
        <span className="mt-4 block h-1 w-14 rounded-full bg-gold" />
      </div>
      <div className="grid gap-px overflow-hidden rounded-card bg-mist dark:bg-edge sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="bg-bone p-8 dark:bg-carbon">
            <span className="font-display text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-bone/70">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const MARQUEE = ["New arrivals", "Hot picks", "Aso-oke", "2-pieces", "Dresses", "Bubu", "Worldwide shipping"];

export function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-gold py-3 dark:border-bone/10">
      <div className="flex animate-[scroll_24s_linear_infinite] gap-10 whitespace-nowrap">
        {[...MARQUEE, ...MARQUEE].map((word, i) => (
          <span key={i} className="font-display text-lg font-medium text-ink">
            {word} <span className="text-ink/40">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
