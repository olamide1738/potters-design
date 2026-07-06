import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/format";

interface Slide {
  headline: string;
  sub: string;
  slug: string;
  cta: string;
  image: string;
  imagePos: "left" | "right";
  textBg: string;
}

const SLIDES: Slide[] = [
  {
    headline: "A daring fusion of heritage and forward-thinking design",
    sub: "Rooted in culture. Designed for what's next.",
    slug: "morewa",
    cta: "Shop the look",
    image: "https://pottersdesign.com/wp-content/uploads/2024/06/Morewa-scaled-700x700.jpg",
    imagePos: "right",
    textBg: "#1C2B45",
  },
  {
    headline: "An elegant clash of classic roots and contemporary edge",
    sub: "Crafted from heritage. Styled for the future.",
    slug: "asiwaju",
    cta: "Shop the look",
    image: "https://pottersdesign.com/wp-content/uploads/2024/06/Asiwaju-scaled-700x700.jpg",
    imagePos: "left",
    textBg: "#7B1F52",
  },
  {
    headline: "Timeless craft reimagined through a modern lens",
    sub: "Elegance, with an edge.",
    slug: "bewaji",
    cta: "Shop the look",
    image: "https://pottersdesign.com/wp-content/uploads/2024/06/Bewaji-700x700.jpg",
    imagePos: "right",
    textBg: "#1B5EA0",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[640px] overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 flex flex-col transition-opacity duration-700 lg:flex-row",
            i === active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0",
          )}
        >
          {/* Image — first in DOM so it appears on top on mobile */}
          <div
            className={cn(
              "relative min-h-0 flex-1 overflow-hidden lg:w-1/2 lg:flex-none",
              slide.imagePos === "right" && "lg:order-2",
            )}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Text panel — background sampled from the image's dominant colour */}
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col justify-center px-8 py-6 lg:flex-none lg:w-1/2 lg:px-14 lg:py-10 xl:px-20",
              slide.imagePos === "right" && "lg:order-1",
            )}
            style={{ background: slide.textBg }}
          >
            <span className="eyebrow">The Potter&rsquo;s Design Limited</span>
            <h1 className="mt-4 text-[1.75rem] font-semibold leading-[1.1] text-white sm:mt-6 sm:text-hero sm:leading-[1.02]">
              {slide.headline}
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/80 sm:mt-5 sm:text-base lg:text-lg">{slide.sub}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-10">
              <Link to={`/shop/${slide.slug}`} className="btn-accent">
                {slide.cta}
              </Link>
              <Link
                to="/about-us"
                className="inline-flex h-11 items-center justify-center rounded-card px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.4)" }}
              >
                Our story
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide dots — top over the image on mobile (clears the CTAs), bottom on desktop */}
      <div className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-2 lg:bottom-6 lg:top-auto">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-8 bg-gold" : "w-3 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
