import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Download, Home } from "lucide-react";
import { Link } from "wouter";
import { ContactFormModal } from "@/components/ContactFormModal";

export default function KadehAdsManual() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    intro: true,
    simulador: false,
    criacao: false,
    dashboard: false,
    analytics: false,
    exportacao: false,
    faq: false,
  });
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: "intro",
      title: "🎯 Introdução ao Kadeh Ads",
      content:
        "O Kadeh Ads é uma plataforma de publicidade inteligente no ponto de venda que permite posicionar seus produtos onde os clientes mais compram, com dados em tempo real.",
      details: [
        "Publicidade Direcionada - Alcance clientes no momento certo",
        "Analytics em Tempo Real - Acompanhe impressões e conversões",
        "Aumento de Vendas - Aumente o ticket médio",
        "Preços Competitivos - Pacotes flexíveis",
        "Implementação Rápida - Ative campanhas em minutos",
      ],
    },
    {
      id: "simulador",
      title: "💰 Simulador de Custos",
      content:
        "Use o simulador para calcular o valor total de sua campanha antes de contratar.",
      details: [
        "Selecione a duração: 1, 3, 7 ou 14 dias",
        "Escolha a quantidade de lojas (1-5, 6-20, 21-50, 50+)",
        "Selecione a quantidade de produtos (1, 3, 5 ou 10)",
        "O sistema calcula automaticamente o custo total",
        "Veja o detalhamento completo da fórmula",
      ],
    },
    {
      id: "criacao",
      title: "📝 Criação de Campanha",
      content:
        "Siga os passos para criar sua primeira campanha no Kadeh Ads.",
      details: [
        "Passo 1: Preencha dados da empresa (CNPJ, email, telefone)",
        "Passo 2: Configure dados da campanha (duração, lojas, produtos)",
        "Passo 3: Faça upload das imagens e códigos EAN13",
        "Passo 4: Revise todas as informações",
        "Passo 5: Processe o pagamento",
        "Sua campanha será enviada para aprovação do administrador",
      ],
    },
    {
      id: "dashboard",
      title: "📊 Dashboard de Campanhas",
      content:
        "Gerencie e acompanhe todas as suas campanhas em um único lugar.",
      details: [
        "Visualize estatísticas: total, ativas, pendentes, concluídas",
        "Filtre campanhas por status",
        "Ordene por data de criação, data de início ou valor",
        "Clique em 'Ver Detalhes' para informações completas",
        "Exporte dados em CSV para análises",
      ],
    },
    {
      id: "analytics",
      title: "📈 Análise de Performance",
      content:
        "Acompanhe o desempenho de suas campanhas com gráficos em tempo real.",
      details: [
        "KPIs: Visualizações, Cliques, Conversões, Receita",
        "Funil de Conversão - Veja o caminho do cliente",
        "Performance Diária - Evolução das métricas",
        "Taxa de Clique (CTR) = Cliques ÷ Visualizações × 100",
        "Taxa de Conversão = Conversões ÷ Cliques × 100",
      ],
    },
    {
      id: "exportacao",
      title: "📥 Exportação de Dados",
      content:
        "Exporte o histórico de suas campanhas em formato CSV.",
      details: [
        "Clique em 'Exportar em CSV' no dashboard",
        "O arquivo será baixado automaticamente",
        "Abra em Excel, Google Sheets ou qualquer planilha",
        "Inclui: ID, empresa, duração, lojas, produtos, datas, status, valor",
        "Ideal para análises avançadas e relatórios",
      ],
    },
    {
      id: "faq",
      title: "❓ Dúvidas Frequentes",
      content:
        "Respostas para as perguntas mais comuns sobre o Kadeh Ads.",
      details: [
        "P: Qual é o tempo mínimo para agendar? R: 7 dias úteis",
        "P: Posso modificar uma campanha? R: Sim, se estiver em 'Aguardando Aprovação'",
        "P: Como funciona o cálculo? R: (Duração × Multiplicador) + Produtos",
        "P: Quando recebo o relatório? R: Dados disponíveis em tempo real no dashboard",
        "P: Qual é o horário de suporte? R: Segunda a sexta, 9h às 18h",
      ],
    },
  ];

  const faqItems = [
    {
      category: "Geral",
      question: "O que é Kadeh Ads?",
      answer: "Kadeh Ads é uma plataforma de publicidade inteligente no ponto de venda que permite posicionar seus produtos onde os clientes mais compram.",
    },
    {
      category: "Geral",
      question: "Como funciona o sistema de preços?",
      answer: "O preço é calculado multiplicando o valor da duração pelo multiplicador de lojas e adicionando o valor do pacote de produtos.",
    },
    {
      category: "Campanhas",
      question: "Qual é o tempo mínimo para agendar uma campanha?",
      answer: "O tempo mínimo é de 7 dias úteis. Você pode agendar campanhas com durações de 1, 3, 7 ou 14 dias.",
    },
    {
      category: "Campanhas",
      question: "Posso modificar uma campanha após criá-la?",
      answer: "Sim, você pode modificar uma campanha se ela estiver com status 'Aguardando Aprovação'. Após aprovação, não é possível fazer alterações.",
    },
    {
      category: "Pagamento",
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos cartão de crédito através do Stripe. O pagamento é processado imediatamente após a confirmação dos dados.",
    },
    {
      category: "Pagamento",
      question: "Recebo recibo de pagamento?",
      answer: "Sim, você recebe um email com o recibo de pagamento e confirmação da campanha após o processamento bem-sucedido.",
    },
    {
      category: "Analytics",
      question: "Quando posso visualizar os resultados?",
      answer: "Os dados estão disponíveis em tempo real no dashboard assim que a campanha é ativada.",
    },
    {
      category: "Analytics",
      question: "Como é calculada a taxa de conversão?",
      answer: "A taxa de conversão é calculada como: (Conversões ÷ Cliques) × 100. Ela mostra o percentual de cliques que resultaram em compra.",
    },
    {
      category: "Suporte",
      question: "Qual é o horário de atendimento?",
      answer: "Nosso suporte funciona de segunda a sexta, das 9h às 18h. Você pode entrar em contato via email ou WhatsApp.",
    },
    {
      category: "Suporte",
      question: "Como faço para exportar meus dados?",
      answer: "No dashboard de campanhas, clique no botão 'Exportar em CSV' para baixar um arquivo com todos os seus dados.",
    },
  ];

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));
  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pt/kadeh-ads-campaign">
            <Button variant="outline" className="mb-4">
              <Home className="w-4 h-4 mr-2" />
              Voltar para Kadeh Ads
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-2">
            Manual do Usuário - Kadeh Ads
          </h1>
          <p className="text-lg text-muted-foreground">
            Guia completo com passo a passo de todas as funcionalidades
          </p>
        </div>

        {/* Quick Links */}
        <Card className="mb-8 bg-accent/10 border-accent">
          <CardHeader>
            <CardTitle className="text-lg">Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => toggleSection("simulador")}
                className="justify-start"
              >
                💰 Simulador de Custos
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection("criacao")}
                className="justify-start"
              >
                📝 Criar Campanha
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection("dashboard")}
                className="justify-start"
              >
                📊 Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection("analytics")}
                className="justify-start"
              >
                📈 Analytics
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection("exportacao")}
                className="justify-start"
              >
                📥 Exportar Dados
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection("faq")}
                className="justify-start"
              >
                ❓ FAQ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.content}
                  </p>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground ml-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground ml-4 flex-shrink-0" />
                )}
              </button>

              {expandedSections[section.id] && (
                <CardContent className="pt-0 pb-6 px-6 border-t">
                  <ul className="space-y-3">
                    {section.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-sm font-semibold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Download Section */}
        <Card className="mt-8 bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle>📄 Manual Completo em PDF</CardTitle>
            <CardDescription>
              Baixe o manual completo com screenshots e exemplos detalhados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Baixar Manual em PDF
            </Button>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💬 Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">suporte@kadeh.io</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <a 
                  href="https://wa.me/5511989832953" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  (11) 98983-2953
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Horário</h3>
                <p className="text-muted-foreground">
                  Segunda a sexta, 9h às 18h
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Chat</h3>
                <p className="text-muted-foreground">
                  Disponível na plataforma
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button 
                onClick={() => setContactFormOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                📧 Enviar Formulário de Contato
              </Button>
            </div>
          </CardContent>
        </Card>

        <ContactFormModal 
          open={contactFormOpen} 
          onOpenChange={setContactFormOpen} 
        />

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>❓ Dúvidas Frequentes</CardTitle>
            <CardDescription>
              Encontre respostas para as perguntas mais comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Busque por palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((item, idx) => (
                  <Card key={idx} className="bg-accent/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{item.question}</CardTitle>
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma pergunta encontrada. Tente outra busca ou entre em contato conosco.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
