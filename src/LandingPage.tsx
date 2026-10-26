import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Users, Calendar, BookOpen, Award, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

function LiquidGlassButton({ children, className = '', size, onClick }: { children: React.ReactNode; className?: string; size?: 'sm' | 'default'; onClick?: () => void }) {
  const px = size === 'sm' ? 'px-4 py-2' : 'px-6 py-2.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <button
      className={`liquid-glass rounded-full ${px} ${textSize} text-foreground transition-transform hover:scale-[1.03] cursor-pointer active:scale-95 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NavBar() {
  const { login } = useApp();

  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-3xl tracking-tight text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Kadiri Study Circle<sup className="text-xs align-super">®</sup>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#home" className="text-sm text-foreground font-medium">Home</a>
        <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
        <a href="#programs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Programs</a>
        <a href="#results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Results</a>
        <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reach Us</a>
      </div>
      <LiquidGlassButton onClick={() => login('admin', 'admin@kadirisc.in', 'admin')}>
        Enter Portal
      </LiquidGlassButton>
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-[90px] pb-40">
      <h1 className="animate-fade-rise" style={{ fontFamily: "'Instrument Serif', serif" }}>
        <span className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal">
          Where disciplined preparation
          <br />
          <em className="not-italic text-muted-foreground">meets</em>
          <br />
          civil service success.
        </span>
      </h1>
      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        Kadiri Study Circle trains APPSC Group I & Group II aspirants across Sri Sathya Sai district —
        through daily attendance, expert faculty, and structured mock tests that turn consistency into ranks.
      </p>
      <div className="animate-fade-rise-delay-2 flex items-center gap-3 mt-12">
        <LiquidGlassButton className="px-14 py-5 text-base" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
          Explore Programs <ArrowRight className="inline ml-2 w-4 h-4" />
        </LiquidGlassButton>
        <LiquidGlassButton onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}>
          See Results
        </LiquidGlassButton>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Users, value: '35', label: 'Aspirants Enrolled' },
          { icon: Calendar, value: '57+', label: 'Sessions Conducted' },
          { icon: Award, value: '92.9%', label: 'Average Attendance' },
          { icon: BookOpen, value: '4', label: 'Expert Faculty' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-3">
              <Icon className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgramsSection() {
  const programs = [
    {
      title: 'APPSC Group I',
      subtitle: 'Executive Stream',
      description: 'Deputy Collector, DSP, Commercial Tax Officer, RDO — for aspirants targeting senior executive roles across Andhra Pradesh.',
      stats: '12 aspirants · 25 sessions',
      color: 'from-teal-500/20 to-teal-500/5',
      icon: GraduationCap,
    },
    {
      title: 'APPSC Group II',
      subtitle: 'Non-Executive Stream',
      description: 'Deputy Tahsildar, Sub-Registrar, ACTO, Assistant Section Officer — for candidates preparing for the state\'s most sought-after junior executive posts.',
      stats: '23 aspirants · 32 sessions',
      color: 'from-indigo-500/20 to-indigo-500/5',
      icon: BookOpen,
    },
  ];

  return (
    <section id="programs" className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Two Streams. One Standard.
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Structured coaching for every level of the Andhra Pradesh Public Service Commission —
          with daily roll-call, faculty-led sessions, and weekly mock tests.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {programs.map(({ title, subtitle, description, stats, color, icon: Icon }) => (
          <div key={title} className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${color} p-8 hover:scale-[1.01] transition-transform duration-300`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>{title}</div>
                <div className="text-sm text-muted-foreground">{subtitle}</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-muted-foreground">{stats}</span>
              <LiquidGlassButton size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Join This Program <ArrowRight className="inline ml-2 w-4 h-4" />
              </LiquidGlassButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section id="results" className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Built on Daily Discipline
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Attendance below 75% means no mock test hall ticket. That rule creates the consistency that turns aspirants into selected candidates.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Average Attendance', value: '92.9%', detail: 'Across all 35 enrolled aspirants' },
          { label: 'Faculty Sessions', value: '57+', detail: 'Indian Polity, Economy, History, Science & Mental Ability' },
          { label: 'Mock Tests Conducted', value: '3', detail: 'Grand tests and subject-wise tests with rank analysis' },
        ].map(({ label, value, detail }) => (
          <div key={label} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-4xl font-bold text-teal-400 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</div>
            <div className="text-sm font-medium text-foreground mb-1">{label}</div>
            <div className="text-sm text-muted-foreground">{detail}</div>
          </div>
        ))}
      </div>
      <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Attendance Rule: 75% Minimum</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hall tickets for the internal grand mock series are issued only to aspirants who maintain at least 75% attendance.
              Those below the threshold meet the center coordinator for follow-up — because consistency, not intensity, wins civil services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { login } = useApp();

  return (
    <section id="contact" className="relative z-10 max-w-4xl mx-auto px-6 mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Begin Your Preparation
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Kadiri Study Circle · Sri Sathya Sai District, Andhra Pradesh
        </p>
      </div>
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <span>+91 98480 55001</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span>info@kadirisc.in</span>
          </div>
        </div>
        <LiquidGlassButton className="px-14 py-5 text-base" onClick={() => login('admin', 'admin@kadirisc.in', 'admin')}>
          Open Admin Portal <ArrowRight className="inline ml-2 w-4 h-4" />
        </LiquidGlassButton>
        <p className="text-xs text-muted-foreground mt-4">Demo access — records stay in your browser.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Kadiri Study Circle<sup className="text-xs align-super">®</sup>
        </span>
        <p className="mt-2">APPSC Group I & Group II Coaching · Sri Sathya Sai District, Andhra Pradesh</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Kadiri Study Circle. Built for aspirants, not templates.</p>
      </div>
    </footer>
  );
}

function LandingInner() {
  return (
    <div className="min-h-screen bg-[hsl(201,100%,13%)] text-foreground selection:bg-teal-500/30">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />
      <div className="absolute inset-0 z-0 bg-[hsla(201,100%,13%,0.6)]" />
      <NavBar />
      <HeroSection />
      <StatsBar />
      <ProgramsSection />
      <ResultsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default function LandingPage() {
  return (
    <AppProvider>
      <LandingInner />
    </AppProvider>
  );
}
