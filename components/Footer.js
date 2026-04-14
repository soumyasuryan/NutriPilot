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
    <footer className="bg-[#232121] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <Link href="/" className="flex items-center group w-fit mb-6 mt-2">
              <span className="text-[26px] font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">Nutri</span>
              <span className="text-[26px] font-bold tracking-tight text-[#057a55] transition-opacity group-hover:opacity-90">Pilot</span>
            </Link>
            <p className="text-[14px] text-stone-400 leading-relaxed max-w-[260px]">
              AI-powered nutrition coach helping students eat better and save money
            </p>
          </div>

          {/* Product Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:ml-8">
            <h3 className="text-[15px] font-semibold text-white mb-6">Product</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/#features" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3 lg:ml-8">
            <h3 className="text-[15px] font-semibold text-white mb-6">Company</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="#" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-stone-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3 lg:ml-auto">
            <h3 className="text-[15px] font-semibold text-white mb-6">Connect</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-[12px] bg-white/5 flex flex-col items-center justify-center text-stone-400 hover:bg-[#16a34a] hover:text-white transition-all duration-300">
                <Twitter className="w-[18px] h-[18px]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-[12px] bg-white/5 flex flex-col items-center justify-center text-stone-400 hover:bg-[#16a34a] hover:text-white transition-all duration-300">
                <Github className="w-[18px] h-[18px]" />
              </a>
              <a href="#" className="w-10 h-10 rounded-[12px] bg-white/5 flex flex-col items-center justify-center text-stone-400 hover:bg-[#16a34a] hover:text-white transition-all duration-300">
                <Linkedin className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-stone-400">
            © 2026 NutriPilot. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[13px] text-stone-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-[13px] text-stone-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[13px] text-stone-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
