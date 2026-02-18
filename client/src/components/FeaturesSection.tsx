/**
 * FeaturesSection Component — Tech-Forward Minimalism
 * Design: Grid layout with cards, minimal styling
 * Spacing: Generous vertical padding between sections
 */

import SolutionCard from "./SolutionCard";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
  presentationUrl?: string;
}

interface FeaturesSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  onPresentationClick?: (url: string) => void;
}

export default function FeaturesSection({
  id,
  title,
  subtitle,
  features,
  columns = 3,
  onPresentationClick,
}: FeaturesSectionProps) {
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section id={id} className="bg-white py-20 lg:py-32 border-t border-border">
      <div className="container">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${gridClass[columns]} gap-8`}>
          {features.map((feature, idx) => (
            <SolutionCard
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              presentationUrl={feature.presentationUrl}
              onPresentationClick={onPresentationClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
