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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      router.push('/');
    } else {
      setIsAuthorized(true);
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
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer">
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
                value={1450} 
                max={2200} 
                color="#057A55" 
                size={220} 
                strokeWidth={16} 
                label="kcal remaining"
                subLabel="Total Limit: 2200"
              />
            </div>
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
                  current={60} 
                  target={80} 
                  unit="g"
                  colorClass="bg-[#2563EB]" // Blue
                  bgClass="bg-blue-50"
                />
                <MacroBar 
                  label="Carbs" 
                  icon={TrendingUp} 
                  current={180} 
                  target={220} 
                  unit="g"
                  colorClass="bg-[#D97706]" // Amber/Orange
                  bgClass="bg-amber-50"
                />
                <MacroBar 
                  label="Fats" 
                  icon={Droplet} 
                  current={45} 
                  target={65} 
                  unit="g"
                  colorClass="bg-[#057A55]" // Emerald
                  bgClass="bg-emerald-50"
                />
             </div>
          </motion.div>

          {/* Card 3: AI Insight (Glassmorphism + Glow) */}
          <motion.div 
            variants={fadeInUp} 
            className="bg-gradient-to-br from-[#064E3B] to-[#042F2E] rounded-3xl p-8 shadow-[0_12px_40px_-10px_rgba(4,47,46,0.3)] relative overflow-hidden flex flex-col justify-between"
          >
            {/* Internal decorative glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#059669] rounded-full blur-[60px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[12px] font-semibold text-[#A7F3D0] tracking-wide uppercase">AI Insight</span>
              </div>
              
              <h3 className="text-xl font-medium text-white leading-relaxed z-10 relative mt-2">
                "You're <span className="font-bold text-[#A7F3D0]">20g short</span> on protein today. Try adding a bowl of curd to your dinner."
              </h3>
            </div>
            
            <div className="mt-8 z-10 relative">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                <Sparkles className="w-4 h-4"/>
                Auto-Fix Dinner
              </button>
            </div>
          </motion.div>

        </motion.div>

        {/* --- Tab 2: The Log Zone --- */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-50px" }}
           variants={staggerContainer}
           className="mt-16"
        >
           <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Food Log & Library</h2>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
              {/* Quick Add Search Bar */}
              <motion.div variants={fadeInUp} className="relative mb-10">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                 </div>
                 <input 
                    type="text" 
                    className="w-full bg-[#f8fafc] border border-gray-100 text-gray-900 text-[15px] rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#057A55]/20 focus:border-[#057A55] outline-none transition-all placeholder:text-gray-400 cursor-text" 
                    placeholder="Search meals, ingredients, or describe what you ate (e.g., '2 Roti and Dal')..." 
                 />
                 <button className="absolute inset-y-2 right-2 bg-[#057A55] hover:bg-[#046C4E] text-white px-5 rounded-xl font-medium text-sm transition-colors shadow-sm cursor-pointer">
                    Analyze & Add
                 </button>
              </motion.div>

              {/* Favorites / Recent Section */}
              <motion.div variants={fadeInUp}>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                       <Clock className="w-4 h-4 text-gray-400" /> Recently Logged
                    </h3>
                    <button className="text-[13px] font-medium text-[#057A55] hover:underline cursor-pointer">View All</button>
                 </div>

                 {/* List of Previous Meals */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Meal Item 1 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                             <Wheat className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-semibold text-gray-900">2 Roti, Dal, Rice</h4>
                             <p className="text-[13px] text-gray-500 mt-0.5">450 kcal • 14g Protein</p>
                          </div>
                       </div>
                       <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors flex-shrink-0 cursor-pointer">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>

                    {/* Meal Item 2 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                             <Droplet className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-semibold text-gray-900">Oats with Milk & Banana</h4>
                             <p className="text-[13px] text-gray-500 mt-0.5">320 kcal • 12g Protein</p>
                          </div>
                       </div>
                       <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors flex-shrink-0 cursor-pointer">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>

                    {/* Meal Item 3 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                             <Flame className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-semibold text-gray-900">Chicken Breast & Salad</h4>
                             <p className="text-[13px] text-gray-500 mt-0.5">280 kcal • 45g Protein</p>
                          </div>
                       </div>
                       <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors flex-shrink-0 cursor-pointer">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                    
                    {/* Meal Item 4 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FCFCFD] hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                             <Info className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-[15px] font-semibold text-gray-900">Paneer Tikka (6 pieces)</h4>
                             <p className="text-[13px] text-gray-500 mt-0.5">380 kcal • 22g Protein</p>
                          </div>
                       </div>
                       <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#057A55] group-hover:text-white group-hover:border-[#057A55] transition-colors flex-shrink-0">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>

                 </div>
              </motion.div>
           </div>
        </motion.div>
      </main>
    </div>
  );
}
