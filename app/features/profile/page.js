'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Toast from '@/components/Toast';

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
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsAuthorized(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);

      // Fetch profile data from API
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${storedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => {
          console.error("Error fetching profile", err);
          showToast("Access Error", "Could not synchronize profile data.", "error");
        });

      // Fetch chart data from API
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/weekly/${storedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data) {
            setChartData(res.data);
          } else {
            showToast("Data Sync Issue", "Some chart data could not be visualized.", "info");
          }
        })
        .catch(err => {
          console.error("Error fetching chart data", err);
          showToast("Visualization Failed", "Could not compute 7-day intake graph.", "error");
        });
    } catch (err) {
      console.error("Invalid user JSON");
    }
  }, [router]);

  if (!isAuthorized) return null;

  // Chart Logic Data
  const weeklyData = chartData.length === 7 ? chartData : [0, 0, 0, 0, 0, 0, 0];

  const dayLabels = [];
  const today = new Date();
  const daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dayLabels.push(daysMap[d.getDay()]);
  }

  const targetCals = profile?.target_calories || 2200;

  // Math operations
  const maxY = Math.max(...weeklyData, targetCals) + 300;
  const activeDays = weeklyData.filter(v => v > 0);
  const averageIntake = activeDays.length > 0 ? Math.round(activeDays.reduce((a, b) => a + b, 0) / activeDays.length) : 0;
  const diff = averageIntake - targetCals;
  const isSurplus = diff > 0;
  const statusStr = isSurplus ? `${diff} kcal Surplus` : `${Math.abs(diff)} kcal Deficit`;

  let suggestion = "";
  if (diff > 300) {
    suggestion = "You are in a severe surplus significantly above baseline. To maintain progress, try swapping your high-calorie evening items or junk foods for lighter choices mapped in your food library.";
  } else if (diff < -400) {
    suggestion = "You are in a severe deficit which risks metabolic crash. Ensure you aren't skipping necessary meals and consider safely adding nutrient-dense whole foods.";
  } else {
    suggestion = "You are tracking beautifully close to your baseline limits. Maintain this consistency for steady progress!";
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white pt-32 pb-20 selection:bg-emerald-500/10 selection:text-emerald-400 relative overflow-hidden">
        <div className="app-bg" />

        {/* Background Decor */}
        <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="fixed bottom-0 left-0 w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

        <main className="max-w-[1100px] mx-auto px-6 lg:px-8">

          {/* Header Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-emerald-500/20">
                <User className="w-4 h-4" />
                Performance Protocol
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none uppercase">
                Your <span className="text-emerald-500">Journey</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-slate-400 font-medium mt-4 text-[16px] max-w-xl leading-relaxed">
                Biometric retrospective and neural intake synchronization.
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="shrink-0">
              <button
                onClick={() => router.push('/account')}
                className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg active:scale-95"
              >
                Calibration Settings
              </button>
            </motion.div>
          </motion.div>

          {/* Charts & Stats Grid */}
          <div className="max-w-3xl mx-auto mb-12">

            {/* Chart 1 - Weekly Caloric Balance */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeInUp}
              className="glass-card rounded-[40px] p-8 md:p-10 flex flex-col min-h-[480px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10 z-10">
                <h2 className="text-lg font-bold text-white flex items-center gap-3 tracking-tighter uppercase">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  Caloric Trajectory
                </h2>
                <div className="bg-white/5 border border-white/10 text-[10px] font-bold rounded-xl px-4 py-2 text-slate-500 tracking-[0.2em] uppercase">
                  7-Day Window
                </div>
              </div>

              {/* Dynamic Mathematical Visual Chart */}
              <div className="flex-1 flex items-end gap-4 justify-between pb-4 border-b border-white/5 relative mt-6 h-[320px]">
                {/* Fixed Grid lines (Background) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-white/10"></div>)}
                </div>

                {/* Mathematical Target Baseline Line */}
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-slate-500 z-10 transition-all duration-700 opacity-50"
                  style={{ bottom: `calc(${(targetCals / maxY) * 304}px + 16px)` }}
                >
                  <span className="absolute -top-7 left-0 text-[10px] font-bold text-slate-400 bg-slate-900/80 backdrop-blur-sm border border-white/5 px-2 py-1 rounded-lg uppercase tracking-widest shadow-xl">Target: {targetCals} kcal</span>
                </div>

                {/* Vertical Days Bars */}
                {weeklyData.map((val, idx) => {
                  const deviation = val - targetCals;
                  const isBadDeviation = Math.abs(deviation) > 300;
                  return (
                    <div key={idx} className="w-full relative flex justify-center group h-full items-end z-0">
                      {/* The Fill Bar */}
                      <div
                        className={`w-full max-w-16 rounded-t-xl opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out cursor-pointer relative shadow-lg ${isBadDeviation
                            ? "bg-rose-500 shadow-rose-500/20"
                            : "bg-emerald-500 shadow-emerald-500/20"
                          }`}
                        style={{ height: `${Math.max(6, Math.round((val / maxY) * 304))}px` }}
                      >
                        {/* Hover Bubble Tracker */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 shadow-2xl text-white text-[11px] font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20 uppercase tracking-widest">
                          {val} KCAL
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis Labels */}
              <div className="flex justify-between items-center mt-4 text-[10px] font-bold text-slate-500 px-4 uppercase tracking-[0.2em]">
                {dayLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
              </div>

              {/* Per-day deviation row */}
              <div className="flex justify-between items-center mt-3 px-4">
                {weeklyData.map((val, idx) => {
                  const deviation = val - targetCals;
                  const isBad = Math.abs(deviation) > 300;
                  const label = val === 0 ? '–' : (deviation >= 0 ? `+${deviation}` : `${deviation}`);
                  return (
                    <span key={idx} className={`text-[11px] font-bold tracking-tighter ${val === 0 ? 'text-slate-800' : isBad ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                      {label}
                    </span>
                  );
                })}
              </div>

              {/* Synthetic Insight Panel */}
              <div className="mt-10 bg-white/5 border border-white/10 rounded-[32px] p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase ml-1">7-Day Synthesis</span>
                  <span className={`text-[13px] font-bold uppercase tracking-widest flex items-center gap-2 ${Math.abs(diff) > 300 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {statusStr}
                  </span>
                </div>
                {/* Deviation colour key */}
                <div className="flex items-center gap-6 mb-6 ml-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Baseline (±300)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Critical Deviation</span>
                  </div>
                </div>
                <div className="text-[15px] text-slate-300 font-medium leading-relaxed flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                  {Math.abs(diff) > 300 ? <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                  "{suggestion}"
                </div>
              </div>
            </motion.div>

          </div>
        </main>
        <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
      </div>
    </>
  );
}
