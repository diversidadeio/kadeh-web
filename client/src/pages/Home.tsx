/**
 * Home Page — Kadeh
 * Design: Tech-Forward Minimalism
 * SEO: Optimized with semantic HTML, proper heading hierarchy, meta tags
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import {
  MapPin,
  Zap,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  Grid3X3,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const handlePresentationClick = (url: string) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  const deliverables = [
    {
      title: "Navegação que qualquer pessoa entende",
      description:
        "Rotas claras e intuitivas para produtos, serviços e áreas essenciais. Menos fricção. Mais autonomia.",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      title: "IA para vender mais",
      description:
        "Recomendação inteligente de substitutos, complementares e melhor rota de compra, a partir da busca do consumidor.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Intenção de compra em tempo real",
      description:
        "Relatório on-time de buscas por categorias, segmentos e produtos em diferentes formatos de loja/ambiente.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const solutions = [
    {
      title: "Kadeh Varejo",
      description:
        "Localize produtos, aumente conversão e gere eficiência operacional com dados em tempo real.",
      icon: <BarChart3 className="w-6 h-6" />,
      presentationUrl: "/documents/kadeh-varejo-presentation.pdf",
    },
    {
      title: "Kadeh Shopping",
      description:
        "Navegação do estacionamento às lojas e serviços, com rotas para facilidades e segurança.",
      icon: <MapPin className="w-6 h-6" />,
      presentationUrl: "/documents/kadeh-shopping-presentation.pdf",
    },
    {
      title: "Kadeh Eventos",
      description:
        "Encontre stands e palestras, monte roteiro e receba sugestões por interesse via IA.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Kadeh Saúde",
      description:
        "Melhore a jornada do paciente e otimize a gestão de equipamentos e ativos móveis.",
      icon: <Shield className="w-6 h-6" />,
      presentationUrl: "/documents/kadeh-saude-presentation.pdf",
    },
    {
      title: "Kadeh Localiza",
      description:
        "Aeroportos, rodoviárias e serviços públicos com rotas certeiras, menos filas e menos necessidade de orientação humana.",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      title: "Kadeh Picking",
      description:
        "Picking eficiente para e-commerce com rotas otimizadas, validação em tempo real e rastreamento completo.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Kadeh Smart Layout",
      description:
        "Gerenciamento inteligente de categorias com recomendações de frentes, posicionamento e redimensionamento de gôndolas.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const howItWorks = [
    {
      title: "Mapear",
      description:
        "Estruturamos o ambiente com setores, lojas/POIs, categorias, serviços e rotas.",
    },
    {
      title: "Ativar",
      description:
        "Publicamos navegação e buscas com IA (substitutos, complementares e sugestões por interesse).",
    },
    {
      title: "Medir e otimizar",
      description:
        "Dashboard on-time com intenção de compra e padrões de busca para operação, varejo e indústria.",
    },
  ];

  const faqItems = [
    {
      question: "A Kadeh funciona para pessoas com pouca familiaridade com tecnologia?",
      answer:
        "Sim. A experiência é desenhada para ser intuitiva, com passos claros e linguagem simples.",
    },
    {
      question: "A solução é exclusiva?",
      answer:
        "A Kadeh possui tecnologia registrada no INPI e Declaração de Exclusividade válida para todo o Brasil (setembro/2025).",
    },
    {
      question: "O que é intenção de compra no dashboard?",
      answer:
        "São sinais gerados pelas buscas e navegação do usuário (categorias/segmentos/produtos procurados), organizados em relatórios on-time.",
    },
    {
      question: "A IA sugere produtos mesmo quando não há disponibilidade?",
      answer:
        "Sim. A IA recomenda substitutos disponíveis e também itens complementares conforme a busca.",
    },
    {
      question: "É necessário aplicativo?",
      answer:
        "A Kadeh pode operar em modelos diferentes (app, web e ativações por QR), conforme o projeto.",
    },
    {
      question: "Dá para integrar com e-commerce/ERP/CRM/BI?",
      answer:
        "Sim. O projeto pode incluir integrações via API e exportação de relatórios para BI.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title="Kadeh: navegação indoor + IA + analytics on-time para transformar espaços físicos em vendas e eficiência."
        subtitle="A plataforma que une experiência simples para qualquer público com otimização operacional e dados em tempo real de intenção de compra — com tecnologia registrada no INPI e Declaração de Exclusividade válida para todo o Brasil (setembro/2025)."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Ver soluções"
        imageUrl="/images/hero-couple-shopping.png"
        imageAlt="Navegação indoor com IA"
      />

      {/* O que a Kadeh entrega */}
      <FeaturesSection
        title="Uma plataforma. Cinco soluções. Um resultado: mais autonomia, mais vendas, mais eficiência."
        features={deliverables}
        columns={3}
      />

      {/* Soluções */}
      <FeaturesSection
        id="solucoes"
        title="Soluções desenhadas para cada ambiente"
        features={solutions}
        columns={3}
        onPresentationClick={handlePresentationClick}
      />

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Do mapa ao impacto: ativação rápida, evolução contínua
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed ml-14">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valor para varejo e indústria */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            Valor direto para varejo e indústria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Para o varejo */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Para o varejo
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Mais conversão e melhor experiência em loja
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Reabastecimento mais eficiente com sinais de demanda
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Curadoria do e-commerce baseada em intenção real de busca
                  </span>
                </li>
              </ul>
            </div>

            {/* Para a indústria */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Para a indústria
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Insights por categoria/segmento/produto buscado
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Leitura de oportunidade por formato de loja/ambiente
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">
                    Dados para execução comercial e estratégia de portfólio
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Propriedade Intelectual */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Tecnologia protegida. Exclusividade nacional.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            A Kadeh possui tecnologia registrada no INPI e Declaração de
            Exclusividade válida para todo o Brasil (setembro/2025) — reforçando
            a singularidade da solução e a segurança para parceiros e clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowPdfModal(true)}
              className="px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Ver Declaração de Exclusividade
            </button>
            <Link href="/contact">
              <button className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
                Falar com um especialista
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        id="faq"
        title="Perguntas Frequentes"
        items={faqItems}
      />

      {/* CTA Final */}
      <CTASection
        title="Leve sua operação para a próxima geração de navegação e dados."
        subtitle="Ative a Kadeh e transforme espaços físicos em experiências guiadas, decisões em tempo real e aumento de performance."
        primaryCTA="Solicitar demonstração"
      />

      {/* App Download Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Baixe o App Kadeh
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Acesse a navegação inteligente diretamente do seu smartphone
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://apps.apple.com/br/app/kadeh-shopping/id6747453355"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.91 0-1.82.55-2.25 1.51.5.89 1.86 1.99 4.25 1.99 1.5 0 2.89-.6 3.63-1.5-.74-.9-2.23-1.99-3.63-1.99zm-4.3 0c-.91 0-1.82.55-2.25 1.51.5.89 1.86 1.99 4.25 1.99 1.5 0 2.89-.6 3.63-1.5-.74-.9-2.23-1.99-3.63-1.99z"/>
              </svg>
              Apple Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.br.kadeheventos.lusa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13.5v8.75c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V13.5M3.75 3h16.5c.41 0 .75.34.75.75v9h-18v-9c0-.41.34-.75.75-.75z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* PDF Modal */}
      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">
                {pdfUrl.includes('varejo') ? 'Kadeh Varejo' : pdfUrl.includes('shopping') ? 'Kadeh Shopping' : pdfUrl.includes('saude') ? 'Kadeh Saude' : 'Apresentacao'}
              </h3>
              <button 
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-secondary rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                className="w-full h-full"
                title="Apresentacao"
                style={{ minHeight: '600px' }}
              />
            </div>
            <div className="p-6 border-t border-border flex gap-4 justify-end">
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-6 py-2 border border-border rounded-md font-medium hover:bg-secondary transition-colors"
              >
                Fechar
              </button>
              <a
                href={pdfUrl}
                download
                className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Baixar PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
