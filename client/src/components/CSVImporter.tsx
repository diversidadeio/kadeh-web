/**
 * CSVImporter Component
 * Importa produtos em massa via CSV/Excel com cálculo de margem e giro
 * Design: Tech-Forward Minimalism
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle, Download } from "lucide-react";

type CategoryType = "Alimentar" | "Não-Alimentar";
type SubCategory = "Alimentos" | "Bebidas" | "Higiene" | "Beleza" | "Vestuário" | "Eletrônicos" | "Brinquedos" | "Outro";

interface ImportedProduct {
  id: string;
  name: string;
  ean: string;
  codigoInterno?: string;
  dimensoes?: string;
  largura?: number; // largura do produto em cm
  comprimento?: number; // comprimento/profundidade do produto em cm
  precoVenda: number;
  margem: "Baixa" | "Média" | "Alta" | number;
  giro: "Baixo" | "Médio" | "Alto" | number;
  category: CategoryType;
  subCategory: SubCategory;
}

interface CSVImporterProps {
  onImport: (products: ImportedProduct[]) => void;
}

const CATEGORIES = {
  "Alimentar": ["Alimentos", "Bebidas"],
  "Não-Alimentar": ["Higiene", "Beleza", "Vestuário", "Eletrônicos", "Brinquedos", "Outro"],
};

export default function CSVImporter({ onImport }: CSVImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [previewData, setPreviewData] = useState<ImportedProduct[]>([]);

  const downloadTemplate = () => {
    const template = `EAN,Código Interno,Nome do Produto,Largura (cm),Comprimento (cm),Preço de Venda,Margem,Giro,Categoria,Subcategoria
7891234567890,INT001,Arroz Integral 5kg,20,30,25.50,Alta,Alto,Alimentar,Alimentos
7891234567891,INT002,Óleo de Soja 900ml,8,15,8.99,Média,Médio,Alimentar,Alimentos
7891234567892,INT003,Refrigerante 2L,10,20,7.50,Baixa,Alto,Alimentar,Bebidas
7891234567893,INT004,Sabonete Líquido 250ml,5,10,12.00,Média,Médio,Não-Alimentar,Higiene
7891234567894,INT005,Creme Facial 50ml,3,8,45.00,Alta,Baixo,Não-Alimentar,Beleza`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_produtos_kadeh.csv";
    link.click();
  };

  const parseCSV = (text: string): ImportedProduct[] => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const products: ImportedProduct[] = [];
    const newErrors: string[] = [];

    // Validar headers
    const requiredHeaders = ["ean", "nome do produto", "preço de venda", "margem", "giro", "categoria", "subcategoria"];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      newErrors.push(`Colunas obrigatórias faltando: ${missingHeaders.join(", ")}`);
      setErrors(newErrors);
      return [];
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map(v => v.trim());
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      try {
        const ean = row["ean"];
        const nome = row["nome do produto"];
        const preco = parseFloat(row["preço de venda"]);
        const margem = row["margem"];
        const giro = row["giro"];
        const categoria = row["categoria"] as CategoryType;
        const subcategoria = row["subcategoria"] as SubCategory;

        // Validações
        if (!ean) throw new Error(`Linha ${i + 1}: EAN obrigatório`);
        if (!nome) throw new Error(`Linha ${i + 1}: Nome do produto obrigatório`);
        if (isNaN(preco)) throw new Error(`Linha ${i + 1}: Preço inválido`);
        if (!["Alimentar", "Não-Alimentar"].includes(categoria)) {
          throw new Error(`Linha ${i + 1}: Categoria inválida (use "Alimentar" ou "Não-Alimentar")`);
        }
        if (!Object.values(CATEGORIES).flat().includes(subcategoria)) {
          throw new Error(`Linha ${i + 1}: Subcategoria inválida`);
        }

        // Processar margem e giro (podem ser texto ou número)
        let processedMargem: "Baixa" | "Média" | "Alta" | number;
        let processedGiro: "Baixo" | "Médio" | "Alto" | number;

        if (["Baixa", "Média", "Alta"].includes(margem)) {
          processedMargem = margem as "Baixa" | "Média" | "Alta";
        } else {
          const margemNum = parseFloat(margem);
          if (isNaN(margemNum)) throw new Error(`Linha ${i + 1}: Margem inválida`);
          processedMargem = margemNum;
        }

        if (["Baixo", "Médio", "Alto"].includes(giro)) {
          processedGiro = giro as "Baixo" | "Médio" | "Alto";
        } else {
          const giroNum = parseFloat(giro);
          if (isNaN(giroNum)) throw new Error(`Linha ${i + 1}: Giro inválido`);
          processedGiro = giroNum;
        }

        // Parsear largura e comprimento
        const largura = row["largura (cm)"] ? parseFloat(row["largura (cm)"]) : undefined;
        const comprimento = row["comprimento (cm)"] ? parseFloat(row["comprimento (cm)"]) : undefined;

        products.push({
          id: `import-${i}-${Date.now()}`,
          name: nome,
          ean,
          codigoInterno: row["código interno"] || undefined,
          dimensoes: row["dimensões"] || undefined,
          largura: largura && !isNaN(largura) ? largura : undefined,
          comprimento: comprimento && !isNaN(comprimento) ? comprimento : undefined,
          precoVenda: preco,
          margem: processedMargem,
          giro: processedGiro,
          category: categoria,
          subCategory: subcategoria,
        });
      } catch (error) {
        newErrors.push(error instanceof Error ? error.message : `Linha ${i + 1}: Erro desconhecido`);
      }
    }

    setErrors(newErrors);
    setSuccessCount(products.length);
    setPreviewData(products);
    return products;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const products = parseCSV(text);
      if (products.length > 0) {
        onImport(products);
        setIsOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Botão de Importação */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {isOpen ? "Fechar Importador" : "Importar Produtos em Massa"}
      </Button>

      {/* Painel de Importação */}
      {isOpen && (
        <div className="bg-card p-6 rounded-md border border-border space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Importar Produtos via CSV</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Faça upload de um arquivo CSV com os produtos. Colunas obrigatórias: EAN, Nome do Produto, Preço de Venda, Margem, Giro, Categoria, Subcategoria. Colunas opcionais: Largura (cm), Comprimento (cm) para cálculo de capacidade.
            </p>
          </div>

          {/* Campo Explicativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Sobre Margem e Giro
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>Opção 1 - Categorias:</strong> Use "Baixa", "Média" ou "Alta" para classificação rápida</li>
              <li><strong>Opção 2 - Valores Numéricos:</strong> Use percentuais (ex: 25.5 para 25.5%) ou índices (ex: 1.2). O sistema calculará a média ponderada automaticamente</li>
              <li><strong>Exemplo:</strong> Margem: 35.5 (35.5% de lucro) | Giro: 2.8 (2.8 unidades/mês)</li>
            </ul>
          </div>

          {/* Upload */}
          <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Clique para selecionar arquivo CSV</span>
                <span className="text-xs text-muted-foreground">ou arraste aqui</span>
              </div>
            </label>
          </div>

          {/* Download Template */}
          <Button
            onClick={downloadTemplate}
            variant="secondary"
            className="w-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar Template CSV
          </Button>

          {/* Erros */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Erros na Importação ({errors.length})
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sucesso */}
          {successCount > 0 && errors.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Importação Bem-sucedida
              </h4>
              <p className="text-sm text-green-800">{successCount} produtos importados com sucesso!</p>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Prévia dos Produtos ({previewData.length})</h4>
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2">EAN</th>
                      <th className="text-left py-2 px-2">Produto</th>
                      <th className="text-left py-2 px-2">Preço</th>
                      <th className="text-left py-2 px-2">Margem</th>
                      <th className="text-left py-2 px-2">Giro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((product) => (
                      <tr key={product.id} className="border-b border-border">
                        <td className="py-2 px-2">{product.ean}</td>
                        <td className="py-2 px-2">{product.name}</td>
                        <td className="py-2 px-2">R$ {product.precoVenda.toFixed(2)}</td>
                        <td className="py-2 px-2">{typeof product.margem === "number" ? `${product.margem.toFixed(1)}%` : product.margem}</td>
                        <td className="py-2 px-2">{typeof product.giro === "number" ? `${product.giro.toFixed(1)}x` : product.giro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 5 && (
                  <p className="text-xs text-muted-foreground p-2">... e mais {previewData.length - 5} produtos</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
