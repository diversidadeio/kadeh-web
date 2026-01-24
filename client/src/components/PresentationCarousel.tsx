import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PresentationCarouselProps {
  isOpen: boolean;
  presentationName: string;
  title: string;
  onClose: () => void;
}

export default function PresentationCarousel({
  isOpen,
  presentationName,
  title,
  onClose,
}: PresentationCarouselProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate image paths for the presentation
  const getImagePath = (page: number) => {
    return `/presentation-images/${presentationName}/page-${String(page).padStart(3, '0')}.png`;
  };

  useEffect(() => {
    if (isOpen && presentationName) {
      setCurrentPage(1);
      setIsLoading(true);
      
      // Determine total pages based on presentation name
      const pageCount: Record<string, number> = {
        'kadeh-varejo': 28,
        'kadeh-shopping': 13,
        'kadeh-saude': 8,
        'kadeh-localiza': 14,
      };
      
      const pages = pageCount[presentationName] || 0;
      setTotalPages(pages);
      setIsLoading(false);
    }
  }, [isOpen, presentationName]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImageError = () => {
    console.error(`Failed to load image for page ${currentPage}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center justify-center p-4 relative">
          {isLoading && (
            <div className="text-center text-muted-foreground">Carregando apresentação...</div>
          )}
          
          {!isLoading && totalPages > 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                key={currentPage}
                src={getImagePath(currentPage)}
                alt={`Página ${currentPage}`}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="p-6 border-t border-border flex gap-4 justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1 || isLoading}
              className="p-2 hover:bg-secondary rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 text-muted-foreground text-sm font-medium min-w-[120px] text-center">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages || isLoading}
              className="p-2 hover:bg-secondary rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Próxima página"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
