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
    <div className="min-h-screen bg-[#FCFCFD] selection:bg-[#057A55]/10 selection:text-[#057A55] pt-28 pb-20 font-sans overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-60 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-60 translate-x-1/3 pointer-events-none"></div>

      <main className="max-w-[1000px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 mb-6">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="text-[13px] font-bold text-emerald-700 tracking-wide uppercase">Platform Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            How <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-emerald-400">NutriPilot</span> Works
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Stop guessing your calories. Experience a seamless, AI-driven journey that transforms exactly what you eat into actionable intelligence. Here is your flight manual.
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Vertical Connecting Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-[2px] bg-linear-to-b from-emerald-100 via-gray-200 to-transparent -translate-x-1/2 z-0"></div>

          {/* STEP 1: The Lab */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-20 relative z-10">
            <div className="md:w-1/2 flex justify-end text-right">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">
                  Step 01
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">The Lab: Biometric Blueprint</h2>
                <p className="text-gray-500 leading-relaxed font-medium">
                  We don't do generic averages. You input your unique biometrics—height, weight, age, and waist size—directly into <strong>The Lab</strong>. Our AI engine instantly calculates your exact caloric deficit or surplus and defines your precise macro targets for the day.
                </p>
              </div>
            </div>
            
            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-white border-4 border-blue-100 items-center justify-center shadow-lg shadow-blue-500/10 z-10 shrink-0">
               <Target className="w-6 h-6 text-blue-600" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text (Shows only on small screens before card) */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Step 01</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The Lab: Biometric Blueprint</h2>
                <p className="text-gray-500 leading-relaxed font-medium">We don't do generic averages. You input your unique biometrics into The Lab, and our AI calculates your exact targets.</p>
              </div>

              {/* Visual Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300">
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Target Calories</p><p className="text-xl font-bold text-gray-900">2,150<span className="text-sm font-medium text-gray-400 ml-1">kcal</span></p></div>
                   <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Target Protein</p><p className="text-xl font-bold text-gray-900 text-blue-600">140<span className="text-sm font-medium text-blue-400 ml-1">g</span></p></div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%] rounded-full group-hover:w-[75%] transition-all duration-1000 ease-out"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 2: Intelligent Logging */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-20 relative z-10">
            <div className="md:w-1/2 text-left">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">
                  Step 02
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Frictionless AI Logging</h2>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Barcode scanning is tedious. With NutriPilot, you just type what you ate exactly how you'd say it: <strong>"2 Roti and Dal with a side of Paneer"</strong>. Our natural language processing instantly breaks down the exact caloric and macro values behind the scenes.
                </p>
              </div>
            </div>
            
            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-white border-4 border-emerald-100 items-center justify-center shadow-lg shadow-emerald-500/10 z-10 shrink-0">
               <Search className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm mb-2">Step 02</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frictionless AI Logging</h2>
                <p className="text-gray-500 leading-relaxed font-medium">Type what you ate naturally ("2 Roti and Dal"). Our AI instantly breaks down the exact caloric and macro values.</p>
              </div>

              {/* Visual Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(5,122,85,0.1)] transition-all duration-300">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-4 border border-gray-100">
                  <Search className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800 font-medium">"2 Roti and mixed Dal"</span>
                  <div className="w-1.5 h-5 bg-emerald-500 animate-pulse ml-[-6px]"></div>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold shrink-0">Analyzed</div>
                   <div className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100 grow text-center">310 kcal</div>
                   <div className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100 grow text-center">14g P</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 3: The Judge Tracker */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-20 relative z-10">
            <div className="md:w-1/2 flex justify-end text-right">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">
                  Step 03
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">The Judge & Swap Shop</h2>
                <p className="text-gray-500 leading-relaxed font-medium">
                  We don't just record data; we react to it. If you over-consume, <strong>The Judge</strong> steps in at the end of the day with targeted advice. Using the <strong>Swap Shop</strong>, it shows you exactly how trading that evening Samosa for Roasted Chana puts you right back in a deficit.
                </p>
              </div>
            </div>
            
            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-white border-4 border-amber-100 items-center justify-center shadow-lg shadow-amber-500/10 z-10 shrink-0">
               <Zap className="w-6 h-6 text-amber-500" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Step 03</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The Judge & Swap Shop</h2>
                <p className="text-gray-500 leading-relaxed font-medium">Our AI "Judge" steps in with targeted advice to fix your cravings via smart Swaps (e.g. Samosa → Chana).</p>
              </div>

              {/* Visual Card */}
              <div className="bg-linear-to-br from-[#064E3B] to-[#042F2E] p-8 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 mb-4 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-100 tracking-wide uppercase">AI Judge Insight</span>
                </div>
                <p className="text-white text-lg font-medium leading-relaxed">
                  "You're 200 calories over target. Swapping your evening <span className="text-amber-300 line-through">Samosa</span> for <span className="text-emerald-300 font-bold">Roasted Chana</span> fixes your deficit."
                </p>
              </div>
            </div>
          </motion.div>

          {/* STEP 4: Progress */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-10 relative z-10">
            <div className="md:w-1/2 text-left">
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 text-purple-500 font-bold uppercase tracking-widest text-sm mb-3">
                  Step 04
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Weekly Balance Intelligence</h2>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Watch your discipline pay off. Access your <strong>Profile & Progress</strong> dashboard to see exactly how your past week's meals stacked up against your baseline. Our AI synthesizes your 7-day average to warn you about severe deficits or unchecked surpluses.
                </p>
              </div>
            </div>
            
            {/* Center Node */}
            <div className="hidden md:flex w-14 h-14 rounded-full bg-white border-4 border-purple-100 items-center justify-center shadow-lg shadow-purple-500/10 z-10 shrink-0">
               <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>

            <div className="md:w-1/2 w-full">
              {/* Mobile Text */}
              <div className="md:hidden mb-6 text-left">
                <div className="inline-flex items-center gap-2 text-purple-500 font-bold uppercase tracking-widest text-sm mb-2">Step 04</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Balance Intelligence</h2>
                <p className="text-gray-500 leading-relaxed font-medium">See how your past week's meals stack up against your baseline, with AI analyzing your 7-day average for course correction.</p>
              </div>

               {/* Visual Card */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:shadow-[0_8px_30px_rgb(168,85,247,0.1)] transition-all duration-300 relative">
                
                {/* Simulated Target Baseline */}
                <div className="absolute left-6 right-6 top-[45%] border-t-2 border-dashed border-gray-300 z-10 transition-all duration-500 group-hover:-translate-y-2"></div>

                <div className="flex items-end gap-2 h-24 mb-2 z-0 relative">
                  <div className="w-1/6 bg-emerald-400 rounded-t-lg h-[40%] group-hover:h-[50%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-emerald-400 rounded-t-lg h-[45%] group-hover:h-[40%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-emerald-400 rounded-t-lg h-[40%] group-hover:h-[45%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-amber-400 rounded-t-lg h-[70%] group-hover:h-[75%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-amber-400 rounded-t-lg h-[65%] group-hover:h-[60%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-emerald-400 rounded-t-lg h-[35%] group-hover:h-[45%] transition-all duration-500"></div>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 tracking-wider pt-2 border-t border-gray-100">
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
          className="text-center mt-20"
        >
          <Link href={isLoggedIn ? "/home" : "/signup"}>
             <button className="bg-linear-to-r from-[#16a34a] to-[#046C4E] hover:from-[#15803d] hover:to-[#064e3b] text-white px-8 py-4 rounded-2xl text-[16px] font-bold tracking-wide shadow-xl shadow-green-600/20 hover:shadow-green-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto cursor-pointer">
               {isLoggedIn ? "Go to Dashboard" : "Begin Your Journey"} <ChevronRight className="w-5 h-5"/>
             </button>
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
