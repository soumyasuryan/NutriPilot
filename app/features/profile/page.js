'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, History, BookOpen, User, Plus, Search, MoreHorizontal } from 'lucide-react';

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

export default function ProfileProgress() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-gray-900 pt-32 pb-20 selection:bg-blue-500/10 selection:text-blue-600 relative">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-purple-50/40 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
               <User className="w-3.5 h-3.5" />
               Profile & Progress
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
               Your <span className="text-blue-600">Journey</span>.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-500 font-medium mt-3 text-[16px] max-w-xl leading-relaxed">
               Track your historical weight and fat percentage, and manage your personal food library.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp} className="flex-shrink-0">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer">
              Settings & Account
            </button>
          </motion.div>
        </motion.div>

        {/* Charts & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Chart 1 Placeholder - Weight Progress */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col min-h-[340px]"
          >
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 <History className="w-5 h-5 text-blue-500" />
                 Weight Progress
               </h2>
               <select className="bg-gray-50 border border-gray-100 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20">
                 <option>Last 30 Days</option>
                 <option>Last 3 Months</option>
                 <option>This Year</option>
               </select>
             </div>
             
             {/* Chart Dummy Visual */}
             <div className="flex-1 flex items-end gap-3 justify-between pb-4 border-b border-gray-100 relative">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-gray-50/80"></div>)}
               </div>
               
               {/* Bars */}
               {[68.5, 68.2, 67.9, 67.5, 67.8, 67.2, 66.8].map((val, idx) => (
                 <div key={idx} className="w-full relative flex justify-center group h-full items-end">
                   <div 
                     className="w-full max-w-[2.5rem] bg-gradient-to-t from-blue-100 to-blue-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer relative"
                     style={{ height: `${(val / 70) * 100}%` }}
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                       {val} kg
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             <div className="flex justify-between items-center mt-3 text-xs font-medium text-gray-400 px-2">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
             </div>
          </motion.div>

          {/* Chart 2 Placeholder - Fat Percentage */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col min-h-[340px]"
          >
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-purple-500" />
                 Est. Body Fat %
               </h2>
               <select className="bg-gray-50 border border-gray-100 text-sm rounded-lg px-3 py-1.5 text-gray-600 outline-none focus:ring-2 focus:ring-purple-500/20">
                 <option>Last 3 Months</option>
                 <option>Last 6 Months</option>
               </select>
             </div>

             {/* Chart Line Dummy Visual */}
             <div className="flex-1 w-full bg-gray-50/50 rounded-2xl border border-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  {/* Grid */}
                  <line x1="0" y1="25" x2="400" y2="25" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="1"/>
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#f3f4f6" strokeWidth="1"/>
                  {/* Line Graph */}
                  <path 
                    d="M 0 80 Q 50 70 100 60 T 200 45 T 300 30 T 400 25" 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                  {/* Data Points */}
                  <circle cx="0" cy="80" r="4" fill="#a855f7" stroke="white" strokeWidth="2"/>
                  <circle cx="100" cy="60" r="4" fill="#a855f7" stroke="white" strokeWidth="2"/>
                  <circle cx="200" cy="45" r="4" fill="#a855f7" stroke="white" strokeWidth="2"/>
                  <circle cx="300" cy="30" r="4" fill="#a855f7" stroke="white" strokeWidth="2"/>
                  <circle cx="400" cy="25" r="4" fill="#a855f7" stroke="white" strokeWidth="2"/>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium z-10 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100">
                  Trend: Downward
                </div>
             </div>
          </motion.div>
        
        </div>

        {/* Personal Food Library */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Personal Food Library
            </h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search custom foods..." 
                  className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 cursor-text"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Custom
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Item Name</th>
                  <th className="pb-3 px-4">Serving Size</th>
                  <th className="pb-3 px-4">Calories</th>
                  <th className="pb-3 px-4 hidden sm:table-cell">Macros (P/C/F)</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 pl-2 font-medium text-gray-900">Maa's Special Dal</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">1 Medium Katori (150g)</td>
                  <td className="py-4 px-4 font-semibold text-gray-900 text-sm">180 kcal</td>
                  <td className="py-4 px-4 text-gray-500 text-sm hidden sm:table-cell">
                    <span className="text-blue-600 font-medium">12g</span> / <span className="text-amber-600 font-medium">20g</span> / <span className="text-emerald-600 font-medium">4g</span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 pl-2 font-medium text-gray-900">Office Canteen Sandwich</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">1 piece</td>
                  <td className="py-4 px-4 font-semibold text-gray-900 text-sm">320 kcal</td>
                  <td className="py-4 px-4 text-gray-500 text-sm hidden sm:table-cell">
                    <span className="text-blue-600 font-medium">8g</span> / <span className="text-amber-600 font-medium">45g</span> / <span className="text-emerald-600 font-medium">10g</span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </motion.div>

      </main>
    </div>
  );
}
