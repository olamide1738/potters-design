export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-carbon py-28 text-bone">
        <div className="shell max-w-3xl">
          <span className="eyebrow text-gold">About us</span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            We don't just create clothing —<br />we shape identity.
          </h1>
          <p className="mt-6 text-lg text-bone/70">
            Born from a desire to redefine modern fashion, Potter's Design exists
            at the intersection of craft, culture, and contemporary expression.
            Every piece we create is a reflection of individuality — designed for
            those who don't follow trends, but set them.
          </p>
        </div>
      </section>

      {/* Who We Are + photos */}
      <section className="shell grid gap-12 py-20 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="eyebrow">Who we are</span>
          <h2 className="mt-4 text-3xl font-semibold">
            At Potter's Design, we shape identity.
          </h2>
          <p className="mt-5 text-ink/70 dark:text-bone/70 leading-relaxed">
            Born from a desire to redefine modern fashion, Potter's Design exists at the intersection of craft, culture, and contemporary expression. Every piece we create is a reflection of individuality — designed for those who don't follow trends, but set them.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://pottersdesign.com/wp-content/uploads/2025/12/Asiwaju-.--scaled.jpg"
            alt="Potter's Design — Asiwaju"
            className="aspect-[3/4] rounded-card object-cover"
          />
          <img
            src="https://pottersdesign.com/wp-content/uploads/2025/12/Asiwaju.-1-1-scaled-683x1024.jpg"
            alt="Potter's Design — Asiwaju detail"
            className="mt-8 aspect-[3/4] rounded-card object-cover"
          />
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-surface dark:bg-carbon/60 py-20">
        <div className="shell max-w-3xl">
          <span className="eyebrow">Our philosophy</span>
          <h2 className="mt-4 text-3xl font-semibold">
            Where heritage meets bold expression.
          </h2>
          <p className="mt-5 text-ink/70 dark:text-bone/70 leading-relaxed">
            We believe fashion should tell a story — one that blends timeless
            inspiration with forward-thinking design. Much like the art of
            craftsmanship itself, true style is intentional, expressive, and
            unapologetically original.
          </p>
          <p className="mt-4 text-ink/70 dark:text-bone/70 leading-relaxed">
            Our collections are built on this idea: to merge classic influences
            with modern silhouettes, creating pieces that feel both familiar and
            refreshingly new.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="shell py-20">
        <div className="max-w-3xl">
          <span className="eyebrow">What we do</span>
          <h2 className="mt-4 text-3xl font-semibold">
            We design and curate fashion that empowers confidence.
          </h2>
          <p className="mt-5 text-ink/70 dark:text-bone/70 leading-relaxed">
            From everyday essentials to statement pieces, every item is crafted
            with attention to:
          </p>
          <ul className="mt-6 space-y-4">
            {[
              {
                title: "Detail",
                body: "Precision in design and finishing — nothing leaves our studio without passing the eye.",
              },
              {
                title: "Quality",
                body: "Materials that stand the test of time. We source and work with fabrics that carry meaning.",
              },
              {
                title: "Versatility",
                body: "Pieces that move with your lifestyle — from cultural celebrations to boardrooms and beyond.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <p className="text-ink/70 dark:text-bone/70">
                  <span className="font-semibold text-ink dark:text-bone">
                    {item.title} —{" "}
                  </span>
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold">
            Our goal is simple: to make you look good, feel confident, and
            express yourself effortlessly.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-nota-indigo py-20 text-bone">
        <div className="shell max-w-3xl">
          <span className="eyebrow text-gold">Our vision</span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            To become a defining voice in modern fashion — where creativity,
            culture, and innovation collide.
          </h2>
          <p className="mt-5 text-bone/70 leading-relaxed">
            We are building more than a brand. We are building a movement for
            individuals who see fashion as a form of identity and self-expression.
          </p>
        </div>
      </section>

      {/* Why + Promise */}
      <section className="shell grid gap-12 py-20 md:grid-cols-2">
        <div>
          <span className="eyebrow">Why Potter's Design</span>
          <h2 className="mt-4 text-2xl font-semibold">
            Because style is personal.
          </h2>
          <p className="mt-4 text-ink/70 dark:text-bone/70 leading-relaxed">
            In a world of fast fashion and fleeting trends, Potter's Design
            stands for intentional style — pieces designed with meaning, made to
            last, and created to stand out.
          </p>
        </div>
        <div>
          <span className="eyebrow">Our promise</span>
          <h2 className="mt-4 text-2xl font-semibold">We are committed to:</h2>
          <ul className="mt-5 space-y-3">
            {[
              "Delivering quality without compromise",
              "Staying authentic to our creative vision",
              "Continuously evolving with our community",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink/70 dark:text-bone/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm italic text-ink/60 dark:text-bone/60">
            Because at Potter's Design, it's not just about what you wear — it's
            about how you show up.
          </p>
        </div>
      </section>
    </>
  );
}
