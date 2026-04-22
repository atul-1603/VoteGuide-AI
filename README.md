# 🗳️ VoteGuide — AI Election Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**VoteGuide** is a premium, AI-powered election assistant designed to empower citizens during the 2026 India General Elections. It provides real-time information, personalized voting journeys, and an intelligent chat interface to make the democratic process accessible to everyone.

---

## ✨ Key Features

- 🤖 **AI Election Expert**: Real-time conversational assistant powered by Google Gemini 2.5 Flash.
- 📍 **Smart Booth Locator**: Interactive Google Maps integration to find your nearest polling station.
- 📅 **Dynamic Timeline**: Real-time 2026 election schedule with automated status tracking and "Add to Calendar" functionality.
- 🚀 **Voter Journey**: Structured step-by-step registration and voting guide with interactive progress tracking.
- 🌐 **Seamless Translation**: Multi-language support (Hindi, Marathi, Tamil, Bengali) via integrated Google Translate.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Intelligence**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Maps/APIs**: [Google Maps Platform](https://mapsplatform.google.com/), [Google Calendar API](https://developers.google.com/calendar)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- A Google Cloud Project (for Gemini, Maps, and Calendar)
- A Firebase Project

### 2. Installation
```bash
git clone https://github.com/atul-1603/VoteGuide-AI.git
cd VoteGuide-AI
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your keys:
```env
# AI
GEMINI_API_KEY=your_gemini_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
```

### 4. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for the future of democracy.</p>
