const axios = require('axios');
const { cleanHTML } = require('../utils/helpers');

exports.fetchProducts = async () => {
  const res = await axios.get(
    `https://cdn.contentstack.io/v3/content_types/product/entries?environment=${process.env.CONTENTSTACK_ENVIRONMENT}`,
    {
      headers: {
        api_key: process.env.CONTENTSTACK_API_KEY,
        access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
      },
    }
  );

  return (res.data.entries || []).map(p => ({
    name: p.name,
    price: p.price,
    category: p.category,
    description: cleanHTML(p.description || ''),
    image: p.image?.url || null,
  }));
};
