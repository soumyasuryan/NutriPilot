'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 2500) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    diet_preference: 'any',
    height: '',
    weight: '',
    goal: '',
    activity: '',
    waist: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store JWT token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserId(data.user.id);
      showToast('Account created!', 'Now let\'s set up your profile.', 'success');
      setStep(1);
    } catch (err) {
      setError(err.message);
      showToast(err.message || 'Registration failed', 'Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitProfileUpdates = async (finalData) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          age: finalData.age,
          gender: finalData.gender,
          diet_preference: finalData.diet_preference,
          height: finalData.height,
          weight: finalData.weight,
          goal: finalData.goal,
          activity: finalData.activity,
          waist: finalData.waist || null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      showToast('Profile saved!', 'Redirecting to your dashboard...', 'success');
      setTimeout(() => router.push('/home'), 1200);
    } catch (err) {
      setError(err.message);
      showToast(err.message || 'Failed to save profile', 'Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBioSubmit = (e) => {
    e.preventDefault();
    if (!formData.height || !formData.weight || !formData.age || !formData.gender || !formData.activity) {
      setError('Please fill out all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!formData.goal) {
      setError('Please select a goal');
      return;
    }
    setError('');
    if (formData.goal === 'Maintain') {
      // Skip waist measurement
      submitProfileUpdates(formData);
    } else {
      setStep(3); // Go to waist measurement
    }
  };

  const handleWaistSubmit = (e) => {
    e.preventDefault();
    submitProfileUpdates(formData);
  };

  const getProgressWidth = () => {
    if (step === 0) return '25%';
    if (step === 1) return '50%';
    if (step === 2) return '75%';
    if (step === 3) return '100%';
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 font-sans antialiased text-white selection:bg-emerald-500/10 selection:text-emerald-400 overflow-hidden relative">
        <div className="app-bg" />
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-screen pt-28 pb-12 px-4 relative z-10">

          <div className="glass-card rounded-[40px] p-10 w-full max-w-[440px] relative z-10 border border-white/5">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold tracking-tighter text-white uppercase">Nutri</span>
                <span className="text-3xl font-bold tracking-tighter text-emerald-400 uppercase">Pilot</span>
              </div>
              <h2 className="text-[28px] font-bold mt-4 mb-2 tracking-tight">
                {step === 0 && 'System Entry'}
                {step === 1 && 'Biological Calibration'}
                {step === 2 && 'Mission Objective'}
                {step === 3 && 'Neural Depth'}
              </h2>
              <p className="text-slate-400 text-sm text-center font-medium">
                {step === 0 && 'Initialize your metabolic trajectory'}
                {step === 1 && 'Define your biological baseline'}
                {step === 2 && 'Select your physiological target'}
                {step === 3 && 'Final telemetry synchronization'}
              </p>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 mb-10 overflow-hidden">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>

            {error && (
              <div className="bg-rose-500/10 text-rose-400 text-sm p-4 rounded-2xl mb-8 text-center border border-rose-500/20 font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            {/* STEP 0: Auth Details */}
            {step === 0 && (
              <form onSubmit={handleAuthSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Identity Protocol</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input type="text" name="name" className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-600" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Terminal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <input type="email" name="email" className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-600" placeholder="yourEmail@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Access Passkey</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <input type="password" name="password" className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-600" placeholder="........" value={formData.password} onChange={handleChange} required minLength={6} />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-20 uppercase tracking-widest text-[14px]">
                  {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Initialize Sequence'}
                  {!loading && <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                </button>
              </form>
            )}

            {/* STEP 1: Basic Bio */}
            {step === 1 && (
              <form onSubmit={handleBioSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Age</label>
                    <input type="number" name="age" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" placeholder="22" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Gender</label>
                    <select name="gender" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all appearance-none" value={formData.gender} onChange={handleChange} required>
                      <option value="" disabled className="bg-slate-900">Select</option>
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Activity Level</label>
                  <select name="activity" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all appearance-none" value={formData.activity} onChange={handleChange} required>
                    <option value="" disabled className="bg-slate-900">Select Activity Level</option>
                    <option value="No activity" className="bg-slate-900">No activity</option>
                    <option value="Very little exercise" className="bg-slate-900">Very little exercise</option>
                    <option value="Moderate exercise" className="bg-slate-900">Moderate exercise</option>
                    <option value="Intensive exercise" className="bg-slate-900">Intensive exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Diet Preference</label>
                  <select name="diet_preference" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all appearance-none" value={formData.diet_preference} onChange={handleChange} required>
                    <option value="veg" className="bg-slate-900">Veg</option>
                    <option value="non_veg" className="bg-slate-900">Non-Veg</option>
                    <option value="any" className="bg-slate-900">Any</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Height (cm)</label>
                    <input type="number" name="height" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all" placeholder="175" value={formData.height} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Weight (kg)</label>
                    <input type="number" step="0.1" name="weight" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all" placeholder="70.5" value={formData.weight} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 mt-4 uppercase tracking-widest text-[14px]">
                  Next Protocol
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </form>
            )}

            {/* STEP 2: Goal Selection */}
            {step === 2 && (
              <form onSubmit={handleGoalSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {['Cut', 'Bulk', 'Maintain'].map((g) => (
                  <div
                    key={g}
                    onClick={() => setFormData({ ...formData, goal: g })}
                    className={`p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${formData.goal === g ? 'border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/20' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors ${formData.goal === g ? 'border-emerald-400' : 'border-slate-700'}`}>
                        {formData.goal === g && <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>}
                      </div>
                      <span className={`text-[15px] font-bold tracking-tight ${formData.goal === g ? 'text-white' : 'text-slate-400'}`}>{g.toUpperCase()}</span>
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-20 uppercase tracking-widest text-[14px]">
                  {loading ? 'Completing...' : 'Synchronize Target'}
                  {!loading && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                </button>
              </form>
            )}

            {/* STEP 3: Deep Dive */}
            {step === 3 && (
              <form onSubmit={handleWaistSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Waist Measurement (cm)</label>
                  <p className="text-[12px] text-slate-400 mb-4 font-medium leading-relaxed italic">System precision is optimized with abdominal telemetry during a {formData.goal.toLowerCase()}.</p>
                  <input type="number" step="0.1" name="waist" className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[15px] font-bold text-white focus:ring-4 focus:ring-emerald-400/10 focus:border-emerald-400 outline-none transition-all" placeholder="80" value={formData.waist} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-20 uppercase tracking-widest text-[14px]">
                  {loading ? 'Finalizing...' : 'Complete Synchronization'}
                  {!loading && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              </form>
            )}

            {step === 0 && (
              <p className="text-center text-[13px] text-slate-500 font-bold mt-10">
                Already registered? <a href="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase ml-1">Initiate Login</a>
              </p>
            )}
          </div>
        </div>
      </div>
      <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
    </>
  );
}
