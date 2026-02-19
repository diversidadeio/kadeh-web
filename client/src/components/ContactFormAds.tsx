import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactFormAds() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!formData.name || !formData.email) {
      setError("Nome e email são obrigatórios");
      return;
    }

    // Salvar em localStorage
    const leads = JSON.parse(localStorage.getItem("kadeh_ads_leads") || "[]");
    const newLead = {
      id: Date.now().toString(),
      ...formData,
      source: "kadeh_ads",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    localStorage.setItem("kadeh_ads_leads", JSON.stringify(leads));

    // Resetar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">Lead salvo com sucesso! Entraremos em contato em breve.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <Input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nome da empresa"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensagem
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Conte-nos mais sobre seu interesse em KADEH ADS..."
          rows={5}
        />
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto">
        Enviar
      </Button>
    </form>
  );
}
