/**
 * Picking Page — Kadeh Picking para E-commerce
 * Design: Tech-Forward Minimalism
 * SEO: Optimized for picking, warehouse, e-commerce keywords
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
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
  const { language } = useLanguage();
  const t = translations[language];

  const pickingFeatures = [
    {
      title: language === 'pt' ? "Picking List Inteligente" : "Intelligent Picking List",
      description: language === 'pt' 
        ? "Listas de picking otimizadas por rota, reduzindo tempo de deslocamento e aumentando produtividade."
        : "Picking lists optimized by route, reducing travel time and increasing productivity.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Navegação em Tempo Real" : "Real-time Navigation",
      description: language === 'pt'
        ? "Guia passo a passo dentro do armazém com indicação precisa de localização de produtos."
        : "Step-by-step guidance inside the warehouse with precise product location indication.",
      icon: <Map className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Código de Barras & QR" : "Barcode & QR Code",
      description: language === 'pt'
        ? "Validação instantânea de produtos com leitura de código de barras ou QR code integrada."
        : "Instant product validation with integrated barcode or QR code reading.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Rastreamento em Tempo Real" : "Real-time Tracking",
      description: language === 'pt'
        ? "Acompanhamento live de cada picking, com status de conclusão e alertas de anomalias."
        : "Live tracking of each picking with completion status and anomaly alerts.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Relatórios de Produtividade" : "Productivity Reports",
      description: language === 'pt'
        ? "Dashboard com métricas de picking por funcionário, turno e produto para otimização contínua."
        : "Dashboard with picking metrics by employee, shift and product for continuous optimization.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: language === 'pt' ? "Integração com Sistemas" : "System Integration",
      description: language === 'pt'
        ? "Conexão com ERP, WMS e plataformas de e-commerce para sincronização automática de pedidos."
        : "Connection with ERP, WMS and e-commerce platforms for automatic order synchronization.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      title: language === 'pt' ? "Redução de Tempo de Picking" : "Picking Time Reduction",
      description: language === 'pt'
        ? "Rotas otimizadas reduzem tempo de coleta em até 40%, aumentando volume processado."
        : "Optimized routes reduce collection time by up to 40%, increasing processed volume.",
    },
    {
      title: language === 'pt' ? "Redução de Erros" : "Error Reduction",
      description: language === 'pt'
        ? "Validação em tempo real com código de barras elimina picking incorreto e devoluções."
        : "Real-time validation with barcode eliminates incorrect picking and returns.",
    },
    {
      title: language === 'pt' ? "Melhor Experiência do Entregador" : "Better Delivery Experience",
      description: language === 'pt'
        ? "Interface intuitiva e clara reduz necessidade de treinamento e aumenta satisfação."
        : "Intuitive and clear interface reduces training needs and increases satisfaction.",
    },
    {
      title: language === 'pt' ? "Visibilidade Operacional" : "Operational Visibility",
      description: language === 'pt'
        ? "Gerentes acompanham picking em tempo real e identificam gargalos imediatamente."
        : "Managers track picking in real-time and identify bottlenecks immediately.",
    },
    {
      title: language === 'pt' ? "Escalabilidade" : "Scalability",
      description: language === 'pt'
        ? "Sistema suporta múltiplos armazéns, turnos e volumes crescentes sem perda de eficiência."
        : "System supports multiple warehouses, shifts and growing volumes without efficiency loss.",
    },
    {
      title: language === 'pt' ? "Conformidade LGPD" : "LGPD Compliance",
      description: language === 'pt'
        ? "Dados de funcionários e rastreamento implementados com premissas de privacidade."
        : "Employee data and tracking implemented with privacy premises.",
    },
  ];

  const howItWorks = [
    {
      title: language === 'pt' ? "Pedido Recebido" : "Order Received",
      description: language === 'pt'
        ? "Pedido chega no sistema e é automaticamente adicionado à fila de picking."
        : "Order arrives in the system and is automatically added to the picking queue.",
    },
    {
      title: language === 'pt' ? "Rota Otimizada" : "Optimized Route",
      description: language === 'pt'
        ? "Sistema calcula a rota mais eficiente no armazém para coletar todos os itens."
        : "System calculates the most efficient route in the warehouse to collect all items.",
    },
    {
      title: language === 'pt' ? "Picking com Validação" : "Picking with Validation",
      description: language === 'pt'
        ? "Funcionário segue rota e valida cada item com código de barras ou QR code."
        : "Employee follows route and validates each item with barcode or QR code.",
    },
    {
      title: language === 'pt' ? "Consolidação" : "Consolidation",
      description: language === 'pt'
        ? "Itens são consolidados e preparados para embalagem e envio."
        : "Items are consolidated and prepared for packaging and shipment.",
    },
    {
      title: language === 'pt' ? "Rastreamento" : "Tracking",
      description: language === 'pt'
        ? "Dados de picking são registrados para análise de produtividade e otimização."
        : "Picking data is recorded for productivity analysis and optimization.",
    },
  ];

  const faqItems = [
    {
      question: language === 'pt' ? "Qual é o tempo médio de implementação?" : "What is the average implementation time?",
      answer: language === 'pt'
        ? "Tipicamente 2-4 semanas, dependendo do tamanho do armazém e complexidade da integração com sistemas existentes."
        : "Typically 2-4 weeks, depending on warehouse size and complexity of integration with existing systems.",
    },
    {
      question: language === 'pt' ? "É necessário hardware especial?" : "Is special hardware necessary?",
      answer: language === 'pt'
        ? "Não. Funciona em smartphones e tablets com Android ou iOS, aproveitando equipamentos que você já possui."
        : "No. It works on smartphones and tablets with Android or iOS, leveraging equipment you already have.",
    },
    {
      question: language === 'pt' ? "Como funciona a integração com ERP/WMS?" : "How does ERP/WMS integration work?",
      answer: language === 'pt'
        ? "Integramos via API com seus sistemas existentes, sincronizando pedidos, inventário e dados de picking em tempo real."
        : "We integrate via API with your existing systems, synchronizing orders, inventory and picking data in real-time.",
    },
    {
      question: language === 'pt' ? "Posso usar em múltiplos armazéns?" : "Can I use it in multiple warehouses?",
      answer: language === 'pt'
        ? "Sim. O sistema é escalável e suporta múltiplos armazéns, turnos e equipes com relatórios consolidados."
        : "Yes. The system is scalable and supports multiple warehouses, shifts and teams with consolidated reports.",
    },
    {
      question: language === 'pt' ? "Qual é o ROI esperado?" : "What is the expected ROI?",
      answer: language === 'pt'
        ? "Redução de 30-40% no tempo de picking, redução de 80%+ em erros, e aumento de satisfação do cliente compensam o investimento em 3-6 meses."
        : "30-40% reduction in picking time, 80%+ reduction in errors, and increased customer satisfaction offset the investment in 3-6 months.",
    },
    {
      question: language === 'pt' ? "Como é feita a segurança dos dados?" : "How is data security handled?",
      answer: language === 'pt'
        ? "Todos os dados são criptografados em trânsito e em repouso, com conformidade LGPD e backup automático."
        : "All data is encrypted in transit and at rest, with LGPD compliance and automatic backup.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title={language === 'pt' 
          ? "Picking eficiente para e-commerce: da lista ao envio, sem erros."
          : "Efficient picking for e-commerce: from list to shipment, error-free."}
        subtitle={language === 'pt'
          ? "Kadeh Picking otimiza o fluxo de coleta de mercadorias com rotas inteligentes, validação em tempo real e rastreamento completo — reduzindo tempo, erros e aumentando produtividade de entregadores e funcionários de loja."
          : "Kadeh Picking optimizes the merchandise collection flow with intelligent routes, real-time validation and complete tracking — reducing time, errors and increasing productivity of delivery personnel and store employees."}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Ver funcionalidades" : "View Features"}
        imageUrl="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/GNSBltnJHqUwvOJv.png"
        imageAlt={language === 'pt' ? "Picking eficiente com Kadeh" : "Efficient picking with Kadeh"}
      />

      {/* Funcionalidades */}
      <FeaturesSection
        title={language === 'pt' ? "Funcionalidades Kadeh Picking" : "Kadeh Picking Features"}
        subtitle={language === 'pt' 
          ? "Tudo que você precisa para picking rápido, preciso e rastreável."
          : "Everything you need for fast, accurate and trackable picking."}
        features={pickingFeatures}
        columns={3}
      />

      {/* Benefícios */}
      <FeaturesSection
        title={language === 'pt' ? "Benefícios Comprovados" : "Proven Benefits"}
        subtitle={language === 'pt'
          ? "Resultados mensuráveis para sua operação de e-commerce."
          : "Measurable results for your e-commerce operation."}
        features={benefits}
        columns={3}
      />

      {/* Eficiência de Repositores e Picking */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem à esquerda */}
            <div className="flex justify-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/Mapadereposiçãonomercado_b5087e5e.png"
                alt={language === 'pt' ? "Kadeh Picking - Eficiência de Repositores" : "Kadeh Picking - Repositor Efficiency"}
                className="w-full max-w-md rounded-lg shadow-lg object-contain"
              />
            </div>

            {/* Texto técnico/profissional à direita */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {language === 'pt'
                    ? "Repositores e Promotores Mais Eficientes"
                    : "More Efficient Repositors and Promoters"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === 'pt'
                    ? "Kadeh Picking transforma a reposição de produtos em um processo estruturado e independente. Repositores e promotores recebem rotas otimizadas que minimizam deslocamentos desnecessários, permitindo autonomia total na reposição de categorias, devolução de produtos abandonados em carrinhos e caixas."
                    : "Kadeh Picking transforms product replenishment into a structured and independent process. Repositors and promoters receive optimized routes that minimize unnecessary movements, enabling full autonomy in category replenishment, return of abandoned products in carts and checkouts."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {language === 'pt' ? "Autonomia Operacional" : "Operational Autonomy"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'pt'
                        ? "Repositores trabalham de forma independente com rotas claras e direcionadas, reduzindo dependência de supervisão constante."
                        : "Repositors work independently with clear and directed routes, reducing dependence on constant supervision."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {language === 'pt' ? "Velocidade de Reposição" : "Replenishment Speed"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'pt'
                        ? "Rotas otimizadas reduzem o tempo de reposição em até 35%, garantindo gôndolas sempre abastecidas e prateleiras vazias minimizadas."
                        : "Optimized routes reduce replenishment time by up to 35%, ensuring shelves are always stocked and empty shelves minimized."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {language === 'pt' ? "Separação de Pedidos Acelerada" : "Accelerated Order Separation"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'pt'
                        ? "Para e-commerce, a ferramenta traça rotas eficientes para montagem de pedidos, aumentando velocidade e precisão na separação com redução de até 40% no tempo de processamento."
                        : "For e-commerce, the tool traces efficient routes for order assembly, increasing speed and accuracy in separation with up to 40% reduction in processing time."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Do pedido ao envio: fluxo otimizado" : "From order to shipment: optimized flow"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Cada etapa do picking é otimizada para máxima eficiência e precisão."
                : "Each picking stage is optimized for maximum efficiency and accuracy."}
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
            {language === 'pt' ? "Adaptado para diferentes operações" : "Adapted for different operations"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* E-commerce */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {language === 'pt' ? "E-commerce Puro" : "Pure E-commerce"}
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Picking de múltiplos canais (site, marketplace, app)" : "Picking from multiple channels (website, marketplace, app)"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Consolidação de pedidos por transportadora" : "Order consolidation by carrier"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Integração com plataformas de envio" : "Integration with shipping platforms"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Rastreamento até entrega" : "Tracking until delivery"}</span>
                </li>
              </ul>
            </div>

            {/* Varejo com Entrega */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {language === 'pt' ? "Varejo com Entrega" : "Retail with Delivery"}
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Picking de pedidos online em loja física" : "Picking online orders in physical store"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Retirada em loja (click and collect)" : "Store pickup (click and collect)"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Entrega por funcionários ou parceiros" : "Delivery by employees or partners"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Gestão de estoque integrada" : "Integrated inventory management"}</span>
                </li>
              </ul>
            </div>

            {/* Marketplace */}
            <div className="p-8 border border-border rounded-md hover:border-primary transition-colors">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {language === 'pt' ? "Marketplace & Dropshipping" : "Marketplace & Dropshipping"}
              </h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Picking de múltiplos vendedores" : "Picking from multiple sellers"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Separação automática por loja/fornecedor" : "Automatic separation by store/supplier"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Relatórios por vendedor" : "Reports by seller"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{language === 'pt' ? "Comissões e pagamentos automatizados" : "Automated commissions and payments"}</span>
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
            {language === 'pt' ? "Resultados Mensuráveis" : "Measurable Results"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-40%</div>
              <p className="text-muted-foreground">{language === 'pt' ? "Tempo de Picking" : "Picking Time"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">-80%</div>
              <p className="text-muted-foreground">{language === 'pt' ? "Erros de Picking" : "Picking Errors"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+60%</div>
              <p className="text-muted-foreground">{language === 'pt' ? "Produtividade" : "Productivity"}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">3-6m</div>
              <p className="text-muted-foreground">ROI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Heat Map de Navegação */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'pt' ? "Heat Map de Navegação (Simulado)" : "Navigation Heat Map (Simulated)"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'pt'
                ? "Visualize padrões de movimento e fluxo de clientes com nosso heat map inteligente. A sobreposição mostra a densidade de navegação em diferentes áreas da loja."
                : "Visualize movement patterns and customer flow with our intelligent heat map. The overlay shows navigation density in different store areas."}
            </p>
          </div>

          <div className="relative w-full rounded-lg overflow-hidden border border-border shadow-lg">
            {/* Heat Map Background */}
            <div className="relative w-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-4">
              {/* SVG Heat Map Grid */}
              <svg className="w-full h-auto" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
                    <stop offset="25%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
                    <stop offset="50%" style={{stopColor: '#f59e0b', stopOpacity: 0.3}} />
                    <stop offset="75%" style={{stopColor: '#ef4444', stopOpacity: 0.3}} />
                    <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 0.4}} />
                  </linearGradient>
                </defs>

                {/* Heat map zones */}
                <circle cx="200" cy="150" r="120" fill="#3b82f6" opacity="0.15" />
                <circle cx="500" cy="200" r="150" fill="#10b981" opacity="0.15" />
                <circle cx="800" cy="180" r="140" fill="#f59e0b" opacity="0.15" />
                <circle cx="350" cy="400" r="130" fill="#ef4444" opacity="0.15" />
                <circle cx="650" cy="420" r="120" fill="#dc2626" opacity="0.2" />
                <circle cx="500" cy="500" r="100" fill="#f59e0b" opacity="0.15" />

                {/* Grid lines */}
                <line x1="0" y1="0" x2="1000" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="0" y1="450" x2="1000" y2="450" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="0" y1="600" x2="1000" y2="600" stroke="#e5e7eb" strokeWidth="1" />

                <line x1="0" y1="0" x2="0" y2="600" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="500" y1="0" x2="500" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="750" y1="0" x2="750" y2="600" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                <line x1="1000" y1="0" x2="1000" y2="600" stroke="#e5e7eb" strokeWidth="1" />

                {/* Labels */}
                <text x="50" y="30" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Entrada' : 'Entrance'}</text>
                <text x="850" y="30" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Caixas' : 'Checkouts'}</text>
                <text x="450" y="570" fontSize="14" fill="#6b7280" fontWeight="bold">{language === 'pt' ? 'Zona de Alto Fluxo' : 'High Traffic Zone'}</text>
              </svg>
            </div>

            {/* Overlay Image with 50% Transparency */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028736640/BKAb3rDvcpYXRM4gHpdsfv/plantabaixadesupermercados-exemploII_ed476e79.png"
                alt={language === 'pt' ? 'Layout de Supermercado' : 'Supermarket Layout'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-400 opacity-40"></div>
              <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Baixo fluxo' : 'Low traffic'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-400 opacity-40"></div>
              <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo moderado' : 'Moderate traffic'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-40"></div>
              <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo alto' : 'High traffic'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-600 opacity-50"></div>
              <span className="text-sm text-muted-foreground">{language === 'pt' ? 'Fluxo muito alto' : 'Very high traffic'}</span>
            </div>
          </div>
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
          ? "Transforme seu picking em vantagem competitiva."
          : "Transform your picking into a competitive advantage."}
        subtitle={language === 'pt'
          ? "Reduza tempo, elimine erros e aumente satisfação do cliente com Kadeh Picking."
          : "Reduce time, eliminate errors and increase customer satisfaction with Kadeh Picking."}
        primaryCTA={language === 'pt' ? "Solicitar demonstração" : "Request Demo"}
        secondaryCTA={language === 'pt' ? "Falar com especialista" : "Talk to Specialist"}
      />

      <Footer />
    </>
  );
}
