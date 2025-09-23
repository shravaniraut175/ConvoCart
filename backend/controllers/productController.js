const { fetchProducts } = require('../services/contentstackService');

exports.getProducts = async (req, res) => {
  try {
    const products = await fetchProducts();
    res.json({ products });
  } catch (err) {
    console.error('ProductController error:', err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
