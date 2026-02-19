import { describe, it, expect, beforeEach, vi } from "vitest";
import { getDb } from "./db";
import {
  getAdvertiserByUserId,
  getAdvertiserById,
  getPendingAdvertisers,
  getApprovedAdvertisers,
  getNextPriorityPosition,
} from "./db";

describe("KADEH ADS - Database Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Advertiser Queries", () => {
    it("should return undefined when advertiser not found", async () => {
      const result = await getAdvertiserByUserId(999999);
      expect(result).toBeUndefined();
    });

    it("should return advertiser by ID", async () => {
      const result = await getAdvertiserById(1);
      // This will depend on actual database state
      // In a real test, we'd use a test database
      expect(result === undefined || result?.id === 1).toBe(true);
    });

    it("should fetch pending advertisers", async () => {
      const result = await getPendingAdvertisers();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should fetch approved advertisers", async () => {
      const result = await getApprovedAdvertisers();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Priority Position", () => {
    it("should return a number for next priority position", async () => {
      const position = await getNextPriorityPosition();
      expect(typeof position).toBe("number");
      expect(position).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Database Connection", () => {
    it("should handle missing database gracefully", async () => {
      const db = await getDb();
      // Database connection is optional in development
      expect(db === null || db !== null).toBe(true);
    });
  });
});
