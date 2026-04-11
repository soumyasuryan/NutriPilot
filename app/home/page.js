import React from 'react'

const homepage = () => {
    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#f0fdf4] via-[#fafaf9] to-[#fff7ed] pt-20">
                <div className="absolute top-[15%] right-[12%] w-64 h-64 bg-linear-to-br from-[#22c55e]/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-[20%] left-[8%] w-80 h-80 bg-linear-to-tr from-[#f97316]/20 to-transparent rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#22c55e]/20 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4 text-[#16a34a]">
                                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                    <path d="M20 3v4"></path>
                                    <path d="M22 5h-4"></path>
                                    <path d="M4 17v2"></path>
                                    <path d="M5 18H3"></path>
                                </svg>
                                <span className="text-sm font-medium text-[#15803d]">AI-Powered Nutrition</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-[#1c1917] leading-tight">
                                Smart Meal Planning,{' '}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#16a34a] to-[#22c55e]">Simplified</span>
                            </h1>
                            <p className="text-lg text-[#78716c] leading-relaxed max-w-xl">
                                Track your meals, analyze nutrition, and stay within budget — all powered by AI that learns your preferences and goals.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="/signup">
                                    <button className="px-8 py-4 bg-linear-to-r from-[#16a34a] to-[#22c55e] text-white rounded-xl shadow-lg shadow-[#22c55e]/30 font-semibold transition-all duration-300 cursor-pointer">Get Started Free</button>
                                </a>
                                <a href="#how-it-works">
                                    <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#292524] rounded-xl border border-[#e7e5e4] shadow-sm font-semibold transition-all duration-300 cursor-pointer">See How it Works</button>
                                </a>
                            </div>
                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <div className="text-2xl font-bold text-[#292524]">10k+</div>
                                    <div className="text-sm text-[#a8a29e]">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#292524]">50M+</div>
                                    <div className="text-sm text-[#a8a29e]">Meals Tracked</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#292524]">4.9</div>
                                    <div className="text-sm text-[#a8a29e]">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-[#22c55e]/30 to-transparent rounded-full blur-2xl"></div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#16a34a] to-[#22c55e] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera w-6 h-6 text-white">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                                <circle cx="12" cy="13" r="3"></circle>
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-[#a8a29e]">Today's Progress</div>
                                            <div className="text-sm font-semibold text-[#292524]">67% Complete</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-[#fafaf9] rounded-xl">
                                            <div className="text-xs text-[#a8a29e] mb-1">Calories</div>
                                            <div className="text-xl font-semibold text-[#292524]">1,420</div>
                                            <div className="text-xs text-[#d6d3d1]">of 2,200</div>
                                        </div>
                                        <div className="p-4 bg-[#fafaf9] rounded-xl">
                                            <div className="text-xs text-[#a8a29e] mb-1">Budget</div>
                                            <div className="text-xl font-semibold text-[#292524]">₹85</div>
                                            <div className="text-xs text-[#d6d3d1]">of ₹150</div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-linear-to-r from-[#16a34a]/10 to-[#22c55e]/10 rounded-xl border border-[#22c55e]/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-5 h-5 text-[#16a34a]">
                                                    <path d="M20 6 9 17l-5-5"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-[#292524]">Lunch Logged</div>
                                                <div className="text-xs text-[#78716c]">Paneer tikka with roti • 520 cal</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[#78716c]">Suggested: Evening Snack</span>
                                            <span className="text-sm font-medium text-[#16a34a]">+180 cal</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-[#fafaf9] rounded-lg">
                                            <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple w-4 h-4 text-[#d97706]">
                                                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A8.75 8.75 0 0 0 12 2C9.5 2 7.5 4.5 6.8 7"></path>
                                                    <path d="M12 2c1.5 0 3 1 3 2.5"></path>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-[#292524]">Greek Yogurt with Berries</div>
                                                <div className="text-xs text-[#a8a29e]">₹45 • 180 cal • High protein</div>
                                            </div>
                                            <button className="px-3 py-1 text-xs bg-[#16a34a] text-white rounded-full cursor-pointer">Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-4 p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50">
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-[#a8a29e]">Saved Today</div>
                                    <div className="text-sm font-semibold text-[#292524]">₹42</div>
                                </div>
                            </div>
                            <div className="relative p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#a8a29e]">Your Meal Analysis</span>
                                        <div className="px-3 py-1 bg-[#dcfce7] text-[#15803d] text-xs rounded-full">AI Insight</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 bg-[#f5f5f4] rounded-full overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-[#16a34a] to-[#22c55e] rounded-full" style={{ width: '68%' }}></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-3 bg-[#fafaf9] rounded-xl">
                                                <div className="text-xs text-[#a8a29e] mb-1">Calories</div>
                                                <div className="text-lg font-semibold text-[#292524]">1850</div>
                                                <div className="text-xs text-[#d6d3d1]">of 2200</div>
                                            </div>
                                            <div className="p-3 bg-[#fafaf9] rounded-xl">
                                                <div className="text-xs text-[#a8a29e] mb-1">Protein</div>
                                                <div className="text-lg font-semibold text-[#292524]">52g</div>
                                                <div className="text-xs text-[#d6d3d1]">of 80g</div>
                                            </div>
                                            <div className="p-3 bg-[#fafaf9] rounded-xl">
                                                <div className="text-xs text-[#a8a29e] mb-1">Budget</div>
                                                <div className="text-lg font-semibold text-[#292524]">₹95</div>
                                                <div className="text-xs text-[#d6d3d1]">of ₹120</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <a href="#features" className="flex flex-col items-center gap-2 text-[#a8a29e]">
                        <span className="text-xs">Scroll to explore</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4 rotate-90">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </a>
                </div>
            </section>
        </>
    )
}

export default homepage