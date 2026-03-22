/**
 * Category Products Admin Component
 * Gerenciamento de produtos dentro de uma categoria
 */

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface CategoryProductsAdminProps {
  categoryId: number;
  categoryName: string;
}

interface FormData {
  name: string;
  sku: string;
  ean: string;
  curvaFaturamento: "A" | "B" | "C";
  curvaLucratividade: "A" | "B" | "C";
  papelEstrategico: string;
  defaultGiro: "Baixo" | "Médio" | "Alto";
  defaultMargem: "Baixa" | "Média" | "Alta";
  defaultLargura: string;
  defaultComprimento: string;
  defaultAltura: string;
  description: string;
  imageUrl: string;
  salesVolume: string;
  turnoverRate: string;
  profitMargin: string;
  stockoutRate: string;
}

const initialFormData: FormData = {
  name: "",
  sku: "",
  ean: "",
  curvaFaturamento: "B",
  curvaLucratividade: "B",
  papelEstrategico: "Rotina",
  defaultGiro: "Médio",
  defaultMargem: "Média",
  defaultLargura: "30",
  defaultComprimento: "40",
  defaultAltura: "20",
  description: "",
  imageUrl: "",
  salesVolume: "0",
  turnoverRate: "0",
  profitMargin: "0",
  stockoutRate: "0",
};

