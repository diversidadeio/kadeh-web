/**
 * Picking Page — Kadeh Picking para E-commerce
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for picking, warehouse, e-commerce keywords
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import {
  Zap,
  CheckCircle,
  BarChart3,
  Clock,
  Users,
  Map,
} from "lucide-react";

export default function Picking() {
  const pickingFeatures = [
    {
      title: "Picking List Inteligente",
      description:
        "Listas de picking otimizadas por rota, reduzindo tempo de deslocamento e aumentando produtividade.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Navegação em Tempo Real",
      description:
        "Guia passo a passo dentro do armazém com indicação precisa de localização de produtos.",
      icon: <Map className="w-6 h-6" />,
    },
    {
      title: "Código de Barras & QR",
      description:
        "Validação instantânea de produtos com leitura de código de barras ou QR code integrada.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Rastreamento em Tempo Real",
      description:
        "Acompanhamento live de cada picking, com status de conclusão e alertas de anomalias.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Relatórios de Produtividade",
      description:
        "Dashboard com métricas de picking por funcionário, turno e produto para otimização contínua.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Integração com Sistemas",
      description:
        "Conexão com ERP, WMS e plataformas de e-commerce para sincronização automática de pedidos.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: "Redução de Tempo de Picking",
      description:
        "Rotas otimizadas reduzem tempo de coleta em até 40%, aumentando volume processado.",
    },
    {
      title: "Redução de Erros",
      description:
        "Validação em tempo real com código de barras elimina picking incorreto e devoluções.",
    },
    {
      title: "Melhor Experiência do Entregador",
      description:
        "Interface intuitiva e clara reduz necessidade de treinamento e aumenta satisfação.",
    },
    {
      title: "Visibilidade Operacional",
      description:
        "Gerentes acompanham picking em tempo real e identificam gargalos imediatamente.",
    },
    {
      title: "Escalabilidade",
      description:
        "Sistema suporta múltiplos armazéns, turnos e volumes crescentes sem perda de eficiência.",
    },
    {
      title: "Conformidade LGPD",
      description:
        "Dados de funcionários e rastreamento implementados com premissas de privacidade.",
    },
  ];

  const howItWorks = [
    {
      title: "Pedido Recebido",
      description:
        "Pedido chega no sistema e é automaticamente adicionado à fila de picking.",
    },
    {
      title: "Rota Otimizada",
      description:
        "Sistema calcula a rota mais eficiente no armazém para coletar todos os itens.",
    },
    {
      title: "Picking com Validação",
      description:
        "Funcionário segue rota e valida cada item com código de barras ou QR code.",
    },
    {
      title: "Consolidação",
      description:
        "Itens são consolidados e preparados para embalagem e envio.",
    },
    {
      title: "Rastreamento",
      description:
        "Dados de picking são registrados para análise de produtividade e otimização.",
    },
  ];

  const faqItems = [
    {
      question: "Qual é o tempo médio de implementação?",
      answer:
        "Tipicamente 2-4 semanas, dependendo do tamanho do armazém e complexidade da integração com sistemas existentes.",
    },
    {
      question: "É necessário hardware especial?",
      answer:
        "Não. Funciona em smartphones e tablets com Android ou iOS, aproveitando equipamentos que você já possui.",
    },
    {
      question: "Como funciona a integração com ERP/WMS?",
      answer:
        "Integramos via API com seus sistemas existentes, sincronizando pedidos, inventário e dados de picking em tempo real.",
    },
    {
      question: "Posso usar em múltiplos armazéns?",
      answer:
        "Sim. O sistema é escalável e suporta múltiplos armazéns, turnos e equipes com relatórios consolidados.",
    },
    {
      question: "Qual é o ROI esperado?",
      answer:
        "Redução de 30-40% no tempo de picking, redução de 80%+ em erros, e aumento de satisfação do cliente compensam o investimento em 3-6 meses.",
    },
    {
      question: "Como é feita a segurança dos dados?",
      answer:
        "Todos os dados são criptografados em trânsito e em repouso, com conformidade LGPD e backup automático.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title="Picking eficiente para e-commerce: da lista ao envio, sem erros."
        subtitle="Kadeh Picking otimiza o fluxo de coleta de mercadorias com rotas inteligentes, validação em tempo real e rastreamento completo — reduzindo tempo, erros e aumentando produtividade de entregadores e funcionários de loja."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Ver funcionalidades"
        imageUrl="/images/picking-delivery-person.png"
        imageAlt="Picking eficiente com Kadeh"
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title="Funcionalidades Kadeh Picking"
        subtitle="Tudo que você precisa para picking rápido, preciso e rastreável."
        features={pickingFeatures}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title="Benefícios Comprovados"
        subtitle="Resultados mensuráveis para sua operação de e-commerce."
        features={benefits}
        columns={3}
      />

      {/* Como Funciona */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Do pedido ao envio: fluxo otimizado
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada etapa do picking é otimizada para máxima eficiência e precisão.
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

      {/* Casos de Uso */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            Adaptado para diferentes operações
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* E-commerce */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                E-commerce Puro
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Picking de múltiplos canais (site, marketplace, app)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Consolidação de pedidos por transportadora</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Integração com plataformas de envio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Rastreamento até entrega</span>
                </li>
              </ul>
            </div>

            {/* Varejo com Entrega */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Varejo com Entrega
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Picking de pedidos online em loja física</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Retirada em loja (click and collect)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Entrega por funcionários ou parceiros</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Gestão de estoque integrada</span>
                </li>
              </ul>
            </div>

            {/* Marketplace */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Marketplace & Dropshipping
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Picking de múltiplos vendedores</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Separação automática por loja/fornecedor</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Relatórios por vendedor</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Comissões e pagamentos automatizados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
            Resultados Mensuráveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-40%</div>
              <p className="text-muted-foreground">Tempo de Picking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-80%</div>
              <p className="text-muted-foreground">Erros de Picking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+60%</div>
              <p className="text-muted-foreground">Produtividade</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">3-6m</div>
              <p className="text-muted-foreground">ROI</p>
            </div>
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
        title="Transforme seu picking em vantagem competitiva."
        subtitle="Reduza tempo, elimine erros e aumente satisfação do cliente com Kadeh Picking."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Falar com especialista"
      />

      <Footer />
    </>
  );
}
