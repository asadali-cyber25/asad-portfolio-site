import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  CONTENT — edit everything here, the layout below doesn't change    */
/* ------------------------------------------------------------------ */
const PROFILE = {
  name: 'Asad Ali',
  firstName: 'Asad',
  lastName: 'Ali',
  role: 'IT Support & Security Operations',
  tagline: 'Diagnosing the failure before it becomes an incident.',
  title: 'IT Support Engineer | SIEM & CTEM Specialist',
  company: 'CyberSilo, Gujrat', // shown only in the Journey section — set to '' to hide
  location: 'Gujrat, Pakistan',
  photo: '/profile-cutout.webp', // transparent cut-out used everywhere
  backdrop: 'glow', // 'glow' = soft red light + rings (original)  |  'disc' = solid red studio disc
  cv: '/Asad_Ali_CV.pdf',
  whatsapp: 'https://wa.me/923323155941',
};

/* ---- SOCIAL LINKS ------------------------------------------------
   Paste your real URL to show a link everywhere on the site (hero,
   contact, mobile menu, footer). Leave '' to hide it.
   Links still containing "your-" are treated as empty, so you never
   ship a broken link by accident.                                    */
const SOCIALS = [
  { label: 'GitHub', url: 'https://github.com/asadali-cyber25' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/asadali-cyber' },
  { label: 'WhatsApp', url: 'https://wa.me/923323155941' },
  { label: 'Email', url: 'mailto:mrxasad33@gmail.com' },
  { label: 'TryHackMe', url: '' }, 
  { label: 'X', url: '' }, 
];
const isLive = (u) => !!u && !/your-(username|linkedin|handle)/i.test(u);
const LIVE_SOCIALS = SOCIALS.filter((x) => isLive(x.url));

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'toolkit', label: 'Framework' },
  { id: 'work', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

const STATS = [
  { big: 'SIEM', small: 'Monitoring', red: false },
  { big: 'CTEM', small: 'Exposure mgmt', red: false },
  { big: 'CLOUD', small: 'Deployments', red: true },
];

const FACTS = [
  ['Based in', PROFILE.location],
  ['Role', 'IT Support Engineer'],
  ['Focus', 'SIEM · CTEM · Infrastructure'],
  ['Status', 'Open to new roles'],
];

const SERVICES = [
  {
    n: '01',
    title: 'Security Monitoring',
    text: 'Central log aggregation, anomalous-behaviour detection and rapid incident response on enterprise SIEM platforms.',
  },
  {
    n: '02',
    title: 'Exposure Management',
    text: 'Continuous Threat Exposure Management (CTEM) campaigns across hybrid enterprise networks.',
  },
  {
    n: '03',
    title: 'Infrastructure & Support',
    text: 'Cross-platform Linux and Windows administration with tier-level technical support for client operations.',
  },
  {
    n: '04',
    title: 'Automation',
    text: 'Scripting and pipelines that remove manual work and surface problems before they become incidents.',
  },
];

const ORBIT = ['SIEM', 'CTEM', 'Linux', 'Windows Server', 'Cloud', 'Automation'];

const FRAMEWORK = [
  { title: 'Security & Defense', items: ['SIEM Platforms', 'CTEM', 'Vulnerability Management', 'Incident Response', 'Log Analysis'] },
  { title: 'Core Infrastructure', items: ['Linux', 'Windows Server', 'Cloud (AWS)', 'Virtualization', 'Networking & Firewalls', 'Active Directory'] },
  { title: 'Automation & Ops', items: ['Python', 'Bash', 'Containers', 'Scripting & Automation', 'IT Support'] },
];

const TICKER =
  '++ SIEM ++ CTEM ++ INCIDENT RESPONSE ++ VULNERABILITY MANAGEMENT ++ LINUX ++ WINDOWS ++ CLOUD ++ NETWORKING ++ FIREWALLS ++ VIRTUALIZATION ++ ACTIVE DIRECTORY ++ AUTOMATION ';

const PROJECTS = [
  {
    title: ['Enterprise', 'Deployments'],
    text: 'Led end-to-end SIEM and CTEM rollouts for enterprise clients across multiple industries — from onboarding and infrastructure provisioning to multi-tenant cloud environments, with strict SLA compliance.',
    tags: ['SIEM', 'CTEM', 'Cloud', 'Client Onboarding'],
    visual: 'lifecycle',
  },
  {
    title: ['Log', 'Pipelines'],
    text: 'Built automation pipelines that collect, parse and normalise audit and system logs from databases, servers and network devices, feeding them into SIEM platforms for real-time security alerting.',
    tags: ['Automation', 'Scripting', 'Log Analysis', 'Data Parsing'],
    visual: 'terminal',
  },
  {
    title: ['System', 'Hardening'],
    text: 'Ran configuration validations across diverse environments to feed CTEM scanning, and hardened Linux hosts, Windows servers and network devices against industry security baselines.',
    tags: ['CTEM', 'Hardening', 'Linux', 'Windows', 'Network Security'],
    visual: 'checklist',
  },
];

const OPEN_TO = ['IT Support', 'Systems Administration', 'Security Analyst'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisInstance = null; // smooth-scroll singleton

const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
};

/* ------------------------------------------------------------------ */
/*  Custom cursor (lightweight: transforms only, no blend modes)       */
/* ------------------------------------------------------------------ */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.4, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.4, ease: 'power3' });
    let shown = false;
    let hot = false;

    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e) => {
      const isHot = !!(e.target.closest && e.target.closest('a, button, [data-cursor]'));
      if (isHot === hot) return; // only animate when the state actually changes
      hot = isHot;
      gsap.to(ring.current, { scale: hot ? 1.8 : 1, backgroundColor: hot ? 'rgba(232,33,43,0.25)' : 'rgba(232,33,43,0)', duration: 0.25, overwrite: 'auto' });
      gsap.to(dot.current, { scale: hot ? 0 : 1, duration: 0.2, overwrite: 'auto' });
    };
    const down = () => gsap.to(ring.current, { scale: hot ? 1.4 : 0.8, duration: 0.15, overwrite: 'auto' });
    const up = () => gsap.to(ring.current, { scale: hot ? 1.8 : 1, duration: 0.2, overwrite: 'auto' });
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => shown && gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointerenter', enter);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointerenter', enter);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Cinematic photo stage — GPU-friendly (transform/opacity only)      */
/*  scroll parallax → reveal → slow camera move (runs only on-screen)  */
/* ------------------------------------------------------------------ */
const MOVES = {
  push: { from: { scale: 1.03, xPercent: 0, yPercent: 0 }, to: { scale: 1.12, xPercent: 0, yPercent: -1.5 } },
  left: { from: { scale: 1.08, xPercent: 3, yPercent: 0 }, to: { scale: 1.11, xPercent: -3, yPercent: -1 } },
  pull: { from: { scale: 1.15, xPercent: 0, yPercent: -2 }, to: { scale: 1.04, xPercent: 0, yPercent: 0 } },
};

