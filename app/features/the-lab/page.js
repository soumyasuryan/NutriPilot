'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Scale, Ruler, Activity, ArrowRight, Target, Info, CheckCircle2 } from 'lucide-react';

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

export default function TheLab() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [metrics, setMetrics] = useState({
    height: '',
    weight: '',
    waist: '',
    goalWeight: ''
  });

  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleRecalculate = (e) => {
    e.preventDefault();
    // Dummy strategy calculation
    setStrategy({
      type: 'Deficit',
      targetKcal: 1800,
      proteinTarget: 140
    });
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-gray-900 pt-32 pb-20 selection:bg-[#057A55]/10 selection:text-[#057A55] relative">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-[40vw] h-[40vw] bg-emerald-50/60 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-50/40 rounded-full blur-[100px] pointer-events-none -z-10 translate-x-1/3 translate-y-1/3" />

      <main className="max-w-[1100px] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
             <Target className="w-3.5 h-3.5" />
             The Lab
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
             Goal & Strategy <span className="text-emerald-600">Setting</span>.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 font-medium mt-3 text-[16px] max-w-xl leading-relaxed">
             Input your latest metrics to recalibrate your Cutting or Bulking logic. Let the AI build your nutritional blueprint.
          </motion.p>
        </motion.div>

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Column 1: The Form */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]"
          >
             <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                Physical Metrics
             </h2>
             <form onSubmit={handleRecalculate} className="flex flex-col gap-5">
                
                {/* Input Grid */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Ruler className="w-4 h-4 text-gray-400"/> Height (cm)</label>
                    <input 
                      type="number" 
                      placeholder="175"
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={metrics.height}
                      onChange={e => setMetrics({...metrics, height: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Scale className="w-4 h-4 text-gray-400"/> Weight (kg)</label>
                    <input 
                      type="number" 
                      placeholder="72.5"
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={metrics.weight}
                      onChange={e => setMetrics({...metrics, weight: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Activity className="w-4 h-4 text-gray-400"/> Waist (in)</label>
                    <input 
                      type="number" 
                      placeholder="32"
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={metrics.waist}
                      onChange={e => setMetrics({...metrics, waist: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Target className="w-4 h-4 text-gray-400"/> Goal (kg)</label>
                    <input 
                      type="number" 
                      placeholder="68"
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={metrics.goalWeight}
                      onChange={e => setMetrics({...metrics, goalWeight: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-2 pt-6 border-t border-gray-100">
                  <button type="submit" className="w-full bg-[#057A55] hover:bg-[#046C4E] text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer">
                    Calculate Strategy <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
             </form>
          </motion.div>

          {/* Column 2: The Judge / Swap Shop */}
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {/* The Judge Insight Card */}
            <motion.div variants={fadeInUp} className="bg-[#042F2E] rounded-3xl p-8 shadow-[0_12px_40px_-10px_rgba(4,47,46,0.3)] relative overflow-hidden h-full flex flex-col">
              {/* Internal decorative glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669] rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-8 relative z-10 w-full">
                <div className="inline-flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 w-fit">
                    <Sparkles className="w-4 h-4 text-[#34D399]" />
                    <span className="text-[13px] font-semibold text-[#A7F3D0] tracking-wide uppercase">The Judge : Weekly Review</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-[#A7F3D0]" />
                </div>
              </div>
              
              <div className="relative z-10 mb-8">
                 <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed max-w-lg">
                   The Judge flagged some <span className="font-bold text-red-400">unnecessary calories</span> in your previous week. Let's fix that.
                 </h3>
                 <p className="text-[#99F6E4] opacity-80 text-sm mt-3 font-medium">Smart Swaps to stay in your deficit.</p>
              </div>

              {/* Swap Shop UI Panel */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 mt-auto">
                <div className="flex flex-col md:flex-row items-center gap-4">
                   
                   {/* Flagged Item */}
                   <div className="flex-1 bg-red-900/40 border border-red-500/30 rounded-xl p-4 w-full">
                      <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2">Flagged Log</div>
                      <div className="font-semibold text-white">Evening Samosa</div>
                      <div className="text-sm text-red-300 mt-1">300 kcal • 20g Fat</div>
                   </div>

                   {/* Swap Icon */}
                   <div className="hidden md:flex w-10 h-10 rounded-full bg-[#1e4847] border border-[#2d5f5e] items-center justify-center flex-shrink-0 z-20 shadow-lg">
                      <ArrowRight className="w-5 h-5 text-[#34D399]" />
                   </div>
                   {/* Mobile Swap Icon */}
                   <div className="md:hidden w-8 h-8 rounded-full bg-[#1e4847] border border-[#2d5f5e] flex items-center justify-center z-20 shadow-lg my-[-24px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 text-[#34D399]"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   </div>

                   {/* Suggested Swap */}
                   <div className="flex-1 bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-4 w-full relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="text-[11px] font-bold text-[#34D399] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Smart Swap
                      </div>
                      <div className="font-semibold text-white">Roasted Chana</div>
                      <div className="text-sm text-emerald-200 mt-1">120 kcal • High Protein</div>
                   </div>

                </div>

                <div className="mt-5 text-center text-sm font-medium text-[#A7F3D0]">
                  Result: Saves <strong className="text-white">180 kcal</strong> & puts you back in a deficit.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
