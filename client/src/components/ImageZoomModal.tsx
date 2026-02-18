import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

export default function ImageZoomModal({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 1));
  const handleReset = () => setScale(1);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/10">
          <h3 className="text-lg font-semibold text-foreground">{imageAlt}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50">
          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 p-4 border-t border-border bg-secondary/10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 1}
          >
            −
          </Button>
          <span className="text-sm font-medium text-foreground min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            +
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Redefinir
          </Button>
        </div>
      </div>
    </div>
  );
}
