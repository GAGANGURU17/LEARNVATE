'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Zap,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-scene" />
        <div className="bg-grid" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400 to-cyan-600 flex items-center justify-center shadow-glow animate-pulse">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-primary-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/learn', label: 'Start Learning', icon: BookOpen },
    { href: '/dashboard/stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      {/* Ambient background */}
      <div className="bg-scene" />
      <div className="bg-grid" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col glass-strong border-r border-white/8 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow group-hover:scale-110 transition-transform">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-extrabold text-lg text-white">
              LEARN<span className="text-gradient-green">VATE</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/8 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
          <p className="px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-cyan-500/10 text-white border border-primary-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                    strokeWidth={isActive ? 2 : 1.75}
                  />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-primary-400/60" />}
              </Link>
            );
          })}

          <div className="mt-4 border-t border-white/6 pt-4">
            <p className="px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1">
              Account
            </p>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-white/8 p-4">
          <div className="flex items-center gap-3 rounded-2xl glass p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-accent-600 text-white">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <div className="badge-green text-[10px] py-0.5 px-2">Pro</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="transition-all duration-300 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/8 glass px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/8 transition-colors lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-xs text-slate-400">
                Welcome, <span className="text-white font-semibold">{user?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="badge-green hidden sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
              Online
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-accent-600 text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 relative z-10 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
