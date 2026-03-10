# LEARNVATE

LEARNVATE is a revolutionary AI-powered MCQ (Multiple Choice Question) learning platform that adapts to each student's learning pace and style. Our intelligent adaptive learning algorithm adjusts question difficulty in real-time, helping students master exams across multiple categories.

## Features

- **Adaptive Difficulty**: Questions adjust based on your performance—correct streaks increase difficulty, incorrect answers lower it
- **6 Categories**: Mathematics, Science, History, Geography, English, General Knowledge
- **Instant Feedback**: Get explanations after each answer
- **Session Summary**: Track your accuracy and progress

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- **Firebase** (Auth + Firestore)
- Vitest (testing)
- ESLint + Prettier

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase** (required for auth & user stats)
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password) and Firestore
   - Copy `.env.example` to `.env.local` and add your Firebase config
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details

3. **Run the app**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
