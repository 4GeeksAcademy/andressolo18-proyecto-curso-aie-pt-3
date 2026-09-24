import { Carrier, Product, Shipment } from "../types/models";

// Validaciones

// Valida que los datos de un producto cumplan las reglas de negocio básicas
export function validateProduct(
	product: Product, // Recibe el producto que se debe validar.
): { valid: boolean; errors: string[] } {
	const errors: string[] = []; // Inicializa la lista de mensajes de error.

	if (product.sku.trim().length === 0) {
		errors.push("El SKU es obligatorio."); // Registra la ausencia de SKU.
	}

	if (product.name.trim().length === 0) {
		errors.push("El nombre del producto es obligatorio."); // Registra la ausencia de nombre.
	}

	if (!Number.isFinite(product.weightKg) || product.weightKg <= 0) {
		errors.push("El peso debe ser mayor que cero."); // Registra un peso inválido.
	}

	if (!Number.isFinite(product.dimensions.lengthCm) || product.dimensions.lengthCm <= 0) {
		errors.push("El largo debe ser mayor que cero."); // Registra un largo inválido.
	}

	if (!Number.isFinite(product.dimensions.widthCm) || product.dimensions.widthCm <= 0) {
		errors.push("El ancho debe ser mayor que cero."); // Registra un ancho inválido.
	}

	if (!Number.isFinite(product.dimensions.heightCm) || product.dimensions.heightCm <= 0) {
		errors.push("El alto debe ser mayor que cero."); // Registra un alto inválido.
	}

	if (!Number.isFinite(product.stockQuantity) || product.stockQuantity < 0) {
		errors.push("La cantidad en stock no puede ser negativa."); // Registra una cantidad de stock inválida.
	}

	if (!Number.isFinite(product.minStockThreshold) || product.minStockThreshold < 0) {
		errors.push("El umbral mínimo de stock no puede ser negativo."); // Registra un umbral inválido.
	}

	if (!Number.isFinite(product.unitCostUSD) || product.unitCostUSD <= 0) {
		errors.push("El costo unitario debe ser mayor que cero."); // Registra un costo unitario inválido.
	}

	return { valid: errors.length === 0, errors }; // Devuelve el resultado y los errores encontrados.
}

// Valida que los datos de un envío cumplan las reglas de negocio básicas
export function validateShipment(
	shipment: Shipment, // Recibe el envío que se debe validar.
): { valid: boolean; errors: string[] } {
	const errors: string[] = []; // Inicializa la lista de mensajes de error.

	if (shipment.id.trim().length === 0) {
		errors.push("El identificador del envío es obligatorio."); // Registra la ausencia del identificador.
	}

	if (shipment.sku.trim().length === 0) {
		errors.push("El SKU del producto es obligatorio."); // Registra la ausencia del SKU.
	}

	if (!Number.isInteger(shipment.quantity) || shipment.quantity <= 0) {
		errors.push("La cantidad debe ser un número entero mayor que cero."); // Registra una cantidad inválida.
	}

	if (shipment.destination.city.trim().length === 0) {
		errors.push("La ciudad de destino es obligatoria."); // Registra la ausencia de ciudad.
	}

	if (shipment.destination.postalCode.trim().length === 0) {
		errors.push("El código postal de destino es obligatorio."); // Registra la ausencia de código postal.
	}

	if (!Number.isFinite(shipment.destination.distanceKm) || shipment.destination.distanceKm < 0) {
		errors.push("La distancia de destino no puede ser negativa."); // Registra una distancia inválida.
	}

	if (!Number.isFinite(shipment.declaredValueUSD) || shipment.declaredValueUSD < 0) {
		errors.push("El valor declarado no puede ser negativo."); // Registra un valor declarado inválido.
	}

	if (Number.isNaN(shipment.createdAt.getTime())) {
		errors.push("La fecha de creación no es válida."); // Registra una fecha inválida.
	}

	const requiresCarrier = ["Assigned", "In transit", "Delivered"].includes(
		shipment.status,
	); // Determina si el estado exige un transportista.

	if (requiresCarrier && shipment.carrier === null) {
		errors.push("El envío necesita un transportista asignado para su estado actual."); // Registra una asignación faltante.
	}

	return { valid: errors.length === 0, errors }; // Devuelve el resultado y los errores encontrados.
}

// Valida que los datos de un transportista cumplan las reglas de negocio básicas
export function validateCarrier(
	carrier: Carrier, // Recibe el transportista que se debe validar.
): { valid: boolean; errors: string[] } {
	const errors: string[] = []; // Inicializa la lista de mensajes de error.

	if (carrier.id.trim().length === 0) {
		errors.push("El identificador del transportista es obligatorio."); // Registra la ausencia del identificador.
	}

	if (carrier.name.trim().length === 0) {
		errors.push("El nombre del transportista es obligatorio."); // Registra la ausencia de nombre.
	}

	if (carrier.operatesIn.length === 0) {
		errors.push("El transportista debe operar en al menos un país."); // Registra la falta de cobertura.
	}

	if (!Number.isFinite(carrier.baseRateUSD) || carrier.baseRateUSD < 0) {
		errors.push("La tarifa base no puede ser negativa."); // Registra una tarifa base inválida.
	}

	if (!Number.isFinite(carrier.ratePerKgUSD) || carrier.ratePerKgUSD < 0) {
		errors.push("La tarifa por kilogramo no puede ser negativa."); // Registra una tarifa por peso inválida.
	}

	if (!Number.isFinite(carrier.ratePerKmUSD) || carrier.ratePerKmUSD < 0) {
		errors.push("La tarifa por kilómetro no puede ser negativa."); // Registra una tarifa por distancia inválida.
	}

	if (!Number.isFinite(carrier.avgDeliveryDays) || carrier.avgDeliveryDays <= 0) {
		errors.push("El tiempo promedio de entrega debe ser mayor que cero."); // Registra un tiempo de entrega inválido.
	}

	if (!Number.isFinite(carrier.onTimeRate) || carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
		errors.push("La tasa de puntualidad debe estar entre 0 y 100."); // Registra una tasa de puntualidad inválida.
	}

	if (!Number.isFinite(carrier.maxWeightKg) || carrier.maxWeightKg <= 0) {
		errors.push("El peso máximo debe ser mayor que cero."); // Registra una capacidad de peso inválida.
	}

	if (carrier.acceptsPriority.length === 0) {
		errors.push("El transportista debe aceptar al menos una prioridad."); // Registra la falta de prioridades aceptadas.
	}

	return { valid: errors.length === 0, errors }; // Devuelve el resultado y los errores encontrados.
}
