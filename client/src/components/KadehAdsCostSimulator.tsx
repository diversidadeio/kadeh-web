import { useState } from "react";
import {
  DURATION_PRICES,
  STORE_MULTIPLIERS,
  PRODUCT_PACKAGES,
  DURATION_LABELS,
  STORE_LABELS,
  PRODUCT_LABELS,
  calculateCampaignCost,
  type DurationType,
  type StoreType,
  type ProductType,
} from "@shared/pricingData";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export function KadehAdsCostSimulator() {
  const [duration, setDuration] = useState<DurationType>("1day");
  const [stores, setStores] = useState<StoreType>("1-5");
  const [products, setProducts] = useState<ProductType>("1");

  const totalCost = calculateCampaignCost(duration, stores, products);
  const durationPrice = DURATION_PRICES[duration];
  const storeMultiplier = STORE_MULTIPLIERS[stores];
  const productPrice = PRODUCT_PACKAGES[products];
  const basePrice = durationPrice * storeMultiplier;

  const durationOptions = Object.entries(DURATION_LABELS) as Array<
    [DurationType, string]
  >;
  const storeOptions = Object.entries(STORE_LABELS) as Array<
    [StoreType, string]
  >;
  const productOptions = Object.entries(PRODUCT_LABELS) as Array<
    [ProductType, string]
  >;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Simulador de Custos
        </h2>

        {/* Duration Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Duração da Campanha
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {durationOptions.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDuration(key)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  duration === key
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"
                }`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-xs opacity-75 mt-1">
                  R${DURATION_PRICES[key].toLocaleString("pt-BR")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stores Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Quantidade de Lojas
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {storeOptions.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStores(key)}
                className={`p-3 rounded-lg font-medium transition-all text-left ${
                  stores === key
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-400"
                }`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-xs opacity-75 mt-1">
                  Multiplicador: x{STORE_MULTIPLIERS[key]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Quantidade de Produtos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {productOptions.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setProducts(key)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  products === key
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-purple-400"
                }`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-xs opacity-75 mt-1">
                  R${PRODUCT_PACKAGES[key].toLocaleString("pt-BR")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalhamento do Custo
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">
                Valor da duração ({DURATION_LABELS[duration]})
              </span>
              <span className="font-semibold text-gray-900">
                R${durationPrice.toLocaleString("pt-BR")}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">
                Multiplicador de lojas ({STORE_LABELS[stores]})
              </span>
              <span className="font-semibold text-gray-900">
                x{storeMultiplier}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">
                Subtotal (Duração × Lojas)
              </span>
              <span className="font-semibold text-blue-600">
                R${basePrice.toLocaleString("pt-BR")}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">
                Valor dos produtos ({PRODUCT_LABELS[products]})
              </span>
              <span className="font-semibold text-purple-600">
                R${productPrice.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
            <div className="text-sm opacity-90 mb-1">Custo Total da Campanha</div>
            <div className="text-3xl font-bold">
              R${totalCost.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs opacity-75 mt-2">
              Fórmula: (R${durationPrice} × {storeMultiplier}) + R$
              {productPrice} = R${totalCost.toLocaleString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold text-blue-900 mb-2">
            💡 Como funciona o cálculo:
          </p>
          <p>
            O custo total é calculado multiplicando o valor da duração pelo
            multiplicador de lojas, e depois adicionando o valor do pacote de
            produtos selecionado.
          </p>
        </div>
      </Card>
    </div>
  );
}
