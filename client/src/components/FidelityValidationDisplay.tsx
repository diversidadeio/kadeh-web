import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ValidationResult, generateValidationReport } from '@/utils/fidelityValidator';

interface FidelityValidationDisplayProps {
  result: ValidationResult;
  onClose?: () => void;
}

export default function FidelityValidationDisplay({
  result,
  onClose,
}: FidelityValidationDisplayProps) {
  const scoreColor =
    result.score >= 90
      ? 'text-green-600'
      : result.score >= 70
        ? 'text-yellow-600'
        : 'text-red-600';

  const scoreBgColor =
    result.score >= 90
      ? 'bg-green-50'
      : result.score >= 70
        ? 'bg-yellow-50'
        : 'bg-red-50';

  const report = generateValidationReport(result);

  return (
    <div className={`rounded-lg border p-6 ${scoreBgColor}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {result.isValid ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold">Fidelity Validation</h3>
            <p className="text-sm text-gray-600">
              {result.isValid
                ? 'AI image matches gondola visualization perfectly'
                : 'Discrepancies found between visualization and AI image'}
            </p>
          </div>
        </div>
        <div className={`text-right ${scoreColor}`}>
          <div className="text-3xl font-bold">{result.score}</div>
          <div className="text-sm">/ 100</div>
        </div>
      </div>

      {/* Discrepancies */}
      {result.discrepancies.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Discrepancies ({result.discrepancies.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {result.discrepancies.map((disc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded text-sm ${
                  disc.severity === 'critical'
                    ? 'bg-red-100 text-red-900 border border-red-300'
                    : disc.severity === 'high'
                      ? 'bg-orange-100 text-orange-900 border border-orange-300'
                      : disc.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}
              >
                <div className="font-semibold capitalize">{disc.severity} - {disc.type.replace(/_/g, ' ')}</div>
                <div>{disc.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warnings ({result.warnings.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {result.warnings.map((warn, idx) => (
              <div
                key={idx}
                className="p-3 rounded text-sm bg-yellow-100 text-yellow-900 border border-yellow-300"
              >
                <div className="font-semibold capitalize">{warn.type.replace(/_/g, ' ')}</div>
                <div>{warn.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white bg-opacity-50 rounded p-4 mb-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Critical Issues</div>
            <div className="text-lg font-bold text-red-600">
              {result.discrepancies.filter(d => d.severity === 'critical').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">High Priority</div>
            <div className="text-lg font-bold text-orange-600">
              {result.discrepancies.filter(d => d.severity === 'high').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Medium Priority</div>
            <div className="text-lg font-bold text-yellow-600">
              {result.discrepancies.filter(d => d.severity === 'medium').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Warnings</div>
            <div className="text-lg font-bold text-blue-600">
              {result.warnings.length}
            </div>
          </div>
        </div>
      </div>

      {/* Report */}
      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
          View Full Report
        </summary>
        <pre className="mt-3 p-3 bg-white bg-opacity-70 rounded text-xs overflow-x-auto whitespace-pre-wrap break-words">
          {report}
        </pre>
      </details>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Close
        </button>
      )}
    </div>
  );
}
