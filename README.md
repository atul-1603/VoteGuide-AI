# 🗳️ VoteGuide — AI Election Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-v10-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
</p>

**VoteGuide** is a premium, AI-driven election assistance platform designed to revolutionize how citizens interact with the democratic process. Built for the **2026 India General Elections**, it combines cutting-edge AI, real-time data tracking, and location-based services into a seamless, high-performance experience.

---

## 🌟 Vision
Democracy thrives when citizens are informed. VoteGuide removes the friction from the election process by providing a single, intelligent interface for timelines, registration, booth location, and expert guidance.

---

## 🌍 Why this matters
The complexity of the election process is often a barrier to democratic participation. VoteGuide directly addresses this by:
*   **Bridging the Information Gap**: Transforming dense, bureaucratic procedures into interactive, conversational answers that anyone can understand.
*   **Reducing Friction**: Providing instant tools for booth location and calendar synchronization, saving users hours of manual research and planning.
*   **Empowering First-Time Voters**: Offering a structured, interactive "Voter Journey" to guide new citizens through every critical milestone of their first election.
*   **Ensuring Accuracy & Trust**: Combatting election misinformation by strictly providing verified information and direct links to official ECI resources.

---

## 🚀 Featured Capabilities

### 🤖 1. AI Election Expert (Gemini 2.5 Flash)
*   **Context-Aware**: Understands complex queries about voter rights and procedures.
*   **Neutral & Verified**: Trained to provide strictly non-partisan information based on ECI guidelines.
*   **Real-time Assistance**: Available 24/7 to answer "How do I register?" or "What ID do I need?".

### 📅 2. Dynamic Election Timeline
*   **Live Countdown**: Smart timer that automatically tracks the next upcoming election phase (Nominations, Polling, Results).
*   **Status Tracking**: Visual indicators for "Upcoming", "Ongoing", and "Completed" phases.
*   **Calendar Sync**: One-click integration to add critical dates to your Google Calendar.

### 📍 3. Smart Booth Locator
*   **Precision Search**: Integrated Google Maps Places API for pinpoint address searching.
*   **Interactive Markers**: Real-time visualization of polling stations across your constituency.
*   **Instant Directions**: Seamless routing from your current location to your assigned booth.

### 📈 4. Personalized Voter Dashboard
*   **Progress Tracking**: Monitor your completion of the "Voter Journey" checklist.
*   **Snapshot View**: Immediate access to upcoming dates and active election phases.
*   **Secure Profile**: Firebase-powered authentication ensuring your journey is saved and synchronized.

---

## 🛠️ Modern Tech Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | High-performance SSR & Edge Runtime |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe, scalable codebase |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) | Premium, responsive design system |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight, optimized store management |
| **AI** | [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) | High-speed LLM processing |
| **Identity** | [Firebase Auth](https://firebase.google.com/docs/auth) | Secure Google & Email authentication |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) | Real-time user progress synchronization |

---

## 🚦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/atul-1603/VoteGuide-AI.git
cd VoteGuide-AI
npm install
```

### 2. Configure Environment
Create a `.env.local` file with the following keys:
```env
# Google AI & Intelligence
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration (Required for Auth & Progress)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps Platform (Required for Booth Locator)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Google Calendar & Auth (Required for "Add to Calendar")
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID=your_calendar_client_id

# Optional: Google Translation API
GOOGLE_TRANSLATE_API_KEY=your_translation_api_key

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

### 3. Launch Development
```bash
npm run dev
```
Visit `http://localhost:3000` to experience the future of election assistance.

---

## 📂 Project Structure
*   `app/` - Next.js App Router (Routes & Server Components)
*   `components/` - Atomic Design (UI, Layout, and Feature components)
*   `data/` - Single source of truth for the 2026 Timeline & Journey steps
*   `hooks/` - Custom logic for Maps, Calendar, and Auth integration
*   `store/` - Optimized Zustand stores for global state (Auth, Chat, Journey)
*   `types/` - Centralized TypeScript interface definitions

---

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

<p align="center">
  <b>Built with ❤️ for a stronger democracy.</b><br/>
  <i>Empowering every voice, one vote at a time.</i>
</p>
