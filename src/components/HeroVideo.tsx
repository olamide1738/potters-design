import { Link } from "react-router-dom";

export function HeroVideo() {
  return (
    <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-ink lg:h-[88vh] lg:min-h-[600px]">
      {/* HTML5 background video loop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        src="https://res.cloudinary.com/dklslzrkg/video/upload/IMG_8448_3-2_cuounq.mp4"
      />
      
      {/* Fallback overlay block */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero content layer */}
      <div className="relative z-10 flex h-full items-center">
        <div className="shell text-center text-bone">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow tracking-[0.25em] text-gold uppercase animate-fade-in">
              Wear the Culture
            </span>
            <h1 className="mt-4 font-display text-[2.25rem] font-normal leading-[1.1] tracking-wide text-bone sm:text-5xl lg:text-[4rem] lg:leading-[1.05] uppercase">
              Afrocentric Luxury, <br />
              Redefined.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-sm text-bone/85 sm:text-base tracking-wide leading-relaxed">
              Discover unique hand-crafted styles and contemporary cuts rooted in vibrant heritage and premium tailoring.
            </p>

            {/* Category CTA Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/shop?category=Dresses"
                className="btn-accent min-w-[140px] px-6 py-3 text-xs uppercase tracking-widest transition-transform hover:scale-[1.03]"
              >
                Shop Dresses
              </Link>
              <Link
                to="/shop?category=2-pieces"
                className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[140px] px-6 py-3 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
              >
                Shop Two-Pieces
              </Link>
              <Link
                to="/shop?category=Bubu"
                className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[140px] px-6 py-3 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
              >
                Shop Bubu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Premium smooth scroll indicator at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone/60 text-[10px] uppercase tracking-[0.2em] pointer-events-none hidden sm:flex">
        <span>Scroll Down</span>
        <span className="h-6 w-[1.5px] bg-gradient-to-b from-bone/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
