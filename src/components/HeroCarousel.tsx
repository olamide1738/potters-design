import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/format";

interface Slide {
  headline: string;
  sub: string;
  slug: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    headline: "A Daring Fusion Of Heritage And Forward-Thinking Design",
    sub: "Rooted in Culture. Designed for What's Next.",
    slug: "awero",
    image: "/images/products/awero-1.jpg",
  },
  {
    headline: "An Elegant Clash Of Classic Roots And Contemporary Edge",
    sub: "Crafted from Heritage. Styled for the Future.",
    slug: "morewa",
    image: "/images/products/morewa-1.jpg",
  },
  {
    headline: "Timeless Craft Reimagined Through A Modern Lens",
    sub: "Elegance, With an Edge.",
    slug: "bewaji",
    image: "/images/products/bewaji-1.jpg",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const go = (dir: number) =>
    setActive((a) => (a + dir + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="bg-cream lg:relative lg:h-[88vh] lg:min-h-[600px] lg:overflow-hidden">
      {/* ---------- MOBILE: image on top, copy on solid cream below ---------- */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {SLIDES.map((s, i) => (
            <Link
              key={i}
              to={`/shop/${s.slug}`}
              aria-label={s.headline}
              className={cn(
                "absolute inset-0 block transition-opacity duration-700",
                i === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <img src={s.image} alt="" className="h-full w-full object-cover object-top" />
            </Link>
          ))}
          {/* soft fade into the cream copy block */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
          />
        </div>
        <div className="px-5 pb-12 pt-6 sm:px-6">
          <Copy slide={slide} go={go} />
        </div>
      </div>

      {/* ---------- DESKTOP: editorial overlay ---------- */}
      <div className="hidden h-full lg:block">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Link to={`/shop/${s.slug}`} aria-label={s.headline} className="absolute inset-0 block">
              <img src={s.image} alt="" className="h-full w-full object-cover object-[right_top]" />
            </Link>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream from-[12%] via-cream/70 via-[45%] to-transparent to-[68%]"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0">
          <div className="shell flex h-full items-center">
            <div className="pointer-events-auto max-w-xl">
              <Copy slide={slide} go={go} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Copy({ slide, go }: { slide: Slide; go: (dir: number) => void }) {
  return (
    <>
      <h1 className="font-display text-[2rem] font-normal leading-[1.12] text-[#241C15] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.08]">
        {slide.headline}
      </h1>
      <p className="mt-5 font-display text-sm tracking-wide text-[#241C15]/70 sm:text-base">
        {slide.sub}
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#E1B9A7] text-[#6B5D54] transition-colors hover:border-[#241C15] hover:text-[#241C15]"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#E1B9A7] text-[#6B5D54] transition-colors hover:border-[#241C15] hover:text-[#241C15]"
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
