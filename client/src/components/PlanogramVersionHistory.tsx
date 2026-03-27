/**
 * PlanogramVersionHistory Component
 * Manages version history of planograms with comparison and restore functionality
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

interface PlanogramVersion {
  id: string;
  timestamp: Date;
  categoryName: string;
  productCount: number;
  shelfConfiguration: {
    width: number;
    height: number;
    depth: number;
  };
  description?: string;
  isCurrent?: boolean;
}

interface PlanogramVersionHistoryProps {
  versions: PlanogramVersion[];
  currentVersion?: PlanogramVersion;
  onRestore: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  onCompare: (versionId1: string, versionId2: string) => void;
}

const TRANSLATIONS = {
  pt: {
    version_history: "Histórico de Versões",
    no_versions: "Nenhuma versão salva",
    current_version: "Versão Atual",
    saved_at: "Salvo em",
    products: "produtos",
    shelf_config: "Configuração",
    restore: "Restaurar",
    delete: "Deletar",
    compare: "Comparar",
    compare_with: "Comparar com",
    version: "Versão",
    category: "Categoria",
    date: "Data",
    details: "Detalhes",
    confirm_delete: "Tem certeza que deseja deletar esta versão?",
    restore_success: "Versão restaurada com sucesso",
    delete_success: "Versão deletada com sucesso",
    no_comparison: "Selecione duas versões para comparar",
  },
  en: {
    version_history: "Version History",
    no_versions: "No saved versions",
    current_version: "Current Version",
    saved_at: "Saved at",
    products: "products",
    shelf_config: "Configuration",
    restore: "Restore",
    delete: "Delete",
    compare: "Compare",
    compare_with: "Compare with",
    version: "Version",
    category: "Category",
    date: "Date",
    details: "Details",
    confirm_delete: "Are you sure you want to delete this version?",
    restore_success: "Version restored successfully",
    delete_success: "Version deleted successfully",
    no_comparison: "Select two versions to compare",
  },
};

export default function PlanogramVersionHistory({
  versions,
  currentVersion,
  onRestore,
  onDelete,
  onCompare,
}: PlanogramVersionHistoryProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const dateLocale = language === "pt" ? ptBR : enUS;

  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set()
  );
  const [selectedForComparison, setSelectedForComparison] = useState<
    string | null
  >(null);

  const toggleExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleCompare = (versionId: string) => {
    if (selectedForComparison === null) {
      setSelectedForComparison(versionId);
    } else if (selectedForComparison === versionId) {
      setSelectedForComparison(null);
    } else {
      onCompare(selectedForComparison, versionId);
      setSelectedForComparison(null);
    }
  };

  const handleDelete = (versionId: string) => {
    if (confirm(t.confirm_delete)) {
      onDelete(versionId);
    }
  };

  if (versions.length === 0) {
    return (
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{t.no_versions}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {t.version_history}
        </h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {versions.length} {language === "pt" ? "versões" : "versions"}
        </span>
      </div>

      <div className="space-y-2">
        {versions.map((version, idx) => (
          <div
            key={version.id}
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              version.isCurrent
                ? "border-green-500 bg-green-50"
                : selectedForComparison === version.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Version Header */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpanded(version.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {t.version} #{versions.length - idx}
                    </span>
                    {version.isCurrent && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        {t.current_version}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.saved_at}:{" "}
                    {formatDistanceToNow(version.timestamp, {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {version.categoryName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {version.productCount} {t.products}
                  </p>
                </div>
              </div>

              {expandedVersions.has(version.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Version Details */}
            {expandedVersions.has(version.id) && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                {/* Configuration Details */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    {t.shelf_config}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-gray-500">Largura</p>
                      <p className="font-semibold text-gray-800">
                        {version.shelfConfiguration.width}cm
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-gray-500">Altura</p>
                      <p className="font-semibold text-gray-800">
                        {version.shelfConfiguration.height}cm
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-gray-500">Profundidade</p>
                      <p className="font-semibold text-gray-800">
                        {version.shelfConfiguration.depth}cm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {version.description && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {t.details}
                    </p>
                    <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                      {version.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-2">
                  {!version.isCurrent && (
                    <Button
                      onClick={() => onRestore(version.id)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t.restore}
                    </Button>
                  )}

                  <Button
                    onClick={() => handleCompare(version.id)}
                    size="sm"
                    variant={
                      selectedForComparison === version.id
                        ? "default"
                        : "outline"
                    }
                    className="flex items-center gap-1 text-xs"
                  >
                    {t.compare}
                  </Button>

                  {!version.isCurrent && (
                    <Button
                      onClick={() => handleDelete(version.id)}
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1 text-xs ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t.delete}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Info */}
      {selectedForComparison && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            💡 {t.compare_with}{" "}
            <span className="font-semibold">
              {versions.find((v) => v.id === selectedForComparison)
                ?.categoryName || ""}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
