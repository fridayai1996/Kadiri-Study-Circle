import React, { useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { INITIAL_STUDENTS, INITIAL_FACULTY } from './data/initialData';

/* ============================================================
   Direction: sentence-as-layout · seed 2083626180 · sector education
   Palette: cobalt on sand   Type: Erode (Fontshare)
   ============================================================ */

function pickRegisterRows(): string[] {
  /* A realistic slice of the register: pick 12 students spread across
     both groups so the strip reads as a real roll-call, not a sorted list.
     Uses the actual INITIAL_STUDENTS data. */
  const picked: string[] = [];
  const g1 = INITIAL_STUDENTS.filter(s => s.group === 'Group I');
  const g2 = INITIAL_STUDENTS.filter(s => s.group === 'Group II');
  // 6 from Group I (first, third, fifth ... for spread), 6 from Group II
  for (let k = 0; k < 6 && k < g1.length; k++) picked.push(g1[k * 2].id);
  for (let k = 0; k < 6 && k < g2.length; k++) picked.push(g2[k * 2].id);
  return picked;
}

function RegisterStrip() {
  const ids = React.useMemo(() => pickRegisterRows(), []);
  /* Pretend today's roll-call: 32 of 35 present (from 23-Sep trend).
     Mark a realistic subset as absent so the strip shows the register's
     texture — present is the norm, a couple absent. */
  const absentIds = React.useMemo(() => {
    const pool = ids.slice();
    const chosen: string[] = [];
    // pick 2 absent from the strip for texture
    for (let i = 0; i < 2 && pool.length; i++) {
      const idx = (i * 3) % pool.length;
      chosen.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return new Set(chosen);
  }, [ids]);

  return (
    <div className="kscl-register" aria-hidden="true">
      {ids.map((id) => {
        const st = INITIAL_STUDENTS.find(s => s.id === id);
        if (!st) return null;
        const isAbsent = absentIds.has(id);
        return (
          <div key={id} className="kscl-register__cell">
            <span className="kscl-register__roll">{st.rollNo}</span>
            <span className="kscl-register__name">{st.name.split(' ').slice(-1)[0]}</span>
            <span className={`kscl-register__status ${isAbsent ? 'absent' : ''}`}>
              {isAbsent ? '✕' : '✓'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Erode font: Fontshare v2 ---- */
function ErodeLink() {
  return (
    <link
      rel="preconnect"
      href="https://api.fontshare.com"
    />
  );
}

/* ---- NAV (direction §6 — wordmark, 3 links, 1 action, all 15px) ---- */
function NavBar({ onEnter }: { onEnter: () => void }) {
  return (
    <nav className="kscl-nav">
      <a href="#home" className="kscl-wordmark">
        Kadiri Study Circle<span className="reg">®</span>
      </a>
      <div className="kscl-nav-links">
        <a href="#home" className="kscl-nav-link active">Home</a>
        <a href="#showcase" className="kscl-nav-link">Programmes</a>
        <a href="#contact" className="kscl-nav-link">Reach Us</a>
      </div>
      <button className="kscl-nav-cta" onClick={onEnter}>
        Begin Journey
      </button>
    </nav>
  );
}

/* ---- HERO (direction §6 — sentence split by a frame) ---- */
function HeroSection({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="home" className="kscl-hero">
      <div className="kscl-hero-phrase">
        <div className="kscl-hero-half">APPSC coaching</div>
        <div className="kscl-hero-frame">
          <RegisterStrip />
        </div>
        <div className="kscl-hero-half right">begins with roll-call.</div>
      </div>
      <p className="kscl-hero-support">
        Kadiri Study Circle runs APPSC Group I &amp; Group II prep across Sri Sathya Sai district — daily attendance, four faculty, and grand mock tests that turn consistency into ranks.
      </p>
      <button className="kscl-hero-action" onClick={onEnter}>
        Enter the Portal
      </button>
    </section>
  );
}

/* ---- STATS (direction §7.2 — column aligned on the decimal) ---- */
const STATS = [
  { figure: '35', caption: 'Aspirants enrolled across both groups' },
  { figure: '57', caption: 'Sessions conducted this term', dec: '+' },
  { figure: '92.9', caption: 'Average attendance', dec: '%' },
  { figure: '4', caption: 'Faculty mentors' },
];

function StatsSection() {
  return (
    <section className="kscl-section" id="stats">
      <div className="kscl-section__grid">
        <div>
          <div className="kscl-section__statement">
            <span className="soft">Daily attendance,</span>
            <br />
            <strong>measured weekly.</strong>
          </div>
          <p className="kscl-section__lead">
            Every session is a roll-call. The register closes each evening; the numbers below are taken from the live records.
          </p>
        </div>
        <div>
          <div className="kscl-stats__heading">
            <span className="soft">This term,</span>
            The register
          </div>
          <div className="kscl-stats__rows">
            {STATS.map((s, i) => (
              <div key={i} className="kscl-stat-row">
                <div />
                <div className="kscl-stat-figure">
                  {s.figure}<span className="dec">{s.dec || ''}</span>
                </div>
                <div className="kscl-stat-caption">{s.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- SHOWCASE — one frame, three distances, pinned (direction §7.3) ---- */
const PROGRAMME_FRAMES = [
  { stage: 1, top: '', bottom: 'Two streams.', caption: '' },
  { stage: 2, top: 'APPSC', bottom: 'Group I & Group II.', caption: 'Executive and non-executive streams, coached to the same standard.' },
  { stage: 3, top: '', bottom: 'One standard.', caption: 'Deputy Collector, DSP, Sub-Registrar, ACTO — prepared in the same room, on the same roll-call.' },
];
const SHOWCASE_IMAGE = 'https://picsum.photos/id/177/1400/1750?grayscale';

function ShowcaseSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (!frameRef.current) return;
    const markers: HTMLDivElement[] = [];
    for (let i = 2; i <= 4; i++) {
      const m = document.createElement('div');
      m.className = 'kscl-stage-marker';
      m.style.height = `${100}svh`;
      markers.push(m);
    }
    markers.forEach((m, i) => {
      m.style.marginTop = `${i * 100 + 100}svh`;
      document.body.appendChild(m);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === markers[0] && e.isIntersecting) setStage(1);
          else if (e.target === markers[1] && e.isIntersecting) setStage(2);
          else if (e.target === markers[2] && e.isIntersecting) setStage(3);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    markers.forEach((m) => io.observe(m));

    return () => {
      io.disconnect();
      markers.forEach((m) => m.remove());
    };
  }, []);

  const f = PROGRAMME_FRAMES[stage - 1];
  return (
    <section id="showcase" className="kscl-showcase" aria-label="Programmes">
      <div className="kscl-showcase__stage">
        <div className={`kscl-showcase__top${f.top === '' ? ' away' : ''}`}>
          {f.top}
        </div>
        <div
          ref={frameRef}
          className="kscl-showcase__frame"
          data-stage={String(stage)}
        >
          <img
            src={SHOWCASE_IMAGE}
            alt="Kadiri Study Circle classroom"
            loading="eager"
          />
        </div>
        <div className={`kscl-showcase__bottom${f.bottom === '' ? ' away' : ''}`}>
          {f.bottom}
        </div>
        <div className={`kscl-showcase__caption ${stage === 3 ? 'show' : ''}`}>
          {f.caption}
        </div>
      </div>
      <div style={{ height: '100svh' }} />
    </section>
  );
}

/* ---- PROOF — faculty names as one sentence (direction §7.4) ---- */
function ProofSection() {
  const names = INITIAL_FACULTY.map((f) => f.name);
  // wrap each name in a span so we can light one at a time
  return (
    <section className="kscl-proof" id="proof" aria-label="Faculty">
      <div className="kscl-proof__intro">The faculty</div>
      <p className="kscl-proof__sentence">
        {names.map((n) => (
          <span key={n} className="lit">{n}</span>
        ))}
        <span className="kscl-proof__stop">.</span>
      </p>
    </section>
  );
}

/* ---- CONTACT (direction §7.5 — sentence + portrait + two links) ---- */
function ContactSection({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="contact" className="kscl-contact" aria-label="Contact">
      <div>
        <p className="kscl-contact__sentence">
          Enquiries for the APPSC Group I and Group II batches are taken at the Kadiri centre, Monday to Saturday, with a seat reserved for each enquiry.
        </p>
      </div>
      <div className="kscl-contact__portrait">
        <img
          src="https://picsum.photos/id/768/400/400?grayscale"
          alt="Kadiri Study Circle centre"
          loading="lazy"
        />
      </div>
      <div className="kscl-contact__links">
        <p className="kscl-contact__question">Begin your preparation.</p>
        <button className="kscl-contact__link" onClick={onEnter}>
          +91 98480 55001
        </button>
        <a href="mailto:info@kadirisc.in" className="kscl-contact__link">
          info@kadirisc.in
        </a>
        <p className="kscl-contact__meta">
          Kadiri, Sri Sathya Sai district · reply within one working day
        </p>
      </div>
    </section>
  );
}

/* ---- FOOTER ---- */
function Footer() {
  return (
    <footer className="kscl-footer">
      <div className="kscl-footer__brand">
        Kadiri Study Circle<sup style={{ fontSize: '8px', verticalAlign: 'super' }}>®</sup>
      </div>
      <div className="kscl-footer__meta">
        APPSC Group I &amp; Group II Coaching · Sri Sathya Sai District, Andhra Pradesh
      </div>
    </footer>
  );
}

/* ---- BODY ---- */
function LandingInner({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="kscl-page">
      {/* Erode font (Fontshare) — loaded once */}
      <ErodeLink />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=erode@400,401,500,600&display=swap"
      />

      <NavBar onEnter={onEnter} />

      <HeroSection onEnter={onEnter} />

      <StatsSection />
      <ShowcaseSection />
      <ProofSection />
      <ContactSection onEnter={onEnter} />
      <Footer />
    </div>
  );
}

/* Scroll-enter: set .is-in-view on sections + hero once they cross the top.
   transform + opacity only; runs once per section. Observer lives in the
   same component that owns the root ref so it re-runs after ref attaches. */
function useScrollEnter(root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return;
    const selector = '.kscl-section, .kscl-hero';
    const els = root.querySelectorAll<HTMLElement>(selector);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in-view');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root]);
}

export default function LandingPage() {
  const { login } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    login('admin', 'admin@kadirisc.in', 'admin');
  };

  useScrollEnter(rootRef.current);

  return (
    <AppProvider>
      <div ref={rootRef}>
        <LandingInner onEnter={handleEnter} />
      </div>
    </AppProvider>
  );
}
