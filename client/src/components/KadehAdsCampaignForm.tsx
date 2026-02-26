"use client";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface FormData {
  companyName: string;
  companyDocument: string;
  contactEmail: string;
  contactPhone: string;
  duration: "1day" | "3days" | "7days" | "14days" | "";
  numberOfStores: string;
  startDate: string;
  productName: string;
  productImageUrl: string;
  productImageFile: File | null;
  productEAN13: string;
}

interface PricingInfo {
  basePrice: number;
  multiplier: number;
  totalCost: number;
}

const translations = {
  pt: {
    title: "Contratar Kadeh Ads",
    subtitle: "Crie uma campanha de publicidade para suas lojas",
    companyInfo: "Informações da Empresa",
    campaignInfo: "Informações da Campanha",
    productInfo: "Informações do Produto",
    pricing: "Cálculo de Valor",
    companyName: "Nome da Empresa",
    cnpj: "CNPJ",
    email: "Email",
    phone: "Telefone",
    duration: "Duração da Campanha",
    numberOfStores: "Quantidade de Lojas",
    startDate: "Data de Início",
    productName: "Nome do Produto",
    productImage: "Imagem do Produto",
    productEAN13: "Código de Barras (EAN13)",
    basePrice: "Preço Base",
    multiplier: "Multiplicador",
    totalCost: "Valor Total",
    calculating: "Calculando...",
    calculate: "Calcular Valor",
    submit: "Contratar Campanha",
    submitting: "Processando...",
    success: "Campanha criada com sucesso!",
    error: "Erro ao criar campanha",
    invalidDate: "Data inválida",
    dateWarning: "A campanha deve iniciar com antecedência de 7 dias úteis",
    selectDuration: "Selecione a duração",
    selectStores: "Selecione a quantidade de lojas",
    selectStartDate: "Selecione a data de início",
    pricing1day: "1 dia",
    pricing3days: "3 dias",
    pricing7days: "7 dias",
    pricing14days: "14 dias",
    stores1to5: "1-5 lojas (x1.0)",
    stores6to20: "6-20 lojas (x1.5)",
    stores21to50: "21-50 lojas (x2.0)",
    stores50plus: "50+ lojas (x2.5)",
  },
};

