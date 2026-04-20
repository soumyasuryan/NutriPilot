'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Activity, ShieldAlert, Sparkles, Loader2, Info } from 'lucide-react';
import Toast from '@/components/Toast';

export default function TheLab() {
  const router = useRouter();

  const [isJudging, setIsJudging] = useState(false);
  const [judgeData, setJudgeData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
  }, [router]);

  const handleJudge = async () => {
    setIsJudging(true);
    setJudgeData(null);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/strategy/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        setJudgeData(data.data);
        showToast("Audit Complete!", "AI has isolated your worst dietary offenders.", "success");
      } else {
        showToast("Audit Failed", data.error || "Could not analyze data.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Audit Failed", "Historical data could not be computed.", "error");
    }
    setIsJudging(false);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/10 selection:text-emerald-400">
        <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
          {/* Header/Back Navigation */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <button
              onClick={() => router.push('/home')}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all mb-8 text-[13px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Strategy Lab</h1>
                <p className="text-slate-400 mt-1 font-medium">Neural retrospective and dietary recalibration.</p>
              </div>
            </div>
          </motion.div>

          {/* The Judge Panel Full Width */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="glass-card rounded-[40px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto w-full text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2 mb-8">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase">The Swap Shop</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tighter">The Judge</h2>
              <p className="text-slate-400 text-[16px] max-w-lg mx-auto font-medium leading-relaxed">System-wide 7-day audit of metabolic logs to isolate and purge empty calories.</p>
            </div>

            <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full">
              {judgeData ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md text-left">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-rose-400 mb-3 ml-1">Critical Offender Detected</p>
                      <p className="text-3xl text-white font-bold tracking-tight leading-none">"{judgeData.offender}"</p>
                    </div>
                  </div>
                  
                  <div className="bg-rose-500/5 p-6 rounded-2xl border border-rose-500/10 mb-8">
                    <p className="text-[10px] font-bold uppercase text-rose-400 mb-3 flex items-center gap-2 tracking-widest"><Info className="w-4 h-4" /> Neural Rationale</p>
                    <p className="text-[16px] text-slate-300 leading-relaxed font-medium italic">"{judgeData.reasoning || "Empty calories identified during the audit."}"</p>
                  </div>

                  <div className="h-px w-full bg-white/5 mb-8"></div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-3 ml-1 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Recommended Swap Protocol</p>
                      <p className="text-2xl text-white font-bold tracking-tight leading-tight">"{judgeData.swap_text}"</p>
                    </div>
                    <div className="p-6 bg-emerald-500 text-white rounded-[24px] shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                       <p className="text-[10px] font-bold uppercase opacity-60 mb-2 tracking-widest">Protocol Benefits</p>
                       <p className="text-[18px] font-bold leading-tight tracking-tight">{judgeData.benefits || "Optimized nutritional profile."}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/5 border border-white/5 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
                  <Activity className="w-12 h-12 text-slate-800 mb-4 animate-pulse" />
                  <p className="text-slate-600 text-[14px] font-bold uppercase tracking-widest">Awaiting Neural Sequence...</p>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-12 max-w-2xl mx-auto w-full">
              <button
                onClick={handleJudge}
                disabled={isJudging}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-white font-bold py-5 rounded-[20px] transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex justify-center items-center gap-3 text-[15px] uppercase tracking-[0.2em]"
              >
                {isJudging ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initiate Audit Sequence"}
              </button>
            </div>
          </motion.div>
        </main>
        <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
      </div>
    </>
  );
}
