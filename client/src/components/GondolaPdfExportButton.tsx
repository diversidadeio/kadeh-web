import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportGondolaPlanogram } from '@/utils/gondolaPdfExporter';

interface Product {
  id: string;
  name: string;
  zone?: string;
  zona?: string;
  quadrantes: number;
  largura?: number;
  share?: number;
  giro?: string;
  margem?: string;
}

interface GondolaConfig {
  width: number;
  height: number;
  depth: number;
  numberOfShelves: number;
}

interface GondolaPdfExportButtonProps {
  products: Product[];
  gondolaConfig: GondolaConfig;
  storeName?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const TRANSLATIONS = {
  pt: {
    exportPlanogram: 'Exportar Planograma',
    exporting: 'Exportando...',
    noProducts: 'Adicione produtos para exportar',
    success: 'Planograma exportado com sucesso!',
    error: 'Erro ao exportar planograma',
  },
  en: {
    exportPlanogram: 'Export Planogram',
    exporting: 'Exporting...',
    noProducts: 'Add products to export',
    success: 'Planogram exported successfully!',
    error: 'Error exporting planogram',
  },
};

export default function GondolaPdfExportButton({
  products,
  gondolaConfig,
  storeName = 'Loja',
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
}: GondolaPdfExportButtonProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (products.length === 0) {
      alert(t.noProducts);
      return;
    }

    setIsExporting(true);
    try {
      await exportGondolaPlanogram(
        products,
        gondolaConfig,
        storeName,
        language as 'pt' | 'en'
      );
      // Opcional: mostrar notificação de sucesso
      console.log(t.success);
    } catch (error) {
      console.error(t.error, error);
      alert(t.error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting || products.length === 0}
      variant={variant}
      size={size}
      className={className}
      title={products.length === 0 ? t.noProducts : t.exportPlanogram}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {t.exporting}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {t.exportPlanogram}
        </>
      )}
    </Button>
  );
}
