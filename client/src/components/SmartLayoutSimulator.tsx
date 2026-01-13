/**
 * SmartLayoutSimulator Component
 * Interactive simulator for testing layout recommendations
 * Design: Tech-Forward Minimalism with interactive elements
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
}

interface Recommendation {
  frentes: number;
  zone: string;
  share: number;
  label: string;
  color: string;
}

const RECOMMENDATION_MATRIX = {
  "Alto-Alta": { frentes: 1, zone: "Altura dos olhos", share: 35, label: "Maior espaço", color: "bg-green-600" },
  "Alto-Média": { frentes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Alto-Baixa": { frentes: 2, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Alta": { frentes: 2, zone: "Altura dos olhos", share: 25, label: "Melhor espaço", color: "bg-green-500" },
  "Médio-Média": { frentes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Médio-Baixa": { frentes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Alta": { frentes: 3, zone: "Altura das mãos", share: 20, label: "Bom espaço", color: "bg-yellow-500" },
  "Baixo-Média": { frentes: 4, zone: "Altura das mãos", share: 15, label: "Pequeno espaço", color: "bg-orange-400" },
  "Baixo-Baixa": { frentes: 5, zone: "Lugar baixo", share: 5, label: "Menor espaço", color: "bg-red-400" },
};

function getRecommendation(giro: string, margem: string): Recommendation {
  const key = `${giro}-${margem}`;
  return RECOMMENDATION_MATRIX[key as keyof typeof RECOMMENDATION_MATRIX] || 
    { frentes: 1, zone: "N/A", share: 0, label: "N/A", color: "bg-gray-300" };
}

export default function SmartLayoutSimulator() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa" },
    { id: "2", name: "Refrigerante 2L", giro: "Alto", margem: "Média" },
    { id: "3", name: "Brinquedo Premium", giro: "Baixo", margem: "Alta" },
  ]);

  const [gondolaWidth, setGondolaWidth] = useState(280);
  const [shelves, setShelves] = useState(5);
  const [newProductName, setNewProductName] = useState("");
  const [newProductGiro, setNewProductGiro] = useState<"Baixo" | "Médio" | "Alto">("Médio");
  const [newProductMargem, setNewProductMargem] = useState<"Baixa" | "Média" | "Alta">("Média");

  const addProduct = () => {
    if (newProductName.trim()) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: newProductName,
        giro: newProductGiro,
        margem: newProductMargem,
      };
      setProducts([...products, newProduct]);
      setNewProductName("");
      setNewProductGiro("Médio");
      setNewProductMargem("Média");
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const resetSimulator = () => {
    setProducts([
      { id: "1", name: "Arroz 5kg", giro: "Alto", margem: "Baixa" },
      { id: "2", name: "Refrigerante 2L", giro: "Alto", margem: "Média" },
      { id: "3", name: "Brinquedo Premium", giro: "Baixo", margem: "Alta" },
    ]);
    setGondolaWidth(280);
    setShelves(5);
  };

  const totalShare = products.reduce((sum, p) => {
    const rec = getRecommendation(p.giro, p.margem);
    return sum + rec.share;
  }, 0);

  const spacePer100 = gondolaWidth / 100;

  return (
    <div className="space-y-8">
      {/* Configuração da Gôndola */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Configurar Gôndola</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Largura da Gôndola (cm)
            </label>
            <input
              type="number"
              min="100"
              max="500"
              value={gondolaWidth}
              onChange={(e) => setGondolaWidth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Largura disponível em cm</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Número de Prateleiras
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={shelves}
              onChange={(e) => setShelves(Number(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Número total de prateleiras</p>
          </div>
        </div>
      </div>

      {/* Adicionar Produto */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Adicionar Produto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome do Produto
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Ex: Café Premium"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Giro
            </label>
            <select
              value={newProductGiro}
              onChange={(e) => setNewProductGiro(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Baixo</option>
              <option>Médio</option>
              <option>Alto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Margem
            </label>
            <select
              value={newProductMargem}
              onChange={(e) => setNewProductMargem(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={addProduct}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Produtos e Recomendações */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Produtos e Recomendações</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Produto</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Giro</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Margem</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Frentes</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Posicionamento</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">% Espaço</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Espaço (cm)</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Ação</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const rec = getRecommendation(product.giro, product.margem);
                const spaceCm = (rec.share / 100) * gondolaWidth;
                
                return (
                  <tr key={product.id} className="border-b border-border hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={product.giro}
                        onChange={(e) => updateProduct(product.id, "giro", e.target.value)}
                        className="px-2 py-1 border border-border rounded text-sm"
                      >
                        <option>Baixo</option>
                        <option>Médio</option>
                        <option>Alto</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={product.margem}
                        onChange={(e) => updateProduct(product.id, "margem", e.target.value)}
                        className="px-2 py-1 border border-border rounded text-sm"
                      >
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${rec.color} text-white font-bold text-xs`}>
                        {rec.frentes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{rec.zone}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{rec.share}%</td>
                    <td className="px-4 py-3 font-medium text-foreground">{spaceCm.toFixed(1)} cm</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualização da Gôndola */}
      <div className="bg-card p-8 rounded-md border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Visualização da Gôndola</h3>
        
        <div className="space-y-4">
          {/* Prateleiras */}
          {Array.from({ length: shelves }).map((_, shelfIdx) => (
            <div key={shelfIdx} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Prateleira {shelves - shelfIdx}</p>
              <div className="flex gap-2 bg-white border border-border rounded p-3" style={{ width: "100%" }}>
                {products.map((product) => {
                  const rec = getRecommendation(product.giro, product.margem);
                  const spaceCm = (rec.share / 100) * gondolaWidth;
                  const widthPercent = (spaceCm / gondolaWidth) * 100;
                  
                  return (
                    <div
                      key={product.id}
                      className={`${rec.color} text-white rounded px-2 py-1 text-xs font-medium flex items-center justify-center transition-all`}
                      style={{ width: `${widthPercent}%`, minWidth: "40px" }}
                      title={`${product.name}: ${rec.frentes} frente(s)`}
                    >
                      <span className="truncate">{product.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo e Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-md border border-border">
          <p className="text-sm text-muted-foreground mb-2">Total de Produtos</p>
          <p className="text-3xl font-bold text-primary">{products.length}</p>
        </div>

        <div className="bg-card p-6 rounded-md border border-border">
          <p className="text-sm text-muted-foreground mb-2">Espaço Total Alocado</p>
          <p className="text-3xl font-bold text-primary">{totalShare}%</p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalShare > 100 ? "⚠️ Excedido" : totalShare < 100 ? "✓ Disponível" : "✓ Otimizado"}
          </p>
        </div>

        <div className="bg-card p-6 rounded-md border border-border">
          <p className="text-sm text-muted-foreground mb-2">Espaço Disponível</p>
          <p className="text-3xl font-bold text-primary">{gondolaWidth} cm</p>
          <p className="text-xs text-muted-foreground mt-2">
            {((100 - totalShare) / 100 * gondolaWidth).toFixed(1)} cm livres
          </p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={resetSimulator}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Simulador
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          Exportar Recomendações
        </Button>
      </div>
    </div>
  );
}
