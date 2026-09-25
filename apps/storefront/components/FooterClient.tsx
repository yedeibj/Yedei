"use client";

import { useState } from "react";
import Link from "next/link";
import InstallAppButtons from "./InstallAppButtons";

type FooterCategory = {
  id: string;
  label: string;
  slug: string;
  children: { id: string; label: string; slug: string }[];
};

type InfoLink = { label: string; href: string };

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/yedeivetema?stkn=NWJ2bWMzMWVpMzhr&utm_source=qr", Icon: InstagramIcon, color: "#E4405F" },
  { label: "Facebook", href: "https://www.facebook.com/share/14rrGCbe7wv/?mibextid=wwXIfr", Icon: FacebookIcon, color: "#1877F2" },
  { label: "TikTok", href: "https://www.tiktok.com/@yedei5?_r=1&_t=ZS-9A00duUnmbv", Icon: TikTokIcon, color: "#25F4EE" },
  { label: "YouTube", href: "https://www.youtube.com/@YEDEI-m3u", Icon: YouTubeIcon, color: "#FF0000" },
  { label: "Twitter / X", href: "https://x.com/yedei", Icon: XIcon, color: "#FFFFFF" },
];

const socialIconClass = "flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 transition-transform hover:scale-110";

export default function FooterClient({
  categories,
  infoLinks,
}: {
  categories: FooterCategory[];
  infoLinks: InfoLink[];
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-container px-6 py-16 md:px-10">
        {/* Logo + description */}
        <div className="mb-12 flex flex-col gap-6 border-b border-paper/15 pb-12 md:flex-row md:items-center md:justify-between">
          <img src="/logo-white.png" alt="YEDEI" className="h-12 w-auto self-start" />
          <p className="max-w-sm text-sm text-paper/60">
            Vêtements pour hommes, femmes, enfants et bébés. Conçus avec soin,
            pensés pour durer.
          </p>
        </div>

        {/* Catégories — accordéon mobile / colonnes desktop */}
        <div className="grid gap-8 md:grid-cols-4">
          {categories.map((category) => {
            const isOpen = openSlug === category.slug;
            return (
              <div
                key={category.slug}
                className="border-b border-paper/15 pb-4 md:border-none md:pb-0"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-left md:pointer-events-none md:py-0"
                  onClick={() => setOpenSlug(isOpen ? null : category.slug)}
                  aria-expanded={isOpen}
                >
                  <Link
                    href={`/collections/${category.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-display text-lg italic hover:underline"
                  >
                    {category.label}
                  </Link>
                  {category.children.length > 0 && (
                    <span className="md:hidden" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  )}
                </button>
                {category.children.length > 0 && (
                  <ul
                    className={`flex flex-col gap-2 overflow-hidden text-sm text-paper/60 transition-all md:mt-4 md:max-h-none md:opacity-100 ${
                      isOpen ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
                    }`}
                  >
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/collections/${child.slug}`} className="hover:text-paper">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Pages légales — une ligne sur desktop, accordéon sur mobile */}
        {infoLinks.length > 0 && (
          <div className="mt-12 border-t border-paper/15 pt-8">
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setLegalOpen((open) => !open)}
                className="flex w-full items-center justify-between py-2 text-left"
                aria-expanded={legalOpen}
              >
                <span className="font-display text-lg italic">Informations légales</span>
                <span aria-hidden="true">{legalOpen ? "−" : "+"}</span>
              </button>
              <ul
                className={`flex flex-col gap-2 overflow-hidden text-sm text-paper/70 transition-all ${
                  legalOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="hidden flex-wrap items-center gap-x-6 gap-y-2 text-sm text-paper/70 md:flex">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Téléchargement app + réseaux sociaux, côte à côte sur desktop */}
        <div className="mt-8 flex flex-col gap-8 border-t border-paper/15 pt-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-display text-xl italic">
              Télécharger l&apos;application YEDEI
            </h3>
            <p className="mt-2 max-w-md text-sm text-paper/60">
              Installez YEDEI directement depuis le site, sans passer par une
              boutique d&apos;applications.
            </p>
            <InstallAppButtons />
          </div>

          <div className="flex items-center gap-4 md:justify-end">
            {socialLinks.map((social) => {
              const Icon = social.Icon;
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} title={social.label} className={socialIconClass}>
                  <Icon color={social.color} />
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-12 text-xs text-paper/40">
          © {new Date().getFullYear()} YEDEI. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function FacebookIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function TikTokIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.6 5.2c.7 1.2 1.9 2.1 3.4 2.3v2.6a6 6 0 0 1-3.4-1.1v6.1a5.3 5.3 0 1 1-4.6-5.3v2.7a2.6 2.6 0 1 0 1.8 2.5V2h2.8c0 .1 0 .2 0 .3.1 1 .5 1.9 1 2.9Z"
        fill={color}
      />
      <path
        d="M16.6 5.2c.7 1.2 1.9 2.1 3.4 2.3v2.6a6 6 0 0 1-3.4-1.1v6.1a5.3 5.3 0 1 1-4.6-5.3v2.7a2.6 2.6 0 1 0 1.8 2.5V2h2.8c0 .1 0 .2 0 .3.1 1 .5 1.9 1 2.9Z"
        fill="#FF0050"
        opacity="0.7"
      />
    </svg>
  );
}

function YouTubeIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
      <path d="M23 12s0-3.5-.45-5.15a2.9 2.9 0 0 0-2-2.05C18.9 4.3 12 4.3 12 4.3s-6.9 0-8.55.5a2.9 2.9 0 0 0-2 2.05C1 8.5 1 12 1 12s0 3.5.45 5.15a2.9 2.9 0 0 0 2 2.05c1.65.5 8.55.5 8.55.5s6.9 0 8.55-.5a2.9 2.9 0 0 0 2-2.05C23 15.5 23 12 23 12Z" />
      <path d="M9.8 15.3V8.7L15.6 12l-5.8 3.3Z" fill="#181715" />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.6 22H1.5l8.2-9.3L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.3l12.4 16Z" />
    </svg>
  );
}
