'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Search, Sparkles, ChevronRight, Zap, Beef, Wheat, Droplets, ArrowRight, RotateCcw, TrendingDown, Loader2 } from 'lucide-react';

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
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-slate-500 font-bold w-16">{label}</span>
      <span className="font-bold text-slate-300">{original}{unit}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-700 mx-1 shrink-0" />
      <span className={`font-bold ${isClose ? 'text-emerald-400' : 'text-amber-400'}`}>{alternative}{unit}</span>
      <span className={`ml-auto pl-2 text-[11px] font-bold ${diff > 0 ? 'text-amber-500' : diff < 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
        {diff > 0 ? `+${diff}` : diff === 0 ? '=' : diff}{unit === ' kcal' ? '' : unit}
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/budget/optimize`, {
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
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-24 relative selection:bg-emerald-500/10 selection:text-emerald-400">
      {/* Background glows — matches home page */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <PiggyBank className="w-3.5 h-3.5" /> Budget Optimizer
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-4">
            Eat Smart. <span className="text-emerald-500">Spend Less.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-400 font-medium text-[16px] max-w-xl leading-relaxed">
            Personalized AI audit of premium food expenditures. Discover cost-optimized alternatives without compromising on metabolic profile.
          </motion.p>
        </motion.div>

        <div className={`grid gap-8 items-start ${result ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>

          {/* ── Left Panel ── */}
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="selector" initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} variants={staggerContainer}>

                {/* Mode Toggle */}
                <motion.div variants={fadeInUp} className="flex bg-white/5 p-1 rounded-2xl mb-6 gap-1 border border-white/5">
                  {['select', 'custom'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${mode === m ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {m === 'select' ? 'Choose from List' : 'Type Your Own'}
                    </button>
                  ))}
                </motion.div>

                {mode === 'select' ? (
                  <>
                    {/* Search */}
                    <motion.div variants={fadeInUp} className="relative mb-4">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search premium database..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[14px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                      />
                    </motion.div>

                    {/* Food Grid */}
                    <motion.div variants={fadeInUp} className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                      {filteredFoods.map((food) => (
                        <button
                          key={food.name}
                          onClick={() => setSelectedFood(food)}
                          className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${selectedFood?.name === food.name
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
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${selectedFood?.name === food.name ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 group-hover:border-emerald-300'
                              }`}>
                              {selectedFood?.name === food.name && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={fadeInUp} className="glass-card rounded-[32px] p-8">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Identify Food Item</label>
                    <input
                      type="text"
                      placeholder="e.g. Protein Bar, Açaí Bowl, Chia Pudding..."
                      value={customFood}
                      onChange={e => setCustomFood(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleOptimize()}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600 mb-4"
                    />
                    <p className="text-[12px] text-slate-500 font-bold tracking-tight">
                      Neural engine will auto-detect metabolic density and compute cheaper alternatives.
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm font-medium text-red-500 px-1">
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={fadeInUp}
                  onClick={handleOptimize}
                  disabled={isLoading}
                  className="mt-6 w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-[20px] font-bold text-[15px] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6" />
                      Initializing Neural Audit...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Find Budget Alternatives
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="reset-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[32px] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Original Profile</h3>
                    <p className="text-[18px] font-bold text-white truncate leading-tight">{result.original_food}</p>
                  </div>
                </div>

                {result.original_price_estimate && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-[20px] px-5 py-4 mb-6 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Current Cost</span>
                    <span className="text-[16px] font-bold text-rose-400">{result.original_price_estimate}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3 bg-white/5 rounded-[24px] p-6 mb-8 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Baseline Macros</p>
                  <div className="flex flex-wrap gap-2">
                    <MacroPill icon={Zap} label="kcal" value={result.original_macros?.calories} colorClass="bg-orange-500/10 text-orange-400" />
                    <MacroPill icon={Beef} label="P" value={result.original_macros?.protein} colorClass="bg-blue-500/10 text-blue-400" />
                    <MacroPill icon={Wheat} label="C" value={result.original_macros?.carbs} colorClass="bg-amber-500/10 text-amber-400" />
                    <MacroPill icon={Droplets} label="F" value={result.original_macros?.fats} colorClass="bg-emerald-500/10 text-emerald-400" />
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl text-[14px] font-bold transition-all cursor-pointer uppercase tracking-widest"
                >
                  <RotateCcw className="w-4 h-4" /> Try Another Food
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
               {!result && !isLoading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white/5 border border-dashed border-white/10 rounded-[40px] p-10 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <PiggyBank className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-2 uppercase tracking-widest">Awaiting Input</h3>
                  <p className="text-sm text-slate-500 font-bold max-w-64">
                    Analyze premium metabolic expenditures to compute cost-optimized swaps.
                  </p>
                </motion.div>
              )}

               {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-card rounded-[40px] p-10 flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-2 uppercase tracking-widest">Neural Computation...</h3>
                  <p className="text-sm text-slate-500 font-bold">Synchronizing metabolic profiles and market indexing</p>
                </motion.div>
              )}

               {result && (
                <motion.div key="results" initial="hidden" animate="visible" variants={staggerContainer} className="w-full">
                  <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-[15px] font-bold text-white uppercase tracking-widest">3 Budget-Friendly Neural Swaps</h2>
                    <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest">Neural Analysis</span>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {result.alternatives?.map((alt, idx) => (
                      <motion.div
                        key={idx}
                        variants={fadeInUp}
                        className="glass-card rounded-[32px] p-7 flex flex-col hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500 border border-white/5"
                      >
                        <div className="flex flex-col gap-4 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                              Swap {idx + 1}
                            </span>
                            {alt.savings_percent != null && (
                              <div className="flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                                <TrendingDown className="w-3.5 h-3.5" />
                                {alt.savings_percent}%
                              </div>
                            )}
                          </div>
                          <h3 className="text-[18px] font-bold text-white leading-tight">{alt.food_name}</h3>
                        </div>

                        {alt.monthly_savings && (
                          <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-4 mb-6 shadow-inner">
                            <PiggyBank className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly Yield</div>
                              <div className="text-[14px] font-bold text-emerald-400 leading-snug">{alt.monthly_savings}</div>
                            </div>
                          </div>
                        )}

                        <div className="bg-white/5 rounded-2xl p-4 mb-6 flex flex-col gap-3 border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Metabolic Delta</p>
                          <MacroCompare label="Energy" original={result.original_macros?.calories} alternative={alt.calories} unit=" kcal" />
                          <MacroCompare label="Protein" original={result.original_macros?.protein} alternative={alt.protein} />
                          <MacroCompare label="Carbs" original={result.original_macros?.carbs} alternative={alt.carbs} />
                          <MacroCompare label="Fats" original={result.original_macros?.fats} alternative={alt.fats} />
                        </div>

                        <div className="mt-auto flex items-start gap-3 bg-white/5 rounded-2xl px-4 py-4 border border-white/5">
                          <span className="text-emerald-500 mt-0.5 shrink-0 font-bold text-[16px]">✓</span>
                          <p className="text-[12px] font-medium text-slate-400 leading-relaxed italic">"{alt.why}"</p>
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
