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
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-saffron-200/50 shadow-nav'
          : 'bg-white/70 backdrop-blur-md border-b border-gray-100'
      }`}
    >
      <nav className="container-max flex items-center justify-between py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-igreen-500 text-white shadow-glow-saffron group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-extrabold text-xl text-navy-500 tracking-tight hidden sm:block">
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
                    className="flex items-center gap-2.5 rounded-2xl bg-white border border-gray-200 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-card transition-all hover:border-saffron-300 hover:shadow-card-hover"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 to-igreen-500 text-white">
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
                      <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl bg-white border border-gray-200 shadow-elevated py-2 animate-slide-down">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-saffron-500" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/leaderboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors"
                        >
                          <Trophy className="h-4 w-4 text-saffron-500" />
                          Leaderboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-navy-600 hover:bg-navy-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-navy-500" />
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            void logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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
                    className="hidden text-sm font-medium text-slate-600 hover:text-navy-500 transition-colors sm:block px-2 py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-saffron-500 to-saffron-600 shadow-glow-saffron hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-300"
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
            className="rounded-xl p-2 text-slate-500 hover:text-navy-500 hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-slate-600 hover:text-navy-500 hover:bg-saffron-50 transition-all text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-slate-600 hover:text-navy-500 hover:bg-saffron-50 transition-all text-sm font-medium flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-saffron-500" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { void logout(); setMobileOpen(false); }}
                  className="rounded-xl px-4 py-2.5 text-left text-red-500 hover:bg-red-50 transition-all text-sm font-medium flex items-center gap-2"
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
                  className="rounded-xl px-4 py-2.5 text-slate-600 hover:text-navy-500 hover:bg-saffron-50 transition-all text-sm font-medium"
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
