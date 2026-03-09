import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const translations = {
  pt: {
    title: "Contrate Kadeh Ads",
    subtitle: "Impulsione seus produtos com publicidade inteligente",
    companyInfo: "Informações da Empresa",
    companyName: "Nome da Empresa",
    cnpj: "CNPJ",
    email: "Email",
    phone: "Telefone",
    campaignDetails: "Detalhes da Campanha",
    productName: "Nome do Produto",
    productImage: "Imagem do Produto",
    ean13: "Código EAN13",
    duration: "Duração",
    numberOfStores: "Número de Lojas",
    day1: "1 dia",
    days3: "3 dias",
    days7: "7 dias",
    days14: "14 dias",
    pricing: "Cálculo de Preço",
    basePrice: "Preço Base",
    discount: "Desconto",
    totalPrice: "Preço Total",
    pricePerStoreDay: "R$ 89,00/dia/loja",
    discountInfo: "Desconto progressivo a partir de 5 lojas",
    submit: "Ir para Pagamento",
    cancel: "Cancelar",
    loginRequired: "Faça login para contratar Kadeh Ads",
    login: "Fazer Login",
    validationError: "Por favor, preencha todos os campos obrigatórios",
    success: "Campanha criada com sucesso!",
    error: "Erro ao criar campanha",
  },
  en: {
    title: "Contract Kadeh Ads",
    subtitle: "Boost your products with intelligent advertising",
    companyInfo: "Company Information",
    companyName: "Company Name",
    cnpj: "CNPJ",
    email: "Email",
    phone: "Phone",
    campaignDetails: "Campaign Details",
    productName: "Product Name",
    productImage: "Product Image",
    ean13: "EAN13 Code",
    duration: "Duration",
    numberOfStores: "Number of Stores",
    day1: "1 day",
    days3: "3 days",
    days7: "7 days",
    days14: "14 days",
    pricing: "Price Calculation",
    basePrice: "Base Price",
    discount: "Discount",
    totalPrice: "Total Price",
    pricePerStoreDay: "R$ 89.00/day/store",
    discountInfo: "Progressive discount from 5 stores",
    submit: "Go to Payment",
    cancel: "Cancel",
    loginRequired: "Log in to contract Kadeh Ads",
    login: "Log In",
    validationError: "Please fill in all required fields",
    success: "Campaign created successfully!",
    error: "Error creating campaign",
  },
};

function calculatePrice(duration: string, numberOfStores: number) {
  const durationDays = {
    "1day": 1,
    "3days": 3,
    "7days": 7,
    "14days": 14,
  };

  const pricePerStorePerDay = 89;
  const days = durationDays[duration as keyof typeof durationDays] || 1;

  let multiplier = 1.0;
  if (numberOfStores > 5 && numberOfStores <= 10) {
    multiplier = 0.9; // 10% desconto
  } else if (numberOfStores > 10 && numberOfStores <= 20) {
    multiplier = 0.8; // 20% desconto
  } else if (numberOfStores > 20) {
    multiplier = 0.7; // 30% desconto
  }

  const basePrice = pricePerStorePerDay * days * numberOfStores;
  const totalPrice = basePrice * multiplier;
  const discountAmount = basePrice - totalPrice;

  return {
    basePrice: basePrice.toFixed(2),
    discount: discountAmount.toFixed(2),
    multiplier: ((1 - multiplier) * 100).toFixed(0),
    totalPrice: totalPrice.toFixed(2),
  };
}

export default function KadehAdsCheckout() {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const t = translations[lang];

  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    email: "",
    phone: "",
    productName: "",
    productImage: null as File | null,
    ean13: "",
    duration: "7days",
    numberOfStores: 5,
  });

  const [pricing, setPricing] = useState({
    basePrice: "0.00",
    discount: "0.00",
    multiplier: "0",
    totalPrice: "0.00",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const newPricing = calculatePrice(formData.duration, formData.numberOfStores);
    setPricing(newPricing);
  }, [formData.duration, formData.numberOfStores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfStores" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      duration: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        productImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.cnpj ||
      !formData.email ||
      !formData.phone ||
      !formData.productName ||
      !formData.ean13 ||
      !formData.productImage
    ) {
      alert(t.validationError);
      return;
    }

    // Validar CNPJ (básico)
    if (formData.cnpj.replace(/\D/g, "").length !== 14) {
      alert("CNPJ inválido");
      return;
    }

    // Validar EAN13
    if (formData.ean13.replace(/\D/g, "").length !== 13) {
      alert("EAN13 deve ter 13 dígitos");
      return;
    }

    // Aqui você faria a chamada tRPC para criar a campanha
    console.log("Formulário enviado:", formData);
    alert(t.success);
    // Redirecionar para página de sucesso
    window.location.href = `/${lang}/kadeh-ads/success?session_id=test_${Date.now()}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
              <CardTitle>{t.loginRequired}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="w-full"
              >
                {t.login}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>
          <Select value={lang} onValueChange={(value) => setLang(value as "pt" | "en")}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t.companyInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">{t.companyName}</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Sua Empresa Ltda"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">{t.cnpj}</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contato@empresa.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t.campaignDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">{t.productName}</Label>
                  <Input
                    id="productName"
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="Produto Premium"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ean13">{t.ean13}</Label>
                  <Input
                    id="ean13"
                    name="ean13"
                    type="text"
                    value={formData.ean13}
                    onChange={handleInputChange}
                    placeholder="1234567890123"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="productImage">{t.productImage}</Label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Clique para enviar imagem</p>
                    </div>
                    <input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">{t.duration}</Label>
                  <Select value={formData.duration} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1day">{t.day1}</SelectItem>
                      <SelectItem value="3days">{t.days3}</SelectItem>
                      <SelectItem value="7days">{t.days7}</SelectItem>
                      <SelectItem value="14days">{t.days14}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numberOfStores">{t.numberOfStores}</Label>
                  <Input
                    id="numberOfStores"
                    name="numberOfStores"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.numberOfStores}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                {t.pricing}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t.basePrice}</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {pricing.basePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.discount}</p>
                  <p className="text-2xl font-bold text-green-600">-{pricing.multiplier}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Economia</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {pricing.discount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.totalPrice}</p>
                  <p className="text-2xl font-bold text-indigo-600">R$ {pricing.totalPrice}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">{t.discountInfo}</p>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              {t.submit}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                window.history.back();
              }}
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
