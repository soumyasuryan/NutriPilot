'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Loader2, Info } from 'lucide-react';
import Toast from '@/components/Toast';

export default function Converter() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setMeasurement('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/meals/converter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (data.success) {
        setMeasurement(data.measurement);
        showToast("Gram Conversion Ready!", "AI has estimated the household measurement.", "success");
      } else {
        setError(data.error || 'Failed to convert measurement.');
        showToast("Conversion Failed", data.error || "Could not process this query.", "error");
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
      showToast("Network Error", "Converter engine is currently unreachable.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/10 selection:text-emerald-400">
        <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
          {/* Header/Back Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={() => router.push('/home')}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all mb-8 text-[13px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Scale Converter</h1>
                <p className="text-slate-400 mt-1 font-medium">Volumetric neural translation for culinary precision.</p>
              </div>
            </div>
          </motion.div>

          {/* Converter Tool Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[40px] p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <form onSubmit={handleConvert} className="w-full relative z-10">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Calibrate Measurement</label>
              <div className="relative flex items-center mb-10">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 100g of raw soya chunks"
                  className="w-full bg-white/5 border border-white/10 text-white text-lg rounded-2xl px-6 py-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-bold"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query}
                  className="absolute right-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-[13px]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Compute"}
                </button>
              </div>
            </form>

            {/* Result Area */}
            <div className="min-h-[120px]">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              {!isLoading && measurement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 p-8 rounded-[24px] border border-emerald-500/20 shadow-inner relative z-10"
                >
                  <div className="flex items-start gap-5">
                    <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl shrink-0 border border-emerald-500/20 shadow-lg">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Neural Prediction</h3>
                      <p className="text-xl text-white font-bold leading-tight tracking-tight">
                        {measurement}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

               {!isLoading && !measurement && !error && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 mt-12 opacity-40">
                  <Scale className="w-16 h-16 mb-4" />
                  <p className="text-[13px] font-bold uppercase tracking-widest">Awaiting Volumetric Input</p>
                </div>
              )}
            </div>

          </motion.div>

        </main>
        <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
      </div>
    </>
  );
}
