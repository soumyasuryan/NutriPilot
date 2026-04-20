import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Twitter = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Github = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const Linkedin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 relative overflow-hidden pt-10 pb-10">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-4">
            <Link href="/" className="flex items-center group w-fit mb-6">
              <span className="text-[28px] font-bold tracking-tighter text-white ">Nutri</span>
              <span className="text-[28px] font-bold tracking-tighter text-emerald-400 ">Pilot</span>
            </Link>
            <p className="text-[15px] text-slate-400 leading-relaxed max-w-[280px] font-medium">
              Metabolic optimization through neural retrospectives. Eat smart, save money, and hit your biological targets.
            </p>
          </div>

          {/* Product Links */}
          <div className="col-span-1 md:col-span-2 md:ml-auto">
            <h3 className="text-[14px] font-bold text-white mb-6 uppercase tracking-widest">Protocol</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/#features" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* System Links */}
          <div className="col-span-1 md:col-span-2 md:ml-auto">
            <h3 className="text-[14px] font-bold text-white mb-6 uppercase tracking-widest">System</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-slate-400 hover:text-emerald-400 transition-all font-medium">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Social Connect */}
          <div className="col-span-1 md:col-span-3 md:ml-auto">
            <h3 className="text-[14px] font-bold text-white mb-6 uppercase tracking-widest">Connect</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white border border-white/5 transition-all duration-300 group">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white border border-white/5 transition-all duration-300 group">
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white border border-white/5 transition-all duration-300 group">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 ">
          <p className="text-[13px] text-slate-500 font-medium">
            © 2026 NutriPilot. Systems initialized. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
