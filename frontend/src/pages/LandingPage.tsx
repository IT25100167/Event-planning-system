import React from 'react';
import { ArrowRight, CalendarDays, Building2, Package, Sparkles, Users, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  onBooking: () => void;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white/15 text-white' : 'bg-[#5b43d6] text-white'}`}>
        <Sparkles size={18} />
      </div>
      <span className={`text-[17px] font-semibold tracking-[-0.02em] ${light ? 'text-white' : 'text-[#18213a]'}`}>
        Event<span className={light ? 'text-violet-200' : 'text-[#6d55ed]'}>Flow</span>
      </span>
    </div>
  );
}

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-50 text-violet-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    neutral: 'bg-slate-100 text-slate-600'
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors[tone] || colors.neutral}`}>
      {children}
    </span>
  );
}

export default function LandingPage({ onEnter, onBooking }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#fcfbff] text-[#1d2944]">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-[#211d4a]/95 text-white backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo light/>
          <nav className="hidden items-center gap-7 text-xs text-violet-100 md:flex">
            <a href="#services">Services</a>
            <a href="#packages">Packages</a>
            <a href="#how">How it works</a>
            <a href="#stories">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={onEnter} className="hidden text-xs font-semibold text-violet-100 sm:block">Login</button>
            <button onClick={onBooking} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#5741cb] shadow-lg">
              Plan your event <ArrowRight size={14} className="ml-1 inline"/>
            </button>
          </div>
        </div>
      </header>
      
      <main>
        <section className="relative overflow-hidden bg-[#211d4a] text-white">
          <div className="absolute -right-20 top-0 h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-3xl"/>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
            <div className="relative z-10">
              <Badge tone="violet">The smarter way to celebrate</Badge>
              <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-0.06em] sm:text-6xl">
                Plan your perfect event, <span className="text-violet-300">without the stress.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-violet-100/75">
                From venue selection and trusted vendors to payments and event coordination, manage your entire event from one simple platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={onBooking} className="rounded-xl bg-[#8069ef] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30">
                  Start planning <ArrowRight size={16} className="ml-1 inline"/>
                </button>
                <button onClick={() => document.getElementById('packages')?.scrollIntoView({behavior:'smooth'})} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white">
                  Explore packages
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Everything in one place</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Everything you need to plan an unforgettable event.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[[Building2,'Venue management','Find the perfect space'],[Package,'Catering','Curated menus'],[Sparkles,'Decoration','Creative partners'],[Users,'Coordination','Dedicated team']].map(([Icon,title,desc]:any)=>(
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0edff] text-[#684fe1]">
                  <Icon size={19}/>
                </div>
                <h3 className="mt-5 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#15132f] px-5 py-12 text-violet-100/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Logo light/>
            <p className="mt-4 max-w-xs text-xs leading-5">The calmer way to plan remarkable events.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-[10px]">© 2026 EventFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
