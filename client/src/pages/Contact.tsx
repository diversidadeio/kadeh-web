/**
 * Contact Form Page — Kadeh
 * Design: Tech-Forward Minimalism
 * Fields: Name, Phone, Email, Type (Consumer/Business), Company Info, Preference
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "", // "consumer" or "business"
    companyName: "",
    cnpj: "",
    contactPreference: "", // "whatsapp", "email", "phone"
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Formulário enviado com sucesso! Entraremos em contato em breve.");
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          type: "",
          companyName: "",
          cnpj: "",
          contactPreference: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar formulário. Tente novamente.");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Por favor, insira seu nome");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Por favor, insira seu telefone");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Por favor, insira seu email");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Por favor, insira um email válido");
      return false;
    }
    if (!formData.type) {
      toast.error("Por favor, selecione se é consumidor ou empresa");
      return false;
    }
    if (formData.type === "business") {
      if (!formData.companyName.trim()) {
        toast.error("Por favor, insira o nome da empresa");
        return false;
      }
      if (!formData.cnpj.trim()) {
        toast.error("Por favor, insira o CNPJ da empresa");
        return false;
      }
    }
    if (!formData.contactPreference) {
      toast.error("Por favor, selecione sua preferência de contato");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    submitMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      type: formData.type as "consumer" | "business",
      companyName: formData.companyName || undefined,
      cnpj: formData.cnpj || undefined,
      contactPreference: formData.contactPreference as "whatsapp" | "email" | "phone",
      message: formData.message || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Obrigado!
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Seu formulário foi enviado com sucesso.
            </p>
            <p className="text-muted-foreground">
              Nosso time entrará em contato em breve através do canal que você preferiu.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground">
            Preencha o formulário abaixo e nosso time especializado entrará em contato para discutir como Kadeh pode transformar seu negócio.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Informações Pessoais
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-semibold">
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-semibold">
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                />
              </div>
            </div>

            {/* Type Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Tipo de Interesse
              </h2>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground font-semibold">
                  Você é: *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleSelectChange("type", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-orange-600 focus:ring-orange-600">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumer">
                      Consumidor / Usuário Final
                    </SelectItem>
                    <SelectItem value="business">
                      Loja / Empresa Interessada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Company Information (conditional) */}
            {formData.type === "business" && (
              <div className="space-y-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-foreground">
                  Informações da Empresa
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-foreground font-semibold"
                    >
                      Nome da Empresa *
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Nome da sua empresa"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-foreground font-semibold">
                      CNPJ *
                    </Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Preference */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Preferência de Contato
              </h2>

              <div className="space-y-2">
                <Label
                  htmlFor="contactPreference"
                  className="text-foreground font-semibold"
                >
                  Como você prefere ser contatado? *
                </Label>
                <Select
                  value={formData.contactPreference}
                  onValueChange={(value) =>
                    handleSelectChange("contactPreference", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-orange-600 focus:ring-orange-600">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Mensagem Adicional
              </h2>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-semibold">
                  Deixe uma mensagem (opcional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Conte-nos mais sobre seu interesse em Kadeh..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="border-gray-300 focus:border-orange-600 focus:ring-orange-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg"
              >
                {submitMutation.isPending ? "Enviando..." : "Enviar Formulário"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              * Campos obrigatórios
            </p>
          </form>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Baixe o App Kadeh
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Acesse a navegação inteligente diretamente do seu smartphone
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://apps.apple.com/br/app/kadeh-shopping/id6747453355"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.91 0-1.82.55-2.25 1.51.5.89 1.86 1.99 4.25 1.99 1.5 0 2.89-.6 3.63-1.5-.74-.9-2.23-1.99-3.63-1.99zm-4.3 0c-.91 0-1.82.55-2.25 1.51.5.89 1.86 1.99 4.25 1.99 1.5 0 2.89-.6 3.63-1.5-.74-.9-2.23-1.99-3.63-1.99z"/>
              </svg>
              Apple Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.br.kadeheventos.lusa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13.5v8.75c0 .41.34.75.75.75h16.5c.41 0 .75-.34.75-.75V13.5M3.75 3h16.5c.41 0 .75.34.75.75v9h-18v-9c0-.41.34-.75.75-.75z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
