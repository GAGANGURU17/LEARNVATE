'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { BLOG_POSTS } from '@/lib/blog-data';
import { 
  Clock, ArrowRight, Calendar, User, 
  Sparkles, BookOpen, Search, Filter 
} from 'lucide-react';

export default function BlogPage() {
  const featuredPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      <Navbar />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-20 tricolor-top overflow-hidden">
        <div className="blob-saffron h-[400px] w-[400px]" style={{ top: '-100px', right: '-50px' }} />
        <div className="container-max relative z-10 text-center lg:text-left">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="badge-green mb-6 inline-flex">
              <BookOpen className="h-3.5 w-3.5" /> LEARNVATE Insights
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6">
              Master your <span className="gradient-text">exams with</span> expert advice
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-10">
              Tips, strategies, and deep dives into AI-powered learning and Indian competitive exam patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white transition-all shadow-sm"
                />
              </div>
              <button className="btn-secondary px-8 py-4 rounded-2xl flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-max">
          
          {/* ── Featured Post ─────────────────────────────────────────────── */}
          <div className="mb-20 animate-fade-in-up delay-100">
            <Link href={`/blog/${featuredPost.slug}`} className="group relative block overflow-hidden rounded-[2.5rem] bg-white shadow-elevated border border-gray-100 transition-all hover:shadow-card-hover lg:flex">
              <div className="relative h-64 w-full lg:h-auto lg:w-1/2 overflow-hidden">
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-saffron-600 font-bold px-4 py-1.5 rounded-full text-sm shadow-sm">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-14 lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                  <span className="flex items-center gap-1.5 font-medium"><Calendar className="h-4 w-4" /> {featuredPost.date}</span>
                  <span className="flex items-center gap-1.5 font-medium"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-saffron-600 transition-colors leading-tight lg:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-saffron-50 border border-saffron-100 flex items-center justify-center text-xl">{featuredPost.author.avatar}</div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm">{featuredPost.author.name}</p>
                      <p className="text-slate-400 text-xs">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-saffron-600 font-bold group/btn">
                    Read Article <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* ── Latest Posts Grid ─────────────────────────────────────────── */}
          <div className="grid gap-8 md:grid-cols-2 animate-fade-in-up delay-200">
            {otherPosts.map((post, idx) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-card border border-gray-100 transition-all hover:shadow-card-hover flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-navy-600 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-saffron-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">{post.author.avatar}</div>
                      <span className="text-slate-700 font-bold text-xs">{post.author.name}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-saffron-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Newsletter CTA ────────────────────────────────────────────── */}
          <div className="mt-24 relative overflow-hidden bg-navy-600 rounded-[3rem] p-8 lg:p-16 text-center shadow-elevated animate-fade-in-up delay-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-igreen-500 opacity-50" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="badge-amber mb-6 bg-white/10 text-saffron-300 border-white/20">
                <Sparkles className="h-3.5 w-3.5" /> Stay Updated
              </span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
                Fresh insights delivered <span className="text-saffron-400">to your inbox</span>
              </h2>
              <p className="text-navy-100 text-lg mb-10 opacity-80">
                Join 50,000+ subscribers for weekly tips on mastering competitive exams and AI learning strategies.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="flex-1 px-6 py-4 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-saffron-500/30 transition-all"
                  required
                />
                <button type="submit" className="btn-primary py-4 px-8 rounded-2xl shadow-glow-saffron">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer component would go here */}
    </div>
  );
}
