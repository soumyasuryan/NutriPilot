'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Droplet, Wheat, Info, Sparkles, TrendingUp, Plus, Search, Clock, ChevronRight } from 'lucide-react';

// --- Reusable SVG Circular Progress Ring ---
const CircularProgress = ({ value, max, color, size = 200, strokeWidth = 14, label, subLabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = value / max;
  const strokeDashoffset = circumference - progress * circumference;

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
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Inner Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{max - value}</span>
        <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
        {subLabel && <span className="text-[11px] text-gray-400 font-medium">{subLabel}</span>}
      </div>
    </div>
  );
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState(null);
  const [dailyInsight, setDailyInsight] = useState(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const scrollToLog = () => logSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  const generateInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/meals/insight', {
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
      const [todayRes, recentRes] = await Promise.all([
        fetch(`http://localhost:5000/api/meals/today/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/meals/recent/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const todayData = await todayRes.json();
      const recentData = await recentRes.json();
      if (todayData.success) setTodayTotals(todayData.data);
      if (recentData.success) setRecentMeals(recentData.data);
    } catch (err) {
      console.error("Error fetching meal data", err);
    }
  };

  const handleAnalyze = async () => {
    if (!searchQuery) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:5000/api/meals/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: searchQuery })
      });
      const data = await res.json();
      if (data.success) setAnalyzedMeal(data.data);
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  const handleConfirmAndLog = async (foodObj = analyzedMeal) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/meals/log', {
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
      setAnalyzedMeal(null);
      setSearchQuery('');
      fetchMealData(user, token);
    } catch (err) {
      console.error(err);
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
        fetch(`http://localhost:5000/api/users/${user.id}`, {
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
             <motion.h1 variants={fadeInUp} className="text-3xl font-semibold text-gray-900 tracking-tight">
               Today's Overview
             </motion.h1>
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

        {/* Dashboard Grid */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
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
              <CircularProgress 
                value={Number(todayTotals.total_calories || 0)} 
                max={profile?.target_calories || 2200} 
                color="#057A55" 
                size={220} 
                strokeWidth={16} 
                label="kcal remaining"
                subLabel={`Total Limit: ${profile?.target_calories || 2200}`}
              />
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
                    <h3 className="text-[10px] font-bold text-gray-500 tracking-[0.1em] mb-1">{calStatus.type}</h3>
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
                  colorClass="bg-[#2563EB]" // Blue
                  bgClass="bg-blue-50"
                />
                <MacroBar 
                  label="Carbs" 
                  icon={TrendingUp} 
                  current={Number(todayTotals.total_carbs || 0)} 
                  target={profile?.target_carbs || 220} 
                  unit="g"
                  colorClass="bg-[#D97706]" // Amber/Orange
                  bgClass="bg-amber-50"
                />
                <MacroBar 
                  label="Fats" 
                  icon={Droplet} 
                  current={Number(todayTotals.total_fats || 0)} 
                  target={profile?.target_fats || 65} 
                  unit="g"
                  colorClass="bg-[#057A55]" // Emerald
                  bgClass="bg-emerald-50"
                />
             </div>
          </motion.div>

          {/* Card 3: AI Insight (Glassmorphism + Glow or Locked) */}
          <motion.div 
            variants={fadeInUp} 
            className={`rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between transition-all duration-700 ${
              todayTotals.meal_count >= 3 
                ? "bg-gradient-to-br from-[#064E3B] to-[#042F2E] shadow-[0_12px_40px_-10px_rgba(4,47,46,0.3)]" 
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {/* Background Decor */}
            {todayTotals.meal_count >= 3 && (
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#059669] rounded-full blur-[60px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
            )}
            
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 ${
                todayTotals.meal_count >= 3 
                  ? "bg-white/10 backdrop-blur-md border border-white/10" 
                  : "bg-white border border-gray-200"
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${todayTotals.meal_count >= 3 ? "text-[#34D399]" : "text-gray-400"}`} />
                <span className={`text-[12px] font-semibold tracking-wide uppercase ${todayTotals.meal_count >= 3 ? "text-[#A7F3D0]" : "text-gray-500"}`}>
                  AI Insight
                </span>
              </div>
              
              {todayTotals.meal_count < 3 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-500 leading-relaxed mt-2">
                    Log <span className="font-bold text-gray-800">{3 - todayTotals.meal_count} more meals</span> today to unlock your personalized coach.
                  </h3>
                </>
              ) : dailyInsight ? (
                <>
                  <h3 className="text-xl font-medium text-white leading-relaxed z-10 relative mt-2 shrink-0">
                    "{dailyInsight}"
                  </h3>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium text-white leading-relaxed z-10 relative mt-2 opacity-90">
                    You've logged {todayTotals.meal_count} meals. Your personalized daily analysis is ready.
                  </h3>
                </>
              )}
            </div>
            
            <div className="mt-8 z-10 relative">
              {todayTotals.meal_count < 3 ? (
                <div className="w-full bg-gray-100/50 text-gray-400 font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200/50">
                  <Clock className="w-4 h-4"/>
                  Awaiting Data...
                </div>
              ) : !dailyInsight ? (
                <button 
                  onClick={generateInsight}
                  disabled={isGeneratingInsight}
                  className="w-full bg-white text-[#064E3B] hover:bg-gray-100 font-bold py-3 rounded-xl transition-all text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  {isGeneratingInsight ? "Analyzing Day..." : "Generate Coaching Insight"}
                </button>
              ) : (
                <button 
                  onClick={() => scrollToLog()}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4"/>
                  Add Recommended Item
                </button>
              )}
            </div>
          </motion.div>

        </motion.div>

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
                    placeholder="Search meals, ingredients, or describe what you ate (e.g., '2 Roti and Dal')..." 
                 />
                 <button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || !searchQuery}
                    className="absolute inset-y-2 right-2 bg-[#057A55] disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#046C4E] text-white px-5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                 >
                    {isAnalyzing ? "Analyzing..." : "Analyze & Add"}
                 </button>
              </motion.div>

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
                        onClick={() => handleConfirmAndLog()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm"
                     >
                       Confirm This Meal
                     </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-emerald-100/50">
                       <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Protein Bioavailability</p>
                       <p className="text-sm text-gray-700">{analyzedMeal.bioavailability || "Standard metric."}</p>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-emerald-100/50">
                       <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">AI Suggestion</p>
                       <p className="text-sm text-gray-700">{analyzedMeal.suggestion || "Looks good!"}</p>
                     </div>
                  </div>
                </motion.div>
              )}

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
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors flex-shrink-0"
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
    </div>
  );
}
