/**
 * Header Component — Tech-Forward Minimalism
 * Design: Clean navigation with minimal visual hierarchy
 * Spacing: Generous padding, clear typography contrast
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <nav className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo-kadeh.png" alt="Kadeh" className="h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/picking" className="text-sm text-foreground hover:text-primary transition-colors">
            Picking
          </Link>
          <Link href="/smart-layout" className="text-sm text-foreground hover:text-primary transition-colors">
            Smart Layout
          </Link>
          <Link href="/data-intelligence" className="text-sm text-foreground hover:text-primary transition-colors">
            Intelligence
          </Link>
          <Link href="/how-it-works" className="text-sm text-foreground hover:text-primary transition-colors">
            Como Funciona
          </Link>
          <Link href="/#faq" className="text-sm text-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/contact">
            <Button variant="outline" className="hidden sm:inline-flex text-sm">
              Falar com especialista
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-white text-sm">
              Solicitar demonstração
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
