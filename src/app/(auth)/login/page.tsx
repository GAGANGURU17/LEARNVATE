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
    <div className="min-h-screen flex">
      {/* Ambient */}
      <div className="bg-scene" />
      <div className="bg-grid" />

      {/* Left panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Orbs */}
        <div className="absolute h-[400px] w-[400px] rounded-full bg-primary-500 blur-[120px] opacity-15 -top-32 -left-32" />
        <div className="absolute h-[300px] w-[300px] rounded-full bg-cyan-500 blur-[100px] opacity-10 bottom-0 right-0" />
        <div className="absolute h-[200px] w-[200px] rounded-full bg-violet-500 blur-[80px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <span className="font-extrabold text-2xl text-white">
              LEARN<span className="text-gradient-green">VATE</span>
            </span>
          </Link>

          {/* Floating quiz card */}
          <div className="glass-card rounded-3xl p-6 mb-8 animate-float glow-green text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-bold">Adaptive Quiz</span>
              <span className="badge-green">AI Active</span>
            </div>
            <div className="space-y-2">
              {['Mathematics', 'Science', 'History'].map((c, i) => (
                <div key={c} className="flex items-center justify-between rounded-xl glass p-3">
                  <span className="text-slate-300 text-sm">{c}</span>
                  <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-cyan-400"
                      style={{ width: `${[92, 85, 78][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-3">
            Continue your{' '}
            <span className="gradient-text">learning journey</span>
          </h2>
          <p className="text-slate-400 mb-8">
            AI adapts to your pace. Track progress, earn rankings, master exams.
          </p>

          <div className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 glass rounded-xl px-4 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-extrabold text-xl text-white">
            LEARN<span className="text-gradient-green">VATE</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
              </div>
              <p className="text-slate-400">Sign in to continue your learning journey</p>
            </div>

            {/* Success banner */}
            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">
                  Signed in successfully! Redirecting...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isFirebaseReady && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-300">
                  Firebase is not configured. Copy{' '}
                  <code className="rounded bg-amber-500/20 px-1">.env.example</code> to{' '}
                  <code className="rounded bg-amber-500/20 px-1">.env.local</code>. See{' '}
                  <code className="rounded bg-amber-500/20 px-1">FIREBASE_SETUP.md</code>.
                </div>
              )}
              {error && (
                <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-300">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-400">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl glass border border-white/8 py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50 transition-all text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl glass border border-white/8 py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50 transition-all text-sm"
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
              <Link href="/signup" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
