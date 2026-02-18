/**
 * Prompt Preview Modal Component
 * Allows users to preview and edit the AI generation prompt before executing
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Check } from "lucide-react";

interface PromptPreviewModalProps {
  isOpen: boolean;
  prompt: string;
  onClose: () => void;
  onConfirm: (editedPrompt: string) => void;
  isLoading?: boolean;
  language: "pt" | "en";
}

const TRANSLATIONS = {
  pt: {
    previewPrompt: "Visualizar Prompt",
    promptPreview: "Preview do Prompt de Geração",
    editPrompt: "Editar Prompt",
    promptDescription: "Você pode visualizar e editar o prompt que será enviado para a IA. Isso permite otimizar a geração de imagens.",
    currentPrompt: "Prompt Atual:",
    editedPrompt: "Prompt Editado:",
    characterCount: "Caracteres:",
    copy: "Copiar",
    copied: "Copiado!",
    cancel: "Cancelar",
    generate: "Gerar Imagem",
    tips: "Dicas para otimizar:",
    tip1: "Seja específico sobre a perspectiva (ex: 'front-facing', 'vista frontal')",
    tip2: "Descreva claramente o layout das prateleiras",
    tip3: "Inclua detalhes de iluminação e estilo fotográfico",
    tip4: "Evite instruções contraditórias",
  },
  en: {
    previewPrompt: "Preview Prompt",
    promptPreview: "Generation Prompt Preview",
    promptDescription: "You can preview and edit the prompt that will be sent to the AI. This allows you to optimize image generation.",
    currentPrompt: "Current Prompt:",
    editedPrompt: "Edited Prompt:",
    characterCount: "Characters:",
    copy: "Copy",
    copied: "Copied!",
    cancel: "Cancel",
    generate: "Generate Image",
    tips: "Tips to optimize:",
    tip1: "Be specific about perspective (e.g., 'front-facing', 'frontal view')",
    tip2: "Clearly describe the shelf layout",
    tip3: "Include lighting and photography style details",
    tip4: "Avoid contradictory instructions",
  },
};

export default function PromptPreviewModal({
  isOpen,
  prompt,
  onClose,
  onConfirm,
  isLoading = false,
  language,
}: PromptPreviewModalProps) {
  const t = TRANSLATIONS[language];
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    onConfirm(editedPrompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t.promptPreview}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{t.promptDescription}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tips Section */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-3 font-medium text-blue-900">{t.tips}</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• {t.tip1}</li>
            <li>• {t.tip2}</li>
            <li>• {t.tip3}</li>
            <li>• {t.tip4}</li>
          </ul>
        </div>

        {/* Current Prompt Display */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t.currentPrompt}
          </label>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {prompt}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t.characterCount} {prompt.length}
            </p>
          </div>
        </div>

        {/* Editable Prompt */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {t.editedPrompt}
          </label>
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="h-48 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t.editedPrompt}
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500">
            {t.characterCount} {editedPrompt.length}
          </p>
        </div>

        {/* Copy Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t.copy}
              </>
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading || !editedPrompt.trim()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t.previewPrompt}
              </>
            ) : (
              t.generate
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
