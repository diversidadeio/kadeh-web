import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DATA_CATEGORIES = [
  "Dados de perfil (nome, e-mail, telefone)",
  "Histórico de navegação e rotas",
  "Lista de compras e favoritos",
  "Dados de localização",
  "Histórico de buscas",
  "Dados de campanhas publicitárias",
  "Logs de acesso e uso do app",
  "Dados de pagamento",
];

export default function DataDeletion() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "full_deletion" as "full_deletion" | "partial_deletion" | "data_export",
    platform: "app_android" as "app_android" | "app_ios" | "web" | "other",
    dataToDelete: [] as string[],
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const submitMutation = trpc.dataDeletion.submitRequest.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  const handleToggleData = (item: string) => {
    setForm((prev) => ({
      ...prev,
      dataToDelete: prev.dataToDelete.includes(item)
        ? prev.dataToDelete.filter((d) => d !== item)
        : [...prev.dataToDelete, item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Nome e e-mail são obrigatórios.");
      return;
    }
    if (form.requestType === "partial_deletion" && form.dataToDelete.length === 0) {
      setError("Selecione ao menos uma categoria de dados para exclusão parcial.");
      return;
    }
    submitMutation.mutate(form);
  };

  const faqs = [
    {
      q: "Quanto tempo leva para meus dados serem excluídos?",
      a: "Conforme a LGPD (Lei Geral de Proteção de Dados), o prazo máximo é de 30 dias corridos após a confirmação da solicitação.",
    },
    {
      q: "Quais dados são coletados pelo Kadeh?",
      a: "Coletamos dados de perfil (nome, e-mail), histórico de navegação indoor, listas de compras, dados de localização dentro dos ambientes parceiros e logs de uso do aplicativo.",
    },
    {
      q: "Posso solicitar apenas parte dos meus dados?",
      a: "Sim. Você pode solicitar a exclusão parcial, selecionando quais categorias de dados deseja remover, mantendo outras informações ativas.",
    },
    {
      q: "O que acontece com minha conta após a exclusão?",
      a: "Em caso de exclusão completa, sua conta será desativada e todos os dados associados serão permanentemente removidos de nossos servidores.",
    },
    {
      q: "Posso solicitar uma cópia dos meus dados antes de excluir?",
      a: "Sim. Selecione a opção 'Exportar meus dados' para receber um arquivo com todas as informações que temos sobre você.",
    },
    {
      q: "Como o Kadeh protege meus dados?",
      a: "Seguimos as diretrizes da LGPD, GDPR, Google Play Data Safety e Apple App Store Privacy. Seus dados são criptografados e nunca são vendidos a terceiros.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#0d2d4a] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacidade e Proteção de Dados
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Solicitação de Exclusão de Dados
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Você tem o direito de solicitar a exclusão, portabilidade ou exportação
            dos seus dados pessoais conforme a <strong>LGPD</strong>, <strong>Google Play</strong> e{" "}
            <strong>Apple App Store</strong>.
          </p>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="bg-gray-50 border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: <Shield className="w-5 h-5 text-green-600" />, label: "LGPD Compliant" },
            { icon: <Smartphone className="w-5 h-5 text-blue-600" />, label: "Google Play Data Safety" },
            { icon: <Smartphone className="w-5 h-5 text-gray-700" />, label: "Apple App Store Privacy" },
            { icon: <Globe className="w-5 h-5 text-purple-600" />, label: "GDPR Ready" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-medium text-gray-700">
              {badge.icon}
              {badge.label}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Solicitação recebida com sucesso!
                </h2>
                <p className="text-gray-600 mb-6">
                  Sua solicitação foi registrada. Nossa equipe processará o pedido em até{" "}
                  <strong>30 dias corridos</strong>, conforme exigido pela LGPD.
                </p>
                <p className="text-sm text-gray-500">
                  Você receberá atualizações no e-mail informado: <strong>{form.email}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Formulário de Solicitação</h2>
                  <p className="text-gray-500 text-sm">Preencha os dados abaixo para registrar sua solicitação.</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Dados pessoais */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Seus dados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Seu nome"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Tipo de solicitação */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Tipo de solicitação</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "full_deletion", icon: <Trash2 className="w-5 h-5" />, label: "Excluir tudo", desc: "Remove todos os seus dados permanentemente" },
                      { value: "partial_deletion", icon: <Trash2 className="w-5 h-5" />, label: "Exclusão parcial", desc: "Escolha quais dados excluir" },
                      { value: "data_export", icon: <Download className="w-5 h-5" />, label: "Exportar dados", desc: "Receba uma cópia dos seus dados" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, requestType: opt.value as typeof form.requestType })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.requestType === opt.value
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`mb-2 ${form.requestType === opt.value ? "text-blue-600" : "text-gray-500"}`}>
                          {opt.icon}
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categorias (exclusão parcial) */}
                {form.requestType === "partial_deletion" && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Dados a excluir</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DATA_CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={form.dataToDelete.includes(cat)}
                            onChange={() => handleToggleData(cat)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plataforma */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Plataforma utilizada</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "app_android", label: "App Android" },
                      { value: "app_ios", label: "App iOS (iPhone)" },
                      { value: "web", label: "Site Web" },
                      { value: "other", label: "Outro" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, platform: opt.value as typeof form.platform })}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                          form.platform === opt.value
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motivo */}
                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Textarea
                    id="reason"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Descreva o motivo da sua solicitação (opcional)"
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-[#1a3a5c] hover:bg-[#0d2d4a] text-white py-3 text-base font-semibold"
                >
                  {submitMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  Ao enviar, você confirma que é o titular dos dados informados. Solicitações serão processadas em até 30 dias conforme a LGPD.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Seus direitos (LGPD)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Acesso aos seus dados",
                  "Correção de dados incorretos",
                  "Exclusão de dados pessoais",
                  "Portabilidade dos dados",
                  "Revogação do consentimento",
                  "Oposição ao tratamento",
                ].map((right, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {right}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Prazo de resposta</h3>
              <p className="text-sm text-gray-600">
                Conforme a <strong>LGPD (Art. 18)</strong>, processamos sua solicitação em até{" "}
                <strong className="text-blue-700">30 dias corridos</strong>.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Contato DPO</h3>
              <p className="text-sm text-gray-600 mb-2">
                Para dúvidas sobre privacidade, entre em contato com nosso Encarregado de Dados:
              </p>
              <a href="mailto:privacidade@kadeh.io" className="text-blue-600 text-sm font-medium hover:underline">
                privacidade@kadeh.io
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
