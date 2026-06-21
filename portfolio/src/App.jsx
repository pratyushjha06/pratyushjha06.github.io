import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
};

// ─── PARTICLE CANVAS ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const dotColor = isDark ? "rgba(99,202,183,0.7)" : "rgba(10,90,110,0.5)";
      const lineColor = isDark ? "rgba(99,202,183," : "rgba(10,90,110,";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor + (1 - dist / 120) * 0.4 + ")";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = (y / rect.height - 0.5) * -16;
    const ry = (x / rect.width - 0.5) * 16;
    ref.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  };
  const handleLeave = () => {
    ref.current.style.transform =
      "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  };
  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

// ─── ANIMATED TEXT ────────────────────────────────────────────────────────────
function TypeWriter({ texts }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, texts]);
  return (
    <span className="typewriter">
      {displayed}
      <span className="cursor">|</span>
    </span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ dark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Skills", "Projects", "Experience", "Achievements", "Contact"];
  const PROFILE_PIC = "/assets/logo.jpg";

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__brand">
        <div className="navbar__avatar">
          <img
            src={PROFILE_PIC}
            alt="Pratyush Jha"
            className="navbar__avatar-img"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="navbar__avatar-fallback">PJ</div>
        </div>
        <span>Pratyush<span className="accent">.</span></span>
      </div>
      <div className={`navbar__links ${open ? "open" : ""}`}>
        {links.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
      </div>
      <div className="navbar__actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? "☀" : "☾"}
        </button>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const PROFILE_PIC = "/assets/display-pic.png";
  return (
    <section id="about" className="hero">
      <div className="hero__content">
        <p className="hero__greeting">Hello, I'm</p>
        <h1 className="hero__name">Pratyush Jha</h1>
        <h2 className="hero__role">
          <TypeWriter
            texts={[
              "Frontend Developer",
              "Data Science Enthusiast",
              "Founder @ Cryptivoxe",
              "CSE Undergrad @ IPU",
            ]}
          />
        </h2>
        <p className="hero__bio">
          B.Tech CSE student at IP University · Building digital products, solving real
          problems, and obsessing over clean interfaces &amp; meaningful data.
        </p>
        <div className="hero__cta">
          <a href="#projects" className="btn btn--primary">View Projects</a>
          <a
            href="https://linkedin.com/in/pratyushjha06"
            target="_blank"
            rel="noreferrer"
            className="btn btn--ghost"
          >
            Let's Connect
          </a>
        </div>
        <div className="hero__socials">
          <a href="https://github.com/pratyushjha06" target="_blank" rel="noreferrer" className="social-pill">GitHub</a>
          <a href="https://linkedin.com/in/pratyushjha06" target="_blank" rel="noreferrer" className="social-pill">LinkedIn</a>
          <a href="mailto:pratyushjha06@gmail.com" className="social-pill">Email: pratyushjha06@gmail.com</a>
        </div>
      </div>

      <div className="hero__visual">
        <div className="avatar-ring">
          <div className="avatar-inner avatar-inner--photo">
            <img
              src={PROFILE_PIC}
              alt="Pratyush Jha"
              className="avatar-photo"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <span className="avatar-initials-fallback">PJ</span>
          </div>
          <div className="ring ring1" />
          <div className="ring ring2" />
          <div className="ring ring3" />
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS DATA ──────────────────────────────────────────────────────────────
const skillGroups = [
  {
    label: "Languages",
    icon: "⌨",
    color: "#63cab7",
    items: [
      { name: "Python", level: "Advanced" },
      { name: "SQL", level: "Advanced" },
      { name: "JavaScript", level: "Intermediate" },
      { name: "C", level: "Intermediate" },
      { name: "C++", level: "Intermediate" },
    ],
  },
  {
    label: "Data & Analytics",
    icon: "📊",
    color: "#e08a5c",
    items: [
      { name: "Power BI", level: "Advanced" },
      { name: "Tableau", level: "Intermediate" },
      { name: "Excel (Advanced)", level: "Advanced" },
      { name: "EDA", level: "Advanced" },
      { name: "Statistics", level: "Intermediate" },
    ],
  },
  {
    label: "Libraries",
    icon: "📦",
    color: "#9b7ee8",
    items: [
      { name: "Pandas", level: "Advanced" },
      { name: "NumPy", level: "Advanced" },
      { name: "Matplotlib", level: "Intermediate" },
      { name: "Seaborn", level: "Intermediate" },
    ],
  },
  {
    label: "Frontend",
    icon: "🎨",
    color: "#e06c9b",
    items: [
      { name: "React.js", level: "Intermediate" },
      { name: "HTML5", level: "Advanced" },
      { name: "CSS3", level: "Advanced" },
      { name: "Tailwind", level: "Intermediate" },
    ],
  },
  {
    label: "Database",
    icon: "🗄",
    color: "#63cab7",
    items: [
      { name: "MySQL", level: "Advanced" },
      { name: "Data Querying", level: "Advanced" },
      { name: "Data Cleaning", level: "Intermediate" },
    ],
  },
  {
    label: "Tools",
    icon: "🛠",
    color: "#e08a5c",
    items: [
      { name: "Git", level: "Intermediate" },
      { name: "GitHub", level: "Intermediate" },
      { name: "VS Code", level: "Advanced" },
    ],
  },
];

const LEVEL_CONFIG = {
  Beginner:     { width: "25%",  dotCount: 1 },
  Intermediate: { width: "60%",  dotCount: 2 },
  Advanced:     { width: "88%",  dotCount: 3 },
  Expert:       { width: "100%", dotCount: 4 },
};

function SkillBar({ name, level, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  const config = LEVEL_CONFIG[level];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="skill-bar-item">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <div className="skill-bar-label" style={{ "--bar-color": color }}>
          <span className="skill-dots">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className="skill-dot"
                style={{
                  background: n <= config.dotCount ? color : "var(--bg3)",
                  boxShadow: n <= config.dotCount ? `0 0 6px ${color}88` : "none",
                }}
              />
            ))}
          </span>
          <span className="skill-level-text" style={{ color }}>{level}</span>
        </div>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: animated ? config.width : "0%",
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: animated ? `0 0 10px ${color}55` : "none",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function Skills() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];

  return (
    <section id="skills" className="section">
      <div className="section__header">
        <span className="section__tag">What I know</span>
        <h2 className="section__title">Skills & Technologies</h2>
      </div>

      <div className="skills-tabs">
        {skillGroups.map((g, i) => (
          <button
            key={g.label}
            className={`skills-tab ${active === i ? "skills-tab--active" : ""}`}
            style={active === i ? { "--tab-color": g.color } : {}}
            onClick={() => setActive(i)}
          >
            <span className="skills-tab-icon">{g.icon}</span>
            <span>{g.label}</span>
          </button>
        ))}
      </div>

      <TiltCard className="skills-panel glass-card" key={active}>
        <div className="skills-panel__header">
          <span className="skills-panel__icon">{group.icon}</span>
          <div>
            <h3 className="skills-panel__title">{group.label}</h3>
            <p className="skills-panel__count">{group.items.length} skills</p>
          </div>
        </div>
        <div className="skills-panel__bars">
          {group.items.map((item, i) => (
            <SkillBar
              key={`${active}-${item.name}`}
              name={item.name}
              level={item.level}
              color={group.color}
              delay={i * 80}
            />
          ))}
        </div>
      </TiltCard>

      <div className="skills-all-pills">
        {skillGroups.map((g) =>
          g.items.map((item) => (
            <span key={item.name} className="skills-pill" style={{ "--pill-color": g.color }}>
              {item.name}
            </span>
          ))
        )}
      </div>
    </section>
  );
}

