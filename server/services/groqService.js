const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNutritionFromAI = async (foodQuery) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant", // Fast and efficient for extraction
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
              "fats": number,
              "bioavailability": "string (e.g., 'High: Complete protein')",
              "suggestion": "string (e.g., 'Next time, add chia seeds for omega-3s!')"
            }
            Use standard portion sizes if not specified.`
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

const getDailyInsightFromAI = async (consumedFoods, limits, consumed) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a strict, top-tier sports nutritionist. The user's goal is to hit their macros.
            You will be provided with what they ate today, their total target limits, and what they currently consumed.
            Return a pure JSON object containing a SINGLE sentence coaching tip to help them hit their remaining target. 
            Format:
            {
              "insight": "string (e.g. 'You are 35g short on protein today, try adding a 150g grilled chicken breast to your dinner.')"
            }`
          },
          {
            role: "user",
            content: `Foods Eaten Today: ${consumedFoods.join(', ') || 'Nothing yet'}.
            Total Targets: ${limits.calories} kcal, ${limits.protein}g protein, ${limits.carbs}g carbs, ${limits.fats}g fats.
            Consumed So Far: ${consumed.total_calories} kcal, ${consumed.total_protein}g protein, ${consumed.total_carbs}g carbs, ${consumed.total_fats}g fats.
            `
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content).insight;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate insight.");
  }
};

module.exports = { getNutritionFromAI, getDailyInsightFromAI };