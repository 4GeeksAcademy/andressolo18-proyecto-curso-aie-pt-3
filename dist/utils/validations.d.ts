/**
 * Validaciones de negocio para entidades del dominio TrackFlow.
 */
import type { Carrier, Product, Shipment } from "../types/models";
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function isValidEmail(email: string): boolean;
export declare function validateProduct(product: Product): ValidationResult;
export declare function validateShipment(shipment: Shipment): ValidationResult;
export declare function validateCarrier(carrier: Carrier): ValidationResult;
