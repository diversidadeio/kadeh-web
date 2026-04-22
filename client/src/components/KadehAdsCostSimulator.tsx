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
        "1": "https://buy.stripe.com/14A14nb8I9hV2Nffbv0Ba1i",
        "3": "https://buy.stripe.com/6oU9AT4Kk79NdrT9Rb0Ba1j",
        "5": "https://buy.stripe.com/4gMeVdgt2bq33Rj9Rb0Ba1k",
        "10": "https://buy.stripe.com/5kQeVd0u479N4Vn4wR0Ba1l",
      },
      "6-20": {
        "1": "https://buy.stripe.com/dRmbJ1foYfGj2Nfe7r0Ba1m",
        "3": "https://buy.stripe.com/5kQ3cvfoY2Tx87ze7r0Ba1n",
        "5": "https://buy.stripe.com/9B600j0u4cu75ZraVf0Ba1o",
        "10": "https://buy.stripe.com/5kQ7sL4Kk3XBgE56EZ0Ba1p",
      },
      "21-50": {
        "1": "https://buy.stripe.com/aFa6oH0u4alZfA10gB0Ba1q",
        "3": "https://buy.stripe.com/aFabJ17WwdybfA18N70Ba1r",
        "5": "https://buy.stripe.com/3cIeVd90Abq3fA16EZ0Ba1s",
        "10": "https://buy.stripe.com/6oU4gzccMfGj73v3sN0Ba1t",
      },
      "50+": {
        "1": "https://buy.stripe.com/28E6oH0u4bq34Vnd3n0Ba1u",
        "3": "https://buy.stripe.com/6oUaEX2Cc79N3Rj8N70Ba1v",
        "5": "https://buy.stripe.com/bJebJ1a4E51F3Rj6EZ0Ba1w",
        "10": "https://buy.stripe.com/6oU3cv7Ww0Lp87z8N70Ba1x",
      },
    },
    "3days": {
      "1-5": {
        "1": "https://buy.stripe.com/14AbJ1dgQ79NcnPd3n0Ba1y",
        "3": "https://buy.stripe.com/00w6oH7Ww9hV73v9Rb0Ba1z",
        "5": "https://buy.stripe.com/eVqaEX0u451FafH2oJ0Ba1A",
        "10": "https://buy.stripe.com/aFa5kD3Gg1PtcnPaVf0Ba1B",
      },
      "6-20": {
        "1": "https://buy.stripe.com/14A14nb8IgKnfA10gB0Ba1C",
        "3": "https://buy.stripe.com/cNi9AT3Ggdyb73vd3n0Ba1D",
        "5": "https://buy.stripe.com/eVq8wP4Kk65J2Nfgfz0Ba1E",
        "10": "https://buy.stripe.com/00waEXgt265J4Vn1kF0Ba1F",
      },
      "21-50": {
        "1": "https://buy.stripe.com/8x24gzgt2cu70F78N70Ba1G",
        "3": "https://buy.stripe.com/fZucN5ccMgKn87zgfz0Ba1H",
        "5": "https://buy.stripe.com/4gM5kD6Ss65J3Rj4wR0Ba1I",
        "10": "https://buy.stripe.com/5kQcN5a4E9hVafH5AV0Ba1J",
      },
      "50+": {
        "1": "https://buy.stripe.com/eVqaEX90AalZcnP5AV0Ba1K",
        "3": "https://buy.stripe.com/cNi14n1y8alZ2Nfe7r0Ba1L",
        "5": "https://buy.stripe.com/28EdR9dgQ51F73vaVf0Ba1M",
        "10": "https://buy.stripe.com/14AaEXb8I0Lp2Nf8N70Ba1N",
      },
    },
    "5days": {
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
    "7days": {
      "1-5": {
        "1": "https://buy.stripe.com/3cI6oHgt2fGj2Nf7J30Ba24",
        "3": "https://buy.stripe.com/eVqfZh7WwfGj9bDd3n0Ba25",
        "5": "https://buy.stripe.com/9B600jdgQ2TxcnP0gB0Ba26",
        "10": "https://buy.stripe.com/cNi5kDdgQbq3cnP8N70Ba27",
      },
      "6-20": {
        "1": "https://buy.stripe.com/7sY3cv2CceCf0F72oJ0Ba28",
        "3": "https://buy.stripe.com/3cI3cvekU3XB73v5AV0Ba29",
        "5": "https://buy.stripe.com/7sY3cvfoY3XB9bD8N70Ba2a",
        "10": "https://buy.stripe.com/6oU9ATccMbq3afH2oJ0Ba2b",
      },
      "21-50": {
        "1": "https://buy.stripe.com/9B6dR9foY8dR0F7aVf0Ba2c",
        "3": "https://buy.stripe.com/7sYfZh5OofGj2Nf8N70Ba2d",
        "5": "https://buy.stripe.com/6oU00j6Ss79N3Rjfbv0Ba2e",
        "10": "https://buy.stripe.com/6oU4gz7Ww65JevX6EZ0Ba2f",
      },
      "50+": {
        "1": "https://buy.stripe.com/9B614n90A79N3Rj0gB0Ba2g",
        "3": "https://buy.stripe.com/4gMeVd0u4cu7drTbZj0Ba2h",
        "5": "https://buy.stripe.com/28E14n4KkdybfA15AV0Ba2i",
        "10": "https://buy.stripe.com/4gM28r7Ww0LpfA13sN0Ba2j",
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
