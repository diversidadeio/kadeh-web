/**
 * CTASection Component — Tech-Forward Minimalism
 * Design: Centered content with strong visual hierarchy
 * Spacing: Generous padding, clear typography
 */

import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryCTA: string;
  secondaryCTA?: string;
  backgroundColor?: string;
}

export default function CTASection({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundColor = "bg-white",
}: CTASectionProps) {
  return (
    <section className={`${backgroundColor} py-20 lg:py-32 border-t border-border`}>
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
            {primaryCTA}
          </Button>
          {secondaryCTA && (
            <Button size="lg" variant="outline">
              {secondaryCTA}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
