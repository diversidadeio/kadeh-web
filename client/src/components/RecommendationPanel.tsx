/**
 * Recommendation Panel Component
 * 
 * Exibe recomendações de posicionamento de produtos baseadas na matriz
 * de decisão Margem x Giro
 */

import { useState } from "react";
import {
  ProductRecommendation,
  groupByClassification,
  groupByPrimaryPosition,
  calculateRecommendationStats,
  exportRecommendationsToCSV,
  formatShelfZone,
  formatClassification,
  formatSpaceExpansionPriority,
} from "@/utils/productRecommendationEngine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Download,
  Eye,
  Hand,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
} from "lucide-react";

interface RecommendationPanelProps {
  recommendations: ProductRecommendation[];
  onApplyRecommendation?: (recommendation: ProductRecommendation) => void;
}

type ViewMode = "list" | "by-classification" | "by-position" | "stats";

export default function RecommendationPanel({
  recommendations,
  onApplyRecommendation,
}: RecommendationPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const stats = calculateRecommendationStats(recommendations);
  const byClassification = groupByClassification(recommendations);
  const byPosition = groupByPrimaryPosition(recommendations);

  const getClassificationIcon = (classification: string) => {
    if (classification.includes("GERADOR_DE_CAIXA")) return <Zap className="w-5 h-5 text-yellow-500" />;
    if (classification.includes("PRODUTO_FOCO")) return <Target className="w-5 h-5 text-blue-500" />;
    if (classification.includes("RISCO")) return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getPositionIcon = (position: string) => {
    if (position.includes("OLHOS")) return <Eye className="w-4 h-4 text-orange-500" />;
    if (position.includes("MÃOS")) return <Hand className="w-4 h-4 text-blue-500" />;
    return <TrendingUp className="w-4 h-4 text-gray-500" />;
  };

  const getPositionColor = (position: string) => {
    if (position.includes("OLHOS")) return "bg-orange-50 border-orange-200";
    if (position.includes("MÃOS")) return "bg-blue-50 border-blue-200";
    return "bg-gray-50 border-gray-200";
  };

  const handleExportCSV = () => {
    const csv = exportRecommendationsToCSV(recommendations);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recomendacoes-posicionamento.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">📋 Recomendações de Posicionamento</h3>
          <p className="text-gray-600 mt-1">
            {recommendations.length} produto{recommendations.length !== 1 ? "s" : ""} analisado
            {recommendations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${
            viewMode === "list"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lista Completa
        </button>
        <button
          onClick={() => setViewMode("by-classification")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${
            viewMode === "by-classification"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Por Classificação
        </button>
        <button
          onClick={() => setViewMode("by-position")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${
            viewMode === "by-position"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Por Posição
        </button>
        <button
          onClick={() => setViewMode("stats")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${
            viewMode === "stats"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Estatísticas
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {viewMode === "list" && (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card
                key={rec.productId}
                className={`p-4 cursor-pointer transition hover:shadow-md ${getPositionColor(
                  rec.primaryPosition
                )}`}
                onClick={() =>
                  setExpandedProduct(
                    expandedProduct === rec.productId ? null : rec.productId
                  )
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getClassificationIcon(rec.classification)}
                      <h4 className="font-semibold text-gray-900">{rec.productName}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-2 py-1 bg-white rounded border border-gray-200">
                        Margem: {rec.margin.toFixed(0)}%
                      </span>
                      <span className="px-2 py-1 bg-white rounded border border-gray-200">
                        Giro: {rec.velocity.toFixed(0)}%
                      </span>
                      <span className="px-2 py-1 bg-white rounded border border-orange-200 flex items-center gap-1">
                        {getPositionIcon(rec.primaryPosition)}
                        {formatShelfZone(rec.primaryPosition)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      {formatSpaceExpansionPriority(rec.spaceExpansionPriority)}
                    </div>
                    {onApplyRecommendation && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyRecommendation(rec);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Aplicar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedProduct === rec.productId && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Classificação:</p>
                      <p className="text-sm text-gray-600">{formatClassification(rec.classification)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Posição Secundária:</p>
                      <p className="text-sm text-gray-600">{formatShelfZone(rec.secondaryPosition)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Justificativa:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{rec.reasoning}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {viewMode === "by-classification" && (
          <div className="space-y-4">
            {Object.entries(byClassification).map(([classification, products]) => (
              products.length > 0 && (
                <div key={classification}>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {getClassificationIcon(classification)}
                    {formatClassification(classification as any)} ({products.length})
                  </h4>
                  <div className="grid gap-2 ml-7">
                    {products.map((rec) => (
                      <div
                        key={rec.productId}
                        className={`p-3 rounded border ${getPositionColor(rec.primaryPosition)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{rec.productName}</p>
                            <p className="text-xs text-gray-600">
                              Margem: {rec.margin.toFixed(0)}% | Giro: {rec.velocity.toFixed(0)}%
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            {getPositionIcon(rec.primaryPosition)}
                            {formatShelfZone(rec.primaryPosition)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {viewMode === "by-position" && (
          <div className="space-y-4">
            {Object.entries(byPosition).map(([position, products]) => (
              products.length > 0 && (
                <div key={position}>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {getPositionIcon(position)}
                    {formatShelfZone(position as any)} ({products.length})
                  </h4>
                  <div className="grid gap-2 ml-7">
                    {products.map((rec) => (
                      <div
                        key={rec.productId}
                        className={`p-3 rounded border ${getPositionColor(position)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{rec.productName}</p>
                            <p className="text-xs text-gray-600">
                              {formatClassification(rec.classification)}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {rec.margin.toFixed(0)}% / {rec.velocity.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {viewMode === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position Distribution */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Distribuição por Posição
              </h4>
              <div className="space-y-2">
                {Object.entries(stats.byPosition).map(([position, count]) => (
                  <div key={position} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{formatShelfZone(position as any)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(count / stats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Classification Distribution */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Distribuição por Classificação
              </h4>
              <div className="space-y-2">
                {Object.entries(stats.byClassification)
                  .filter(([, count]) => count > 0)
                  .map(([classification, count]) => (
                    <div key={classification} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">
                        {formatClassification(classification as any)}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Summary Stats */}
            <Card className="p-6 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-4">Resumo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-gray-600 mt-1">Total de Produtos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.byPosition.ALTURA_DOS_OLHOS || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Altura dos Olhos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.byPosition.ALTURA_DAS_MÃOS || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Altura das Mãos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">
                    {stats.byPosition.PARTE_DE_BAIXO || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Parte de Baixo</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
