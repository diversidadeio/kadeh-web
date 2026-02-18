/**
 * Retail Templates Selector Component
 * Allows users to select and apply pre-configured retail scenarios
 */

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRetailTemplates, type RetailTemplate } from "@/data/dimensionValidator";
import { Store, Pill, ShoppingCart, Sparkles, Warehouse } from "lucide-react";

interface RetailTemplatesSelectorProps {
  onSelectTemplate: (template: RetailTemplate) => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  supermarket: <Store className="w-6 h-6" />,
  pharmacy: <Pill className="w-6 h-6" />,
  convenience: <ShoppingCart className="w-6 h-6" />,
  specialty: <Sparkles className="w-6 h-6" />,
  warehouse: <Warehouse className="w-6 h-6" />,
};

const TRANSLATIONS = {
  pt: {
    title: "Modelos de Varejo Pré-configurados",
    description: "Escolha um modelo pré-configurado para começar com uma gôndola otimizada",
    selectTemplate: "Selecionar Modelo",
    width: "Largura",
    shelves: "Prateleiras",
    depth: "Profundidade",
    height: "Altura",
    products: "Produtos Recomendados",
    margin: "Margem Alvo",
    revenue: "Faturamento Alvo",
    cm: "cm",
    percent: "%",
    currency: "R$",
  },
  en: {
    title: "Pre-configured Retail Templates",
    description: "Choose a pre-configured template to start with an optimized gondola",
    selectTemplate: "Select Template",
    width: "Width",
    shelves: "Shelves",
    depth: "Depth",
    height: "Height",
    products: "Recommended Products",
    margin: "Target Margin",
    revenue: "Target Revenue",
    cm: "cm",
    percent: "%",
    currency: "R$",
  },
};

export default function RetailTemplatesSelector({ onSelectTemplate }: RetailTemplatesSelectorProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const templates = getRetailTemplates();

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t.title}</h3>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-primary">{TEMPLATE_ICONS[template.id] || <Store className="w-6 h-6" />}</div>
              <div>
                <h4 className="font-semibold text-foreground">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.width}</p>
                <p className="font-semibold text-foreground">
                  {template.gondolaWidth} {t.cm}
                </p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.shelves}</p>
                <p className="font-semibold text-foreground">{template.numberOfShelves}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.depth}</p>
                <p className="font-semibold text-foreground">
                  {template.shelfDepth} {t.cm}
                </p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.height}</p>
                <p className="font-semibold text-foreground">
                  {template.shelfHeight} {t.cm}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div>
                <p className="text-muted-foreground">{t.products}</p>
                <p className="font-semibold text-foreground">{template.recommendedProductCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.margin}</p>
                <p className="font-semibold text-foreground">{(template.targetMargin * 100).toFixed(0)}{t.percent}</p>
              </div>
            </div>

            <Button onClick={() => onSelectTemplate(template)} className="w-full" size="sm">
              {t.selectTemplate}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
