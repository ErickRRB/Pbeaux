"use client";

import { Instagram, Mail, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LOCALES, Locale } from "@/lib/content-types";

type SiteHeaderProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

export function SiteHeader({ locale, onLocaleChange }: SiteHeaderProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="site-top">
      <div className="shell nav">
        <Link className="brand" href="/">
          PMag
        </Link>
        <nav className="nav-links" aria-label="Navegacion principal">
          <button
            aria-label="Contacto por email"
            className="nav-contact"
            onClick={() => setContactOpen(true)}
            type="button"
          >
            <Mail size={19} />
          </button>
          <a
            aria-label="Instagram de PMag"
            className="nav-instagram"
            href="https://www.instagram.com/pbravofr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Instagram size={20} />
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
      {contactOpen ? (
        <div
          className="contact-popover-backdrop"
          onClick={() => setContactOpen(false)}
        >
          <span className="contact-popover">
            <span className="contact-close" aria-hidden="true">
              <X size={15} />
            </span>
            <strong>Contacto</strong>
            <span>
              Para consultas, colaboraciones o prensa, escribinos a{" "}
              <a href="mailto:bravopat@gmail.com">bravopat@gmail.com</a>.
            </span>
          </span>
        </div>
      ) : null}
    </header>
  );
}
