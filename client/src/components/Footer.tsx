/**
 * Footer Component — Tech-Forward Minimalism
 * Design: Minimal footer with clear information hierarchy
 * Spacing: Generous padding, clear typography
 */

import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Footer() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const t = translations[language].footer;

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <footer className="bg-white border-t border-border py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg text-foreground">{t.brand}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.tagline}
            </p>
          </div>

          {/* Soluções / Solutions */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.solutions}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${language}/#solucoes`} className="hover:text-primary transition-colors">{t.retail}</Link></li>
              <li><Link href={`/${language}/#solucoes`} className="hover:text-primary transition-colors">{t.shopping}</Link></li>
              <li><Link href={`/${language}/#solucoes`} className="hover:text-primary transition-colors">{t.events}</Link></li>
              <li><Link href={`/${language}/#solucoes`} className="hover:text-primary transition-colors">{t.healthcare}</Link></li>
              <li><Link href={`/${language}/#solucoes`} className="hover:text-primary transition-colors">{t.localization}</Link></li>
              <li><Link href={`/${language}/varejo`} className="hover:text-primary transition-colors">Varejo</Link></li>
              <li><Link href={`/${language}/picking`} className="hover:text-primary transition-colors">{t.picking}</Link></li>
              <li><Link href={`/${language}/smart-layout`} className="hover:text-primary transition-colors">{t.smartLayout}</Link></li>
              <li><Link href={`/${language}/data-intelligence`} className="hover:text-primary transition-colors">{t.intelligence}</Link></li>
            </ul>
          </div>

          {/* Empresa / Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.company}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${language}/#como-funciona`} className="hover:text-primary transition-colors">{t.howItWorks}</Link></li>
              <li><Link href={`/${language}/#faq`} className="hover:text-primary transition-colors">{t.faq}</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.contact}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.legal}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t.privacy}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.terms}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.lgpd}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4">
            <p>{t.technology}</p>
            <Button
              onClick={handleGoHome}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
