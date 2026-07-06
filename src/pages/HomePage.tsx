import { Link } from "react-router-dom";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FeatureGrid, MarqueeStrip } from "@/components/Sections";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

export function HomePage() {
  const popular = PRODUCTS;
  const hotPicks = PRODUCTS.filter((p) => p.featured);

  return (
    <>
      <HeroCarousel />

      {/* Popular products */}
      <section className="shell py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow">Trending now</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Popular products</h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-gold" />
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-gold underline underline-offset-4 sm:block">
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-primary">Shop now</Link>
        </div>
      </section>

      <MarqueeStrip />

      <FeatureGrid />

      {/* Hot picks */}
      <section className="bg-carbon py-20 text-bone">
        <div className="shell">
          <div className="mb-10">
            <span className="eyebrow text-gold">Curated for you</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Hot picks for you!</h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-gold" />
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {hotPicks.map((p) => (
              <div key={p.id} className="text-bone [&_a]:text-bone [&_.text-ink\\/80]:text-bone/80">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
