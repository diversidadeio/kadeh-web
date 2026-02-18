/**
 * ERP Import Dialog Component
 * Handles file upload and data import from ERP systems
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Download, Upload } from "lucide-react";
import { importProductsFromFile, getSampleCSVTemplate, getSampleJSONTemplate, type ERPProduct, type ERPSystem } from "@/data/erpIntegration";

interface ERPImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (products: ERPProduct[]) => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Importar Dados de ERP",
    description: "Importe produtos de seu sistema ERP (SAP, Omni, Totvs) ou arquivo CSV/JSON",
    selectSystem: "Selecione o Sistema ERP",
    fileFormat: "Formato do Arquivo",
    uploadFile: "Carregar Arquivo",
    downloadTemplate: "Baixar Template",
    importing: "Importando...",
    importSuccess: "Importação realizada com sucesso!",
    importError: "Erro na importação",
    productsImported: "produtos importados",
    errors: "Erros",
    warnings: "Avisos",
    cancel: "Cancelar",
    import: "Importar",
    selectFile: "Selecione um arquivo CSV ou JSON",
    dragDrop: "Arraste um arquivo aqui ou clique para selecionar",
  },
  en: {
    title: "Import ERP Data",
    description: "Import products from your ERP system (SAP, Omni, Totvs) or CSV/JSON file",
    selectSystem: "Select ERP System",
    fileFormat: "File Format",
    uploadFile: "Upload File",
    downloadTemplate: "Download Template",
    importing: "Importing...",
    importSuccess: "Import successful!",
    importError: "Import error",
    productsImported: "products imported",
    errors: "Errors",
    warnings: "Warnings",
    cancel: "Cancel",
    import: "Import",
    selectFile: "Select a CSV or JSON file",
    dragDrop: "Drag a file here or click to select",
  },
};

export default function ERPImportDialog({ open, onOpenChange, onImportSuccess }: ERPImportDialogProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [system, setSystem] = useState<ERPSystem>("generic");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.name.endsWith(".csv") || selectedFile.name.endsWith(".json")) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const importResult = await importProductsFromFile(file, system);
      setResult(importResult);

      if (importResult.success && importResult.data.length > 0) {
        onImportSuccess(importResult.data);
        setTimeout(() => {
          onOpenChange(false);
          setFile(null);
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = file?.name.endsWith(".json") ? getSampleJSONTemplate() : getSampleCSVTemplate();
    const filename = file?.name.endsWith(".json") ? "template.json" : "template.csv";
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(template)}`);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* System Selection */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">{t.selectSystem}</label>
            <Select value={system} onValueChange={(value) => setSystem(value as ERPSystem)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generic">Arquivo (CSV/JSON)</SelectItem>
                <SelectItem value="sap">SAP</SelectItem>
                <SelectItem value="omni">Omni</SelectItem>
                <SelectItem value="totvs">Totvs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <input
              type="file"
              accept=".csv,.json"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">{t.dragDrop}</p>
              {file && <p className="text-xs text-muted-foreground mt-2">{file.name}</p>}
            </label>
          </div>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-start gap-3">
                {result.success ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                <div className="flex-1">
                  <p className={`font-semibold ${result.success ? "text-green-900" : "text-red-900"}`}>
                    {result.success ? t.importSuccess : t.importError}
                  </p>
                  {result.success && (
                    <p className={`text-sm ${result.success ? "text-green-800" : "text-red-800"}`}>
                      {result.productsImported} {t.productsImported}
                    </p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-red-900">{t.errors}:</p>
                      <ul className="text-xs text-red-800 mt-1">
                        {result.errors.map((error: string, i: number) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.warnings && result.warnings.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-yellow-900">{t.warnings}:</p>
                      <ul className="text-xs text-yellow-800 mt-1">
                        {result.warnings.map((warning: string, i: number) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              {t.downloadTemplate}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleImport} disabled={!file || isLoading}>
              {isLoading ? t.importing : t.import}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
