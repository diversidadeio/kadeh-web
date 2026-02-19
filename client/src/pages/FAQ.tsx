/**
 * FAQ Page — Frequently Asked Questions
 * Design: Clean Q&A layout with team image
 * Content: Only questions and answers, no solutions section
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";

export default function FAQ() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <Header />

      {/* Hero Section with Team Image */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20 lg:py-32 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {language === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {language === 'pt' 
                  ? 'Encontre respostas para as dúvidas mais comuns sobre a plataforma Kadeh, suas funcionalidades e como ela pode transformar seu negócio.'
                  : 'Find answers to the most common questions about the Kadeh platform, its features, and how it can transform your business.'
                }
              </p>
              <div className="flex gap-4">
                <a
                  href={language === 'pt' ? '/pt/contact' : '/en/contact'}
                  className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  {language === 'pt' ? 'Falar com especialista' : 'Talk to a specialist'}
                </a>
              </div>
            </div>

            {/* Team Image */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/bgnmxGRKmVzIuAHc.png"
                alt={language === 'pt' ? 'Equipe Kadeh' : 'Kadeh Team'}
                className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        id="faq"
        title={t.faq.title}
        items={t.faq.items}
      />

      {/* CTA Section */}
      <section className="bg-primary text-white py-20 lg:py-32 border-t border-border">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {language === 'pt' 
              ? 'Ainda tem dúvidas?'
              : 'Still have questions?'
            }
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {language === 'pt'
              ? 'Nossa equipe está pronta para ajudar. Entre em contato conosco para uma conversa personalizada.'
              : 'Our team is ready to help. Contact us for a personalized conversation.'
            }
          </p>
          <a
            href={language === 'pt' ? '/pt/contact' : '/en/contact'}
            className="inline-flex px-8 py-4 bg-white text-primary rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            {language === 'pt' ? 'Solicitar demonstração' : 'Request a demo'}
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
