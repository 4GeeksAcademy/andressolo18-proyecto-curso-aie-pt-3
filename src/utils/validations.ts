/**
 * Validaciones de negocio para entidades del dominio TrackFlow.
 */

import type { Product, Shipment } from "../types/models";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function result(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];

  if (!product.sku.trim()) errors.push("El SKU no puede estar vacío");

  if (!Number.isFinite(product.weightKg) || product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("El peso debe ser mayor que 0 y menor o igual a 100 kg");
  }

  const dimensions = [
    ["largo", product.dimensions.lengthCm],
    ["ancho", product.dimensions.widthCm],
    ["alto", product.dimensions.heightCm],
  ] as const;

  for (const [name, value] of dimensions) {
    if (!Number.isFinite(value) || value <= 0 || value > 200) {
      errors.push(`La dimensión ${name} debe ser mayor que 0 y menor o igual a 200 cm`);
    }
  }

  if (!Number.isFinite(product.stockQuantity) || product.stockQuantity < 0) {
    errors.push("La cantidad de stock debe ser mayor o igual a 0");
  }

  if (!Number.isFinite(product.minStockThreshold) || product.minStockThreshold < 0) {
    errors.push("El umbral mínimo de stock debe ser mayor o igual a 0");
  }

  if (!Number.isFinite(product.unitCostUSD) || product.unitCostUSD <= 0) {
    errors.push("El costo unitario debe ser mayor que 0");
  }

  return result(errors);
}

export function validateShipment(shipment: Shipment): ValidationResult {
  const errors: string[] = [];

  if (!Number.isFinite(shipment.quantity) || shipment.quantity <= 0) {
    errors.push("La cantidad del envío debe ser mayor que 0");
  }

  if (!Number.isFinite(shipment.declaredValueUSD) || shipment.declaredValueUSD <= 0) {
    errors.push("El valor declarado debe ser mayor que 0");
  }

  if (!Number.isFinite(shipment.destination.distanceKm) || shipment.destination.distanceKm < 0) {
    errors.push("La distancia debe ser mayor o igual a 0 km");
  }

  return result(errors);
}
