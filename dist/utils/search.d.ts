import type { Product, Shipment } from "../types/models";
/** Busca linealmente un producto por SKU sin distinguir mayúsculas y minúsculas. */
export declare function findProductBySKU(products: Product[], sku: string): Product | null;
/** Busca linealmente un envío por su identificador. */
export declare function findShipmentById(shipments: Shipment[], id: string): Shipment | null;
/** Busca por dicotomía el índice de un producto con el peso indicado. */
export declare function binarySearchProductByWeight(sortedProducts: Product[], targetWeight: number): number;
