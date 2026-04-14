'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Activity, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
          {/* Header/Back Navigation */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <button 
              onClick={() => router.push('/home')}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4 text-emerald-800">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">The Lab</h1>
                <p className="text-gray-500 mt-1">Uncover dietary weaknesses and optimize your week.</p>
              </div>
            </div>
          </motion.div>

          {/* The Judge Panel Full Width */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between">
            
            <div className="relative z-10 max-w-2xl mx-auto w-full text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span className="text-[13px] font-bold text-emerald-700 tracking-wide uppercase">The Swap Shop</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">The Judge</h2>
              <p className="text-gray-500 text-[15px] max-w-lg mx-auto">Executes a harsh 7-day retrospective on your physical data logs to isolate unnecessary empty calories.</p>
            </div>
              
            <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full">
              {judgeData ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 backdrop-blur-sm text-left">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#057A55] mb-2">Worst Offender Detected</p>
                  <p className="text-2xl text-gray-900 font-bold mb-6">"{judgeData.offender}"</p>
                  
                  <div className="h-px w-full bg-emerald-200/50 mb-6"></div>
                  
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#057A55] mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> AI Swap Protocol</p>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">"{judgeData.swap_text}"</p>
                </motion.div>
              ) : (
                  <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-32 border-dashed">
                    <Activity className="w-8 h-8 text-emerald-200 mb-2"/>
                    <p className="text-gray-400 text-[14px] font-medium">Awaiting analysis sequence...</p>
                  </div>
              )}
            </div>

            <div className="relative z-10 mt-10 max-w-2xl mx-auto w-full">
              <button 
                onClick={handleJudge} 
                disabled={isJudging}
                className="w-full bg-[#057A55] hover:bg-[#046C4E] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 text-[15px]"
              >
                {isJudging ? <Loader2 className="w-5 h-5 animate-spin"/> : "Run Historical Audit"}
              </button>
            </div>
          </motion.div>
        </main>
        <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
      </div>
    </>
  );
}
