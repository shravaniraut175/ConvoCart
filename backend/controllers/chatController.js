const { fetchProducts } = require('../services/contentstackService');
const { getAIReply } = require('../services/aiService');
const { cleanHTML, filterProductsByQuery } = require('../utils/helpers');

exports.handleChat = async (req, res) => {
  const query = req.body.query;
  if (!query) return res.status(400).json({ error: 'Query missing' });

  try {
    let products = await fetchProducts();
    products = filterProductsByQuery(products, query);

    if (!products.length) {
      return res.json({ reply: "No matching products found for your query." });
    }

    const reply = await getAIReply(query, products);
    res.json({ reply, products: products.slice(0, 5) });
  } catch (err) {
    console.error('ChatController error:', err.message);
    res.status(500).json({ error: "Failed to process query" });
  }
};
