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
  const features = [
    {
      title: "Análise de Mix de Produtos",
      description:
        "Visualize o portfólio completo de categorias com informações de giro, margem e volume de vendas.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Recomendação Inteligente de Frentes",
      description:
        "Sistema recomenda o número ideal de frentes por produto baseado em giro e margem de lucratividade.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Otimização de Posicionamento",
      description:
        "Produtos posicionados automaticamente por zona (olhos, mãos, piso) para maximizar conversão.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: "Redimensionamento de Categorias",
      description:
        "Recomendações de aumento/redução de espaço de categoria para melhorar lucratividade total.",
      icon: <Layout className="w-6 h-6" />,
    },
    {
      title: "Gestão de Gôndolas",
      description:
        "Defina dimensões de gôndolas, número de prateleiras e largura disponível para cálculos precisos.",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: "Relatórios de Performance",
      description:
        "Análise detalhada de impacto de cada categoria na lucratividade total da loja.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: "Aumento de Lucratividade",
      description:
        "Produtos de alta margem ganham mais espaço e melhor posicionamento, aumentando ticket médio.",
    },
    {
      title: "Otimização de Espaço",
      description:
        "Cada centímetro de gôndola trabalha para você, eliminando desperdício e maximizando ROI.",
    },
    {
      title: "Redução de Ruptura",
      description:
        "Produtos com alto giro recebem mais frentes, reduzindo falta de estoque e perda de vendas.",
    },
    {
      title: "Melhor Experiência do Cliente",
      description:
        "Produtos mais procurados ficam em melhor posição, facilitando localização e aumentando satisfação.",
    },
    {
      title: "Decisões Baseadas em Dados",
      description:
        "Elimine suposições: cada recomendação é baseada em análise matemática de giro e margem.",
    },
    {
      title: "Implementação Rápida",
      description:
        "Recomendações prontas para implementação imediata, sem necessidade de consultoria externa.",
    },
  ];

  const howItWorks = [
    {
      title: "Cadastre Categorias",
      description:
        "Informe mix de produtos, margem de lucratividade (baixa, média, alta) e giro de mercadoria.",
    },
    {
      title: "Configure Gôndolas",
      description:
        "Defina dimensões da gôndola, número de prateleiras e largura disponível por categoria.",
    },
    {
      title: "Sistema Recomenda",
      description:
        "Kadeh Smart Layout calcula número ideal de frentes e posicionamento por zona de gôndola.",
    },
    {
      title: "Implemente",
      description:
        "Receba planograma detalhado e implemente recomendações na loja física.",
    },
    {
      title: "Acompanhe Resultados",
      description:
        "Monitore impacto nas vendas e lucratividade, ajuste conforme necessário.",
    },
  ];

  const matrix = [
    {
      giro: "Alto",
      margem: "Alta",
      frentes: 1,
      zone: "Altura dos olhos",
      share: "35%",
      color: "bg-green-600",
      label: "Maior espaço",
    },
    {
      giro: "Alto",
      margem: "Média",
      frentes: 2,
      zone: "Altura dos olhos",
      share: "25%",
      color: "bg-green-500",
      label: "Melhor espaço",
    },
    {
      giro: "Alto",
      margem: "Baixa",
      frentes: 2,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Médio",
      margem: "Alta",
      frentes: 2,
      zone: "Altura dos olhos",
      share: "25%",
      color: "bg-green-500",
      label: "Melhor espaço",
    },
    {
      giro: "Médio",
      margem: "Média",
      frentes: 3,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Médio",
      margem: "Baixa",
      frentes: 4,
      zone: "Altura das mãos",
      share: "15%",
      color: "bg-orange-400",
      label: "Pequeno espaço",
    },
    {
      giro: "Baixo",
      margem: "Alta",
      frentes: 3,
      zone: "Altura das mãos",
      share: "20%",
      color: "bg-yellow-500",
      label: "Bom espaço",
    },
    {
      giro: "Baixo",
      margem: "Média",
      frentes: 4,
      zone: "Altura das mãos",
      share: "15%",
      color: "bg-orange-400",
      label: "Pequeno espaço",
    },
    {
      giro: "Baixo",
      margem: "Baixa",
      frentes: 5,
      zone: "Lugar baixo",
      share: "5%",
      color: "bg-red-400",
      label: "Menor espaço",
    },
  ];

  const useCases = [
    {
      title: "Varejo Alimentar",
      description:
        "Otimize categorias de alimentos, bebidas e produtos de giro rápido com recomendações por sazonalidade.",
    },
    {
      title: "Varejo Geral",
      description:
        "Gerencie múltiplas categorias (vestuário, eletrônicos, higiene) com diferentes margens e giros.",
    },
    {
      title: "Farmácia",
      description:
        "Maximize lucratividade de medicamentos, cosméticos e produtos de saúde com posicionamento estratégico.",
    },
    {
      title: "Petshop",
      description:
        "Otimize espaço de rações, brinquedos e acessórios com recomendações baseadas em sazonalidade.",
    },
  ];

  const faqItems = [
    {
      question: "Como o sistema calcula o número de frentes recomendado?",
      answer:
        "O sistema usa uma matriz matemática que cruza Giro (Baixo/Médio/Alto) com Margem (Baixa/Média/Alta), recomendando de 1 a 5 frentes. Produtos com alto giro e alta margem recebem mais espaço.",
    },
    {
      question: "Posso customizar as recomendações?",
      answer:
        "Sim. Você pode ajustar manualmente as recomendações do sistema conforme sua estratégia comercial e conhecimento do ponto de venda.",
    },
    {
      question: "Como funciona o redimensionamento de categorias?",
      answer:
        "O sistema analisa lucratividade por categoria e recomenda aumento ou redução de espaço para maximizar retorno total da loja.",
    },
    {
      question: "Quais informações preciso fornecer para começar?",
      answer:
        "Você precisa informar: mix de produtos por categoria, margem de lucratividade, giro de mercadoria, dimensões das gôndolas e número de prateleiras.",
    },
    {
      question: "O sistema integra com meu ERP/PDV?",
      answer:
        "Sim. Kadeh Smart Layout integra com sistemas ERP e PDV para importar dados de giro, preço e estoque automaticamente.",
    },
    {
      question: "Quanto tempo leva para ver resultados?",
      answer:
        "Resultados são visíveis em 2-4 semanas após implementação das recomendações, com aumento de 5-15% na lucratividade média.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title="Kadeh Smart Layout: gerencie categorias com inteligência e maximize a lucratividade da loja."
        subtitle="Recomendações automáticas de número de frentes, posicionamento em gôndola e redimensionamento de categorias baseadas em mix de produtos, margem de lucratividade e giro de mercadoria."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Ver funcionalidades"
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/VgkYvznRPZEfbxYH.png"
        imageAlt="Smart Layout - Otimização de Gôndolas"
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title="Funcionalidades Kadeh Smart Layout"
        subtitle="Tudo que você precisa para gerenciar categorias com eficiência e lucratividade."
        features={features}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title="Benefícios Comprovados"
        subtitle="Resultados mensuráveis para sua operação de varejo."
        features={benefits}
        columns={3}
      />

      {/* Como Funciona */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Do cadastro à implementação: 5 passos simples
            </h2>
            <p className="text-lg text-muted-foreground">
              Processo direto para otimizar suas categorias e aumentar lucratividade.
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

      {/* Matriz de Recomendação */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Matriz de Recomendação Inteligente
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Sistema recomenda número de frentes e posicionamento baseado em Giro × Margem de Lucratividade.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Giro</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Margem</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Frentes</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Posicionamento</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">% Espaço</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-card transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{row.giro}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{row.margem}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${row.color} text-white font-bold text-sm`}>
                        {row.frentes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.zone}</td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">{row.share}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-card rounded-md border border-border">
            <h3 className="font-semibold text-foreground mb-3">Legenda de Posicionamento:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-green-600 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Maior espaço (35%)</p>
                  <p className="text-muted-foreground">Altura dos olhos - Produtos premium</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Bom espaço (20%)</p>
                  <p className="text-muted-foreground">Altura das mãos - Produtos balanceados</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-orange-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Pequeno espaço (15%)</p>
                  <p className="text-muted-foreground">Altura das mãos - Produtos secundários</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-red-400 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium text-foreground">Menor espaço (5%)</p>
                  <p className="text-muted-foreground">Lugar baixo - Produtos lentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo Prático: Azeites */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Exemplo Prático: Otimização de Categoria de Azeites
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja como o Kadeh Smart Layout recomenda o posicionamento estratégico de produtos de azeite baseado em giro e margem de lucratividade.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-md overflow-hidden border border-border">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/jdTHdlzsCxpTiPIw.png" alt="Exemplo de otimização de gôndola de azeites" className="w-full h-auto" />
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-green-50 border-l-4 border-green-600 rounded-md">
                <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Azeite Extra Virgem Premium
                </h3>
                <p className="text-green-800 mb-3"><strong>Características:</strong> Alto Giro + Alta Margem</p>
                <p className="text-green-700 text-sm mb-2"><strong>Posicionamento:</strong> Altura dos olhos (TOP SHELF) - Melhor posição da gôndola</p>
                <p className="text-green-700 text-sm mb-2"><strong>Espaço Alocado:</strong> 40% da categoria (2 frentes)</p>
                <p className="text-green-700 text-sm"><strong>Preço:</strong> R$ 89.90 - Margem: 35% | Giro: 8 unidades/semana</p>
              </div>

              <div className="p-6 bg-yellow-50 border-l-4 border-yellow-600 rounded-md">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span>
                  Azeite Extra Virgem
                </h3>
                <p className="text-yellow-800 mb-3"><strong>Características:</strong> Médio Giro + Média Margem</p>
                <p className="text-yellow-700 text-sm mb-2"><strong>Posicionamento:</strong> Altura das mãos (SECOND SHELF) - Posição balanceada</p>
                <p className="text-yellow-700 text-sm mb-2"><strong>Espaço Alocado:</strong> 35% da categoria (3 frentes)</p>
                <p className="text-yellow-700 text-sm"><strong>Preço:</strong> R$ 45.50 - Margem: 22% | Giro: 12 unidades/semana</p>
              </div>

              <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-md">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  Azeite Virgem + Óleo Composto
                </h3>
                <p className="text-blue-800 mb-3"><strong>Características:</strong> Alto Giro + Baixa Margem</p>
                <p className="text-blue-700 text-sm mb-2"><strong>Posicionamento:</strong> Altura das mãos e piso (THIRD/BOTTOM SHELF) - Posições secundárias</p>
                <p className="text-blue-700 text-sm mb-2"><strong>Espaço Alocado:</strong> 25% da categoria (6 frentes combinadas)</p>
                <p className="text-blue-700 text-sm"><strong>Preço:</strong> R$ 22.90 / R$ 12.50 - Margem: 12-15% | Giro: 20+ unidades/semana</p>
              </div>

              <div className="p-4 bg-card border border-border rounded-md">
                <h3 className="font-semibold text-foreground mb-2">📊 Resultado Esperado:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ <strong>+12% de lucratividade</strong> ao dar mais espaço para azeites premium</li>
                  <li>✓ <strong>-15% de ruptura</strong> ao posicionar produtos de alto giro adequadamente</li>
                  <li>✓ <strong>+8% de ticket médio</strong> ao destacar produtos de maior valor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Casos de Uso */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            Aplicável a Todos os Formatos de Varejo
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
            Resultados Esperados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+5-15%</div>
              <p className="text-muted-foreground">Aumento de Lucratividade</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-20%</div>
              <p className="text-muted-foreground">Redução de Ruptura</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+30%</div>
              <p className="text-muted-foreground">Melhor Uso de Espaço</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2-4w</div>
              <p className="text-muted-foreground">Tempo para Resultados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Interativo */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Teste o Smart Layout: Simulador Interativo
            </h2>
            <p className="text-lg text-muted-foreground">
              Configure sua gôndola, adicione produtos e veja as recomendações de layout em tempo real.
            </p>
          </div>
          <SmartLayoutSimulator />
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
        title="Transforme seu gerenciamento de categorias em vantagem competitiva."
        subtitle="Kadeh Smart Layout recomenda, você implementa, e a lucratividade cresce."
        primaryCTA="Solicitar demonstração"
        secondaryCTA="Falar com especialista"
      />

      <Footer />
    </>
  );
}
