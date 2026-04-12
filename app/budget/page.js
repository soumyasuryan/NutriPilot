'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Search, Sparkles, ChevronRight, Zap, Beef, Wheat, Droplets, ArrowRight, RotateCcw, TrendingDown } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const PREMIUM_FOODS = [
  { name: "Whey Protein Shake (100g)", cals: 400, protein: 80, carbs: 10, fats: 5 },
  { name: "Salmon Fillet (200g)", cals: 416, protein: 46, carbs: 0, fats: 24 },
  { name: "Greek Yogurt (200g)", cals: 130, protein: 18, carbs: 8, fats: 2 },
  { name: "Avocado Toast with Eggs", cals: 520, protein: 22, carbs: 38, fats: 31 },
  { name: "Quinoa Bowl (250g)", cals: 380, protein: 14, carbs: 65, fats: 7 },
  { name: "Peanut Butter (2 tbsp)", cals: 190, protein: 8, carbs: 6, fats: 16 },
  { name: "Almonds (50g)", cals: 290, protein: 11, carbs: 10, fats: 25 },
  { name: "Chicken Breast (200g)", cals: 330, protein: 62, carbs: 0, fats: 7 },
  { name: "Paneer (100g)", cals: 265, protein: 18, carbs: 4, fats: 21 },
  { name: "Oats (100g)", cals: 389, protein: 17, carbs: 66, fats: 7 },
  { name: "Tofu (200g)", cals: 144, protein: 17, carbs: 3, fats: 8 },
  { name: "Banana Protein Smoothie", cals: 350, protein: 25, carbs: 50, fats: 5 },
];

