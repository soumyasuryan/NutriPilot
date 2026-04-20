'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Lightbulb, TrendingUp, Search, Activity, Target, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

export default function HowItWorks() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/10 selection:text-emerald-400 pt-28 pb-20 font-sans overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] opacity-60 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] opacity-60 translate-x-1/3 pointer-events-none"></div>

      <main className="max-w-[1000px] mx-auto px-6 relative z-10">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase">System Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-8 uppercase">
            How <span className="text-emerald-500">NutriPilot</span> Operates
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Metabolic optimization through neural retrospectives. Our AI-driven engine transforms raw data into actionable biological intelligence.
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Vertical Connecting Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-[1px] bg-white/10 -translate-x-1/2 z-0"></div>

          {/* STEP 1: The Lab */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 relative z-10">
            <div className="md:w-1/2 flex justify-end text-right">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-4">
                  Sequence 01
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">The Lab: Biometric Blueprint</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  We don't do generic averages. You input your unique biometrics—height, weight, age, and waist size—directly into <strong>The Lab</strong>. Our AI engine instantly calculates your exact metabolic trajectory.
                </p>
              </div>
            </div>

            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-blue-500/20 items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] z-10 shrink-0">
              <Target className="w-6 h-6 text-blue-400" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text (Shows only on small screens before card) */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-3">Sequence 01</div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">The Lab: Biometric Blueprint</h2>
                <p className="text-slate-400 leading-relaxed font-medium">We don't do generic averages. You input your unique biometrics into The Lab, and our AI calculates your exact targets.</p>
              </div>

              {/* Visual Card */}
              <div className="glass-card p-8 rounded-[32px] group hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target Calories</p><p className="text-xl font-bold text-white leading-none">2,150<span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">kcal</span></p></div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target Protein</p><p className="text-xl font-bold text-white leading-none">140<span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">g</span></p></div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%] rounded-full group-hover:w-[75%] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 2: Intelligent Logging */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-24 relative z-10">
            <div className="md:w-1/2 text-left">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[11px] mb-4">
                  Sequence 02
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Neural Food Logging</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  No barcodes. No friction. Input your meals exactly how you speak: <strong>"2 Roti and Dal with Paneer"</strong>. Our neural engine instantly computes the metabolic breakdown.
                </p>
              </div>
            </div>

            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-emerald-500/20 items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] z-10 shrink-0">
              <Search className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-[11px] mb-3">Sequence 02</div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Neural Food Logging</h2>
                <p className="text-slate-400 leading-relaxed font-medium">Type what you ate naturally ("2 Roti and Dal"). Our AI instantly breaks down the exact caloric and macro values.</p>
              </div>

              {/* Visual Card */}
              <div className="glass-card p-8 rounded-[32px] group hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-500">
                <div className="bg-white/5 rounded-2xl p-5 flex items-center gap-3 mb-5 border border-white/5 shadow-inner">
                  <Search className="w-5 h-5 text-slate-500" />
                  <span className="text-white font-bold tracking-tight">"2 Roti and mixed Dal"</span>
                  <div className="w-1.5 h-6 bg-emerald-500 animate-pulse ml-[-6px] shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10">Synchronized</div>
                  <div className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-[11px] font-bold border border-white/5 grow text-center">310 kcal</div>
                  <div className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-[11px] font-bold border border-white/5 grow text-center">14g P</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 3: The Judge Tracker */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 relative z-10">
            <div className="md:w-1/2 flex justify-end text-right">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-[11px] mb-4">
                  Sequence 03
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">The Judge & Swap Protocol</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  We react to data. If you exceed your biological budget, <strong>The Judge</strong> performs a neural audit. The <strong>Swap Shop</strong> protocol identifies cost-effective metabolic trades to fix your deficit.
                </p>
              </div>
            </div>

            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-amber-500/20 items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] z-10 shrink-0">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-[11px] mb-3">Sequence 03</div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">The Judge & Swap Protocol</h2>
                <p className="text-slate-400 leading-relaxed font-medium">Our AI "Judge" steps in with targeted advice to fix your cravings via smart Swaps (e.g. Samosa → Chana).</p>
              </div>

              {/* Visual Card */}
              <div className="bg-slate-900 border border-white/5 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">AI Judge Insight</span>
                </div>
                <p className="text-white text-lg font-bold leading-tight tracking-tight">
                  "Metabolic surplus detected. Swapping <span className="text-rose-400 line-through opacity-50">Samosa</span> for <span className="text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">Roasted Chana</span> restores biological target."
                </p>
              </div>
            </div>
          </motion.div>

          {/* STEP 4: Progress */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-12 relative z-10">
            <div className="md:w-1/2 text-left">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-[11px] mb-4">
                  Sequence 04
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Biological Retrospective</h2>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Watch discipline manifest as data. Our dashboard synthesizes your 7-day averages into a predictive forecast, ensuring you never deviate from your physical objectives.
                </p>
              </div>
            </div>

            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-purple-500/20 items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)] z-10 shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-[11px] mb-3">Sequence 04</div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Biological Retrospective</h2>
                <p className="text-slate-400 leading-relaxed font-medium">See how your past week's meals stack up against your baseline with predictive neural forecasting.</p>
              </div>

              {/* Visual Card */}
              <div className="glass-card p-8 rounded-[32px] group hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all duration-500 relative">
                {/* Simulated Target Baseline */}
                <div className="absolute left-6 right-6 top-[45%] border-t border-dashed border-white/20 z-10 transition-all duration-500 group-hover:-translate-y-2"></div>
                <div className="flex items-end gap-3 h-28 mb-3 z-0 relative">
                  <div className="w-1/6 bg-emerald-500/40 rounded-t-xl h-[40%] group-hover:h-[50%] transition-all duration-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"></div>
                  <div className="w-1/6 bg-emerald-500/40 rounded-t-xl h-[45%] group-hover:h-[40%] transition-all duration-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"></div>
                  <div className="w-1/6 bg-emerald-500/40 rounded-t-xl h-[40%] group-hover:h-[45%] transition-all duration-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"></div>
                  <div className="w-1/6 bg-amber-500/40 rounded-t-xl h-[70%] group-hover:h-[75%] transition-all duration-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>
                  <div className="w-1/6 bg-amber-500/40 rounded-t-xl h-[65%] group-hover:h-[60%] transition-all duration-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>
                  <div className="w-1/6 bg-emerald-500/40 rounded-t-xl h-[35%] group-hover:h-[45%] transition-all duration-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"></div>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-bold text-slate-600 tracking-widest pt-4 border-t border-white/5">
                  <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          variants={fadeInUp}
          className="text-center mt-24"
        >
          <Link href={isLoggedIn ? "/home" : "/signup"}>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-12 py-5 rounded-[20px] text-[15px] font-bold tracking-[0.2em] shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto cursor-pointer uppercase">
              {isLoggedIn ? "Access Command Center" : "Begin Neural Journey"} <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
