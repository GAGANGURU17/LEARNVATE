'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chrome, Apple, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SocialSignInProps {
  mode: 'login' | 'signup';
}

export function SocialSignIn({ mode }: SocialSignInProps) {
  const router = useRouter();
  const {
    loginWithGoogle,
    loginWithApple,
    sendPhoneCode,
    verifyPhoneCode,
    isFirebaseReady,
  } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState<'google' | 'apple' | 'phone' | null>(null);
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleOAuth = async (
    fn: () => Promise<{ success: boolean; error?: string }>,
    provider: 'google' | 'apple'
  ) => {
    setError('');
    setLoading(provider);
    await new Promise((r) => setTimeout(r, 0));
    const result = await fn();
    setLoading(null);
    if (result.success) {
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 500));
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error ?? 'Sign-in failed');
    }
  };

  const handleSendCode = async () => {
    setError('');
    setLoading('phone');
    setCodeSent(false);
    await new Promise((r) => setTimeout(r, 0));
    const num = phoneNumber.trim().replace(/\D/g, '');
    const full = num.startsWith('+') ? num : `+${num}`;
    const result = await sendPhoneCode(full);
    setLoading(null);
    if (result.success) {
      setPhoneStep('verify');
      setCodeSent(true);
    } else {
      setError(result.error ?? 'Failed to send code');
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setLoading('phone');
    await new Promise((r) => setTimeout(r, 0));
    const result = await verifyPhoneCode(verifyCode);
    setLoading(null);
    if (result.success) {
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 500));
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error ?? 'Invalid code');
    }
  };

  if (!isFirebaseReady) return null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-slate-400">Or continue with</span>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-lg bg-igreen-50 border border-igreen-200 p-3 text-igreen-700">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-igreen-600" />
          <span className="text-sm font-medium">Success! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuth(loginWithGoogle, 'google')}
          disabled={!!loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-medium text-slate-700 transition-all hover:bg-saffron-50 hover:border-saffron-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === 'google' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Chrome className="h-5 w-5" />
          )}
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth(loginWithApple, 'apple')}
          disabled={!!loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-medium text-slate-900 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === 'apple' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Apple className="h-5 w-5" />
          )}
          Apple
        </button>
      </div>

      {phoneStep === 'input' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 234 567 8900"
              disabled={!!loading}
              className="flex-1 rounded-xl border border-gray-200 py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200 disabled:bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!!loading || !phoneNumber.trim()}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-medium text-slate-700 transition-all hover:bg-saffron-50 hover:border-saffron-200 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
            >
              {loading === 'phone' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Phone className="h-5 w-5" />
              )}
              Send code
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Include country code (e.g. +91 India, +1 US)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {codeSent && (
            <div className="flex items-center gap-2 rounded-lg bg-igreen-50 border border-igreen-200 p-2 text-sm text-igreen-700">
              <CheckCircle2 className="h-4 w-4" />
              Code sent to {phoneNumber}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={!!loading}
              className="flex-1 rounded-xl border border-gray-200 py-3 px-4 text-center text-slate-900 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200 disabled:bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={!!loading || verifyCode.length < 6}
              className="flex items-center gap-2 rounded-xl bg-saffron-500 px-4 py-3 font-medium text-white transition-colors hover:bg-saffron-600 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
            >
              {loading === 'phone' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setPhoneStep('input');
                setVerifyCode('');
                setError('');
                setCodeSent(false);
              }}
              disabled={!!loading}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-600 hover:bg-gray-50 disabled:opacity-70"
            >
              Change
            </button>
          </div>
        </div>
      )}

      <div id="recaptcha-container" className="min-h-0" />
    </div>
  );
}