// ─── PROJECTS (Top 3 Featured) ────────────────────────────────────────────────
const projects = [
  {
    name: "InvestIQ",
    tagline: "Retail Investor Intelligence Platform",
    desc: "An AI-powered platform giving retail investors institutional-grade insights — market signals, portfolio analysis, and smart stock recommendations.",
    stack: ["Python", "FastAPI", "React", "ML", "Finance API"],
    color: "#63cab7",
    emoji: "📈",
    status: "wip",
    links: { github: "https://github.com/pratyushjha06/Investiq--retail_investor_intelligence" },
  },
  {
    name: "Employee Management System",
    tagline: "Full-stack HR & Payroll System",
    desc: "Complete employee management with payroll processing, attendance tracking, role-based access control, and an admin dashboard.",
    stack: ["React", "Node.js", "MySQL", "Express"],
    color: "#9b7ee8",
    emoji: "👥",
    status: "wip",
    links: { github: "https://github.com/pratyushjha06/employee-management-system" },
  },
  {
    name: "DockFleet",
    tagline: "Docker Orchestration & Monitoring Tool",
    desc: "A developer tool for managing, monitoring, and orchestrating Docker containers with real-time logs and fleet-level control.",
    stack: ["Python", "FastAPI", "React", "Docker", "SQLite"],
    color: "#e08a5c",
    emoji: "🐳",
    status: "wip",
    links: { github: "https://github.com/pratyushjha06/Dockfleet" },
  },
];

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section__header">
        <span className="section__tag">What I've built</span>
        <h2 className="section__title">Projects</h2>
      </div>
      <div className="projects-grid">
        {projects.map((p) => (
          <TiltCard key={p.name} className="project-card glass-card">
            <div className="project-card__top" style={{ "--accent": p.color }}>
              <span className="project-emoji">{p.emoji}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  className={`proj-badge ${
                    p.status === "wip"
                      ? "badge--wip"
                      : p.status === "live"
                      ? "badge--live"
                      : "badge--done"
                  }`}
                >
                  {p.status === "wip" ? "◐ WIP" : p.status === "live" ? "● Live" : "✓ Done"}
                </span>
                <div className="project-card__dot" style={{ background: p.color }} />
              </div>
            </div>
            <h3 className="project-card__name">{p.name}</h3>
            <p className="project-card__tagline">{p.tagline}</p>
            <p className="project-card__desc">{p.desc}</p>
            <div className="project-stack">
              {p.stack.map((s) => <span key={s} className="stack-tag">{s}</span>)}
            </div>
            <div className="project-links">
              <a
                href={p.links.github}
                target="_blank"
                rel="noreferrer"
                className="project-link"
              >
                GitHub →
              </a>
            </div>
          </TiltCard>
        ))}
      </div>
      <div className="projects-cta">
        <Link to="/projects" className="btn btn--ghost">
          View All Projects →
        </Link>
        <span className="projects-cta-note">13 projects total</span>
      </div>
    </section>
  );
}

