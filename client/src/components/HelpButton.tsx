import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface HelpSection {
  title: string;
  content: string;
  link?: string;
}

interface HelpButtonProps {
  section: string;
  title: string;
  content: string;
  link?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const HELP_CONTENT: Record<string, Record<string, HelpSection>> = {
  pt: {
    'smart-layout-intro': {
      title: 'Bem-vindo ao Smart Layout',
      content: 'O Smart Layout é um simulador interativo que permite otimizar o layout de gôndolas, freezers e bancas. Configure o tipo de área de exposição, adicione produtos e receba recomendações inteligentes de posicionamento baseadas em margem e velocidade de vendas.',
      link: '#módulo-smart-layout'
    },
    'smart-layout-config': {
      title: 'Configurar Área de Exposição',
      content: 'Clique em "Configurar Área de Exposição" para selecionar o tipo (Gôndola, Terminal, Freezer Vertical, Freezer Horizontal ou Banca) e inserir as medidas específicas. As medidas padrão são otimizadas para a maioria dos casos.',
      link: '#iniciando-uma-simulação'
    },
    'smart-layout-add-products': {
      title: 'Adicionar Produtos',
      content: 'Existem três formas: 1) Adicionar manualmente clicando em "Adicionar Produto", 2) Usar presets clicando em "Carregar Presets de Produtos", ou 3) Importar em massa via CSV. O sistema recomenda automaticamente a zona ideal para cada produto.',
      link: '#adicionar-produtos'
    },
    'smart-layout-zones': {
      title: 'Zonas de Exposição',
      content: 'Altura dos Olhos (zona premium para produtos com alta margem e giro), Altura das Mãos (zona acessível para produtos com bom volume) e Parte de Baixo (zona para produtos de baixo giro ou volume). O posicionamento é automático baseado em margem e giro.',
      link: '#entendendo-o-posicionamento-inteligente'
    },
    'smart-layout-visualization': {
      title: 'Visualização da Gôndola',
      content: 'A visualização horizontal mostra cada produto com seu nome, percentual de espaço e cor por zona. Use os filtros para visualizar apenas produtos de uma zona específica. A tabela abaixo mostra detalhes completos de cada produto.',
      link: '#visualização-da-gôndola'
    },
    'smart-layout-export': {
      title: 'Exportar Planograma',
      content: 'Clique em "Exportar Planograma" para gerar um PDF com a visualização completa da gôndola e tabela de detalhamento. Selecione o tipo de área de exposição antes de exportar.',
      link: '#exportação-de-planograma'
    },
    'smart-layout-financial': {
      title: 'Dashboard Financeiro',
      content: 'O dashboard mostra o impacto estimado da simulação: ROI, aumento de ticket médio, redução de ruptura e aumento de lucratividade. Inclui métricas financeiras (receita, custos, lucro) e gráficos de projeção de 12 meses.',
      link: '#dashboard-financeiro'
    },
    'smart-layout-ai-image': {
      title: 'Gerar Visualização de IA',
      content: 'Clique em "Gerar Visualização da Loja" para gerar uma imagem fotorrealista de como a loja ficaria com a simulação. A IA posiciona os produtos conforme suas zonas de exposição.',
      link: '#geração-de-imagem-de-ia'
    }
  },
  en: {
    'smart-layout-intro': {
      title: 'Welcome to Smart Layout',
      content: 'Smart Layout is an interactive simulator that allows you to optimize the layout of shelves, freezers and produce displays. Configure the exposure area type, add products and receive intelligent positioning recommendations based on margin and sales velocity.',
      link: '#smart-layout-module'
    },
    'smart-layout-config': {
      title: 'Configure Exposure Area',
      content: 'Click "Configure Exposure Area" to select the type (Shelf, Terminal, Vertical Freezer, Horizontal Freezer or Produce Display) and enter specific measurements. Default measurements are optimized for most cases.',
      link: '#starting-a-simulation'
    },
    'smart-layout-add-products': {
      title: 'Add Products',
      content: 'There are three ways: 1) Add manually by clicking "Add Product", 2) Use presets by clicking "Load Product Presets", or 3) Import in bulk via CSV. The system automatically recommends the ideal zone for each product.',
      link: '#add-products'
    },
    'smart-layout-zones': {
      title: 'Exposure Zones',
      content: 'Eye Level (premium zone for high-margin, high-velocity products), Hand Level (accessible zone for good-volume products) and Bottom (zone for low-velocity or bulk products). Positioning is automatic based on margin and velocity.',
      link: '#understanding-intelligent-positioning'
    },
    'smart-layout-visualization': {
      title: 'Shelf Visualization',
      content: 'The horizontal visualization shows each product with its name, space percentage and zone color. Use filters to view only products from a specific zone. The table below shows complete details for each product.',
      link: '#shelf-visualization'
    },
    'smart-layout-export': {
      title: 'Export Planogram',
      content: 'Click "Export Planogram" to generate a PDF with the complete shelf visualization and detail table. Select the exposure area type before exporting.',
      link: '#planogram-export'
    },
    'smart-layout-financial': {
      title: 'Financial Dashboard',
      content: 'The dashboard shows the estimated impact of the simulation: ROI, average ticket increase, rupture reduction and profitability increase. Includes financial metrics (revenue, costs, profit) and 12-month projection charts.',
      link: '#financial-dashboard'
    },
    'smart-layout-ai-image': {
      title: 'Generate AI Visualization',
      content: 'Click "Generate Store Visualization" to generate a photorealistic image of how the store would look with the simulation. AI positions products according to their exposure zones.',
      link: '#ai-image-generation'
    }
  }
};

export default function HelpButton({ section, title, content, link, position = 'top-right' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = language === 'pt' ? 'pt' : 'en';
  
  const helpContent = HELP_CONTENT[t][section] || { title, content, link };
  
  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-40 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl`}
        title={language === 'pt' ? 'Ajuda' : 'Help'}
        aria-label={language === 'pt' ? 'Abrir ajuda' : 'Open help'}
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{helpContent.title}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {language === 'pt' ? 'Ajuda Contextual' : 'Contextual Help'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-500 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{helpContent.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'pt' ? 'Fechar' : 'Close'}
                </Button>
                {helpContent.link && (
                  <Button
                    onClick={() => {
                      window.open(`/KADEH_GUIA_USUARIO.md${helpContent.link}`, '_blank');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {language === 'pt' ? 'Ver Guia Completo' : 'View Full Guide'}
                  </Button>
                )}
              </div>

              {/* Tip */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{language === 'pt' ? 'Dica:' : 'Tip:'}</strong> {' '}
                  {language === 'pt' 
                    ? 'Clique em "Ver Guia Completo" para acessar a documentação detalhada com mais exemplos e melhores práticas.'
                    : 'Click "View Full Guide" to access detailed documentation with more examples and best practices.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
