/* ═══════════════════════════════════════════════════════════════════
   TEAM-INTERACTIVE.JS  —  "THE EXPOSURE"
   MSC SRMAP · Editorial Archive System

   ──────────────────────────────────────────────────────────────────
   HOW TO ADD / REMOVE MEMBERS:

   Each object in the arrays below = one person.

   Fields:
     name      — Full name (required)
     role      — Role / designation (required)
     linkedin  — LinkedIn URL  (optional, "" to hide)
     github    — GitHub URL    (optional, "" to hide)
     twitter   — Twitter/X URL (optional, "" to hide)
     instagram — Instagram URL (optional, "" to hide)
     email     — Email address (optional, "" to hide)
     portfolio - Portfolio URL (optional, "" to hide)

   Add to the right array:
     CHIEF_BOARD   → Chief / President level
     BOARD_MEMBERS → Board / Lead level
     TEAM_MEMBERS  → General core team

   ═══════════════════════════════════════════════════════════════════ */

const CHIEF_BOARD = [
  // {
  //   name: "Jayanth Ramakrishnan",
  //   role: "President",
  //   linkedin: "https://linkedin.com/in/",
  //   github: "",
  //   email: ""
  //   portfolio: ""
  // },
];

const BOARD_MEMBERS = [
  // {
  //   name: "Your Name",
  //   role: "Technical Lead",
  //   linkedin: "https://linkedin.com/in/yourprofile",
  //   github: "https://github.com/yourprofile",
  //   email: ""
  //   portfolio: ""
  // },
];

const TEAM_MEMBERS = [
  // {
  //   name: "Your Name",
  //   role: "Developer",
  //   linkedin: "",
  //   github: "",
  //   email: ""
  //   portfolio: ""
  // },
];

/* ═══════════════════════════════════════════════════════════════════
   INTERNAL SYSTEMS — DO NOT EDIT BELOW THIS LINE
   ═══════════════════════════════════════════════════════════════════ */

/* ─── GHOST NAME ENGINE ──────────────────────────────────────────── */
const Ghost = (() => {
  const container = document.getElementById("ghostNameContainer");
  const stage = document.getElementById("ghostNameStage");
  const text = document.getElementById("ghostNameText");
  if (!container || !stage || !text)
    return { show: () => {}, hide: () => {}, isVisible: () => false };

  let hideTimer = null;
  let visible = false;

  function show(name) {
    clearTimeout(hideTimer);
    text.textContent = name;
    text.classList.add("ghost-active");
    stage.classList.add("ghost-visible");
    visible = true;
  }

  function hide() {
    text.classList.remove("ghost-active");
    stage.classList.remove("ghost-visible");
    visible = false;
  }

  function isVisible() {
    return visible;
  }

  return { show, hide, isVisible };
})();

/* ─── SOCIAL LINK BUILDER ────────────────────────────────────────── */
function buildSocialLinks(member, extraClass = "") {
  const defs = [
    { key: "linkedin", icon: "fab fa-linkedin-in", href: (m) => m.linkedin },
    { key: "github", icon: "fab fa-github", href: (m) => m.github },
    { key: "twitter", icon: "fab fa-x-twitter", href: (m) => m.twitter },
    { key: "instagram", icon: "fab fa-instagram", href: (m) => m.instagram },
    { key: "email", icon: "fa fa-envelope", href: (m) => `mailto:${m.email}` },
        //added to place the portifolio
    { key: "portfolio", icon: "fab fa-globe", href: (m) => m.portfolio },
  ];

  const links = defs
    .filter((d) => member[d.key])
    .map(
      (d) => `
      <a href="${d.href(member)}" target="_blank" rel="noopener"
         class="tm-social-link ${extraClass}" aria-label="${d.key}">
        <i class="${d.icon}"></i>
      </a>
    `,
    )
    .join("");

  return links;
}

/* ─── CORE TEAM RENDER (Exposed Spread) ────────────────────────── */
function renderChief(members, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!members.length) {
    container.innerHTML = `<div class="tm-empty-state">
      To be announced — check back soon.
    </div>`;
    return;
  }

  container.innerHTML = members
    .map(
      (m, i) => `
    <div class="tm-exposed-row" data-name="${m.name}" data-index="${i}">
      <span class="tm-exposed-index">${String(i + 1).padStart(2, "0")}</span>
      <div class="tm-exposed-body">
        <span class="tm-exposed-name">${m.name}</span>
        <span class="tm-exposed-role">${m.role}</span>
      </div>
      <div class="tm-exposed-social">
        ${buildSocialLinks(m)}
      </div>
    </div>
  `,
    )
    .join("");

  // Ghost + scroll reveals
  container.querySelectorAll(".tm-exposed-row").forEach((row) => {
    row.addEventListener("mouseenter", () => Ghost.show(row.dataset.name));
    row.addEventListener("mouseleave", () => Ghost.hide());
  });

  scheduleReveal(container.querySelectorAll(".tm-exposed-row"));
}

