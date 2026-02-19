import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

// Mapeamento de níveis para valores numéricos
const NIVEL_MAPPING = {
  baixa: 15,
  media: 35,
  alta: 60,
};

const GIRO_MAPPING = {
  baixo: 20,
  medio: 50,
  alto: 100,
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const language = "pt"; // Default to Portuguese
  const [inputMode, setInputMode] = useState<"numeric" | "levels">("numeric");
  const [formData, setFormData] = useState({
    name: "",
    largura: 10,
    altura: 20,
    profundidade: 10,
    margem: 30,
    giro: 50,
  });
  const [margemNivel, setMargemNivel] = useState<"baixa" | "media" | "alta">("media");
  const [giroNivel, setGiroNivel] = useState<"baixo" | "medio" | "alto">("medio");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Nome do produto é obrigatório");
      return;
    }

    let finalMargem = formData.margem;
    let finalGiro = formData.giro;

    if (inputMode === "levels") {
      finalMargem = NIVEL_MAPPING[margemNivel];
      finalGiro = GIRO_MAPPING[giroNivel];
    }

    onSubmit({
      ...formData,
      margem: finalMargem,
      giro: finalGiro,
    });

    setFormData({
      name: "",
      largura: 10,
      altura: 20,
      profundidade: 10,
      margem: 30,
      giro: 50,
    });
    setMargemNivel("media");
    setGiroNivel("medio");
    setInputMode("numeric");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Adicionar Produto
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
              Nome do Produto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Ex: Coca-Cola 2L"
            />
          </div>

          {/* Dimensões */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Largura (cm)
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
                Altura (cm)
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
                Profundidade (cm)
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

          {/* Toggle entre Níveis e Valores Numéricos */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setInputMode("numeric")}
              className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                inputMode === "numeric"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Valores Numéricos
            </button>
            <button
              type="button"
              onClick={() => setInputMode("levels")}
              className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors ${
                inputMode === "levels"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Níveis
            </button>
          </div>

          {/* Margem e Giro - Modo Numérico */}
          {inputMode === "numeric" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Margem (%)
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
                  Giro (unid/mês)
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
          )}

          {/* Margem e Giro - Modo Níveis */}
          {inputMode === "levels" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Margem
                </label>
                <select
                  value={margemNivel}
                  onChange={(e) => setMargemNivel(e.target.value as "baixa" | "media" | "alta")}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="baixa">Baixa (15%)</option>
                  <option value="media">Média (35%)</option>
                  <option value="alta">Alta (60%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Giro
                </label>
                <select
                  value={giroNivel}
                  onChange={(e) => setGiroNivel(e.target.value as "baixo" | "medio" | "alto")}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="baixo">Baixo (20)</option>
                  <option value="medio">Médio (50)</option>
                  <option value="alto">Alto (100)</option>
                </select>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