/* Entrance presets — the photo reacts when the page scrolls to it.
   turn  : swings round from the side and ends facing the visitor
   left  : swipes in from the left   |  right : swipes in from the right
   rise  : lifts up out of the floor                                     */
const ENTER = {
  turn: { from: { rotationY: -78, x: -30, y: 34, scale: 0.9, autoAlpha: 0 }, ease: 'back.out(1.3)', duration: 1.8 },
  left: { from: { x: -190, rotationY: 42, scale: 0.94, autoAlpha: 0 }, ease: 'power4.out', duration: 1.5 },
  right: { from: { x: 190, rotationY: -42, scale: 0.94, autoAlpha: 0 }, ease: 'power4.out', duration: 1.5 },
  rise: { from: { y: 110, rotationX: 26, scale: 1.1, autoAlpha: 0 }, ease: 'power3.out', duration: 1.6 },
};

const Stage = memo(({ className = '', move = 'push', enter = 'rise', tilt = false, scrubStart = 'top bottom', alt = PROFILE.name, ring = true, eager = false }) => {
  const root = useRef(null);
  const sc = useRef(null);
  const par = useRef(null);
  const kb = useRef(null);
  const disc = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let off;

    const ctx = gsap.context(() => {
      const m = MOVES[move];

      // slow camera move — only plays while the stage is on screen
      const drift = gsap.fromTo(kb.current, m.from, { ...m.to, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
      });

      // entrance (3D, transform/opacity only). Replays whenever you scroll back up to it.
      const e = ENTER[enter] || ENTER.rise;
      gsap.set(par.current, { transformPerspective: 1100, transformOrigin: '50% 62%' });
      gsap.fromTo(
        par.current,
        e.from,
        {
          rotationY: 0, rotationX: 0, x: 0, y: 0, scale: 1, autoAlpha: 1,
          duration: e.duration, ease: e.ease,
          scrollTrigger: { trigger: root.current, start: 'top 90%', toggleActions: 'play none none reset' },
        },
      );

      // scroll parallax (translate only)
      gsap.fromTo(
        sc.current,
        { yPercent: -3 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: scrubStart, end: 'bottom top', scrub: true } },
      );

      // mouse parallax (desktop only, hero)
      if (tilt && fine) {
        const kx = gsap.quickTo(kb.current, 'x', { duration: 1.2, ease: 'power3' });
        const ky = gsap.quickTo(kb.current, 'y', { duration: 1.2, ease: 'power3' });
        gsap.set(kb.current, { transformPerspective: 1000 });
        const ry = gsap.quickTo(kb.current, 'rotationY', { duration: 1.1, ease: 'power3' });
        const rx = gsap.quickTo(kb.current, 'rotationX', { duration: 1.1, ease: 'power3' });
        const dxq = disc.current ? gsap.quickTo(disc.current, 'x', { duration: 1.6, ease: 'power3' }) : null;
        const dyq = disc.current ? gsap.quickTo(disc.current, 'y', { duration: 1.6, ease: 'power3' }) : null;
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          kx(nx * -18); ky(ny * -10);
          ry(nx * 16); rx(ny * -8); // face follows the visitor
          if (dxq) { dxq(nx * 26); dyq(ny * 16); }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        off = () => window.removeEventListener('pointermove', onMove);
      }
    }, root);

    return () => {
      if (off) off();
      ctx.revert();
    };
  }, [move, tilt, scrubStart]);

  return (
    <div ref={root} className={`relative ${className}`}>
      {PROFILE.backdrop === 'disc' ? (
        <>
          {/* wide, soft halo (static) */}
          <div className="pointer-events-none absolute -inset-[30%] bg-[radial-gradient(closest-side,rgba(232,33,43,0.16),transparent_72%)]" />
          {/* red studio disc (no CSS translate here, so GSAP can move it freely) */}
          <div ref={disc} className="pointer-events-none absolute left-[5%] top-[0.4%] w-[90%] will-change-transform">
            <div
              className="disc-breathe aspect-square w-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 24%, #ff6a72 0%, #ee2a34 36%, #b8111b 72%, #6e070d 100%)',
                boxShadow: '0 0 90px 8px rgba(232,33,43,0.45), inset 0 -36px 70px rgba(0,0,0,0.38)',
              }}
            />
          </div>
          {ring && (
            <div className="ring-spin pointer-events-none absolute -left-[4%] -top-[6.3%] aspect-square w-[108%] rounded-full border border-white/20">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.65)]" />
            </div>
          )}
        </>
      ) : (
        <>
          {/* soft red light behind the subject (breathing) */}
          <div className="breathe pointer-events-none absolute -inset-[22%] bg-[radial-gradient(closest-side,rgba(232,33,43,0.32),transparent_72%)]" />
          {ring && (
            <>
              <div className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20" />
              <div className="ring-spin-slow pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15" />
            </>
          )}
        </>
      )}

      <div ref={sc} className="absolute inset-0 will-change-transform">
        <div ref={par} className="absolute inset-0">
          <div ref={kb} className="absolute inset-0 will-change-transform" style={{ transformOrigin: '50% 28%' }}>
            <img
              src={PROFILE.photo}
              alt={alt}
              width="1200"
              height="1607"
              draggable="false"
              decoding="async"
              loading={eager ? 'eager' : 'lazy'}
              fetchpriority={eager ? 'high' : 'auto'}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Sparkles — one light canvas for the whole page                     */
