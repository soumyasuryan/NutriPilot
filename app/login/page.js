'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 2500) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      showToast('Logged in successfully!', `Welcome back, ${data.user?.full_name || data.user?.name || 'User'}!`, 'success');
      setTimeout(() => router.push('/home'), 1200);
    } catch (err) {
      setError(err.message);
      showToast(err.message || 'Login failed', 'Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 font-sans antialiased text-white selection:bg-emerald-500/10 selection:text-emerald-400 overflow-hidden relative">
        <div className="app-bg" />
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-screen pt-28 pb-12 px-4">

          <div className="glass-card rounded-[40px] p-10 w-full max-w-[440px] relative z-10 border border-white/5">
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold tracking-tighter text-white uppercase">Nutri</span>
                <span className="text-3xl font-bold tracking-tighter text-emerald-400 uppercase">Pilot</span>
              </div>
              <h2 className="text-[28px] font-bold mt-4 mb-2 tracking-tight">Welcome back</h2>
              <p className="text-slate-400 text-sm font-medium">Access your metabolic command center</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 text-rose-400 text-sm p-4 rounded-2xl mb-8 text-center border border-rose-500/20 font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Protocol</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-600"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Secure Passkey</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-600"
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <a href="#" className="text-[12px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest transition-colors">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-[14px]"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : "Initiate Login"}
              </button>
            </form>

            <p className="text-center text-[13px] text-slate-500 font-bold mt-10">
              New to the platform? <a href="/signup" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase ml-1">Create Account</a>
            </p>
          </div>
        </div>
      </div>
      <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
    </>
  );
}
