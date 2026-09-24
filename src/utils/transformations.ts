import {
	Carrier,
	Product,
	ProductCategory,
	Shipment,
	ShipmentStatus,
} from "../types/models";

//Scoring de Transportista y Cálculo de Costos

//Calcula el costo total de envío
export function calculateShippingCost(
	shipment: Shipment,
	product: Product,
	carrier: Carrier,
): number {
	const baseCost =
		carrier.baseRateUSD +
		product.weightKg * carrier.ratePerKgUSD * shipment.quantity +
		shipment.destination.distanceKm * carrier.ratePerKmUSD;

	const priorityMultiplier = {
		Standard: 1,
		Express: 1.3,
		"Same-day": 1.6,
	}[shipment.priority];

	return Number((baseCost * priorityMultiplier).toFixed(2));
}

//Calcula un puntaje de idoneidad (0-100) para un transportista
export function scoreCarrierForShipment(
	carrier: Carrier,
	shipment: Shipment,
	product: Product,
): number {
	const operatesAtDestination = carrier.operatesIn.includes(
		shipment.destination.country,
	);
	const canHandleWeight =
		product.weightKg * shipment.quantity <= carrier.maxWeightKg;
	const supportsPriority = carrier.acceptsPriority.includes(shipment.priority);
	const handlesProduct = !product.isFragile || carrier.handlesFragile;

	const score =
		(operatesAtDestination ? 20 : 0) +
		(canHandleWeight ? 20 : 0) +
		(supportsPriority ? 15 : 0) +
		(handlesProduct ? 15 : 0) +
		carrier.onTimeRate * 0.3;

	return Number(score.toFixed(2));
}

//Retorna el mejor transportista con su puntaje y costo, o null si no se encuentra ninguno adecuado
export function selectBestCarrier(
	carriers: Carrier[],
	shipment: Shipment,
	product: Product,
): { carrier: Carrier; score: number; cost: number } | null {
	let bestCarrier: { carrier: Carrier; score: number; cost: number } | null =
		null;

	for (const carrier of carriers) {
		const score = scoreCarrierForShipment(carrier, shipment, product);

		if (score < 50) {
			continue;
		}

		const cost = calculateShippingCost(shipment, product, carrier);

		if (bestCarrier === null || cost < bestCarrier.cost) {
			bestCarrier = { carrier, score, cost };
		}
	}

	return bestCarrier;
}

// Agregaciones y Reportes

// Cuenta los productos pertenecientes a cada categoría
export function countProductsByCategory(
	products: Product[], // Recibe la lista de productos a contabilizar.
): Record<ProductCategory, number> {
	const counts: Record<ProductCategory, number> = {
		Fashion: 0,
		Electronics: 0,
		Cosmetics: 0,
		Home: 0,
		Other: 0,
	}; // Inicializa el conteo de todas las categorías en cero.

	for (const product of products) {
		counts[product.category] += 1; // Incrementa la categoría del producto actual.
	}

	return counts; // Devuelve los conteos por categoría.
}

// Calcula el valor total de los productos disponibles en inventario
export function calculateTotalInventoryValue(
	products: Product[], // Recibe la lista de productos del inventario.
): number {
	let totalValue = 0; // Inicializa el acumulador del valor total.

	for (const product of products) {
		totalValue += product.stockQuantity * product.unitCostUSD; // Suma el valor del stock del producto actual.
	}

	return Number(totalValue.toFixed(2)); // Redondea y devuelve el valor total.
}

// Calcula la distancia promedio de todos los envíos
export function calculateAverageShipmentDistance(
	shipments: Shipment[], // Recibe la lista de envíos a promediar.
): number {
	if (shipments.length === 0) {
		return 0; // Devuelve cero cuando no hay envíos.
	}

	let totalDistance = 0; // Inicializa el acumulador de distancias.

	for (const shipment of shipments) {
		totalDistance += shipment.destination.distanceKm; // Suma la distancia del envío actual.
	}

	return Number((totalDistance / shipments.length).toFixed(2)); // Calcula, redondea y devuelve el promedio.
}

// Agrupa los envíos según su estado actual
export function groupShipmentsByStatus(
	shipments: Shipment[], // Recibe la lista de envíos a agrupar.
): Record<ShipmentStatus, Shipment[]> {
	const groupedShipments: Record<ShipmentStatus, Shipment[]> = {
		Pending: [],
		Assigned: [],
		"In transit": [],
		Delivered: [],
		Failed: [],
	}; // Inicializa un arreglo para cada estado posible.

	for (const shipment of shipments) {
		groupedShipments[shipment.status].push(shipment); // Agrega el envío al grupo de su estado.
	}

	return groupedShipments; // Devuelve los envíos agrupados por estado.
}

// Encuentra los transportistas con más envíos asignados
export function findTopCarriers(
	shipments: Shipment[], // Recibe la lista de envíos a analizar.
	topN: number, // Define la cantidad máxima de transportistas a devolver.
): Array<{ carrier: string; count: number }> {
	if (topN <= 0) {
		return []; // Devuelve una lista vacía si no se solicita ningún resultado.
	}

	const carrierCounts: Record<string, number> = {}; // Inicializa los conteos por transportista.

	for (const shipment of shipments) {
		if (shipment.carrier === null) {
			continue; // Omite los envíos sin transportista asignado.
		}

		carrierCounts[shipment.carrier] =
			(carrierCounts[shipment.carrier] ?? 0) + 1; // Incrementa el conteo del transportista.
	}

	const rankedCarriers = Object.entries(carrierCounts).map(
		([carrier, count]) => ({ carrier, count }), // Convierte cada conteo en el formato de salida.
	);

	rankedCarriers.sort((first, second) => second.count - first.count); // Ordena de mayor a menor uso.

	return rankedCarriers.slice(0, topN); // Devuelve la cantidad solicitada de transportistas.
}
