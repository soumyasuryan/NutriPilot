'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Could not parse user data");
          }
        } else {
          setUser(null);
        }
      }
    };

    checkUser();

    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('logoutToast', 'true');
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            <Link href={user ? "/home" : "/"} className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white">Nutri</span><span className="text-2xl font-bold tracking-tight text-emerald-400">Pilot</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/home" className="relative group/link text-lg font-medium text-slate-400 hover:text-white transition-colors duration-200 py-2">
                Home
                <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover/link:w-full rounded-full"></span>
              </Link>

              {/* Features Dropdown */}
              <div className="relative group flex items-center h-full">
                <button className="relative flex items-center gap-1 text-lg font-medium text-slate-400 hover:text-white transition-colors duration-200 py-2 cursor-pointer">
                  Features
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform duration-300">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full pt-2 left-1/2 -translate-x-1/2 mt-0 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-1">

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        user ? router.push('/features/the-lab') : router.push('/login');
                      }}
                      className="flex items-start gap-3 w-full text-left p-3 hover:bg-white/5 rounded-xl transition-colors group/item cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">Weekly Audit</div>
                        <div className="text-[12px] font-medium text-slate-400 mt-0.5">Weekly Meal Analysis & Recommendations</div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        user ? router.push('/features/profile') : router.push('/login');
                      }}
                      className="flex items-start gap-3 w-full text-left p-3 hover:bg-white/5 rounded-xl transition-colors group/item cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">Profile & Progress</div>
                        <div className="text-[12px] font-medium text-slate-400 mt-0.5">Historical Charts & Lib</div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        user ? router.push('/budget') : router.push('/login');
                      }}
                      className="flex items-start gap-3 w-full text-left p-3 hover:bg-white/5 rounded-xl transition-colors group/item cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">Budget Optimizer</div>
                        <div className="text-[12px] font-medium text-slate-400 mt-0.5">Cheaper Macro Alternatives</div>
                      </div>
                    </button>

                  </div>
                </div>
              </div>

              <Link href="/howitworks" className="relative group/link text-lg font-medium text-slate-400 hover:text-white transition-colors duration-200 py-2">
                How it Works
                <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover/link:w-full rounded-full"></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2 relative group">
                  
                  {/* Profile Chip Trigger */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-3 group-hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[12px] font-bold">
                      {(user.full_name || user.name || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-[14px] font-medium text-white">{user.full_name || user.name || 'User'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:rotate-180 transition-transform duration-300 ml-1">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {/* Profile Dropdown Panel */}
                  <div className="absolute top-full pt-3 right-0 mt-0 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-2 flex flex-col gap-1">
                      
                      {/* User Mini Header */}
                      <div className="px-3 py-3 border-b border-white/5 mb-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[16px] font-bold shrink-0">
                          {(user.full_name || user.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[14px] font-bold text-white truncate">{user.full_name || user.name}</div>
                          <div className="text-[12px] text-slate-400 font-medium truncate">{user.email || 'student@domain.com'}</div>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          router.push('/account');
                        }}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors cursor-pointer mt-1 group/btn"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover/btn:scale-105 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <span className="text-[14px] font-medium">My Profile</span>
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors cursor-pointer group/btn"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover/btn:scale-105 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        </div>
                        <span className="text-[14px] font-medium">Logout</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <>
                  <a href="/login">
                    <button className="px-5 py-2 text-[15px] font-medium text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer">Login</button>
                  </a>
                  <a href="/signup">
                    <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-400/20 text-[15px] font-bold hover:bg-emerald-400 transition-all duration-300 cursor-pointer">Sign Up</button>
                  </a>
                </>
              )}
            </div>

            <button onClick={handleToggleMobileMenu} className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-95">
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={handleToggleMobileMenu} />
      )}
      
      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 right-0 w-[280px] bg-slate-900/90 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-500 ease-[0.22,1,0.36,1] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tighter text-white uppercase">Nutri<span className="text-emerald-400">Pilot</span></span>
            <button onClick={handleToggleMobileMenu} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Command Hub</p>
                <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-lg font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">Terminal</Link>
                <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-lg font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">Protocol</Link>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Neural Modules</p>
                <Link href="/features/the-lab" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/20 group-active:scale-90 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>
                  </div>
                  <span className="font-bold text-white uppercase tracking-tight text-[15px]">Weekly Audit</span>
                </Link>
                <Link href="/features/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 group-active:scale-90 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <span className="font-bold text-white uppercase tracking-tight text-[15px]">Retrospective</span>
                </Link>
                <Link href="/budget" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 py-3 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 group-active:scale-90 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  </div>
                  <span className="font-bold text-white uppercase tracking-tight text-[15px]">Optimizer</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-xl">
            {user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                    {(user.full_name || user.name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate uppercase tracking-tight">{user.full_name || user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 px-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Account
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center py-4 px-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-bold text-rose-400 uppercase tracking-widest hover:bg-rose-500/20 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 px-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 px-4 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(52,211,153,0.3)] active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

