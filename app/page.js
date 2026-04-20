'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Wallet, ArrowRight, Activity, Clock } from 'lucide-react';
import Toast from '@/components/Toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function HomePage() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
      return;
    }

    // Check for logout toast
    const shouldShowLogout = localStorage.getItem('logoutToast');
    if (shouldShowLogout === 'true') {
      showToast("Logged out successfully", "Your session has ended securely. See you soon!", "success");
      localStorage.removeItem('logoutToast');
    }
  }, [router]);

  return (
    <>
      <div className="relative min-h-screen text-white selection:bg-emerald-500/10 selection:text-emerald-400 overflow-hidden pt-24 font-sans antialiased">
        <div className="app-bg opacity-10" />

        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4" />

        {/* Hero Section */}
        <main className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-8 pb-16 md:pt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-12 items-center">

            {/* Hero Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start pr-0 lg:pr-8"
            >
              {/* Elegant Pill */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[11px] font-bold text-emerald-400 mb-10 shadow-lg uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Trusted by 2,400+ Students
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-[2.5rem] sm:text-[3.5rem] md:text-[3.5rem] md:w-[550px] font-bold leading-[0.95] tracking-tighter mb-8 text-white uppercase"
              >
                Fix your diet. <br className="hidden sm:block" />
                <span className="text-emerald-400 text-glow-emerald">Not just track it.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p variants={fadeInUp} className="text-lg md:text-[20px] text-slate-400 mb-12 leading-relaxed max-w-[540px] font-medium">
                AI-powered meal insights combined with budget-friendly fixes, tailored specifically for Indian students and real-world eating habits.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <Link href="/signup" className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-5 rounded-[20px] font-bold hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] flex items-center justify-center gap-3 text-[15px] uppercase tracking-widest hover:scale-105 active:scale-95">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </motion.div>

              {/* Precise Stats */}
              <motion.div variants={fadeInUp} className="flex items-center gap-6 sm:gap-10 mt-12 sm:mt-16 pt-10 w-full md:max-w-fit border-t border-white/5 md:border-t-0">
                <div>
                  <div className="text-[26px] sm:text-[32px] font-bold text-white mb-0.5 tracking-tighter">₹850</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest">Avg. Monthly Savings</div>
                </div>
                <div className="w-px h-12 bg-white/5 rounded-full"></div>
                <div>
                  <div className="text-[26px] sm:text-[32px] font-bold text-white mb-0.5 tracking-tighter">2.4k+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest">Active Students</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right Graphic - Minimal Glass App Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              {/* Glow behind the dashboard */}
              <div className="absolute inset-0 bg-emerald-400/20 blur-[80px] rounded-full"></div>

              {/* The Dashboard App Mockup */}
              <div className="relative glass-card rounded-[32px] p-8 w-full max-w-[540px]">

                {/* App Bar purely decorative */}
                <div className="flex items-center gap-2 pb-6 border-b border-white/5 mb-6">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/50"></div>
                </div>

                {/* Top Float - Daily Goal */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-4 sm:-left-12 top-30 bg-slate-900/80 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex items-center gap-4 z-20 shadow-2xl"
                >
                  <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">Status</p>
                    <p className="text-[15px] font-bold text-white">AI Optimized</p>
                  </div>
                </motion.div>

                {/* Bottom Float - Saved Today */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 sm:-right-8 -bottom-6 bg-slate-900/80 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex items-center gap-4 z-20 shadow-2xl"
                >
                  <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">Savings</p>
                    <p className="text-[15px] font-bold text-white">+₹1,240 <span className="text-[11px] font-normal text-slate-500">/mo</span></p>
                  </div>
                </motion.div>

                {/* Main Graph Element */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[14px] font-bold text-slate-300 uppercase tracking-widest">Target Analytics</div>
                    <div className="text-emerald-400 text-[12px] font-bold px-3 py-1 bg-emerald-400/10 rounded-full">ACTIVE</div>
                  </div>
                  <div className="h-24 w-full flex items-end gap-1.5 mb-4">
                    {[40, 70, 45, 90, 65, 80, 50, 60, 85, 30, 75].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                        className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-slate-700/50'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Micro Data Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 transition-all hover:bg-white/10">
                    <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">Fuel</p>
                    <p className="text-[20px] font-bold text-white">1,850</p>
                    <p className="text-[11px] text-slate-500 mt-1">of 2200 kcal</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 transition-all hover:bg-white/10">
                    <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">Power</p>
                    <p className="text-[20px] font-bold text-white">52g</p>
                    <p className="text-[11px] text-slate-500 mt-1">of 80g</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 transition-all hover:bg-white/10">
                    <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">Cost</p>
                    <p className="text-[20px] font-bold text-emerald-400">₹95</p>
                    <p className="text-[11px] text-emerald-400/50 mt-1">On track</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </main>

        {/* How It Works Section - Refined Grid */}
        <section id="how-it-works" className="py-20 sm:py-32 px-6 lg:px-8 relative">
          <div className="max-w-[1200px] mx-auto border-t border-white/10 pt-16 sm:pt-24">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="flex flex-col items-center text-center mb-16 sm:mb-20"
            >
              <motion.h2 variants={fadeInUp} className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold text-white mb-6 tracking-tight leading-tight">
                A systematic approach to <span className="text-emerald-400">diet</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[16px] sm:text-[18px] text-slate-400 max-w-2xl leading-relaxed">
                Our 3-step process simplifies nutrition without compromising your wallet.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
              {[
                { step: "01", title: "Add Your Meals", desc: "Input your daily meals in natural language. Our AI effortlessly understands complex Indian cuisine and home food." },
                { step: "02", title: "Get AI Insights", desc: "Instantly see what's holding you back. We identify missing protein and excess calories with extreme precision." },
                { step: "03", title: "Optimize & Fix", desc: "Apply budget-friendly swaps (e.g. replacing almonds with peanuts) to perfect your nutrition plan realistically." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-2xl"
                >
                  <div className="text-emerald-400/10 text-[6rem] font-bold absolute -right-4 -bottom-8 group-hover:text-emerald-400/20 transition-all mr-5 mb-5">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4 relative z-10 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed text-[15px] relative z-10 font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Sophisticated dark/emerald design */}
        <section className="py-24 px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-[1100px] mx-auto bg-emerald-900/40 backdrop-blur-xl border border-emerald-400/20 rounded-[40px] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Internal gradient decoration */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-400/10 blur-[100px] rounded-full"></div>

            <h2 className="text-[2rem] sm:text-[3rem] font-bold text-white mb-6 tracking-tight relative z-10 leading-tight">
              Ready to transform <span className="text-emerald-400">your diet?</span>
            </h2>

            <p className="text-slate-300 text-[16px] sm:text-[20px] mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Join 2,400+ students who are breaking past physical plateaus and saving money with NutriPilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-emerald-500 text-white font-bold px-10 py-5 rounded-2xl hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:scale-105 text-[16px] uppercase tracking-widest"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
      <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
    </>
  );
}
