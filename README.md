# 🚀 NutriPilot

**Fix Your Diet. Not Just Track It.**

NutriPilot is a premium, AI-powered nutritional intelligence platform specifically engineered for students and young professionals. Unlike standard calorie trackers, NutriPilot doesn't just record data—it audits your dietary history, identifies bottlenecks, and suggests realistic, budget-friendly swaps.

![Landing Page Mockup](https://raw.githubusercontent.com/tanmay-joshi-official/NutriPilot/main/public/demo-screenshot.png) *(Note: Replace with actual screenshot relative path if available)*

## ✨ Key Features

### 🧠 AI-Powered "Natural Language" Logging
Skip the tedious database searches. Tell NutriPilot what you ate in plain English (e.g., *"2 boiled eggs and a bowl of dal tadka"*). Our AI handles the caloric and macronutrient estimation with a focus on regional Indian cuisine.

### 🔬 The Lab (Weekly AI Audit)
The "Judge" executes a harsh 7-day retrospective on your logs. It isolates your "Worst Offenders"—the high-calorie, low-nutrient items—and executes the **AI Swap Protocol** to suggest healthier, budget-friendly alternatives.

### ⚖️ Smart Scale Converter
No kitchen scale? No problem. The Scale Converter uses AI logic to map gram weights into standard household measurements like tablespoons, katoris, and bowls.

### 📊 Precision Dashboards
- **Caloric Status Rings**: Visual feedback on your daily macro targets.
- **7-Day Intake Graph**: High-fidelity visualization of your consistency, marking deviations of ±300 kcal from your target.
- **Dynamic Recalibration**: Macro targets automatically adjust based on your Height, Weight, Age, Gender, and Activity Level (Mifflin-St Jeor Equation).

### 💎 Premium Design System
- **Glassmorphic UI**: A modern, sophisticated interface with smooth `framer-motion` transitions.
- **Unified Toast System**: High-end, animated feedback for every user interaction (Logins, Meal Logging, Audits, etc.).
- **Mobile Responsive**: Fully optimized for on-the-go tracking.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/).
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/).
- **Auth**: JWT-based secure session management.
- **AI Integration**: Custom-tuned LLM logic for nutritional linguistics and strategy generation.

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tanmay-joshi-official/NutriPilot.git
   cd NutriPilot
   ```

2. **Frontend Setup**
   ```bash
   cd nutripilot
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with your PORT and JWT_SECRET
   node server.js
   ```

## 🎯 The "Pitch"
Standard fitness apps tell you what you did wrong. **NutriPilot** tells you how to fix it for ₹20. By combining AI-linguistic analysis with a harsh historical audit, we turn your smartphone into a professional-grade nutrition coach that understands both your biology and your wallet.

---

Built for the **[Your Hackathon Name]** 🏆
