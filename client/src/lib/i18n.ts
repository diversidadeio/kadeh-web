export type Language = 'pt' | 'en';

export const translations = {
  pt: {
    // Header & Navigation
    header: {
      solutions: 'Soluções',
      picking: 'Picking',
      smartLayout: 'Smart Layout',
      intelligence: 'Intelligence',
      howItWorks: 'Como Funciona',
      media: 'Mídia',
      video: 'Vídeo',
      faq: 'FAQ',
      talkToSpecialist: 'Falar com especialista',
      requestDemo: 'Solicitar demonstração',
    },

    // Hero Section
    hero: {
      mainTitle: 'Kadeh: navegação indoor + IA + analytics on-time para transformar espaços físicos em vendas e eficiência.',
      description: 'A plataforma que une experiência simples para qualquer público com otimização operacional e dados em tempo real de intenção de compra — com tecnologia registrada no INPI e Declaração de Exclusividade válida para todo o Brasil (setembro/2025).',
      features: ['IA de recomendações', 'Navegação precisa', 'Dashboard on-time', 'Integrações via API', 'LGPD-ready'],
      viewSolutions: 'Ver soluções',
    },

    // Deliverables Section
    deliverables: {
      title: 'Uma plataforma. Cinco soluções. Um resultado: mais autonomia, mais vendas, mais eficiência.',
      items: [
        {
          title: 'Navegação que qualquer pessoa entende',
          description: 'Rotas claras e intuitivas para produtos, serviços e áreas essenciais. Menos fricção. Mais autonomia.',
        },
        {
          title: 'IA para vender mais',
          description: 'Recomendação inteligente de substitutos, complementares e melhor rota de compra, a partir da busca do consumidor.',
        },
        {
          title: 'Intenção de compra em tempo real',
          description: 'Relatório on-time de buscas por categorias, segmentos e produtos em diferentes formatos de loja/ambiente.',
        },
      ],
    },

    // Solutions Section
    solutions: {
      title: 'Soluções desenhadas para cada ambiente',
      items: [
        {
          title: 'Kadeh Varejo',
          description: 'Localize produtos, aumente conversão e gere eficiência operacional com dados em tempo real.',
        },
        {
          title: 'Kadeh Shopping',
          description: 'Navegação do estacionamento às lojas e serviços, com rotas para facilidades e segurança.',
        },
        {
          title: 'Kadeh Eventos',
          description: 'Encontre stands e palestras, monte roteiro e receba sugestões por interesse via IA.',
        },
        {
          title: 'Kadeh Saúde',
          description: 'Melhore a jornada do paciente e otimize a gestão de equipamentos e ativos móveis.',
        },
        {
          title: 'Kadeh Localiza',
          description: 'Aeroportos, rodoviárias e serviços públicos com rotas certeiras, menos filas e menos necessidade de orientação humana.',
        },
        {
          title: 'Kadeh Picking',
          description: 'Picking eficiente para e-commerce com rotas otimizadas, validação em tempo real e rastreamento completo.',
        },
        {
          title: 'Kadeh Smart Layout',
          description: 'Gerenciamento inteligente de categorias com recomendações de frentes, posicionamento e redimensionamento de gôndolas.',
        },
      ],
    },

    // How It Works Section
    howItWorks: {
      title: 'Do mapa ao impacto: ativação rápida, evolução contínua',
      items: [
        {
          title: 'Mapear',
          description: 'Estruturamos o ambiente com setores, lojas/POIs, categorias, serviços e rotas.',
        },
        {
          title: 'Ativar',
          description: 'Publicamos navegação e buscas com IA (substitutos, complementares e sugestões por interesse).',
        },
        {
          title: 'Medir e otimizar',
          description: 'Dashboard on-time com intenção de compra e padrões de busca para operação, varejo e indústria.',
        },
      ],
    },

    // Value Section
    value: {
      title: 'Valor direto para varejo e indústria',
      forRetail: 'Para o varejo',
      retailItems: [
        'Mais conversão e melhor experiência em loja',
        'Reabastecimento mais eficiente com sinais de demanda',
        'Curadoria do e-commerce baseada em intenção real de busca',
      ],
      forIndustry: 'Para a indústria',
      industryItems: [
        'Insights por categoria/segmento/produto buscado',
        'Leitura de oportunidade por formato de loja/ambiente',
        'Dados para execução comercial e estratégia de portfólio',
      ],
    },

    // Technology Section
    technology: {
      title: 'Tecnologia protegida. Exclusividade nacional.',
      description: 'A Kadeh possui tecnologia registrada no INPI e Declaração de Exclusividade válida para todo o Brasil (setembro/2025) — reforçando a singularidade da solução e a segurança para parceiros e clientes.',
      viewDeclaration: 'Ver Declaração de Exclusividade',
    },

    // FAQ Section
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'A Kadeh funciona para pessoas com pouca familiaridade com tecnologia?',
          answer: 'Sim. A experiência é desenhada para ser intuitiva, com passos claros e linguagem simples.',
        },
        {
          question: 'A solução é exclusiva?',
          answer: 'Sim, a Kadeh possui Declaração de Exclusividade válida para todo o Brasil até setembro de 2025.',
        },
        {
          question: 'O que é intenção de compra no dashboard?',
          answer: 'É o rastreamento em tempo real das buscas e navegação dos usuários, indicando quais produtos, categorias e áreas despertam maior interesse.',
        },
        {
          question: 'A IA sugere produtos mesmo quando não há disponibilidade?',
          answer: 'A IA considera a disponibilidade em tempo real. Se um produto não está disponível, ela sugere alternativas similares que estão em estoque.',
        },
        {
          question: 'É necessário aplicativo?',
          answer: 'Não. A Kadeh funciona via web, acessível de qualquer smartphone ou dispositivo com navegador.',
        },
        {
          question: 'Dá para integrar com e-commerce/ERP/CRM/BI?',
          answer: 'Sim. A Kadeh oferece integrações via API para conectar com seus sistemas existentes.',
        },
      ],
    },

    // CTA Section
    cta: {
      title: 'Leve sua operação para a próxima geração de navegação e dados.',
      description: 'Ative a Kadeh e transforme espaços físicos em experiências guiadas, decisões em tempo real e aumento de performance.',
      talkToSpecialist: 'Falar com um especialista',
    },

    // App Download Section
    appDownload: {
      title: 'Baixe o App Kadeh',
      description: 'Acesse a navegação inteligente diretamente do seu smartphone',
      appStore: 'Apple Store',
      googlePlay: 'Google Play',
    },

    // Footer
    footer: {
      solutions: 'Soluções',
      howItWorks: 'Como Funciona',
      faq: 'FAQ',
      contact: 'Contato',
      privacy: 'Privacidade',
      terms: 'Termos de Uso',
      lgpd: 'LGPD',
    },
  },

  en: {
    // Header & Navigation
    header: {
      solutions: 'Solutions',
      picking: 'Picking',
      smartLayout: 'Smart Layout',
      intelligence: 'Intelligence',
      howItWorks: 'How It Works',
      media: 'Media',
      video: 'Video',
      faq: 'FAQ',
      talkToSpecialist: 'Talk to Specialist',
      requestDemo: 'Request Demo',
    },

    // Hero Section
    hero: {
      mainTitle: 'Kadeh: indoor navigation + AI + real-time analytics to transform physical spaces into sales and efficiency.',
      description: 'The platform that combines simple experience for everyone with operational optimization and real-time purchase intent data — with technology registered at INPI and Exclusivity Declaration valid throughout Brazil (September/2025).',
      features: ['AI recommendations', 'Precise navigation', 'Real-time dashboard', 'API integrations', 'LGPD-ready'],
      viewSolutions: 'View Solutions',
    },

    // Deliverables Section
    deliverables: {
      title: 'One platform. Seven solutions. One result: more autonomy, more sales, more efficiency.',
      items: [
        {
          title: 'Navigation anyone can understand',
          description: 'Clear and intuitive routes for products, services and essential areas. Less friction. More autonomy.',
        },
        {
          title: 'AI to sell more',
          description: 'Intelligent recommendations for substitutes, complementary products and best purchase route based on consumer search.',
        },
        {
          title: 'Real-time purchase intent',
          description: 'Real-time reporting of searches by categories, segments and products in different store/environment formats.',
        },
      ],
    },

    // Solutions Section
    solutions: {
      title: 'Solutions designed for each environment',
      items: [
        {
          title: 'Kadeh Retail',
          description: 'Locate products, increase conversion and generate operational efficiency with real-time data.',
        },
        {
          title: 'Kadeh Shopping',
          description: 'Navigation from parking to stores and services, with routes for facilities and safety.',
        },
        {
          title: 'Kadeh Events',
          description: 'Find booths and lectures, plan your route and receive suggestions based on your interests via AI.',
        },
        {
          title: 'Kadeh Healthcare',
          description: 'Improve patient journey and optimize management of equipment and mobile assets.',
        },
        {
          title: 'Kadeh Localization',
          description: 'Airports, bus stations and public services with accurate routes, fewer lines and less need for human guidance.',
        },
        {
          title: 'Kadeh Picking',
          description: 'Efficient picking for e-commerce with optimized routes, real-time validation and complete tracking.',
        },
        {
          title: 'Kadeh Smart Layout',
          description: 'Intelligent category management with recommendations for shelf positioning and gondola resizing.',
        },
      ],
    },

    // How It Works Section
    howItWorks: {
      title: 'From map to impact: quick activation, continuous evolution',
      items: [
        {
          title: 'Map',
          description: 'We structure the environment with sectors, stores/POIs, categories, services and routes.',
        },
        {
          title: 'Activate',
          description: 'We publish navigation and searches with AI (substitutes, complementary products and interest-based suggestions).',
        },
        {
          title: 'Measure and optimize',
          description: 'Real-time dashboard with purchase intent and search patterns for operations, retail and industry.',
        },
      ],
    },

    // Value Section
    value: {
      title: 'Direct value for retail and industry',
      forRetail: 'For retail',
      retailItems: [
        'More conversion and better in-store experience',
        'More efficient restocking with demand signals',
        'E-commerce curation based on real search intent',
      ],
      forIndustry: 'For industry',
      industryItems: [
        'Insights by category/segment/product searched',
        'Opportunity reading by store/environment format',
        'Data for commercial execution and portfolio strategy',
      ],
    },

    // Technology Section
    technology: {
      title: 'Protected technology. National exclusivity.',
      description: 'Kadeh has technology registered at INPI and Exclusivity Declaration valid throughout Brazil (September/2025) — reinforcing the uniqueness of the solution and security for partners and clients.',
      viewDeclaration: 'View Exclusivity Declaration',
    },

    // FAQ Section
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Does Kadeh work for people with little technology familiarity?',
          answer: 'Yes. The experience is designed to be intuitive, with clear steps and simple language.',
        },
        {
          question: 'Is the solution exclusive?',
          answer: 'Yes, Kadeh has an Exclusivity Declaration valid throughout Brazil until September 2025.',
        },
        {
          question: 'What is purchase intent in the dashboard?',
          answer: 'It is the real-time tracking of user searches and navigation, indicating which products, categories and areas generate the most interest.',
        },
        {
          question: 'Does AI suggest products even when they are not available?',
          answer: 'AI considers real-time availability. If a product is not available, it suggests similar alternatives that are in stock.',
        },
        {
          question: 'Is an app necessary?',
          answer: 'No. Kadeh works via web, accessible from any smartphone or device with a browser.',
        },
        {
          question: 'Can it integrate with e-commerce/ERP/CRM/BI?',
          answer: 'Yes. Kadeh offers API integrations to connect with your existing systems.',
        },
      ],
    },

    // CTA Section
    cta: {
      title: 'Take your operation to the next generation of navigation and data.',
      description: 'Activate Kadeh and transform physical spaces into guided experiences, real-time decisions and performance increase.',
      talkToSpecialist: 'Talk to a Specialist',
    },

    // App Download Section
    appDownload: {
      title: 'Download Kadeh App',
      description: 'Access intelligent navigation directly from your smartphone',
      appStore: 'Apple Store',
      googlePlay: 'Google Play',
    },

    // Footer
    footer: {
      solutions: 'Solutions',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms of Use',
      lgpd: 'LGPD',
    },
  },
};

export function getTranslation(language: Language, path: string): string {
  const keys = path.split('.');
  let value: any = translations[language];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return the path if translation not found
    }
  }

  return typeof value === 'string' ? value : path;
}
