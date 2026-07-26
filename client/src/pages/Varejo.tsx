/**
 * Varejo Page — Kadeh Varejo
 * Página principal do segmento Varejo com acesso a Picking, Smart Layout e Intelligence
 */
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Layout,
  Package,
  TrendingUp,
  Zap,
  MapPin,
  Target,
  CheckCircle,
  ShoppingCart,
  Users,
  Clock,
} from "lucide-react";

export default function Varejo() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const prefix = `/${language}`;

  const modules = [
    {
      id: "picking",
      title: "Kadeh Picking",
      subtitle: "Picking eficiente para E-commerce",
      description:
        "Otimize rotas de picking com IA e rastreamento em tempo real. Reduza erros, aumente a produtividade e melhore a experiência do cliente com algoritmos inteligentes de roteamento.",
      icon: <Package className="w-10 h-10 text-white" />,
      color: "from-orange-500 to-orange-700",
      hoverColor: "hover:from-orange-600 hover:to-orange-800",
      href: `${prefix}/picking`,
      features: [
        "Otimização de rotas com IA",
        "Rastreamento em tempo real",
        "Validação automática de produtos",
        "Dashboard de produtividade",
      ],
    },
    {
      id: "smart-layout",
      title: "Kadeh Smart Layout",
      subtitle: "Gestão inteligente de categorias",
      description:
        "Gerencie categorias com recomendações de frentes, posicionamento e redimensionamento de gôndolas. Maximize o espaço e aumente as vendas com layout otimizado por dados.",
      icon: <Layout className="w-10 h-10 text-white" />,
      color: "from-purple-500 to-purple-700",
      hoverColor: "hover:from-purple-600 hover:to-purple-800",
      href: `${prefix}/smart-layout`,
      features: [
        "Recomendações de frentes",
        "Posicionamento de gôndolas",
        "Visualização 3D do layout",
        "Análise de espaço por categoria",
      ],
    },
    {
      id: "localiza",
      title: "Kadeh Localiza",
      subtitle: "Navegação indoor para Mercados e Museus",
      description:
        "Rotas precisas dentro de Mercados Municipais e Museus. Selecione múltiplos boxes, deixe a IA sugerir produtos complementares e explore obras com popups informativos — tudo na palma da mão.",
      icon: <MapPin className="w-10 h-10 text-white" />,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800",
      href: `${prefix}/kadeh-localiza`,
      features: [
        "Rotas entre boxes no Mercado Municipal",
        "Agente de IA para sugestão de compras",
        "Popup de informações de obras em Museus",
        "Banheiros, saídas, táxis e aplicativos",
      ],
    },
    {
      id: "intelligence",
      title: "Kadeh Intelligence",
      subtitle: "Analytics on-time para varejo",
      description:
        "Transforme intenção de compra em insights acionáveis. Relatórios em tempo real de buscas por categorias, segmentos e produtos para operação, varejo e indústria.",
      icon: <BarChart3 className="w-10 h-10 text-white" />,
      color: "from-teal-500 to-teal-700",
      hoverColor: "hover:from-teal-600 hover:to-teal-800",
      href: `${prefix}/data-intelligence`,
      features: [
        "Intenção de compra em tempo real",
        "Análise de margens por loja",
        "Relatórios por categoria",
        "Dashboard executivo",
      ],
    },
  ];

  const stats = [
    { value: "40%", label: "Aumento médio de vendas", icon: <TrendingUp className="w-6 h-6" /> },
    { value: "30%", label: "Redução de erros no picking", icon: <CheckCircle className="w-6 h-6" /> },
    { value: "25%", label: "Otimização de espaço em gôndola", icon: <Layout className="w-6 h-6" /> },
    { value: "Real-time", label: "Analytics de intenção de compra", icon: <Zap className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 bg-opacity-50 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <ShoppingCart className="w-4 h-4" />
            Soluções para Varejo
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Kadeh Varejo
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            A plataforma completa para transformar sua operação de varejo com navegação indoor, 
            gestão inteligente de layout e analytics em tempo real.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate(`${prefix}/contact`)}
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Solicitar Demonstração <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`${prefix}/how-it-works`)}
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Como Funciona
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="flex justify-center mb-3 text-blue-600">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Módulos do Kadeh Varejo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o módulo que melhor atende sua necessidade ou combine todos para uma solução completa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-br ${module.color} p-8`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white bg-opacity-20 rounded-xl p-3">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{module.title}</h3>
                      <p className="text-sm text-white text-opacity-80">{module.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-white text-opacity-90 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <ul className="space-y-3 mb-6 flex-1">
                    {module.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate(module.href)}
                    className={`w-full bg-gradient-to-r ${module.color} ${module.hoverColor} text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2`}
                  >
                    Acessar {module.title.replace("Kadeh ", "")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o Kadeh Varejo?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Navegação Indoor com IA</h3>
                    <p className="text-gray-600">
                      Rotas claras e intuitivas para produtos, serviços e áreas essenciais. Menos fricção, mais autonomia para o consumidor.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Intenção de Compra em Tempo Real</h3>
                    <p className="text-gray-600">
                      Relatório on-time de buscas por categorias, segmentos e produtos em diferentes formatos de loja.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Integração Completa</h3>
                    <p className="text-gray-600">
                      Todos os módulos integrados em uma única plataforma, com dados compartilhados para decisões mais inteligentes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Implementação Rápida</h3>
                    <p className="text-gray-600">
                      Mapeamos o ambiente, ativamos a navegação e entregamos o dashboard em tempo recorde, sem complicações técnicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Como funciona</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Mapear", desc: "Estruturamos o ambiente com setores, lojas/POIs, categorias, serviços e rotas." },
                  { step: "2", title: "Ativar", desc: "Publicamos navegação e buscas com IA (substitutos, complementares e sugestões por interesse)." },
                  { step: "3", title: "Medir e Otimizar", desc: "Dashboard on-time com intenção de compra e padrões de busca para operação, varejo e indústria." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-blue-100 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para transformar seu varejo?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Fale com nossos especialistas e descubra como o Kadeh Varejo pode aumentar suas vendas.
          </p>
          <button
            onClick={() => navigate(`${prefix}/contact`)}
            className="bg-white text-blue-700 font-bold px-10 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg flex items-center gap-2 mx-auto"
          >
            Solicitar Demonstração <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
