import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export function AdvertiserRegistration() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDocument: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Check if advertiser already exists
  const { data: existingAdvertiser } = trpc.ads.getMyAdvertiser.useQuery();

  // Register advertiser mutation
  const registerMutation = trpc.ads.registerAdvertiser.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        companyName: "",
        companyDocument: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (existingAdvertiser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Cadastro Confirmado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-sm text-muted-foreground">Empresa</p>
            <p className="text-lg">{existingAdvertiser.companyName}</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-muted-foreground">Status</p>
            <p className="text-lg">
              {existingAdvertiser.status === "pending" && (
                <span className="inline-flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  Pendente de Aprovação
                </span>
              )}
              {existingAdvertiser.status === "approved" && (
                <span className="inline-flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Aprovado
                </span>
              )}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {existingAdvertiser.status === "pending"
              ? "Seu cadastro está sendo analisado. Você receberá uma notificação quando for aprovado."
              : "Você está pronto para criar anúncios!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Cadastro Enviado com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Seu cadastro foi enviado para aprovação. Você receberá um email quando for aprovado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Anunciante</CardTitle>
        <CardDescription>
          Preencha os dados da sua empresa para começar a anunciar no KADEH ADS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Empresa *</label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ex: Coca-Cola Brasil"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CNPJ *</label>
            <Input
              name="companyDocument"
              value={formData.companyDocument}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              required
              maxLength={14}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email de Contato *</label>
            <Input
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contato@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <Input
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="(11) 9999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.empresa.com"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Cadastro"
            )}
          </Button>

          {registerMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              Erro ao enviar cadastro. Tente novamente.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