// ─── EXPERIENCE DATA ──────────────────────────────────────────────────────────
const experiences = [
  {
    role: "Founder (Early Stage)",
    company: "CRYPTIVOXE",
    type: "Self-employed",
    period: "Jul 2025 – Present",
    duration: "10 mos",
    location: "Delhi",
    color: "#63cab7",
    emoji: "🚀",
    tag: "Entrepreneurship",
    points: [
      "Web & Design Innovation Hub empowering startups with bold, conversion-driven digital experiences",
      "Delivered stunning websites (Static, WordPress & Full-stack) for growing brands",
      "Built UI/UX designs for engagement, branded social media creatives & SEO-optimised web experiences",
      "Working with early-stage clients to transform digital presence with strategy, creativity & precision",
    ],
  },
  {
    role: "AI Software Testing Intern (Cohort)",
    company: "Futred Innovation Studios",
    type: "Internship · Remote",
    period: "Apr 2026",
    duration: "1 mo",
    location: "Remote",
    color: "#e08a5c",
    emoji: "🤖",
    tag: "Software Testing",
    paid: true,
    points: [
      "Tested Learning Management System (LMS) as an end-user across multiple workflows",
      "Identified UI/UX issues, bugs, and navigation challenges in pre-launch product",
      "Documented findings in structured feedback reports using Excel & Google Forms",
      "Contributed to improving product usability before public rollout",
    ],
  },
  {
    role: "Contributor",
    company: "Social Winter of Code (SWOC)",
    type: "Open Source · Remote",
    period: "Jan 2026 – Feb 2026",
    duration: "2 mos",
    location: "Remote",
    color: "#9b7ee8",
    emoji: "❄️",
    tag: "Open Source",
    points: [
      "Contributed to open-source projects during Social Winter of Code cohort",
      "Collaborated with maintainers and contributors across distributed remote teams",
    ],
  },
  {
    role: "Official Member",
    company: "The FOSS Club",
    type: "Community",
    period: "Jan 2025 – Sep 2025",
    duration: "9 mos",
    location: "Delhi",
    color: "#63cab7",
    emoji: "🌐",
    tag: "Open Source",
    points: [
      "Active member of the Free & Open Source Software community club",
      "Engaged in open-source advocacy, events, and collaborative development",
    ],
  },
  {
    role: "Technical Associate",
    company: "CESTA",
    type: "Computer Engineering Students' Technical Association",
    period: "Jan 2025 – Aug 2025",
    duration: "8 mos",
    location: "Delhi",
    color: "#e06c9b",
    emoji: "⚙️",
    tag: "Teamwork",
    points: [
      "Contributed to technical execution of 2+ college events including website setup",
      "Conducted a web development session covering HTML, CSS & JavaScript fundamentals",
      "Collaborated with team members to improve technical workflows",
    ],
  },
  {
    role: "Contributor",
    company: "Hacktoberfest",
    type: "Open Source",
    period: "Oct 2021",
    duration: "1 mo",
    location: "Remote",
    color: "#e08a5c",
    emoji: "🎃",
    tag: "Open Source",
    points: [
      "Participated in Hacktoberfest — the global open-source contribution event",
      "Submitted pull requests to open-source repositories on GitHub",
    ],
  },
];

