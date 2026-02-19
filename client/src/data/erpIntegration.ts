/**
 * ERP Integration Module
 * Handles data import from various ERP systems (SAP, Omni, Totvs)
 */

export type ERPSystem = "sap" | "omni" | "totvs" | "generic";

export interface ERPProduct {
  code: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  cost: number;
  width: number;
  depth: number;
  height: number;
  weight: number;
  velocity: "high" | "medium" | "low";
  margin: number;
  revenue: number;
  abcCurve: "A" | "B" | "C";
}

export interface ERPImportConfig {
  system: ERPSystem;
  apiUrl?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  fileFormat?: "csv" | "json" | "xml";
}

export interface ImportResult {
  success: boolean;
  productsImported: number;
  errors: string[];
  warnings: string[];
  data: ERPProduct[];
}

/**
 * Parse CSV data from ERP
 */
export function parseCSVData(csvContent: string): ERPProduct[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must contain at least header and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const products: ERPProduct[] = [];

  // Map common ERP column names
  const columnMap: Record<string, string> = {
    codigo: "code",
    code: "code",
    product_code: "code",
    nome: "name",
    name: "name",
    product_name: "name",
    categoria: "category",
    category: "category",
    subcategoria: "subcategory",
    subcategory: "subcategory",
    preco: "price",
    price: "price",
    custo: "cost",
    cost: "cost",
    largura: "width",
    width: "width",
    profundidade: "depth",
    depth: "depth",
    altura: "height",
    height: "height",
    peso: "weight",
    weight: "weight",
    giro: "velocity",
    velocity: "velocity",
    margem: "margin",
    margin: "margin",
    faturamento: "revenue",
    revenue: "revenue",
    curva_abc: "abcCurve",
    abc_curve: "abcCurve",
  };

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const product: Partial<ERPProduct> = {};

    headers.forEach((header, index) => {
      const mappedKey = columnMap[header] || header;
      const value = values[index];

      if (mappedKey === "code") product.code = value;
      else if (mappedKey === "name") product.name = value;
      else if (mappedKey === "category") product.category = value;
      else if (mappedKey === "subcategory") product.subcategory = value;
      else if (mappedKey === "price") product.price = parseFloat(value) || 0;
      else if (mappedKey === "cost") product.cost = parseFloat(value) || 0;
      else if (mappedKey === "width") product.width = parseFloat(value) || 0;
      else if (mappedKey === "depth") product.depth = parseFloat(value) || 0;
      else if (mappedKey === "height") product.height = parseFloat(value) || 0;
      else if (mappedKey === "weight") product.weight = parseFloat(value) || 0;
      else if (mappedKey === "velocity") {
        const vel = value.toLowerCase();
        product.velocity = vel === "high" || vel === "alto" ? "high" : vel === "low" || vel === "baixo" ? "low" : "medium";
      } else if (mappedKey === "margin") product.margin = parseFloat(value) || 0;
      else if (mappedKey === "revenue") product.revenue = parseFloat(value) || 0;
      else if (mappedKey === "abcCurve") {
        const curve = value.toUpperCase();
        product.abcCurve = (curve === "A" || curve === "B" || curve === "C" ? curve : "C") as "A" | "B" | "C";
      }
    });

    // Validate required fields
    if (product.code && product.name && product.category) {
      // Calculate margin if not provided
      if (!product.margin && product.price && product.cost) {
        product.margin = ((product.price - product.cost) / product.price) * 100;
      }

      // Set default dimensions if not provided
      if (!product.width) product.width = 10;
      if (!product.depth) product.depth = 10;
      if (!product.height) product.height = 10;

      // Set default velocity if not provided
      if (!product.velocity) product.velocity = "medium";

      // Set default ABC curve if not provided
      if (!product.abcCurve) product.abcCurve = "C";

      products.push(product as ERPProduct);
    }
  }

  return products;
}

/**
 * Parse JSON data from ERP
 */
