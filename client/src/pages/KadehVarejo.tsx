import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdsBanner from "@/components/AdsBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function KadehVarejo() {
  const { language } = useLanguage();
  const t = translations[language];

  const categories = [
    { name: language === "pt" ? "Bebidas" : "Beverages", id: "beverages" },
    { name: language === "pt" ? "Higiene" : "Hygiene", id: "hygiene" },
    { name: language === "pt" ? "Eletrônicos" : "Electronics", id: "electronics" },
    { name: language === "pt" ? "Alimentos" : "Food", id: "food" },
    { name: language === "pt" ? "Limpeza" : "Cleaning", id: "cleaning" },
    { name: language === "pt" ? "Congelados" : "Frozen", id: "frozen" },
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
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {language === "pt" ? "Kadeh Varejo" : "Kadeh Retail"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {language === "pt"
              ? "Navegação inteligente, recomendações com IA e anúncios segmentados para aumentar vendas e conversão."
              : "Intelligent navigation, AI-powered recommendations, and targeted ads to increase sales and conversion."}
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

      {/* Categories with Ads */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            {language === "pt" ? "Anúncios por Categoria" : "Ads by Category"}
          </h2>

          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  {category.name}
                </h3>
                <AdsBanner category={category.id} language={language} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            {language === "pt" ? "Benefícios para o Varejo" : "Benefits for Retail"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Navegação Intuitiva" : "Intuitive Navigation"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Clientes encontram produtos mais rapidamente com navegação guiada por IA."
                  : "Customers find products faster with AI-guided navigation."}
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Recomendações Personalizadas" : "Personalized Recommendations"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Aumente o ticket médio com sugestões inteligentes de produtos complementares."
                  : "Increase average ticket with smart suggestions for complementary products."}
              </p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg">
              <h4 className="text-xl font-semibold text-foreground mb-3">
                {language === "pt" ? "Anúncios Segmentados" : "Targeted Ads"}
              </h4>
              <p className="text-muted-foreground">
                {language === "pt"
                  ? "Monetize com anúncios relevantes por categoria e região."
                  : "Monetize with relevant ads by category and region."}
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
              ? "Pronto para transformar seu varejo?"
              : "Ready to transform your retail?"}
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            {language === "pt"
              ? "Implemente Kadeh Varejo e aumente vendas, conversão e satisfação do cliente."
              : "Implement Kadeh Retail and increase sales, conversion, and customer satisfaction."}
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
