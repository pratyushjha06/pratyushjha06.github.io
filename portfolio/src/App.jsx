import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { allProjects } from "./data/projects";
import {
  FaSun,
  FaMoon,
  FaPython,
  FaDatabase,
  FaTools,
  FaReact,
  FaCode,
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaEnvelope,
  FaTrophy,
  FaCertificate,
  FaAward,
  FaChartBar,
  FaRocket,
  FaBug,
  FaSnowflake,
  FaGlobe,
  FaUsers,
  FaCodeBranch,
  FaCoffee,
} from "react-icons/fa";

import { FaIndianRupeeSign } from "react-icons/fa6";

const useTheme = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return [theme === "dark", toggleTheme];
};

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

    const colors = ["#63cab7", "#e08a5c", "#9b7ee8", "#e06c9b"];

    for (let i = 0; i < 70; i++) {
      particles.push({
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

      particles.forEach((p, idx) => {
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
            Math.PI * 2,
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

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            const edgeAlpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = isDark
              ? `rgba(99,202,183,${edgeAlpha})`
              : `rgba(10,90,110,${edgeAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            if (dist > 30 && (i + j) % 4 === 0) {
              const pulseTime = ((time * 0.04 + i * 37 + j * 19) % 1000) / 1000;
              const px = particles[i].x - dx * pulseTime;
              const py = particles[i].y - dy * pulseTime;

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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

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

function TypeWriter({ texts }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        60,
      );
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

function Navbar({ dark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    "About",
    "Skills",
    "Projects",
    "Experience",
    "Achievements",
    "Contact",
  ];
  const PROFILE_PIC = "/assets/logo.jpeg";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

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

        <span>
          Pratyush<span className="accent">.</span>
        </span>
      </div>

      <div className={`navbar__links ${open ? "open" : ""}`}>
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            onClick={() => setOpen(false)}
          >
            {l}
          </a>
        ))}
      </div>

      <div className="navbar__actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          type="button"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const PROFILE_PIC = "/assets/display-pic.png";

  return (
    <section id="about" className="hero">
      <div className="hero__content">
        <p className="hero__greeting">Hello, I&apos;m</p>
        <h1 className="hero__name">Pratyush Jha</h1>

        <div className="hero__terminal">
          <div className="terminal-header">
            <span className="terminal-btn terminal-btn--close" />
            <span className="terminal-btn terminal-btn--minimize" />
            <span className="terminal-btn terminal-btn--maximize" />
          </div>

          <div className="terminal-body">
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
          </div>
        </div>

        <p className="hero__bio">
          B.Tech CSE student at IP University · Building digital products,
          solving real problems, and obsessing over clean interfaces &amp;
          meaningful data.
        </p>

        <div className="hero__cta">
          <a href="#projects" className="btn btn--primary">
            View Projects
          </a>

          <a
            href="/public/assets/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn btn--secondary"
          >
            View Resume
          </a>

          <a
            href="https://linkedin.com/in/pratyushjha06"
            target="_blank"
            rel="noreferrer"
            className="btn btn--ghost"
          >
            Let&apos;s Connect
          </a>
        </div>

        <div className="hero__socials">
          <a
            href="https://github.com/pratyushjha06"
            target="_blank"
            rel="noreferrer"
            className="social-pill"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/pratyushjha06"
            target="_blank"
            rel="noreferrer"
            className="social-pill"
          >
            LinkedIn
          </a>
          <a href="mailto:pratyushjha06@gmail.com" className="social-pill">
            pratyushjha06@gmail.com
          </a>
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

const skillGroups = [
  {
    label: "Languages",
    icon: <FaCode />,
    color: "#63cab7",
    items: [
      { name: "Python", level: "Advanced" },
      { name: "SQL", level: "Advanced" },
      { name: "JavaScript", level: "Beginner" },
      { name: "C", level: "Beginner" },
      { name: "C++", level: "Intermediate" },
    ],
  },
  {
    label: "Data & Analytics",
    icon: <FaChartBar />,
    color: "#e08a5c",
    items: [
      { name: "Power BI", level: "Advanced" },
      { name: "Tableau", level: "Intermediate" },
      { name: "Excel Advanced", level: "Advanced" },
      { name: "EDA", level: "Intermediate" },
      { name: "Statistics", level: "Intermediate" },
    ],
  },
  {
    label: "Libraries",
    icon: <FaPython />,
    color: "#9b7ee8",
    items: [
      { name: "Pandas", level: "Advanced" },
      { name: "NumPy", level: "Advanced" },
      { name: "Matplotlib", level: "Intermediate" },
      { name: "Seaborn", level: "Beginner" },
    ],
  },
  {
    label: "Frontend",
    icon: <FaReact />,
    color: "#e06c9b",
    items: [
      { name: "React.js", level: "Beginner" },
      { name: "HTML5", level: "Advanced" },
      { name: "CSS3", level: "Advanced" },
      { name: "Tailwind", level: "Intermediate" },
    ],
  },
  {
    label: "Database",
    icon: <FaDatabase />,
    color: "#63cab7",
    items: [
      { name: "MySQL", level: "Advanced" },
      { name: "Data Querying", level: "Advanced" },
      { name: "Data Cleaning", level: "Intermediate" },
    ],
  },
  {
    label: "Tools",
    icon: <FaTools />,
    color: "#e08a5c",
    items: [
      { name: "Git", level: "Intermediate" },
      { name: "GitHub", level: "Advanced" },
      { name: "VS Code", level: "Advanced" },
    ],
  },
];

const LEVEL_CONFIG = {
  Beginner: { width: "25%", dotCount: 1, score: 1 },
  Intermediate: { width: "60%", dotCount: 2, score: 2 },
  Advanced: { width: "88%", dotCount: 3, score: 3 },
  Expert: { width: "100%", dotCount: 4, score: 4 },
};

function SkillBar({ name, level, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  const config = LEVEL_CONFIG[level];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 },
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
                  boxShadow:
                    n <= config.dotCount ? `0 0 6px ${color}88` : "none",
                }}
              />
            ))}
          </span>

          <span className="skill-level-text" style={{ color }}>
            {level}
          </span>
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

function buildRadarPoints(
  values,
  centerX = 120,
  centerY = 120,
  maxRadius = 78,
) {
  const total = values.length;

  return values
    .map((value, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / total;
      const radius = maxRadius * value;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    })
    .join(" ");
}

function SkillsProfile({ activeGroup }) {
  const domainMetrics = useMemo(() => {
    const toAvg = (items) =>
      items.reduce((sum, item) => sum + LEVEL_CONFIG[item.level].score, 0) /
      items.length;

    return [
      {
        label: "Frontend",
        short: "FE",
        color: "#e06c9b",
        value:
          (LEVEL_CONFIG["Intermediate"].score +
            LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Intermediate"].score) /
          4 /
          4,
      },
      {
        label: "Backend",
        short: "BE",
        color: "#63cab7",
        value:
          (LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Intermediate"].score) /
          3 /
          4,
      },
      {
        label: "AI/ML",
        short: "ML",
        color: "#9b7ee8",
        value:
          (LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Advanced"].score +
            LEVEL_CONFIG["Intermediate"].score +
            LEVEL_CONFIG["Intermediate"].score) /
          4 /
          4,
      },
      {
        label: "Data",
        short: "DA",
        color: "#e08a5c",
        value: toAvg(skillGroups[1].items) / 4,
      },
      {
        label: "Tools",
        short: "TS",
        color: "#63cab7",
        value: toAvg(skillGroups[5].items) / 4,
      },
    ];
  }, []);

  const polygonPoints = buildRadarPoints(domainMetrics.map((m) => m.value));
  const totalSkills = skillGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );
  const advancedCount = skillGroups.reduce(
    (sum, group) =>
      sum + group.items.filter((item) => item.level === "Advanced").length,
    0,
  );

  return (
    <div className="skills-profile-card glass-card">
      <div className="skills-profile-card__header">
        <div>
          <div className="skills-profile-card__eyebrow">Profile Snapshot</div>
          <h3 className="skills-profile-card__title">Engineering Profile</h3>
        </div>
        <div className="skills-profile-card__status">LIVE</div>
      </div>

      <div className="skills-radar">
        <svg
          viewBox="0 0 240 240"
          className="skills-radar__svg"
          aria-label="Engineering Profile chart"
        >
          {[20, 38, 56, 78].map((r) => (
            <circle
              key={r}
              cx="120"
              cy="120"
              r={r}
              className="skills-radar__grid"
            />
          ))}

          {domainMetrics.map((metric, i) => {
            const angle =
              -Math.PI / 2 + (i * Math.PI * 2) / domainMetrics.length;
            const x = 120 + Math.cos(angle) * 92;
            const y = 120 + Math.sin(angle) * 92;

            return (
              <line
                key={metric.label}
                x1="120"
                y1="120"
                x2={x}
                y2={y}
                className="skills-radar__axis"
              />
            );
          })}

          <polygon points={polygonPoints} className="skills-radar__shape" />

          {domainMetrics.map((metric, i) => {
            const angle =
              -Math.PI / 2 + (i * Math.PI * 2) / domainMetrics.length;
            const pointX = 120 + Math.cos(angle) * 78 * metric.value;
            const pointY = 120 + Math.sin(angle) * 78 * metric.value;
            const labelX = 120 + Math.cos(angle) * 108;
            const labelY = 120 + Math.sin(angle) * 108;

            return (
              <g key={metric.label}>
                <circle
                  cx={pointX}
                  cy={pointY}
                  r="4"
                  fill={metric.color}
                  style={{ filter: `drop-shadow(0 0 8px ${metric.color})` }}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="skills-radar__label"
                >
                  {metric.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="skills-profile-stats">
        <div className="skills-profile-stat">
          <span className="skills-profile-stat__value">
            {skillGroups.length}
          </span>
          <span className="skills-profile-stat__label">Domains</span>
        </div>
        <div className="skills-profile-stat">
          <span className="skills-profile-stat__value">{totalSkills}</span>
          <span className="skills-profile-stat__label">Skills</span>
        </div>
        <div className="skills-profile-stat">
          <span className="skills-profile-stat__value">{advancedCount}</span>
          <span className="skills-profile-stat__label">Advanced</span>
        </div>
      </div>

      <div className="skills-profile-focus">
        <div className="skills-profile-focus__label">Active Domain</div>
        <div
          className="skills-profile-focus__card"
          style={{ "--focus-color": activeGroup.color }}
        >
          <span className="skills-profile-focus__icon">{activeGroup.icon}</span>
          <div>
            <h4>{activeGroup.label}</h4>
            <p>{activeGroup.items.length} tracked skills in current view</p>
          </div>
        </div>
      </div>

      <div className="skills-profile-tags">
        {domainMetrics.map((metric) => (
          <span
            key={metric.label}
            className="skills-pill"
            style={{ "--pill-color": metric.color }}
          >
            {metric.short} · {Math.round(metric.value * 100)}%
          </span>
        ))}
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

      <div className="skills-layout">
        <div className="skills-layout__main">
          <div className="skills-tabs">
            {skillGroups.map((g, i) => (
              <button
                key={g.label}
                className={`skills-tab ${active === i ? "skills-tab--active" : ""}`}
                style={active === i ? { "--tab-color": g.color } : {}}
                onClick={() => setActive(i)}
                type="button"
              >
                <span className="skills-tab-icon">{g.icon}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>

          <div className="skills-panel glass-card" key={active}>
            <div className="skills-panel__header">
              <div className="skills-panel__header-left">
                <span className="skills-panel__icon">{group.icon}</span>
                <div>
                  <h3 className="skills-panel__title">{group.label}</h3>
                  <p className="skills-panel__count">
                    {group.items.length} skills tracked
                  </p>
                </div>
              </div>

              <span
                className="skills-panel__badge"
                style={{ "--badge-color": group.color }}
              >
                Active
              </span>
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
          </div>

          <div className="skills-pill-group glass-card">
            <div className="skills-pill-group__header">
              <span className="skills-pill-group__label">All Technologies</span>
              <span className="skills-pill-group__count">
                {skillGroups.flatMap((g) => g.items).length} items
              </span>
            </div>

            <div className="skills-all-pills">
              {skillGroups.flatMap((g) =>
                g.items.map((item) => (
                  <span
                    key={`${g.label}-${item.name}`}
                    className="skills-pill"
                    style={{ "--pill-color": g.color }}
                  >
                    {item.name}
                  </span>
                )),
              )}
            </div>
          </div>
        </div>

        <div className="skills-layout__side">
          <SkillsProfile activeGroup={group} />
        </div>
      </div>
    </section>
  );
}

function normalizeProject(project) {
  return {
    ...project,
    stack: project.stack || [],
    tags: project.tags || [],
    color: project.accent || project.color || "#63cab7",
    links: {
      github: project.github || project.links?.github || null,
      live: project.live || project.links?.live || null,
    },
  };
}

function getProjectStatus(project) {
  if (project.status === "live" || project.links?.live) {
    return { className: "badge--live", label: "● Live" };
  }
  if (project.status === "wip") {
    return { className: "badge--wip", label: "◐ WIP" };
  }
  return { className: "badge--done", label: "✓ Done" };
}

function Projects() {
  const featuredProjects = useMemo(() => {
    return allProjects
      .map(normalizeProject)
      .filter((p) => p.featured)
      .slice(0, 3);
  }, []);

  return (
    <section id="projects" className="section">
      <div className="section__header">
        <span className="section__tag">What I&apos;ve built</span>
        <h2 className="section__title">Projects</h2>
      </div>

      <div className="projects-grid">
        {featuredProjects.map((p) => {
          const status = getProjectStatus(p);

          return (
            <TiltCard key={p.name} className="project-card glass-card">
              <div
                className="project-card__top"
                style={{ "--accent": p.color }}
              >
                <span className="project-emoji">{p.emoji || "🚀"}</span>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className={`proj-badge ${status.className}`}>
                    {status.label}
                  </span>

                  <div
                    className="project-card__dot"
                    style={{ background: p.color }}
                  />
                </div>
              </div>

              <h3 className="project-card__name">{p.name}</h3>
              <p className="project-card__tagline">{p.tagline}</p>
              <p className="project-card__desc">{p.desc}</p>

              <div className="project-stack">
                {p.stack.map((s) => (
                  <span key={s} className="stack-tag">
                    {s}
                  </span>
                ))}
              </div>

              <div className="project-links">
                {p.links.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    GitHub →
                  </a>
                )}

                {p.links.live && (
                  <a
                    href={
                      p.links.live.startsWith("http://") ||
                      p.links.live.startsWith("https://")
                        ? p.links.live
                        : `https://${p.links.live}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                    style={{ marginLeft: "14px" }}
                  >
                    Live →
                  </a>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>

      <div className="projects-cta">
        <Link to="/projects" className="btn btn--ghost">
          View All Projects →
        </Link>
        <span className="projects-cta-note">
          {allProjects.length} projects total
        </span>
      </div>
    </section>
  );
}

const experiences = [
  {
    role: "Founder (Early Stage)",
    company: "CRYPTIVOXE",
    type: "Self-employed",
    period: "Jul 2025 - Present",
    duration: "10 mos",
    location: "Delhi",
    color: "#63cab7",
    emoji: <FaRocket />,
    tag: "Entrepreneurship",
    points: [
      "Web Design Innovation Hub empowering startups with bold, conversion-driven digital experiences.",
      "Delivered stunning websites (Static, WordPress, Full-stack) for growing brands.",
      "Built UI/UX designs for engagement, branded social media creatives, and SEO-optimised web experiences.",
      "Working with early-stage clients to transform digital presence with strategy, creativity, and precision.",
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
    emoji: <FaBug />,
    tag: "Software Testing",
    paid: true,
    points: [
      "Tested Learning Management System (LMS) as an end-user across multiple workflows.",
      "Identified UI/UX issues, bugs, and navigation challenges in pre-launch product.",
      "Documented findings in structured feedback reports using Excel and Google Forms.",
      "Contributed to improving product usability before public rollout.",
    ],
  },
  {
    role: "Contributor",
    company: "Social Winter of Code (SWOC)",
    type: "Open Source · Remote",
    period: "Jan 2026 - Feb 2026",
    duration: "2 mos",
    location: "Remote",
    color: "#9b7ee8",
    emoji: <FaSnowflake />,
    tag: "Open Source",
    points: [
      "Contributed to open-source projects during Social Winter of Code cohort.",
      "Collaborated with maintainers and contributors across distributed remote teams.",
    ],
  },
  {
    role: "Official Member",
    company: "The FOSS Club",
    type: "Community",
    period: "Jan 2025 - Sep 2025",
    duration: "9 mos",
    location: "Delhi",
    color: "#63cab7",
    emoji: <FaGlobe />,
    tag: "Open Source",
    points: [
      "Active member of the Free and Open Source Software community club.",
      "Engaged in open-source advocacy, events, and collaborative development.",
    ],
  },
  {
    role: "Technical Associate",
    company: "CESTA",
    type: "Computer Engineering Students' Technical Association",
    period: "Jan 2025 - Aug 2025",
    duration: "8 mos",
    location: "Delhi",
    color: "#e06c9b",
    emoji: <FaUsers />,
    tag: "Teamwork",
    points: [
      "Contributed to technical execution of 2 college events including website setup.",
      "Conducted a web development session covering HTML, CSS, and JavaScript fundamentals.",
      "Collaborated with team members to improve technical workflows.",
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
    emoji: <FaCodeBranch />,
    tag: "Open Source",
    points: [
      "Participated in Hacktoberfest, the global open-source contribution event.",
      "Submitted pull requests to open-source repositories on GitHub.",
    ],
  },
];

function Experience() {
  const [active, setActive] = useState(null);

  return (
    <section id="experience" className="section">
      <div className="section__header">
        <span className="section__tag">Where I&apos;ve worked</span>
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
                  <span
                    className="timeline-tag"
                    style={{ "--tag-color": e.color }}
                  >
                    {e.tag}
                  </span>
                  {e.paid && (
                    <span className="timeline-paid">
                      <FaIndianRupeeSign style={{ marginRight: "6px" }} />
                      Paid
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`timeline-body ${active === i ? "timeline-body--open" : ""}`}
              >
                <ul className="timeline-points">
                  {e.points.map((pt, j) => (
                    <li key={j} style={{ animationDelay: `${j * 60}ms` }}>
                      {pt}
                    </li>
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

const achievements = [
  {
    icon: <FaTrophy />,
    type: "award",
    title: "Winner - FOSS Hack 2026",
    org: "FOSS Hack",
    year: 2026,
    color: "#63cab7",
    cert: null,
    desc: "Won FOSS Hack 2026 for building and presenting DOCKFLEET.",
  },
  {
    icon: <FaTrophy />,
    type: "award",
    title: "2nd Place - Code Tiranga",
    org: "XIM University ACM",
    year: 2025,
    color: "#63cab7",
    cert: "assets/Certificate_XIM_har_ghar_tiranga.png",
    desc: "Won 2nd place in Code Tiranga at XIM University ACM.",
  },
  {
    icon: <FaTrophy />,
    type: "award",
    title: "2nd Place - Web Styledown",
    org: "XIM University ACM",
    year: 2024,
    color: "#e08a5c",
    cert: null,
    desc: "Participated in Web Styledown focused on web design and styling.",
  },
  {
    icon: <FaTrophy />,
    type: "award",
    title: "3rd Place Certificate of Coding Excellence",
    org: "CODEIGNITER-2025, Delhi Technical Campus",
    year: 2025,
    color: "#e08a5c",
    cert: null,
    desc: "Team achievement at a national-level coding competition with 200+ participants.",
  },
  {
    icon: <FaTrophy />,
    type: "award",
    title: "Finalist InnoVortex 2.0 Reimagathon",
    org: "IGDTUW",
    year: 2024,
    color: "#9b7ee8",
    cert: null,
    desc: "Selected as finalist among 100+ teams for a school website redesign challenge.",
  },
  {
    icon: <FaCode />,
    type: "badge",
    title: "5★ SQL",
    org: "HackerRank",
    year: 2026,
    color: "#63cab7",
    cert: null,
    desc: "Achieved the highest rating on HackerRank SQL track.",
  },
  {
    icon: <FaCertificate />,
    type: "cert",
    title: "BCG - Introduction to Data for Decision Makers Job Simulation",
    org: "Forage",
    year: 2026,
    color: "#63cab7",
    cert: null,
    desc: "Completed BCG's Introduction to Data for Decision Makers job simulation on Forage, focused on data analysis and Microsoft Excel.",
  },
  {
    icon: <FaCertificate />,
    type: "cert",
    title: "Deloitte Australia - Data Analytics Job Simulation",
    org: "Forage",
    year: 2026,
    color: "#e08a5c",
    cert: null,
    desc: "Completed Deloitte Australia's Data Analytics job simulation on Forage, focused on data analysis and Tableau.",
  },
  {
    icon: <FaCertificate />,
    type: "cert",
    title: "Data Visualisation: Empowering Business with Effective Insights",
    org: "Tata via Forage",
    year: 2025,
    color: "#e08a5c",
    cert: null,
    desc: "Completed a virtual job simulation analysing real business data and creating impactful dashboards.",
  },
];

function Achievements() {
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const awards = achievements.filter((a) => a.type === "award");
  const certs = achievements.filter((a) => a.type === "cert");
  const badges = achievements.filter((a) => a.type === "badge");

  const typeLabel = {
    award: "Award",
    cert: "Certificate",
    badge: "Badge",
  };

  return (
    <section id="achievements" className="section">
      <div className="section__header">
        <span className="section__tag">Recognition</span>
        <h2 className="section__title">Achievements</h2>
      </div>

      <div className="ach-stats">
        {[
          { num: awards.length, label: "Awards", color: "#63cab7" },
          { num: certs.length, label: "Certificates", color: "#e08a5c" },
          { num: badges.length, label: "Badges", color: "#9b7ee8" },
          { num: achievements.length, label: "Total", color: "#e06c9b" },
        ].map((s) => (
          <div key={s.label} className="ach-stat glass-card">
            <span className="ach-stat__num" style={{ color: s.color }}>
              {s.num}
            </span>
            <span className="ach-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ach-grid">
        {achievements.map((a, i) => (
          <div
            key={i}
            className={`ach-card glass-card ${selected === i ? "ach-card--open" : ""}`}
            style={{ "--ach-color": a.color }}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <div className="ach-card__stripe" />

            <div className="ach-card__top">
              <span className="ach-card__icon">{a.icon}</span>
              <span className="ach-card__type-badge">{typeLabel[a.type]}</span>
            </div>

            <h3 className="ach-card__title">{a.title}</h3>
            <p className="ach-card__org" style={{ color: a.color }}>
              {a.org}
            </p>

            <div
              className={`ach-card__body ${selected === i ? "ach-card__body--open" : ""}`}
            >
              <p className="ach-card__desc">{a.desc}</p>

              {a.cert ? (
                <button
                  className="ach-cert-btn"
                  style={{ "--ach-color": a.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(a.cert);
                  }}
                  type="button"
                >
                  View Certificate →
                </button>
              ) : (
                <span className="ach-cert-placeholder">
                  📎 Certificate coming soon
                </span>
              )}
            </div>

            <div className="ach-card__footer">
              <span className="ach-card__year">{a.year}</span>
              <span className="ach-card__chevron">
                {selected === i ? "▲" : "▼"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="ach-lightbox" onClick={() => setLightbox(null)}>
          <div
            className="ach-lightbox__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ach-lightbox__close"
              onClick={() => setLightbox(null)}
              type="button"
            >
              ✕
            </button>
            <img
              src={lightbox}
              alt="Certificate"
              className="ach-lightbox__img"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Contact() {
  const contacts = [
    {
      label: "Email",
      value: "pratyushjha06@gmail.com",
      href: "mailto:pratyushjha06@gmail.com",
      icon: <FaEnvelope />,
      external: false,
    },
    {
      label: "LinkedIn",
      value: "pratyushjha06",
      href: "https://linkedin.com/in/pratyushjha06",
      icon: <FaLinkedin />,
      external: true,
    },
    {
      label: "GitHub",
      value: "pratyushjha06",
      href: "https://github.com/pratyushjha06",
      icon: <FaGithub />,
      external: true,
    },
    {
      label: "Discord",
      value: "pratyushjha1161",
      href: "#",
      icon: <FaDiscord />,
      external: false,
    },
  ];

  return (
    <section id="contact" className="section contact-section">
      <div className="section__header">
        <span className="section__tag">Get in touch</span>
        <h2 className="section__title">Let&apos;s build something</h2>
      </div>

      <p className="contact-sub">
        I&apos;m actively looking for internship opportunities and interesting
        collaborations. Drop me a message — I reply fast.
      </p>

      <div className="contact-cards">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noreferrer" : undefined}
            className="contact-card glass-card"
          >
            <span className="contact-icon">{c.icon}</span>
            <div className="contact-card__content">
              <p className="contact-label">{c.label}</p>
              <p className="contact-value">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="support-card glass-card">
        <div className="support-card__header">
          <div className="support-card__title-wrap">
            <span className="support-card__icon">
              <FaCoffee />
            </span>
            <div>
              <p className="support-card__eyebrow">Support</p>
              <h3 className="support-card__title">Buy Me a Coffee</h3>
            </div>
          </div>

          <span className="support-card__tag">Optional</span>
        </div>

        <p className="support-card__desc">
          If you like my projects, open-source work, or content, you can support
          me with a small contribution.
        </p>

        <div className="support-card__body">
          <div className="support-qr">
            <img
              src="/assets/payment-qr.jpeg"
              alt="QR code for support payment"
            />
            <span className="support-qr__label">Scan QR to pay</span>
          </div>

          <div className="support-actions">
            <a
              href="https://razorpay.me/@pratyushjha06"
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary support-btn"
            >
              Buy Me a Coffee
            </a>

            <p className="support-note">
              You can also scan the QR code using any UPI app.
            </p>

            <p className="support-upi">
              UPI ID: <span>pratyushjha06@okhdfcbank</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Crafted with ♥ by <strong>Pratyush Jha</strong> ·{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}

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
