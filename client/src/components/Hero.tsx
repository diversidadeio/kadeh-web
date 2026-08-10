/**
 * Hero Component — Tech-Forward Minimalism
 * Design: Large H1, generous spacing, image on right side
 * Layout: Asymmetric with 60/40 split
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  imageUrl: string;
  imageAlt: string;
  primaryLink?: string;
  secondaryLink?: string;
}

export default function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  imageUrl,
  imageAlt,
  primaryLink = "/contact",
  secondaryLink,
}: HeroProps) {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Microproofs */}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground border-t border-border pt-6">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                IA de recomendações
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Navegação precisa
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Dashboard on-time
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Integrações via API
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                LGPD-ready
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={primaryLink}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  {primaryCTA}
                </Button>
              </Link>
              <Link href={secondaryLink || "/contact"}>
                <Button size="lg" variant="outline">
                  {secondaryCTA}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-[520px] w-auto object-contain drop-shadow-2xl rounded-[2.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
