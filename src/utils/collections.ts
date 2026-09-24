import type {
	Carrier,
	Product,
	ProductCategory,
	WarehouseLocation,
} from "../types/models";

/** Retorna los productos ubicados en el almacén especificado. */
export function filterProductsByWarehouse(
	products: Product[],
	warehouse: WarehouseLocation
): Product[] {
	return products.filter((product) => product.warehouse === warehouse);
}

/** Retorna los productos de la categoría especificada. */
export function filterProductsByCategory(
	products: Product[],
	category: ProductCategory
): Product[] {
	return products.filter((product) => product.category === category);
}

/** Retorna los productos cuyo stock está en el umbral mínimo o por debajo. */
export function filterLowStockProducts(products: Product[]): Product[] {
	return products.filter(
		(product) => product.stockQuantity <= product.minStockThreshold
	);
}

/** Retorna los productos ordenados por cantidad de stock sin mutar el array original. */
export function sortProductsByStock(
	products: Product[],
	order: "asc" | "desc"
): Product[] {
	return [...products].sort((firstProduct, secondProduct) => {
		const difference = firstProduct.stockQuantity - secondProduct.stockQuantity;
		return order === "asc" ? difference : -difference;
	});
}

/** Retorna los transportistas ordenados por tasa de entrega a tiempo. */
export function sortCarriersByReliability(
	carriers: Carrier[],
	order: "asc" | "desc"
): Carrier[] {
	return [...carriers].sort((firstCarrier, secondCarrier) => {
		const difference = firstCarrier.onTimeRate - secondCarrier.onTimeRate;
		return order === "asc" ? difference : -difference;
	});
}
