import { Carrier, Product, ProductCategory, Shipment, ShipmentStatus } from "../types/models";
export declare function calculateShippingCost(shipment: Shipment, product: Product, carrier: Carrier): number;
export declare function scoreCarrierForShipment(carrier: Carrier, shipment: Shipment, product: Product): number;
export declare function selectBestCarrier(carriers: Carrier[], shipment: Shipment, product: Product): {
    carrier: Carrier;
    score: number;
    cost: number;
} | null;
export declare function countProductsByCategory(products: Product[]): Record<ProductCategory, number>;
export declare function calculateTotalInventoryValue(products: Product[]): number;
export declare function calculateAverageShipmentDistance(shipments: Shipment[]): number;
export declare function groupShipmentsByStatus(shipments: Shipment[]): Record<ShipmentStatus, Shipment[]>;
export declare function findTopCarriers(shipments: Shipment[], // Recibe la lista de envíos a analizar.
topN: number): Array<{
    carrier: string;
    count: number;
}>;