/*  twinkling stars + drifting embers, parallax with scroll,           */
/*  pauses when the tab is hidden, capped DPR, fewer on phones         */
/* ------------------------------------------------------------------ */
const Sparkles = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, parts = [];
    let lastY = window.scrollY;

    const make = (init) => {
      const depth = 0.25 + Math.random() * 0.75;
      const star = Math.random() < 0.38;
      const red = Math.random() < 0.5;
      return {
        x: Math.random() * w,
        y: init ? Math.random() * h : h + 20,
        depth,
        star,
        r: (star ? 2.8 + Math.random() * 3.8 : 0.8 + Math.random() * 1.6) * (0.6 + depth * 0.6),
        vy: -(0.05 + Math.random() * 0.16) * (0.4 + depth),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.2 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.8 + Math.random() * 1.8,
        c: red ? '255,82,92' : '255,255,255',
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 26000)));
      parts = Array.from({ length: count }, () => make(true));
    };

    const drawStar = (x, y, r) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    };

    const tick = (_, dt) => {
      const step = Math.min(dt, 50) / 16.7; // frame-rate independent
      const sy = window.scrollY;
      const dScroll = sy - lastY;
      lastY = sy;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.sway += p.swaySpeed * 0.016 * step;
        p.tw += p.twSpeed * 0.016 * step;
        p.x += Math.sin(p.sway) * 0.18 * p.depth * step;
        p.y += p.vy * step * 2.2 - dScroll * p.depth * 0.18; // parallax with scroll
        if (p.y < -24 || p.y > h + 60) { parts[i] = make(false); if (dScroll < 0) parts[i].y = -20; continue; }
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        const a = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(p.tw))) * (0.35 + p.depth * 0.5);
        ctx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
        if (p.star) drawStar(p.x, p.y, p.r * (0.7 + 0.3 * Math.sin(p.tw * 1.3)));
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
      }
    };

    resize();
    gsap.ticker.add(tick);
    const onVis = () => (document.hidden ? gsap.ticker.remove(tick) : (lastY = window.scrollY, gsap.ticker.add(tick)));
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[5] h-full w-full" aria-hidden="true" />;
};

