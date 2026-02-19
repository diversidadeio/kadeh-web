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

export default function Home() {
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
    },
    {
      title: "Kadeh Shopping",
      description:
        "Navegação do estacionamento às lojas e serviços, com rotas para facilidades e segurança.",
      icon: <MapPin className="w-6 h-6" />,
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
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/gRqmaLVQUpXSRVmj.png"
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
            <button className="px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors">
              Ver Declaração de Exclusividade
            </button>
            <button className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
              Falar com um especialista
            </button>
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

      <Footer />
    </>
  );
}
