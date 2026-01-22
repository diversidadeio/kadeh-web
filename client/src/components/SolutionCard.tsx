/**
 * SolutionCard Component — Tech-Forward Minimalism
 * Design: Minimal card with border, no shadow, clean typography
 * Interaction: Subtle hover effect with color change
 */

interface SolutionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  presentationUrl?: string;
  onPresentationClick?: () => void;
}

export default function SolutionCard({
  title,
  description,
  icon,
  presentationUrl,
  onPresentationClick,
}: SolutionCardProps) {
  const handleClick = () => {
    if (presentationUrl && onPresentationClick) {
      onPresentationClick();
    }
  };

  return (
    <div 
      className={`group p-8 border border-border rounded-md hover:border-primary transition-colors duration-300 bg-white hover:bg-card ${presentationUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {icon && (
        <div className="mb-6 text-primary text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
      {presentationUrl && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-primary font-medium group-hover:underline">
            Ver apresentação →
          </p>
        </div>
      )}
    </div>
  );
}
