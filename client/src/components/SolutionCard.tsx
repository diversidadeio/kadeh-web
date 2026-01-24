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
  externalUrl?: string;
  onPresentationClick?: (url: string) => void;
}

export default function SolutionCard({
  title,
  description,
  icon,
  presentationUrl,
  externalUrl,
  onPresentationClick,
}: SolutionCardProps) {
  const handleClick = () => {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    } else if (presentationUrl && onPresentationClick) {
      onPresentationClick(presentationUrl);
    }
  };

  return (
    <div 
      className={`group p-8 border border-border rounded-md hover:border-primary transition-colors duration-300 bg-white hover:bg-card ${
        presentationUrl || externalUrl ? 'cursor-pointer' : ''
      }`}
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
    </div>
  );
}
