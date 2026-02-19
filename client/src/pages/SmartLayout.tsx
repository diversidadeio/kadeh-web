/**
 * Smart Layout Page — Kadeh Smart Layout
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for retail, category management, shelf optimization keywords
 */

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SmartLayoutWithSaveFeature from "@/components/SmartLayoutWithSaveFeature";
import ImageZoomModal from "@/components/ImageZoomModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import {
  BarChart3,
  Zap,
  TrendingUp,
  Package,
  Layout,
  Target,
  DollarSign,
  Eye,
  Layers,
} from "lucide-react";

export default function SmartLayout() {
  const { language } = useLanguage();
  const t = translations[language];
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const features = [
    {
      title: language === 'pt' ? "Análise de Mix de Produtos" : "Product Mix Analysis",
      description: language === 'pt'
        ? "Visualize o portfólio completo de categorias com informações de giro, margem e volume de vendas."
        : "Visualize your complete portfolio of categories with sales velocity, margin and volume information.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Recomendação Inteligente de Quadrantes" : "Intelligent Shelf Recommendations",
      description: language === 'pt'
        ? "Sistema recomenda o número ideal de quadrantes por produto baseado em giro e margem de lucratividade."
        : "System recommends the ideal number of shelf facings per product based on sales velocity and profitability margin.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Otimização de Posicionamento" : "Position Optimization",
      description: language === 'pt'
        ? "Produtos posicionados automaticamente por zona (olhos, mãos, piso) para maximizar conversão."
        : "Products automatically positioned by zone (eye level, hands, floor) to maximize conversion.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Redimensionamento de Categorias" : "Category Resizing",
      description: language === 'pt'
        ? "Recomendações de aumento/redução de espaço de categoria para melhorar lucratividade total."
        : "Recommendations to increase/reduce category space to improve total profitability.",
      icon: <Layout className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Gestão de Gôndolas" : "Shelf Management",
      description: language === 'pt'
        ? "Defina dimensões de gôndolas, número de prateleiras e largura disponível para cálculos precisos."
        : "Define shelf dimensions, number of shelves and available width for accurate calculations.",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Relatórios de Performance" : "Performance Reports",
      description: language === 'pt'
        ? "Análise detalhada de impacto de cada categoria na lucratividade total da loja."
        : "Detailed analysis of each category's impact on total store profitability.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: language === 'pt' ? "Aumento de Lucratividade" : "Increased Profitability",
      description: language === 'pt'
        ? "Produtos de alta margem ganham mais espaço e melhor posicionamento, aumentando ticket médio."
        : "High-margin products get more space and better positioning, increasing average ticket.",
    },
    {
      title: language === 'pt' ? "Otimização de Espaço" : "Space Optimization",
      description: language === 'pt'
        ? "Cada centímetro de gôndola trabalha para você, eliminando desperdício e maximizando ROI."
        : "Every inch of shelf space works for you, eliminating waste and maximizing ROI.",
    },
    {
      title: language === 'pt' ? "Redução de Ruptura" : "Reduced Stockouts",
      description: language === 'pt'
        ? "Produtos com alto giro recebem mais quadrantes, reduzindo falta de estoque e perda de vendas."
        : "Fast-moving products get more facings, reducing stockouts and lost sales.",
    },
    {
      title: language === 'pt' ? "Melhor Experiência do Cliente" : "Better Customer Experience",
      description: language === 'pt'
        ? "Produtos mais procurados ficam em melhor posição, facilitando localização e aumentando satisfação."
        : "Most-searched products are better positioned, making them easier to find and increasing satisfaction.",
    },
    {
      title: language === 'pt' ? "Decisões Baseadas em Dados" : "Data-Driven Decisions",
      description: language === 'pt'
        ? "Elimine suposições: cada recomendação é baseada em análise matemática de giro e margem."
        : "Eliminate guesswork: every recommendation is based on mathematical analysis of velocity and margin.",
    },
    {
      title: language === 'pt' ? "Implementação Rápida" : "Quick Implementation",
      description: language === 'pt'
        ? "Recomendações prontas para implementação imediata, sem necessidade de consultoria externa."
        : "Recommendations ready for immediate implementation, no external consulting needed.",
    },
  ];

  const howItWorks = [
    {
      title: language === 'pt' ? "Cadastre Categorias" : "Register Categories",
      description: language === 'pt'
        ? "Informe mix de produtos, margem de lucratividade (baixa, média, alta) e giro de mercadoria."
        : "Provide product mix, profitability margin (low, medium, high) and sales velocity.",
    },
    {
      title: language === 'pt' ? "Configure Gôndolas" : "Configure Shelves",
      description: language === 'pt'
        ? "Defina dimensões da gôndola, número de prateleiras e largura disponível por categoria."
        : "Define shelf dimensions, number of shelves and available width per category.",
    },
    {
      title: language === 'pt' ? "Sistema Recomenda" : "System Recommends",
      description: language === 'pt'
        ? "Kadeh Smart Layout calcula número ideal de quadrantes e posicionamento por zona de gôndola."
        : "Kadeh Smart Layout calculates ideal number of facings and positioning by shelf zone.",
    },
    {
      title: language === 'pt' ? "Implemente" : "Implement",
      description: language === 'pt'
        ? "Receba planograma detalhado e implemente recomendações na loja física."
        : "Receive detailed planogram and implement recommendations in physical store.",
    },
    {
      title: language === 'pt' ? "Acompanhe Resultados" : "Monitor Results",
      description: language === 'pt'
        ? "Monitore impacto nas vendas e lucratividade, ajuste conforme necessário."
        : "Monitor impact on sales and profitability, adjust as needed.",
    },
  ];

  const useCases = [
    {
      title: language === 'pt' ? "Varejo Alimentar" : "Food Retail",
      description: language === 'pt'
        ? "Otimize categorias de alimentos, bebidas e produtos de giro rápido com recomendações por sazonalidade."
        : "Optimize food, beverage and fast-moving product categories with seasonality recommendations.",
    },
    {
      title: language === 'pt' ? "Varejo Geral" : "General Retail",
      description: language === 'pt'
        ? "Gerencie múltiplas categorias (vestuário, eletrônicos, higiene) com diferentes margens e giros."
        : "Manage multiple categories (clothing, electronics, hygiene) with different margins and velocities.",
    },
    {
      title: language === 'pt' ? "Farmácia" : "Pharmacy",
      description: language === 'pt'
        ? "Maximize lucratividade de medicamentos, cosméticos e produtos de saúde com posicionamento estratégico."
        : "Maximize profitability of medicines, cosmetics and health products with strategic positioning.",
    },
    {
      title: language === 'pt' ? "Petshop" : "Pet Store",
      description: language === 'pt'
        ? "Otimize espaço de rações, brinquedos e acessórios com recomendações baseadas em sazonalidade."
        : "Optimize space for pet food, toys and accessories with seasonality-based recommendations.",
    },
  ];

  const faqItems = [
    {
      question: language === 'pt' ? "Como o sistema calcula o número de quadrantes recomendado?" : "How does the system calculate the recommended number of facings?",
      answer: language === 'pt'
        ? "O sistema usa uma matriz matemática que cruza Giro (Baixo/Médio/Alto) com Margem (Baixa/Média/Alta), recomendando de 1 a 5 quadrantes. Produtos com alto giro e alta margem recebem mais espaço."
        : "The system uses a mathematical matrix that crosses Sales Velocity (Low/Medium/High) with Margin (Low/Medium/High), recommending 1 to 5 facings. Products with high velocity and high margin get more space.",
    },
    {
      question: language === 'pt' ? "Posso customizar as recomendações?" : "Can I customize the recommendations?",
      answer: language === 'pt'
        ? "Sim. Você pode ajustar manualmente as recomendações do sistema conforme sua estratégia comercial e conhecimento do ponto de venda."
        : "Yes. You can manually adjust system recommendations according to your commercial strategy and point-of-sale knowledge.",
    },
    {
      question: language === 'pt' ? "Como funciona o redimensionamento de categorias?" : "How does category resizing work?",
      answer: language === 'pt'
        ? "O sistema analisa lucratividade por categoria e recomenda aumento ou redução de espaço para maximizar retorno total da loja."
        : "The system analyzes profitability by category and recommends increasing or reducing space to maximize total store return.",
    },
    {
      question: language === 'pt' ? "Quais informações preciso fornecer para começar?" : "What information do I need to provide to get started?",
      answer: language === 'pt'
        ? "Você precisa informar: mix de produtos por categoria, margem de lucratividade, giro de mercadoria, dimensões das gôndolas e número de prateleiras."
        : "You need to provide: product mix by category, profitability margin, sales velocity, shelf dimensions and number of shelves.",
    },
    {
      question: language === 'pt' ? "O sistema integra com meu ERP/PDV?" : "Does the system integrate with my ERP/POS?",
      answer: language === 'pt'
        ? "Sim. Kadeh Smart Layout integra com sistemas ERP e PDV para importar dados de giro, preço e estoque automaticamente."
        : "Yes. Kadeh Smart Layout integrates with ERP and POS systems to automatically import sales velocity, price and inventory data.",
    },
    {
      question: language === 'pt' ? "Quanto tempo leva para ver resultados?" : "How long does it take to see results?",
      answer: language === 'pt'
        ? "Resultados são visíveis em 2-4 semanas após implementação das recomendações, com aumento de 5-15% na lucratividade média."
        : "Results are visible within 2-4 weeks after implementing recommendations, with an average 5-15% increase in profitability.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title={language === 'pt' 
          ? "Kadeh Smart Layout: gerencie categorias com inteligência e maximize a lucratividade da loja."
          : "Kadeh Smart Layout: manage categories intelligently and maximize store profitability."}
        subtitle={language === 'pt'
          ? "Recomendações automáticas de número de quadrantes, posicionamento em gôndola e redimensionamento de categorias baseadas em mix de produtos, margem de lucratividade e giro de mercadoria."
          : "Automatic recommendations for number of facings, shelf positioning and category resizing based on product mix, profitability margin and sales velocity."}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Ver funcionalidades" : "View Features"}
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png"
        imageAlt={language === 'pt' ? "Smart Layout - Otimização de Gôndolas" : "Smart Layout - Shelf Optimization"}
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title={language === 'pt' ? "Funcionalidades Kadeh Smart Layout" : "Kadeh Smart Layout Features"}
        subtitle={language === 'pt' 
          ? "Tudo que você precisa para gerenciar categorias com eficiência e lucratividade."
          : "Everything you need to manage categories efficiently and profitably."}
        features={features}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title={language === 'pt' ? "Benefícios Comprovados" : "Proven Benefits"}
        subtitle={language === 'pt'
          ? "Resultados mensuráveis para sua operação de varejo."
          : "Measurable results for your retail operation."}
        features={benefits}
        columns={3}
      />

      {/* Como Funciona */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' 
                ? "Do cadastro à implementação: 5 passos simples"
                : "From registration to implementation: 5 simple steps"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Processo direto para otimizar suas categorias e aumentar lucratividade."
                : "Straightforward process to optimize your categories and increase profitability."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemplos de Gôndolas */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {language === 'pt' ? "Exemplos Práticos de Otimização" : "Practical Optimization Examples"}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            {language === 'pt'
              ? "Veja como o Kadeh Smart Layout otimiza diferentes cenários de gôndola."
              : "See how Kadeh Smart Layout optimizes different shelf scenarios."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gondola */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: '/images/smart-layout-gondola.png', alt: language === 'pt' ? "Visualização de Gôndola" : "Shelf Visualization" })}>
              <img src="/images/smart-layout-gondola.png" alt={language === 'pt' ? "Visualização de Gôndola" : "Shelf Visualization"} className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'pt' ? "Visualização de Gôndola" : "Shelf Visualization"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? "Estrutura básica de gôndola com distribuição de espaço por categoria."
                    : "Basic shelf structure with space distribution by category."}
                </p>
              </div>
            </div>

            {/* Retail */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: '/images/smart-layout-retail.png', alt: language === 'pt' ? "Cenário de Varejo" : "Retail Scenario" })}>
              <img src="/images/smart-layout-retail.png" alt={language === 'pt' ? "Cenário de Varejo" : "Retail Scenario"} className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'pt' ? "Cenário de Varejo" : "Retail Scenario"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? "Otimização completa de gôndola em ambiente de varejo real."
                    : "Complete shelf optimization in real retail environment."}
                </p>
              </div>
            </div>

            {/* Olive Oil */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png', alt: language === 'pt' ? "Exemplo com Azeite" : "Olive Oil Example" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/avplhLfFmhYRDhTs.png" alt={language === 'pt' ? "Exemplo com Azeite" : "Olive Oil Example"} className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'pt' ? "Exemplo com Azeite" : "Olive Oil Example"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? "Otimização de categoria de azeites com 4 variações de margem e giro."
                    : "Optimization of olive oil category with 4 margin and velocity variations."}
                </p>
              </div>
            </div>

            {/* Detailed */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GPUaxCFmQgNVKOZv.png', alt: language === 'pt' ? "Versão Detalhada" : "Detailed Version" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GPUaxCFmQgNVKOZv.png" alt={language === 'pt' ? "Versão Detalhada" : "Detailed Version"} className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'pt' ? "Versão Detalhada" : "Detailed Version"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? "Análise detalhada com informações de preço, giro e posicionamento."
                    : "Detailed analysis with price, velocity and positioning information."}
                </p>
              </div>
            </div>

            {/* 6 Shelves */}
            <div className="rounded-md overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setZoomImage({ src: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/wjSnHdHtumNCqHrQ.png', alt: language === 'pt' ? "Versão com 4 Prateleiras" : "4 Shelves Version" })}>
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/wjSnHdHtumNCqHrQ.png" alt={language === 'pt' ? "Versão com 4 Prateleiras" : "4 Shelves Version"} className="w-full h-64 object-cover" />
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === 'pt' ? "Versão com 4 Prateleiras" : "4 Shelves Version"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'pt'
                    ? "Otimização para gôndolas com 4 prateleiras e maior espaço disponível."
                    : "Optimization for shelves with 4 shelves and more available space."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            {language === 'pt' ? "Aplicável a Todos os Formatos de Varejo" : "Applicable to All Retail Formats"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="p-8 bg-white border border-border rounded-md hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
            {language === 'pt' ? "Resultados Esperados" : "Expected Results"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+5-15%</div>
              <p className="text-muted-foreground">
                {language === 'pt' ? "Aumento de Lucratividade" : "Profitability Increase"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-20%</div>
              <p className="text-muted-foreground">
                {language === 'pt' ? "Redução de Ruptura" : "Stockout Reduction"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+30%</div>
              <p className="text-muted-foreground">
                {language === 'pt' ? "Melhor Uso de Espaço" : "Better Space Usage"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2-4w</div>
              <p className="text-muted-foreground">
                {language === 'pt' ? "Tempo para Resultados" : "Time to Results"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Interativo */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Teste o Smart Layout: Simulador Interativo" : "Test Smart Layout: Interactive Simulator"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Configure sua gôndola, adicione produtos e veja as recomendações de layout em tempo real."
                : "Configure your shelf, add products and see layout recommendations in real time."}
            </p>
          </div>
          <SmartLayoutWithSaveFeature />
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        id="faq"
        title={language === 'pt' ? "Perguntas Frequentes" : "Frequently Asked Questions"}
        items={faqItems}
      />

      {/* CTA Final */}
      <CTASection
        title={language === 'pt'
          ? "Transforme seu gerenciamento de categorias em vantagem competitiva."
          : "Transform your category management into competitive advantage."}
        subtitle={language === 'pt'
          ? "Kadeh Smart Layout recomenda, você implementa, e a lucratividade cresce."
          : "Kadeh Smart Layout recommends, you implement, and profitability grows."}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Falar com especialista" : "Talk to Specialist"}
      />

      <Footer />

      {/* Image Zoom Modal */}
      {zoomImage && (
        <ImageZoomModal
          isOpen={!!zoomImage}
          imageSrc={zoomImage.src}
          imageAlt={zoomImage.alt}
          onClose={() => setZoomImage(null)}
        />
      )}
    </>
  );
}
