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

export default function Header() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo-kadeh.png" alt="Kadeh" className="h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#solucoes" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.solutions}
          </Link>
          <Link href="/picking" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.picking}
          </Link>
          <Link href="/smart-layout" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.smartLayout}
          </Link>
          <Link href="/data-intelligence" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.intelligence}
          </Link>
          <Link href="/how-it-works" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.howItWorks}
          </Link>
          <Link href="/media" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.media}
          </Link>
          <Link href="/video" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.video}
          </Link>
          <Link href="/#faq" className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.faq}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/contact">
            <Button variant="outline" className="hidden sm:inline-flex text-sm">
              {t.header.talkToSpecialist}
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm">
              {t.header.requestDemo}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
