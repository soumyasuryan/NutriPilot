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
      <div className="min-h-screen bg-linear-to-br from-[#f0fdf4] via-white to-[#f0fdf4] font-sans antialiased text-[#292524]">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-screen pt-28 pb-12 px-4">

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 w-full max-w-[440px] border border-gray-100 relative z-10 transition-all duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold tracking-tight text-gray-900">Nutri</span>
                <span className="text-3xl font-bold tracking-tight text-[#16a34a]">Pilot</span>
              </div>
              <h2 className="text-[28px] font-bold mt-4 mb-2">
                {step === 0 && 'Create your account'}
                {step === 1 && 'Basic Bio'}
                {step === 2 && 'Your Goal'}
                {step === 3 && 'The Deep Dive'}
              </h2>
              <p className="text-gray-500 text-sm text-center">
                {step === 0 && 'Start your journey to better nutrition'}
                {step === 1 && 'Help us understand your baseline'}
                {step === 2 && 'What are you trying to achieve?'}
                {step === 3 && 'Just one more metric for precision'}
              </p>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
              <div
                className="bg-[#22c55e] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            {/* STEP 0: Auth Details */}
            {step === 0 && (
              <form onSubmit={handleAuthSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input type="text" name="name" className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all placeholder:text-gray-400" placeholder="Rahul Sharma" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </div>
                    <input type="email" name="email" className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all placeholder:text-gray-400" placeholder="rahul@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <input type="password" name="password" className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all placeholder:text-gray-400" placeholder="........" value={formData.password} onChange={handleChange} required minLength={6} />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : 'Continue'}
                  {!loading && <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                </button>
              </form>
            )}

            {/* STEP 1: Basic Bio */}
            {step === 1 && (
              <form onSubmit={handleBioSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                    <input type="number" name="age" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" placeholder="22" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                    <select name="gender" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" value={formData.gender} onChange={handleChange} required>
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Activity Level</label>
                  <select name="activity" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" value={formData.activity} onChange={handleChange} required>
                    <option value="" disabled>Select Activity Level</option>
                    <option value="No activity">No activity</option>
                    <option value="Very little exercise">Very little exercise</option>
                    <option value="Moderate exercise">Moderate exercise</option>
                    <option value="Intensive exercise">Intensive exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Diet Preference</label>
                  <select name="diet_preference" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" value={formData.diet_preference} onChange={handleChange} required>
                    <option value="veg">Veg</option>
                    <option value="non_veg">Non-Veg</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Height (cm)</label>
                  <input type="number" name="height" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" placeholder="175" value={formData.height} onChange={handleChange} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
                  <input type="number" step="0.1" name="weight" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" placeholder="70.5" value={formData.weight} onChange={handleChange} required />
                </div>

                <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 mt-4">
                  Continue
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </form>
            )}

            {/* STEP 2: Goal Selection */}
            {step === 2 && (
              <form onSubmit={handleGoalSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {['Cut', 'Bulk', 'Maintain'].map((g) => (
                  <div
                    key={g}
                    onClick={() => setFormData({ ...formData, goal: g })}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.goal === g ? 'border-[#22c55e] bg-green-50/50 ring-1 ring-[#22c55e]' : 'border-gray-200 hover:border-[#22c55e]/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex shrink-0 items-center justify-center ${formData.goal === g ? 'border-[#22c55e]' : 'border-gray-300'}`}>
                        {formData.goal === g && <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>}
                      </div>
                      <span className="font-medium text-[#292524]">{g}</span>
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={loading} className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Completing...' : 'Continue'}
                  {!loading && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
                </button>
              </form>
            )}

            {/* STEP 3: Deep Dive */}
            {step === 3 && (
              <form onSubmit={handleWaistSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Waist Measurement (cm)</label>
                  <p className="text-xs text-gray-500 mb-3">Optional, but highly recommended for precise tracking during a {formData.goal.toLowerCase()}.</p>
                  <input type="number" step="0.1" name="waist" className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all" placeholder="80" value={formData.waist} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Completing setup...' : 'Finish Setup'}
                  {!loading && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              </form>
            )}

            {step === 0 && (
              <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account? <a href="/login" className="text-[#22c55e] font-medium hover:underline">Log in</a>
              </p>
            )}
          </div>
        </div>
      </div>
      <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
    </>
  );
}