export function KadehAdsCampaignForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyDocument: "",
    contactEmail: "",
    contactPhone: "",
    duration: "",
    numberOfStores: "",
    startDate: "",
    productName: "",
    productImageUrl: "",
    productImageFile: null,
    productEAN13: "",
  });

  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const t = translations.pt;

  const calculatePriceQuery = trpc.campaigns.calculatePrice.useQuery(
    {
      duration: formData.duration as "1day" | "3days" | "7days" | "14days",
      numberOfStores: parseInt(formData.numberOfStores) || 0,
    },
    {
      enabled: !!formData.duration && !!formData.numberOfStores,
    }
  );

  const validateDateQuery = trpc.campaigns.validateStartDate.useQuery(
    {
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
    },
    {
      enabled: !!formData.startDate,
    }
  );

  const uploadImageMutation = trpc.campaigns.uploadImage.useMutation();

  const createCampaignMutation = trpc.campaigns.create.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(t.success);
      setFormData({
        companyName: "",
        companyDocument: "",
        contactEmail: "",
        contactPhone: "",
        duration: "",
        numberOfStores: "",
        startDate: "",
        productName: "",
        productImageUrl: "",
        productImageFile: null,
        productEAN13: "",
      });
      setPricingInfo(null);
    },
    onError: (error) => {
      setUploadError(error.message || t.error);
    },
  });

  useEffect(() => {
    if (calculatePriceQuery.data?.success) {
      setPricingInfo(calculatePriceQuery.data.breakdown);
    }
  }, [calculatePriceQuery.data]);

  useEffect(() => {
    if (validateDateQuery.data?.success) {
      if (!validateDateQuery.data.isValid) {
        setDateError(validateDateQuery.data.message);
      } else {
        setDateError(null);
      }
    }
  }, [validateDateQuery.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        productImageFile: file,
        productImageUrl: URL.createObjectURL(file),
      }));
      setUploadError(null);
    }
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        uploadImageMutation.mutate(
          {
            fileName: file.name,
            fileData: base64,
            mimeType: file.type,
          },
          {
            onSuccess: (data) => {
              resolve(data.url);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      };
      reader.onerror = () => {
        reject(new Error("Falha ao ler arquivo"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pricingInfo) {
      alert("Por favor, calcule o valor da campanha");
      return;
    }

    if (dateError) {
      alert("Por favor, selecione uma data válida");
      return;
    }

    if (!formData.productImageFile) {
      alert("Por favor, selecione uma imagem do produto");
      return;
    }

    try {
      setIsUploadingImage(true);

      let imageUrl = formData.productImageUrl;
      if (formData.productImageFile && !formData.productImageUrl.startsWith("http")) {
        imageUrl = await uploadImageToS3(formData.productImageFile);
      }

      createCampaignMutation.mutate({
        companyName: formData.companyName,
        companyDocument: formData.companyDocument,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        duration: formData.duration as "1day" | "3days" | "7days" | "14days",
        numberOfStores: parseInt(formData.numberOfStores),
        startDate: new Date(formData.startDate),
        productName: formData.productName,
        productImageUrl: imageUrl,
        productEAN13: formData.productEAN13,
      });
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setUploadError("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{uploadError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyDocument">{t.cnpj}</Label>
                <Input
                  id="companyDocument"
                  name="companyDocument"
                  value={formData.companyDocument}
                  onChange={handleInputChange}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">{t.email}</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">{t.phone}</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.campaignInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">{t.duration}</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder={t.selectDuration} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">{t.pricing1day}</SelectItem>
                    <SelectItem value="3days">{t.pricing3days}</SelectItem>
                    <SelectItem value="7days">{t.pricing7days}</SelectItem>
                    <SelectItem value="14days">{t.pricing14days}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numberOfStores">{t.numberOfStores}</Label>
                <Select value={formData.numberOfStores} onValueChange={(value) => handleSelectChange("numberOfStores", value)}>
                  <SelectTrigger id="numberOfStores">
                    <SelectValue placeholder={t.selectStores} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">{t.stores1to5}</SelectItem>
                    <SelectItem value="20">{t.stores6to20}</SelectItem>
                    <SelectItem value="50">{t.stores21to50}</SelectItem>
                    <SelectItem value="100">{t.stores50plus}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">{t.startDate}</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {dateError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{dateError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.productInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productName">{t.productName}</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="productImage">{t.productImage}</Label>
              <Input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {formData.productImageUrl && (
                <img
                  src={formData.productImageUrl}
                  alt="Product preview"
                  className="mt-4 h-32 w-32 object-cover rounded"
                />
              )}
            </div>
            <div>
              <Label htmlFor="productEAN13">{t.productEAN13}</Label>
              <Input
                id="productEAN13"
                name="productEAN13"
                value={formData.productEAN13}
                onChange={handleInputChange}
                placeholder="1234567890123"
                maxLength={13}
                required
              />
            </div>
          </CardContent>
        </Card>

        {pricingInfo && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>{t.pricing}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t.basePrice}</p>
                  <p className="text-lg font-bold">R$ {pricingInfo.basePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.multiplier}</p>
                  <p className="text-lg font-bold">x{pricingInfo.multiplier.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.totalCost}</p>
                  <p className="text-2xl font-bold text-blue-600">R$ {pricingInfo.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={createCampaignMutation.isPending || !pricingInfo || !!dateError || isUploadingImage}
          size="lg"
        >
          {createCampaignMutation.isPending || isUploadingImage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploadingImage ? "Enviando imagem..." : t.submitting}
            </>
          ) : (
            t.submit
          )}
        </Button>
      </form>
    </div>
  );
}
