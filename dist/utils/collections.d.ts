import type { Carrier, Product, ProductCategory, WarehouseLocation } from "../types/models";
/** Retorna los productos ubicados en el almacén especificado. */
export declare function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[];
/** Retorna los productos de la categoría especificada. */
export declare function filterProductsByCategory(products: Product[], category: ProductCategory): Product[];
/** Retorna los productos cuyo stock está en el umbral mínimo o por debajo. */
export declare function filterLowStockProducts(products: Product[]): Product[];
/** Retorna los productos ordenados por cantidad de stock sin mutar el array original. */
export declare function sortProductsByStock(products: Product[], order: "asc" | "desc"): Product[];
/** Retorna los transportistas ordenados por tasa de entrega a tiempo. */
export declare function sortCarriersByReliability(carriers: Carrier[], order: "asc" | "desc"): Carrier[];
