/**
 * ERP API Service
 * Handles real-time synchronization with ERP systems (SAP, Omni, Totvs)
 */

import { ERPProduct } from "./erpIntegration";

export type ERPSystem = "sap" | "omni" | "totvs";

export interface ERPConnection {
  id: string;
  system: ERPSystem;
  name: string;
  apiUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  lastSync?: Date;
  isConnected: boolean;
}

export interface SyncResult {
  success: boolean;
  productsSync: number;
  errors: string[];
  warnings: string[];
  lastSync: Date;
}

/**
 * SAP API Integration
 */
export class SAPIntegration {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getProducts(): Promise<ERPProduct[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`SAP API error: ${response.statusText}`);

      const data = await response.json();
      return this.mapSAPProducts(data.products || []);
    } catch (error) {
      throw new Error(`SAP integration error: ${error}`);
    }
  }

  async syncProduct(product: ERPProduct): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products/${product.code}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.mapToSAPFormat(product)),
      });

      return response.ok;
    } catch (error) {
      console.error("SAP sync error:", error);
      return false;
    }
  }

  private mapSAPProducts(sapProducts: any[]): ERPProduct[] {
    return sapProducts.map((p) => ({
      code: p.MATNR || "",
      name: p.MAKTX || "",
      category: p.MATKL || "",
      subcategory: p.SPART || "",
      price: parseFloat(p.VRKME) || 0,
      cost: parseFloat(p.KOSTE) || 0,
      width: parseFloat(p.BREITE) || 10,
      depth: parseFloat(p.TIEFE) || 10,
      height: parseFloat(p.HOEHE) || 10,
      weight: parseFloat(p.GEWICHT) || 0,
      velocity: this.mapVelocity(p.UMATZ),
      margin: parseFloat(p.MARGEN) || 0,
      revenue: parseFloat(p.UMSATZ) || 0,
      abcCurve: this.mapABCCurve(p.ABC),
    }));
  }

  private mapToSAPFormat(product: ERPProduct): any {
    return {
      MATNR: product.code,
      MAKTX: product.name,
      MATKL: product.category,
      SPART: product.subcategory,
      VRKME: product.price,
      KOSTE: product.cost,
      BREITE: product.width,
      TIEFE: product.depth,
      HOEHE: product.height,
      GEWICHT: product.weight,
      MARGEN: product.margin,
      UMSATZ: product.revenue,
      ABC: product.abcCurve,
    };
  }

  private mapVelocity(value: string): "high" | "medium" | "low" {
    const v = value?.toLowerCase() || "";
    return v.includes("alto") || v.includes("high") ? "high" : v.includes("bajo") || v.includes("low") ? "low" : "medium";
  }

  private mapABCCurve(value: string): "A" | "B" | "C" {
    const curve = value?.toUpperCase() || "C";
    return (curve === "A" || curve === "B" ? curve : "C") as "A" | "B" | "C";
  }
}

/**
 * Omni API Integration
 */
export class OmniIntegration {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getProducts(): Promise<ERPProduct[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products`, {
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Omni API error: ${response.statusText}`);

