/**
 * Header Component — Tech-Forward Minimalism
 * Design: Clean navigation with minimal visual hierarchy
 * Spacing: Generous padding, clear typography contrast
 */

import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { language, getLocalizedPath } = useLanguage();
  const t = translations[language];
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(getLocalizedPath("/"));
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleSignup = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container flex items-center justify-between py-6">
        <Link href={getLocalizedPath("/")} className="flex items-center gap-2">
          <img src="/images/logo-kadeh.png" alt="Kadeh" className="h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={getLocalizedPath("/")} className="text-sm text-foreground hover:text-primary transition-colors">
            {language === "pt" ? "Home" : "Home"}
          </Link>
          <Link href={getLocalizedPath("/picking")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.picking}
          </Link>
          <Link href={getLocalizedPath("/smart-layout")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.smartLayout}
          </Link>
          <Link href={getLocalizedPath("/data-intelligence")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.intelligence}
          </Link>
          <Link href={getLocalizedPath("/how-it-works")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.howItWorks}
          </Link>
          <Link href={getLocalizedPath("/media")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.media}
          </Link>
          <Link href={getLocalizedPath("/video")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.video}
          </Link>
          <Link href={getLocalizedPath("/faq")} className="text-sm text-foreground hover:text-primary transition-colors">
            {t.header.faq}
          </Link>
          <Link href={getLocalizedPath("/kadeh-ads")} className="text-sm text-foreground hover:text-primary transition-colors font-semibold text-blue-600">
            Kadeh Ads
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">{user.email || user.name || "Usuário"}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pt" ? "Sair" : "Logout"}</span>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
              >
                {language === "pt" ? "Login" : "Login"}
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleSignup}
              >
                {language === "pt" ? "Cadastro" : "Sign Up"}
              </Button>
            </div>
          )}

          <Link href={getLocalizedPath("/contact")} className="hidden sm:block">
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm">
              {t.header.requestDemo}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container py-4 space-y-3">
            <Link href={getLocalizedPath("/#solucoes")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.solutions}
            </Link>
            <Link href={getLocalizedPath("/picking")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.picking}
            </Link>
            <Link href={getLocalizedPath("/smart-layout")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.smartLayout}
            </Link>
            <Link href={getLocalizedPath("/data-intelligence")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.intelligence}
            </Link>
            <Link href={getLocalizedPath("/how-it-works")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.howItWorks}
            </Link>
            <Link href={getLocalizedPath("/media")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.media}
            </Link>
            <Link href={getLocalizedPath("/video")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.video}
            </Link>
            <Link href={getLocalizedPath("/faq")} className="block text-sm text-foreground hover:text-primary transition-colors py-2">
              {t.header.faq}
            </Link>
            <Link href={getLocalizedPath("/kadeh-ads")} className="block text-sm text-foreground hover:text-primary transition-colors font-semibold text-blue-600 py-2">
              Kadeh Ads
            </Link>

            <div className="border-t border-border pt-4 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">{user.email || user.name || "Usuário"}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {language === "pt" ? "Sair" : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogin}
                    className="w-full"
                  >
                    {language === "pt" ? "Login" : "Login"}
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={handleSignup}
                  >
                    {language === "pt" ? "Cadastro" : "Sign Up"}
                  </Button>
                </>
              )}
              <Link href={getLocalizedPath("/contact")} className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm">
                  {t.header.requestDemo}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
