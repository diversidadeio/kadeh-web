import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check, X, Edit2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditableProduct {
  id: string;
  name: string;
  largura?: number;
  comprimento?: number;
  profundidade?: number;
  margem?: number;
  giro?: number;
  zone?: string;
  quadrantes?: number;
  categoryId?: string;
  category?: any;
  promotionalPoints?: any[];
}

interface EditableProductRowProps {
  product: EditableProduct;
  onUpdate: (updatedProduct: EditableProduct) => void;
  onDelete: (productId: string) => void;
  quadrantes: number;
}

export default function EditableProductRow({
  product,
  onUpdate,
  onDelete,
  quadrantes,
}: EditableProductRowProps) {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    largura: product.largura || 10,
    comprimento: product.comprimento || 10,
    profundidade: product.profundidade || 10,
    margem: product.margem || 30,
    giro: product.giro || 50,
  });

  const handleSave = () => {
    onUpdate({
      ...product,
      ...editData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      largura: product.largura || 10,
      comprimento: product.comprimento || 10,
      profundidade: product.profundidade || 10,
      margem: product.margem || 30,
      giro: product.giro || 50,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b border-border bg-blue-50">
        <td className="py-2 px-2 text-xs font-medium">{product.name}</td>
        <td className="py-2 px-2 text-xs">
          <div className="flex gap-1">
            <input
              type="number"
              value={editData.largura}
              onChange={(e) =>
                setEditData({ ...editData, largura: Number(e.target.value) })
              }
              className="w-12 px-1 py-1 border border-border rounded text-xs"
              min="1"
            />
            <span>×</span>
            <input
              type="number"
              value={editData.comprimento}
              onChange={(e) =>
                setEditData({ ...editData, comprimento: Number(e.target.value) })
              }
              className="w-12 px-1 py-1 border border-border rounded text-xs"
              min="1"
            />
            <span>cm</span>
          </div>
        </td>
        <td className="py-2 px-2 text-xs">
          <input
            type="number"
            value={editData.profundidade}
            onChange={(e) =>
              setEditData({ ...editData, profundidade: Number(e.target.value) })
            }
            className="w-12 px-1 py-1 border border-border rounded text-xs"
            min="1"
          />
        </td>
        <td className="py-2 px-2 text-xs">
          <input
            type="number"
            value={editData.margem}
            onChange={(e) =>
              setEditData({ ...editData, margem: Number(e.target.value) })
            }
            className="w-12 px-1 py-1 border border-border rounded text-xs"
            min="0"
            max="100"
          />
          <span>%</span>
        </td>
        <td className="py-2 px-2 text-xs">
          <input
            type="number"
            value={editData.giro}
            onChange={(e) =>
              setEditData({ ...editData, giro: Number(e.target.value) })
            }
            className="w-12 px-1 py-1 border border-border rounded text-xs"
            min="0"
          />
        </td>
        <td className="py-2 px-2 text-xs">{product.zone}</td>
        <td className="py-2 px-2 flex gap-1">
          <Button
            onClick={handleSave}
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700"
            title={language === "pt" ? "Salvar" : "Save"}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-700"
            title={language === "pt" ? "Cancelar" : "Cancel"}
          >
            <X className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border hover:bg-muted">
      <td className="py-2 px-2 text-xs font-medium">{product.name}</td>
      <td className="py-2 px-2 text-xs">
        {product.largura}×{product.comprimento}cm
      </td>
      <td className="py-2 px-2 text-xs">{product.profundidade}cm</td>
      <td className="py-2 px-2 text-xs">{product.margem}%</td>
      <td className="py-2 px-2 text-xs">{product.giro}</td>
      <td className="py-2 px-2 text-xs">{product.zone}</td>
      <td className="py-2 px-2 flex gap-1">
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          title={language === "pt" ? "Editar" : "Edit"}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onDelete(product.id)}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          title={language === "pt" ? "Deletar" : "Delete"}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
