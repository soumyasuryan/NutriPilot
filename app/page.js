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
      <div className="relative min-h-screen bg-[#FCFCFD] text-gray-900 selection:bg-[#057A55]/10 selection:text-[#057A55] overflow-hidden pt-24 font-sans">

        {/* Refined Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-linear-to-b from-[#E6F4EA] to-transparent rounded-full blur-[100px] pointer-events-none -z-10 opacity-70 translate-x-1/4 -translate-y-1/4" />

        {/* Hero Section */}
        <main className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-12 pb-24 md:pt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-12 items-center">

            {/* Hero Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start pr-0 lg:pr-8"
            >
              {/* Elegant Pill */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[13px] font-semibold text-[#057A55] mb-8 shadow-[0_2px_10px_-4px_rgba(5,122,85,0.1)]">
                <Sparkles className="w-3.5 h-3.5" />
                NutriPilot
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-[3rem] md:text-[4rem] font-semibold leading-[1.08] tracking-tight mb-6 text-[#111827]"
              >
                Fix your diet. <br />
                <span className="text-[#057A55]">Not just track it.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p variants={fadeInUp} className="text-lg md:text-[19px] text-[#4B5563] mb-10 leading-relaxed max-w-[480px]">
                AI-powered meal insights combined with budget-friendly fixes, tailored specifically for Indian students and real-world eating habits.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/signup" className="w-full sm:w-auto bg-[#057A55] text-white px-7 py-3.5 rounded-xl font-medium hover:bg-[#046C4E] transition-all shadow-[0_4px_14px_0_rgba(5,122,85,0.25)] hover:shadow-[0_6px_20px_rgba(5,122,85,0.23)] flex items-center justify-center gap-2 text-[15px]">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/demo" className="w-full sm:w-auto bg-white text-[#374151] border border-gray-200 px-7 py-3.5 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm text-[15px]">
                  Try Demo
                </Link>
              </motion.div>

              {/* Precise Stats */}
              <motion.div variants={fadeInUp} className="flex items-center gap-10 mt-14 pt-8 w-full md:max-w-fit">
                <div>
                  <div className="text-[28px] font-semibold text-[#111827] mb-0.5">₹850</div>
                  <div className="text-[13px] text-[#6B7280] font-medium">Avg. monthly savings</div>
                </div>
                <div className="w-[1px] h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="text-[28px] font-semibold text-[#111827] mb-0.5">2.4k+</div>
                  <div className="text-[13px] text-[#6B7280] font-medium">Students improving</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right Graphic - Minimal Glass App Window */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              {/* Glow behind the dashboard */}
              <div className="absolute inset-0 bg-[#34D399] opacity-10 blur-[60px] rounded-full"></div>

              {/* The Dashboard App Mockup */}
              <div className="relative bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[520px]">

                {/* App Bar purely decorative */}
                <div className="flex items-center gap-2 pb-6 border-b border-gray-50 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>

                {/* Top Float - Daily Goal */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 80, damping: 20 }}
                  className="absolute -left-4 md:-left-12 top-20 bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white flex items-center gap-3.5 z-20"
                >
                  <div className="bg-[#E6F4EA] p-2 rounded-[10px] text-[#057A55]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">Daily Goal</p>
                    <p className="text-[13px] font-semibold text-gray-900">85% Complete</p>
                  </div>
                </motion.div>

                {/* Bottom Float - Saved Today */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 80, damping: 20 }}
                  className="absolute -right-4 md:-right-8 -bottom-6 bg-white/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white flex items-center gap-3.5 z-20"
                >
                  <div className="bg-orange-50 p-2 rounded-[10px] text-orange-500">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">Saved Today</p>
                    <p className="text-[13px] font-semibold text-gray-900">₹42.50</p>
                  </div>
                </motion.div>

                {/* AI Insight Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute right-8 top-[90px] bg-[#057A55]/10 text-[#057A55] text-[11px] font-semibold px-3 py-1 rounded-full"
                >
                  AI Optimized
                </motion.div>

                {/* Main Graph Element */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[13px] font-medium text-gray-400">Target Analytics</div>
                    <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Updated just now</div>
                  </div>
                  <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-[#057A55] rounded-full"
                    />
                  </div>
                </div>

                {/* Micro Data Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#F1F5F9] transition-colors hover:bg-white hover:border-gray-200">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Calories</p>
                    <p className="text-[18px] font-semibold text-[#111827]">1850</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 tracking-tight">of 2200 kcal</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#F1F5F9] transition-colors hover:bg-white hover:border-gray-200">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Protein</p>
                    <p className="text-[18px] font-semibold text-[#111827]">52<span className="text-[14px]">g</span></p>
                    <p className="text-[11px] text-gray-400 mt-0.5 tracking-tight">of 80g</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#F1F5F9] transition-colors hover:bg-white hover:border-gray-200">
                    <p className="text-[12px] text-gray-500 font-medium mb-1">Budget</p>
                    <p className="text-[18px] font-semibold text-[#111827]">₹95</p>
                    <p className="text-[11px] text-[#057A55] font-medium mt-0.5 tracking-tight">On track</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </main>

        {/* How It Works Section - Refined Grid */}
        <section id="how-it-works" className="py-32 px-6 lg:px-8 bg-white relative">
          <div className="max-w-[1200px] mx-auto border-t border-gray-100 pt-24">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="flex flex-col items-center text-center mb-20"
            >
              <motion.h2 variants={fadeInUp} className="text-[2.25rem] md:text-[2.75rem] font-semibold text-[#111827] mb-4 tracking-tight">
                A systematic approach to diet
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[17px] text-gray-500 max-w-xl">
                Our 3-step process simplifies nutrition without compromising your wallet.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col relative group"
              >
                <div className="text-[#057a55] text-[5rem] font-bold leading-none mb-6">01</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">Add Your Meals</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  Input your daily meals in natural language. Our AI effortlessly understands complex Indian cuisine and home food.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col relative"
              >
                <div className="text-[#057a55] text-[5rem] font-bold leading-none mb-6">02</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">Get AI Insights</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  Instantly see what's holding you back. We identify missing protein and excess calories with extreme precision.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col relative"
              >
                <div className="text-[#057a55] text-[5rem] font-bold leading-none mb-6">03</div>
                <h3 className="text-xl font-semibold text-[#111827] mb-3">Optimize & Fix</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  Apply budget-friendly swaps (e.g. replacing almonds with peanuts) to perfect your nutrition plan realistically.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section - Sophisticated dark/emerald design */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[1000px] mx-auto bg-[#064E3B] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Internal gradient decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#059669] blur-[80px] rounded-full opacity-60"></div>

            <h2 className="text-[2rem] md:text-[2.75rem] font-semibold text-white mb-5 tracking-tight relative z-10">
              Ready to transform your diet?
            </h2>

            <p className="text-[#A7F3D0] text-[16px] md:text-[18px] mb-10 max-w-2xl mx-auto relative z-10">
              Join 2,400+ students who are breaking past physical plateaus and saving money with NutriPilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-white text-[#064E3B] font-medium px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center justify-center text-[15px]"
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
