import { useLocation } from "wouter";
import {
  MapPin,
  ShoppingCart,
  Sparkles,
  Info,
  Navigation,
  Users,
  Car,
  Bath,
  DoorOpen,
  CheckCircle,
  ArrowRight,
  Route,
  Landmark,
  Store,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function KadehLocaliza() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"mercado" | "museu">("mercado");

  const handleDemo = () => navigate("/pt/contact");

  const commonFeatures = [
    {
      icon: <Bath className="w-5 h-5" />,
      title: "Banheiros",
      description: "Localização em tempo real dos banheiros mais próximos com indicação de disponibilidade.",
    },
    {
      icon: <DoorOpen className="w-5 h-5" />,
      title: "Saídas e Acessos",
      description: "Rotas para todas as saídas, incluindo saídas de emergência e acessos para PCD.",
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: "Táxis e Aplicativos",
      description: "Pontos de táxi, Uber, 99 e outros aplicativos de transporte com tempo estimado.",
    },
    {
      icon: <Navigation className="w-5 h-5" />,
      title: "Navegação Precisa",
      description: "Rotas passo a passo dentro do espaço, com indicações visuais claras e acessíveis.",
    },
  ];

  const mercadoFeatures = [
    {
      icon: <Route className="w-6 h-6" />,
      title: "Rotas Otimizadas entre Boxes",
      description:
        "Selecione múltiplos boxes de interesse e o Kadeh Localiza cria a rota mais eficiente para visitar todos, economizando tempo e evitando voltas desnecessárias.",
      highlight: true,
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: "Seleção de Múltiplos Boxes",
      description:
        "Adicione vários boxes à sua lista de compras e visualize no mapa a localização de cada um. Filtre por especialidade: carnes, frios, hortifrúti, temperos, peixes e muito mais.",
      highlight: false,
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Agente de IA para Compras",
      description:
        "A IA analisa seus produtos selecionados e sugere complementares: escolheu carne? Ela indica temperos, acompanhamentos e até receitas. Aprende com suas visitas anteriores para personalizar cada vez mais.",
      highlight: true,
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Lista de Compras Inteligente",
      description:
        "Monte sua lista antes de chegar. O app organiza os itens pela ordem dos boxes no percurso, garantindo que você não esqueça nada e não precise voltar.",
      highlight: false,
    },
  ];

  const museuFeatures = [
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Roteiro Personalizado de Visita",
      description:
        "Crie seu roteiro com base nos seus interesses: arte moderna, história, ciências. O app organiza a visita pela ordem geográfica das obras, otimizando o tempo disponível.",
      highlight: true,
    },
    {
      icon: <Info className="w-6 h-6" />,
      title: "Popup de Informações das Obras",
      description:
        "Ao se aproximar de uma obra ou escanear o QR code, um popup rico aparece com título, artista, período, técnica, curiosidades e contexto histórico — sem precisar de audioguia físico.",
      highlight: true,
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Experiências Alinhadas por Interesse",
      description:
        "Filtre as obras por tema, período histórico ou artista. O sistema cria um percurso coerente e enriquecedor, com sugestões de conexões entre obras e exposições relacionadas.",
      highlight: false,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Gestão de Tempo da Visita",
      description:
        "Informe quanto tempo você tem disponível e o app monta um roteiro realista, priorizando as obras mais relevantes para o seu perfil e garantindo que você veja o que mais importa.",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1e4976] to-[#0d2d4a] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                Kadeh Localiza
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Navegação indoor que{" "}
                <span className="text-orange-400">transforma experiências</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Do Mercado Municipal ao Museu: rotas precisas, IA para sugestões
                inteligentes e informações na palma da mão. Cada visita se torna
                única, eficiente e memorável.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDemo}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
                >
                  Solicitar demonstração
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/pt/varejo")}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
                >
                  Ver todas as soluções
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div
                  className={`p-5 rounded-2xl cursor-pointer transition-all ${activeTab === "mercado" ? "bg-orange-500 text-white shadow-lg scale-105" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
                  onClick={() => setActiveTab("mercado")}
                >
                  <Store className="w-8 h-8 mb-3" />
                  <p className="font-bold text-sm">Mercados Municipais</p>
                  <p className="text-xs mt-1 opacity-80">Boxes, rotas e IA</p>
                </div>
                <div
                  className={`p-5 rounded-2xl cursor-pointer transition-all ${activeTab === "museu" ? "bg-orange-500 text-white shadow-lg scale-105" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
                  onClick={() => setActiveTab("museu")}
                >
                  <Landmark className="w-8 h-8 mb-3" />
                  <p className="font-bold text-sm">Museus</p>
                  <p className="text-xs mt-1 opacity-80">Roteiros e obras</p>
                </div>
                <div className="col-span-2 p-5 rounded-2xl bg-white/10 text-blue-100">
                  <Users className="w-8 h-8 mb-3 text-orange-300" />
                  <p className="font-bold text-sm">Funcionalidades Comuns</p>
                  <p className="text-xs mt-1 opacity-80">
                    Banheiros, saídas, táxis e mais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab("mercado")}
              className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "mercado"
                  ? "border-orange-500 text-orange-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Store className="w-4 h-4" />
              Mercados Municipais
            </button>
            <button
              onClick={() => setActiveTab("museu")}
              className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "museu"
                  ? "border-orange-500 text-orange-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Landmark className="w-4 h-4" />
              Museus
            </button>
          </div>
        </div>
      </section>

      {/* Mercado Municipal Section */}
      {activeTab === "mercado" && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Store className="w-4 h-4" />
                Mercados Municipais
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                A experiência completa no Mercado Municipal
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transforme a visita ao mercado em uma experiência eficiente e
                prazerosa. Rotas entre boxes, lista de compras inteligente e um
                agente de IA que conhece seus gostos.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {mercadoFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border ${
                    feature.highlight
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.highlight
                        ? "bg-orange-500 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.highlight && (
                    <div className="mt-4 flex items-center gap-1 text-orange-600 text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      Funcionalidade exclusiva com IA
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* How it works - Mercado */}
            <div className="bg-gradient-to-r from-[#1a3a5c] to-[#1e4976] rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Como funciona no Mercado Municipal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Chegue e abra o app",
                    desc: "O Kadeh detecta sua localização automaticamente dentro do mercado.",
                  },
                  {
                    step: "2",
                    title: "Selecione os boxes",
                    desc: "Escolha os boxes que deseja visitar ou adicione produtos à sua lista.",
                  },
                  {
                    step: "3",
                    title: "Siga a rota otimizada",
                    desc: "O app traça o caminho mais eficiente entre todos os boxes selecionados.",
                  },
                  {
                    step: "4",
                    title: "IA sugere complementos",
                    desc: "Conforme você compra, a IA sugere produtos complementares e receitas.",
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-bold mb-2">{item.title}</h4>
                    <p className="text-blue-200 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Museu Section */}
      {activeTab === "museu" && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Landmark className="w-4 h-4" />
                Museus e Centros Culturais
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Uma visita cultural enriquecida e personalizada
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cada obra conta uma história. O Kadeh Localiza entrega essa
                história no momento certo, no lugar certo, com roteiros que
                respeitam seu tempo e seus interesses.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {museuFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border ${
                    feature.highlight
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.highlight
                        ? "bg-purple-600 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.highlight && (
                    <div className="mt-4 flex items-center gap-1 text-purple-600 text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Experiência imersiva
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Popup de Obra - Visual Example */}
            <div className="bg-gray-50 rounded-3xl p-10 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Exemplo: Popup de Informação de Obra
              </h3>
              <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32 flex items-center justify-center">
                  <Landmark className="w-16 h-16 text-white/60" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Abaporu
                      </h4>
                      <p className="text-purple-600 text-sm font-medium">
                        Tarsila do Amaral
                      </p>
                    </div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                      1928
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Óleo sobre tela. Uma das obras mais importantes do
                    Modernismo brasileiro, símbolo do Movimento Antropofágico.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      Modernismo
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      Óleo sobre tela
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    Ver mais detalhes
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* How it works - Museu */}
            <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Como funciona no Museu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: "1",
                    title: "Defina seus interesses",
                    desc: "Escolha temas, períodos ou artistas que deseja explorar na visita.",
                  },
                  {
                    step: "2",
                    title: "Receba seu roteiro",
                    desc: "O app cria um percurso personalizado respeitando o tempo disponível.",
                  },
                  {
                    step: "3",
                    title: "Navegue com precisão",
                    desc: "Siga as rotas indoor e chegue a cada obra sem se perder.",
                  },
                  {
                    step: "4",
                    title: "Mergulhe na obra",
                    desc: "Popup com informações ricas aparece automaticamente ao se aproximar.",
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-bold mb-2">{item.title}</h4>
                    <p className="text-blue-200 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Common Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Funcionalidades Comuns
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Presentes em todos os ambientes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mercados Municipais, Museus e qualquer espaço indoor contam com
              estas funcionalidades essenciais para o bem-estar e a autonomia do
              visitante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1a3a5c] to-[#0d2d4a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Leve o Kadeh Localiza para o seu espaço
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Mercados Municipais, Museus, Shoppings, Hospitais, Aeroportos — o
            Kadeh Localiza se adapta a qualquer ambiente indoor e transforma a
            experiência dos seus visitantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDemo}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 text-lg font-semibold"
            >
              Solicitar demonstração gratuita
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/pt/varejo")}
              className="border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg bg-transparent"
            >
              Ver outras soluções
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
