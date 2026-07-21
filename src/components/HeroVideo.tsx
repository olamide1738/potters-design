import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/format";

interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const DESKTOP_SLIDES: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Contemporary Heritage",
    title: "Afrocentric Luxury, Redefined.",
    subtitle: "Discover unique hand-crafted styles and contemporary cuts rooted in vibrant African traditions.",
    image: "/hero/hero-slide-1.png",
    ctaText: "Shop 2-Pieces & Pants",
    ctaLink: "/shop?category=2-pieces",
    secondaryCtaText: "Explore All",
    secondaryCtaLink: "/shop",
  },
  {
    id: 2,
    eyebrow: "The Signature Collection",
    title: "Reimagining African Elegance.",
    subtitle: "Meticulously crafted corsetry, structural silhouettes, and indigenous textile artistry.",
    image: "/hero/hero-slide-2.png",
    ctaText: "Explore Dresses",
    ctaLink: "/shop?category=Dresses",
    secondaryCtaText: "View Catalog",
    secondaryCtaLink: "/shop",
  },
  {
    id: 3,
    eyebrow: "Timeless Tailoring",
    title: "Wear the Culture with Pride.",
    subtitle: "Every garment tells an enduring story of African beauty, strength, and modern sophistication.",
    image: "/hero/hero-slide-3.png",
    ctaText: "Shop New Arrivals",
    ctaLink: "/shop",
    secondaryCtaText: "Bubu Collection",
    secondaryCtaLink: "/shop?category=Bubu",
  },
];

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Force autoplay for mobile background video loop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser security policy.", err);
      });
    }
  }, []);

  // Desktop slider auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % DESKTOP_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % DESKTOP_SLIDES.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + DESKTOP_SLIDES.length) % DESKTOP_SLIDES.length);

  return (
    <section className="relative w-full bg-ink overflow-hidden">
      {/* ========================================================================= */}
      {/* MOBILE HERO (Video Background) — visible on < md screens                   */}
      {/* ========================================================================= */}
      <div className="relative w-full md:hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
          src="https://res.cloudinary.com/dklslzrkg/video/upload/IMG_8448_2_jowcy6.mp4"
        />

        {/* Mobile dark overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Mobile Hero Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="shell text-center text-bone px-4">
            <div className="mx-auto max-w-3xl">
              <span className="eyebrow tracking-[0.2em] text-gold uppercase text-xs">
                Wear the Culture
              </span>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl tracking-wide text-bone uppercase font-medium">
                Afrocentric Luxury, <br />
                Redefined.
              </h1>
              <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm tracking-wide leading-relaxed text-bone/80 hidden xs:block">
                Discover unique hand-crafted styles and contemporary cuts rooted in vibrant heritage and premium tailoring.
              </p>

              {/* Category CTA Buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-4">
                <Link
                  to="/shop?category=Dresses"
                  className="btn-accent min-w-[110px] px-5 py-3 text-xs uppercase tracking-widest transition-transform hover:scale-[1.03]"
                >
                  Dresses
                </Link>
                <Link
                  to="/shop?category=2-pieces"
                  className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[110px] px-5 py-3 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
                >
                  2-Pieces
                </Link>
                <Link
                  to="/shop?category=Bubu"
                  className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[110px] px-5 py-3 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
                >
                  Bubu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP & TABLET HERO SLIDER — visible on >= md screens                   */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block relative w-full h-[80vh] min-h-[580px] max-h-[850px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Images */}
        {DESKTOP_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center"
              />

              {/* Luxury Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />

              {/* Slide Content */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="shell px-8 lg:px-16 w-full">
                  <div className="max-w-2xl text-bone">
                    <span className="eyebrow tracking-[0.25em] text-gold uppercase text-xs lg:text-sm font-semibold block mb-4">
                      {slide.eyebrow}
                    </span>

                    <h1 className="font-display text-4xl lg:text-6xl lg:leading-[1.1] tracking-wide text-bone uppercase font-medium">
                      {slide.title}
                    </h1>

                    <p className="mt-5 text-sm lg:text-base tracking-wide leading-relaxed text-bone/85 max-w-xl">
                      {slide.subtitle}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center gap-4">
                      <Link
                        to={slide.ctaLink}
                        className="btn-accent px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-transform hover:scale-[1.03] shadow-lg"
                      >
                        {slide.ctaText}
                      </Link>

                      {slide.secondaryCtaText && (
                        <Link
                          to={slide.secondaryCtaLink || "/shop"}
                          className="border border-bone/80 bg-black/20 backdrop-blur-sm text-bone hover:bg-bone hover:text-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
                        >
                          {slide.secondaryCtaText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 place-items-center rounded-full border border-bone/30 bg-black/30 backdrop-blur-md text-bone transition-all hover:bg-gold hover:border-gold hover:text-ink hover:scale-110"
        >
          <ChevronLeft />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 place-items-center rounded-full border border-bone/30 bg-black/30 backdrop-blur-md text-bone transition-all hover:bg-gold hover:border-gold hover:text-ink hover:scale-110"
        >
          <ChevronRight />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {DESKTOP_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === activeSlide
                  ? "w-8 bg-gold"
                  : "w-2.5 bg-bone/40 hover:bg-bone/80"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
