export const flattenProducts = (data) => {
  let flattened = [];
  let seenNames = new Set();

  for (const item of data) {
    // Process the main product
    if (item.name && item.price && !seenNames.has(item.name)) {
      flattened.push({ name: item.name, price: item.price });
      seenNames.add(item.name);
    }

    // Process linkedProducts
    if (item.linkedProducts) {
      for (const key in item.linkedProducts) {
        const linkedProduct = item.linkedProducts[key];
        if (linkedProduct.name && !seenNames.has(linkedProduct.name)) {
          flattened.push({
            name: linkedProduct.name,
            price: linkedProduct.price,
          });
          seenNames.add(linkedProduct.name);
        }
      }
    }
  }

  return flattened;
};
