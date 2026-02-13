import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdsBanner from "@/components/AdsBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function KadehShopping() {
  const { language } = useLanguage();
  const t = translations[language];

  const zones = [
    { name: language === "pt" ? "Moda e Vestuário" : "Fashion & Apparel", id: "fashion" },
    { name: language === "pt" ? "Gastronomia" : "Gastronomy", id: "gastronomy" },
    { name: language === "pt" ? "Eletrônicos" : "Electronics", id: "electronics" },
    { name: language === "pt" ? "Beleza e Bem-estar" : "Beauty & Wellness", id: "beauty" },
    { name: language === "pt" ? "Serviços" : "Services", id: "services" },
    { name: language === "pt" ? "Entretenimento" : "Entertainment", id: "entertainment" },
  ];

  return (
    <>
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
              <ChevronLeft className="w-5 h-5" />
              {language === "pt" ? "Voltar" : "Back"}
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-16">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {language === "pt" ? "Kadeh Shopping" : "Kadeh Shopping"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {language === "pt"
              ? "Navegação de shopping centers, rotas inteligentes para lojas e serviços, com anúncios contextualizados."
              : "Shopping center navigation, smart routes to stores and services, with contextualized ads."}
          </p>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {language === "pt" ? "Anúncios em Destaque" : "Featured Ads"}
          </h2>
          <AdsBanner category="all" language={language} />
        </div>
      </section>

      {/* Zones with Ads */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            {language === "pt" ? "Anúncios por Zona" : "Ads by Zone"}
          </h2>

          <div className="space-y-16">
            {zones.map((zone) => (
              <div key={zone.id} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  {zone.name}
                </h3>
                <AdsBanner category={zone.id} language={language} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            {language === "pt" ? "Benefícios para Shopping Centers" : "Benefits for Shopping Centers"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Navegação Facilitada" : "Easier Navigation"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Visitantes encontram lojas e serviços com rotas otimizadas e sem se perder."
                  : "Visitors find stores and services with optimized routes without getting lost."}
              </p>
            </div>

            <div className="p-6 bg-pink-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Experiência Melhorada" : "Enhanced Experience"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Aumente permanência e gastos com experiência fluida e intuitiva."
                  : "Increase dwell time and spending with a smooth and intuitive experience."}
              </p>
            </div>

            <div className="p-6 bg-indigo-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Receita com Anúncios" : "Ad Revenue"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Monetize com anúncios segmentados por zona e tipo de visitante."
                  : "Monetize with ads targeted by zone and visitor type."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            {language === "pt" ? "Impacto Comprovado" : "Proven Impact"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+35%</div>
              <p className="text-muted-foreground">
                {language === "pt" ? "Aumento de Permanência" : "Increased Dwell Time"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+28%</div>
              <p className="text-muted-foreground">
                {language === "pt" ? "Mais Visitas a Lojas" : "More Store Visits"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+42%</div>
              <p className="text-muted-foreground">
                {language === "pt" ? "Maior Satisfação" : "Higher Satisfaction"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">+18%</div>
              <p className="text-muted-foreground">
                {language === "pt" ? "Crescimento de Vendas" : "Sales Growth"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {language === "pt"
              ? "Transforme seu shopping center"
              : "Transform your shopping center"}
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            {language === "pt"
              ? "Implemente Kadeh Shopping e ofereça experiência excepcional aos visitantes."
              : "Implement Kadeh Shopping and offer an exceptional experience to visitors."}
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {language === "pt" ? "Solicitar Demonstração" : "Request Demo"}
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
