const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getBudgetAlternativeFromAI = async (foodName, macros) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a budget nutrition expert specializing in affordable Indian and global foods.
The user eats an expensive or premium food item. Your job is to suggest 3 cheaper alternatives
that provide a very similar macro nutritional profile.

Return ONLY a pure JSON object. No prose. No markdown.
Format:
{
  "original_food": "string",
  "original_macros": { "calories": number, "protein": number, "carbs": number, "fats": number },
  "original_price_estimate": "string (e.g. '₹250–400 per serving')",
  "alternatives": [
    {
      "food_name": "string",
      "alternative_price_estimate": "string (e.g. '₹40–60 per serving')",
      "monthly_savings": "string (e.g. '₹4,500–6,000/month if consumed daily')",
      "savings_percent": number (integer, estimated % cheaper than the original),
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "why": "string (1 sentence on why it's a good swap)"
    }
  ]
}`
          },
          {
            role: "user",
            content: `Premium food: ${foodName}
Known macros per serving — Calories: ${macros.calories} kcal, Protein: ${macros.protein}g, Carbs: ${macros.carbs}g, Fats: ${macros.fats}g.
Suggest 3 cheaper alternatives with similar macros. Focus on easily available items in India.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Groq Budget AI Error:", error.response?.data || error.message);
    throw new Error("Failed to generate budget alternatives.");
  }
};

module.exports = { getBudgetAlternativeFromAI };
