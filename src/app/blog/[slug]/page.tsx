'use client';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { BLOG_POSTS } from '@/lib/blog-data';
import { 
  ArrowLeft, Clock, Calendar, Share2, 
  MessageSquare, Bookmark, Play, Twitter, 
  Linkedin, Facebook, ArrowRight
} from 'lucide-react';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Post Header ─────────────────────────────────────────────────── */}
      <article>
        <header className="relative py-16 lg:py-24 bg-[#FFFAF5] tricolor-top overflow-hidden">
          <div className="container-max relative z-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-saffron-600 font-bold mb-10 transition-colors group">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" /> Back to blog
            </Link>

            <div className="max-w-4xl animate-fade-in-up">
              <span className="bg-saffron-100 text-saffron-700 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 inline-block">
                {post.category}
              </span>
              <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-7xl mb-8 leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 border-t border-slate-200 pt-8 mt-12">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-saffron-50 border border-saffron-100 flex items-center justify-center text-3xl select-none">
                    {post.author.avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-lg">{post.author.name}</p>
                    <p className="text-slate-500 text-sm tracking-wide">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Published</span>
                    <span className="text-slate-900 font-bold flex items-center gap-2 italic">{post.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Read Time</span>
                    <span className="text-slate-900 font-bold flex items-center gap-2 italic">{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Featured Image ─────────────────────────────────────────────── */}
        <div className="container-max -mt-10 lg:-mt-20 relative z-20 animate-fade-in-up delay-100">
          <div className="relative h-[400px] lg:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="container-max py-20 relative">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Sidebar / Social Share */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 flex flex-col gap-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center mb-2">Share</p>
                {[Twitter, Linkedin, Facebook, Share2].map((Icon, i) => (
                  <button key={i} className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:text-saffron-600 hover:border-saffron-200 hover:bg-saffron-50 transition-all shadow-sm">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:col-start-2">
              <div 
                className="prose prose-lg prose-slate max-w-none 
                prose-headings:text-slate-900 prose-headings:font-extrabold
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-saffron-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-saffron-500 prose-blockquote:bg-saffron-50 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6
                prose-li:text-slate-600 prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags/Navigation */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-sm font-bold border border-slate-100">#Preparation</span>
                  <span className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-sm font-bold border border-slate-100">#AI</span>
                </div>
                <button className="flex items-center gap-2 text-slate-400 hover:text-saffron-600 transition-colors font-bold group">
                  <Bookmark className="h-5 w-5 group-hover:fill-saffron-600 group-hover:text-saffron-600 transition-all" /> Save Article
                </button>
              </div>
            </div>

            {/* Author Card (Mobile) */}
            <div className="lg:col-span-3 space-y-10">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 animate-fade-in-up">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-saffron-500" /> About the Author
                </h4>
                <div className="text-center mb-6">
                  <div className="h-24 w-24 mx-auto bg-white rounded-[2rem] border-2 border-slate-200 flex items-center justify-center text-5xl mb-4 shadow-sm">
                    {post.author.avatar}
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-lg">{post.author.name}</h5>
                  <p className="text-slate-500 text-sm mt-1">{post.author.role}</p>
                </div>
                <button className="w-full btn-secondary text-xs uppercase tracking-widest font-bold py-3">Follow Expert</button>
              </div>

              {/* Related posts */}
              <div className="space-y-6">
                <h4 className="text-slate-900 font-bold flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-saffron-500" /> Keep Reading
                </h4>
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex gap-4 animate-fade-in-up">
                    <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-slate-200">
                      <Image src={rp.image} alt={rp.title} fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h5 className="text-slate-900 font-bold text-sm leading-snug group-hover:text-saffron-600 transition-colors line-clamp-2">
                        {rp.title}
                      </h5>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5">{rp.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── Next Post Ribbon ─────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-12 overflow-hidden relative group cursor-pointer">
        <Link href="/blog" className="container-max flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white/20 text-6xl font-black italic">UP NEXT</span>
            <span className="text-white font-bold text-xl lg:text-3xl tracking-tight max-w-lg line-clamp-1 group-hover:text-saffron-400 transition-colors">
              Explore more Indian Competitive Exam Strategies
            </span>
          </div>
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-saffron-500 transition-all group-hover:rotate-45">
            <ArrowRight className="h-8 w-8" />
          </div>
        </Link>
      </section>
    </div>
  );
}