/* ─── CORE TEAM RENDER (Signal Ledger) ───────────────────────── */
function renderBoard(members, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!members.length) {
    container.innerHTML = `<div class="tm-empty-state">
      To be announced — check back soon.
    </div>`;
    return;
  }

  container.innerHTML = members
    .map(
      (m, i) => `
    <div class="tm-ledger-row" data-name="${m.name}" data-index="${i}">
      <span class="tm-ledger-index">${String(i + 1).padStart(2, "0")}</span>
      <span class="tm-ledger-name">${m.name}</span>
      <span class="tm-ledger-role">${m.role}</span>
      <div class="tm-ledger-social">
        ${buildSocialLinks(m)}
      </div>
    </div>
  `,
    )
    .join("");

  container.querySelectorAll(".tm-ledger-row").forEach((row) => {
    row.addEventListener("mouseenter", () => Ghost.show(row.dataset.name));
    row.addEventListener("mouseleave", () => Ghost.hide());
  });

  scheduleReveal(container.querySelectorAll(".tm-ledger-row"));
}

/* ─── CORE TEAM RENDER (Frequency Grid) ─────────────────────────── */
function renderTeam(members, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!members.length) {
    container.innerHTML = `<div class="tm-empty-state" style="border:none;">
      To be announced — check back soon.
    </div>`;
    return;
  }

  container.innerHTML = members
    .map(
      (m, i) => `
    <div class="tm-freq-cell" data-name="${m.name}" data-index="${i}">
      <span class="tm-freq-index">${String(i + 1).padStart(2, "0")}</span>
      <span class="tm-freq-name">${m.name}</span>
      <span class="tm-freq-role">${m.role}</span>
      <div class="tm-freq-social">
        ${buildSocialLinks(m)}
      </div>
    </div>
  `,
    )
    .join("");

  container.querySelectorAll(".tm-freq-cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => Ghost.show(cell.dataset.name));
    cell.addEventListener("mouseleave", () => Ghost.hide());
  });

  scheduleReveal(container.querySelectorAll(".tm-freq-cell"));
}

/* ─── SCROLL REVEAL ──────────────────────────────────────────────── */
function scheduleReveal(elements) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const index = parseInt(el.dataset.index, 10) || 0;
          const delay = Math.min(index * 55, 500);
          setTimeout(() => {
            el.classList.add("tm-row-visible");
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}

/* ─── DIVIDER COUNT UPDATER ──────────────────────────────────────── */
function updateCount(elementId, count) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = String(count).padStart(2, "0");
}

/* ─── MEMBER COUNT HEADER ────────────────────────────────────────── */
function updateMemberCount() {
  const total = CHIEF_BOARD.length + BOARD_MEMBERS.length + TEAM_MEMBERS.length;
  const el = document.getElementById("tmMemberCount");
  if (!el) return;
  el.textContent =
    total > 0 ? `${String(total).padStart(2, "0")} MEMBERS` : "COMING SOON";
}

/* ─── HEADLINE STAGGER ───────────────────────────────────────────── */
function initHeadlineStagger() {
  const rows = document.querySelectorAll(".tm-headline-row");
  rows.forEach((row, i) => {
    const text = row.textContent;
    row.innerHTML = `<span class="inner">${text}</span>`;
    row.style.overflow = "hidden";
    const inner = row.querySelector(".inner");
    inner.style.display = "inline-block";
    inner.style.transform = "translateY(110%)";
    inner.style.opacity = "0";
    setTimeout(
      () => {
        inner.style.transition = `transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease`;
        inner.style.transform = "translateY(0)";
        inner.style.opacity = "1";
      },
      200 + i * 120,
    );
  });
}

