import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function PDFModal({ isOpen, pdfUrl, title, onClose }: PDFModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pdfUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Erro ao carregar PDF. Tente novamente.');
    setIsLoading(false);
  };

  if (!isOpen || !pdfUrl) return null;

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

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-muted-foreground">Carregando PDF...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-red-600">{error}</div>
            </div>
          )}
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            style={{ border: 'none', minHeight: '600px' }}
            title="PDF Viewer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-4 justify-end">
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
