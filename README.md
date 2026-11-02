# Asad Ali — Portfolio

React + Vite + Tailwind v4 + GSAP + Lenis (smooth scroll).

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # outputs dist/

- All text lives in the content block at the top of `src/App.jsx`
  (PROFILE, STATS, FACTS, SERVICES, FRAMEWORK, PROJECTS, OPEN_TO).
- Photo: `public/profile-cutout.webp` (transparent cut-out used on every section).
- CV: put your PDF at `public/Asad_Ali_CV.pdf`.
- Set your real LinkedIn URL in `PROFILE.linkedin`.
- `PROFILE.company` controls the employer name in the Journey section ('' hides it).
- Photo backdrop: `PROFILE.backdrop` — `'glow'` (soft red light + rings, default) or `'disc'` (solid red studio disc).
- Social links: edit the `SOCIALS` list near the top of `src/App.jsx`. A link appears everywhere (hero, contact, mobile menu, footer) once its URL is real; empty or `your-…` links stay hidden.
- Photo entrances: `enter="turn" | "left" | "right" | "rise"` on each `<Stage>`.
