<div align="center">

# 🎙️ EchoLedger
**AI-Powered Voice Expense Assistant**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*A premium personal finance dashboard that listens. Track expenses, analyze trends, and predict your financial future simply by speaking.*

[View Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📌 Project Overview
EchoLedger is an intelligent, modern fintech platform built to replace tedious manual budgeting. Inspired by the premium aesthetics of CRED and Jupiter, EchoLedger combines a sleek glassmorphism UI with powerful natural language processing. 

Simply say *"I just spent 400 rupees on a coffee with John"* and the platform's AI will automatically categorize the transaction, assign it to the Food & Dining budget, map the split debt to John, and update your monthly financial forecast in real-time.

<br>

<div align="center">
  <!-- Placeholder for Demo Video / GIF -->
  <img src="https://via.placeholder.com/800x450/1a1a1a/ffffff?text=EchoLedger+Dashboard+Demo+GIF" alt="EchoLedger Demo" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);"/>
</div>

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🎙️ AI Voice Tracking** | Hands-free input using the Web Speech API and LLM-driven JSON extraction. |
| **🤖 Conversational AI** | Chat directly with your ledger. Ask *"How much did I spend this week?"* to get instant answers. |
| **🔮 Predictive Modeling** | Generates month-end budget forecasts based on your daily spending velocity. |
| **🤝 Split & Settle** | Automatically tracks debts ("Who owes who") when you mention friends in your voice prompts. |
| **📈 Smart Analytics** | Visualizes historical data via interactive Recharts (pie charts, trendlines, etc). |
| **🎨 Premium UI/UX** | Fluid animations via Framer Motion, dynamic glassmorphism styling, and native Dark/Light mode. |
| **📄 Data Export** | Instantly download your full financial history as a CSV or formatted PDF. |

---

## 🛠️ Tech Stack

EchoLedger uses a fully serverless, edge-optimized stack for maximum performance and security:

**Frontend Ecosystem:**
* **Framework:** Next.js 16 (App Router)
* **Library:** React 19
* **Styling:** Tailwind CSS + Vanilla CSS (Glassmorphism Tokens)
* **Animations:** Framer Motion
* **Visualizations:** Recharts
* **Alerts:** Sonner Toasts

**Backend & Database:**
* **Database:** Firebase Firestore (Real-time NoSQL)
* **Authentication:** Firebase Auth (Google OAuth)
* **API Layer:** Next.js Serverless Route Handlers

**Artificial Intelligence:**
* **Model:** Google Gemini 2.5 Flash API
* **Integration:** `@google/generative-ai` SDK
* **Speech:** Native Browser Web Speech API

---

## 🏗️ Architecture & Workflow

```text
🗣️ User Speaks 
  │
  ├─> 🎤 Web Speech API captures audio & transcribes to text
  │
  ├─> 🧠 Next.js Route Handler sends transcript to Gemini 2.5 Flash
  │     (System Prompt forces strict JSON schema extraction)
  │
  ├─> 📊 Parsed Data (Amount, Vendor, Category, Friend, Split Type)
  │
  ├─> 💾 Saved securely to Firebase Firestore
  │
  └─> 🚀 React State updates real-time Dashboard UI & Predictive Charts
```

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Dashboard+Overview" width="48%">
  <img src="https://via.placeholder.com/400x250/1a1a1a/ffffff?text=AI+Voice+Assistant" width="48%">
</div>
<br>
<div align="center">
  <img src="https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Advanced+Forecasting" width="48%">
  <img src="https://via.placeholder.com/400x250/1a1a1a/ffffff?text=Friends+%26+Settlements" width="48%">
</div>

---

## 🚀 Installation & Setup

Want to run EchoLedger locally? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/echoledger.git
cd echoledger/expense-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Folder Structure

```text
echoledger/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Serverless Gemini Route Handlers
│   │   ├── analytics/      # Deep Analytics Page
│   │   ├── settings/       # Global Configuration Page
│   │   ├── transactions/   # Full Ledger Page
│   │   ├── layout.tsx      # Global Layout & Providers
│   │   └── page.tsx        # Main Dashboard
│   ├── components/         # Reusable React UI Components
│   │   ├── AIAssistant.tsx # Chat UI
│   │   ├── StatsCards.tsx  # KPI Widgets
│   │   └── ...
│   └── lib/                # Config & Utilities
│       ├── firebase.ts     # DB & Auth Initialization
│       ├── gemini.ts       # AI Model Initialization
│       ├── useExpenses.ts  # Custom Firebase Hook
│       └── useSettings.ts  # Global State Context
├── .env.local              # Secrets
├── tailwind.config.ts      # Tailwind Configuration
└── package.json            # Dependencies
```

---

## 🔮 Future Improvements

- [ ] **OCR Receipt Scanning:** Upload images of bills for automatic parsing.
- [ ] **Multi-Language Support:** Speak in local languages/dialects.
- [ ] **Bank API Sync:** Plaid integration for automatic reconciliation.
- [ ] **Mobile App:** React Native wrap for iOS/Android distribution.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**K S V HARISH** 
* Full Stack Developer & AI Enthusiast
* [LinkedIn](#)
* [GitHub](https://github.com/KSVHARISH)

<br>

---
<div align="center">
  <i>If you found this project helpful, please consider giving it a ⭐ on GitHub!</i>
</div>
