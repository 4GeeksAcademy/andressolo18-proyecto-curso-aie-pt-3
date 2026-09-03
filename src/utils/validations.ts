/**
 * Validaciones de negocio para entidades del dominio TrackFlow.
 */

import type { Order, OrderItem, ReturnRequest } from "../types/models";

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

export function validateOrderItems(items: OrderItem[]): ValidationResult {
  const errors: string[] = [];

  if (items.length === 0) {
    errors.push("El pedido debe tener al menos un artículo");
  }

  for (const item of items) {
    if (!item.sku) {
      errors.push("Cada artículo debe tener un SKU");
    }
    if (item.quantity <= 0) {
      errors.push(`La cantidad para el SKU "${item.sku}" debe ser mayor que 0`);
    }
  }

  return result(errors);
}

export function validateOrder(order: Order): ValidationResult {
  const errors: string[] = [];

  if (!order.customerId) errors.push("El pedido debe tener un cliente asociado");
  if (!order.warehouseId) errors.push("El pedido debe tener un almacén asociado");

  const itemsResult = validateOrderItems(order.items);
  errors.push(...itemsResult.errors);

  return result(errors);
}

/** Una devolución solo es elegible dentro de la ventana permitida (en días) desde la entrega. */
export function isReturnEligible(
  order: Order,
  returnRequest: ReturnRequest,
  windowDays: number
): boolean {
  if (order.status !== "delivered" || !order.deliveredAt) return false;

  const deliveredAt = new Date(order.deliveredAt).getTime();
  const requestedAt = new Date(returnRequest.requestedAt).getTime();
  const diffDays = (requestedAt - deliveredAt) / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= windowDays;
}
