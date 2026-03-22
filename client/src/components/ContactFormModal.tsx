import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


interface ContactFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactFormModal({ open, onOpenChange }: ContactFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular envio de email
      // Em produção, isso seria uma chamada tRPC para enviar o email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Formulário enviado:", formData);
      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      onOpenChange(false);
    } catch (error) {
      alert("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Formulário de Contato</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo e entraremos em contato em breve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Telefone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 9XXXX-XXXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Assunto</label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Assunto da mensagem"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mensagem</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Sua mensagem..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
