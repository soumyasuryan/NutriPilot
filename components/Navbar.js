'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Could not parse user data");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a className="flex items-center gap-2 group" href="/">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/30 group-hover:shadow-xl group-hover:shadow-[#22c55e]/40 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-white">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                <path d="M20 3v4"></path>
                <path d="M22 5h-4"></path>
                <path d="M4 17v2"></path>
                <path d="M5 18H3"></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#292524]">NutriPilot</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-normal text-[#57534e] hover:text-[#292524] transition-colors duration-200 relative group" href="/">Home<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] group-hover:w-full transition-all duration-300"></span></a>
            <a className="text-normal text-[#57534e] hover:text-[#292524] transition-colors duration-200 relative group" href="/#features">Features<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] group-hover:w-full transition-all duration-300"></span></a>
            <a className="text-normal text-[#57534e] hover:text-[#292524] transition-colors duration-200 relative group" href="/#how-it-works">How it Works<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] group-hover:w-full transition-all duration-300"></span></a>
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
          <button className="md:hidden w-10 h-10 rounded-xl bg-[#f5f5f4] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-5 h-5 text-[#292524]">
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

