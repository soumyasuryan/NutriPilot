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
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl supports-backdrop-filter:bg-white/40 border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <Link href={user ? "/home" : "/"} className="flex items-center gap-2.5 group cursor-pointer">
            <div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">Nutri</span><span className="text-2xl font-bold tracking-tight text-green-600">Pilot</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/home" className="relative group/link text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 py-2">
              Home
              <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-[#16a34a] transition-all duration-300 group-hover/link:w-full rounded-full"></span>
            </Link>

            {/* Features Dropdown */}
            <div className="relative group flex items-center h-full">
              <button className="relative flex items-center gap-1 text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 py-2 cursor-pointer">
                Features
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform duration-300">
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-[#16a34a] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </button>

              {/* Dropdown Panel */}
              <div className="absolute top-full pt-2 left-1/2 -translate-x-1/2 mt-0 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-200/80 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl p-2 flex flex-col gap-1">

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      user ? router.push('/features/the-lab') : router.push('/login');
                    }}
                    className="flex items-start gap-3 w-full text-left p-3 hover:bg-gray-50/80 rounded-xl transition-colors group/item cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">The Lab</div>
                      <div className="text-[12px] font-medium text-gray-500 mt-0.5">Goal & Strategy Setting</div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      user ? router.push('/features/profile') : router.push('/login');
                    }}
                    className="flex items-start gap-3 w-full text-left p-3 hover:bg-gray-50/80 rounded-xl transition-colors group/item cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">Profile & Progress</div>
                      <div className="text-[12px] font-medium text-gray-500 mt-0.5">Historical Charts & Lib</div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      user ? router.push('/budget') : router.push('/login');
                    }}
                    className="flex items-start gap-3 w-full text-left p-3 hover:bg-gray-50/80 rounded-xl transition-colors group/item cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-gray-900">Budget Optimizer</div>
                      <div className="text-[12px] font-medium text-gray-500 mt-0.5">Cheaper Macro Alternatives</div>
                    </div>
                  </button>

                </div>
              </div>
            </div>

            <Link href="/howitworks" className="relative group/link text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 py-2">
              How it Works
              <span className="absolute left-0 bottom-1 w-0 h-[2px] bg-[#16a34a] transition-all duration-300 group-hover/link:w-full rounded-full"></span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4 border-l border-gray-200/60 pl-6 ml-2 relative group">
                
                {/* Profile Chip Trigger */}
                <div className="flex items-center gap-2 bg-gray-50/80 border border-gray-100 rounded-full py-1.5 px-3 group-hover:bg-gray-100 transition-colors cursor-pointer shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#16a34a] to-[#046C4E] flex items-center justify-center text-white text-[12px] font-bold">
                    {(user.full_name || user.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-[14px] font-medium text-[#292524]">{user.full_name || user.name || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:rotate-180 transition-transform duration-300 ml-1">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {/* Profile Dropdown Panel */}
                <div className="absolute top-full pt-3 right-0 mt-0 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] rounded-2xl p-2 flex flex-col gap-1">
                    
                    {/* User Mini Header */}
                    <div className="px-3 py-3 border-b border-gray-100/80 mb-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#16a34a] to-[#046C4E] flex items-center justify-center text-white text-[16px] font-bold shrink-0">
                        {(user.full_name || user.name || 'U')[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[14px] font-bold text-gray-900 truncate">{user.full_name || user.name}</div>
                        <div className="text-[12px] text-gray-500 font-medium truncate">{user.email || 'student@domain.com'}</div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/account');
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors cursor-pointer mt-1 group/btn"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/btn:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <span className="text-[14px] font-medium">My Profile</span>
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer group/btn"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center group-hover/btn:scale-105 transition-transform">
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
                  <button className="px-5 py-2 text-[15px] font-medium text-[#292524] hover:text-[#16a34a] transition-colors duration-200 cursor-pointer">Login</button>
                </a>
                <a href="/signup">
                  <button className="px-5 py-2.5 bg-linear-to-r from-[#16a34a] to-[#22c55e] text-white rounded-xl shadow-lg shadow-[#22c55e]/30 text-[15px] font-medium transition-all duration-300 cursor-pointer">Sign Up</button>
                </a>
              </>
            )}
          </div>

          <button className="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-700">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

