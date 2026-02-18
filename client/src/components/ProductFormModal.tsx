import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: {
    name: string;
    largura: number;
    altura: number;
    profundidade: number;
    margem: number;
    giro: number;
  }) => void;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    largura: 10,
    altura: 20,
    profundidade: 10,
    margem: 30,
    giro: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(language === "pt" ? "Nome do produto é obrigatório" : "Product name is required");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      largura: 10,
      altura: 20,
      profundidade: 10,
      margem: 30,
      giro: 50,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {language === "pt" ? "Adicionar Produto" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Produto */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {language === "pt" ? "Nome do Produto" : "Product Name"}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder={language === "pt" ? "Ex: Coca-Cola 2L" : "Ex: Coca-Cola 2L"}
            />
          </div>

          {/* Dimensões */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === "pt" ? "Largura (cm)" : "Width (cm)"}
              </label>
              <input
                type="number"
                value={formData.largura}
                onChange={(e) =>
                  setFormData({ ...formData, largura: Number(e.target.value) })
                }
                className="w-full px-2 py-2 border border-border rounded-md bg-background text-foreground"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === "pt" ? "Altura (cm)" : "Height (cm)"}
              </label>
              <input
                type="number"
                value={formData.altura}
                onChange={(e) =>
                  setFormData({ ...formData, altura: Number(e.target.value) })
                }
                className="w-full px-2 py-2 border border-border rounded-md bg-background text-foreground"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === "pt" ? "Profundidade (cm)" : "Depth (cm)"}
              </label>
              <input
                type="number"
                value={formData.profundidade}
                onChange={(e) =>
                  setFormData({ ...formData, profundidade: Number(e.target.value) })
                }
                className="w-full px-2 py-2 border border-border rounded-md bg-background text-foreground"
                min="1"
              />
            </div>
          </div>

          {/* Margem e Giro */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === "pt" ? "Margem (%)" : "Margin (%)"}
              </label>
              <input
                type="number"
                value={formData.margem}
                onChange={(e) =>
                  setFormData({ ...formData, margem: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === "pt" ? "Giro (unid/mês)" : "Velocity (units/month)"}
              </label>
              <input
                type="number"
                value={formData.giro}
                onChange={(e) =>
                  setFormData({ ...formData, giro: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                min="0"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {language === "pt" ? "Cancelar" : "Cancel"}
            </Button>
            <Button type="submit" className="flex-1">
              {language === "pt" ? "Adicionar" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
