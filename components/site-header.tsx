import { Instagram } from "lucide-react";
import Link from "next/link";
import { LOCALES, Locale } from "@/lib/content-types";

type SiteHeaderProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

export function SiteHeader({ locale, onLocaleChange }: SiteHeaderProps) {
  return (
    <header className="site-top">
      <div className="shell nav">
        <Link className="brand" href="/">
          PMag
        </Link>
        <nav className="nav-links" aria-label="Navegacion principal">
          <a
            aria-label="Instagram de PMag"
            className="nav-instagram"
            href="https://www.instagram.com/pbravofr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Instagram size={17} />
          </a>
          <div className="locale-switcher" aria-label="Idioma">
            {LOCALES.map((item) => (
              <button
                aria-pressed={locale === item.code}
                key={item.code}
                onClick={() => onLocaleChange?.(item.code)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
