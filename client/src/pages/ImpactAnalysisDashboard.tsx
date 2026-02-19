import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, DollarSign, AlertCircle } from "lucide-react";

interface Product {
  name: string;
  giro: "Baixo" | "Médio" | "Alto";
  margem: "Baixa" | "Média" | "Alta";
  currentSales: number;
  currentMargin: number;
}

export default function ImpactAnalysisDashboard() {
  const [products, setProducts] = useState<Product[]>([
    {
      name: "Azeite Extra Virgem Premium",
      giro: "Alto",
      margem: "Alta",
      currentSales: 15000,
      currentMargin: 35,
    },
    {
      name: "Azeite Extra Virgem",
      giro: "Médio",
      margem: "Média",
      currentSales: 12000,
      currentMargin: 22,
    },
    {
      name: "Azeite Virgem + Óleo Composto",
      giro: "Alto",
      margem: "Baixa",
      currentSales: 18000,
      currentMargin: 15,
    },
  ]);

  // Calcular métricas de impacto
  const calculateImpactMetrics = () => {
    const totalCurrentSales = products.reduce((sum, p) => sum + p.currentSales, 0);
    const totalCurrentMargin = products.reduce((sum, p) => sum + p.currentMargin * p.currentSales / 100, 0);

    // Estimativas de impacto com Smart Layout
    const improvementFactors: Record<string, number> = {
      "Alto-Alta": 1.35,
      "Alto-Média": 1.28,
      "Alto-Baixa": 1.20,
      "Médio-Alta": 1.25,
      "Médio-Média": 1.18,
      "Médio-Baixa": 1.12,
      "Baixo-Alta": 1.15,
      "Baixo-Média": 1.08,
      "Baixo-Baixa": 1.05,
    };

    let projectedSales = 0;
    let projectedMargin = 0;

    products.forEach((product) => {
      const key = `${product.giro}-${product.margem}`;
      const factor = improvementFactors[key] || 1.1;
      
      const newSales = product.currentSales * factor;
      const newMargin = product.currentMargin * factor;
      
      projectedSales += newSales;
      projectedMargin += newMargin * newSales / 100;
    });

    const salesIncrease = ((projectedSales - totalCurrentSales) / totalCurrentSales) * 100;
    const marginIncrease = ((projectedMargin - totalCurrentMargin) / totalCurrentMargin) * 100;

    return {
      currentSales: totalCurrentSales,
      projectedSales,
      salesIncrease,
      currentMargin: totalCurrentMargin,
      projectedMargin,
      marginIncrease,
      stockoutReduction: 12, // Redução estimada de ruptura em %
      customerSatisfaction: 8, // Aumento em pontos percentuais
    };
  };

  const metrics = calculateImpactMetrics();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Título */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Análise de Impacto - Smart Layout
            </h1>
            <p className="text-xl text-gray-600">
              Visualize o impacto esperado das recomendações de posicionamento de produtos
            </p>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Aumento de Vendas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Aumento de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  +{metrics.salesIncrease.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  De R$ {(metrics.currentSales / 1000).toFixed(0)}k para R$ {(metrics.projectedSales / 1000).toFixed(0)}k
                </p>
              </CardContent>
            </Card>

            {/* Aumento de Margem */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Aumento de Margem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  +{metrics.marginIncrease.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  De R$ {(metrics.currentMargin / 1000).toFixed(0)}k para R$ {(metrics.projectedMargin / 1000).toFixed(0)}k
                </p>
              </CardContent>
            </Card>

            {/* Redução de Ruptura */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Redução de Ruptura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  -{metrics.stockoutReduction}%
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Menos faltas de estoque
                </p>
              </CardContent>
            </Card>

            {/* Satisfação do Cliente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  Satisfação do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  +{metrics.customerSatisfaction}%
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Melhor experiência de compra
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Análise por Produto */}
          <Card>
            <CardHeader>
              <CardTitle>Impacto por Produto</CardTitle>
              <CardDescription>
                Projeção de vendas e margem após implementação das recomendações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products.map((product, index) => {
                  const key = `${product.giro}-${product.margem}`;
                  const improvementFactors: Record<string, number> = {
                    "Alto-Alta": 1.35,
                    "Alto-Média": 1.28,
                    "Alto-Baixa": 1.20,
                    "Médio-Alta": 1.25,
                    "Médio-Média": 1.18,
                    "Médio-Baixa": 1.12,
                    "Baixo-Alta": 1.15,
                    "Baixo-Média": 1.08,
                    "Baixo-Baixa": 1.05,
                  };
                  const factor = improvementFactors[key] || 1.1;
                  const projectedSales = product.currentSales * factor;
                  const salesIncrease = ((projectedSales - product.currentSales) / product.currentSales) * 100;

                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            Giro: {product.giro} • Margem: {product.margem}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">+{salesIncrease.toFixed(1)}%</div>
                          <p className="text-xs text-gray-600">Aumento esperado</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Vendas Atuais</p>
                          <p className="text-lg font-bold">R$ {(product.currentSales / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Vendas Projetadas</p>
                          <p className="text-lg font-bold text-green-600">R$ {(projectedSales / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Margem Atual</p>
                          <p className="text-lg font-bold">{product.currentMargin}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Margem Projetada</p>
                          <p className="text-lg font-bold text-blue-600">{(product.currentMargin * factor).toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Barra de progresso */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(factor * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Benefícios Comprovados */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios Comprovados do Smart Layout</CardTitle>
              <CardDescription>
                Resultados observados em implementações anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">Aumento de Lucratividade</h4>
                  <p className="text-3xl font-bold text-green-600">+28%</p>
                  <p className="text-sm text-gray-600">
                    Média de aumento de lucratividade em 6 meses
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">Redução de Ruptura</h4>
                  <p className="text-3xl font-bold text-orange-600">-15%</p>
                  <p className="text-sm text-gray-600">
                    Menos faltas de estoque dos produtos principais
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900">ROI Esperado</h4>
                  <p className="text-3xl font-bold text-blue-600">3-6 meses</p>
                  <p className="text-sm text-gray-600">
                    Retorno do investimento em implementação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Pronto para otimizar suas gôndolas?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Implemente as recomendações do Smart Layout e veja o impacto real nas vendas e lucratividade da sua loja.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ir para Smart Layout
              </Button>
              <Button size="lg" variant="outline">
                Solicitar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
