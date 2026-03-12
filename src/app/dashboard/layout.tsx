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
  Trophy,
  GraduationCap,
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
      <div className="flex min-h-screen items-center justify-center bg-[#FFFAF5]">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-saffron-500 to-igreen-500 flex items-center justify-center shadow-glow-saffron animate-pulse">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-saffron-500 animate-bounce"
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
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAF5] relative">
      {/* Education-themed decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FFFAF5]">
        {/* Soft diffused blobs for background - Animated */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-saffron-300/10 blur-3xl animate-[spin_20s_linear_infinite] origin-bottom-left" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-igreen-300/10 blur-3xl animate-float-slow" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-navy-300/5 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        
        {/* Very subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #000080 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Fade grid at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFAF5]/50" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-200 shadow-nav transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white shadow-glow-saffron group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-extrabold text-lg text-navy-500">
              LEARN<span className="text-igreen-500">VATE</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
          <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
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
                    ? 'bg-gradient-to-r from-saffron-100 to-saffron-50 text-saffron-700 border border-saffron-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-saffron-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={isActive ? 2 : 1.75}
                  />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-saffron-400" />}
              </Link>
            );
          })}

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Account
            </p>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <div className="badge-green text-[10px] py-0.5 px-2">Pro</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="transition-all duration-300 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-saffron-50 border border-saffron-100 rounded-xl px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-saffron-500" />
              <p className="text-xs text-slate-500">
                Welcome, <span className="text-slate-800 font-semibold">{user?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="badge-green hidden sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-igreen-500 animate-pulse" />
              Online
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white">
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