const MacroPill = ({ icon: Icon, label, value, colorClass }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${colorClass}`}>
    <Icon className="w-3 h-3" />
    {value}g {label}
  </div>
);

const MacroCompare = ({ label, original, alternative, unit = 'g' }) => {
  const diff = alternative - original;
  const absDiff = Math.abs(diff);
  const isClose = absDiff <= Math.max(original * 0.25, 5);
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-gray-400 font-semibold w-16">{label}</span>
      <span className="font-semibold text-gray-600">{original}{unit}</span>
      <ArrowRight className="w-3 h-3 text-gray-300 mx-1 shrink-0" />
      <span className={`font-bold ${isClose ? 'text-emerald-600' : 'text-amber-600'}`}>{alternative}{unit}</span>
      <span className={`ml-auto pl-2 text-[11px] font-bold ${diff > 0 ? 'text-amber-500' : diff < 0 ? 'text-blue-500' : 'text-emerald-500'}`}>
        {diff > 0 ? `+${diff}` : diff === 0 ? '=' : diff}{unit === ' kcal' ? ' kcal' : unit}
      </span>
    </div>
  );
};

export default function BudgetOptimizer() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [customFood, setCustomFood] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('select');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setIsAuthorized(true);
  }, [router]);

  const filteredFoods = PREMIUM_FOODS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptimize = async () => {
    const token = localStorage.getItem('token');
    const foodToOptimize = mode === 'custom' ? customFood : selectedFood?.name;
    const macros = mode === 'select' ? selectedFood : null;

    if (!foodToOptimize) {
      setError(mode === 'custom' ? 'Please enter a food name.' : 'Please select a food first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const body = macros
        ? { foodName: foodToOptimize, macros: { calories: macros.cals, protein: macros.protein, carbs: macros.carbs, fats: macros.fats } }
        : { foodName: foodToOptimize };

      const res = await fetch('http://localhost:5000/api/budget/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not reach the server. Make sure it is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFood(null);
    setCustomFood('');
    setError('');
    setSearchQuery('');
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-gray-900 pt-32 pb-24 relative selection:bg-emerald-500/10 selection:text-emerald-700">
      {/* Background glows — matches home page */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-emerald-50/60 rounded-full blur-[130px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-50/30 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <PiggyBank className="w-3.5 h-3.5" /> Budget Optimizer
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
            Eat Smart. <span className="text-emerald-600">Spend Less.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 font-medium mt-3 text-[16px] max-w-xl leading-relaxed">
            Select a premium food you consume regularly, and our AI will suggest cheaper alternatives with the same macro profile — so you never sacrifice your gains.
          </motion.p>
        </motion.div>

        <div className={`grid gap-8 items-start ${result ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>

          {/* ── Left Panel ── */}
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="selector" initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} variants={staggerContainer}>

                {/* Mode Toggle */}
                <motion.div variants={fadeInUp} className="flex bg-gray-100 p-1 rounded-2xl mb-6 gap-1">
                  {['select', 'custom'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {m === 'select' ? 'Choose from List' : 'Type Your Own'}
                    </button>
                  ))}
                </motion.div>

                {mode === 'select' ? (
                  <>
                    {/* Search */}
                    <motion.div variants={fadeInUp} className="relative mb-4">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search premium foods..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition-all placeholder:text-gray-400"
                      />
                    </motion.div>

                    {/* Food Grid */}
                    <motion.div variants={fadeInUp} className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                      {filteredFoods.map((food) => (
                        <button
                          key={food.name}
                          onClick={() => setSelectedFood(food)}
                          className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            selectedFood?.name === food.name
                              ? 'bg-emerald-50/80 border-emerald-300 shadow-sm shadow-emerald-100'
                              : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className={`text-[13px] font-semibold mb-1.5 truncate ${selectedFood?.name === food.name ? 'text-emerald-800' : 'text-gray-800'}`}>
                                {food.name}
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                <MacroPill icon={Zap} label="kcal" value={food.cals} colorClass="bg-orange-50 text-orange-600" />
                                <MacroPill icon={Beef} label="P" value={food.protein} colorClass="bg-blue-50 text-blue-600" />
                                <MacroPill icon={Wheat} label="C" value={food.carbs} colorClass="bg-amber-50 text-amber-600" />
                                <MacroPill icon={Droplets} label="F" value={food.fats} colorClass="bg-emerald-50 text-emerald-600" />
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              selectedFood?.name === food.name ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 group-hover:border-emerald-300'
                            }`}>
                              {selectedFood?.name === food.name && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={fadeInUp} className="bg-white border border-gray-100 rounded-3xl p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enter any food item</label>
                    <input
                      type="text"
                      placeholder="e.g. Protein Bar, Açaí Bowl, Chia Pudding..."
                      value={customFood}
                      onChange={e => setCustomFood(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleOptimize()}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition-all placeholder:text-gray-400 mb-2"
                    />
                    <p className="text-[12px] text-gray-400 font-medium">
                      Our AI will auto-detect its macros and suggest cheaper swaps.
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm font-medium text-red-500 px-1">
                    {error}
                  </motion.p>
                )}

                {/* CTA */}
                <motion.button
                  variants={fadeInUp}
                  onClick={handleOptimize}
                  disabled={isLoading}
                  className="mt-6 w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white rounded-2xl font-semibold text-[15px] shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-[#15803d] hover:to-[#16a34a] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Finding Budget Alternatives...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Find Budget Alternatives
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              /* After result — show original food summary on left */
              <motion.div key="reset-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Original Food</h3>
                    <p className="text-[15px] font-bold text-gray-900 truncate">{result.original_food}</p>
                  </div>
                </div>

                {result.original_price_estimate && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">Current Cost</span>
                    <span className="text-[14px] font-bold text-red-600">{result.original_price_estimate}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 mb-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Original Macros</p>
                  <div className="flex flex-wrap gap-1.5">
                    <MacroPill icon={Zap} label="kcal" value={result.original_macros?.calories} colorClass="bg-orange-50 text-orange-600" />
                    <MacroPill icon={Beef} label="Protein" value={result.original_macros?.protein} colorClass="bg-blue-50 text-blue-600" />
                    <MacroPill icon={Wheat} label="Carbs" value={result.original_macros?.carbs} colorClass="bg-amber-50 text-amber-600" />
                    <MacroPill icon={Droplets} label="Fats" value={result.original_macros?.fats} colorClass="bg-emerald-50 text-emerald-600" />
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Try Another Food
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Right Panel — Results ── */}
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!result && !isLoading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[340px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                    <PiggyBank className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-800 mb-2">Alternatives Will Appear Here</h3>
                  <p className="text-sm text-gray-400 font-medium max-w-64">
                    Select a premium food and hit "Find Budget Alternatives" to get started.
                  </p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white border border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[340px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 animate-pulse">
                    <Sparkles className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-800 mb-2">AI is Crunching Numbers...</h3>
                  <p className="text-sm text-gray-400 font-medium">Analyzing macro profiles and market pricing</p>
                </motion.div>
              )}

              {result && (
                <motion.div key="results" initial="hidden" animate="visible" variants={staggerContainer} className="w-full">
                  <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h2 className="text-[16px] font-bold text-gray-900">3 Budget-Friendly Swaps</h2>
                    <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">AI Generated</span>
                  </motion.div>

                  {/* Horizontal 3-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.alternatives?.map((alt, idx) => (
                      <motion.div
                        key={idx}
                        variants={fadeInUp}
                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgb(0,0,0,0.06)] transition-shadow flex flex-col"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="min-w-0">
                            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mb-1.5">
                              Option {idx + 1}
                            </span>
                            <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{alt.food_name}</h3>
                          </div>
                          {alt.savings_percent != null && (
                            <div className="shrink-0">
                              <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-[12px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-sm shadow-emerald-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                                {alt.savings_percent}% cheaper
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Monthly Savings */}
                        {alt.monthly_savings && (
                          <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl px-3.5 py-3 mb-4">
                            <PiggyBank className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Monthly Savings</div>
                              <div className="text-[13px] font-bold text-emerald-800 leading-snug">{alt.monthly_savings}</div>
                            </div>
                          </div>
                        )}

                        {/* Macro Comparison */}
                        <div className="bg-gray-50 rounded-2xl p-3.5 mb-4 flex flex-col gap-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Macro Comparison</p>
                          <MacroCompare label="Calories" original={result.original_macros?.calories} alternative={alt.calories} unit=" kcal" />
                          <MacroCompare label="Protein" original={result.original_macros?.protein} alternative={alt.protein} />
                          <MacroCompare label="Carbs" original={result.original_macros?.carbs} alternative={alt.carbs} />
                          <MacroCompare label="Fats" original={result.original_macros?.fats} alternative={alt.fats} />
                        </div>

                        {/* Why */}
                        <div className="mt-auto flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                          <span className="text-emerald-500 mt-0.5 shrink-0 font-bold text-sm">✓</span>
                          <p className="text-[11px] font-medium text-gray-600 leading-relaxed">{alt.why}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
