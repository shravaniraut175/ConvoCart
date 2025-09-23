const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Helper: filter products by category & price
const filterProductsByQuery = (products, query) => {
  let filtered = [...products];

  // Map query words to categories
  const categoryMap = {
    laptops: "laptop",
    phones: "mobile",
    smartphones: "mobile",
    mobiles: "mobile",
    headphones: "accessories",
    accessories: "accessories",
  };

  // 1️⃣ Extract category from query
  const categoryMatch = query.match(
    /(laptops|phones|smartphones|mobiles|headphones|accessories)/i
  );
  if (categoryMatch) {
    const catKey = categoryMatch[1].toLowerCase();
    const category = categoryMap[catKey] || catKey;
    filtered = filtered.filter(
      (p) => p.category && p.category.toLowerCase() === category
    );
  }

  // 2️⃣ Extract price from query
  const priceMatch = query.match(/under\s*₹?\s*([\d,]+)/i);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1].replace(/,/g, ""), 10);
    filtered = filtered.filter((p) => p.price && p.price <= maxPrice);
  }

  return filtered;
};

// POST /chat → Receive user query and respond
router.post("/", async (req, res) => {
  try {
    const query = req.body?.query;
    if (!query)
      return res.status(400).json({ error: 'Missing "query" in request body' });

    console.log("Received query:", query);

    // 1️⃣ Fetch products from Contentstack
    const productRes = await axios.get(
      `https://cdn.contentstack.io/v3/content_types/product/entries?environment=${process.env.CONTENTSTACK_ENVIRONMENT}`,
      {
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY,
          access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
        },
      }
    );

    let products = productRes.data.entries || [];
    if (!products.length)
      return res
        .status(500)
        .json({ error: "No products found in Contentstack" });

    // Map products to standard fields
    products = products.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description.replace(/<[^>]+>/g, ""), // remove HTML
      image: p.image?.url || null,
    }));

    // 2️⃣ Filter products by query
    const filteredProducts = filterProductsByQuery(products, query);

    if (!filteredProducts.length)
      return res.json({ reply: "No matching products found for your query." });

    // 3️⃣ Prepare product text for AI prompt
    const productText = filteredProducts
      .slice(0, 5)
      .map(
        (p) => `${p.name} - ₹${p.price}: ${p.description}`
      )
      .join("\n");

    console.log("Filtered products for AI:", filteredProducts);

    // 4️⃣ AI response placeholder
    // For now, if OpenAI or Gemini is down, just send products as response
    const reply = `Here are some products based on your query:\n${productText}`;

    // 5️⃣ Send both text reply and product images
    res.json({
      reply,
      products: filteredProducts.slice(0, 5),
    });
  } catch (err) {
    console.error("Error in /chat:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

module.exports = router;
