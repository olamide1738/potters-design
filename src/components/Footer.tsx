import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-carbon text-bone">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src="/logo.png" alt="Potter's Design" className="h-12 w-auto mix-blend-screen" />
          <p className="mt-3 max-w-xs text-sm text-bone/70">
            A daring fusion of heritage and forward-thinking design. Rooted in
            culture. Designed for what&rsquo;s next.
          </p>
          {/* Contact */}
          <div className="mt-5 space-y-1 text-sm text-bone/60">
            <a href="mailto:pottersdesignltd@gmail.com" className="block transition-colors hover:text-gold">
              pottersdesignltd@gmail.com
            </a>
            <a href="tel:+2347017377822" className="block transition-colors hover:text-gold">
              +234 701 737 7822
            </a>
          </div>

          {/* Social media */}
          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://www.instagram.com/thepottersdesign"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-bone/60 transition-colors hover:text-gold"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/PottersDesignRobes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-bone/60 transition-colors hover:text-gold"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.tiktok.com/@pottersdesignrtw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-bone/60 transition-colors hover:text-gold"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { label: "All products", to: "/shop" },
            { label: "Dresses", to: "/shop?category=Dresses" },
            { label: "Bubu", to: "/shop?category=Bubu" },
            { label: "New arrivals", to: "/shop?sort=newest" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { label: "About us", to: "/about-us" },
            { label: "Terms & Conditions", to: "/terms" },
            { label: "FAQs", to: "/faq" },
            { label: "Wishlist", to: "/wishlist" },
            { label: "Cart", to: "/cart" },
          ]}
        />

        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider">
            Join the culture
          </h4>
          <p className="mt-3 text-sm text-bone/70">
            Get first access to drops and stories.
          </p>
          <form
            className="mt-4 flex"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full rounded-l-card border border-bone/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone/50 focus:border-gold focus:outline-none"
            />
            <button className="rounded-r-card bg-gold px-4 text-sm font-semibold text-ink transition-colors hover:bg-[#fda437] hover:text-white">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-bone/15">
        <div className="shell flex flex-col items-center justify-between gap-2 py-6 text-xs text-bone/60 sm:flex-row">
          <p>© {new Date().getFullYear()} The Potter&rsquo;s Design Limited. All rights reserved.</p>
          <p>Ships worldwide · Naira pricing</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="font-body text-sm font-semibold uppercase tracking-wider">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-bone/70 transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}
