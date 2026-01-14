/**
 * Media/Press Page — Kadeh
 * Design: Tech-Forward Minimalism
 * Shows: Press coverage and media mentions about Kadeh
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

export default function Media() {
  const articles = [
    {
      id: 1,
      title: "Kadeh apresenta app de geolocalização no Latam Retail Show",
      source: "Acelera Varejo",
      date: "23 de setembro de 2025",
      description: "A empresa Kadeh Soluções apresentou uma ferramenta que une geolocalização interna + inteligência artificial para mapear rotas inteligentes dentro das lojas.",
      image: "/images/kadeh_acelera_varejo_article.avif",
      url: "https://www.aceleravarejo.com.br/home-destaque/kadeh-apresenta-app-de-geolocalizacao-no-latam-retail-show/",
    },
    {
      id: 2,
      title: "Tecnologia guia consumidor pelos corredores de lojas e mercados",
      source: "Mercado & Consumo",
      date: "18 de setembro de 2025",
      description: "Kadeh lança aplicativo que traça caminhos otimizados dentro do ponto de venda, combinando geolocalização interna e Inteligência Artificial.",
      image: "/images/kadeh_mercado_consumo_article.webp",
      url: "https://mercadoeconsumo.com.br/18/09/2025/latamretailshow/tecnologia-guia-consumidor-pelos-corredores-de-lojas-e-mercados/",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">
            Mídia & Imprensa
          </h1>
          <p className="text-xl text-muted-foreground">
            Cobertura de imprensa e menções sobre a Kadeh Soluções
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
              >
                {/* Article Image */}
                <div className="relative overflow-hidden bg-gray-200 h-48">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Article Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-orange-600 font-semibold">
                        {article.source}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.date}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {article.description}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                      Ler artigo completo
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* APAS Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-foreground text-center">
            APAS Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="overflow-hidden rounded-lg">
              <img
                src="/images/kadeh_apas_experience.jpg"
                alt="Kadeh no APAS Experience"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Participação nos APAS Experience
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A Kadeh Soluções participou dos eventos <strong>APAS Experience</strong> nas cidades de <strong>Guarulhos</strong> e <strong>São José dos Campos</strong>, apresentando sua solução inovadora de geolocalização e IA para o varejo supermercadista.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A APAS (Associação Paulista de Supermercados) é a maior organização de varejo supermercadista da América Latina, reunindo os principais players do setor para discussão de tendências, inovações e estratégias de negócio.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-muted-foreground mb-2">Evento</p>
                  <p className="font-bold text-foreground">APAS Experience</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-muted-foreground mb-2">Cidades</p>
                  <p className="font-bold text-foreground">Guarulhos & SJC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Sobre a Cobertura
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            A Kadeh Soluções foi destaque no <strong>Latam Retail Show 2025</strong>, 
            o maior evento de varejo da América Latina. A tecnologia de geolocalização 
            interna e inteligência artificial apresentada pela empresa gerou grande 
            interesse da mídia especializada em varejo e tecnologia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                R$ 300K+
              </div>
              <p className="text-muted-foreground">
                Investimento na primeira versão do app
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                2025
              </div>
              <p className="text-muted-foreground">
                Lançamento no Latam Retail Show
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                Global
              </div>
              <p className="text-muted-foreground">
                Planos de expansão internacional
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
