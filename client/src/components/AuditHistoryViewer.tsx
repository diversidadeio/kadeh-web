/**
 * Audit History Viewer Component
 * Displays change history and allows rollback to previous versions
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCcw, Trash2, Eye } from "lucide-react";
import { AuditLog, SimulationVersion } from "@/data/auditService";

interface AuditHistoryViewerProps {
  logs: AuditLog[];
  versions: SimulationVersion[];
  onRollback: (versionId: string) => void;
  onDelete: (logId: string) => void;
}

const TRANSLATIONS = {
  pt: {
    title: "Histórico de Mudanças",
    timestamp: "Data/Hora",
    action: "Ação",
    description: "Descrição",
    changes: "Mudanças",
    user: "Usuário",
    version: "Versão",
    noLogs: "Nenhum histórico disponível",
    rollback: "Reverter",
    delete: "Deletar",
    view: "Visualizar",
    create: "Criar",
    update: "Atualizar",
    delete_action: "Deletar",
    import: "Importar",
    export: "Exportar",
    compare: "Comparar",
    rollback_action: "Reverter",
    confirmRollback: "Tem certeza que deseja reverter para esta versão?",
    confirmDelete: "Tem certeza que deseja deletar este registro?",
    versionDetails: "Detalhes da Versão",
    before: "Antes",
    after: "Depois",
    noChanges: "Sem mudanças registradas",
  },
  en: {
    title: "Change History",
    timestamp: "Date/Time",
    action: "Action",
    description: "Description",
    changes: "Changes",
    user: "User",
    version: "Version",
    noLogs: "No history available",
    rollback: "Rollback",
    delete: "Delete",
    view: "View",
    create: "Create",
    update: "Update",
    delete_action: "Delete",
    import: "Import",
    export: "Export",
    compare: "Compare",
    rollback_action: "Rollback",
    confirmRollback: "Are you sure you want to rollback to this version?",
    confirmDelete: "Are you sure you want to delete this record?",
    versionDetails: "Version Details",
    before: "Before",
    after: "After",
    noChanges: "No changes recorded",
  },
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-50 text-green-900 border-green-200",
  update: "bg-blue-50 text-blue-900 border-blue-200",
  delete: "bg-red-50 text-red-900 border-red-200",
  import: "bg-purple-50 text-purple-900 border-purple-200",
  export: "bg-orange-50 text-orange-900 border-orange-200",
  compare: "bg-cyan-50 text-cyan-900 border-cyan-200",
  rollback: "bg-yellow-50 text-yellow-900 border-yellow-200",
};

export default function AuditHistoryViewer({ logs, versions, onRollback, onDelete }: AuditHistoryViewerProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getActionLabel = (action: string): string => {
    const actionMap: Record<string, string> = {
      create: t.create,
      update: t.update,
      delete: t.delete_action,
      import: t.import,
      export: t.export,
      compare: t.compare,
      rollback: t.rollback_action,
    };
    return actionMap[action] || action;
  };

  if (logs.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">{t.noLogs}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-3">
        <h3 className="text-lg font-semibold text-foreground mb-4">{t.title}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.timestamp}</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.action}</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.description}</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">{t.user}</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-3 text-foreground text-xs">{log.timestamp.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        ACTION_COLORS[log.action] || "bg-gray-50 text-gray-900 border-gray-200"
                      }`}
                    >
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-foreground text-sm">{log.description}</td>
                  <td className="py-3 px-3 text-foreground text-sm">{log.userId || "Sistema"}</td>
                  <td className="py-3 px-3 text-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetails(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {log.action === "update" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(t.confirmRollback)) {
                            onRollback(log.id);
                          }
                        }}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(t.confirmDelete)) {
                          onDelete(log.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.versionDetails}</DialogTitle>
            <DialogDescription>{selectedLog?.description}</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.timestamp}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.action}</p>
                  <p className="text-sm text-muted-foreground">{getActionLabel(selectedLog.action)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{t.user}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.userId || "Sistema"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{selectedLog.id}</p>
                </div>
              </div>

              {Object.keys(selectedLog.changes).length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{t.changes}</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(selectedLog.changes).map(([key, change]) => (
                      <div key={key} className="bg-muted p-3 rounded-lg text-xs">
                        <p className="font-semibold text-foreground mb-1">{key}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-muted-foreground mb-1">{t.before}</p>
                            <p className="font-mono text-foreground">{JSON.stringify(change.before)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">{t.after}</p>
                            <p className="font-mono text-foreground">{JSON.stringify(change.after)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.noChanges}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
