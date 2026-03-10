'use client';

import { useState, useTransition } from 'react';
import { User, Mail, Save, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateProfileDetails } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLoading = loading || isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (name.trim() === user?.name) {
      setError('No changes made.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 0));
    const result = await updateProfileDetails(name);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? 'Failed to update profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-glow">
            <User className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Profile Settings</h1>
            <p className="mt-1 text-slate-400">Manage your personal information</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="flex items-center gap-3 rounded-2xl bg-accent-500/10 border border-accent-500/20 p-4 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-400" />
                <span className="text-sm font-medium text-accent-300">
                  Profile updated successfully!
                </span>
              </div>
            )}
            
            {error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-300 animate-fade-in">
                {error}
              </div>
            )}

            {/* Email (Read only) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-400">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={user.email || 'No email attached'}
                  disabled
                  className="w-full rounded-2xl glass border border-white/8 py-3.5 pl-11 pr-4 text-slate-500 bg-white/5 cursor-not-allowed text-sm"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Email cannot be changed after registration.</p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-2xl glass border border-white/8 py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50 transition-all text-sm"
                  placeholder="Your full name"
                  maxLength={50}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || name.trim() === user.name || !name.trim()}
                className="btn-primary w-fit py-3 px-8 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
