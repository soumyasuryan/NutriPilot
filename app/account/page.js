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
    height: '', weight: '', waist_cm: '', fitness_goal: 'Cut', activity_level: 'Light', diet_preference: 'any'
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
          age: profile?.age || 25,
          gender: profile?.gender || 'male',
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
      } else {
        showToast("Update Failed", data.error || "Failed to update targets.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("System Error", "Connection failed. Please try again later.", "error");
    }
    setIsUpdating(false);
  };

  if (!isAuthorized) return <div className="min-h-screen bg-[#FCFCFD] flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-[#FCFCFD] pt-28 pb-20 selection:bg-[#057A55]/10 selection:text-[#057A55]">
        <main className="max-w-[800px] mx-auto px-6">

          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-10 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#16a34a] to-[#046C4E] flex items-center justify-center text-white text-[32px] font-bold mx-auto mb-4 shadow-lg shadow-green-600/20 ring-4 ring-green-50">
              {(user?.full_name || user?.name || 'U')[0].toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">My Profile</h1>
            <p className="text-gray-500 font-medium">Review your personal information and current macro targets.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-8"
          >
            {/* Section 1: Security & Identity */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" /> Identity Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="text-[13px] font-semibold text-gray-500 ml-1 mb-1 block">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="w-full bg-white border border-emerald-100/60 text-gray-900 font-medium text-[16px] rounded-2xl pl-11 pr-4 py-3.5 shadow-sm">
                      {user?.full_name || user?.name || "-"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-gray-500 ml-1 mb-1 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="w-full bg-white border border-emerald-100/60 text-gray-900 font-medium text-[16px] rounded-2xl pl-11 pr-4 py-3.5 shadow-sm">
                      {user?.email || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Health Biometrics Form */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ActivitySquare className="w-5 h-5 text-blue-500" /> Health Biometrics & Goals
                </h2>
              </div>

              <form onSubmit={handleUpdateGoals} className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4">
                    <p className="text-[12px] font-bold text-blue-600 uppercase tracking-wide mb-1">Age</p>
                    <p className="text-[18px] font-semibold text-gray-900">{profile?.age || "-"}</p>
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4">
                    <p className="text-[12px] font-bold text-indigo-600 uppercase tracking-wide mb-1">Gender</p>
                    <p className="text-[18px] font-semibold text-gray-900 capitalize">{profile?.gender || "-"}</p>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-emerald-600 uppercase tracking-wide mb-1 block">Height (cm)</label>
                    <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="w-full bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-3.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-gray-900 font-semibold text-[16px]" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-orange-600 uppercase tracking-wide mb-1 block">Weight (kg)</label>
                    <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="w-full bg-orange-50/50 border border-orange-100/50 rounded-2xl p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-gray-900 font-semibold text-[16px]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wide mb-1 block">Waist (cm)</label>
                    <input type="number" value={formData.waist_cm} onChange={e => setFormData({ ...formData, waist_cm: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-semibold text-[15px]" />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wide mb-1 block">Direction</label>
                    <select value={formData.fitness_goal} onChange={e => setFormData({ ...formData, fitness_goal: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-semibold text-[15px]">
                      <option value="Cut">Cut (Lose Fat)</option>
                      <option value="Bulk">Bulk (Gain Mass)</option>
                      <option value="Maintain">Maintain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wide mb-1 block">Activity</label>
                    <select value={formData.activity_level} onChange={e => setFormData({ ...formData, activity_level: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-semibold text-[15px]">
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wide mb-1 block">Diet</label>
                    <select value={formData.diet_preference} onChange={e => setFormData({ ...formData, diet_preference: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-semibold text-[15px]">
                      <option value="veg">Veg</option>
                      <option value="non_veg">Non-Veg</option>
                      <option value="any">Any</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <button type="submit" disabled={isUpdating} className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Recalibrate Macros"}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Section 3: Nutritional Blueprint */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Nutritional Blueprint
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Daily Target calories */}
                <div className="md:col-span-4 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Daily Calorie Target</p>
                    <div className="text-[32px] font-bold text-gray-900 tracking-tight">{profile?.target_calories || "-"} <span className="text-lg text-gray-400 font-medium tracking-normal">kcal</span></div>
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="bg-blue-50/30 border border-blue-50 rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3"><Wheat className="w-5 h-5" /></div>
                  <p className="text-[12px] font-bold text-blue-600 uppercase tracking-wide mb-0.5">Protein</p>
                  <p className="text-[20px] font-semibold text-gray-900">{profile?.target_protein || "-"}g</p>
                </div>

                <div className="bg-amber-50/30 border border-amber-50 rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3"><TrendingUp className="w-5 h-5" /></div>
                  <p className="text-[12px] font-bold text-amber-600 uppercase tracking-wide mb-0.5">Carbs</p>
                  <p className="text-[20px] font-semibold text-gray-900">{profile?.target_carbs || "-"}g</p>
                </div>

                <div className="bg-emerald-50/30 border border-emerald-50 rounded-2xl p-5 text-center md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3"><Droplet className="w-5 h-5" /></div>
                  <p className="text-[12px] font-bold text-emerald-600 uppercase tracking-wide mb-0.5">Fats</p>
                  <p className="text-[20px] font-semibold text-gray-900">{profile?.target_fats || "-"}g</p>
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
