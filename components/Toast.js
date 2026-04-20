'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

/**
 * Toast notification component.
 * @param {boolean} show - whether toast is visible
 * @param {string} message - primary message
 * @param {string} [sub] - optional subtitle
 * @param {'success'|'error'|'info'} [type='success']
 */
export default function Toast({ show, message, sub, type = 'success' }) {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      ring: 'bg-emerald-500/10',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      ring: 'bg-rose-500/10',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      ring: 'bg-blue-500/10',
    },
  }[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-9999 flex items-center gap-5 bg-slate-900/80 backdrop-blur-3xl text-white px-6 py-5 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 min-w-[340px]"
        >
          <div className={`w-12 h-12 rounded-2xl ${config.ring} flex items-center justify-center shrink-0 border border-white/5`}>
            {config.icon}
          </div>
          <div>
            <p className="text-[15px] font-bold uppercase tracking-tight leading-none mb-1">{message}</p>
            {sub && <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
