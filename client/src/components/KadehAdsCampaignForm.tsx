"use client";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  productName: string;
  productImageUrl: string;
  productImageFile: File | null;
  productEAN13: string;
}

interface FormData {
  companyName: string;
  companyDocument: string;
  contactEmail: string;
  contactPhone: string;
  duration: "1day" | "3days" | "7days" | "14days" | "";
  numberOfProducts: string;
  numberOfStores: string;
  startDate: string;
  products: Product[];
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
    productInfo: "Informações dos Produtos",
    pricing: "Cálculo de Valor",
    companyName: "Nome da Empresa",
    cnpj: "CNPJ",
    email: "Email",
    phone: "Telefone",
    duration: "Duração da Campanha",
    numberOfProducts: "Quantidade de Produtos",
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
    selectProducts: "Selecione a quantidade de produtos",
    selectStores: "Selecione a quantidade de lojas",
    products1: "1 Produto",
    products3: "3 Produtos",
    products5: "5 Produtos",
    products10: "10 Produtos",
    selectStartDate: "Selecione a data de início",
    pricing1day: "1 dia",
    pricing3days: "3 dias",
    pricing7days: "7 dias",
    pricing14days: "14 dias",
    stores1to5: "1-5 lojas (x1.0)",
    stores6to20: "6-20 lojas (x1.5)",
    stores21to50: "21-50 lojas (x2.0)",
    stores50plus: "50+ lojas (x2.5)",
    addProduct: "Adicionar Produto",
    removeProduct: "Remover",
    product: "Produto",
    noProducts: "Nenhum produto adicionado",
    minProducts: "Adicione pelo menos um produto",
  },
};

