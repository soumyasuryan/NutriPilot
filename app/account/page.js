'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, User, Shield, Info, Droplet, ActivitySquare, Wheat, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import Toast from '@/components/Toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', height: '', weight: '', waist_cm: '', fitness_goal: 'Cut', activity_level: 'Light', diet_preference: 'any'
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', sub: '', type: 'success' });

  const showToast = (message, sub, type = 'success', duration = 3000) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), duration);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsAuthorized(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);

      // Fetch profile data from API
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${storedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData({
            name: storedUser.full_name || storedUser.name || '',
            age: data.age || '',
            gender: data.gender || 'Male',
            height: data.height || '',
            weight: data.weight || '',
            waist_cm: data.waist_cm || '',
            fitness_goal: data.fitness_goal || 'Cut',
            activity_level: data.activity_level || 'Light',
            diet_preference: data.diet_preference || 'any',
          });
        })
        .catch(err => console.error("Error fetching profile", err));
    } catch (err) {
      console.error("Invalid user JSON");
    }
  }, [router]);

  const handleUpdateGoals = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          waist: formData.waist_cm,
          goal: formData.fitness_goal,
          activity: formData.activity_level,
          diet_preference: formData.diet_preference,
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Targets Recalibrated!", "Your caloric and macro limits have been updated.", "success");
        setProfile(data.data); // Update displayed macros
        
        // Update local user if name changed
        const newUser = { ...user, full_name: formData.name };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        showToast("Update Failed", data.error || "Failed to update targets.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("System Error", "Connection failed. Please try again later.", "error");
    }
    setIsUpdating(false);
  };

  if (!isAuthorized) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-slate-950 pt-28 pb-20 selection:bg-emerald-500/10 selection:text-emerald-400">
        <main className="max-w-[800px] mx-auto px-6">

          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[32px] font-bold mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] border-4 border-white/10">
              {(formData.name || user?.full_name || user?.name || 'U')[0].toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Profile</h1>
            <p className="text-slate-400 font-medium">System biometrics and nutritional parameters.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-8"
          >
            {/* Section 1: Security & Identity */}
            <motion.div variants={fadeInUp} className="glass-card rounded-[32px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[14px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" /> Identity Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full bg-white/5 border border-white/10 text-white font-medium text-[16px] rounded-2xl pl-11 pr-4 py-4 shadow-lg focus:border-emerald-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="w-full bg-white/5 border border-white/5 text-slate-500 font-medium text-[16px] rounded-2xl pl-11 pr-4 py-4 cursor-not-allowed">
                      {user?.email || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Health Biometrics Form */}
            <motion.div variants={fadeInUp} className="glass-card rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[14px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <ActivitySquare className="w-5 h-5 text-blue-400" /> Health Biometrics & Goals
                </h2>
              </div>

              <form onSubmit={handleUpdateGoals} className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 block ml-1">Age</label>
                    <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none text-white font-bold text-[16px] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block ml-1">Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none text-white font-bold text-[16px] transition-all appearance-none">
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 block ml-1">Height (cm)</label>
                    <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none text-white font-bold text-[16px] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2 block ml-1">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-orange-500 outline-none text-white font-bold text-[16px] transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Waist (cm)</label>
                    <input type="number" value={formData.waist_cm} onChange={e => setFormData({ ...formData, waist_cm: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none text-white font-bold text-[15px] transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Direction</label>
                    <select value={formData.fitness_goal} onChange={e => setFormData({ ...formData, fitness_goal: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none text-white font-bold text-[15px] transition-all appearance-none">
                      <option value="Cut" className="bg-slate-900">Cut (Lose Fat)</option>
                      <option value="Bulk" className="bg-slate-900">Bulk (Gain Mass)</option>
                      <option value="Maintain" className="bg-slate-900">Maintain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Activity</label>
                    <select value={formData.activity_level} onChange={e => setFormData({ ...formData, activity_level: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none text-white font-bold text-[15px] transition-all appearance-none">
                      <option value="Light" className="bg-slate-900">Light</option>
                      <option value="Moderate" className="bg-slate-900">Moderate</option>
                      <option value="Heavy" className="bg-slate-900">Heavy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Diet</label>
                    <select value={formData.diet_preference} onChange={e => setFormData({ ...formData, diet_preference: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none text-white font-bold text-[15px] transition-all appearance-none">
                      <option value="veg" className="bg-slate-900">Veg</option>
                      <option value="non_veg" className="bg-slate-900">Non-Veg</option>
                      <option value="any" className="bg-slate-900">Any</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <button type="submit" disabled={isUpdating} className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-[14px]">
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Recalibrate System"}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Section 3: Nutritional Blueprint */}
            <motion.div variants={fadeInUp} className="glass-card rounded-[32px] p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[14px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" /> Nutritional Blueprint
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Daily Target calories */}
                <div className="md:col-span-4 bg-white/5 border border-white/5 rounded-[24px] p-8 flex items-center justify-between shadow-inner">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Daily Calorie Budget</p>
                    <div className="text-[40px] font-bold text-white tracking-tighter leading-none">{profile?.target_calories || "-"} <span className="text-xl text-slate-500 font-bold tracking-normal uppercase ml-1">kcal</span></div>
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-[20px] p-6 text-center shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-lg"><Wheat className="w-6 h-6" /></div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Protein</p>
                  <p className="text-[24px] font-bold text-white">{profile?.target_protein || "-"}g</p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-[20px] p-6 text-center shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-lg"><TrendingUp className="w-6 h-6" /></div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Carbs</p>
                  <p className="text-[24px] font-bold text-white">{profile?.target_carbs || "-"}g</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] p-6 text-center md:col-span-2 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-lg"><Droplet className="w-6 h-6" /></div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Fats</p>
                  <p className="text-[24px] font-bold text-white">{profile?.target_fats || "-"}g</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </main>
        <Toast show={toast.show} message={toast.message} sub={toast.sub} type={toast.type} />
      </div>
    </>
  );
}
