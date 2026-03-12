'use client';

import { useState, useTransition } from 'react';
import { User, Mail, Save, CheckCircle2, Loader2, ArrowLeft, Shield, Bell, Key } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-10 reveal-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-saffron-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Control Center
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="mt-2 text-slate-500 text-lg">Manage your identity and learning preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="edu-glass rounded-[2.5rem] p-10 shadow-sm border border-gray-100 reveal-up delay-100">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <User className="h-5 w-5 text-saffron-500" />
              Personal Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {success && (
                <div className="flex items-center gap-3 rounded-2xl bg-igreen-50/50 backdrop-blur-sm border border-igreen-200 p-5 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-igreen-600" />
                  <span className="text-sm font-bold text-igreen-700">
                    Profile successfully synchronized with cloud.
                  </span>
                </div>
              )}
              
              {error && (
                <div className="rounded-2xl bg-red-50/50 backdrop-blur-sm border border-red-200 p-5 text-sm font-bold text-red-700 animate-fade-in">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-widest">
                    Email Identity
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      type="email"
                      value={user.email || 'No email attached'}
                      disabled
                      className="w-full rounded-2xl bg-white/50 border border-slate-100 py-4 pl-12 pr-4 text-slate-400 cursor-not-allowed text-sm font-bold backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-widest">
                    Public Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-2xl bg-white/80 border border-gray-100 py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-saffron-300 focus:ring-4 focus:ring-saffron-50 outline-none disabled:opacity-50 transition-all font-bold backdrop-blur-sm"
                      placeholder="Your full name"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || name.trim() === user.name || !name.trim()}
                  className="btn-primary w-full sm:w-fit py-4 px-10 rounded-2xl text-base disabled:opacity-30 disabled:cursor-not-allowed shadow-glow-saffron"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Update Identity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="edu-glass rounded-[2.5rem] p-10 shadow-sm border border-gray-100 reveal-up delay-200">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="h-5 w-5 text-igreen-600" />
              Security & Privacy
            </h2>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Update Password</p>
                      <p className="text-xs text-slate-400 font-medium">Reset your secure access</p>
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-slate-300 rotate-180" />
               </div>
               <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Notification Config</p>
                      <p className="text-xs text-slate-400 font-medium">Manage alerts and emails</p>
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-slate-300 rotate-180" />
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-navy-900/90 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group edu-glow reveal-up delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800/50 via-navy-900/20 to-slate-950/50 animate-pulse-slow" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-saffron-500/10 rounded-full blur-3xl group-hover:bg-saffron-500/20 transition-all duration-1000" />
              <div className="relative text-center">
                 <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-saffron-400 to-igreen-500 mx-auto mb-6 flex items-center justify-center text-4xl font-black shadow-xl">
                   {user.name[0].toUpperCase()}
                 </div>
                 <h3 className="text-2xl font-black">{user.name}</h3>
                 <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Elite Member</p>
                 
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-2xl font-black">450</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Solved</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                       <p className="text-2xl font-black">92%</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Accuracy</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="edu-glass rounded-[2.5rem] p-8 border border-igreen-100 reveal-up delay-400">
              <p className="text-xs font-black text-igreen-700 uppercase tracking-widest mb-2">Member Status</p>
              <div className="flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-igreen-500 animate-pulse" />
                 <span className="text-sm font-black text-slate-900">Account Verified</span>
              </div>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium">
                Your account is active and verified. You have access to all premium AI-generated exam materials.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
