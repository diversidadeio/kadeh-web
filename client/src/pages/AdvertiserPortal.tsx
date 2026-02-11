import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdvertisementForm from "@/components/AdvertisementForm";
import AdvertiserDashboard from "@/components/AdvertiserDashboard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdvertiserPortal() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const texts = {
    pt: {
      title: "Portal do Anunciante",
      dashboard: "Dashboard",
      createAd: "Criar Anúncio",
      description: "Gerencie suas campanhas de publicidade e crie novos anúncios",
    },
    en: {
      title: "Advertiser Portal",
      dashboard: "Dashboard",
      createAd: "Create Ad",
      description: "Manage your advertising campaigns and create new ads",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.pt;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
            <TabsTrigger value="create">{t.createAd}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <AdvertiserDashboard language={language} />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <AdvertisementForm language={language} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
