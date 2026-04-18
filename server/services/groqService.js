const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getNutritionFromAI = async (foodQuery) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a specialized Indian Nutrition AI.
Convert the user's food input into a JSON object. If multiple foods are mentioned (e.g., "rajma and rice"), calculate the TOTAL combined nutrition but detail the individual portions in 'household_measurement'.
Strictly return ONLY JSON. No prose or explanations.
Format:
{
  "food_name": "string (the primary name or combined name)",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "bioavailability": "string (brief note on protein quality)",
  "suggestion": "string (brief tip)",
  "household_measurement": "string (MANDATORY: Convert grams/ml to Indian household units like '1/2 cup rajma, 1 cup rice' or '2 katoris dal')"
}
CRITICAL MEASUREMENT REQUIREMENT:
- Even if grams are provided, you MUST estimate and display the equivalent in cups, bowls, katoris, or pieces in the 'household_measurement' field.
- If the user specifies a quantity, multiply all nutrition values by that quantity.
- Never return the value for just 1 serving if they asked for multiple.`,
          },
          {
            role: 'user',
            content: `Extract nutrition for: ${foodQuery}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch nutrition data.');
  }
};

const getDailyInsightFromAI = async (consumedFoods, exactMath) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a strict, top-tier sports nutritionist.
You will be provided with exact deficit or surplus math. Do not calculate.
Return a pure JSON object with a single sentence.
Format:
{
  "insight": "string"
}`,
          },
          {
            role: 'user',
            content: `Foods Eaten Today: ${consumedFoods.join(', ') || 'Nothing yet'}.
Current Status:
Calories: ${exactMath.calories}
Protein: ${exactMath.protein}
Carbs: ${exactMath.carbs}
Fats: ${exactMath.fats}

Give one sentence of advice on what to eat or avoid next.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content).insight;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate insight.');
  }
};

const getKitchenMeasurementFromAI = async (query) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a culinary expert. Convert gram or ml input into common household measurements.
Give a direct 1-sentence answer without filler text.
Return ONLY a pure JSON object.
Format:
{
  "measurement": "string"
}`,
          },
          {
            role: 'user',
            content: `Convert this: ${query}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content).measurement;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate measurement conversion.');
  }
};

const getJudgeSwapFromAI = async (foodsList) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are 'The Judge', an intense sports nutritionist.
The user will provide a list of foods from the past week.
Identify the single most unnecessary calorie-dense item and provide a strict 1-to-1 swap.
Return ONLY a pure JSON object.
Format:
{
  "offender": "string",
  "reasoning": "string (why this specific item is ruining progress)",
  "swap_text": "string (the suggested replacement)",
  "benefits": "string (2-3 concrete benefits of this swap, e.g., 'Saves 300kcal and adds 20g protein')"
}`,
          },
          {
            role: 'user',
            content: `Here are all the foods I logged this week: ${foodsList.join(', ')}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate judge swap.');
  }
};

