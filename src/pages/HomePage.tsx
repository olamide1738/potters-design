import { Link } from "react-router-dom";
import { HeroVideo } from "@/components/HeroVideo";
import { FeatureGrid, MarqueeStrip } from "@/components/Sections";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useProducts } from "@/store/useProductStore";

export function HomePage() {
  const popular = useProducts();
  const hotPicks = popular.filter((p) => p.featured);

  return (
    <>
      <HeroVideo />

      {/* Popular products */}
      <section className="shell py-20">
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow">Trending now</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Popular products</h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-gold" />
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-gold underline underline-offset-4 sm:block">
            Shop all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {popular.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link to="/shop" className="btn-primary">Shop now</Link>
        </Reveal>
      </section>

      <MarqueeStrip />

      <FeatureGrid />

      {/* Hot picks */}
      <section className="bg-ink py-16 text-bone lg:py-24">
        <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.4fr] lg:items-start lg:gap-16">
          {/* Editorial collage — desktop only */}
          <Reveal className="relative hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <Link to="/shop/asiwaju" className="block overflow-hidden rounded-2xl">
              <img
                src="/images/products/asiwaju-1.jpg"
                alt="Asiwaju look"
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
            <Link
              to="/shop/asiwaju"
              className="absolute -bottom-10 right-2 block w-[52%] overflow-hidden rounded-2xl ring-8 ring-ink transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src="/images/products/asiwaju-4.jpg"
                alt="Asiwaju detail"
                className="aspect-[3/4] w-full object-cover"
              />
            </Link>
          </Reveal>

          {/* Heading + product grid */}
          <div>
            <Reveal className="mb-8 flex items-center gap-3">
              <FlameIcon />
              <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-gold sm:text-4xl">
                Hot picks for you!
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 [&_.eyebrow]:text-bone/40 [&_.font-display]:uppercase [&_.font-display]:text-gold [&_.text-gold]:text-bone/70">
              {hotPicks.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 100}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FlameIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-gold"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    </svg>
  );
}