export function CategoryProductsAdmin({ categoryId, categoryName }: CategoryProductsAdminProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const t = {
    pt: {
      title: "Produtos da Categoria",
      addProduct: "Adicionar Produto",
      editProduct: "Editar Produto",
      deleteProduct: "Deletar Produto",
      search: "Buscar produtos...",
      name: "Nome",
      sku: "SKU",
      ean: "EAN",
      curvaFaturamento: "Curva de Faturamento",
      curvaLucratividade: "Curva de Lucratividade",
      papelEstrategico: "Papel Estratégico",
      defaultGiro: "Giro Padrão",
      defaultMargem: "Margem Padrão",
      dimensions: "Dimensões (cm)",
      largura: "Largura",
      comprimento: "Comprimento",
      altura: "Altura",
      description: "Descrição",
      imageUrl: "URL da Imagem",
      metrics: "Métricas",
      salesVolume: "Volume de Vendas (R$)",
      turnoverRate: "Taxa de Giro (%)",
      profitMargin: "Margem de Lucro (%)",
      stockoutRate: "Taxa de Ruptura (%)",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Deletar",
      edit: "Editar",
      noProducts: "Nenhum produto cadastrado",
      success: "Produto salvo com sucesso",
      deleteSuccess: "Produto deletado com sucesso",
      error: "Erro ao salvar produto",
      deleteError: "Erro ao deletar produto",
      confirmDelete: "Tem certeza que deseja deletar este produto?",
      loading: "Carregando...",
      details: "Detalhes",
    },
    en: {
      title: "Category Products",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      deleteProduct: "Delete Product",
      search: "Search products...",
      name: "Name",
      sku: "SKU",
      ean: "EAN",
      curvaFaturamento: "Revenue Curve",
      curvaLucratividade: "Profitability Curve",
      papelEstrategico: "Strategic Role",
      defaultGiro: "Default Turnover",
      defaultMargem: "Default Margin",
      dimensions: "Dimensions (cm)",
      largura: "Width",
      comprimento: "Length",
      altura: "Height",
      description: "Description",
      imageUrl: "Image URL",
      metrics: "Metrics",
      salesVolume: "Sales Volume (R$)",
      turnoverRate: "Turnover Rate (%)",
      profitMargin: "Profit Margin (%)",
      stockoutRate: "Stockout Rate (%)",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      noProducts: "No products registered",
      success: "Product saved successfully",
      deleteSuccess: "Product deleted successfully",
      error: "Error saving product",
      deleteError: "Error deleting product",
      confirmDelete: "Are you sure you want to delete this product?",
      loading: "Loading...",
      details: "Details",
    },
  };

  const texts = t[language as keyof typeof t];

  const { data: products, isLoading, refetch } = trpc.products.listByCategory.useQuery(categoryId);
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        sku: product.sku,
        ean: product.ean || "",
        curvaFaturamento: product.curvaFaturamento,
        curvaLucratividade: product.curvaLucratividade,
        papelEstrategico: product.papelEstrategico,
        defaultGiro: product.defaultGiro,
        defaultMargem: product.defaultMargem,
        defaultLargura: String(product.defaultLargura),
        defaultComprimento: String(product.defaultComprimento),
        defaultAltura: String(product.defaultAltura),
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        salesVolume: String(product.salesVolume || 0),
        turnoverRate: String(product.turnoverRate || 0),
        profitMargin: String(product.profitMargin || 0),
        stockoutRate: String(product.stockoutRate || 0),
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          categoryId,
          name: formData.name,
          sku: formData.sku,
          ean: formData.ean || undefined,
          curvaFaturamento: formData.curvaFaturamento,
          curvaLucratividade: formData.curvaLucratividade,
          papelEstrategico: formData.papelEstrategico,
          defaultGiro: formData.defaultGiro,
          defaultMargem: formData.defaultMargem,
          defaultLargura: parseInt(formData.defaultLargura),
          defaultComprimento: parseInt(formData.defaultComprimento),
          defaultAltura: parseInt(formData.defaultAltura),
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          salesVolume: parseFloat(formData.salesVolume) || 0,
          turnoverRate: parseFloat(formData.turnoverRate) || 0,
          profitMargin: parseFloat(formData.profitMargin) || 0,
          stockoutRate: parseFloat(formData.stockoutRate) || 0,
        });
      } else {
        await createMutation.mutateAsync({
          categoryId,
          name: formData.name,
          sku: formData.sku,
          ean: formData.ean || undefined,
          curvaFaturamento: formData.curvaFaturamento,
          curvaLucratividade: formData.curvaLucratividade,
          papelEstrategico: formData.papelEstrategico,
          defaultGiro: formData.defaultGiro,
          defaultMargem: formData.defaultMargem,
          defaultLargura: parseInt(formData.defaultLargura),
          defaultComprimento: parseInt(formData.defaultComprimento),
          defaultAltura: parseInt(formData.defaultAltura),
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          salesVolume: parseFloat(formData.salesVolume) || 0,
          turnoverRate: parseFloat(formData.turnoverRate) || 0,
          profitMargin: parseFloat(formData.profitMargin) || 0,
          stockoutRate: parseFloat(formData.stockoutRate) || 0,
        });
      }
      toast.success(texts.success);
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error(texts.error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm(texts.confirmDelete)) return;
    try {
      await deleteMutation.mutateAsync(productId);
      toast.success(texts.deleteSuccess);
      refetch();
    } catch (error) {
      toast.error(texts.deleteError);
    }
  };

  const filteredProducts = useMemo(() => {
    return (products || []).filter(
      (product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const toggleRowExpanded = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (isLoading) {
    return <div className="text-center text-slate-500">{texts.loading}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{texts.title}</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                {texts.addProduct}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? texts.editProduct : texts.addProduct}
                </DialogTitle>
                <DialogDescription>
                  {categoryName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{texts.name}</label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{texts.sku}</label>
                    <Input
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="SKU"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{texts.ean}</label>
                    <Input
                      value={formData.ean}
                      onChange={(e) =>
                        setFormData({ ...formData, ean: e.target.value })
                      }
                      placeholder="EAN-13"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{texts.papelEstrategico}</label>
                    <Input
                      value={formData.papelEstrategico}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          papelEstrategico: e.target.value,
                        })
                      }
                      placeholder="Ex: Destino, Rotina, Impulso"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">{texts.curvaFaturamento}</label>
                    <Select
                      value={formData.curvaFaturamento}
                      onValueChange={(value: any) =>
                        setFormData({
                          ...formData,
                          curvaFaturamento: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{texts.curvaLucratividade}</label>
                    <Select
                      value={formData.curvaLucratividade}
                      onValueChange={(value: any) =>
                        setFormData({
                          ...formData,
                          curvaLucratividade: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{texts.defaultGiro}</label>
                    <Select
                      value={formData.defaultGiro}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, defaultGiro: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixo">Baixo</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">{texts.defaultMargem}</label>
                    <Select
                      value={formData.defaultMargem}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, defaultMargem: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{texts.largura}</label>
                    <Input
                      type="number"
                      value={formData.defaultLargura}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultLargura: e.target.value,
                        })
                      }
                      placeholder="cm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{texts.comprimento}</label>
                    <Input
                      type="number"
                      value={formData.defaultComprimento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          defaultComprimento: e.target.value,
                        })
                      }
                      placeholder="cm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.altura}</label>
                  <Input
                    type="number"
                    value={formData.defaultAltura}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultAltura: e.target.value })
                    }
                    placeholder="cm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.description}</label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descrição do produto"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{texts.imageUrl}</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="URL da imagem"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">{texts.metrics}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.salesVolume}</label>
                      <Input
                        type="number"
                        value={formData.salesVolume}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salesVolume: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">{texts.turnoverRate}</label>
                      <Input
                        type="number"
                        value={formData.turnoverRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            turnoverRate: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">{texts.profitMargin}</label>
                      <Input
                        type="number"
                        value={formData.profitMargin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profitMargin: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">{texts.stockoutRate}</label>
                      <Input
                        type="number"
                        value={formData.stockoutRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockoutRate: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  {texts.cancel}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {texts.save}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <Input
            placeholder={texts.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {texts.noProducts}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>{texts.name}</TableHead>
                  <TableHead>{texts.sku}</TableHead>
                  <TableHead>{texts.curvaFaturamento}</TableHead>
                  <TableHead>{texts.defaultGiro}</TableHead>
                  <TableHead>{texts.defaultMargem}</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => (
                  <tbody key={product.id}>
                    <TableRow>
                      <TableCell>
                        <button
                          onClick={() => toggleRowExpanded(product.id)}
                          className="p-1"
                        >
                          {expandedRows.has(product.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.curvaFaturamento}</TableCell>
                      <TableCell>{product.defaultGiro}</TableCell>
                      <TableCell>{product.defaultMargem}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(product)}
                            className="gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            {texts.edit}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            {texts.delete}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(product.id) && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50">
                            <div>
                              <p className="text-sm font-medium">
                                {texts.papelEstrategico}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.papelEstrategico}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{texts.ean}</p>
                              <p className="text-sm text-slate-600">
                                {product.ean || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.dimensions}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.defaultLargura} × {product.defaultComprimento} × {product.defaultAltura} cm
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.curvaLucratividade}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.curvaLucratividade}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.salesVolume}
                              </p>
                              <p className="text-sm text-slate-600">
                                R$ {product.salesVolume.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.turnoverRate}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.turnoverRate.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.profitMargin}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.profitMargin.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {texts.stockoutRate}
                              </p>
                              <p className="text-sm text-slate-600">
                                {product.stockoutRate.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </tbody>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
