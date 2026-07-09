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

      {/* Who We Are */}
      <AboutSection
        heading="Who We Are"
        tagline="At Potters Design, we don't just create clothing—we shape identity."
        image="/images/products/awero-1.jpg"
        imageAlt="Potters Design — Awero"
      >
        <p>
          Born from a desire to redefine modern fashion, Potters Design exists at the
          intersection of craft, culture, and contemporary expression. Every piece we
          create is a reflection of individuality&mdash;designed for those who
          don&rsquo;t follow trends, but set them.
        </p>
      </AboutSection>

      {/* Our Philosophy */}
      <AboutSection
        heading="Our Philosophy"
        tagline="Where heritage meets bold expression."
        image="/images/products/asiwaju-1.jpg"
        imageAlt="Potters Design — Asiwaju"
        reverse
      >
        <p>
          We believe fashion should tell a story&mdash;one that blends timeless inspiration
          with forward-thinking design. Much like the art of craftsmanship itself, true
          style is intentional, expressive, and unapologetically original.
        </p>
        <p>
          Our collections are built on this idea: to merge classic influences with modern
          silhouettes, creating pieces that feel both familiar and refreshingly new.
        </p>
      </AboutSection>

      {/* What We Do */}
      <AboutSection
        heading="What We Do"
        tagline="We design and curate fashion that empowers confidence."
        image="/images/products/omidan-1.webp"
        imageAlt="Potters Design — Omidan"
      >
        <p>
          From everyday essentials to statement pieces, every item is crafted with
          attention to:
        </p>
        <ul className="space-y-3">
          {[
            ["Detail", "precision in design and finishing"],
            ["Quality", "materials that stand the test of time"],
            ["Versatility", "pieces that move with your lifestyle"],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>
                <span className="font-semibold text-ink dark:text-bone">{title}:</span> {body}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-semibold text-ink dark:text-bone">Our Goal is Simple</p>
        <p>To make you look good, feel confident, and express yourself effortlessly.</p>
      </AboutSection>

      {/* Our Vision */}
      <AboutSection
        heading="Our Vision"
        tagline="To become a defining voice in modern fashion—where creativity, culture, and innovation collide."
        image="/images/products/bewaji-1.jpg"
        imageAlt="Potters Design — Bewaji"
        reverse
      >
        <p>
          We are building more than a brand. We are building a movement for individuals who
          see fashion as a form of identity and self-expression.
        </p>
      </AboutSection>

      {/* Why Potters Design */}
      <AboutSection
        heading="Why Potters Design?"
        tagline="Because style is personal."
        image="/images/products/asiwaju-2.jpg"
        imageAlt="Potters Design — Asiwaju"
      >
        <p>
          In a world of fast fashion and fleeting trends, Potters Design stands for
          intentional style&mdash;pieces designed with meaning, made to last, and created
          to stand out.
        </p>
      </AboutSection>

      {/* Our Promise */}
      <AboutSection
        heading="Our Promise"
        image="/images/products/morewa-1.jpg"
        imageAlt="Potters Design — Morewa"
        reverse
      >
        <p>We are committed to:</p>
        <ul className="space-y-3">
          {[
            "Delivering quality without compromise",
            "Staying authentic to our creative vision",
            "Continuously evolving with our community",
          ].map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {p}
            </li>
          ))}
        </ul>
        <p className="font-display text-lg italic text-ink/80 dark:text-bone/80">
          Because at Potters Design, it&rsquo;s not just about what you wear&mdash;it&rsquo;s
          about how you show up.
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
