import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force autoplay on load to bypass browser autoplay blocks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser security policy. Playing on user interaction.", err);
      });
    }
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-ink lg:h-[88vh] lg:min-h-[600px]">
      {/* HTML5 background video loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        src="https://res.cloudinary.com/dklslzrkg/video/upload/IMG_8448_2_jowcy6.mp4"
      />
      
      {/* Fallback overlay block */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Hero content layer */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="shell text-center text-bone px-4">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow tracking-[0.2em] text-gold uppercase text-xs">
              Wear the Culture
            </span>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-[4rem] lg:leading-[1.1] tracking-wide text-bone uppercase font-medium">
              Afrocentric Luxury, <br />
              Redefined.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm tracking-wide leading-relaxed text-bone/80 hidden xs:block">
              Discover unique hand-crafted styles and contemporary cuts rooted in vibrant heritage and premium tailoring.
            </p>

            {/* Category CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                to="/shop?category=Dresses"
                className="btn-accent min-w-[120px] sm:min-w-[140px] px-6 py-3.5 text-xs uppercase tracking-widest transition-transform hover:scale-[1.03]"
              >
                Dresses
              </Link>
              <Link
                to="/shop?category=2-pieces"
                className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[120px] sm:min-w-[140px] px-6 py-3.5 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
              >
                2-Pieces
              </Link>
              <Link
                to="/shop?category=Bubu"
                className="border border-bone bg-transparent text-bone hover:bg-bone hover:text-ink min-w-[120px] sm:min-w-[140px] px-6 py-3.5 text-xs uppercase tracking-widest transition-all hover:scale-[1.03] rounded-card"
              >
                Bubu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
