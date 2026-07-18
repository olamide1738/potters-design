import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/format";

export function AboutPage() {
  return (
    <>
      {/* Page header + breadcrumb (centered) */}
      <section className="border-b border-mist dark:border-edge">
        <div className="shell flex flex-col items-center py-12 text-center lg:py-16">
          <nav className="text-sm text-ink/50 dark:text-bone/50">
            <Link to="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink dark:text-bone">About Us</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">About Us</h1>
          <p className="mt-4 max-w-xl text-ink/60 dark:text-bone/60">
            Reimagining today&rsquo;s fashion from timeless heritage.
          </p>
          <span className="mt-6 block h-1 w-14 rounded-full bg-gold" />
        </div>
      </section>

      {/* What We Do */}
      <AboutSection
        heading="What We Do"
        tagline="Potter's Design is a premium fashion house from Nigeria creating contemporary fashion that reimagines African heritage through the language of modern design."
        image="/images/products/omidan-1.webp"
        imageAlt="Potters Design — Omidan"
      >
        <p>
          We exist to celebrate the beauty, strength, creativity, and excellence that have always existed within Africa, revealing Africa's enduring story through exceptional craftsmanship, thoughtful design, and timeless elegance.
        </p>
        <p>
          Inspired by our rich artistic traditions, indigenous textiles, and cultural legacy, we create collections that honour the past while shaping the future of African fashion.
        </p>
        <p>
          Every garment is meticulously crafted for the modern woman, one who values authenticity, sophistication, and enduring style.
        </p>
        <p className="font-semibold text-ink dark:text-bone">
          Our work is not simply inspired by Africa. It is designed to define the future of African fashion.
        </p>
      </AboutSection>

      {/* Who We Are */}
      <AboutSection
        heading="Who We Are"
        tagline="We are custodians of heritage."
        image="/images/products/awero-1.jpg"
        imageAlt="Potters Design — Awero"
        reverse
      >
        <ul className="space-y-3">
          {[
            "We are craftsmen.",
            "We are custodians of heritage.",
            "We are storytellers through design.",
            "We are committed to excellence without compromise.",
            "We are proudly African and confidently global.",
            "We are Potter's Design."
          ].map((line, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span className={idx === 5 ? "font-semibold text-ink dark:text-bone" : ""}>
                {line}
              </span>
            </li>
          ))}
        </ul>
      </AboutSection>

      {/* Our Vision */}
      <AboutSection
        heading="Our Vision"
        tagline="Born in Africa, recognized globally."
        image="/images/products/bewaji-1.jpg"
        imageAlt="Potters Design — Bewaji"
      >
        <p>
          To build one of the world's most respected fashion brand, born in Africa and recognised globally for exceptional craftsmanship, timeless design, and a new expression of African excellence.
        </p>
      </AboutSection>

      {/* Our Promise */}
      <AboutSection
        heading="Our Promise"
        tagline="Excellence is the foundation of everything we create."
        image="/images/products/morewa-1.jpg"
        imageAlt="Potters Design — Morewa"
        reverse
      >
        <p>
          Every garment is thoughtfully conceived, meticulously crafted, and finished to the highest standard. From the first sketch to the final stitch, every detail reflects our unwavering pursuit of quality, beauty, and precision.
        </p>
        <p>
          We believe true luxury is defined not only by aesthetics but by craftsmanship, authenticity, and purpose.
        </p>
        <p>
          Our work challenges outdated perceptions of African fashion and presents a different reality, one where African design is celebrated for its innovation, sophistication, and world-class quality.
        </p>
        <p className="font-display text-lg italic text-ink/80 dark:text-bone/80 mt-6">
          We do not seek a place on the global stage. We belong there.
        </p>
      </AboutSection>
    </>
  );
}

interface AboutSectionProps {
  heading: string;
  tagline?: string;
  image: string;
  imageAlt: string;
  /** Place the image on the left (text on the right) on desktop */
  reverse?: boolean;
  children: ReactNode;
}

function AboutSection({ heading, tagline, image, imageAlt, reverse, children }: AboutSectionProps) {
  return (
    <section className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <Reveal className={cn("flex flex-col justify-center", reverse && "lg:order-2")}>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{heading}</h2>
        <span className="mt-4 block h-1 w-12 rounded-full bg-gold" />
        {tagline && (
          <p className="mt-5 font-display text-xl text-ink/90 dark:text-bone/90">{tagline}</p>
        )}
        <div className="mt-4 space-y-4 leading-relaxed text-ink/70 dark:text-bone/70">
          {children}
        </div>
      </Reveal>

      <Reveal delay={100} className={cn(reverse && "lg:order-1")}>
        <img
          src={image}
          alt={imageAlt}
          className="aspect-[4/5] w-full rounded-card object-cover object-top shadow-[0_10px_30px_-6px_rgba(17,17,17,0.18)] ring-1 ring-black/[0.06] dark:shadow-none dark:ring-white/10"
        />
      </Reveal>
    </section>
  );
}