const getContextualCoachingFromAI = async (context) => {
  const {
    user_profile,
    patterns,
    daily_score,
    prediction,
    failure_insights,
    meal_fix,
    recent_meals,
    current_meal,
  } = context;

  const formatProfile = (profile) => {
    if (!profile) return 'No profile data available.';
    return [
      `Name: ${profile.full_name || 'Unknown'}`,
      `Age: ${profile.age || '?'} | Gender: ${profile.gender || '?'}`,
      `Weight: ${profile.weight || '?'} kg | Height: ${profile.height || '?'} cm`,
      `Goal: ${profile.fitness_goal || '?'} | Activity: ${profile.activity_level || '?'}`,
      `Diet Preference: ${profile.diet_preference || 'any'}`,
      `Daily Targets - Cal: ${profile.target_calories || '?'} kcal | Protein: ${profile.target_protein || '?'}g | Carbs: ${profile.target_carbs || '?'}g | Fats: ${profile.target_fats || '?'}g`,
    ].join('\n');
  };

  const formatPatterns = (patternPayload) => {
    if (!patternPayload || patternPayload.user_state === 'unknown') {
      return 'No behavioral patterns recorded yet.';
    }
    return [
      `State: ${patternPayload.user_state?.toUpperCase()}`,
      `Consistency Score: ${patternPayload.consistency_score ?? 'N/A'}/100`,
      `Avg Daily Calories: ${patternPayload.avg_daily_calories ?? 'N/A'} kcal`,
      `Avg Daily Protein: ${patternPayload.avg_daily_protein ?? 'N/A'}g`,
      `Recurring Mistakes: ${(patternPayload.common_mistakes || []).join(', ') || 'None detected'}`,
      `Mistake Streaks: ${JSON.stringify(patternPayload.mistake_streaks || {})}`,
    ].join('\n');
  };

  const formatDailyScore = (score) => {
    if (!score) return 'No daily score recorded yet.';
    return `Score: ${score.score}/100 | Protein: ${score.protein_score}/100 | Calories: ${score.calorie_score}/100 | Quality: ${score.quality_score}/100`;
  };

  const formatPrediction = (dayPrediction) => {
    if (!dayPrediction) return 'No day prediction available.';
    return `Projected Calories: ${dayPrediction.projected_calories} kcal | Projected Protein: ${dayPrediction.projected_protein}g | Risk: ${dayPrediction.risk_level}`;
  };

  const formatInsights = (insights) => {
    if (!insights || insights.length === 0) return 'No failure insights yet.';
    return insights
      .map((item, index) => `${index + 1}. ${item.issue} (${item.percentage_contribution}%)`)
      .join('\n');
  };

  const formatMealFix = (fix) => {
    if (!fix) return 'No meal completion recommendation available.';
    return `Missing Macro: ${fix.missing_macro} | Quick Fix: ${fix.quick_fix} | Estimated Cost: Rs.${fix.estimated_cost}`;
  };

  const formatRecentMeals = (meals) => {
    if (!meals || meals.length === 0) return 'No recent meals logged.';
    return meals
      .map(
        (meal, index) =>
          `${index + 1}. ${meal.food_name} - ${meal.calories ?? '?'} kcal | P: ${meal.protein ?? '?'}g | C: ${meal.carbs ?? '?'}g | F: ${meal.fats ?? '?'}g`
      )
      .join('\n');
  };

  const formatCurrentMeal = (meal) => {
    if (!meal) return 'No meal provided.';
    return `${meal.food_name} - ${meal.calories ?? '?'} kcal | Protein: ${meal.protein ?? '?'}g | Carbs: ${meal.carbs ?? '?'}g | Fats: ${meal.fats ?? '?'}g`;
  };

  const userPrompt = `
USER PROFILE
${formatProfile(user_profile)}

DIET PREFERENCE
${user_profile?.diet_preference || 'any'}

PATTERNS + STREAKS
${formatPatterns(patterns)}

DAILY SCORE
${formatDailyScore(daily_score)}

DAY PREDICTION
${formatPrediction(prediction)}

FAILURE INSIGHTS
${formatInsights(failure_insights)}

SMART MEAL COMPLETION
${formatMealFix(meal_fix)}

RECENT MEALS
${formatRecentMeals(recent_meals)}

CURRENT MEAL
${formatCurrentMeal(current_meal)}

Judge the habit, not just the single meal.
`.trim();

  const nonVegTerms = /\b(chicken|mutton|fish|egg|eggs|prawn|prawns|meat|turkey)\b/i;

  const sanitizeForDietPreference = (payload) => {
    if (user_profile?.diet_preference !== 'veg') {
      return payload;
    }

    const fallbackFix = meal_fix?.quick_fix || 'Add paneer, curd, dal, or soya for a vegetarian protein correction.';
    const fallbackSwap = 'Swap to paneer bhurji, roasted chana, curd, tofu, or dal to keep it vegetarian and budget-safe.';
    const sanitized = { ...payload };

    ['why', 'immediate_fix', 'smart_meal_completion', 'budget_swap', 'warning'].forEach((key) => {
      if (typeof sanitized[key] === 'string' && nonVegTerms.test(sanitized[key])) {
        sanitized[key] = key === 'budget_swap' ? fallbackSwap : fallbackFix;
      }
    });

    return sanitized;
  };

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are NutriPilot, a strict Indian student fitness coach. You analyze patterns, streaks, and predict failures. You only suggest meals that match the user's diet preference.
Return ONLY a pure JSON object with:
{
  "judgment": "good | okay | bad",
  "why": "1-2 sentences referencing patterns, streaks, and prediction",
  "immediate_fix": "One concrete action they can take today",
  "smart_meal_completion": "Minimal addition to complete the current meal",
  "budget_swap": "A cheap Indian alternative",
  "warning": "Risk warning if needed, else empty string"
}
If diet preference is veg, never suggest eggs, chicken, fish, or meat.`,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return sanitizeForDietPreference(JSON.parse(response.data.choices[0].message.content));
  } catch (error) {
    console.error('Groq Contextual Coach Error:', error.response?.data || error.message);
    throw new Error('Failed to generate contextual coaching response.');
  }
};

module.exports = {
  getNutritionFromAI,
  getDailyInsightFromAI,
  getKitchenMeasurementFromAI,
  getJudgeSwapFromAI,
  getContextualCoachingFromAI,
};
