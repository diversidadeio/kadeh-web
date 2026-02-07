/**
 * ShelfZoneFilter Component
 * Allows filtering products by shelf zone (Eyes, Hands, Bottom)
 * Design: Tech-Forward Minimalism with interactive elements
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface ShelfZoneFilterProps {
  selectedZone: string | null;
  onZoneChange: (zone: string | null) => void;
}

const TRANSLATIONS = {
  pt: {
    filterByZone: "Filtrar por Zona de Prateleira",
    eyes: "Altura dos olhos",
    hands: "Altura das mãos",
    bottom: "Parte de Baixo",
    all: "Todas as Zonas",
  },
  en: {
    filterByZone: "Filter by Shelf Zone",
    eyes: "Eye Level",
    hands: "Hand Level",
    bottom: "Bottom Shelf",
    all: "All Zones",
  },
};

export default function ShelfZoneFilter({ selectedZone, onZoneChange }: ShelfZoneFilterProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.pt;

  const zones = [
    { id: "Altura dos olhos", label: t.eyes },
    { id: "Altura das mãos", label: t.hands },
    { id: "Parte de Baixo", label: t.bottom },
  ];

  return (
    <div className="bg-card p-4 rounded-md border border-border">
      <h4 className="text-sm font-semibold text-foreground mb-3">{t.filterByZone}</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onZoneChange(null)}
          variant={selectedZone === null ? "default" : "outline"}
          size="sm"
          className="text-xs"
        >
          {t.all}
        </Button>
        {zones.map((zone) => (
          <Button
            key={zone.id}
            onClick={() => onZoneChange(selectedZone === zone.id ? null : zone.id)}
            variant={selectedZone === zone.id ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {zone.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
