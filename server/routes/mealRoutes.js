const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {
  getNutritionFromAI,
  getContextualCoachingFromAI,
  getDailyInsightFromAI,
  getKitchenMeasurementFromAI,
} = require('../services/groqService');
const { analyzeUserPatterns } = require('../services/patternService');
const { buildLLMContext } = require('../services/contextService');
const {
  calculateDailyScore,
  generateFailureInsights,
  generateMealFix,
  normalizeDietPreference,
  predictDayOutcome,
  updateMistakeStreaks,
  analyzeThreeDayAudit,
} = require('../services/behaviorService');

router.post('/analyze', async (req, res) => {
  const { foodQuery } = req.body;
  try {
    const nutrition = await getNutritionFromAI(foodQuery);
    res.json({ success: true, data: nutrition });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze food.' });
  }
});

router.post('/log', async (req, res) => {
  const { userId, foodName, calories, protein, carbs, fats } = req.body;
  try {
    const checkLibrary = await db.query(
      'SELECT * FROM food_library WHERE food_name = $1 AND user_id = $2',
      [foodName, userId]
    );

    let foodItem = checkLibrary.rows[0];

    if (!foodItem) {
      const insertFood = await db.query(
        'INSERT INTO food_library (user_id, food_name, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, foodName, calories || 0, protein || 0, carbs || 0, fats || 0]
      );
      foodItem = insertFood.rows[0];
    }

    await db.query(
      `INSERT INTO meal_logs (user_id, food_id, meal_text, calories, protein, carbs, fats)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        foodItem.id,
        foodItem.food_name,
        foodItem.calories || 0,
        foodItem.protein || 0,
        foodItem.carbs || 0,
        foodItem.fats || 0,
      ]
    );

    res.json({ success: true, food: foodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error logging meal' });
  }
});

router.get('/recent/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT DISTINCT ON (f.food_name) f.id, f.food_name, f.calories, f.protein, f.carbs, f.fats, m.logged_at
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1
      ORDER BY f.food_name, m.logged_at DESC
      LIMIT 4;
    `, [req.params.userId]);
    rows.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
    res.json({ success: true, data: rows.slice(0, 4) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recent meals' });
  }
});

router.get('/today/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        COUNT(m.id) as meal_count,
        COALESCE(SUM(f.calories), 0) as total_calories,
        COALESCE(SUM(f.protein), 0) as total_protein,
        COALESCE(SUM(f.carbs), 0) as total_carbs,
        COALESCE(SUM(f.fats), 0) as total_fats
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE
    `, [req.params.userId]);

    const { rows: streakRows } = await db.query(`
      SELECT DISTINCT TO_CHAR(logged_at, 'YYYY-MM-DD') as log_date
      FROM meal_logs
      WHERE user_id = $1
      ORDER BY log_date DESC
    `, [req.params.userId]);

    const { rows: todayRows } = await db.query("SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') as today");
    const todayStr = todayRows[0].today;

    let streak = 0;
    let currentCheck = new Date(`${todayStr}T00:00:00Z`).getTime();
    let isFirst = true;

    for (const row of streakRows) {
      const rowDate = new Date(`${row.log_date}T00:00:00Z`).getTime();

      if (isFirst) {
        if (rowDate === currentCheck) {
          streak += 1;
          currentCheck -= 86400000;
        } else if (rowDate === currentCheck - 86400000) {
          streak += 1;
          currentCheck -= 2 * 86400000;
        } else {
          break;
        }
        isFirst = false;
      } else if (rowDate === currentCheck) {
        streak += 1;
        currentCheck -= 86400000;
      } else {
        break;
      }
    }

    const payload = rows[0];
    payload.streak = streak;

    res.json({ success: true, data: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily totals" });
  }
});

router.get('/today-meals/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT m.id as log_id, f.food_name, f.calories, f.protein, f.carbs, f.fats, m.logged_at
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE
      ORDER BY m.logged_at DESC
    `, [req.params.userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch today's meals" });
  }
});

router.post('/insight', async (req, res) => {
  const { userId } = req.body;
  try {
    const profileRes = await db.query('SELECT target_calories, target_protein, target_carbs, target_fats FROM profiles WHERE id = $1', [userId]);
    const profile = profileRes.rows[0];
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const todayRes = await db.query(`
      SELECT 
        array_agg(f.food_name) as eaten_foods,
        COALESCE(SUM(f.calories), 0) as total_calories,
        COALESCE(SUM(f.protein), 0) as total_protein,
        COALESCE(SUM(f.carbs), 0) as total_carbs,
        COALESCE(SUM(f.fats), 0) as total_fats
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE
    `, [userId]);

    const consumed = todayRes.rows[0];
    if (!consumed.eaten_foods) consumed.eaten_foods = [];

    const getDeficitStr = (consumedAmount, targetAmount) => {
      const diff = targetAmount - consumedAmount;
      if (diff > 0) return `SHORT by ${diff.toFixed(1)}`;
      if (diff < 0) return `OVER by ${Math.abs(diff).toFixed(1)}`;
      return 'exactly ON TARGET';
    };

    const exactMath = {
      calories: getDeficitStr(consumed.total_calories, profile.target_calories),
      protein: getDeficitStr(consumed.total_protein, profile.target_protein),
      carbs: getDeficitStr(consumed.total_carbs, profile.target_carbs),
      fats: getDeficitStr(consumed.total_fats, profile.target_fats),
    };

    const insightText = await getDailyInsightFromAI(consumed.eaten_foods, exactMath);

    res.json({ success: true, insight: insightText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate daily insight' });
  }
});

router.post('/converter', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'No query provided.' });
  try {
    const measurement = await getKitchenMeasurementFromAI(query);
    res.json({ success: true, measurement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to convert measurement.' });
  }
});

router.get('/chart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await db.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('day', m.logged_at), 'Dy') as day_name,
        DATE_TRUNC('day', m.logged_at) as full_date,
        COALESCE(SUM(f.calories), 0) as total_calories
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE_TRUNC('day', m.logged_at)
      ORDER BY DATE_TRUNC('day', m.logged_at) ASC
    `, [userId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

router.get('/library/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await db.query(`
      SELECT DISTINCT ON (food_name) *
      FROM food_library 
      WHERE user_id = $1
      ORDER BY food_name ASC
    `, [userId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch food library' });
  }
});

router.get('/weekly/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        DATE(m.logged_at) as date,
        COALESCE(SUM(f.calories), 0) as total_calories
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 
      AND m.logged_at >= (CURRENT_DATE - INTERVAL '6 days')
      GROUP BY DATE(m.logged_at)
      ORDER BY date ASC
    `, [req.params.userId]);

    const weeklyData = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const dateString = day.toISOString().split('T')[0];

      const found = rows.find((row) => {
        const rowDate = new Date(row.date);
        rowDate.setHours(12, 0, 0, 0);
        return rowDate.toISOString().split('T')[0] === dateString;
      });

      weeklyData.push(found ? Number(found.total_calories) : 0);
    }

    res.json({ success: true, data: weeklyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weekly history' });
  }
});

