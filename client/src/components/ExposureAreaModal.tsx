/**
 * ExposureAreaModal Component
 * Modal for selecting exposure area type before PDF export
 * Design: Tech-Forward Minimalism with clear options
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ExposureAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (areaType: string) => void;
}

const TRANSLATIONS = {
  pt: {
    selectExposureArea: "Selecionar Tipo de Área de Exposição",
    gondola: "Gôndola",
    terminalGondola: "Terminal de Gôndola",
    freezerVertical: "Freezer Vertical",
    freezerHorizontal: "Freezer Horizontal",
    fruitStand: "Banca de Frutas/Legumes/Verduras",
    export: "Exportar",
    cancel: "Cancelar",
    selectAreaMessage: "Selecione o tipo de área de exposição para gerar o planograma em PDF",
  },
  en: {
    selectExposureArea: "Select Exposure Area Type",
    gondola: "Gondola",
    terminalGondola: "Gondola Terminal",
    freezerVertical: "Vertical Freezer",
    freezerHorizontal: "Horizontal Freezer",
    fruitStand: "Fruit/Vegetable Stand",
    export: "Export",
    cancel: "Cancel",
    selectAreaMessage: "Select the type of exposure area to generate the planogram in PDF",
  },
};

export default function ExposureAreaModal({ isOpen, onClose, onExport }: ExposureAreaModalProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const areas = [
    { id: "gondola", label: t.gondola },
    { id: "terminal", label: t.terminalGondola },
    { id: "freezer-vertical", label: t.freezerVertical },
    { id: "freezer-horizontal", label: t.freezerHorizontal },
    { id: "fruit-stand", label: t.fruitStand },
  ];

  const handleExport = () => {
    if (selectedArea) {
      onExport(selectedArea);
      setSelectedArea(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t.selectExposureArea}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{t.selectAreaMessage}</p>

        <div className="space-y-3 mb-6">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selectedArea === area.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedArea === area.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-border"
                  }`}
                >
                  {selectedArea === area.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{area.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleExport}
            disabled={!selectedArea}
            className="flex-1"
          >
            {t.export}
          </Button>
        </div>
      </div>
    </div>
  );
}
