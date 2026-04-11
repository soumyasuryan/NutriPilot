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
              "suggestion": "string (e.g., 'Next time, add chia seeds for omega-3s!')",
              "household_measurement": "string (e.g., 'about 7-8 tablespoons' or '1 medium bowl' or '2 standard pieces')"
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

const getDailyInsightFromAI = async (consumedFoods, exactMath) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a strict, top-tier sports nutritionist.
            You will be provided with EXACT calculated deficit/surplus math. DO NOT do any calculations yourself.
            Trust the math provided in the prompt.
            Return a pure JSON object containing a SINGLE sentence coaching tip factoring in what they ate today and their current deficit. 
            Format:
            {
              "insight": "string"
            }`
          },
          {
            role: "user",
            content: `Foods Eaten Today: ${consumedFoods.join(', ') || 'Nothing yet'}.
            Current Status:
            Calories: ${exactMath.calories}
            Protein: ${exactMath.protein}
            Carbs: ${exactMath.carbs}
            Fats: ${exactMath.fats}
            
            Give me one sentence of advice on what to eat (or avoid) next to fix my macros.`
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

const getKitchenMeasurementFromAI = async (query) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a culinary expert. Convert the user's gram/ml input into common household measurements (e.g. tablespoons, bowls, cups, pieces).
            Give a direct 1-sentence answer without filler text.
            Return ONLY a pure JSON object.
            Format:
            {
              "measurement": "string (e.g., '100g of soya chunks is roughly 1.5 standard cups or 6-8 tablespoons.')"
            }`
          },
          {
            role: "user",
            content: `Convert this: ${query}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content).measurement;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate measurement conversion.");
  }
};

const getJudgeSwapFromAI = async (foodsList) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are 'The Judge', an intense, highly-effective sports nutritionist. 
            The user will provide a list of all foods they ate over the past 7 days.
            Your job is to identify the single most 'unnecessary' calorie-dense item (highest sugar/fat/empty calories) from their list.
            Provide a strict, 1-to-1 swap for a healthier item. DO NOT BE POLITE. Be strict and direct.
            Return ONLY a pure JSON object.
            Format:
            {
              "offender": "The bad food string (e.g., 'Evening Samosa')",
              "swap_text": "string (e.g., 'Replacing that evening Samosa with Roasted Chana will put you back in a deficit.')"
            }`
          },
          {
            role: "user",
            content: `Here are all the foods I logged this week: ${foodsList.join(', ')}`
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
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate judge swap.");
  }
};

module.exports = { getNutritionFromAI, getDailyInsightFromAI, getKitchenMeasurementFromAI, getJudgeSwapFromAI };