export function parseJSONData(jsonContent: string): ERPProduct[] {
  try {
    const data = JSON.parse(jsonContent);
    const products = Array.isArray(data) ? data : data.products || data.items || [];

    return products.map((item: any) => ({
      code: item.code || item.codigo || "",
      name: item.name || item.nome || "",
      category: item.category || item.categoria || "",
      subcategory: item.subcategory || item.subcategoria || "",
      price: parseFloat(item.price || item.preco) || 0,
      cost: parseFloat(item.cost || item.custo) || 0,
      width: parseFloat(item.width || item.largura) || 10,
      depth: parseFloat(item.depth || item.profundidade) || 10,
      height: parseFloat(item.height || item.altura) || 10,
      weight: parseFloat(item.weight || item.peso) || 0,
      velocity: (item.velocity || item.giro || "medium").toLowerCase() as "high" | "medium" | "low",
      margin: parseFloat(item.margin || item.margem) || 0,
      revenue: parseFloat(item.revenue || item.faturamento) || 0,
      abcCurve: (item.abcCurve || item.curva_abc || "C").toUpperCase() as "A" | "B" | "C",
    }));
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error}`);
  }
}

/**
 * Import products from file
 */
export async function importProductsFromFile(file: File, system: ERPSystem = "generic"): Promise<ImportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let products: ERPProduct[] = [];

  try {
    const content = await file.text();

    if (file.name.endsWith(".csv")) {
      products = parseCSVData(content);
    } else if (file.name.endsWith(".json")) {
      products = parseJSONData(content);
    } else {
      throw new Error("Unsupported file format. Please use CSV or JSON.");
    }

    // Validate products
    products = products.filter((p) => {
      if (!p.code || !p.name) {
        warnings.push(`Produto inválido ignorado: código ou nome ausente`);
        return false;
      }
      return true;
    });

    return {
      success: true,
      productsImported: products.length,
      errors,
      warnings,
      data: products,
    };
  } catch (error) {
    return {
      success: false,
      productsImported: 0,
      errors: [error instanceof Error ? error.message : "Unknown error during import"],
      warnings,
      data: [],
    };
  }
}

/**
 * Validate ERP connection
 */
export async function validateERPConnection(config: ERPImportConfig): Promise<{ valid: boolean; message: string }> {
  try {
    if (config.system === "sap" && config.apiUrl && config.apiKey) {
      const response = await fetch(`${config.apiUrl}/health`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });
      return {
        valid: response.ok,
        message: response.ok ? "Conexão com SAP estabelecida com sucesso" : "Falha na conexão com SAP",
      };
    } else if (config.system === "omni" && config.apiUrl && config.apiKey) {
      const response = await fetch(`${config.apiUrl}/api/v1/health`, {
        headers: {
          "X-API-Key": config.apiKey,
        },
      });
      return {
        valid: response.ok,
        message: response.ok ? "Conexão com Omni estabelecida com sucesso" : "Falha na conexão com Omni",
      };
    } else if (config.system === "totvs" && config.apiUrl && config.username && config.password) {
      const response = await fetch(`${config.apiUrl}/api/v1/health`, {
        headers: {
          Authorization: `Basic ${btoa(`${config.username}:${config.password}`)}`,
        },
      });
      return {
        valid: response.ok,
        message: response.ok ? "Conexão com Totvs estabelecida com sucesso" : "Falha na conexão com Totvs",
      };
    }

    return {
      valid: false,
      message: "Configuração de ERP inválida",
    };
  } catch (error) {
    return {
      valid: false,
      message: `Erro ao validar conexão: ${error}`,
    };
  }
}

/**
 * Get sample CSV template
 */
export function getSampleCSVTemplate(): string {
  return `codigo,nome,categoria,subcategoria,preco,custo,largura,profundidade,altura,giro,margem,faturamento,curva_abc
SKU001,Arroz 5kg,Alimentos,Grãos,25.00,12.50,15,10,20,alto,50,5000,A
SKU002,Feijão 1kg,Alimentos,Grãos,8.50,4.00,10,8,15,médio,53,2000,B
SKU003,Açúcar 1kg,Alimentos,Açúcares,5.50,2.50,12,8,12,alto,55,3000,A
SKU004,Sal 1kg,Alimentos,Temperos,3.00,1.20,10,8,10,médio,60,1500,C
SKU005,Óleo 900ml,Alimentos,Óleos,8.00,3.50,8,6,25,alto,56,4000,A`;
}

/**
 * Get sample JSON template
 */
export function getSampleJSONTemplate(): string {
  return JSON.stringify(
    {
      products: [
        {
          code: "SKU001",
          name: "Arroz 5kg",
          category: "Alimentos",
          subcategory: "Grãos",
          price: 25.0,
          cost: 12.5,
          width: 15,
          depth: 10,
          height: 20,
          velocity: "high",
          margin: 50,
          revenue: 5000,
          abcCurve: "A",
        },
        {
          code: "SKU002",
          name: "Feijão 1kg",
          category: "Alimentos",
          subcategory: "Grãos",
          price: 8.5,
          cost: 4.0,
          width: 10,
          depth: 8,
          height: 15,
          velocity: "medium",
          margin: 53,
          revenue: 2000,
          abcCurve: "B",
        },
      ],
    },
    null,
    2
  );
}
