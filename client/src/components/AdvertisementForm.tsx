import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface AdvertisementFormProps {
  language: string;
}

export default function AdvertisementForm({ language }: AdvertisementFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    productName: "",
    productCategory: "",
    adType: "promotion",
    duration: "7",
    location: "single",
    numStores: "1",
    triggerType: "category",
    description: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const texts = {
    pt: {
      title: "Criar Novo Anúncio",
      subtitle: "Preencha os dados do seu anúncio para começar a impactar clientes no PDV",
      productName: "Nome do Produto",
      productCategory: "Categoria do Produto",
      adType: "Tipo de Anúncio",
      duration: "Duração (dias)",
      location: "Localização",
      numStores: "Número de Lojas",
      triggerType: "Tipo de Gatilho",
      description: "Descrição do Anúncio",
      image: "Imagem do Anúncio",
      uploadImage: "Enviar Imagem",
      preview: "Prévia",
      submit: "Criar Anúncio",
      loginRequired: "Você precisa estar logado para criar anúncios",
      approvalRequired: "Sua conta ainda não foi aprovada. Entre em contato conosco.",
      success: "Anúncio criado com sucesso!",
      error: "Erro ao criar anúncio",
      promotion: "Promoção",
      gift: "Brinde",
      trial: "Experimentação",
      offer: "Oferta",
      suggestion: "Sugestão por Busca",
    },
    en: {
      title: "Create New Advertisement",
      subtitle: "Fill in your ad details to start impacting customers at the POS",
      productName: "Product Name",
      productCategory: "Product Category",
      adType: "Advertisement Type",
      duration: "Duration (days)",
      location: "Location",
      numStores: "Number of Stores",
      triggerType: "Trigger Type",
      description: "Advertisement Description",
      image: "Advertisement Image",
      uploadImage: "Upload Image",
      preview: "Preview",
      submit: "Create Advertisement",
      loginRequired: "You need to be logged in to create ads",
      approvalRequired: "Your account has not been approved yet. Please contact us.",
      success: "Advertisement created successfully!",
      error: "Error creating advertisement",
      promotion: "Promotion",
      gift: "Gift",
      trial: "Trial",
      offer: "Offer",
      suggestion: "Search Suggestion",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t.loginRequired}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create advertisement
      console.log("Form data:", formData);
      // await trpc.ads.createAdvertisement.useMutation();
    } catch (error) {
      console.error(t.error, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações do Produto</h3>
            
            <div>
              <label className="text-sm font-medium">{t.productName}</label>
              <Input
                type="text"
                placeholder={t.productName}
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t.productCategory}</label>
              <Select value={formData.productCategory} onValueChange={(value) => setFormData({ ...formData, productCategory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.productCategory} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Alimentos</SelectItem>
                  <SelectItem value="beverage">Bebidas</SelectItem>
                  <SelectItem value="personal">Higiene Pessoal</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advertisement Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Detalhes do Anúncio</h3>

            <div>
              <label className="text-sm font-medium">{t.adType}</label>
              <Select value={formData.adType} onValueChange={(value) => setFormData({ ...formData, adType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.adType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotion">{t.promotion}</SelectItem>
                  <SelectItem value="gift">{t.gift}</SelectItem>
                  <SelectItem value="trial">{t.trial}</SelectItem>
                  <SelectItem value="offer">{t.offer}</SelectItem>
                  <SelectItem value="suggestion">{t.suggestion}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t.description}</label>
              <Textarea
                placeholder={t.description}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t.image}</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {imagePreview && (
                  <div className="w-20 h-20 border rounded overflow-hidden">
                    <img src={imagePreview} alt={t.preview} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Configurações da Campanha</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{t.duration}</label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.duration} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t.numStores}</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.numStores}
                  onChange={(e) => setFormData({ ...formData, numStores: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t.triggerType}</label>
              <Select value={formData.triggerType} onValueChange={(value) => setFormData({ ...formData, triggerType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t.triggerType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Por Categoria</SelectItem>
                  <SelectItem value="brand">Por Marca</SelectItem>
                  <SelectItem value="search">Por Busca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Criando..." : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