function Experience() {
  const [active, setActive] = useState(null);

  return (
    <section id="experience" className="section">
      <div className="section__header">
        <span className="section__tag">Where I've worked</span>
        <h2 className="section__title">Experience</h2>
      </div>

      <div className="timeline">
        {experiences.map((e, i) => (
          <div
            key={i}
            className={`timeline-item ${active === i ? "timeline-item--open" : ""}`}
            onClick={() => setActive(active === i ? null : i)}
          >
            <div className="timeline-dot" style={{ background: e.color }} />
            <div className="timeline-content glass-card">
              <div className="timeline-header">
                <div className="timeline-left">
                  <span className="timeline-emoji">{e.emoji}</span>
                  <div>
                    <h3 className="timeline-role">{e.role}</h3>
                    <p className="timeline-company" style={{ color: e.color }}>
                      {e.company}
                      <span className="timeline-type"> · {e.type}</span>
                    </p>
                  </div>
                </div>
                <div className="timeline-right">
                  <span className="timeline-period">{e.period}</span>
                  <span className="timeline-duration">{e.duration}</span>
                  <span className="timeline-tag" style={{ "--tag-color": e.color }}>{e.tag}</span>
                  {e.paid && <span className="timeline-paid">💰 Paid</span>}
                  <span className="timeline-chevron">{active === i ? "▲" : "▼"}</span>
                </div>
              </div>
              <div className={`timeline-body ${active === i ? "timeline-body--open" : ""}`}>
                <ul className="timeline-points">
                  {e.points.map((pt, j) => (
                    <li key={j} style={{ animationDelay: `${j * 60}ms` }}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS DATA ────────────────────────────────────────────────────────
const achievements = [
  {
    icon: "🥈",
    type: "award",
    title: "2nd Place — Code Tiranga & Web Styledown",
    org: "XIM University ACM",
    year: "2025",
    color: "#63cab7",
    cert: "/assets/Certificate/XIM har ghar tiranga.png",
    desc: "Competed against top coders nationally in a dual-track event covering competitive coding and web design.",
  },
  {
    icon: "🥉",
    type: "award",
    title: "3rd Place + Certificate of Coding Excellence",
    org: "CODEIGNITER-2025, Delhi Technical Campus",
    year: "2025",
    color: "#e08a5c",
    cert: null,
    desc: "Team achievement at a national-level coding competition with 200+ participants.",
  },
  {
    icon: "🏅",
    type: "award",
    title: "Finalist — InnoVortex 2.0 / Reimagathon",
    org: "IGDTUW",
    year: "2024",
    color: "#9b7ee8",
    cert: null,
    desc: "Selected as finalist among 100+ teams for a school website redesign challenge.",
  },
  {
    icon: "⭐",
    type: "badge",
    title: "5★ SQL",
    org: "HackerRank",
    year: "2025",
    color: "#63cab7",
    cert: null,
    desc: "Achieved the highest rating on HackerRank SQL track — top percentile globally.",
  },
  {
    icon: "📜",
    type: "cert",
    title: "Data Visualisation: Empowering Business with Effective Insights",
    org: "Tata via Forage",
    year: "2025",
    color: "#e08a5c",
    cert: null, // add "/assets/certs/tata-forage.jpg" when ready
    desc: "Completed a virtual job simulation analysing real business data and creating impactful dashboards.",
  },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
function Achievements() {
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const awards   = achievements.filter((a) => a.type === "award");
  const certs    = achievements.filter((a) => a.type === "cert");
  const badges   = achievements.filter((a) => a.type === "badge");

  const typeLabel = { award: "🏆 Award", cert: "📜 Certificate", badge: "⭐ Badge" };

  return (
    <section id="achievements" className="section">
      <div className="section__header">
        <span className="section__tag">Recognition</span>
        <h2 className="section__title">Achievements</h2>
      </div>

      {/* ── Big stat bar ── */}
      <div className="ach-stats">
        {[
          { num: awards.length,  label: "Awards",       color: "#63cab7"  },
          { num: certs.length,   label: "Certificates", color: "#e08a5c"  },
          { num: badges.length,  label: "Badges",       color: "#9b7ee8"  },
          { num: achievements.length, label: "Total",   color: "#e06c9b"  },
        ].map((s) => (
          <div key={s.label} className="ach-stat glass-card">
            <span className="ach-stat__num" style={{ color: s.color }}>{s.num}</span>
            <span className="ach-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="ach-grid">
        {achievements.map((a, i) => (
          <div
            key={i}
            className={`ach-card glass-card ${selected === i ? "ach-card--open" : ""}`}
            style={{ "--ach-color": a.color }}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            {/* Top stripe */}
            <div className="ach-card__stripe" />

            <div className="ach-card__top">
              <span className="ach-card__icon">{a.icon}</span>
              <span className="ach-card__type-badge">{typeLabel[a.type]}</span>
            </div>

            <h3 className="ach-card__title">{a.title}</h3>
            <p className="ach-card__org" style={{ color: a.color }}>{a.org}</p>

            {/* Expandable desc */}
            <div className={`ach-card__body ${selected === i ? "ach-card__body--open" : ""}`}>
              <p className="ach-card__desc">{a.desc}</p>
              {a.cert ? (
                <button
                  className="ach-cert-btn"
                  style={{ "--ach-color": a.color }}
                  onClick={(e) => { e.stopPropagation(); setLightbox(a.cert); }}
                >
                  View Certificate →
                </button>
              ) : (
                <span className="ach-cert-placeholder">📎 Certificate coming soon</span>
              )}
            </div>

            <div className="ach-card__footer">
              <span className="ach-card__year">{a.year}</span>
              <span className="ach-card__chevron">{selected === i ? "▲" : "▼"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="ach-lightbox" onClick={() => setLightbox(null)}>
          <div className="ach-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button className="ach-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox} alt="Certificate" className="ach-lightbox__img" />
          </div>
        </div>
      )}
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="section__header">
        <span className="section__tag">Get in touch</span>
        <h2 className="section__title">Let's build something</h2>
      </div>
      <p className="contact-sub">
        I'm actively looking for internship opportunities and interesting collaborations.
        Drop me a message — I reply fast.
      </p>
      <div className="contact-cards">
        {[
          { label: "Email",    value: "pratyushjha06@gmail.com", href: "mailto:pratyushjha06@gmail.com",          icon: "✉" },
          { label: "LinkedIn", value: "pratyushjha06",           href: "https://linkedin.com/in/pratyushjha06",   icon: "💼" },
          { label: "GitHub",   value: "pratyushjha06",           href: "https://github.com/pratyushjha06",        icon: "⌥" },
          { label: "Discord",  value: "pratyushjha1161",         href: "#",                                        icon: "🎮" },
        ].map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-card glass-card">
            <span className="contact-icon">{c.icon}</span>
            <div>
              <p className="contact-label">{c.label}</p>
              <p className="contact-value">{c.value}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p>Crafted with ♥ by <strong>Pratyush Jha</strong> · {new Date().getFullYear()}</p>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, toggleTheme] = useTheme();
  return (
    <>
      <ParticleCanvas />
      <Navbar dark={dark} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}