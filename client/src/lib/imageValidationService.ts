/**
 * Image Validation Service
 * Validates that generated AI images contain the expected products and layout
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
  timestamp: Date;
}

export interface ImageValidationConfig {
  expectedProductCount: number;
  expectedZones: string[];
  minConfidence: number;
  retryAttempts: number;
}

/**
 * Validates if generated image matches expected planogram layout
 * Uses visual analysis to verify product placement
 */
export async function validateGeneratedImage(
  imageUrl: string,
  config: ImageValidationConfig
): Promise<ValidationResult> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let confidence = 100;

  try {
    // Fetch image to verify it loaded correctly
    const response = await fetch(imageUrl);
    if (!response.ok) {
      issues.push("Failed to load image from URL");
      confidence -= 50;
    }

    // Check image dimensions (should be landscape for shelf)
    const img = new Image();
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        issues.push("Image failed to load or is corrupted");
        confidence -= 30;
        resolve(null);
      };
    });

    if (img.width && img.height) {
      const aspectRatio = img.width / img.height;
      // Shelves should be wider than tall (landscape)
      if (aspectRatio < 1.2) {
        issues.push(`Image aspect ratio (${aspectRatio.toFixed(2)}) may not represent shelf layout`);
        suggestions.push("Regenerate image with proper landscape orientation");
        confidence -= 20;
      }
    }

    // Analyze image content (basic checks)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx && img.width && img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Check for color diversity (indicates multiple products)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = new Set<string>();

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        // Group colors into buckets
        const colorBucket = `${Math.floor(r / 50)}-${Math.floor(g / 50)}-${Math.floor(b / 50)}`;
        colors.add(colorBucket);
      }

      // Should have reasonable color diversity for multiple products
      if (colors.size < 10) {
        issues.push("Low color diversity - may not show multiple products");
        suggestions.push("Ensure image shows products with distinct packaging colors");
        confidence -= 15;
      }

      // Check for horizontal lines (shelf structure)
      let horizontalLines = 0;
      for (let y = 0; y < canvas.height; y += Math.floor(canvas.height / 10)) {
        let lineContrast = 0;
        for (let x = 0; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          const nextIdx = (y * canvas.width + (x + 1)) * 4;
          const diff = Math.abs(imageData.data[idx] - imageData.data[nextIdx]);
          if (diff > 50) lineContrast++;
        }
        if (lineContrast > canvas.width * 0.3) {
          horizontalLines++;
        }
      }

      // Should detect multiple horizontal lines (shelves)
      if (horizontalLines < 2) {
        issues.push("Could not detect clear shelf structure");
        suggestions.push("Ensure image shows distinct shelf levels");
        confidence -= 10;
      }
    }

    // Validate configuration expectations
    if (config.expectedProductCount > 0) {
      // Note: Actual product counting would require OCR or more advanced vision
      // This is a placeholder for future enhancement
      suggestions.push(`Verify that image shows approximately ${config.expectedProductCount} products`);
    }

    // Check zones
    if (config.expectedZones.length > 0) {
      suggestions.push(`Verify products are distributed across zones: ${config.expectedZones.join(", ")}`);
    }

  } catch (error) {
    issues.push(`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`);
    confidence -= 30;
  }

  // Determine if image is valid
  const isValid = confidence >= config.minConfidence && issues.length === 0;

  return {
    isValid,
    confidence: Math.max(0, confidence),
    issues,
    suggestions,
    timestamp: new Date(),
  };
}

/**
 * Validates multiple aspects of the generated image
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    return `✅ Image validation passed (${result.confidence.toFixed(0)}% confidence)`;
  }

  let summary = `⚠️ Image validation issues (${result.confidence.toFixed(0)}% confidence):\n`;
  result.issues.forEach(issue => {
    summary += `  • ${issue}\n`;
  });

  if (result.suggestions.length > 0) {
    summary += `\nSuggestions:\n`;
    result.suggestions.forEach(suggestion => {
      summary += `  • ${suggestion}\n`;
    });
  }

  return summary;
}

/**
 * Determines if image should be regenerated based on validation
 */
export function shouldRegenerateImage(result: ValidationResult, maxRetries: number): boolean {
  return !result.isValid && result.confidence < 70;
}
