'use client';

import Link from 'next/link';
import {
  Zap,
  Brain,
  TrendingUp,
  Award,
  Globe,
  Shield,
  ChevronRight,
  Check,
  Target,
  Sparkles,
  Rocket,
  Users,
  Star,
  ArrowRight,
  Play,
  BookOpen,
  Trophy,
  Cpu,
  Lock,
  BarChart3,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { useAuth } from '@/contexts/AuthContext';

/* ── floating orb helper ───────────────────────────────────────────────────── */
function Orb({
  size,
  color,
  style,
  blur = 'blur-3xl',
  opacity = 'opacity-30',
}: {
  size: string;
  color: string;
  style?: React.CSSProperties;
  blur?: string;
  opacity?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${size} ${color} ${blur} ${opacity}`}
      style={style}
    />
  );
}

/* ── animated count badge ──────────────────────────────────────────────────── */
function CountBadge({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4 text-center animate-fade-in-up">
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-400 font-medium tracking-wide">{label}</p>
    </div>
  );
}

/* ── feature card ──────────────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  orbColor,
  iconGradient,
  delay = '',
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  orbColor: string;
  iconGradient: string;
  delay?: string;
}) {
  return (
    <div className={`feature-card group animate-fade-in-up ${delay}`}>
      <div className={`glow-orb ${orbColor}`} />
      <div
        className={`h-14 w-14 flex items-center justify-center rounded-2xl mb-5 text-white ${iconGradient}`}
        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
      >
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── pricing card ──────────────────────────────────────────────────────────── */
function PricingCard({
  name,
  price,
  period,
  desc,
  features,
  cta,
  href,
  highlight,
  gradient,
  delay = '',
}: {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  gradient: string;
  delay?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl p-8 animate-fade-in-up ${delay} ${
        highlight
          ? 'bg-gradient-to-b from-primary-900/40 to-primary-950/20 border border-primary-500/40 shadow-[0_0_60px_rgba(34,197,94,0.2)]'
          : 'glass-card'
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="badge-green px-4 py-1.5 text-sm font-bold">
            <Star className="h-3.5 w-3.5" /> Most Popular
          </span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="mt-3 flex items-end gap-1">
          <span className={`text-5xl font-extrabold ${gradient}`}>{price}</span>
          {period && <span className="text-slate-400 text-lg pb-1">{period}</span>}
        </div>
        <p className="mt-2 text-slate-400 text-sm">{desc}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-slate-300 text-sm">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold transition-all duration-300 ${
          highlight
            ? 'btn-primary'
            : 'btn-secondary text-slate-200'
        }`}
      >
        {cta}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ── step card ─────────────────────────────────────────────────────────────── */
function StepCard({
  step,
  title,
  desc,
  color,
  delay = '',
}: {
  step: number;
  title: string;
  desc: string;
  color: string;
  delay?: string;
}) {
  return (
    <div className={`flex gap-5 glass-card rounded-2xl p-6 animate-fade-in-up ${delay}`}>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-extrabold text-lg text-white ${color}`}
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      >
        {step}
      </div>
      <div>
        <h4 className="font-bold text-white text-base">{title}</h4>
        <p className="mt-1.5 text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Ambient background */}
      <div className="bg-scene" />
      <div className="bg-grid" />

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden section-pad">
        {/* Orbs */}
        <Orb size="h-[500px] w-[500px]" color="bg-primary-500" style={{ top: '-200px', left: '5%' }} blur="blur-[120px]" opacity="opacity-20" />
        <Orb size="h-[400px] w-[400px]" color="bg-violet-500" style={{ top: '-100px', right: '5%' }} blur="blur-[100px]" opacity="opacity-15" />
        <Orb size="h-[300px] w-[300px]" color="bg-cyan-500" style={{ bottom: '5%', left: '30%' }} blur="blur-[90px]" opacity="opacity-10" />

        <div className="container-max relative z-10">
          <div className="text-center">
            {/* Trust badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold glass-md text-slate-300 animate-fade-in">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Trusted by learners in</span>
              <span className="text-cyan-400 font-bold">150+ countries</span>
              <span className="ml-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] animate-fade-in-up delay-100">
              <span className="text-white">Master any exam</span>
              <br />
              <span className="gradient-text">with AI-powered</span>
              <br />
              <span className="text-white">adaptive learning</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 leading-relaxed animate-fade-in-up delay-200">
              LEARNVATE adapts to your pace in real-time. Answer questions, get instant feedback, and watch your scores improve. Join the global learning revolution.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up delay-300">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="btn-primary text-lg px-10 py-4">
                      <BarChart3 className="h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup" className="btn-primary text-lg px-10 py-4">
                        <Rocket className="h-5 w-5" />
                        Start learning free
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                      <Link href="/login" className="btn-secondary text-lg px-10 py-4">
                        <Play className="h-4 w-4" />
                        Log in
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Stats ribbon */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl mx-auto animate-fade-in-up delay-400">
              <CountBadge value="2M+" label="Active learners" color="text-gradient-green" />
              <CountBadge value="150+" label="Countries" color="text-gradient-cyan" />
              <CountBadge value="98%" label="Satisfaction" color="text-gradient-violet" />
              <CountBadge value="50K+" label="Questions" color="text-gradient-amber" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="section-pad relative overflow-hidden">
        <Orb size="h-[400px] w-[400px]" color="bg-indigo-500" style={{ top: '0', right: '-100px' }} blur="blur-[100px]" opacity="opacity-10" />

        <div className="container-max relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="badge-cyan mb-4">
              <Sparkles className="h-3 w-3" /> Core Features
            </span>
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Built for{' '}
              <span className="gradient-text-cool">global success</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Everything you need to master exams and compete on the world stage
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Cpu}
              title="Adaptive AI"
              desc="Difficulty adjusts in real-time based on your performance. Always challenged, never overwhelmed."
              orbColor="bg-primary-500"
              iconGradient="bg-gradient-to-br from-primary-400 to-cyan-600"
              delay="delay-100"
            />
            <FeatureCard
              icon={BarChart3}
              title="Progress Tracking"
              desc="Dashboard with stats, accuracy by category, and streaks. See your growth over time."
              orbColor="bg-violet-500"
              iconGradient="bg-gradient-to-br from-violet-400 to-indigo-600"
              delay="delay-200"
            />
            <FeatureCard
              icon={Trophy}
              title="Global Rankings"
              desc="Compete with learners worldwide. Climb the leaderboard and earn recognition."
              orbColor="bg-amber-500"
              iconGradient="bg-gradient-to-br from-amber-400 to-rose-500"
              delay="delay-300"
            />
            <FeatureCard
              icon={Lock}
              title="Secure & Private"
              desc="Your data stays yours. We never sell your information. Learn with confidence."
              orbColor="bg-cyan-500"
              iconGradient="bg-gradient-to-br from-cyan-400 to-primary-600"
              delay="delay-400"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden">
        <Orb size="h-[350px] w-[350px]" color="bg-rose-500" style={{ bottom: '0', left: '-80px' }} blur="blur-[100px]" opacity="opacity-10" />
        <Orb size="h-[300px] w-[300px]" color="bg-primary-500" style={{ top: '20%', right: '10%' }} blur="blur-[80px]" opacity="opacity-10" />

        <div className="container-max relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Steps */}
            <div className="animate-fade-in-up">
              <span className="badge-violet mb-4">
                <Zap className="h-3 w-3" /> How It Works
              </span>
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
                Three steps to{' '}
                <span className="gradient-text-warm">transformation</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                Simple yet powerful — your exam prep reimagined
              </p>
              <div className="space-y-4">
                <StepCard
                  step={1}
                  title="Choose a category"
                  desc="Math, Science, History, and more. Pick what you want to master from 6 expertly curated subjects."
                  color="bg-gradient-to-br from-primary-400 to-cyan-600"
                  delay="delay-100"
                />
                <StepCard
                  step={2}
                  title="Answer adaptively"
                  desc="Our AI adjusts difficulty in real-time. Get it right? Harder questions. Wrong? We help you build up gradually."
                  color="bg-gradient-to-br from-violet-400 to-indigo-600"
                  delay="delay-200"
                />
                <StepCard
                  step={3}
                  title="Track & Earn"
                  desc="Watch your accuracy rise. Earn points, climb global rankings, and get certified for mastery."
                  color="bg-gradient-to-br from-amber-400 to-rose-500"
                  delay="delay-300"
                />
              </div>
            </div>

            {/* Visual */}
            <div className="relative animate-float">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/10 blur-xl" />
              <div className="relative glass-card rounded-3xl p-8 glow-green">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white font-bold text-lg">Today's Session</p>
                    <p className="text-slate-400 text-sm">Adaptive Quiz — Round 3</p>
                  </div>
                  <div className="badge-green">
                    <Zap className="h-3 w-3" /> Live
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6 glass rounded-2xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 text-sm">Progress</span>
                    <span className="text-primary-400 font-bold text-sm">7 / 10</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-cyan-400 transition-all"
                      style={{ width: '70%' }}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  {[
                    { name: 'Mathematics', acc: '92%', color: 'text-primary-400', bg: 'bg-primary-500/15' },
                    { name: 'Science', acc: '87%', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
                    { name: 'History', acc: '79%', color: 'text-violet-400', bg: 'bg-violet-500/15' },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      className={`flex items-center justify-between rounded-xl ${cat.bg} border border-white/5 px-4 py-3`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className={`h-4 w-4 ${cat.color}`} />
                        <span className="font-medium text-white text-sm">{cat.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${cat.color}`}>{cat.acc}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="mt-6 flex gap-3">
                  <div className="flex-1 glass rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-white">86<span className="text-sm font-normal text-slate-400">%</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">Accuracy</p>
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-amber-400">🔥 7</p>
                    <p className="text-xs text-slate-400 mt-0.5">Day streak</p>
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-violet-400">#142</p>
                    <p className="text-xs text-slate-400 mt-0.5">Global rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ─────────────────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="badge-rose mb-4">
              <Users className="h-3 w-3" /> Testimonials
            </span>
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Loved by learners{' '}
              <span className="gradient-text">worldwide</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Aisha Patel',
                role: 'Medical Student, India',
                text: 'LEARNVATE helped me ace my NEET prep. The AI adapts so well that I was always in the perfect challenge zone. My score went from 72% to 94% in two months!',
                rating: 5,
                avatar: '👩‍⚕️',
                delay: 'delay-100',
              },
              {
                name: 'Carlos Mendez',
                role: 'Finance Professional, Brazil',
                text: 'Preparing for my CFA exams was daunting. LEARNVATE made it manageable. The adaptive difficulty kept me sharp without burning out. Passed Level 1 on first try!',
                rating: 5,
                avatar: '👨‍💼',
                delay: 'delay-200',
              },
              {
                name: 'Emma Thompson',
                role: 'High School Teacher, UK',
                text: 'I use LEARNVATE with my students. The progress tracking lets me see exactly who needs help and where. My class average went up by 18 points this term!',
                rating: 5,
                avatar: '👩‍🏫',
                delay: 'delay-300',
              },
            ].map((t) => (
              <div key={t.name} className={`feature-card animate-fade-in-up ${t.delay}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full glass flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="section-pad relative overflow-hidden">
        <Orb size="h-[400px] w-[400px]" color="bg-accent-500" style={{ top: '10%', right: '-100px' }} blur="blur-[120px]" opacity="opacity-10" />
        <Orb size="h-[300px] w-[300px]" color="bg-primary-500" style={{ bottom: '10%', left: '-80px' }} blur="blur-[100px]" opacity="opacity-10" />

        <div className="container-max relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="badge-amber mb-4">
              <Sparkles className="h-3 w-3" /> Pricing
            </span>
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Simple,{' '}
              <span className="gradient-text-warm">transparent</span>{' '}
              pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Start free. Upgrade when you&apos;re ready to go pro
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <PricingCard
              name="Free"
              price="$0"
              desc="Perfect to get started"
              features={[
                'Unlimited adaptive quizzes',
                '6 subject categories',
                'Basic progress tracking',
                'Instant feedback',
              ]}
              cta="Get started free"
              href="/signup"
              highlight={false}
              gradient="text-gradient-green"
              delay="delay-100"
            />
            <PricingCard
              name="Pro"
              price="$9"
              period="/mo"
              desc="For serious learners"
              features={[
                'Everything in Free',
                'Advanced analytics',
                'Global leaderboard access',
                'Certificate of mastery',
                'Priority support',
              ]}
              cta="Start Pro trial"
              href="/signup?plan=pro"
              highlight={true}
              gradient="text-gradient-green"
              delay="delay-200"
            />
            <PricingCard
              name="Team"
              price="$29"
              period="/mo"
              desc="For schools & organizations"
              features={[
                'Everything in Pro',
                'Up to 50 learners',
                'Admin dashboard',
                'Custom categories',
                'API access',
              ]}
              cta="Contact sales"
              href="/signup?plan=team"
              highlight={false}
              gradient="text-gradient-violet"
              delay="delay-300"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="section-pad relative overflow-hidden">
        <Orb size="h-[500px] w-[500px]" color="bg-primary-500" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} blur="blur-[140px]" opacity="opacity-15" />

        <div className="container-max relative z-10">
          <div className="relative glass-card rounded-3xl p-12 lg:p-20 text-center overflow-hidden animate-fade-in-up glow-green">
            {/* inner glow ring */}
            <div className="absolute inset-0 rounded-3xl border border-primary-500/20 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />

            <span className="badge-green mb-6 text-sm">
              <Rocket className="h-3.5 w-3.5" /> Start today
            </span>
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl mb-4">
              Ready to master{' '}
              <span className="gradient-text">your exams?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400 mb-10">
              Join millions of learners worldwide. Start free, no credit card required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-primary text-lg px-12 py-4">
                <Sparkles className="h-5 w-5" />
                Create free account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/#features" className="btn-secondary text-lg px-10 py-4">
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12">
        <div className="container-max">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-cyan-600 text-white shadow-glow-cyan group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5" />
              </span>
              <span className="font-extrabold text-xl text-white tracking-tight">LEARNVATE</span>
            </Link>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {[
                { href: '/#features', label: 'Features' },
                { href: '/#pricing', label: 'Pricing' },
                { href: '/login', label: 'Log in' },
                { href: '/signup', label: 'Sign up' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-primary-400 transition-colors duration-200">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <p className="mt-6 text-center text-sm text-slate-600">
              © {new Date().getFullYear()} LEARNVATE. AI-Powered Learning for the Global Market.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
