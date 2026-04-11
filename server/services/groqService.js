const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNutritionFromAI = async (foodQuery) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-8b-8192", // Fast and efficient for extraction
        messages: [
          {
            role: "system",
            content: `You are a specialized Indian Nutrition AI. 
            Convert the user's food input into a JSON object.
            Strictly return ONLY JSON. No prose or explanations.
            Format:
            {
              "food_name": "string",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fats": number
            }
            Use Indian standard portion sizes (e.g., 1 medium Paratha, 1 katori Dal).`
          },
          {
            role: "user",
            content: `Extract nutrition for: ${foodQuery}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Lower temperature for more consistent, factual data
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the string response into a JS object
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch nutrition data.");
  }
};

module.exports = { getNutritionFromAI };