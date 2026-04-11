'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/40 border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[10px] bg-[#057A55] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[19px] font-semibold tracking-tight text-gray-900">NutriPilot</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">Home</Link>
            <Link href="/#features" className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">Features</Link>
            <Link href="/#how-it-works" className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200">How it Works</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-[#292524] font-medium mr-2">Hello, {user.full_name || user.name || 'User'}</span>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-normal text-[#ef4444] hover:text-[#dc2626] transition-colors duration-200 cursor-pointer font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login">
                  <button className="px-5 py-2.5 text-normal text-[#292524] hover:text-[#16a34a] transition-colors duration-200 cursor-pointer">Login</button>
                </a>
                <a href="/signup">
                  <button className="px-5 py-2 bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white rounded-xl shadow-lg shadow-[#22c55e]/30 text-normal font-medium transition-all duration-300 cursor-pointer">Sign Up</button>
                </a>
              </>
            )}
          </div>
          
          <button className="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
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