      const data = await response.json();
      return this.mapOmniProducts(data.data || []);
    } catch (error) {
      throw new Error(`Omni integration error: ${error}`);
    }
  }

  async syncProduct(product: ERPProduct): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products/${product.code}`, {
        method: "PATCH",
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.mapToOmniFormat(product)),
      });

      return response.ok;
    } catch (error) {
      console.error("Omni sync error:", error);
      return false;
    }
  }

  private mapOmniProducts(omniProducts: any[]): ERPProduct[] {
    return omniProducts.map((p) => ({
      code: p.sku || "",
      name: p.name || "",
      category: p.category || "",
      subcategory: p.subcategory || "",
      price: parseFloat(p.price) || 0,
      cost: parseFloat(p.cost) || 0,
      width: parseFloat(p.dimensions?.width) || 10,
      depth: parseFloat(p.dimensions?.depth) || 10,
      height: parseFloat(p.dimensions?.height) || 10,
      weight: parseFloat(p.weight) || 0,
      velocity: p.velocity || "medium",
      margin: parseFloat(p.margin) || 0,
      revenue: parseFloat(p.revenue) || 0,
      abcCurve: p.abcCurve || "C",
    }));
  }

  private mapToOmniFormat(product: ERPProduct): any {
    return {
      sku: product.code,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      cost: product.cost,
      dimensions: {
        width: product.width,
        depth: product.depth,
        height: product.height,
      },
      weight: product.weight,
      velocity: product.velocity,
      margin: product.margin,
      revenue: product.revenue,
      abcCurve: product.abcCurve,
    };
  }
}

/**
 * Totvs API Integration
 */
export class TotvIntegration {
  private apiUrl: string;
  private username: string;
  private password: string;
  private token?: string;

  constructor(apiUrl: string, username: string, password: string) {
    this.apiUrl = apiUrl;
    this.username = username;
    this.password = password;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.token = data.token;
      return true;
    } catch (error) {
      console.error("Totvs authentication error:", error);
      return false;
    }
  }

  async getProducts(): Promise<ERPProduct[]> {
    if (!this.token) {
      const authenticated = await this.authenticate();
      if (!authenticated) throw new Error("Failed to authenticate with Totvs");
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Totvs API error: ${response.statusText}`);

      const data = await response.json();
      return this.mapTotvProducts(data.items || []);
    } catch (error) {
      throw new Error(`Totvs integration error: ${error}`);
    }
  }

  async syncProduct(product: ERPProduct): Promise<boolean> {
    if (!this.token) {
      const authenticated = await this.authenticate();
      if (!authenticated) return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/products/${product.code}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.mapToTotvFormat(product)),
      });

      return response.ok;
    } catch (error) {
      console.error("Totvs sync error:", error);
      return false;
    }
  }

  private mapTotvProducts(totvProducts: any[]): ERPProduct[] {
    return totvProducts.map((p) => ({
      code: p.codigo || "",
      name: p.descricao || "",
      category: p.categoria || "",
      subcategory: p.subcategoria || "",
      price: parseFloat(p.preco) || 0,
      cost: parseFloat(p.custo) || 0,
      width: parseFloat(p.largura) || 10,
      depth: parseFloat(p.profundidade) || 10,
      height: parseFloat(p.altura) || 10,
      weight: parseFloat(p.peso) || 0,
      velocity: p.giro || "medium",
      margin: parseFloat(p.margem) || 0,
      revenue: parseFloat(p.faturamento) || 0,
      abcCurve: p.curvaAbc || "C",
    }));
  }

  private mapToTotvFormat(product: ERPProduct): any {
    return {
      codigo: product.code,
      descricao: product.name,
      categoria: product.category,
      subcategoria: product.subcategory,
      preco: product.price,
      custo: product.cost,
      largura: product.width,
      profundidade: product.depth,
      altura: product.height,
      peso: product.weight,
      giro: product.velocity,
      margem: product.margin,
      faturamento: product.revenue,
      curvaAbc: product.abcCurve,
    };
  }
}

/**
 * Factory for creating ERP integrations
 */
export function createERPIntegration(connection: ERPConnection): SAPIntegration | OmniIntegration | TotvIntegration {
  switch (connection.system) {
    case "sap":
      return new SAPIntegration(connection.apiUrl, connection.apiKey || "");
    case "omni":
      return new OmniIntegration(connection.apiUrl, connection.apiKey || "");
    case "totvs":
      return new TotvIntegration(connection.apiUrl, connection.username || "", connection.password || "");
    default:
      throw new Error(`Unsupported ERP system: ${connection.system}`);
  }
}

/**
 * Sync products from ERP
 */
export async function syncFromERP(connection: ERPConnection): Promise<SyncResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let productsSync = 0;

  try {
    const integration = createERPIntegration(connection);

    // For Totvs, authenticate first
    if (connection.system === "totvs" && integration instanceof TotvIntegration) {
      const authenticated = await integration.authenticate();
      if (!authenticated) {
        throw new Error("Failed to authenticate with Totvs");
      }
    }

    const products = await integration.getProducts();
    productsSync = products.length;

    return {
      success: true,
      productsSync,
      errors,
      warnings,
      lastSync: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      productsSync,
      errors: [error instanceof Error ? error.message : "Unknown error during sync"],
      warnings,
      lastSync: new Date(),
    };
  }
}
