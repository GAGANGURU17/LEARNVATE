# Firebase Setup for LEARNVATE

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or use existing)
3. Follow the setup wizard

## 2. Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**

## 3. Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Production mode**
4. Select a region close to your users

## 4. Get Your Config

1. Go to **Project settings** (gear icon) → **General**
2. Scroll to **Your apps**
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (e.g. "LEARNVATE")
5. Copy the `firebaseConfig` object

## 5. Add Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Deploy Firestore Rules

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Init: `firebase init` (select Firestore, use existing `firestore.rules`)
4. Deploy: `firebase deploy --only firestore`

Or copy the contents of `firestore.rules` into Firebase Console → Firestore → Rules.

## 7. Restart Dev Server

```bash
npm run dev
```

---

**Note:** Without Firebase config, the app will show an error on login/signup. Add your `.env.local` and restart.
