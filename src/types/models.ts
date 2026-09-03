/**
 * Tipos e interfaces del dominio TrackFlow (logística y gestión de almacenes).
 */

export type Id = string;

export type Country = "US" | "ES";

export type OrderStatus =
  | "pending"
  | "picking"
  | "packed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";

export interface Warehouse {
  id: Id;
  name: string;
  country: Country;
  city: string;
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  weightKg: number;
}

export interface Carrier {
  id: Id;
  name: string;
  country: Country;
  costPerKg: number;
}

export interface Customer {
  id: Id;
  name: string;
  country: Country;
  email: string;
}

export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface Order {
  id: Id;
  customerId: Id;
  warehouseId: Id;
  carrierId?: Id;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
}

export interface ReturnRequest {
  id: Id;
  orderId: Id;
  reason: string;
  status: ReturnStatus;
  requestedAt: string;
}