/* ------------------------------------------------------------------ */
/*  Orbit — chips travel behind AND in front of the subject            */
/*  (transform-only; the loop sleeps when the section is off-screen)   */
/* ------------------------------------------------------------------ */
const Orbit = memo(() => {
  const box = useRef(null);
  const stageWrap = useRef(null);

  useEffect(() => {
    const el = box.current;
    const stage = stageWrap.current;
    if (!el || !stage) return undefined;
    const chips = [...el.querySelectorAll('.orbit-chip')];
    gsap.set(chips, { left: 0, top: 0, xPercent: -50, yPercent: -50 });
    const z = chips.map(() => -1);
    let angle = 0;
    let cx = 0, cy = 0, rx = 0, ry = 0;

    const measure = () => {
      const sw = stage.offsetWidth;
      const sh = stage.offsetHeight;
      const cw = el.clientWidth;
      cx = cw / 2;
      cy = stage.offsetTop + sh * 0.3;
      rx = Math.max(90, Math.min(sw * 0.82, cw / 2 - 70));
      ry = Math.max(26, sh * 0.075);
    };

    const place = () => {
      chips.forEach((chip, i) => {
        const a = angle + (i * Math.PI * 2) / chips.length;
        const depth = (Math.sin(a) + 1) / 2;
        gsap.set(chip, {
          x: cx + Math.cos(a) * rx,
          y: cy + Math.sin(a) * ry,
          scale: 0.82 + depth * 0.3,
          opacity: 0.45 + depth * 0.55,
        });
        const zi = depth > 0.5 ? 30 : 5;
        if (z[i] !== zi) { chip.style.zIndex = zi; z[i] = zi; }
      });
    };

    measure();
    place();
    const ro = new ResizeObserver(() => { measure(); place(); });
    ro.observe(el);

    if (prefersReduced()) return () => ro.disconnect();

    const tick = (_, dt) => { angle += (dt / 1000) * 0.5; place(); };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    });
    return () => { st.kill(); gsap.ticker.remove(tick); ro.disconnect(); };
  }, []);

  return (
    <div ref={box} className="relative mx-auto flex w-full max-w-4xl justify-center">
      <div ref={stageWrap} className="relative z-10">
        <Stage className="stage stage-orbit" move="pull" enter="rise" ring={false} />
      </div>
      {ORBIT.map((label) => (
        <span
          key={label}
          className={`orbit-chip absolute inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold will-change-transform sm:px-4 sm:py-2 sm:text-sm ${PROFILE.backdrop === 'disc' ? 'bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.55)]' : 'bg-brand text-white shadow-[0_8px_24px_rgba(232,33,43,0.45)]'}`}
        >
          {PROFILE.backdrop === 'disc' && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
          {label}
        </span>
      ))}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Small presentational pieces                                        */
/* ------------------------------------------------------------------ */
const SocialLinks = ({ className = '', linkClass = '', arrow = false, exclude = [] }) => {
  const items = LIVE_SOCIALS.filter((x) => !exclude.includes(x.label));
  if (!items.length) return null;
  return (
    <div className={className}>
      {items.map((x) => (
        <a
          key={x.label}
          href={x.url}
          {...(x.url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
          className={linkClass}
        >
          {x.label}{arrow ? ' ↗' : ''}
        </a>
      ))}
    </div>
  );
};

const Tag = ({ children }) => (
  <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand md:text-sm">{children}</p>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black md:text-sm">
    <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
    {children}
  </span>
);

const ProjectVisual = memo(({ type }) => {
  const shell = 'relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-[0_30px_80px_rgba(232,33,43,0.18)] md:p-9 lg:mx-0';

  if (type === 'lifecycle') {
    return (
      <div className={`${shell} bg-gradient-to-br from-[#ff3b44] to-[#b3101a] text-white`}>
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/70">Delivery lifecycle</p>
        <p className="font-display text-6xl leading-none sm:text-7xl">End-to-End</p>
        <ul className="mt-6 space-y-2 font-display text-xl uppercase tracking-wide sm:text-2xl">
          {['Client onboarding', 'Infrastructure provisioning', 'Multi-tenant cloud setup', 'SLA compliance'].map((c, i) => (
            <li key={c} className="flex items-baseline gap-3 border-b border-white/20 pb-2">
              <span className="text-sm text-white/60">0{i + 1}</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (type === 'terminal') {
    return (
      <div className={`${shell} border border-brand/40 bg-[#0b0b0b] font-mono text-[12px] leading-8 text-gray-300 sm:text-sm`}>
        <div className="mb-5 flex gap-2">
          <span className="h-3 w-3 rounded-full bg-brand" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/20" />
        </div>
        <p className="text-brand">$ ./log_pipeline --run</p>
        <p><span className="text-green-400">✓</span> collect from all sources</p>
        <p><span className="text-green-400">✓</span> parse &amp; normalise records</p>
        <p><span className="text-green-400">✓</span> ingest → SIEM platform</p>
        <p className="text-white">→ real-time alerts armed</p>
        <p className="mt-4 font-display text-6xl leading-none text-brand/90 sm:text-7xl">LOGS</p>
      </div>
    );
  }

  return (
    <div className={`${shell} border border-white/10 bg-[#0d0d0d]`}>
      <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gray-500">Hardening checklist</p>
      {['Security baselines applied', 'Linux hosts validated', 'Windows servers validated', 'Network devices aligned', 'Findings remediated'].map((row) => (
        <div key={row} className="flex items-center gap-4 border-b border-white/5 py-3">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] text-white">✓</span>
          <span className="text-sm text-gray-200 md:text-base">{row}</span>
        </div>
      ))}
      <p className="ctem-ready mt-5 font-display text-5xl uppercase leading-none sm:text-6xl">CTEM Ready</p>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Contact Form                                                       */
/* ------------------------------------------------------------------ */
const ContactForm = () => {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/mrblyvyb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-200';

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm md:p-8">
      <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-brand">/// Send a message</p>
      <h3 className="mb-6 font-display text-2xl uppercase text-white md:text-3xl">Drop me a line</h3>

      {status === 'sent' ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-2xl text-white">✓</span>
          <p className="font-display text-xl uppercase text-white">Message received!</p>
          <p className="text-sm text-gray-400">I'll get back to you soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-2 rounded-full border border-white/20 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-brand hover:text-brand"
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Asad Ali"
                value={form.name}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-gray-400">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell me about the role or project..."
              value={form.message}
              onChange={handleChange}
              className={`${inputCls} resize-none`}
            />
          </div>

          {status === 'error' && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
              Something went wrong. Try emailing me directly at mrxasad33@gmail.com
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-full bg-brand py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 hover:bg-[#c4121c] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending…' : 'Send Message →'}
          </button>
        </form>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Navbar — always visible, solid, animated                           */
/* ------------------------------------------------------------------ */
const Nav = ({ active, scrolled }) => {
  const [open, setOpen] = useState(false);
  const pill = useRef(null);
  const links = useRef({});

  // sliding active pill
  useLayoutEffect(() => {
    const move = () => {
      const el = links.current[active];
      if (!el || !pill.current) {
        if (pill.current) gsap.to(pill.current, { opacity: 0, duration: 0.25 });
        return;
      }
      gsap.to(pill.current, { x: el.offsetLeft, width: el.offsetWidth, opacity: 1, duration: 0.55, ease: 'power3.out' });
    };
    move();
    window.addEventListener('resize', move);
    return () => window.removeEventListener('resize', move);
  }, [active, scrolled]);

  // entrance (StrictMode-safe: explicit from/to values + reverted on cleanup)
  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-bar', { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1, clearProps: 'transform,opacity' });
      gsap.fromTo('.nav-in', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 0.5, clearProps: 'transform,opacity' });
    });
    return () => ctx.revert();
  }, []);

  // pause smooth-scroll + lock page while the mobile menu is open; Esc closes
  useEffect(() => {
    if (open) lenisInstance?.stop(); else lenisInstance?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.documentElement.style.overflow = '';
      lenisInstance?.start();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const go = useCallback((id) => (e) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => goTo(id), wasOpen ? 150 : 0);
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
        <div
          className={`nav-bar pointer-events-auto mx-auto flex items-center justify-between rounded-full border px-4 transition-[margin,width,padding,background-color,border-color,box-shadow] duration-500 ease-out sm:px-5 ${
            scrolled || open
              ? 'mt-2 w-[min(94vw,62rem)] border-white/15 bg-[#0d0d0d]/95 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.65)]'
              : 'mt-4 w-[min(94vw,64rem)] border-white/10 bg-[#0d0d0d]/80 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          }`}
        >
          <a href="#top" onClick={go('top')} className="nav-in group flex items-center gap-2 font-display text-2xl tracking-wide text-white">
            {PROFILE.firstName.toUpperCase()}
            <span className="h-2 w-2 rounded-full bg-brand transition-transform duration-300 group-hover:scale-150" />
          </a>

          <nav className="nav-in relative hidden items-center md:flex" aria-label="Primary">
            <span ref={pill} className="absolute left-0 top-0 h-full rounded-full bg-brand opacity-0" aria-hidden="true" />
            {NAV.map(({ id, label }) => (
              <a
                key={id}
                ref={(el) => { links.current[id] = el; }}
                href={`#${id}`}
                onClick={go(id)}
                className={`roll-link relative z-10 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors lg:px-4 lg:text-xs ${
                  active === id ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                <span className="roll">
                  <span>{label}</span>
                  <span aria-hidden="true">{label}</span>
                </span>
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="nav-in relative z-10 grid h-10 w-10 place-items-center rounded-full bg-white/5 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        aria-hidden={!open}
        className="fixed inset-0 z-[55] flex flex-col justify-center bg-[#050505] px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] md:hidden"
        style={{ clipPath: open ? 'circle(150% at calc(100% - 2.5rem) 2.5rem)' : 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_80%_0%,rgba(232,33,43,0.3),transparent_70%)]" />
        <ul className="relative space-y-1">
          {NAV.map(({ id, label }, i) => (
            <li key={id} className="overflow-hidden">
              <a
                href={`#${id}`}
                onClick={go(id)}
                tabIndex={open ? 0 : -1}
                className={`block font-display text-[clamp(2.6rem,13vw,4.2rem)] uppercase leading-[1.1] transition-all duration-700 ${
                  active === id ? 'text-brand' : 'text-white'
                } ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: open ? `${180 + i * 60}ms` : '0ms' }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <a href={PROFILE.whatsapp} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white">WhatsApp</a>
          <a href={PROFILE.cv} download="Asad_Ali_CV.pdf" tabIndex={open ? 0 : -1} className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white">Download CV</a>
        </div>
        <SocialLinks className="relative mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest text-gray-400" linkClass="hover:text-white" exclude={['WhatsApp']} />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const Portfolio = () => {
  const containerRef = useRef(null);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);

  /* inertia smooth scrolling */
  useEffect(() => {
    if (prefersReduced()) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useGSAP(
    () => {
      /* scroll progress bar */
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });

      /* navbar compacts after the first scroll */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => setScrolled(self.scroll() > 40),
      });

      /* active section tracking */
      ['top', ...NAV.map((n) => n.id)].forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(id === 'top' ? '' : id),
        });
      });

      if (prefersReduced()) return;

      /* hero intro */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 });
      tl.from('.hero-line', { yPercent: 115, duration: 1, stagger: 0.12 })
        .from('.hero-fade', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6');

      /* scroll reveals */
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 44,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
      });

      /* project titles: dim when out of view, bright when scrolled in */
      gsap.set('.project-title', { color: 'rgba(255,255,255,0.18)' });
      gsap.utils.toArray('.project-title').forEach((el) => {
        gsap.to(el, {
          color: 'rgba(255,255,255,1)',
          duration: 0.7,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el.closest('article') || el,
            start: 'top 68%',
            end: 'bottom 32%',
            toggleActions: 'play reverse play reverse',
          },
        });
      });

      /* CTEM Ready: dim when out of view, bright when card enters view */
      gsap.set('.ctem-ready', { color: 'rgba(255,255,255,0.06)' });
      const ctemEl = gsap.utils.toArray('.ctem-ready')[0];
      if (ctemEl) {
        gsap.to(ctemEl, {
          color: 'rgba(255,255,255,0.88)',
          duration: 0.7,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: ctemEl.closest('article') || ctemEl,
            start: 'top 60%',
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      /* journey outline year drifts across */
      gsap.fromTo(
        '.journey-year',
        { xPercent: -8 },
        { xPercent: 8, ease: 'none', scrollTrigger: { trigger: '#journey', start: 'top bottom', end: 'bottom top', scrub: true } },
      );

      /* contact headline */
      gsap.from('.contact-line', {
        yPercent: 100,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#contact', start: 'top 70%' },
      });
    },
    { scope: containerRef },
  );

  /* layout can shift once fonts/images land — keep triggers accurate */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-x-clip bg-[#050505] font-sans text-gray-200 selection:bg-brand selection:text-white"
    >
      <Sparkles />
      <Cursor />
      <div className="scroll-progress fixed left-0 top-0 z-[70] h-[3px] w-full origin-left scale-x-0 bg-brand shadow-[0_0_12px_rgba(232,33,43,0.8)]" />

      <Nav active={active} scrolled={scrolled} />

      {/* ------------------------------ HERO ----------------------------- */}
      <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pb-10 pt-28 lg:pb-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_75%_55%,rgba(232,33,43,0.20),transparent_70%)]" />
        <div className="hero-grid relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 sm:px-6 lg:grid-cols-2 lg:gap-8">
          <div className="hero-text order-2 mt-2 space-y-5 text-center lg:order-1 lg:mt-0 lg:space-y-6 lg:text-left">
            <p className="hero-fade font-mono text-[11px] uppercase tracking-[0.25em] text-brand sm:text-sm">{PROFILE.role}</p>
            <h1 className="font-display uppercase text-white text-[clamp(4.6rem,23vw,9rem)] leading-[0.92] tracking-tight lg:text-[clamp(6rem,12.5vw,13rem)]">
              <span className="block overflow-hidden py-[0.03em]"><span className="hero-line block">{PROFILE.firstName}</span></span>
              <span className="block overflow-hidden py-[0.03em]">
                <span className="hero-line block">{PROFILE.lastName}<span className="text-brand">.</span></span>
              </span>
            </h1>
            <p className="hero-fade font-display text-[clamp(1.4rem,5.4vw,2.3rem)] uppercase leading-tight tracking-wide text-white/90">
              Architecting <span className="text-brand">stability.</span>
            </p>
            <p className="hero-fade mx-auto max-w-md text-base leading-relaxed text-gray-400 md:text-lg lg:mx-0">
              {PROFILE.tagline}
              <span className="mt-3 block text-sm font-semibold text-white">{PROFILE.title}</span>
            </p>
            <div className="hero-fade flex flex-col justify-center gap-3 pt-1 sm:flex-row lg:justify-start">
              <a href="#work" onClick={(e) => { e.preventDefault(); goTo('work'); }} className="rounded-full bg-brand px-7 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-red-500">
                Explore work →
              </a>
              <a href={PROFILE.cv} download="Asad_Ali_CV.pdf" className="rounded-full border border-white/25 px-7 py-4 text-center text-sm font-bold text-white transition-colors hover:bg-white/5">
                Download CV
              </a>
            </div>
            <SocialLinks
              className="hero-fade flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-gray-500 lg:justify-start"
              linkClass="transition-colors hover:text-white"
            />
          </div>

          <div className="hero-photo order-1 flex justify-center lg:order-2 lg:justify-end">
            <Stage className="stage stage-hero" move="push" enter="turn" tilt scrubStart="top top" eager />
          </div>
        </div>
      </section>

      {/* ------------------------------ ABOUT ---------------------------- */}
      <section id="about" className="relative overflow-hidden border-t border-white/5 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_600px_at_20%_55%,rgba(232,33,43,0.14),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-5 lg:justify-start">
            <Stage className="stage stage-about" move="left" enter="left" tilt />
          </div>

          <div className="space-y-6 text-base font-light leading-relaxed text-gray-300 md:text-lg lg:col-span-7">
            <div data-reveal>
              <Tag>001 — About me</Tag>
              <h2 className="mt-3 font-display uppercase text-white text-[clamp(2.8rem,11vw,6rem)] leading-[1.02]">
                Securing<br />
                <span className="text-outline">The Infra.</span>
              </h2>
            </div>
            <p data-reveal>
              I'm <span className="font-medium text-white">{PROFILE.name}</span>, an IT Support Engineer based in Gujrat,
              Pakistan. My expertise lies at the intersection of robust systems administration and proactive cybersecurity. I
              engineer solutions that prevent incidents before they impact client operations.
            </p>
            <p data-reveal>
              I administer <span className="font-medium text-white">enterprise SIEM platforms</span> for central log
              aggregation, anomalous behaviour detection and rapid incident response, while running Continuous Threat
              Exposure Management (CTEM) campaigns across hybrid enterprise networks.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2 md:gap-4" data-reveal>
              {STATS.map((s) => (
                <div
                  key={s.big}
                  className={`rounded-2xl border p-3 sm:p-4 md:p-6 ${s.red ? 'border-brand bg-brand text-white' : 'border-white/10 bg-[#111] text-white'}`}
                >
                  <p className="font-display text-[clamp(1.4rem,6vw,3rem)] leading-none">{s.big}</p>
                  <p className={`mt-2 text-[9px] uppercase tracking-widest sm:text-[10px] md:text-xs ${s.red ? 'text-white/80' : 'text-gray-500'}`}>{s.small}</p>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-white/10 pt-6 font-mono text-xs sm:grid-cols-2 md:text-sm" data-reveal>
              {FACTS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2">
                  <dt className="uppercase tracking-widest text-gray-500">{k}</dt>
                  <dd className="text-right text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ----------------------------- SERVICES -------------------------- */}
      <section id="services" className="relative overflow-hidden border-t border-white/5 bg-[#080808] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mb-12 text-center md:mb-16 md:text-left" data-reveal>
            <Tag>What I do</Tag>
            <h2 className="mt-3 font-display uppercase text-white text-[clamp(2.6rem,9vw,5.2rem)] leading-[1.02]">
              Built to keep <span className="text-brand">systems safe.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.n}
                data-reveal
                className="group rounded-2xl border border-white/10 bg-[#111] p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1.5 hover:border-brand/60 hover:bg-[#151010] md:p-7"
              >
                <p className="font-display text-5xl leading-none text-brand/80 transition-colors group-hover:text-brand">{s.n}</p>
                <h3 className="mt-6 font-display text-2xl uppercase leading-tight text-white md:text-[1.7rem]">{s.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ ORBIT ---------------------------- */}
      <section id="orbit" className="relative overflow-hidden border-t border-white/5 bg-[#080808] pt-24 text-center md:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_50%_60%,rgba(232,33,43,0.20),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6" data-reveal>
          <Tag>Interactive core</Tag>
          <h2 className="mt-3 font-display uppercase text-white text-[clamp(2.8rem,11.5vw,6.5rem)] leading-[1.02]">
            Everything in <span className="text-brand">orbit.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light text-gray-400 md:text-base">
            The core platforms, operating systems, and automation tools rotating around my daily engineering workflow.
          </p>
        </div>
        <div className="relative mt-10 px-5">
          <Orbit />
        </div>
      </section>

      {/* ----------------------------- FRAMEWORK ------------------------- */}
      <section id="toolkit" className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a] pt-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6">
          <h2 className="mb-10 text-center font-mono text-xs uppercase tracking-[0.25em] text-brand md:text-left md:text-sm" data-reveal>
            /// Engine Framework
          </h2>
          <div className="space-y-4 md:space-y-5">
            {FRAMEWORK.map((row) => (
              <div key={row.title} data-reveal className="flex flex-col rounded-2xl border border-white/10 bg-[#111] p-5 md:p-8 lg:flex-row lg:items-center">
                <div className="mb-4 w-full text-center font-display text-2xl uppercase text-white md:text-3xl lg:mb-0 lg:w-1/3 lg:text-left">
                  {row.title}
                </div>
                <div className="flex w-full flex-wrap justify-center gap-2.5 lg:w-2/3 lg:justify-start lg:gap-3">
                  {row.items.map((s) => <Pill key={s}>{s}</Pill>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full -rotate-1 scale-[1.04] overflow-hidden whitespace-nowrap bg-brand py-4 text-white">
          <div className="animate-marquee inline-block text-sm font-black uppercase tracking-[0.2em] md:text-base">
            {TICKER}{TICKER}{TICKER}{TICKER}
          </div>
        </div>
        <div className="h-12" />
      </section>

      {/* ------------------------------ PROJECTS ------------------------- */}
      <section id="work" className="relative overflow-hidden border-t border-white/5 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <h2 className="mb-12 text-center font-mono text-xs uppercase tracking-[0.25em] text-brand md:mb-20 md:text-left md:text-sm" data-reveal>
            /// Field-Tested Work
          </h2>
          <div className="space-y-20 md:space-y-32">
            {PROJECTS.map((p, i) => (
              <article key={p.title.join('')} className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16" data-reveal>
                <div className={i % 2 ? 'lg:order-2' : ''}>
                  <div className="mb-4 font-display text-4xl text-brand md:text-5xl">
                    0{i + 1} <span className="text-2xl text-gray-700 md:text-3xl">/ 0{PROJECTS.length}</span>
                  </div>
                  <h3 className="project-title font-display uppercase transition-colors duration-700 text-[clamp(2.6rem,10vw,5.8rem)] leading-[1.02]">
                    {p.title[0]}<br />{p.title[1]}
                  </h3>
                  <p className="mt-6 text-sm font-light leading-relaxed text-gray-400 md:text-base lg:text-lg">{p.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white md:text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <div className={i % 2 ? 'lg:order-1' : ''}>
                  <ProjectVisual type={p.visual} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ JOURNEY -------------------------- */}
      <section id="journey" className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a] py-20 md:py-32">
        <div className="journey-year pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[14rem] leading-none text-outline-heavy will-change-transform md:text-[26rem]">
          2026
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 md:p-10" data-reveal>
            <h2 className="mb-10 font-mono text-xs uppercase tracking-[0.25em] text-brand md:text-sm">/// Professional Journey</h2>
            <div className="relative border-l border-white/10 pl-6 md:pl-8">
              <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-brand shadow-[0_0_12px_rgba(232,33,43,0.9)]" />
              <h4 className="font-display text-2xl uppercase text-white md:text-3xl">IT Support Engineer</h4>
              <p className="mb-3 mt-1 font-mono text-xs text-gray-400 md:text-sm">
                {PROFILE.company ? `${PROFILE.company} | ` : ''}2026 - Present
              </p>
              <p className="text-sm leading-relaxed text-gray-500 md:text-base">
                Leading tier-level technical support, managing cross-platform Linux/Windows infrastructure, and
                administering SIEM and CTEM deployments for major enterprise clients.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 md:p-10" data-reveal>
            <h2 className="mb-10 font-mono text-xs uppercase tracking-[0.25em] text-brand md:text-sm">/// Education & Training</h2>
            <div className="space-y-10">
              {[
                ['DAE in CIT', 'Faran Institute of Technology | 2022 - 2025'],
                ['SIEM Training', 'Security Monitoring | 2026'],
              ].map(([t, s]) => (
                <div key={t} className="relative border-l border-white/10 pl-6 md:pl-8">
                  <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-white/25" />
                  <h4 className="font-display text-2xl uppercase text-white md:text-3xl">{t}</h4>
                  <p className="mt-1 font-mono text-xs text-gray-400 md:text-sm">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ CONTACT -------------------------- */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[radial-gradient(1000px_800px_at_50%_40%,#ff3b44,#c4121c_55%,#6b0810)] py-20 selection:bg-black selection:text-white md:py-32"
      >
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:grid-cols-12">
          <div className="text-center lg:col-span-7 lg:text-left">
            <h2 className="font-display uppercase text-white text-[clamp(4.6rem,22vw,8.5rem)] tracking-[0.01em] lg:text-[clamp(7rem,10.5vw,12rem)]">
              <span className="block overflow-hidden pb-[0.06em] pt-[0.04em] leading-[1.02]"><span className="contact-line block">Let's</span></span>
              <span className="block overflow-hidden pb-[0.06em] pt-[0.04em] leading-[1.02]"><span className="contact-line block">Talk</span></span>
            </h2>
            <p className="mt-8 font-display text-[clamp(1.7rem,6vw,2.6rem)] uppercase leading-[1.15] text-white">
              Let's stabilize<br />your stack.
            </p>
            <p className="mx-auto mt-5 max-w-xl font-medium leading-relaxed text-white/90 lg:mx-0">
              Open to IT Support, Systems Administration, and Security Analyst roles. If it's a critical alert or an
              infrastructure that needs eyes on it — I'm ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {OPEN_TO.map((r) => (
                <span key={r} className="rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">{r}</span>
              ))}
            </div>
            <div className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start">
              <a href={PROFILE.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900">
                WhatsApp me now
              </a>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-white/90">
                <SocialLinks className="contents" linkClass="hover:text-white" arrow exclude={['WhatsApp']} />
                <a href={PROFILE.cv} download="Asad_Ali_CV.pdf" className="hover:text-white">Download CV ↗</a>
              </div>
            </div>
          </div>

          {/* ---- Contact Form ---- */}
          <div className="lg:col-span-5" data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="space-y-4 bg-black px-5 py-8 text-center font-mono text-[10px] uppercase tracking-widest text-gray-600 md:text-xs">
        <SocialLinks className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400" linkClass="transition-colors hover:text-white" />
        <p>© 2026 {PROFILE.name} — All Systems Nominal</p>
      </footer>
    </div>
  );
};

export default Portfolio;
