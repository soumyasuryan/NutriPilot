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
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      ring: 'bg-emerald-500/20',
    },
    error: {
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      ring: 'bg-red-500/20',
    },
    info: {
      icon: <Info className="w-4 h-4 text-blue-400" />,
      ring: 'bg-blue-500/20',
    },
  }[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/20 border border-white/10 min-w-[280px]"
        >
          <div className={`w-7 h-7 rounded-full ${config.ring} flex items-center justify-center shrink-0`}>
            {config.icon}
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-tight">{message}</p>
            {sub && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{sub}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
