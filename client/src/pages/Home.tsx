/**
 * Home Page — Kadeh
 * Design: Tech-Forward Minimalism
 * SEO: Optimized with semantic HTML, proper heading hierarchy, meta tags
 */

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

import Footer from "@/components/Footer";
import {
  MapPin,
  Zap,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  Grid3X3,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Link } from "wouter";
import PresentationCarousel from "@/components/PresentationCarousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import HelpButton from "@/components/HelpButton";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [showCarousel, setShowCarousel] = useState(false);
  const [presentationName, setPresentationName] = useState<string>("");
  const [presentationTitle, setPresentationTitle] = useState<string>("");

  const handlePresentationClick = (url: string) => {
    let name = 'kadeh-lojas-mercados';
    let title = 'Kadeh Lojas & Mercados';
    
    if (url.includes('shopping')) {
      name = 'kadeh-shopping';
      title = 'Kadeh Shopping';
    } else if (url.includes('lojas-mercados')) {
      name = 'kadeh-lojas-mercados';
      title = 'Kadeh Lojas & Mercados';
    } else if (url.includes('localiza')) {
      name = 'kadeh-localiza';
      title = 'Kadeh Localiza';
    } else if (url.includes('eventos')) {
      name = 'kadeh-eventos';
      title = 'Kadeh Eventos';
    } else if (url.includes('picking')) {
      name = 'kadeh-picking';
      title = 'Kadeh Picking';
    } else if (url.includes('ads')) {
      name = 'kadeh-ads';
      title = 'Kadeh Ads';
    }
    
    setPresentationName(name);
    setPresentationTitle(title);
    setShowCarousel(true);
  };

  // Create deliverables with icons
  const iconMap = {
    0: <MapPin className="w-6 h-6" />,
    1: <Zap className="w-6 h-6" />,
    2: <TrendingUp className="w-6 h-6" />,
  };

  const deliverables = t.deliverables.items.map((item, idx) => ({
    title: item.title,
    description: item.description,
    icon: iconMap[idx as keyof typeof iconMap],
  }));

  // Create solutions with icons and URLs
  const solutionIconMap = {
    0: <BarChart3 className="w-6 h-6" />,
    1: <MapPin className="w-6 h-6" />,
    2: <Users className="w-6 h-6" />,
    3: <Shield className="w-6 h-6" />,
    4: <MapPin className="w-6 h-6" />,
    5: <CheckCircle className="w-6 h-6" />,
    6: <BarChart3 className="w-6 h-6" />,
    7: <Zap className="w-6 h-6" />,
  };

  const solutionUrls = [
    { presentationUrl: "/presentation-images/kadeh-lojas-mercados" },
    { presentationUrl: "/presentation-images/kadeh-shopping" },
    { presentationUrl: "/presentation-images/kadeh-eventos" },
    { presentationUrl: "/presentation-images/kadeh-saude" },
    { presentationUrl: "/presentation-images/kadeh-localiza" },
    { presentationUrl: "/presentation-images/kadeh-picking" },
    { externalUrl: "https://kadeh.io/smart-layout" },
    { presentationUrl: "/presentation-images/kadeh-ads" },
  ];

  const solutions = t.solutions.items.map((item, idx) => ({
    title: item.title,
    description: item.description,
    icon: solutionIconMap[idx as keyof typeof solutionIconMap],
    ...solutionUrls[idx],
  }));

  return (
    <>
      <Header />

      {/* Hero */}
      <Hero
        title={t.hero.mainTitle}
        subtitle={t.hero.description}
        primaryCTA={t.header.requestDemo}
        secondaryCTA={t.hero.viewSolutions}
        imageUrl="/images/telaapp.png"
        imageAlt="App Kadeh - Navegação Indoor Inteligente"
      />

      {/* O que a Kadeh entrega */}
      <FeaturesSection
        title={t.deliverables.title}
        features={deliverables}
        columns={3}
      />

      {/* Soluções */}
      <FeaturesSection
        id="solucoes"
        title={t.solutions.title}
        features={solutions}
        columns={3}
        onPresentationClick={handlePresentationClick}
      />

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-secondary/20 py-20 lg:py-32 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.howItWorks.items.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed ml-14">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valor para varejo e indústria */}
      <section className="bg-white py-20 lg:py-32 border-t border-border">
        <div className="container">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
            {t.value.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Para o varejo */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t.value.forRetail}
              </h3>
              <ul className="space-y-4">
                {t.value.retailItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Para a indústria */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t.value.forIndustry}
              </h3>
              <ul className="space-y-4">
                {t.value.industryItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Propriedade Intelectual */}
      <section className="bg-card py-20 lg:py-32 border-t border-border">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            {t.technology.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            {t.technology.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/documents/declaracao-exclusividade.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
            >
              {t.technology.viewDeclaration}
            </a>
            <Link href="/contact">
              <button className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
                {t.cta.talkToSpecialist}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <CTASection
        title={t.cta.title}
        subtitle={t.cta.description}
        primaryCTA={t.header.requestDemo}
      />

      {/* App Download Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            {t.appDownload.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            {t.appDownload.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://apps.apple.com/br/app/kadeh-shopping/id6747453355"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex hover:opacity-80 transition-opacity items-center"
            >
              <img 
                src="/images/app-store-badge.png" 
                alt={t.appDownload.appStore}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.br.kadeheventos.lusa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex hover:opacity-80 transition-opacity items-center"
            >
              <img 
                src="/images/google-play.png" 
                alt={t.appDownload.googlePlay}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Presentation Carousel */}
      {showCarousel && (
        <PresentationCarousel
          isOpen={showCarousel}
          presentationName={presentationName}
          title={presentationTitle}
          onClose={() => setShowCarousel(false)}
        />
      )}

      {/* Help Button */}
      <HelpButton
        section="smart-layout-intro"
        title="Bem-vindo ao Kadeh"
        content="Plataforma de navegação indoor com IA e analytics em tempo real"
        position="bottom-left"
      />
    </>
  );
}
