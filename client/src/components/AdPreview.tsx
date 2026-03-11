import React from "react";
import { Smartphone } from "lucide-react";

interface AdPreviewProps {
  adType: string;
  adText: string;
  productName?: string;
  productImage?: string;
  lang: "pt" | "en";
}

const adTypeLabels = {
  pt: {
    desconto: "🏷️ Desconto Especial",
    leve3pague2: "🎁 Leve 3 Pague 2",
    poucasunidades: "⚠️ Poucas Unidades",
    levemais: "💰 Leve Mais por Menos",
  },
  en: {
    desconto: "🏷️ Special Discount",
    leve3pague2: "🎁 Buy 3 Pay 2",
    poucasunidades: "⚠️ Low Stock",
    levemais: "💰 Buy More Pay Less",
  },
};

const adTypeColors = {
  desconto: "from-red-500 to-red-600",
  leve3pague2: "from-green-500 to-green-600",
  poucasunidades: "from-orange-500 to-orange-600",
  levemais: "from-blue-500 to-blue-600",
};

const adTypeEmojis = {
  desconto: "🏷️",
  leve3pague2: "🎁",
  poucasunidades: "⚠️",
  levemais: "💰",
};

export default function AdPreview({
  adType,
  adText,
  productName = "Seu Produto",
  productImage,
  lang,
}: AdPreviewProps) {
  const typeLabel = adTypeLabels[lang][adType as keyof typeof adTypeLabels[typeof lang]];
  const colorGradient = adTypeColors[adType as keyof typeof adTypeColors] || "from-blue-500 to-blue-600";
  const emoji = adTypeEmojis[adType as keyof typeof adTypeEmojis] || "🎯";

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Smartphone Frame */}
      <div className="relative w-72 h-96 bg-black rounded-3xl shadow-2xl border-8 border-gray-800 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-10"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-50 p-4 overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="text-xs text-gray-600 mb-2 flex justify-between px-2">
            <span>9:41</span>
            <span>📶 📡 🔋</span>
          </div>

          {/* Ad Container */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Product Image Placeholder */}
            {productImage ? (
              <img
                src={productImage}
                alt="Product"
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-md">
                <Smartphone className="w-12 h-12 text-gray-500 opacity-50" />
              </div>
            )}

            {/* Ad Type Badge */}
            <div
              className={`bg-gradient-to-r ${colorGradient} text-white px-3 py-2 rounded-lg font-bold text-sm text-center shadow-lg transform transition-all duration-300 hover:scale-105`}
            >
              {emoji} {typeLabel.split(" ").slice(1).join(" ")}
            </div>

            {/* Product Name */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-md border-l-4 border-blue-500">
              <p className="text-xs text-gray-600 font-semibold">Produto</p>
              <p className="text-sm font-bold text-gray-900 truncate">{productName}</p>
            </div>

            {/* Ad Text */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg shadow-md border border-orange-200 flex-1">
              <p className="text-xs text-gray-600 font-semibold mb-1">Oferta</p>
              <p className="text-sm text-gray-800 font-medium leading-tight line-clamp-3">
                {adText || "Digite seu texto de anúncio aqui..."}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {adText.length}/140 caracteres
              </p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
              Ver Oferta
            </button>
          </div>
        </div>

        {/* Home Button */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
      </div>

      {/* Preview Info */}
      <div className="text-center text-sm text-gray-600 max-w-xs">
        <p className="font-semibold text-gray-900 mb-1">Pré-visualização do Anúncio</p>
        <p>Assim seu anúncio aparecerá nos smartphones dos clientes na loja</p>
      </div>
    </div>
  );
}
