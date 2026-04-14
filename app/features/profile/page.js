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
  const averageIntake = activeDays.length > 0 ? Math.round(activeDays.reduce((a,b)=>a+b, 0) / activeDays.length) : 0;
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
      <div className="min-h-screen bg-[#FCFCFD] text-gray-900 pt-32 pb-20 selection:bg-blue-500/10 selection:text-blue-600 relative">
        
        {/* Background Decor */}
        <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-emerald-50/60 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
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
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                 <User className="w-3.5 h-3.5" />
                 Profile & Progress
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
                 Your <span className="text-emerald-600">Journey</span>.
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-gray-500 font-medium mt-3 text-[16px] max-w-xl leading-relaxed">
                 Track your weekly caloric balance and manage your personal food library.
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="flex-shrink-0">
              <button 
                onClick={() => router.push('/account')}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
              >
                My Profile Settings
              </button>
            </motion.div>
          </motion.div>

          {/* Charts & Stats Grid */}
          <div className="max-w-3xl mx-auto mb-12">
            
            {/* Chart 1 - Weekly Caloric Balance */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col min-h-[460px] relative overflow-hidden"
            >
               <div className="flex items-center justify-between mb-8 z-10">
                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                   <Activity className="w-5 h-5 text-emerald-500" />
                   Weekly Caloric Balance
                 </h2>
                 <div className="bg-gray-50 border border-gray-100 text-[12px] font-bold rounded-lg px-3 py-1.5 text-gray-500 tracking-wide uppercase">
                   Last 7 Days
                 </div>
               </div>
               
               {/* Dynamic Mathematical Visual Chart */}
               <div className="flex-1 flex items-end gap-3 justify-between pb-4 border-b border-gray-200 relative mt-4 h-[320px]">
                 {/* Fixed Grid lines (Background) */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                   {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-gray-50/80"></div>)}
                 </div>

                 {/* Mathematical Target Baseline Line */}
                 <div 
                   className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400 z-10 transition-all duration-700"
                   style={{ bottom: `calc(${(targetCals / maxY) * 304}px + 16px)` }}
                 >
                    <span className="absolute -top-7 left-0 text-[11px] font-bold text-gray-600 bg-white/90 backdrop-blur-sm border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">Target: {targetCals} kcal</span>
                 </div>
                 
                 {/* Vertical Days Bars */}
                 {weeklyData.map((val, idx) => {
                   const deviation = val - targetCals;
                   const isBadDeviation = Math.abs(deviation) > 300;
                   return (
                   <div key={idx} className="w-full relative flex justify-center group h-full items-end z-0">
                      {/* The Fill Bar */}
                      <div 
                        className={`w-full max-w-[4rem] rounded-t-lg opacity-90 group-hover:opacity-100 transition-all duration-500 ease-out cursor-pointer relative ${
                          isBadDeviation
                            ? "bg-red-400 bg-linear-to-t from-red-100/40 to-red-400 group-hover:to-red-500" 
                            : "bg-emerald-400 bg-linear-to-t from-emerald-100/40 to-emerald-400 group-hover:to-emerald-500"
                        }`}
                        style={{ height: `${Math.max(4, Math.round((val / maxY) * 304))}px` }}
                      >
                        {/* Hover Bubble Tracker */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 shadow-xl text-white text-[12px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          {val} kcal
                        </div>
                      </div>
                   </div>
                   );
                 })}
               </div>

               {/* X-axis Labels */}
               <div className="flex justify-between items-center mt-3 text-[11px] font-bold text-gray-400 px-3 uppercase tracking-wider">
                 {dayLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
               </div>

               {/* Per-day deviation row */}
               <div className="flex justify-between items-center mt-2 px-3">
                 {weeklyData.map((val, idx) => {
                   const deviation = val - targetCals;
                   const isBad = Math.abs(deviation) > 300;
                   const label = val === 0 ? '–' : (deviation >= 0 ? `+${deviation}` : `${deviation}`);
                   return (
                     <span key={idx} className={`text-[10px] font-bold tracking-tight ${
                       val === 0 ? 'text-gray-300' : isBad ? 'text-red-500' : 'text-emerald-500'
                     }`}>
                       {label}
                     </span>
                   );
                 })}
               </div>

               {/* Synthetic Insight Panel */}
               <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-[12px] font-bold text-gray-500 tracking-wide uppercase">7-Day Avg</span>
                     <span className={`text-sm font-bold flex items-center gap-1 ${Math.abs(diff) > 300 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {statusStr}
                     </span>
                  </div>
                  {/* Deviation colour key */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                      <span className="text-[11px] text-gray-500 font-medium">Within ±300 kcal of target</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                      <span className="text-[11px] text-gray-500 font-medium">&gt;300 kcal deviation</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium leading-relaxed flex items-start gap-2">
                     {Math.abs(diff) > 300 ? <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                     {suggestion}
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
