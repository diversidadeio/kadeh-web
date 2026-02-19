import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AdsBannerProps {
  category?: string;
  region?: string;
  language: string;
}

export default function AdsBanner({
  category,
  region,
  language,
}: AdsBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const texts = {
    pt: {
      noAds: "Nenhum anúncio disponível no momento",
      sponsored: "Patrocinado",
    },
    en: {
      noAds: "No ads available at the moment",
      sponsored: "Sponsored",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  // Buscar anúncios ativos para a categoria
  const { data: ads, isLoading } = trpc.ads.getActiveByCategory.useQuery(
    { category: category || "all", region: region || "all" },
    { enabled: !!category || !!region }
  );

  // Auto-rotacionar anúncios a cada 5 segundos
  useEffect(() => {
    if (!autoRotate || !ads || ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, ads]);

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <Card className="w-full overflow-hidden bg-white shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          {/* Ad Banner */}
          <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay com informações */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <div className="text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-blue-600 px-2 py-1 rounded">
                    {t.sponsored}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{currentAd.title}</h3>
                <p className="text-sm text-gray-200">{currentAd.description}</p>
                {currentAd.productName && (
                  <p className="text-sm font-semibold">{currentAd.productName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {ads.length > 1 && (
            <>
              <button
                onClick={() => {
                  setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
                  setAutoRotate(false);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              <button
                onClick={() => {
                  setCurrentAdIndex((prev) => (prev + 1) % ads.length);
                  setAutoRotate(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {ads.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentAdIndex(idx);
                      setAutoRotate(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentAdIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <div className="p-4 bg-blue-50 border-t">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {language === "pt" ? "Saiba Mais" : "Learn More"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
