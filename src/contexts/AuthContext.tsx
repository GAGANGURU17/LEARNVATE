'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase';
import type { User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseReady: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
  sendPhoneCode: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileDetails: (name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const defaultStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  sessionsCompleted: 0,
  byCategory: {} as Record<string, { correct: number; total: number }>,
  byDifficulty: {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
    preliminary: { correct: 0, total: 0 },
    mains: { correct: 0, total: 0 },
    advanced: { correct: 0, total: 0 },
  },
  lastActive: 0,
};

async function ensureUserDoc(
  db: ReturnType<typeof getFirebaseFirestore>,
  uid: string,
  data: { name: string; email?: string }
) {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, {
      name: data.name,
      email: data.email ?? '',
      createdAt: Date.now(),
      stats: defaultStats,
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const isFirebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        let name = fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner';
        
        // Set user immediately to unblock UI
        setUser({
          id: fbUser.uid,
          email: fbUser.email ?? '',
          name,
          joinedAt: 0,
        });
        setIsLoading(false);

        // Fetch custom name asynchronously
        if (db) {
          getDoc(doc(db, 'users', fbUser.uid))
            .then((userDoc) => {
              if (userDoc.exists() && userDoc.data()?.name) {
                setUser((prev) => (prev ? { ...prev, name: userDoc.data()!.name } : null));
              }
            })
            .catch((err) => {
              console.warn('Could not fetch user profile from Firestore:', err);
            });
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!auth) {
        return {
          success: false,
          error: 'Firebase is not configured. Add your Firebase config to .env.local',
        };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );
        const userData = {
          name: name.trim() || email.split('@')[0] || 'Learner',
          email: cred.user.email,
          createdAt: Date.now(),
          stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            sessionsCompleted: 0,
            byCategory: {},
            byDifficulty: {
              easy: { correct: 0, total: 0 },
              medium: { correct: 0, total: 0 },
              hard: { correct: 0, total: 0 },
              preliminary: { correct: 0, total: 0 },
              mains: { correct: 0, total: 0 },
              advanced: { correct: 0, total: 0 },
            },
            lastActive: 0,
          },
        };
        if (db) {
          await setDoc(doc(db, 'users', cred.user.uid), userData);
        }
        setUser({
          id: cred.user.uid,
          email: cred.user.email ?? '',
          name: userData.name,
          joinedAt: userData.createdAt,
        });
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        if (message.includes('email-already-in-use')) {
          return { success: false, error: 'Email already registered' };
        }
        if (message.includes('weak-password')) {
          return { success: false, error: 'Password is too weak' };
        }
        return { success: false, error: message };
      }
    },
    [auth, db]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!auth) {
        return {
          success: false,
          error: 'Firebase is not configured. Add your Firebase config to .env.local',
        };
      }
      try {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed';
        if (
          message.includes('user-not-found') ||
          message.includes('wrong-password') ||
          message.includes('invalid-credential')
        ) {
          return { success: false, error: 'Invalid email or password' };
        }
        return { success: false, error: message };
      }
    },
    [auth]
  );

  const loginWithGoogle = useCallback(async () => {
    if (!auth) {
      return { success: false, error: 'Firebase is not configured' };
    }
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureUserDoc(db, result.user.uid, {
        name: result.user.displayName || result.user.email?.split('@')[0] || 'Learner',
        email: result.user.email ?? undefined,
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      if (msg.includes('popup-closed-by-user'))
        return { success: false, error: 'Sign-in cancelled' };
      return { success: false, error: msg };
    }
  }, [auth, db]);

  const loginWithApple = useCallback(async () => {
    if (!auth) {
      return { success: false, error: 'Firebase is not configured' };
    }
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName || result.user.email?.split('@')[0] || 'Learner';
      await ensureUserDoc(db, result.user.uid, {
        name,
        email: result.user.email ?? undefined,
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Apple sign-in failed';
      if (msg.includes('popup-closed-by-user'))
        return { success: false, error: 'Sign-in cancelled' };
      return { success: false, error: msg };
    }
  }, [auth, db]);

  const sendPhoneCode = useCallback(
    async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
      if (!auth) return { success: false, error: 'Firebase is not configured' };
      const num = phoneNumber.replace(/\D/g, '');
      if (num.length < 10) return { success: false, error: 'Enter a valid phone number' };
      const fullNumber = num.startsWith('+') ? num : `+${num}`;
      try {
        const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        });
        const conf = await signInWithPhoneNumber(auth, fullNumber, recaptcha);
        setPhoneConfirmation(conf);
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send code';
        return { success: false, error: msg };
      }
    },
    [auth]
  );

  const verifyPhoneCode = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      if (!phoneConfirmation) return { success: false, error: 'Request a new code first' };
      try {
        const result = await phoneConfirmation.confirm(code);
        setPhoneConfirmation(null);
        await ensureUserDoc(db, result.user.uid, {
          name: result.user.displayName || result.user.phoneNumber || 'Learner',
          email: result.user.phoneNumber ?? undefined,
        });
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid code';
        return { success: false, error: msg };
      }
    },
    [phoneConfirmation, db]
  );

  const updateProfileDetails = useCallback(
    async (newName: string): Promise<{ success: boolean; error?: string }> => {
      if (!auth || !auth.currentUser) {
        return { success: false, error: 'User is not logged in' };
      }
      if (!newName.trim()) {
        return { success: false, error: 'Name cannot be empty' };
      }
      
      try {
        // Update Firebase Auth Profile
        await updateProfile(auth.currentUser, { displayName: newName.trim() });
        
        // Update Firestore Document
        if (db) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, { name: newName.trim() });
        }
        
        // Update Local State
        setUser((prev) => prev ? { ...prev, name: newName.trim() } : null);
        
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update profile';
        return { success: false, error: msg };
      }
    },
    [auth, db]
  );

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setPhoneConfirmation(null);
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isFirebaseReady,
        login,
        signup,
        loginWithGoogle,
        loginWithApple,
        sendPhoneCode,
        verifyPhoneCode,
        updateProfileDetails,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
