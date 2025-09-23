// Example for Gemini or OpenAI (update key and client accordingly)
exports.getAIReply = async (query, products) => {
  // Format product text
  const productText = products
    .slice(0, 5)
    .map(p => `${p.name} - ₹${p.price}: ${p.description}`)
    .join("\n");

  // Replace this with Gemini or OpenAI API call
  // Temporary fallback if AI is not available
  return `Here are some products based on your query:\n${productText}`;
};