/* ─── SECTION DIVIDER REVEAL ─────────────────────────────────────── */
function initDividerReveal() {
  const dividers = document.querySelectorAll(".tm-section-divider");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const line = entry.target.querySelector(".tm-divider-line");
          const label = entry.target.querySelector(".tm-divider-label");
          const count = entry.target.querySelector(".tm-divider-count");

          if (line) {
            line.style.transition = "opacity 0.6s ease";
            line.style.opacity = "1";
          }
          if (label) {
            label.style.transition =
              "opacity 0.6s ease 0.15s, transform 0.6s var(--ease) 0.15s";
            label.style.opacity = "1";
            label.style.transform = "translateX(0)";
          }
          if (count) {
            count.style.transition = "opacity 0.6s ease 0.25s";
            count.style.opacity = "0.6";
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  dividers.forEach((div) => {
    const line = div.querySelector(".tm-divider-line");
    const label = div.querySelector(".tm-divider-label");
    const count = div.querySelector(".tm-divider-count");

    if (line) {
      line.style.opacity = "0";
    }
    if (label) {
      label.style.opacity = "0";
      label.style.transform = "translateX(-8px)";
    }
    if (count) {
      count.style.opacity = "0";
    }

    observer.observe(div);
  });
}

/* ─── YEARS ──────────────────────────────────────────────────────── */
function setYears() {
  const y = new Date().getFullYear();
  const els = [
    document.getElementById("tmCurrentYear"),
    document.getElementById("tmEndYear"),
  ];
  els.forEach((el) => {
    if (el) el.textContent = y;
  });
}

/* ─── HAMBURGER (shared pattern) ────────────────────────────────── */
function initHamburger() {
  const burger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (!burger || !navMenu) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

/* ─── LOADER (shared pattern) ────────────────────────────────────── */
function initLoader() {
  const screen = document.getElementById("loadingScreen");
  if (!screen) return;
  if (document.documentElement.classList.contains("skip-loader")) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      screen.classList.add("hidden");
      setTimeout(() => {
        screen.style.display = "none";
      }, 800);
    }, 600);
  });
}

/* ─── BG VIDEO ───────────────────────────────────────────────────── */
function initBgVideo() {
  const video = document.getElementById("bgVideo");
  if (video) video.play().catch(() => {});
}

/* ─── MAGNETIC CURSOR GLOW ON ROWS (desktop only) ────────────────── */
function initMagneticRows() {
  if (window.innerWidth < 768) return;

  const allRows = document.querySelectorAll(".tm-exposed-row, .tm-ledger-row");

  allRows.forEach((row) => {
    row.addEventListener("mousemove", (e) => {
      const rect = row.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      row.style.setProperty("--mx", `${relX}px`);
      row.style.setProperty("--my", `${relY}px`);
    });
  });
}

/* ─── GLOBAL MOUSE PARALLAX ON GHOST ─────────────────────────────── */
function initGhostParallax() {
  const ghostText = document.getElementById("ghostNameText");
  if (!ghostText) return;

  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Very subtle: max ±1.5% drift
    targetX = ((e.clientX - cx) / cx) * 1.5;
    targetY = ((e.clientY - cy) / cy) * 1.5;
  });

  function loop() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    // Only moves the text within the stage — stage controls visibility transforms
    ghostText.style.transform = `translate(${currentX}%, ${currentY}%)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── DIM SIBLINGS ON HOVER ──────────────────────────────────────── */
function initSiblingDim() {
  const groups = [
    { selector: ".tm-exposed-row", dimClass: "tm-dim" },
    { selector: ".tm-ledger-row", dimClass: "tm-dim" },
    { selector: ".tm-freq-cell", dimClass: "tm-dim" },
  ];

  // Inject dim style once
  const style = document.createElement("style");
  style.textContent = `
    .tm-dim {
      opacity: 0.3 !important;
      transition: opacity 0.35s ease !important;
    }
    .tm-exposed-row,
    .tm-ledger-row,
    .tm-freq-cell {
      transition:
        opacity 0.35s ease,
        background 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);

  groups.forEach(({ selector, dimClass }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        elements.forEach((other) => {
          if (other !== el) other.classList.add(dimClass);
        });
      });
      el.addEventListener("mouseleave", () => {
        elements.forEach((other) => other.classList.remove(dimClass));
      });
    });
  });
}

/* ─── SCROLL PROGRESS LINE ───────────────────────────────────────── */
function initScrollLine() {
  const line = document.createElement("div");
  line.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    background: var(--blue);
    width: 0%;
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
    opacity: 0.5;
  `;
  document.body.appendChild(line);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      line.style.width = `${Math.min(progress, 100)}%`;
    },
    { passive: true },
  );
}

/* ─── MAIN INIT ──────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Metadata
  setYears();
  updateMemberCount();
  updateCount("count-chief", CHIEF_BOARD.length);
  updateCount("count-board", BOARD_MEMBERS.length);
  updateCount("count-team", TEAM_MEMBERS.length);

  // Render rosters
  renderChief(CHIEF_BOARD, "roster-chief");
  renderBoard(BOARD_MEMBERS, "roster-board");
  renderTeam(TEAM_MEMBERS, "roster-team");

  // Typography
  initHeadlineStagger();

  // Reveal animations
  initDividerReveal();

  // Interactions
  initMagneticRows();
  initSiblingDim();
  initGhostParallax();
  initScrollLine();

  // Infrastructure
  initHamburger();
  initLoader();
  initBgVideo();
});
