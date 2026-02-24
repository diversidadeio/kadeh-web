import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { OptimizationResult, OptimizationSuggestion } from '@/utils/productOptimizer';

interface ProductOptimizationSuggestionsProps {
  result: OptimizationResult;
  onApply: () => void;
  isApplying?: boolean;
}

export function ProductOptimizationSuggestions({
  result,
  onApply,
  isApplying = false,
}: ProductOptimizationSuggestionsProps) {
  const { language } = useLanguage();
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());

  const labels = {
    pt: {
      optimizationSuggestions: 'Sugestões de Otimização',
      noSuggestions: 'Nenhuma sugestão de otimização disponível',
      currentMetrics: 'Métricas Atuais',
      optimizedMetrics: 'Métricas Otimizadas',
      totalMargin: 'Margem Total',
      totalRevenue: 'Faturamento Total',
      marginIncrease: 'Aumento de Margem',
      revenueIncrease: 'Aumento de Faturamento',
      applyOptimization: 'Aplicar Otimização',
      suggestions: 'Sugestões',
      moveFrom: 'Mover de',
      moveTo: 'para',
      reason: 'Motivo',
      estimatedImpact: 'Impacto Estimado',
      marginGain: 'Ganho de Margem',
      revenueGain: 'Ganho de Faturamento',
      eyeLevel: 'Altura dos Olhos',
      handLevel: 'Altura das Mãos',
      bottomLevel: 'Parte de Baixo',
      expandSuggestion: 'Expandir sugestão',
      collapseSuggestion: 'Recolher sugestão',
    },
    en: {
      optimizationSuggestions: 'Optimization Suggestions',
      noSuggestions: 'No optimization suggestions available',
      currentMetrics: 'Current Metrics',
      optimizedMetrics: 'Optimized Metrics',
      totalMargin: 'Total Margin',
      totalRevenue: 'Total Revenue',
      marginIncrease: 'Margin Increase',
      revenueIncrease: 'Revenue Increase',
      applyOptimization: 'Apply Optimization',
      suggestions: 'Suggestions',
      moveFrom: 'Move from',
      moveTo: 'to',
      reason: 'Reason',
      estimatedImpact: 'Estimated Impact',
      marginGain: 'Margin Gain',
      revenueGain: 'Revenue Gain',
      eyeLevel: 'Eye Level',
      handLevel: 'Hand Level',
      bottomLevel: 'Bottom Shelf',
      expandSuggestion: 'Expand suggestion',
      collapseSuggestion: 'Collapse suggestion',
    },
  };

  const currentLabels = labels[language as keyof typeof labels] || labels.pt;

  const getZoneName = (zone: string) => {
    if (zone === 'Altura dos olhos') return currentLabels.eyeLevel;
    if (zone === 'Altura das mãos') return currentLabels.handLevel;
    return currentLabels.bottomLevel;
  };

  const toggleSuggestion = (suggestionId: string) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(suggestionId)) {
      newExpanded.delete(suggestionId);
    } else {
      newExpanded.add(suggestionId);
    }
    setExpandedSuggestions(newExpanded);
  };

  if (result.suggestions.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <p className="text-blue-900">{currentLabels.noSuggestions}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentLabels.optimizationSuggestions}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Metrics */}
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  {currentLabels.currentMetrics}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.totalMargin}:</span>
                    <span className="font-bold text-gray-900">
                      R$ {result.currentTotalMargin.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.totalRevenue}:</span>
                    <span className="font-bold text-gray-900">
                      R$ {result.currentTotalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optimized Metrics */}
              <div>
                <p className="text-sm font-semibold text-green-600 mb-3">
                  {currentLabels.optimizedMetrics}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.totalMargin}:</span>
                    <span className="font-bold text-green-600">
                      R$ {result.optimizedTotalMargin.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLabels.totalRevenue}:</span>
                    <span className="font-bold text-green-600">
                      R$ {result.optimizedTotalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="mt-4 pt-4 border-t border-green-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">{currentLabels.marginIncrease}</p>
                <p className="text-xl font-bold text-green-600">
                  +{result.marginIncreasePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (R$ +{result.totalMarginIncrease.toFixed(2)})
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">{currentLabels.revenueIncrease}</p>
                <p className="text-xl font-bold text-green-600">
                  +{result.revenueIncreasePercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (R$ +{result.totalRevenueIncrease.toFixed(2)})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">
          {currentLabels.suggestions} ({result.suggestions.length})
        </h4>

        {result.suggestions.map((suggestion) => {
          const isExpanded = expandedSuggestions.has(suggestion.productId);

          return (
            <div
              key={suggestion.productId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors"
            >
              <button
                onClick={() => toggleSuggestion(suggestion.productId)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{suggestion.productName}</p>
                    <p className="text-sm text-gray-600">
                      {currentLabels.moveFrom} <span className="font-medium">{getZoneName(suggestion.currentZone)}</span>{' '}
                      {currentLabels.moveTo} <span className="font-medium text-green-600">{getZoneName(suggestion.suggestedZone)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +{suggestion.marginIncrease.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">margem</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 py-4 bg-white border-t border-gray-200 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {currentLabels.reason}
                    </p>
                    <p className="text-sm text-gray-600">{suggestion.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{currentLabels.marginGain}</p>
                      <p className="font-bold text-green-600">
                        R$ {suggestion.marginIncrease.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{currentLabels.revenueGain}</p>
                      <p className="font-bold text-green-600">
                        R$ {suggestion.revenueIncrease.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Apply Button */}
      <Button
        onClick={onApply}
        disabled={isApplying}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
      >
        {isApplying ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Aplicando...
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 mr-2" />
            {currentLabels.applyOptimization}
          </>
        )}
      </Button>
    </div>
  );
}
