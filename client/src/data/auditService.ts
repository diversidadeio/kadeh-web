/**
 * Audit Service
 * Tracks changes and maintains audit history for Smart Layout simulations
 */

export type AuditAction = "create" | "update" | "delete" | "import" | "export" | "compare" | "rollback";

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: AuditAction;
  userId?: string;
  simulationId: string;
  simulationName: string;
  changes: Record<string, { before: any; after: any }>;
  description: string;
  metadata?: Record<string, any>;
}

export interface SimulationVersion {
  id: string;
  simulationId: string;
  version: number;
  timestamp: Date;
  data: any;
  description: string;
  createdBy?: string;
}

/**
 * Audit Service Class
 */
export class AuditService {
  private logs: AuditLog[] = [];
  private versions: Map<string, SimulationVersion[]> = new Map();
  private versionCounter: Map<string, number> = new Map();

  /**
   * Log an action
   */
  logAction(
    action: AuditAction,
    simulationId: string,
    simulationName: string,
    changes: Record<string, { before: any; after: any }>,
    description: string,
    userId?: string,
    metadata?: Record<string, any>
  ): AuditLog {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      userId,
      simulationId,
      simulationName,
      changes,
      description,
      metadata,
    };

    this.logs.push(log);
    return log;
  }

  /**
   * Create a version snapshot
   */
  createVersion(simulationId: string, data: any, description: string, createdBy?: string): SimulationVersion {
    const currentVersion = this.versionCounter.get(simulationId) || 0;
    const version: SimulationVersion = {
      id: `version-${simulationId}-${currentVersion + 1}`,
      simulationId,
      version: currentVersion + 1,
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      description,
      createdBy,
    };

    if (!this.versions.has(simulationId)) {
      this.versions.set(simulationId, []);
    }

    this.versions.get(simulationId)!.push(version);
    this.versionCounter.set(simulationId, currentVersion + 1);

    return version;
  }

  /**
   * Get all versions for a simulation
   */
  getVersions(simulationId: string): SimulationVersion[] {
    return this.versions.get(simulationId) || [];
  }

  /**
   * Get a specific version
   */
  getVersion(simulationId: string, versionNumber: number): SimulationVersion | undefined {
    const versions = this.versions.get(simulationId) || [];
    return versions.find((v) => v.version === versionNumber);
  }

  /**
   * Rollback to a specific version
   */
  rollback(simulationId: string, versionNumber: number, userId?: string): SimulationVersion | null {
    const version = this.getVersion(simulationId, versionNumber);
    if (!version) return null;

    // Log the rollback action
    this.logAction(
      "rollback",
      simulationId,
      "Unknown",
      { version: { before: this.versionCounter.get(simulationId), after: versionNumber } },
      `Rolled back to version ${versionNumber}`,
      userId
    );

    return version;
  }

  /**
   * Get audit logs for a simulation
   */
  getAuditLogs(simulationId: string, limit?: number): AuditLog[] {
    let logs = this.logs.filter((log) => log.simulationId === simulationId);
    if (limit) {
      logs = logs.slice(-limit);
    }
    return logs.reverse(); // Most recent first
  }

  /**
   * Get all audit logs
   */
  getAllAuditLogs(limit?: number): AuditLog[] {
    let logs = [...this.logs];
    if (limit) {
      logs = logs.slice(-limit);
    }
    return logs.reverse(); // Most recent first
  }

  /**
   * Compare two versions
   */
  compareVersions(
    simulationId: string,
    version1: number,
    version2: number
  ): { differences: Record<string, { version1: any; version2: any }>; similarity: number } | null {
    const v1 = this.getVersion(simulationId, version1);
    const v2 = this.getVersion(simulationId, version2);

    if (!v1 || !v2) return null;

    const differences: Record<string, { version1: any; version2: any }> = {};
    let similarFields = 0;
    let totalFields = 0;

    // Compare all keys
    const allKeys = new Set([...Object.keys(v1.data), ...Object.keys(v2.data)]);

    allKeys.forEach((key) => {
      totalFields++;
      const val1 = v1.data[key];
      const val2 = v2.data[key];

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences[key] = { version1: val1, version2: val2 };
      } else {
        similarFields++;
      }
    });

    const similarity = totalFields > 0 ? (similarFields / totalFields) * 100 : 100;

    return { differences, similarity };
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(format: "json" | "csv" = "json"): string {
    if (format === "json") {
      return JSON.stringify(this.logs, null, 2);
    } else {
      // CSV format
      const headers = ["ID", "Timestamp", "Action", "Simulation ID", "Simulation Name", "Description", "User ID"];
      const rows = this.logs.map((log) => [
        log.id,
        log.timestamp.toISOString(),
        log.action,
        log.simulationId,
        log.simulationName,
        log.description,
        log.userId || "N/A",
      ]);

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

      return csv;
    }
  }

  /**
   * Clear old logs (retention policy)
   */
  clearOldLogs(daysToKeep: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialLength = this.logs.length;
    this.logs = this.logs.filter((log) => log.timestamp > cutoffDate);

    return initialLength - this.logs.length;
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalLogs: number;
    totalSimulations: number;
    totalVersions: number;
    actionCounts: Record<AuditAction, number>;
    lastActivity: Date | null;
  } {
    const actionCounts: Record<AuditAction, number> = {
      create: 0,
      update: 0,
      delete: 0,
      import: 0,
      export: 0,
      compare: 0,
      rollback: 0,
    };

    this.logs.forEach((log) => {
      actionCounts[log.action]++;
    });

    const totalVersions = Array.from(this.versions.values()).reduce((sum, versions) => sum + versions.length, 0);

    return {
      totalLogs: this.logs.length,
      totalSimulations: this.versions.size,
      totalVersions,
      actionCounts,
      lastActivity: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null,
    };
  }
}

// Singleton instance
let auditService: AuditService | null = null;

export function getAuditService(): AuditService {
  if (!auditService) {
    auditService = new AuditService();
  }
  return auditService;
}
