import {
	findProductBySKU,
	findShipmentById,
	binarySearchProductByWeight,
} from "./utils/search.js";
import {
	filterLowStockProducts,
	filterProductsByCategory,
	filterProductsByWarehouse,
	sortCarriersByReliability,
	sortProductsByStock,
} from "./utils/collections.js";
import {
	calculateAverageShipmentDistance,
	calculateShippingCost,
	calculateTotalInventoryValue,
	countProductsByCategory,
	findTopCarriers,
	groupShipmentsByStatus,
	scoreCarrierForShipment,
	selectBestCarrier,
} from "./utils/transformations.js";
import {
	validateCarrier,
	validateProduct,
	validateShipment,
} from "./utils/validations.js";
import {
	sampleCarriers,
	sampleProducts,
	sampleShipment,
} from "./data/mockData.js";

const sampleShipments = [
	sampleShipment,
	{ ...sampleShipment, id: "SH-2024-8822", carrier: "SEUR", status: "Assigned" as const },
	{ ...sampleShipment, id: "SH-2024-8823", carrier: "DHL Express", status: "In transit" as const },
	{ ...sampleShipment, id: "SH-2024-8824", carrier: "SEUR", status: "Delivered" as const },
];
const sortedProductsByWeight = [...sampleProducts].sort(
	(firstProduct, secondProduct) => firstProduct.weightKg - secondProduct.weightKg,
);
const shippedProduct = sampleProducts[1];

console.log("Producto por SKU:", findProductBySKU(sampleProducts, "LAPTOP-DELL-15"));
console.log("Envío por ID:", findShipmentById(sampleShipments, "SH-2024-8822"));
console.log(
	"Índice del producto de 0.8 kg:",
	binarySearchProductByWeight(sortedProductsByWeight, 0.8),
);
console.log(
	"Productos en Los Angeles:",
	filterProductsByWarehouse(sampleProducts, "Los Angeles"),
);
console.log(
	"Productos de electrónica:",
	filterProductsByCategory(sampleProducts, "Electronics"),
);
console.log("Productos con bajo stock:", filterLowStockProducts(sampleProducts));
console.log("Productos ordenados por stock:", sortProductsByStock(sampleProducts, "asc"));
console.log(
	"Transportistas por confiabilidad:",
	sortCarriersByReliability(sampleCarriers, "desc"),
);
console.log(
	"Costo de envío con SEUR:",
	calculateShippingCost(sampleShipment, shippedProduct, sampleCarriers[1]),
);
console.log(
	"Puntaje de SEUR:",
	scoreCarrierForShipment(sampleCarriers[1], sampleShipment, shippedProduct),
);
console.log(
	"Mejor transportista:",
	selectBestCarrier(sampleCarriers, sampleShipment, shippedProduct),
);
console.log("Productos por categoría:", countProductsByCategory(sampleProducts));
console.log("Valor total del inventario:", calculateTotalInventoryValue(sampleProducts));
console.log(
	"Distancia promedio de envíos:",
	calculateAverageShipmentDistance(sampleShipments),
);
console.log("Envíos por estado:", groupShipmentsByStatus(sampleShipments));
console.log("Transportistas más usados:", findTopCarriers(sampleShipments, 2));
console.log("Validación del producto:", validateProduct(sampleProducts[0]));
console.log("Validación del envío:", validateShipment(sampleShipment));
console.log("Validación del transportista:", validateCarrier(sampleCarriers[0]));