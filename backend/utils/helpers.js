exports.cleanHTML = (str) => str.replace(/<[^>]+>/g, '');

exports.filterProductsByQuery = (products, query) => {
  let filtered = [...products];

  // Filter by price
  const priceMatch = query.match(/under\s*₹?\s*([\d,]+)/i);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    filtered = filtered.filter(p => p.price && p.price <= maxPrice);
  }

  // Filter by category
  const categoryMap = {
    laptops: 'laptop',
    phones: 'mobile',
    smartphones: 'mobile',
    mobiles: 'mobile',
    headphones: 'accessories',
    accessories: 'accessories',
  };
  const categoryMatch = query.match(/(laptops|phones|smartphones|mobiles|headphones|accessories)/i);
  if (categoryMatch) {
    const catKey = categoryMatch[1].toLowerCase();
    const category = categoryMap[catKey] || catKey;
    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category);
  }

  return filtered;
};
