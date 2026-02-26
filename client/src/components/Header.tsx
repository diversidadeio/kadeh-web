/**
 * Header Component — Tech-Forward Minimalism
 * Design: Clean navigation with minimal visual hierarchy
 * Spacing: Generous padding, clear typography contrast
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { language, getLocalizedPath } = useLanguage();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#solucoes", label: t.header.solutions },
    { href: "/picking", label: t.header.picking },
    { href: "/smart-layout", label: t.header.smartLayout },
    { href: "/data-intelligence", label: t.header.intelligence },
    { href: "/how-it-works", label: t.header.howItWorks },
    { href: "/media", label: t.header.media },
    { href: "/video", label: t.header.video },
    { href: "/faq", label: t.header.faq },
    { href: "/kadeh-ads-campaign", label: "Kadeh Ads", special: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container flex items-center justify-between py-6">
        <Link href={getLocalizedPath("/")} className="flex items-center gap-2">
          <img src="/images/logo-kadeh.png" alt="Kadeh" className="h-14 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={getLocalizedPath(link.href)}
              className={`text-sm transition-colors ${
                link.special
                  ? "text-foreground hover:text-primary font-semibold text-blue-600"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href={getLocalizedPath("/contact")}>
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm hidden sm:inline-flex">
              {t.header.requestDemo}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container py-4 space-y-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedPath(link.href)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  link.special
                    ? "bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100"
                    : "text-foreground hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href={getLocalizedPath("/contact")} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
                {t.header.requestDemo}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
