/**
 * Agregaciones y transformaciones para generar reportes a partir de pedidos.
 */

import type { Order, OrderStatus } from "../types/models";
import { groupBy } from "./collections";

export function countByStatus(orders: Order[]): Record<OrderStatus, number> {
  const groups = groupBy(orders, (o) => o.status);
  return Object.fromEntries(
    Object.entries(groups).map(([status, items]) => [status, (items as Order[]).length])
  ) as Record<OrderStatus, number>;
}

export function totalItemsShipped(orders: Order[]): number {
  return orders
    .filter((o) => o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
}

export function ordersByWarehouse(orders: Order[]): Record<string, number> {
  const groups = groupBy(orders, (o) => o.warehouseId);
  return Object.fromEntries(
    Object.entries(groups).map(([warehouseId, items]) => [warehouseId, (items as Order[]).length])
  );
}

/** Calcula la tasa de entrega a tiempo dado un límite (en ms) desde createdAt hasta deliveredAt. */
export function onTimeDeliveryRate(orders: Order[], limitMs: number): number {
  const delivered = orders.filter((o) => o.status === "delivered" && o.deliveredAt);
  if (delivered.length === 0) return 0;

  const onTime = delivered.filter((o) => {
    const created = new Date(o.createdAt).getTime();
    const deliveredAt = new Date(o.deliveredAt as string).getTime();
    return deliveredAt - created <= limitMs;
  });

  return onTime.length / delivered.length;
}

export interface WarehouseReport {
  warehouseId: string;
  totalOrders: number;
  totalItems: number;
}

export function buildWarehouseReport(orders: Order[]): WarehouseReport[] {
  const groups = groupBy(orders, (o) => o.warehouseId);
  return Object.entries(groups).map(([warehouseId, warehouseOrders]) => ({
    warehouseId,
    totalOrders: (warehouseOrders as Order[]).length,
    totalItems: (warehouseOrders as Order[]).reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    ),
  }));
}
