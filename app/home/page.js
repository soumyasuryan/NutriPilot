'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Droplet, Wheat, Info, Sparkles, TrendingUp, Plus, Search, Clock, ChevronRight, Scale, CheckCircle2, ShieldAlert, Activity, Loader2 } from 'lucide-react';
import Toast from '@/components/Toast';

// --- Reusable SVG Circular Progress Ring ---
const CircularProgress = ({ value, max, color, size = 200, strokeWidth = 14, label, subLabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure we handle case where max might be 0 to avoid NaN
  const safeMax = max > 0 ? max : 1;
  const progress = Math.min(value / safeMax, 1);
  const dashLength = progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100"
        />
        {/* Progress Value */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dashLength }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Inner Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          {label === 'kcal remaining' ? Math.max(0, Math.round(max - value)) : Math.round(value)}
        </span>
        <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
        {subLabel && <span className="text-[11px] text-gray-400 font-medium">{subLabel}</span>}
      </div>
    </div>
  );
};

const getScoreAppearance = (score) => {
  if (score < 35) {
    return {
      ringColor: '#DC2626',
      badgeBg: 'bg-red-500',
      badgeIcon: 'text-white',
      panelTone: 'from-red-50 to-rose-50',
      borderTone: 'border-red-100',
      statusText: 'Needs Recovery',
      statusColor: 'text-red-600',
    };
  }
  if (score < 60) {
    return {
      ringColor: '#D97706',
      badgeBg: 'bg-amber-500',
      badgeIcon: 'text-white',
      panelTone: 'from-amber-50 to-orange-50',
      borderTone: 'border-amber-100',
      statusText: 'At Risk',
      statusColor: 'text-amber-600',
    };
  }
  if (score < 80) {
    return {
      ringColor: '#2563EB',
      badgeBg: 'bg-blue-500',
      badgeIcon: 'text-white',
      panelTone: 'from-blue-50 to-cyan-50',
      borderTone: 'border-blue-100',
      statusText: 'Stable',
      statusColor: 'text-blue-600',
    };
  }
  return {
    ringColor: '#057A55',
    badgeBg: 'bg-emerald-500',
    badgeIcon: 'text-white',
    panelTone: 'from-emerald-50 to-green-50',
    borderTone: 'border-emerald-100',
    statusText: 'Strong',
    statusColor: 'text-emerald-600',
  };
};

