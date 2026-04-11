'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Loader2, Info } from 'lucide-react';

export default function Converter() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const res = await fetch('http://localhost:5000/api/meals/converter', {
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
      } else {
        setError(data.error || 'Failed to convert measurement.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Header/Back Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4 text-emerald-800">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
               <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Scale Converter</h1>
              <p className="text-gray-500 mt-1">Easily convert gram weights into standard household spoons and bowls.</p>
            </div>
          </div>
        </motion.div>

        {/* Converter Tool Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
        >
          <form onSubmit={handleConvert} className="w-full">
            <label className="block text-sm font-semibold text-gray-800 mb-2">What do you want to measure?</label>
            <div className="relative flex items-center mb-8">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 100g of raw soya chunks"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-lg rounded-2xl px-6 py-5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
              />
              <button 
                type="submit"
                disabled={isLoading || !query}
                className="absolute right-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Convert"}
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
                className="bg-emerald-50/80 p-8 rounded-2xl border border-emerald-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mt-1 shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-2">AI Estimation</h3>
                    <p className="text-xl text-gray-800 font-medium leading-relaxed">
                      {measurement}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {!isLoading && !measurement && !error && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-8">
                 <Scale className="w-12 h-12 mb-3 opacity-20" />
                 <p className="text-sm font-medium">Enter an ingredient above to get started.</p>
              </div>
            )}
          </div>

        </motion.div>

      </main>
    </div>
  );
}
