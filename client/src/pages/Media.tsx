/**
 * Media/Press Page — Kadeh
 * Design: Tech-Forward Minimalism
 * Shows: Press coverage and media mentions about Kadeh
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";

export default function Media() {
  const { language } = useLanguage();
  const t = translations[language];

  const articles = [
    {
      id: 1,
      titlePt: "Kadeh apresenta app de geolocalização no Latam Retail Show",
      titleEn: "Kadeh presents geolocation app at Latam Retail Show",
      sourcePt: "Acelera Varejo",
      sourceEn: "Accelerate Retail",
      datePt: "23 de setembro de 2025",
      dateEn: "September 23, 2025",
      descriptionPt: "A empresa Kadeh Soluções apresentou uma ferramenta que une geolocalização interna + inteligência artificial para mapear rotas inteligentes dentro das lojas.",
      descriptionEn: "Kadeh Solutions presented a tool that combines indoor geolocation + artificial intelligence to map intelligent routes inside stores.",
      image: "/images/kadeh_acelera_varejo_article.avif",
      url: "https://www.aceleravarejo.com.br/home-destaque/kadeh-apresenta-app-de-geolocalizacao-no-latam-retail-show/",
    },
    {
      id: 2,
      titlePt: "Tecnologia guia consumidor pelos corredores de lojas e mercados",
      titleEn: "Technology guides consumers through store and market aisles",
      sourcePt: "Mercado & Consumo",
      sourceEn: "Market & Consumer",
      datePt: "18 de setembro de 2025",
      dateEn: "September 18, 2025",
      descriptionPt: "Kadeh lança aplicativo que traça caminhos otimizados dentro do ponto de venda, combinando geolocalização interna e Inteligência Artificial.",
      descriptionEn: "Kadeh launches an application that traces optimized paths inside the point of sale, combining indoor geolocation and Artificial Intelligence.",
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
            {language === 'pt' ? 'Mídia & Imprensa' : 'Media & Press'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'pt' 
              ? 'Cobertura de imprensa e menções sobre a Kadeh Soluções'
              : 'Press coverage and mentions about Kadeh Solutions'}
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
                    alt={language === 'pt' ? article.titlePt : article.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Article Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-orange-600 font-semibold">
                        {language === 'pt' ? article.sourcePt : article.sourceEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'pt' ? article.datePt : article.dateEn}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {language === 'pt' ? article.titlePt : article.titleEn}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {language === 'pt' ? article.descriptionPt : article.descriptionEn}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                      {language === 'pt' ? 'Ler artigo completo' : 'Read full article'}
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
                alt={language === 'pt' ? 'Kadeh no APAS Experience' : 'Kadeh at APAS Experience'}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'pt' 
                    ? 'Participação nos APAS Experience'
                    : 'Participation in APAS Experience'}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {language === 'pt'
                    ? 'A Kadeh Soluções participou dos eventos APAS Experience nas cidades de Guarulhos e São José dos Campos, apresentando sua solução inovadora de geolocalização e IA para o varejo supermercadista.'
                    : 'Kadeh Solutions participated in APAS Experience events in the cities of Guarulhos and São José dos Campos, presenting its innovative geolocation and AI solution for supermarket retail.'}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'pt'
                    ? 'A APAS (Associação Paulista de Supermercados) é a maior organização de varejo supermercadista da América Latina, reunindo os principais players do setor para discussão de tendências, inovações e estratégias de negócio.'
                    : 'APAS (São Paulo Supermarket Association) is the largest supermarket retail organization in Latin America, bringing together the main players in the sector to discuss trends, innovations, and business strategies.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'pt' ? 'Evento' : 'Event'}
                  </p>
                  <p className="font-bold text-foreground">APAS Experience</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'pt' ? 'Cidades' : 'Cities'}
                  </p>
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
            {language === 'pt' ? 'Sobre a Cobertura' : 'About the Coverage'}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {language === 'pt'
              ? 'A Kadeh Soluções foi destaque no Latam Retail Show 2025, o maior evento de varejo da América Latina. A tecnologia de geolocalização interna e inteligência artificial apresentada pela empresa gerou grande interesse da mídia especializada em varejo e tecnologia.'
              : 'Kadeh Solutions was highlighted at Latam Retail Show 2025, the largest retail event in Latin America. The indoor geolocation technology and artificial intelligence presented by the company generated great interest from specialized media in retail and technology.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                R$ 300K+
              </div>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Investimento na primeira versão do app'
                  : 'Investment in the first version of the app'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                2025
              </div>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Lançamento no Latam Retail Show'
                  : 'Launch at Latam Retail Show'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                Global
              </div>
              <p className="text-muted-foreground">
                {language === 'pt'
                  ? 'Planos de expansão internacional'
                  : 'Plans for international expansion'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-center">
            {language === 'pt' ? 'Vídeo Completo' : 'Complete Video'}
          </h2>
          <div className="relative mx-auto mb-16" style={{ width: '100%', maxWidth: '800px', paddingBottom: '56.25%' }}>
            <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
              <video
                className="absolute top-0 left-0 w-full h-full"
                controls
                poster="/images/kadeh_logo.png"
              >
                <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/tIomtiaDJuZmlYtx.mp4" type="video/mp4" />
                {language === 'pt' ? 'Seu navegador não suporta o elemento de vídeo.' : 'Your browser does not support the video element.'}
              </video>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4 text-sm">
            {language === 'pt' ? 'Vídeo compilado com todas as soluções Kadeh' : 'Compiled video with all Kadeh solutions'}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
