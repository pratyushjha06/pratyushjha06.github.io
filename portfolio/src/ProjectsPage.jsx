import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { allProjects } from "./data/projects"; // change path if needed

const FILTERS = [
  "all",
  "featured",
  "web",
  "data",
  "python",
  "open-source",
  "hackathon",
];

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

    const colors = ["#63cab7", "#e08a5c", "#9b7ee8", "#e06c9b"];

    for (let i = 0; i < 70; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 1,
        color: colors[i % colors.length],
        type: i % 6 === 0 ? "server" : "dot",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const time = Date.now();

      pts.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = isDark ? p.color : "rgba(10,90,110,0.8)";

        if (p.type === "server") {
          ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            p.r + 6 * (1 + Math.sin(time * 0.003 + idx) * 0.3),
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = isDark ? `${p.color}44` : "rgba(10,90,110,0.2)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);

            const edgeAlpha = (1 - d / 130) * 0.25;
            ctx.strokeStyle = isDark
              ? `rgba(99,202,183,${edgeAlpha})`
              : `rgba(10,90,110,${edgeAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            if (d > 30 && (i + j) % 4 === 0) {
              const pulseTime =
                ((time * 0.04 + i * 37 + j * 19) % 1000) / 1000;
              const px = pts[i].x - dx * pulseTime;
              const py = pts[i].y - dy * pulseTime;

              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? "#ffffff" : "rgba(10,90,110,0.9)";
              ctx.fill();
            }
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
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getStatusMeta(project) {
  if (project.status === "live" || project.live) {
    return {
      className: "badge--live",
      label: "● Live",
    };
  }

  if (project.status === "wip") {
    return {
      className: "badge--wip",
      label: "◐ WIP",
    };
  }

  return {
    className: "badge--done",
    label: "✓ Done",
  };
}

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
  const status = getStatusMeta(p);

  return (
    <TiltCard
      className={`proj-card${p.featured ? " proj-card--featured" : ""}`}
      style={{ "--card-accent": p.accent || "var(--accent)" }}
    >
      <div className="proj-card__top">
        <span className="proj-card__emoji">{p.emoji || "🚀"}</span>

        <div className="proj-card__badges">
          {p.featured && (
            <span className="proj-badge proj-badge--featured">⭐ Featured</span>
          )}
          <span className={`proj-badge ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      <h3 className="proj-card__name">{p.name}</h3>
      <p className="proj-card__tagline">{p.tagline}</p>
      <p className="proj-card__desc">{p.desc}</p>

      <div className="proj-card__stack">
        {p.stack?.map((s) => (
          <span key={s} className="stack-tag">
            {s}
          </span>
        ))}
      </div>

      <div className="proj-card__links">
        {p.github && (
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-link"
          >
            GitHub →
          </a>
        )}

        {p.live && (
          <a
            href={
              p.live.startsWith("http://") || p.live.startsWith("https://")
                ? p.live
                : `https://${p.live}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="proj-link"
            style={{ marginLeft: "14px" }}
          >
            Live →
          </a>
        )}
      </div>
    </TiltCard>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <Link to="/" className="navbar__brand">
        <span className="brand-dot" />
        <span>
          Pratyush<span className="accent">.</span>
        </span>
      </Link>

      <div className="navbar__actions">
        <Link
          to="/"
          className="btn btn--ghost"
          style={{ padding: "8px 18px", fontSize: "0.82rem" }}
        >
          ← Back to Portfolio
        </Link>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          type="button"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const normalizedProjects = allProjects.map((project) => ({
    ...project,
    tags: project.tags || [],
    stack: project.stack || [],
  }));

  const filtered =
    activeFilter === "all"
      ? normalizedProjects
      : normalizedProjects.filter((p) => p.tags.includes(activeFilter));

  const featured = filtered.filter((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);
  const totalTech = [
    ...new Set(normalizedProjects.flatMap((p) => p.stack)),
  ].length;

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
          A complete log of everything I&apos;ve built — from hackathon sprints
          and open-source contributions to personal tools and full-stack apps.
        </p>

        <div className="pg-hero__stats">
          <div className="pg-stat">
            <span className="pg-stat__num" style={{ color: "var(--accent)" }}>
              {normalizedProjects.length}
            </span>
            <span className="pg-stat__label">Total Projects</span>
          </div>

          <div className="pg-stat">
            <span className="pg-stat__num" style={{ color: "var(--accent2)" }}>
              {normalizedProjects.filter((p) => p.featured).length}
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

      <div className="pg-filters">
        <span className="pg-filter-label">Filter:</span>

        {FILTERS.map((f) => {
          const count =
            f === "all"
              ? normalizedProjects.length
              : normalizedProjects.filter((p) => p.tags.includes(f)).length;

          return (
            <button
              key={f}
              type="button"
              className={`filter-btn${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === "all"
                ? `All (${count})`
                : f === "featured"
                ? `⭐ Featured (${count})`
                : `${f.charAt(0).toUpperCase() + f.slice(1)} (${count})`}
            </button>
          );
        })}
      </div>

      <main className="pg-section" style={{ position: "relative", zIndex: 1 }}>
        {filtered.length === 0 ? (
          <div className="pg-empty">
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</p>
            <p>No projects found for this filter.</p>
          </div>
        ) : (
          <>
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

      <footer className="footer" style={{ position: "relative", zIndex: 1 }}>
        <p>
          Built with React · All projects by{" "}
          <span style={{ color: "var(--accent)" }}>Pratyush Jha</span>
        </p>
      </footer>
    </div>
  );
}