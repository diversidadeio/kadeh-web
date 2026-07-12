import { useState } from "react";
import {
  DURATION_PRICES,
  STORE_MULTIPLIERS,
  PRODUCT_PACKAGES,
  DURATION_LABELS,
  STORE_LABELS,
  PRODUCT_LABELS,
  calculateCampaignCostWithRecurring,
  type DurationType,
  type StoreType,
  type ProductType,
  type RecurringType,
} from "@shared/pricingData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KadehAdsCheckoutGeneric() {
  const [duration, setDuration] = useState<DurationType>("1day");
  const [stores, setStores] = useState<StoreType>("1-5");
  const [products, setProducts] = useState<ProductType>("1");
  const [recurring, setRecurring] = useState<RecurringType>("no");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = calculateCampaignCostWithRecurring(
    duration,
    stores,
    products,
    recurring
  );

  const durationOptions = Object.entries(DURATION_LABELS) as Array<
    [DurationType, string]
  >;
  const storeOptions = Object.entries(STORE_LABELS) as Array<
    [StoreType, string]
  >;
  const productOptions = Object.entries(PRODUCT_LABELS) as Array<
    [ProductType, string]
  >;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Redirect to Stripe checkout with parameters
      const params = new URLSearchParams({
        duration,
        stores,
        products,
        recurring,
        amount: (totalCost * 100).toString(), // Stripe uses cents
      });

      // Redirect to checkout page that will process Stripe payment
      window.location.href = `/pt/kadeh-ads/checkout-process?${params.toString()}`;
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kadeh Ads - Checkout
          </h1>
          <p className="text-gray-600">
            Selecione as opções de sua campanha publicitária
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="space-y-6">
            {/* Duration Selection */}
            <div>
              <Label htmlFor="duration" className="text-lg font-semibold mb-3 block">
                Duração da Campanha
              </Label>
              <Select value={duration} onValueChange={(value) => setDuration(value as DurationType)}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stores Selection */}
            <div>
              <Label htmlFor="stores" className="text-lg font-semibold mb-3 block">
                Número de Lojas
              </Label>
              <Select value={stores} onValueChange={(value) => setStores(value as StoreType)}>
                <SelectTrigger id="stores" className="w-full">
                  <SelectValue placeholder="Selecione o número de lojas" />
                </SelectTrigger>
                <SelectContent>
                  {storeOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Selection */}
            <div>
              <Label htmlFor="products" className="text-lg font-semibold mb-3 block">
                Número de Produtos
              </Label>
              <Select value={products} onValueChange={(value) => setProducts(value as ProductType)}>
                <SelectTrigger id="products" className="w-full">
                  <SelectValue placeholder="Selecione o número de produtos" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Option */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                Opção de Recorrência
              </Label>
              <div className="flex gap-4">
                <button
                  onClick={() => setRecurring("no")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    recurring === "no"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sem Recorrência
                </button>
                <button
                  onClick={() => setRecurring("yes")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    recurring === "yes"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Com Recorrência (50% OFF)
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Duração:</span>
                  <span className="font-semibold">{DURATION_LABELS[duration]}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Lojas:</span>
                  <span className="font-semibold">{STORE_LABELS[stores]}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Produtos:</span>
                  <span className="font-semibold">{PRODUCT_LABELS[products]}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Recorrência:</span>
                  <span className="font-semibold">
                    {recurring === "yes" ? "3 pacotes com 50% desconto" : "Sem recorrência"}
                  </span>
                </div>
                <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Valor Total:</span>
                  <span className="text-3xl font-bold text-green-600">
                    R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-lg transition-colors"
            >
              {isProcessing ? "Processando..." : "Prosseguir para Pagamento"}
            </Button>

            {/* Info Message */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>ℹ️ Informação:</strong> Você será redirecionado para a página de pagamento segura do Stripe após clicar em "Prosseguir para Pagamento".
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
