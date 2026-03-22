/**
 * Admin Categories Page - Gerenciamento de Categorias
 * Interface CRUD completa para criar, editar, deletar e visualizar categorias
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { CategoryProductsAdmin } from "@/components/CategoryProductsAdmin";
import { toast } from "sonner";

interface FormData {
  name: string;
  mainCategory: "Alimentar" | "Não-Alimentar";
  curvaFaturamento: "A" | "B" | "C";
  curvaLucratividade: "A" | "B" | "C";
  papelEstrategico: string;
  defaultGiro: "Baixo" | "Médio" | "Alto";
  defaultMargem: "Baixa" | "Média" | "Alta";
  defaultLargura: number;
  defaultComprimento: number;
  defaultAltura: number;
  description?: string;
  salesVolume?: number;
  turnoverRate?: number;
  profitMargin?: number;
  stockoutRate?: number;
}

const initialFormData: FormData = {
  name: "",
  mainCategory: "Alimentar",
  curvaFaturamento: "A",
  curvaLucratividade: "A",
  papelEstrategico: "",
  defaultGiro: "Médio",
  defaultMargem: "Média",
  defaultLargura: 10,
  defaultComprimento: 15,
  defaultAltura: 20,
};

export default function AdminCategories() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMain, setFilterMain] = useState<"Alimentar" | "Não-Alimentar" | "">("Alimentar");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState<number | null>(null);

  const t = {
    pt: {
      title: "Gerenciamento de Categorias",
      description: "Crie, edite e gerencie categorias de produtos",
      addNew: "Adicionar Categoria",
      products: "Produtos",
      manageProducts: "Gerenciar produtos desta categoria",
      back: "Voltar",
      search: "Pesquisar categorias...",
      filter: "Filtrar por tipo",
      filterAll: "Todos",
      filterFood: "Alimentar",
      filterNonFood: "Não-Alimentar",
      name: "Nome da Categoria",
      mainCategory: "Tipo Principal",
      curvaFaturamento: "Curva de Faturamento",
      curvaLucratividade: "Curva de Lucratividade",
      papelEstrategico: "Papel Estratégico",
      defaultGiro: "Giro Padrão",
      defaultMargem: "Margem Padrão",
      defaultLargura: "Largura Padrão (cm)",
      defaultComprimento: "Comprimento Padrão (cm)",
      defaultAltura: "Altura Padrão (cm)",
      descriptionLabel: "Descrição",
      salesVolume: "Volume de Vendas (R$)",
      turnoverRate: "Taxa de Giro (%)",
      profitMargin: "Margem de Lucro (%)",
      stockoutRate: "Taxa de Ruptura (%)",
      save: "Salvar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Deletar",
      create: "Criar Categoria",
      update: "Atualizar Categoria",
      noCategories: "Nenhuma categoria encontrada",
      deleteConfirm: "Tem certeza que deseja deletar esta categoria?",
      deleteSuccess: "Categoria deletada com sucesso",
      createSuccess: "Categoria criada com sucesso",
      updateSuccess: "Categoria atualizada com sucesso",
      error: "Erro ao processar categoria",
      performance: "Performance",
      details: "Detalhes",
      actions: "Ações",
    },
    en: {
      title: "Category Management",
      description: "Create, edit and manage product categories",
      addNew: "Add Category",
      products: "Products",
      manageProducts: "Manage products in this category",
      back: "Back",
      search: "Search categories...",
      filter: "Filter by type",
      filterAll: "All",
      filterFood: "Food",
      filterNonFood: "Non-Food",
      name: "Category Name",
      mainCategory: "Main Type",
      curvaFaturamento: "Revenue Curve",
      curvaLucratividade: "Profitability Curve",
      papelEstrategico: "Strategic Role",
      defaultGiro: "Default Turnover",
      defaultMargem: "Default Margin",
      defaultLargura: "Default Width (cm)",
      defaultComprimento: "Default Length (cm)",
      defaultAltura: "Default Height (cm)",
      descriptionLabel: "Description",
      salesVolume: "Sales Volume (R$)",
      turnoverRate: "Turnover Rate (%)",
      profitMargin: "Profit Margin (%)",
      stockoutRate: "Stockout Rate (%)",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      create: "Create Category",
      update: "Update Category",
      noCategories: "No categories found",
      deleteConfirm: "Are you sure you want to delete this category?",
      deleteSuccess: "Category deleted successfully",
      createSuccess: "Category created successfully",
      updateSuccess: "Category updated successfully",
      error: "Error processing category",
      performance: "Performance",
      details: "Details",
      actions: "Actions",
    },
  };

  const texts = t[language as keyof typeof t];

  const { data: categories, isLoading, refetch } = trpc.categories.list.useQuery({});
  const createMutation = trpc.categories.create.useMutation();
  const updateMutation = trpc.categories.update.useMutation();
  const deleteMutation = trpc.categories.delete.useMutation();

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        mainCategory: category.mainCategory,
        curvaFaturamento: category.curvaFaturamento,
        curvaLucratividade: category.curvaLucratividade,
        papelEstrategico: category.papelEstrategico,
        defaultGiro: category.defaultGiro,
        defaultMargem: category.defaultMargem,
        defaultLargura: category.defaultLargura,
        defaultComprimento: category.defaultComprimento,
        defaultAltura: category.defaultAltura,
        description: category.description,
        salesVolume: category.salesVolume,
        turnoverRate: category.turnoverRate,
        profitMargin: category.profitMargin,
        stockoutRate: category.stockoutRate,
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
    if (!formData.name || !formData.papelEstrategico) {
      toast.error(texts.error);
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success(texts.updateSuccess);
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(texts.createSuccess);
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error(texts.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(texts.deleteConfirm)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success(texts.deleteSuccess);
        refetch();
      } catch (error) {
        toast.error(texts.error);
      }
    }
  };

  const filteredCategories = (categories || []).filter((cat: any) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.papelEstrategico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = cat.mainCategory === filterMain;
    return matchesSearch && matchesFilter;
  });

  const toggleRowExpanded = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (selectedCategoryForProducts) {
    const category = categories?.find((c: any) => c.id === selectedCategoryForProducts);
    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setSelectedCategoryForProducts(null)}
          className="mb-4"
        >
          ← {texts.back}
        </Button>
        {category && (
          <CategoryProductsAdmin
            categoryId={selectedCategoryForProducts}
            categoryName={category.name}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{texts.title}</h1>
          <p className="text-slate-600">{texts.description}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={texts.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterMain} onValueChange={(value: any) => setFilterMain(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentar">{texts.filterFood}</SelectItem>
                <SelectItem value="Não-Alimentar">{texts.filterNonFood}</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {texts.addNew}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? texts.update : texts.create}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId ? "Edite os dados da categoria" : "Preencha os dados da nova categoria"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.name}</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Cervejas"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{texts.mainCategory}</label>
                      <Select
                        value={formData.mainCategory}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, mainCategory: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alimentar">{texts.filterFood}</SelectItem>
                          <SelectItem value="Não-Alimentar">{texts.filterNonFood}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.curvaFaturamento}</label>
                      <Select
                        value={formData.curvaFaturamento}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, curvaFaturamento: value })
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
                          setFormData({ ...formData, curvaLucratividade: value })
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
                      <label className="text-sm font-medium">{texts.papelEstrategico}</label>
                      <Input
                        value={formData.papelEstrategico}
                        onChange={(e) =>
                          setFormData({ ...formData, papelEstrategico: e.target.value })
                        }
                        placeholder="Ex: Destino/Tráfego"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                      <label className="text-sm font-medium">{texts.descriptionLabel}</label>
                      <Input
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Descrição opcional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.defaultLargura}</label>
                      <Input
                        type="number"
                        value={formData.defaultLargura}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultLargura: parseInt(e.target.value) || 0,
                          })
                        }
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{texts.defaultComprimento}</label>
                      <Input
                        type="number"
                        value={formData.defaultComprimento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultComprimento: parseInt(e.target.value) || 0,
                          })
                        }
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{texts.defaultAltura}</label>
                      <Input
                        type="number"
                        value={formData.defaultAltura}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultAltura: parseInt(e.target.value) || 0,
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.salesVolume}</label>
                      <Input
                        type="number"
                        value={formData.salesVolume || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salesVolume: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{texts.turnoverRate}</label>
                      <Input
                        type="number"
                        value={formData.turnoverRate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            turnoverRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{texts.profitMargin}</label>
                      <Input
                        type="number"
                        value={formData.profitMargin || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profitMargin: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{texts.stockoutRate}</label>
                      <Input
                        type="number"
                        value={formData.stockoutRate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockoutRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    {texts.cancel}
                  </Button>
                  <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                    {texts.save}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-slate-500">Carregando...</div>
            </CardContent>
          </Card>
        ) : filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-slate-500">{texts.noCategories}</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category: any) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleRowExpanded(category.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedRows.has(category.id) ? "rotate-180" : ""
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">{category.name}</h3>
                        <p className="text-sm text-slate-600">{category.papelEstrategico}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {category.mainCategory}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Curva: {category.curvaFaturamento}/{category.curvaLucratividade}
                    </span>
                  </div>
                </div>

                {expandedRows.has(category.id) && (
                  <CardContent className="pt-0 pb-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-600">{texts.defaultGiro}</p>
                        <p className="font-semibold">{category.defaultGiro}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{texts.defaultMargem}</p>
                        <p className="font-semibold">{category.defaultMargem}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{texts.defaultLargura}</p>
                        <p className="font-semibold">{category.defaultLargura} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{texts.defaultComprimento}</p>
                        <p className="font-semibold">{category.defaultComprimento} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{texts.defaultAltura}</p>
                        <p className="font-semibold">{category.defaultAltura} cm</p>
                      </div>
                    </div>

                    {(category.salesVolume || category.turnoverRate || category.profitMargin || category.stockoutRate) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-slate-50 rounded">
                        {category.salesVolume > 0 && (
                          <div>
                            <p className="text-xs text-slate-600">{texts.salesVolume}</p>
                            <p className="font-semibold">R$ {category.salesVolume.toFixed(2)}</p>
                          </div>
                        )}
                        {category.turnoverRate > 0 && (
                          <div>
                            <p className="text-xs text-slate-600">{texts.turnoverRate}</p>
                            <p className="font-semibold">{category.turnoverRate.toFixed(1)}%</p>
                          </div>
                        )}
                        {category.profitMargin > 0 && (
                          <div>
                            <p className="text-xs text-slate-600">{texts.profitMargin}</p>
                            <p className="font-semibold">{category.profitMargin.toFixed(1)}%</p>
                          </div>
                        )}
                        {category.stockoutRate > 0 && (
                          <div>
                            <p className="text-xs text-slate-600">{texts.stockoutRate}</p>
                            <p className="font-semibold">{category.stockoutRate.toFixed(1)}%</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCategoryForProducts(category.id)}
                        className="gap-1"
                        title={texts.manageProducts}
                      >
                        <Package className="w-4 h-4" />
                        {texts.products}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(category)}
                        className="gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        {texts.edit}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        {texts.delete}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
