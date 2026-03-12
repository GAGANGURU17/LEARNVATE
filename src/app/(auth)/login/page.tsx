'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Mail, Lock, ArrowRight, CheckCircle2, Loader2,
  Sparkles, Brain, TrendingUp, Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SocialSignIn } from '@/components/auth/SocialSignIn';

const PERKS = [
  { icon: Brain, text: 'AI that adapts to your level' },
  { icon: TrendingUp, text: 'Track progress in real-time' },
  { icon: Shield, text: 'Secure, private learning' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { login, isFirebaseReady } = useAuth();
  const router = useRouter();

  const isLoading = loading || isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 0));
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 600));
      startTransition(() => {
        router.push('/dashboard');
        router.refresh();
      });
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFFAF5]">
      {/* Left panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-section-features">
        {/* Decorative blobs */}
        <div className="blob-saffron h-[400px] w-[400px]" style={{ top: '-120px', left: '-120px' }} />
        <div className="blob-green h-[300px] w-[300px]" style={{ bottom: '0', right: '0' }} />
        <div className="blob-navy h-[200px] w-[200px]" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white shadow-glow-saffron group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <span className="font-extrabold text-2xl text-navy-500">
              LEARN<span className="text-gradient-green">VATE</span>
            </span>
          </Link>

          {/* Floating quiz card */}
          <div className="bg-white rounded-3xl p-6 mb-8 animate-float shadow-elevated border border-saffron-200/50 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-900 font-bold">Adaptive Quiz</span>
              <span className="badge-green">AI Active</span>
            </div>
            <div className="space-y-2">
              {['Mathematics', 'Science', 'History'].map((c, i) => (
                <div key={c} className="flex items-center justify-between rounded-xl bg-saffron-50 border border-saffron-100 p-3">
                  <span className="text-slate-600 text-sm">{c}</span>
                  <div className="h-1.5 w-20 rounded-full bg-saffron-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-igreen-400"
                      style={{ width: `${[92, 85, 78][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Continue your{' '}
            <span className="gradient-text">learning journey</span>
          </h2>
          <p className="text-slate-500 mb-8">
            AI adapts to your pace. Track progress, earn rankings, master exams.
          </p>

          <div className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 shadow-card border border-gray-100">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-100 text-saffron-600">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <span className="text-slate-600 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white shadow-glow-saffron">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-extrabold text-xl text-navy-500">
            LEARN<span className="text-gradient-green">VATE</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-elevated border border-gray-100">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-saffron-500" />
                <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
              </div>
              <p className="text-slate-500">Sign in to continue your learning journey</p>
            </div>

            {/* Success banner */}
            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-igreen-50 border border-igreen-200 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-igreen-600" />
                <span className="text-sm font-medium text-igreen-700">
                  Signed in successfully! Redirecting...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isFirebaseReady && (
                <div className="rounded-2xl bg-saffron-50 border border-saffron-200 p-4 text-sm text-saffron-700">
                  Firebase is not configured. Copy{' '}
                  <code className="rounded bg-saffron-100 px-1">.env.example</code> to{' '}
                  <code className="rounded bg-saffron-100 px-1">.env.local</code>. See{' '}
                  <code className="rounded bg-saffron-100 px-1">FIREBASE_SETUP.md</code>.
                </div>
              )}
              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200 disabled:opacity-50 transition-all text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200 disabled:opacity-50 transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <SocialSignIn mode="login" />
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-saffron-600 hover:text-saffron-700 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
