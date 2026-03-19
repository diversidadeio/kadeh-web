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
import { Button } from "@/components/ui/button";

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

  // Stripe checkout URLs mapping with 64 combinations
  // Format: duration -> stores -> products
  const stripeCheckoutUrls: Record<DurationType, Record<StoreType, Record<ProductType, string>>> = {
    "1day": {
      "1-5": {
        "1": "https://buy.stripe.com/5kQaEX1y88dR4Vn9Rb0Ba0g",
        "3": "https://buy.stripe.com/cNi5kDgt2cu7evXbZj0Ba0h",
        "5": "https://buy.stripe.com/8x29AT5Oo1PtdrT9Rb0Ba0i",
        "10": "https://buy.stripe.com/00waEXccM51FafH5AV0Ba0j",
      },
      "6-20": {
        "1": "https://buy.stripe.com/14AfZh90A3XBgE5aVf0Ba0k",
        "3": "https://buy.stripe.com/3cI9AT2Cc3XBafHe7r0Ba0l",
        "5": "https://buy.stripe.com/4gM00j7Ww8dRdrT7J30Ba0m",
        "10": "https://buy.stripe.com/6oUdR96Ss65JafHaVf0Ba0n",
      },
      "21-50": {
        "1": "https://buy.stripe.com/9B68wP3Ggcu7cnPe7r0Ba0o",
        "3": "https://buy.stripe.com/28E00j1y82TxafH2oJ0Ba0p",
        "5": "https://buy.stripe.com/8x2aEXdgQalZ3Rjd3n0Ba0q",
        "10": "https://buy.stripe.com/4gM8wPdgQ1Pt73vfbv0Ba0r",
      },
      "50+": {
        "1": "https://buy.stripe.com/3cI5kDb8Icu75Zr4wR0Ba0s",
        "3": "https://buy.stripe.com/bJe14n2Cc3XB5Zr7J30Ba0t",
        "5": "https://buy.stripe.com/8x27sLa4E8dR9bD6EZ0Ba0u",
        "10": "https://buy.stripe.com/7sYcN56Ss9hVafHfbv0Ba0v",
      },
    },
    "3days": {
      "1-5": {
        "1": "https://buy.stripe.com/4gMcN54Kkbq3afH7J30Ba0w",
        "3": "https://buy.stripe.com/8x2fZhfoY9hV9bD4wR0Ba0x",
        "5": "https://buy.stripe.com/00weVd5Oo2Tx5Zr7J30Ba0y",
        "10": "https://buy.stripe.com/8x24gzekU9hV3Rj7J30Ba0z",
      },
      "6-20": {
        "1": "https://buy.stripe.com/28E9AT6Ss2TxcnPe7r0Ba0A",
        "3": "https://buy.stripe.com/bJe6oH5Oodyb87zd3n0Ba0B",
        "5": "https://buy.stripe.com/dRm28rb8IdybcnP3sN0Ba0C",
        "10": "https://buy.stripe.com/3cI28rgt2dyb1Jb7J30Ba0D",
      },
      "21-50": {
        "1": "https://buy.stripe.com/3cIfZh6Ss79NcnP3sN0Ba0E",
        "3": "https://buy.stripe.com/cNifZh5OofGjfA1bZj0Ba0F",
        "5": "https://buy.stripe.com/dRm7sLfoY51FcnP3sN0Ba0G",
        "10": "https://buy.stripe.com/eVq5kD7Ww1Pt87z6EZ0Ba0H",
      },
      "50+": {
        "1": "https://buy.stripe.com/5kQ6oH2CcfGjevXd3n0Ba0I",
        "3": "https://buy.stripe.com/28E4gza4EgKnfA1aVf0Ba0J",
        "5": "https://buy.stripe.com/7sYbJ1ekU1Pt3Rj4wR0Ba0K",
        "10": "https://buy.stripe.com/5kQ00jccMbq30F72oJ0Ba0L",
      },
    },
    "7days": {
      "1-5": {
        "1": "https://buy.stripe.com/14A4gzdgQalZbjLe7r0Ba2k",
        "3": "https://buy.stripe.com/14AbJ10u479N2Nf0gB0Ba2l",
        "5": "https://buy.stripe.com/5kQ8wP90AgKn5Zr7J30Ba2m",
        "10": "https://buy.stripe.com/fZu28rfoYcu7evX0gB0Ba2n",
      },
      "6-20": {
        "1": "https://buy.stripe.com/8x2fZhfoY0LpevX1kF0Ba2o",
        "3": "https://buy.stripe.com/aFa14n7WwalZ9bD1kF0Ba2p",
        "5": "https://buy.stripe.com/8x214n5Oo1Pt0F7bZj0Ba2q",
        "10": "https://buy.stripe.com/3cIfZh4Kkbq3fA1aVf0Ba2r",
      },
      "21-50": {
        "1": "https://buy.stripe.com/3cI8wP4Kk2TxgE5bZj0Ba2s",
        "3": "https://buy.stripe.com/fZu4gzekUeCf5Zr8N70Ba2t",
        "5": "https://buy.stripe.com/eVq5kDekUcu75Zr9Rb0Ba2u",
        "10": "https://buy.stripe.com/28E14n3Gg51F73vfbv0Ba2v",
      },
      "50+": {
        "1": "https://buy.stripe.com/6oU7sLccMcu787z8N70Ba2w",
        "3": "https://buy.stripe.com/7sY6oH0u49hV4Vn2oJ0Ba2x",
        "5": "https://buy.stripe.com/9B68wP1y851FafHbZj0Ba2y",
        "10": "https://buy.stripe.com/aFadR9gt2fGj3Rj0gB0Ba2z",
      },
    },
    "14days": {
      "1-5": {
        "1": "https://buy.stripe.com/7sY14n7Ww65JgE56EZ0Ba12",
        "3": "https://buy.stripe.com/7sY9ATccMfGj1Jb9Rb0Ba13",
        "5": "https://buy.stripe.com/bJe14nfoYgKn0F7bZj0Ba14",
        "10": "https://buy.stripe.com/bJeaEX4Kkdyb2Nffbv0Ba15",
      },
      "6-20": {
        "1": "https://buy.stripe.com/6oU8wP6Ss9hVgE5aVf0Ba16",
        "3": "https://buy.stripe.com/aFacN5foYdybafHe7r0Ba17",
        "5": "https://buy.stripe.com/3cI28r0u43XB73vbZj0Ba18",
        "10": "https://buy.stripe.com/5kQ9AT6Ss2TxgE5e7r0Ba19",
      },
      "21-50": {
        "1": "https://buy.stripe.com/14AbJ1b8I51FgE58N70Ba1a",
        "3": "https://buy.stripe.com/fZu8wP6SsfGj0F7fbv0Ba1b",
        "5": "https://buy.stripe.com/3cIeVdekUfGjafH0gB0Ba1c",
        "10": "https://buy.stripe.com/fZu14n0u4bq3drTfbv0Ba1d",
      },
      "50+": {
        "1": "https://buy.stripe.com/4gM6oHa4E2TxgE56EZ0Ba1e",
        "3": "https://buy.stripe.com/28EcN5ccMbq30F78N70Ba1f",
        "5": "https://buy.stripe.com/4gM7sL3Gg79N2Nf4wR0Ba1g",
        "10": "https://buy.stripe.com/dRmcN5b8I65JgE5fbv0Ba1h",
      },
    },
  };

  const handleContractCampaign = () => {
    const checkoutUrl = stripeCheckoutUrls[duration][stores][products];
    window.location.href = checkoutUrl;
  };

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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mb-6">
          <p className="font-semibold text-blue-900 mb-2">
            💡 Como funciona o cálculo:
          </p>
          <p>
            O custo total é calculado multiplicando o valor da duração pelo
            multiplicador de lojas, e depois adicionando o valor do pacote de
            produtos selecionado.
          </p>
        </div>

        {/* Contract Button */}
        <Button
          onClick={handleContractCampaign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 h-auto font-semibold rounded-lg"
        >
          Contratar Agora
        </Button>
      </Card>
    </div>
  );
}
