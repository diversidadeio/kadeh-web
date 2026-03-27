/**
 * ImageRegenerationFeedback Component
 * Allows users to reject AI-generated images and regenerate with feedback
 * Automatically adjusts the prompt based on user feedback
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageRegenerationFeedbackProps {
  isGenerating: boolean;
  onRegenerate: (feedback: string) => void;
  onDiscard: () => void;
  categoryName: string;
}

const TRANSLATIONS = {
  pt: {
    regenerate_image: "Regenerar Imagem",
    discard_image: "Descartar Imagem",
    feedback_placeholder:
      "Descreva o que está errado (ex: 'Mostrou produtos de outras categorias', 'Prateleiras vazias', 'Ordem incorreta')",
    feedback_label: "Feedback para Regeneração",
    regenerating: "Regenerando...",
    submit_feedback: "Regenerar com Feedback",
    cancel: "Cancelar",
    feedback_hints: "Dicas de Feedback",
    hint_category: "Mencione se há produtos de outras categorias",
    hint_products: "Indique quais produtos estão faltando ou extras",
    hint_layout: "Descreva problemas com o layout das prateleiras",
    hint_quality: "Comente sobre a qualidade ou realismo da imagem",
  },
  en: {
    regenerate_image: "Regenerate Image",
    discard_image: "Discard Image",
    feedback_placeholder:
      "Describe what is wrong (e.g., 'Showed products from other categories', 'Empty shelves', 'Incorrect order')",
    feedback_label: "Regeneration Feedback",
    regenerating: "Regenerating...",
    submit_feedback: "Regenerate with Feedback",
    cancel: "Cancel",
    feedback_hints: "Feedback Tips",
    hint_category: "Mention if there are products from other categories",
    hint_products: "Indicate which products are missing or extra",
    hint_layout: "Describe issues with shelf layout",
    hint_quality: "Comment on image quality or realism",
  },
};

export default function ImageRegenerationFeedback({
  isGenerating,
  onRegenerate,
  onDiscard,
  categoryName,
}: ImageRegenerationFeedbackProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegenerate = async () => {
    if (!feedback.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      onRegenerate(feedback);
      setFeedback("");
      setShowFeedback(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowFeedback(false);
    setFeedback("");
  };

  return (
    <div className="w-full space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setShowFeedback(!showFeedback)}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isGenerating || isSubmitting}
        >
          <RotateCcw className="w-4 h-4" />
          {t.regenerate_image}
        </Button>

        <Button
          onClick={onDiscard}
          variant="destructive"
          className="flex items-center gap-2"
          disabled={isGenerating || isSubmitting}
        >
          <Trash2 className="w-4 h-4" />
          {t.discard_image}
        </Button>
      </div>

      {/* Feedback Form */}
      {showFeedback && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.feedback_label}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t.feedback_placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Feedback Hints */}
          <div className="bg-white border border-blue-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              💡 {t.feedback_hints}
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• {t.hint_category}</li>
              <li>• {t.hint_products}</li>
              <li>• {t.hint_layout}</li>
              <li>• {t.hint_quality}</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleRegenerate}
              disabled={!feedback.trim() || isSubmitting || isGenerating}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting || isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.regenerating}
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  {t.submit_feedback}
                </>
              )}
            </Button>

            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting || isGenerating}
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
