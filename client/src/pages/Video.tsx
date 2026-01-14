/**
 * Video Page — Kadeh
 * Design: Tech-Forward Minimalism
 * Shows: Compiled video of all Kadeh solutions
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, Download } from "lucide-react";

export default function Video() {
  const solutions = [
    {
      id: 1,
      title: "Kadeh Varejo",
      description: "Navegação inteligente para aumentar vendas",
      icon: "🛒",
    },
    {
      id: 2,
      title: "Kadeh Shopping",
      description: "Experiência omnichannel desde o estacionamento",
      icon: "🏬",
    },
    {
      id: 3,
      title: "Kadeh Eventos",
      description: "Encontre stands e palestras com facilidade",
      icon: "🎪",
    },
    {
      id: 4,
      title: "Kadeh Saúde",
      description: "Jornada otimizada do paciente",
      icon: "🏥",
    },
    {
      id: 5,
      title: "Kadeh Localiza",
      description: "Navegação em aeroportos e rodoviárias",
      icon: "✈️",
    },
    {
      id: 6,
      title: "Kadeh Picking",
      description: "Picking eficiente com IA",
      icon: "📦",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">
            Conheça todas as soluções Kadeh
          </h1>
          <p className="text-xl text-muted-foreground">
            Tecnologia de geolocalização + IA para transformar espaços físicos em experiências inteligentes
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Short Video for Social Media */}
          <div className="mb-20 p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-bold text-foreground mb-4">📱 Versão para Redes Sociais</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Compartilhe esta versão curta (15 segundos) no Instagram Reels, TikTok e outras redes sociais:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Instagram Reels</p>
                <a
                  href="/videos/kadeh-short-15s.mp4"
                  download="kadeh-short-15s.mp4"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar para Instagram
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">TikTok</p>
                <a
                  href="/videos/kadeh-short-15s.mp4"
                  download="kadeh-short-15s.mp4"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar para TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Main Video Player */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Vídeo Completo (48 segundos)</h2>
            <div className="relative mx-auto" style={{ width: "50%", paddingBottom: "88.89%" }}>
              <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: "177.78%" }}>
              <video
                className="absolute top-0 left-0 w-full h-full"
                controls
                poster="/images/kadeh_logo.png"
              >
                <source src="/videos/kadeh-all-solutions.mp4" type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Vídeo compilado com todas as soluções Kadeh
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="mt-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
              Todas as Soluções em Um Só Lugar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
            Por que escolher Kadeh?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Inteligência Artificial
              </h3>
              <p className="text-muted-foreground">
                Agentes de IA que aprendem com o comportamento dos usuários para sugestões cada vez mais precisas
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Geolocalização Precisa
              </h3>
              <p className="text-muted-foreground">
                Navegação indoor sem necessidade de beacons, RFID ou antenas adicionais
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Analytics em Tempo Real
              </h3>
              <p className="text-muted-foreground">
                Dados de intenção de compra e padrões de navegação para decisões estratégicas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Pronto para transformar seu espaço?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Solicite uma demonstração e veja como Kadeh pode impulsionar seus negócios
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Play className="w-5 h-5" />
            Solicitar Demonstração
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