export function KadehAdsCampaignForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyDocument: "",
    contactEmail: "",
    contactPhone: "",
    duration: "",
    numberOfProducts: "",
    numberOfStores: "",
    startDate: "",
    products: [
      {
        id: "1",
        productName: "",
        productImageUrl: "",
        productImageFile: null,
        productEAN13: "",
      },
    ],
  });

  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<{ [key: string]: boolean }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (calculatePriceQuery.data) {
      setPricingInfo(calculatePriceQuery.data);
    }
  }, [calculatePriceQuery.data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId?: string
  ) => {
    const { id, value } = e.target;

    if (productId) {
      // Extract the field name from id (e.g., "productName-1" -> "productName")
      const fieldName = id.split('-')[0];
      setFormData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === productId ? { ...p, [fieldName]: value } : p
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    
    // Se a data estiver vazia, apenas atualiza o estado
    if (!dateValue) {
      setFormData((prev) => ({
        ...prev,
        startDate: dateValue,
      }));
      setDateError(null);
      return;
    }

    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const businessDaysNeeded = 7;
    const minDate = new Date(today);
    let businessDaysAdded = 0;
    while (businessDaysAdded < businessDaysNeeded) {
      minDate.setDate(minDate.getDate() + 1);
      const dayOfWeek = minDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDaysAdded++;
      }
    }

    if (selectedDate < minDate) {
      setDateError(
        `${t.dateWarning}. ${minDate.toLocaleDateString("pt-BR")}`
      );
    } else {
      setDateError(null);
    }

    setFormData((prev) => ({
      ...prev,
      startDate: dateValue,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage((prev) => ({ ...prev, [productId]: true }));
    setUploadError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === productId
            ? { ...p, productImageUrl: data.url, productImageFile: file }
            : p
        ),
      }));
    } catch (error) {
      setUploadError("Erro ao fazer upload da imagem");
      console.error("Upload error:", error);
    } finally {
      setIsUploadingImage((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const addProduct = () => {
    const newId = String(Math.max(...formData.products.map((p) => parseInt(p.id) || 0)) + 1);
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: newId,
          productName: "",
          productImageUrl: "",
          productImageFile: null,
          productEAN13: "",
        },
      ],
    }));
  };

  const removeProduct = (productId: string) => {
    if (formData.products.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const createCampaignMutation = trpc.campaigns.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.products.length === 0) {
      setUploadError(t.minProducts);
      return;
    }

    if (!formData.startDate) {
      setUploadError("Data de início é obrigatória");
      return;
    }

    if (dateError) {
      setUploadError(t.invalidDate);
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const cleanCNPJ = formData.companyDocument.replace(/\D/g, "");

      await createCampaignMutation.mutateAsync({
        companyName: formData.companyName,
        companyDocument: cleanCNPJ,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        duration: formData.duration as "1day" | "3days" | "7days" | "14days",
        numberOfProducts: parseInt(formData.numberOfProducts),
        numberOfStores: parseInt(formData.numberOfStores),
        startDate: new Date(formData.startDate),
        products: formData.products.map((p) => ({
          productName: p.productName,
          productImageUrl: p.productImageUrl,
          productEAN13: p.productEAN13.replace(/\D/g, ""),
        })),
        basePrice: pricingInfo?.basePrice || 0,
        multiplier: pricingInfo?.multiplier || 1,
        totalCost: pricingInfo?.totalCost || 0,
      });

      setSuccessMessage(t.success);
      setFormData({
        companyName: "",
        companyDocument: "",
        contactEmail: "",
        contactPhone: "",
        duration: "",
        numberOfProducts: "",
        numberOfStores: "",
        startDate: "",
        products: [
          {
            id: "1",
            productName: "",
            productImageUrl: "",
            productImageFile: null,
            productEAN13: "",
          },
        ],
      });
      setPricingInfo(null);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t.error;
      setUploadError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <p className="text-gray-600 mt-2">{t.subtitle}</p>
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {uploadError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.companyInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">{t.companyName}</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="companyDocument">{t.cnpj}</Label>
              <Input
                id="companyDocument"
                placeholder="00.000.000/0000-00"
                value={formData.companyDocument}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">{t.email}</Label>
                <Input
                  id="contactEmail"
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
                  placeholder="(11) 99999-9999"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.campaignInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="duration" className="block mb-2 font-medium">{t.duration}</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: value as "1day" | "3days" | "7days" | "14days",
                    }))
                  }
                >
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
                <Label htmlFor="numberOfProducts" className="block mb-2 font-medium">{t.numberOfProducts}</Label>
                <Select
                  value={formData.numberOfProducts}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      numberOfProducts: value,
                    }))
                  }
                >
                  <SelectTrigger id="numberOfProducts">
                    <SelectValue placeholder={t.selectProducts} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t.products1}</SelectItem>
                    <SelectItem value="3">{t.products3}</SelectItem>
                    <SelectItem value="5">{t.products5}</SelectItem>
                    <SelectItem value="10">{t.products10}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="numberOfStores" className="block mb-2 font-medium">{t.numberOfStores}</Label>
                <Select
                  value={formData.numberOfStores}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      numberOfStores: value,
                    }))
                  }
                >
                  <SelectTrigger id="numberOfStores">
                    <SelectValue placeholder={t.selectStores} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">{t.stores1to5}</SelectItem>
                    <SelectItem value="6-20">{t.stores6to20}</SelectItem>
                    <SelectItem value="21-50">{t.stores21to50}</SelectItem>
                    <SelectItem value="50+">{t.stores50plus}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="block mb-2 font-medium">{t.startDate}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  required
                />
                {dateError && (
                  <p className="text-red-600 text-sm mt-2">{dateError}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t.productInfo}</CardTitle>
              <Button
                type="button"
                onClick={addProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t.addProduct}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.products.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t.noProducts}</p>
            ) : (
              formData.products.map((product, index) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">
                      {t.product} {index + 1}
                    </h4>
                    {formData.products.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t.removeProduct}
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`productName-${product.id}`}>
                      {t.productName}
                    </Label>
                    <Input
                      id={`productName-${product.id}`}
                      value={product.productName}
                      onChange={(e) => handleInputChange(e, product.id)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`productImage-${product.id}`}>
                      {t.productImage}
                    </Label>
                    <Input
                      id={`productImage-${product.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, product.id)}
                      disabled={isUploadingImage[product.id]}
                    />
                    {product.productImageUrl && (
                      <img
                        src={product.productImageUrl}
                        alt={product.productName}
                        className="mt-2 w-24 h-24 object-cover rounded"
                      />
                    )}
                    {isUploadingImage[product.id] && (
                      <div className="mt-2 flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.calculating}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`productEAN13-${product.id}`}>
                      {t.productEAN13}
                    </Label>
                    <Input
                      id={`productEAN13-${product.id}`}
                      placeholder="1234567890123"
                      value={product.productEAN13}
                      onChange={(e) => handleInputChange(e, product.id)}
                      required
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pricing Information */}
        {pricingInfo && (
          <Card>
            <CardHeader>
              <CardTitle>{t.pricing}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t.basePrice}</p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ {pricingInfo.basePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.multiplier}</p>
                  <p className="text-lg font-bold text-gray-900">
                    x{pricingInfo.multiplier.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.totalCost}</p>
                  <p className="text-lg font-bold text-blue-600">
                    R$ {pricingInfo.totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || calculatePriceQuery.isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.submitting}
            </>
          ) : (
            t.submit
          )}
        </Button>
      </form>
    </div>
  );
}
