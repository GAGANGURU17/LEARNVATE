'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Linkedin, Twitter, Instagram, Github, CheckCircle2,
  Sparkles, Globe, Shield
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      <Navbar />
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 tricolor-top">
        <div className="blob-saffron h-[400px] w-[400px]" style={{ top: '-100px', left: '-50px' }} />
        <div className="blob-navy h-[300px] w-[300px]" style={{ bottom: '0', right: '-50px' }} />
        
        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <span className="badge-amber mb-6 inline-flex">
              <Sparkles className="h-3.5 w-3.5" /> Get in Touch
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6 leading-tight">
              We&apos;re here to <span className="gradient-text">support your</span> journey
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Have questions about our AI platform, pricing, or exam categories? Our team of educational experts is ready to help you succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* ── Contact Info ─────────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in-up delay-100">
              <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 group transition-all hover:shadow-card-hover hover:border-saffron-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600 mb-6 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-500 text-sm mb-4">Drop us a line anytime for technical support or inquiries.</p>
                <a href="mailto:support@learnvate.com" className="text-navy-600 font-bold hover:text-saffron-600 transition-colors">support@learnvate.com</a>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 group transition-all hover:shadow-card-hover hover:border-navy-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-600 mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Office</h3>
                <p className="text-slate-500 text-sm mb-4">Visit us at our headquarters for a coffee and chat.</p>
                <address className="not-italic text-slate-700 text-sm font-medium">
                  123 Tech Park, HSR Layout, <br />
                  Bengaluru, Karnataka 560102, India
                </address>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 group transition-all hover:shadow-card-hover hover:border-igreen-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-igreen-50 text-igreen-600 mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Global Support</h3>
                <p className="text-slate-500 text-sm mb-4">We speak your language. Multi-lingual support available.</p>
                <div className="flex -space-x-2">
                  {['🇺🇸', '🇮🇳', '🇧🇷', '🇬🇧', '🇫🇷'].map((flag, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-sm shadow-sm">
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Contact Form ─────────────────────────────────────────────── */}
            <div className="lg:col-span-8 animate-fade-in-up delay-200">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-elevated border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 via-navy-100 to-igreen-500" />
                
                {submitted ? (
                  <div className="text-center py-16 animate-scale-in">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-igreen-50 text-igreen-600 mb-8 border border-igreen-100 shadow-glow-green">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Message Sent!</h2>
                    <p className="text-slate-500 text-lg max-w-sm mx-auto mb-10 leading-relaxed">
                      Thank you for reaching out. One of our experts will get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn-primary px-10 py-4 text-lg"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 text-center lg:text-left">
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Send us a Message</h2>
                      <p className="text-slate-500 leading-relaxed">
                        Fill out the form below and we&apos;ll get in touch as soon as possible.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                          <input
                            id="name"
                            type="text"
                            placeholder="Aarav Sharma"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                          <input
                            id="email"
                            type="email"
                            placeholder="aarav@example.com"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:bg-white transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                        <select
                          id="subject"
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                        <textarea
                          id="message"
                          rows={5}
                          placeholder="How can we help you?"
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-igreen-500 focus:bg-white transition-all resize-none"
                          required
                        ></textarea>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary w-full py-5 text-lg rounded-2xl group relative overflow-hidden shadow-glow-saffron"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-3">
                              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-3">
                              <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              Send Message
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Footer ─────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16">
        <div className="container-max text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Follow our journey</h3>
          <div className="flex justify-center gap-6">
            {[
              { icon: Linkedin, color: 'hover:text-[#0077b5]', label: 'LinkedIn' },
              { icon: Twitter, color: 'hover:text-[#1da1f2]', label: 'Twitter' },
              { icon: Instagram, color: 'hover:text-[#e1306c]', label: 'Instagram' },
              { icon: Github, color: 'hover:text-[#333]', label: 'GitHub' }
            ].map(({ icon: Icon, color, label }, i) => (
              <a 
                key={i} 
                href="#" 
                className={`flex flex-col items-center gap-2 text-slate-400 transition-all hover:-translate-y-1 ${color}`}
              >
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse Footer from main page or layout - in this case it's in page.tsx currently, but we'll stick to a simple one here for now or add it to layout later */}
    </div>
  );
}