// --- Reusable Macro Linear Bar ---
const MacroBar = ({ label, icon: Icon, current, target, colorClass, bgClass, unit }) => {
  const percent = Math.min((current / target) * 100, 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${bgClass}`}>
            <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          <span className="text-sm font-semibold text-gray-800">{label}</span>
        </div>
        <span className="text-sm">
          <strong className="text-gray-900">{current}</strong>
          <span className="text-gray-400 font-medium text-xs ml-1">/ {target}{unit}</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function Dashboard() {
  const router = useRouter();
  const logSectionRef = React.useRef(null);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profile, setProfile] = useState(null);
  const [todayTotals, setTodayTotals] = useState({ meal_count: 0, total_calories: 0, total_protein: 0, total_carbs: 0, total_fats: 0 });
  const [recentMeals, setRecentMeals] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [showTodayMeals, setShowTodayMeals] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState(null);
  const [dailyInsight, setDailyInsight] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [isConfirmingMeal, setIsConfirmingMeal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  // New states for behavioral data
  const [failureInsights, setFailureInsights] = useState([]);
  const [dailyScore, setDailyScore] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [rollingAudit, setRollingAudit] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [isLogging, setIsLogging] = useState(false);
  const scoreAppearance = getScoreAppearance(dailyScore?.score || 0);
  const canRequestCoaching = Number(todayTotals.meal_count || 0) >= 3;

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };
  const [queryError, setQueryError] = useState('');

  const scrollToLog = () => logSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.success) setDailyInsight(data.insight);
    } catch (err) {
      console.error(err);
    }
    setIsGeneratingInsight(false);
  };

  const fetchMealData = async (user, token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const [todayRes, recentRes, todayMealsRes, behaviorRes] = await Promise.all([
        fetch(`${apiUrl}/api/meals/today/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/meals/recent/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/meals/today-meals/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/meals/behavioral-status/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const todayData = await todayRes.json();
      const recentData = await recentRes.json();
      const todayMealsData = await todayMealsRes.json();
      const behaviorData = await behaviorRes.json();

      if (todayData.success) setTodayTotals(todayData.data);
      if (recentData.success) setRecentMeals(recentData.data);
      if (todayMealsData.success) setTodayMeals(todayMealsData.data);
      if (behaviorData.success) {
        setDailyScore(behaviorData.daily_score);
        setFailureInsights(behaviorData.failure_insights);
        setPrediction(behaviorData.prediction);
        setRollingAudit(behaviorData.rolling_audit);
        setPatterns(behaviorData.patterns);
      }
    } catch (err) {
      console.error("Error fetching meal data", err);
    }
  };

  const handleReAnalyze = async () => {
    if (!canRequestCoaching) {
      showToast("Coach Locked", `Log ${3 - Number(todayTotals.meal_count || 0)} more meal${Number(todayTotals.meal_count || 0) === 2 ? '' : 's'} to unlock contextual coaching.`, "error");
      return;
    }

    setIsGeneratingInsight(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/re-analyze/${user.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not generate coaching right now.');
      }
      if (data.success) {
        setCoaching(data.coaching);
        setDailyScore(data.daily_score);
        setPrediction(data.prediction);
        setFailureInsights(data.failure_insights);
        showToast("Analysis Updated!", "Fresh AI coaching generated.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Analysis Failed", "Could not refresh coaching status.", "error");
    }
    setIsGeneratingInsight(false);
  };

  const handleAnalyze = async () => {
    if (!searchQuery) return;

    // Quantity validation — must contain a number OR a size/unit word
    const quantityPattern = /\d|\b(small|medium|large|half|quarter|piece|pieces|bowl|bowls|cup|cups|plate|plates|glass|glasses|roti|rotis|slice|slices|scoop|scoops|handful|katori|serving|servings|tbsp|tsp|tablespoon|teaspoon|gram|grams|gm|g|ml|litre|liter|kg|dozen|pair)\b/i;
    if (!quantityPattern.test(searchQuery)) {
      setQueryError('Please include a quantity — e.g. "2 roti", "100g paneer", or "1 bowl dal"');
      return;
    }
    setQueryError('');
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: searchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setAnalyzedMeal(data.data);
      } else {
        showToast("Analysis Failed", "Could not identify nutrient data for this query.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("System Error", "Analysis engine is currently unreachable.", "error");
    }
    setIsAnalyzing(false);
  };

  const handleConfirmAndLog = async (foodObj = analyzedMeal) => {
    setIsConfirmingMeal(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/analyze-meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: user.id,
          foodName: foodObj.food_name,
          calories: foodObj.calories,
          protein: foodObj.protein,
          carbs: foodObj.carbs,
          fats: foodObj.fats
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setAnalyzedMeal(null);
        setSearchQuery('');
        
        // Populate rich behavioral data
        setDailyScore(data.daily_score);
        setFailureInsights(data.failure_insights);
        setPrediction(data.prediction);
        setCoaching(null);
        
        fetchMealData(user, token);
        showToast("Meal Logged!", data.can_request_coaching ? "You can now unlock contextual coaching." : "Keep logging meals to unlock the coach after 3 meals.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Logging Failed", "Could not save meal with intelligence.", "error");
    } finally {
      setIsConfirmingMeal(false);
    }
  };

  const getCalorieStatus = () => {
    if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender || !profile.target_calories) return null;

    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height);
    const age = Math.max(1, parseFloat(profile.age));
    const isMale = profile.gender === 'Male';

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = isMale ? bmr + 5 : bmr - 161;

    let multiplier = 1.2;
    switch (profile.activity_level) {
      case 'No activity': multiplier = 1.2; break;
      case 'Very little exercise': multiplier = 1.375; break;
      case 'Moderate exercise': multiplier = 1.55; break;
      case 'Intensive exercise': multiplier = 1.725; break;
      default: multiplier = 1.2; break;
    }

    const tdee = Math.round(bmr * multiplier);
    const target = parseFloat(profile.target_calories);
    const percent = Math.round((target / tdee) * 100);
    const diff = target - tdee;

    let type = "MAINTENANCE";
    let bgBase = "bg-[#F8FAFC]";
    let borderColor = "border-gray-100";
    let iconClass = "text-emerald-500 bg-white border border-gray-100 shadow-sm";
    let percentColor = "text-emerald-600";

    if (diff <= -50) {
      type = "CALORIE DEFICIT";
      bgBase = "bg-blue-50/50";
      borderColor = "border-blue-100/50";
      iconClass = "text-blue-500 bg-white border border-blue-100 shadow-[0_2px_10px_rgb(59,130,246,0.08)]";
      percentColor = "text-blue-600";
    } else if (diff >= 50) {
      type = "CALORIE SURPLUS";
      bgBase = "bg-orange-50/50";
      borderColor = "border-orange-100/50";
      iconClass = "text-orange-500 bg-white border border-orange-100 shadow-[0_2px_10px_rgb(249,115,22,0.08)]";
      percentColor = "text-orange-600";
    }

    return { tdee, percent, type, bgBase, borderColor, iconClass, percentColor };
  };

  const calStatus = getCalorieStatus();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/');
    } else {
      setIsAuthorized(true);
      try {
        const user = JSON.parse(userStr);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setProfile(data);
            fetchMealData(user, token);
          })
          .catch(err => console.error("Error fetching profile", err));
      } catch (err) {
        console.error("Invalid user JSON");
      }
    }
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-gray-900 pt-28 pb-20 selection:bg-[#057A55]/10 selection:text-[#057A55] relative">

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-[40vw] h-[40vw] bg-emerald-50/60 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2" />

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Today's Overview
              </h1>
              {todayTotals.streak > 0 && (
                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full text-orange-600 shadow-sm shadow-orange-500/10 mb-1">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[13px] tracking-wide">{todayTotals.streak} Day Streak</span>
                </div>
              )}
            </motion.div>
            <motion.p variants={fadeInUp} className="text-gray-500 font-medium mt-1.5 text-[15px]">
              Here is your daily fuel status and insights.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <button onClick={scrollToLog} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Log a Meal
            </button>
          </motion.div>
        </motion.div>

        {/* Dashboard Grid - Primary Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Card 1: Calories Fuel Gauge */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute top-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
              <h2 className="text-[15px] font-semibold text-gray-800">Energy Status</h2>
              <Flame className="w-5 h-5 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="mt-8 mb-2">
              {(() => {
                const consumed = Number(todayTotals.total_calories || 0);
                const target = profile?.target_calories || 2200;
                const isOver = consumed > target;
                return (
                  <CircularProgress
                    value={consumed}
                    max={target}
                    color={isOver ? "#EF4444" : "#057A55"}
                    size={220}
                    strokeWidth={16}
                    label={isOver ? "kcal over limit" : "kcal remaining"}
                    subLabel={`Total Limit: ${target}`}
                  />
                );
              })()}
            </div>

            {/* Clean AI Target Box */}
            {calStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`mt-7 w-full flex items-center justify-between px-5 py-4 rounded-2xl border ${calStatus.borderColor} ${calStatus.bgBase} transition-all hover:bg-white`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-[12px] ${calStatus.iconClass}`}>
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-[10px] font-bold text-gray-500 tracking-widest mb-1">{calStatus.type}</h3>
                    <p className="text-[13px] text-gray-600 font-medium leading-none">
                      <span className={`font-bold ${calStatus.percentColor}`}>{calStatus.percent}%</span> of {calStatus.tdee} kcal
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Card 2: Macros Split */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col relative"
          >
            <h2 className="text-[15px] font-semibold text-gray-800 mb-8 flex items-center gap-2">
              Macro Targets
              <div className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                On Track
              </div>
            </h2>

            <div className="flex flex-col gap-7 mt-2">
              <MacroBar
                label="Protein"
                icon={Wheat}
                current={Number(todayTotals.total_protein || 0)}
                target={profile?.target_protein || 80}
                unit="g"
                colorClass="bg-[#2563EB]"
                bgClass="bg-blue-50"
              />
              <MacroBar
                label="Carbs"
                icon={TrendingUp}
                current={Number(todayTotals.total_carbs || 0)}
                target={profile?.target_carbs || 220}
                unit="g"
                colorClass="bg-[#D97706]"
                bgClass="bg-amber-50"
              />
              <MacroBar
                label="Fats"
                icon={Droplet}
                current={Number(todayTotals.total_fats || 0)}
                target={profile?.target_fats || 65}
                unit="g"
                colorClass="bg-[#057A55]"
                bgClass="bg-emerald-50"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Card 3: Contextual AI Coaching (Full Width Row) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className={`mt-6 rounded-3xl p-8 relative overflow-hidden transition-all duration-700 ${canRequestCoaching
              ? "bg-linear-to-br from-[#064E3B] to-[#042F2E] shadow-[0_12px_40px_-10px_rgba(4,47,46,0.3)]"
              : "bg-gray-50 border border-gray-100"
            }`}
        >
          {/* Background Decor */}
          {canRequestCoaching && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669] rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
          )}

          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 ${canRequestCoaching
                ? "bg-white/10 backdrop-blur-md border border-white/10"
                : "bg-white border border-gray-200"
              }`}>
              <Sparkles className={`w-3.5 h-3.5 ${canRequestCoaching ? "text-[#34D399]" : "text-gray-400"}`} />
              <span className={`text-[12px] font-semibold tracking-wide uppercase ${canRequestCoaching ? "text-[#A7F3D0]" : "text-gray-500"}`}>
                Contextual Coach
              </span>
            </div>

            {!coaching ? (
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-gray-500 leading-relaxed mt-2">
                  {!canRequestCoaching
                    ? `Log ${Math.max(0, 3 - Number(todayTotals.meal_count || 0))} more meal${Math.max(0, 3 - Number(todayTotals.meal_count || 0)) === 1 ? '' : 's'} to unlock the coach.`
                    : "Coach is unlocked. Click the button below to generate AI insights."}
                </h3>

                <div className={`rounded-3xl p-4 space-y-3 ${canRequestCoaching ? "border border-white/10 bg-black/10" : "border border-gray-200 bg-white"}`}>
                  <button
                    onClick={() => scrollToLog()}
                    className={`w-full font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg flex items-center justify-center gap-2 ${canRequestCoaching ? "bg-white text-[#064E3B] hover:bg-gray-100" : "bg-[#057A55] text-white hover:bg-[#046C4E]"}`}
                  >
                    <Plus className="w-4 h-4" />
                    Log Next Meal
                  </button>

                  <button
                    onClick={handleReAnalyze}
                    disabled={isGeneratingInsight || !canRequestCoaching}
                    className={`w-full font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 ${
                      canRequestCoaching
                        ? "bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50 disabled:border-white/10 backdrop-blur-md border border-white/20 text-white"
                        : "bg-gray-100 text-gray-500 border border-gray-200 disabled:opacity-100"
                    }`}
                  >
                    <Activity className={`w-4 h-4 ${isGeneratingInsight ? 'animate-spin' : ''}`} />
                    {isGeneratingInsight ? "Analyzing..." : "Generate AI Insights"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-7 space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <p className="text-[10px] font-bold text-[#34D399] uppercase tracking-widest">Status Judgment</p>
                      {coaching.judgment && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          coaching.judgment === 'bad'
                            ? 'bg-red-500/20 text-red-200'
                            : coaching.judgment === 'okay'
                              ? 'bg-amber-500/20 text-amber-100'
                              : 'bg-emerald-500/20 text-emerald-100'
                        }`}>
                          {coaching.judgment}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[18px] md:text-[22px] font-semibold text-white leading-[1.15] tracking-tight max-w-2xl">
                      {coaching.why}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                      <p className="text-[10px] font-bold text-[#34D399] uppercase tracking-widest mb-2">Smart Fix</p>
                      <p className="text-[15px] text-white font-medium leading-6">
                        {coaching.smart_meal_completion}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[10px] font-bold text-[#A7F3D0] uppercase tracking-widest mb-2">Immediate Fix</p>
                      <p className="text-[15px] text-white/90 font-medium leading-6">
                        {coaching.immediate_fix || "Keep the next meal aligned with your target and protein needs."}
                      </p>
                    </div>
                  </div>

                  {coaching.warning && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                      <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mb-2">Warning</p>
                      <p className="text-[14px] text-white/90 font-medium leading-6">{coaching.warning}</p>
                    </div>
                  )}
                </div>

                <div className="xl:col-span-5 space-y-4">
                  {prediction && (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-sm p-5">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">EOD Prediction</p>
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          prediction.risk_level === 'danger' ? 'bg-red-500/20 text-red-300' :
                          prediction.risk_level === 'warning' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {prediction.risk_level} risk
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Projected Calories</p>
                          <p className="text-4xl font-bold text-white tracking-tight">
                            {prediction.projected_calories}
                            <span className="ml-2 text-sm font-medium text-gray-400">kcal</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="rounded-2xl bg-black/10 border border-white/5 p-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Protein</p>
                            <p className="text-lg font-semibold text-white">{prediction.projected_protein}g</p>
                          </div>
                          <div className="rounded-2xl bg-black/10 border border-white/5 p-3">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Coach Mode</p>
                            <p className="text-lg font-semibold text-white capitalize">{prediction.risk_level}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-white/10 bg-black/10 p-4 space-y-3">
                    <button
                      onClick={() => scrollToLog()}
                      className="w-full bg-white text-[#064E3B] hover:bg-gray-100 font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Log Next Meal
                    </button>

                    <button
                      onClick={handleReAnalyze}
                      disabled={isGeneratingInsight || !canRequestCoaching}
                      className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50 disabled:border-white/10 backdrop-blur-md border border-white/20 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                      <Activity className={`w-4 h-4 ${isGeneratingInsight ? 'animate-spin' : ''}`} />
                      {isGeneratingInsight ? "Analyzing..." : (coaching ? "Refresh AI Insights" : "Generate AI Insights")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Behavioral Performance Section */}
        {(dailyScore || (failureInsights && failureInsights.length > 0)) && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-8 space-y-6"
          >
            {/* Mistake Streaks Row */}
            {patterns?.mistake_streaks && Object.values(patterns.mistake_streaks).some(v => v > 0) && (
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                {Object.entries(patterns.mistake_streaks).map(([key, value]) => value > 0 && (
                  <div key={key} className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-2xl shadow-sm">
                    <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-700 uppercase tracking-tight">
                      {key.replace(/_/g, ' ')} Streak: <span className="text-sm">{value} Days</span>
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Score Component */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <CircularProgress 
                    value={dailyScore?.score || 0} 
                    max={100} 
                    color={scoreAppearance.ringColor} 
                    size={140} 
                    strokeWidth={12}
                    label="Score"
                    subLabel="Consistency" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Daily Performance</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Your score is based on macro precision and protein density.</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Protein</p>
                        <p className="text-sm font-bold text-[#2563EB]">{dailyScore?.protein_score || 0}%</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Calories</p>
                        <p className="text-sm font-bold text-[#D97706]">{dailyScore?.calorie_score || 0}%</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Quality</p>
                        <p className="text-sm font-bold text-[#057A55]">{dailyScore?.quality_score || 0}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3-Day Rolling Audit Component */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">3-Day Rolling Audit</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Historical Drift Analysis</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                    Live Feedback
                  </div>
                </div>
                
                {rollingAudit?.fast_feedback ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Avg Calories</p>
                        <p className="text-xl font-bold text-gray-900">{rollingAudit.fast_feedback.avg_calories}</p>
                        <p className={`text-[11px] font-bold mt-1 ${rollingAudit.fast_feedback.calorie_gap > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {rollingAudit.fast_feedback.calorie_gap > 0 ? '+' : ''}{rollingAudit.fast_feedback.calorie_gap} from goal
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Avg Protein</p>
                        <p className="text-xl font-bold text-gray-900">{rollingAudit.fast_feedback.avg_protein}g</p>
                        <p className={`text-[11px] font-bold mt-1 ${rollingAudit.fast_feedback.protein_gap < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {rollingAudit.fast_feedback.protein_gap > 0 ? '+' : ''}{rollingAudit.fast_feedback.protein_gap}g from goal
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                      rollingAudit.fast_feedback.trend === 'over_target' 
                        ? 'bg-red-50 border-red-100 text-red-800' 
                        : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    }`}>
                      <Info className="w-5 h-5 opacity-70" />
                      <p className="text-sm font-semibold">
                        {rollingAudit.fast_feedback.trend === 'over_target' 
                          ? "You are trending above your calorie budget. Tighten portions."
                          : "Your recent energy balance is stable. Keep hitting protein targets."}
                      </p>
                    </div>
                  </div>
                ) : (
                   <p className="text-sm text-gray-400 font-medium text-center py-8">Gathering historical data for your 3-day audit...</p>
                )}
              </motion.div>

              {/* Failure Insights Component */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" /> Behavioral Failure Insights
                </h3>
                <div className="space-y-4">
                  {failureInsights && failureInsights.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {failureInsights.map((insight, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-semibold text-gray-700">{insight.issue}</span>
                            <span className="font-bold text-gray-400">{insight.percentage_contribution}% Contribution</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${insight.percentage_contribution}%` }}
                                className="h-full bg-red-500/80 rounded-full"
                             />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-100 mb-2" />
                      <p className="text-sm text-gray-400 font-medium tracking-tight">No significant patterns of failure detected today. Keep going!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- Tab 2: The Log Zone --- */}
        <motion.div
          ref={logSectionRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-16 scroll-mt-24"
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Food Log & Library</h2>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
            {/* Quick Add Search Bar */}
            <motion.div variants={fadeInUp} className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-100 text-gray-900 text-[15px] rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#057A55]/20 focus:border-[#057A55] outline-none transition-all placeholder:text-gray-400"
                placeholder="e.g. 2 roti and dal, 100g paneer, 1 bowl rice..."
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !searchQuery}
                className="absolute inset-y-2 right-2 bg-[#057A55] disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#046C4E] text-white px-5 rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze & Add"}
              </button>
            </motion.div>

            {/* Kitchen Converter Link */}
            <motion.div variants={fadeInUp} className="flex justify-end -mt-3 mb-6 relative z-10 w-full pr-2">
              <a href="/converter" className="text-[13px] font-medium text-[#057A55] hover:text-[#046C4E] hover:underline flex items-center gap-1 transition-colors">
                <Scale className="w-4 h-4" />
                Don't have a weighing scale? No worries, click here!
              </a>
            </motion.div>

            {/* Quantity hint */}
            {queryError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                <p className="text-[13px] font-medium">{queryError}</p>
              </motion.div>
            )}

            {/* AI Details Review Prompt (Populates when analyzed) */}
            {analyzedMeal && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                className="mb-10 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{analyzedMeal.food_name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 font-medium">
                      <span><strong className="text-gray-900">{analyzedMeal.calories}</strong> kcal</span>
                      <span><strong className="text-gray-900">{analyzedMeal.protein}g</strong> Protein</span>
                      <span><strong className="text-gray-900">{analyzedMeal.carbs}g</strong> Carbs</span>
                      <span><strong className="text-gray-900">{analyzedMeal.fats}g</strong> Fats</span>
                    </div>
                  </div>
                  <button
                    disabled={isConfirmingMeal}
                    onClick={() => handleConfirmAndLog()}
                    className="bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm flex items-center gap-2 transition-all"
                  >
                    {isConfirmingMeal ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isConfirmingMeal ? "Logging..." : "Confirm This Meal"}
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1"><Scale className="w-3.5 h-3.5" /> Indian Measurements</p>
                    <p className="text-sm text-gray-700 font-medium">{analyzedMeal.household_measurement || "Standard portion"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1"><Droplet className="w-3.5 h-3.5" /> Bioavailability</p>
                    <p className="text-sm text-gray-700">{analyzedMeal.bioavailability || "Standard metric."}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Tip</p>
                    <p className="text-sm text-gray-700">{analyzedMeal.suggestion || "Looks good!"}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Today's Meals Section */}
            <motion.div variants={fadeInUp} className={`mb-8 ${analyzedMeal ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" /> Today's Meals
                </h3>
                <button
                  onClick={() => setShowTodayMeals(!showTodayMeals)}
                  className="bg-[#057A55] hover:bg-[#046C4E] text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  {showTodayMeals ? "Hide Today's Meals" : "View Today's Meals"}
                </button>
              </div>
              {showTodayMeals && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayMeals.length > 0 ? todayMeals.map((meal, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[15px] font-semibold text-gray-900">{meal.food_name}</h4>
                          <p className="text-[13px] text-gray-500 mt-0.5">
                            {meal.calories} kcal • {meal.protein}g Protein • {meal.carbs}g Carbs • {meal.fats}g Fats
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 py-8 text-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-100 rounded-2xl">
                      No meals logged today yet. Start logging!
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Favorites / Recent Section */}
            <motion.div variants={fadeInUp} className={analyzedMeal ? "opacity-50 pointer-events-none" : ""}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Recently Logged
                </h3>
              </div>

              {/* List of Previous Meals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentMeals.length > 0 ? recentMeals.map((meal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <Wheat className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-gray-900">{meal.food_name}</h4>
                        <p className="text-[13px] text-gray-500 mt-0.5">{meal.calories} kcal • {meal.protein}g Protein</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmAndLog(meal)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )) : (
                  <div className="col-span-2 py-8 text-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-100 rounded-2xl">
                    No recent meals found. Start logging!
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
    </div>
  );
}
