/** Busca linealmente un producto por SKU sin distinguir mayúsculas y minúsculas. */
export function findProductBySKU(products, sku) {
    const normalizedSku = sku.toLowerCase();
    for (const product of products) {
        if (product.sku.toLowerCase() === normalizedSku)
            return product;
    }
    return null;
}
/** Busca linealmente un envío por su identificador. */
export function findShipmentById(shipments, id) {
    for (const shipment of shipments) {
        if (shipment.id === id)
            return shipment;
    }
    return null;
}
/** Busca por dicotomía el índice de un producto con el peso indicado. */
export function binarySearchProductByWeight(sortedProducts, targetWeight) {
    let low = 0;
    let high = sortedProducts.length - 1;
    while (low <= high) {
        const middle = Math.floor((low + high) / 2);
        const weight = sortedProducts[middle].weightKg;
        if (weight === targetWeight)
            return middle;
        if (weight < targetWeight) {
            low = middle + 1;
        }
        else {
            high = middle - 1;
        }
    }
    return -1;
}
