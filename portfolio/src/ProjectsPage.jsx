import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── PARTICLE CANVAS ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const pts = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 80; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.4,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const dot = isDark ? "rgba(99,202,183,0.65)" : "rgba(10,90,110,0.45)";
      const line = isDark ? "rgba(99,202,183," : "rgba(10,90,110,";
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = line + (1 - d / 110) * 0.35 + ")";
            ctx.lineWidth = 0.5;
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
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── PROJECTS DATA ────────────────────────────────────────────────────────────
const allProjects = [
  // ── FEATURED ──
  {
    name: "InvestIQ",
    tagline: "Retail Investor Intelligence Platform",
    desc: "An AI-powered platform built to give retail investors institutional-grade insights — market signals, portfolio analysis, and smart stock recommendations.",
    stack: ["Python", "FastAPI", "React", "ML", "Finance API"],
    emoji: "📈",
    accent: "#63cab7",
    tags: ["featured", "data", "python", "web"],
    status: "wip",
    featured: true,
    github: "https://github.com/pratyushjha06/Investiq--retail_investor_intelligence",
    live: null,
  },
  {
    name: "Employee Management System",
    tagline: "Full-stack HR & Payroll System",
    desc: "A complete employee management solution with payroll processing, attendance tracking, role-based access control, and a full admin dashboard.",
    stack: ["React", "Node.js", "MySQL", "Express"],
    emoji: "👥",
    accent: "#9b7ee8",
    tags: ["featured", "web", "data", "python"],
    status: "wip",
    featured: true,
    github: "https://github.com/pratyushjha06/employee-management-system",
    live: null,
  },
  {
    name: "DockFleet",
    tagline: "Docker Orchestration & Monitoring Tool",
    desc: "A developer tool for managing, monitoring, and orchestrating Docker containers with a clean UI, real-time logs, and fleet-level control.",
    stack: ["Python", "FastAPI", "React", "Docker", "SQLite"],
    emoji: "🐳",
    accent: "#e08a5c",
    tags: ["featured", "web", "python"],
    status: "wip",
    featured: true,
    github: "https://github.com/pratyushjha06/Dockfleet",
    live: null,
  },

  // ── OTHER ──
  {
    name: "MannMitra",
    tagline: "Mental Health Support App",
    desc: "A mental wellness companion app offering mood tracking, guided exercises, and AI-based emotional support. Built at a hackathon with a focus on accessibility.",
    stack: ["React", "Node.js", "MongoDB"],
    emoji: "🧠",
    accent: "#63cab7",
    tags: ["web", "hackathon"],
    status: "done",
    featured: false,
    github: null,
    live: null,
  },
  {
    name: "DUV International School",
    tagline: "Website Redesign — Innovortex 2.0",
    desc: "Full redesign of DUV International School's website as part of the Innovortex 2.0 hackathon. Finalist among 100+ teams at IGDTUW. Modern UI, responsive layout, improved UX.",
    stack: ["HTML", "CSS", "JavaScript"],
    emoji: "🏫",
    accent: "#e08a5c",
    tags: ["web", "hackathon"],
    status: "done",
    featured: false,
    github: null,
    live: null,
  },
  {
    name: "Har Ghar Tiranga",
    tagline: "Government Campaign Web Experience",
    desc: "A patriotic web experience built for the Har Ghar Tiranga initiative — featuring flag hoisting, citizen participation flow, and awareness content.",
    stack: ["HTML", "CSS", "JavaScript"],
    emoji: "🇮🇳",
    accent: "#9b7ee8",
    tags: ["web"],
    status: "done",
    featured: false,
    github: null,
    live: null,
  },
  {
    name: "Duality Project",
    tagline: "SWOC '26 Open Source Contribution",
    desc: "Contributed to the Duality open-source project during Social Winter of Code 2026 — bug fixes, feature additions, and documentation improvements.",
    stack: ["Open Source", "Git", "JavaScript"],
    emoji: "⚔️",
    accent: "#63cab7",
    tags: ["web", "open-source"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/SWOC26-Duality-Project",
    live: null,
  },
  {
    name: "Mini Search Engine",
    tagline: "Python-based Text Search Engine",
    desc: "A lightweight search engine built from scratch in Python using TF-IDF ranking, inverted indexing, and keyword tokenization.",
    stack: ["Python", "NLP", "TF-IDF"],
    emoji: "🔍",
    accent: "#e08a5c",
    tags: ["python", "data"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/MiniSearchEngine",
    live: null,
  },
  {
    name: "Library Management System",
    tagline: "CLI-based Book & Member Manager",
    desc: "A complete library management system with book issuing, return tracking, member records, and automated fine calculation.",
    stack: ["Python", "SQL", "CLI"],
    emoji: "📚",
    accent: "#9b7ee8",
    tags: ["python"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/Library-Management-System",
    live: null,
  },
  {
    name: "Password Generator",
    tagline: "Secure Password Generator Tool",
    desc: "A customizable password generator with strength indicators, copy-to-clipboard, and options for length, symbols, and character sets.",
    stack: ["Python", "Tkinter"],
    emoji: "🔐",
    accent: "#63cab7",
    tags: ["python"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/Password-Generator",
    live: null,
  },
  {
    name: "Crop Recommendation Model",
    tagline: "ML Model for Smart Agriculture",
    desc: "A machine learning model that recommends the best crop to grow based on soil nutrients, temperature, humidity, and rainfall data.",
    stack: ["Python", "Scikit-learn", "Pandas", "ML"],
    emoji: "🌾",
    accent: "#e08a5c",
    tags: ["python", "data"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/Crop-Recommendation-Model",
    live: null,
  },
  {
    name: "Amazon Clone",
    tagline: "Frontend UI Recreation",
    desc: "A pixel-perfect Amazon homepage clone built with pure HTML and CSS — responsive layout, navbar, product grid, and footer.",
    stack: ["HTML", "CSS"],
    emoji: "🛒",
    accent: "#9b7ee8",
    tags: ["web"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/Amazon-clone-HTML_CSS",
    live: null,
  },
  {
    name: "Fruit Prediction Model",
    tagline: "ML-based Fruit Classifier",
    desc: "A machine learning classifier that predicts fruit types from feature data using supervised learning algorithms and Scikit-learn.",
    stack: ["Python", "Scikit-learn", "Pandas", "ML"],
    emoji: "🍎",
    accent: "#63cab7",
    tags: ["python", "data"],
    status: "done",
    featured: false,
    github: "https://github.com/pratyushjha06/Fruit-Prediction-Model",
    live: null,
  },
];

const FILTERS = ["all", "featured", "web", "data", "python", "open-source", "hackathon"];

// ─── TILT CARD ────────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    ref.current.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };
  const handleLeave = () => {
    ref.current.style.transform =
      "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  };
  return (
    <div
      ref={ref}
      className={`glass-card tilt-card ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ p }) {
  const statusClass =
    p.status === "live" ? "badge--live"
    : p.status === "wip" ? "badge--wip"
    : "badge--done";
  const statusLabel =
    p.status === "live" ? "● Live"
    : p.status === "wip" ? "◐ WIP"
    : "✓ Done";

  return (
    <TiltCard
      className={`proj-card${p.featured ? " proj-card--featured" : ""}`}
      style={{ "--card-accent": p.accent }}
    >
      <div className="proj-card__top">
        <span className="proj-card__emoji">{p.emoji}</span>
        <div className="proj-card__badges">
          {p.featured && (
            <span className="proj-badge proj-badge--featured">⭐ Featured</span>
          )}
          <span className={`proj-badge ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>

      <h3 className="proj-card__name">{p.name}</h3>
      <p className="proj-card__tagline">{p.tagline}</p>
      <p className="proj-card__desc">{p.desc}</p>

      <div className="proj-card__stack">
        {p.stack.map((s) => (
          <span key={s} className="stack-tag">{s}</span>
        ))}
      </div>

      {p.github && (
        <div className="proj-card__links">
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-link"
          >
            GitHub →
          </a>
        </div>
      )}
    </TiltCard>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute("data-theme") || "dark";
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <Link to="/" className="navbar__brand">
        <span className="brand-dot" />
        <span>Pratyush<span className="accent">.</span></span>
      </Link>
      <div className="navbar__actions">
        <Link
          to="/"
          className="btn btn--ghost"
          style={{ padding: "8px 18px", fontSize: "0.82rem" }}
        >
          ← Back to Portfolio
        </Link>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.tags.includes(activeFilter));

  const featured = filtered.filter((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

  const totalTech = [...new Set(allProjects.flatMap((p) => p.stack))].length;

  // scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".proj-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform =
              "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeFilter]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ParticleCanvas />
      <Navbar />

      {/* ── Hero ── */}
      <header className="pg-hero" style={{ paddingTop: "100px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "var(--accent)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          // all work
        </span>
        <h1 className="pg-hero__title">All Projects</h1>
        <p className="pg-hero__sub">
          A complete log of everything I've built — from hackathon sprints and
          open-source contributions to personal tools and full-stack apps.
        </p>
        <div className="pg-hero__stats">
          <div className="pg-stat">
            <span className="pg-stat__num" style={{ color: "var(--accent)" }}>
              {allProjects.length}
            </span>
            <span className="pg-stat__label">Total Projects</span>
          </div>
          <div className="pg-stat">
            <span className="pg-stat__num" style={{ color: "var(--accent2)" }}>
              {allProjects.filter((p) => p.featured).length}
            </span>
            <span className="pg-stat__label">Featured</span>
          </div>
          <div className="pg-stat">
            <span className="pg-stat__num" style={{ color: "var(--accent3)" }}>
              {totalTech}
            </span>
            <span className="pg-stat__label">Tech Stacks</span>
          </div>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="pg-filters">
        <span className="pg-filter-label">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === "all"
              ? `All (${allProjects.length})`
              : f === "featured"
              ? `⭐ Featured`
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Projects Grid ── */}
      <main className="pg-section" style={{ position: "relative", zIndex: 1 }}>
        {filtered.length === 0 ? (
          <div className="pg-empty">
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</p>
            <p>No projects found for this filter.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <>
                <div className="pg-divider">
                  <span className="pg-divider__label">⭐ Featured</span>
                  <div className="pg-divider__line" />
                  <span className="pg-divider__label">{featured.length}</span>
                </div>
                <div className="pg-grid" style={{ marginBottom: "48px" }}>
                  {featured.map((p) => (
                    <ProjectCard key={p.name} p={p} />
                  ))}
                </div>
              </>
            )}

            {/* Other Projects */}
            {others.length > 0 && (
              <>
                <div className="pg-divider">
                  <span className="pg-divider__label">Other Projects</span>
                  <div className="pg-divider__line" />
                  <span className="pg-divider__label">{others.length}</span>
                </div>
                <div className="pg-grid">
                  {others.map((p) => (
                    <ProjectCard key={p.name} p={p} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer" style={{ position: "relative", zIndex: 1 }}>
        <p>
          Built with React · All projects by{" "}
          <span style={{ color: "var(--accent)" }}>Pratyush Jha</span>
        </p>
      </footer>
    </div>
  );
}