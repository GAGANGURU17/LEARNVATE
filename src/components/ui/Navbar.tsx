'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Sparkles, Settings, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
          : 'glass border-b border-white/5'
      }`}
    >
      <nav className="container-max flex items-center justify-between py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-extrabold text-xl text-white tracking-tight hidden sm:block">
            LEARN<span className="text-gradient-green">VATE</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-pill ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 rounded-2xl glass-md border border-white/10 px-3.5 py-2 text-sm font-medium text-slate-200 shadow-glass transition-all hover:border-primary-400/40 hover:shadow-glow-green"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-cyan-600 text-white">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="hidden sm:inline max-w-28 truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex={0}
                        aria-label="Close menu"
                      />
                      <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl glass-strong border border-white/10 shadow-glass py-2 animate-slide-down">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-white/5 mb-1">
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-primary-400" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/leaderboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Trophy className="h-4 w-4 text-amber-400" />
                          Leaderboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-cyan-400" />
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            void logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden text-sm font-medium text-slate-400 hover:text-white transition-colors sm:block px-2 py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-cyan-500 shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-100 transition-all duration-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/8 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/8 glass-strong px-4 pb-4 pt-2 md:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary-400" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { void logout(); setMobileOpen(false); }}
                  className="rounded-xl px-4 py-2.5 text-left text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 btn-primary py-3 text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