router.post('/analyze-meal', async (req, res) => {
  const { userId, foodQuery, foodName, calories, protein, carbs, fats } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }
  if (!foodQuery && !foodName) {
    return res.status(400).json({ error: 'Provide either foodQuery or foodName.' });
  }

  try {
    let nutrition;
    if (foodQuery) {
      nutrition = await getNutritionFromAI(foodQuery);
    } else {
      nutrition = {
        food_name: foodName,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
      };
    }

    const resolvedName = nutrition.food_name || foodQuery || foodName;

    let foodItem;
    const checkLib = await db.query(
      'SELECT * FROM food_library WHERE food_name = $1 AND user_id = $2 LIMIT 1',
      [resolvedName, userId]
    );

    if (checkLib.rows.length > 0) {
      foodItem = checkLib.rows[0];
    } else {
      const insertFood = await db.query(
        `INSERT INTO food_library (user_id, food_name, calories, protein, carbs, fats)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, resolvedName, nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fats]
      );
      foodItem = insertFood.rows[0];
    }

    const insertMealRes = await db.query(
      `INSERT INTO meal_logs (user_id, food_id, meal_text, calories, protein, carbs, fats)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING logged_at`,
      [
        userId,
        foodItem.id,
        resolvedName,
        nutrition.calories,
        nutrition.protein,
        nutrition.carbs,
        nutrition.fats,
      ]
    );

    const loggedAt = insertMealRes.rows[0]?.logged_at || new Date();

    const currentMeal = {
      food_name: resolvedName,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fats: nutrition.fats,
    };

    const { rows: last3DaysMeals } = await db.query(
      `SELECT
         COALESCE(ml.meal_text, fl.food_name) AS food_name,
         COALESCE(ml.calories, fl.calories) AS calories,
         COALESCE(ml.protein, fl.protein) AS protein,
         COALESCE(ml.carbs, fl.carbs) AS carbs,
         COALESCE(ml.fats, fl.fats) AS fats,
         ml.logged_at
       FROM meal_logs ml
       LEFT JOIN food_library fl ON fl.id = ml.food_id
       WHERE ml.user_id = $1
         AND ml.logged_at >= CURRENT_TIMESTAMP - INTERVAL '3 days'
       ORDER BY ml.logged_at DESC`,
      [userId]
    );

    const profileRes = await db.query(
      `SELECT target_calories, target_protein, diet_preference
       FROM profiles
       WHERE id = $1`,
      [userId]
    );
    const profile = profileRes.rows[0] || {};
    const targetCalories = profile.target_calories || 2000;
    const dietPreference = normalizeDietPreference(profile.diet_preference);

    const patternResult = analyzeUserPatterns(last3DaysMeals, Number(targetCalories));

    const streakRes = await db.query(
      `SELECT mistake_streaks
       FROM user_patterns
       WHERE user_id = $1`,
      [userId]
    );
    const mistakeStreaks = updateMistakeStreaks(
      streakRes.rows[0]?.mistake_streaks || {},
      currentMeal,
      loggedAt
    );

    await db.query(
      `INSERT INTO user_patterns
         (user_id, common_mistakes, mistake_streaks, consistency_score, avg_daily_protein, avg_daily_calories, user_state, latest_coaching, last_updated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         common_mistakes = EXCLUDED.common_mistakes,
         mistake_streaks = EXCLUDED.mistake_streaks,
         consistency_score = EXCLUDED.consistency_score,
         avg_daily_protein = EXCLUDED.avg_daily_protein,
         avg_daily_calories = EXCLUDED.avg_daily_calories,
         user_state = EXCLUDED.user_state,
         latest_coaching = EXCLUDED.latest_coaching,
         last_updated = NOW()`,
      [
        userId,
        patternResult.common_mistakes,
        mistakeStreaks,
        patternResult.consistency_score,
        patternResult.avg_daily_protein,
        patternResult.avg_daily_calories,
        patternResult.user_state,
        coaching,
      ]
    );

    const scoreDate = new Date(new Date(loggedAt).getTime() + (330 * 60 * 1000)).toISOString().split('T')[0];
    const dailyScore = await calculateDailyScore(userId, scoreDate, db);
    const prediction = await predictDayOutcome(userId, db);
    const mealFix = generateMealFix(currentMeal, dietPreference);
    const enrichedPatterns = {
      ...patternResult,
      mistake_streaks: mistakeStreaks,
    };
    const failureInsights = generateFailureInsights(enrichedPatterns);

    const context = await buildLLMContext(userId, currentMeal, db, {
      dailyScore,
      prediction,
      failureInsights,
      mealFix,
    });

    const coaching = await getContextualCoachingFromAI(context);

    return res.json({
      success: true,
      meal: currentMeal,
      nutrition_detail: {
        bioavailability: nutrition.bioavailability || null,
        suggestion: nutrition.suggestion || null,
        household_measurement: nutrition.household_measurement || null,
      },
      patterns: enrichedPatterns,
      daily_score: dailyScore,
      prediction,
      meal_fix: mealFix,
      failure_insights: failureInsights,
      coaching: {
        ...coaching,
        smart_meal_completion: coaching.smart_meal_completion || mealFix.quick_fix,
      },
    });
  } catch (err) {
    console.error('[/analyze-meal]', err);
    res.status(500).json({ error: 'Failed to analyze meal with context.' });
  }
});

router.get('/behavioral-status/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const profileRes = await db.query('SELECT target_calories, target_protein, diet_preference FROM profiles WHERE id = $1', [userId]);
    const profile = profileRes.rows[0] || {};
    
    const patternRes = await db.query('SELECT * FROM user_patterns WHERE user_id = $1', [userId]);
    const patterns = patternRes.rows[0] || {};

    const scoreDate = new Date(new Date().getTime() + (330 * 60 * 1000)).toISOString().split('T')[0];
    const dailyScore = await calculateDailyScore(userId, scoreDate, db);
    const prediction = await predictDayOutcome(userId, db);
    
    // Fetch last 3 days of meals for the rolling audit
    const mealsRes = await db.query(
      `SELECT calories, protein, carbs, fats, logged_at 
       FROM meal_logs 
       WHERE user_id = $1 
         AND logged_at >= NOW() - INTERVAL '3 days' 
       ORDER BY logged_at DESC`,
      [userId]
    );
    const rollingAudit = analyzeThreeDayAudit(profile, mealsRes.rows);
    
    const failure_insights = generateFailureInsights(patterns);
    
    res.json({
      success: true,
      daily_score: dailyScore,
      prediction: prediction,
      failure_insights: failure_insights,
      rolling_audit: rollingAudit,
      patterns: patterns,
      latest_coaching: patterns.latest_coaching || null,
      diet_preference: profile.diet_preference
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch behavioral status' });
  }
});

router.post('/re-analyze/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows: patternRows } = await db.query('SELECT * FROM user_patterns WHERE user_id = $1', [userId]);
    const patterns = patternRows[0] || {};
    
    const scoreDate = new Date(new Date().getTime() + (330 * 60 * 1000)).toISOString().split('T')[0];
    const dailyScore = await calculateDailyScore(userId, scoreDate, db);
    const prediction = await predictDayOutcome(userId, db);
    const failureInsights = generateFailureInsights(patterns);
    
    // We need the last meal to build context, or just use general context
    const { rows: lastMeals } = await db.query(
      'SELECT meal_text as food_name, calories, protein, carbs, fats FROM meal_logs WHERE user_id = $1 ORDER BY logged_at DESC LIMIT 1',
      [userId]
    );
    const lastMeal = lastMeals[0] || null;

    const context = await buildLLMContext(userId, lastMeal, db, {
      dailyScore,
      prediction,
      failureInsights,
      mealFix: lastMeal ? generateMealFix(lastMeal, patterns.diet_preference) : null,
    });

    const coaching = await getContextualCoachingFromAI(context);

    // Save it
    await db.query(
      'UPDATE user_patterns SET latest_coaching = $1, last_updated = NOW() WHERE user_id = $2',
      [coaching, userId]
    );

    res.json({
      success: true,
      coaching,
      daily_score: dailyScore,
      prediction,
      failure_insights: failureInsights
    });
  } catch (err) {
    console.error('[/re-analyze]', err);
    res.status(500).json({ error: 'Failed to re-analyze behavioral state.' });
  }
});

module.exports = router;
