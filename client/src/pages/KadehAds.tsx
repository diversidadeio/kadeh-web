import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AdminAdsPanel } from "@/components/AdminAdsPanel";
// import { AdvertiserRegistration } from "@/components/AdvertiserRegistration";
// import { CreateAdvertisement } from "@/components/CreateAdvertisement";
import { AlertCircle, BarChart3, DollarSign, Zap } from "lucide-react";

export default function KadehAds() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Main Image */}
        <div className="w-full h-96 md:h-[500px] overflow-hidden">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028736640/BhoNhyjtUKhzSkIr.png"
            alt="Kadeh Ads - Família Fazendo Compras em Supermercado"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Kadeh Ads</CardTitle>
            <CardDescription>
              Sistema de publicidade contextualizada para pontos de venda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Anúncios Contextualizados</p>
                  <p className="text-xs text-muted-foreground">
                    Exiba anúncios relevantes baseados na busca do cliente
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <BarChart3 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Analytics em Tempo Real</p>
                  <p className="text-xs text-muted-foreground">
                    Acompanhe impressões, cliques e conversões
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <DollarSign className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Preços Flexíveis</p>
                  <p className="text-xs text-muted-foreground">
                    Escolha duração e número de lojas
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Faça login para acessar o Kadeh Ads e começar a anunciar
              </p>
              <Button className="w-full" asChild>
                <a href="/login">Fazer Login</a>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <a href="/kadeh-ads/contratacao">Contratar</a>
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel
  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Kadeh Ads - Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie anunciantes, preços e anúncios do sistema
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Painel Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Advertiser Panel
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Kadeh Ads - Painel do Anunciante</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie seus anúncios contextualizados
          </p>
        </div>

        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registration">Cadastro</TabsTrigger>
            <TabsTrigger value="create">Criar Anúncio</TabsTrigger>
            <TabsTrigger value="analytics">Meus Anúncios</TabsTrigger>
          </TabsList>

          <TabsContent value="registration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Anunciante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Anúncio</CardTitle>
                <CardDescription>
                  Configure um novo anúncio com segmentação por categorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Anúncios</CardTitle>
                <CardDescription>
                  Visualize e gerencie seus anúncios ativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
