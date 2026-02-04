/**
 * Smart Layout Page — Kadeh Smart Layout
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for retail, category management, shelf optimization keywords
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SmartLayoutSimulator from "@/components/SmartLayoutSimulator";
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

  const features = [
    {
      title: t.smartLayout.features.items[0].title,
      description: t.smartLayout.features.items[0].description,
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: t.smartLayout.features.items[1].title,
      description: t.smartLayout.features.items[1].description,
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: t.smartLayout.features.items[2].title,
      description: t.smartLayout.features.items[2].description,
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: t.smartLayout.features.items[3].title,
      description: t.smartLayout.features.items[3].description,
      icon: <Layout className="w-6 h-6" />,
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
        ? "Produtos com alto giro recebem mais frentes, reduzindo falta de estoque e perda de vendas."
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
      title: language === 'pt' ? "Importar Dados" : "Import Data",
      description: language === 'pt'
        ? "Carregue informações de giro, margem, volume e layout atual da loja."
        : "Upload sales velocity, margin, volume and current store layout information.",
    },
    {
      title: language === 'pt' ? "Análise Inteligente" : "Smart Analysis",
      description: language === 'pt'
        ? "IA analisa dados e gera recomendações otimizadas para cada categoria e produto."
        : "AI analyzes data and generates optimized recommendations for each category and product.",
    },
    {
      title: language === 'pt' ? "Implementar" : "Implement",
      description: language === 'pt'
        ? "Aplique as recomendações e monitore o impacto em tempo real no dashboard."
        : "Apply recommendations and monitor real-time impact in the dashboard.",
    },
  ];

  const faqItems = [
    {
      question: language === 'pt' ? "Como o Smart Layout calcula as recomendações?" : "How does Smart Layout calculate recommendations?",
      answer: language === 'pt'
        ? "O sistema usa algoritmos de otimização que consideram giro, margem, volume e espaço disponível para maximizar lucratividade."
        : "The system uses optimization algorithms that consider velocity, margin, volume and available space to maximize profitability.",
    },
    {
      question: language === 'pt' ? "Posso implementar as recomendações gradualmente?" : "Can I implement recommendations gradually?",
      answer: language === 'pt'
        ? "Sim. Você pode escolher implementar por categoria, setor ou gradualmente em toda a loja."
        : "Yes. You can choose to implement by category, sector, or gradually across the entire store.",
    },
    {
      question: language === 'pt' ? "O sistema se adapta a sazonalidade?" : "Does the system adapt to seasonality?",
      answer: language === 'pt'
        ? "Sim. O Smart Layout considera padrões sazonais e ajusta recomendações automaticamente."
        : "Yes. Smart Layout considers seasonal patterns and automatically adjusts recommendations.",
    },
  ];

  return (
    <>
      <Header />
      <Hero
        title={t.smartLayout.title}
        subtitle={t.smartLayout.subtitle}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Ver soluções" : "View Solutions"}
        imageUrl="/images/smart-layout-olive-oil.png"
        imageAlt="Smart Layout"
      />

      <FeaturesSection title={t.smartLayout.features.title} features={features} />

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {language === 'pt' ? "Benefícios Comprovados" : "Proven Benefits"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SmartLayoutSimulator />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {language === 'pt' ? "Como Funciona" : "How It Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection title={language === 'pt' ? "Perguntas Frequentes" : "Frequently Asked Questions"} items={faqItems} />

      <CTASection
        title={t.cta.title}
        subtitle={t.cta.description}
        primaryCTA={t.cta.talkToSpecialist}
      />

      <Footer />
    </>
  );
}
