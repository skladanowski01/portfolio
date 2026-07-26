gsap.registerPlugin(ScrollTrigger);

// --- ELEMNETY DOM ---
const nav = document.querySelector("[data-nav]");
const burger = document.querySelector("[data-burger]");
const logo = document.querySelector("[data-logo]");
const cta = document.querySelector(".btn-cta");
const navLinks = document.querySelectorAll(".nav-link");
const navItems = document.querySelectorAll(".nav-item");
const heroTitle = document.querySelector(".hero-title");
const heroSubtitle = document.querySelector(".hero-subtitle");
const heroLines = document.querySelectorAll(".hero-subtitle-line");
const sections = document.querySelectorAll("main section");

if (!nav || !burger) {
  console.error("Brakuje elementów menu w HTML.");
}

// --- 1. INICJALIZACJA LENIS (SMOOTH SCROLL) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

// Połączenie Lenisa ze ScrollTriggerem GSAP
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// --- 2. OBSŁUGA PŁYNNEGO PRZEJŚCIA PO KLIKNIĘCIU W LINKI (ANCHORS) ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    
    if (targetId && targetId !== '#') {
      if (isMenuOpen) {
        closeMenu();
        setTimeout(() => {
          lenis.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
          });
        }, 300);
      } else {
        lenis.scrollTo(targetId, {
          offset: 0,
          duration: 1.5,
        });
      }
    }
  });
});


// --- 3. STAN BAZOWY DLA ELEMNETÓW (GSAP SET) ---
gsap.set(nav, {
  clipPath: "circle(0% at calc(100% - 40px) 40px)",
  pointerEvents: "none",
});

gsap.set([logo, cta, burger], {
  autoAlpha: 0,
  y: -12,
});

gsap.set(heroTitle, {
  autoAlpha: 0,
  y: 40,
});

gsap.set(heroSubtitle, {
  autoAlpha: 0,
});

gsap.set(heroLines, {
  autoAlpha: 0,
  y: 20,
});


// --- 4. TIMELINE INTRO ---
const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

introTl
  .to([logo, cta, burger], {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.08,
  })
  .to(heroTitle, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
  }, 0.15)
  .to(heroSubtitle, {
    autoAlpha: 1,
    duration: 0.2,
  }, 0.35)
  .to(heroLines, {
    autoAlpha: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
  }, 0.42);


// --- 5. OBSŁUGA OVERLAY MENU ---
let isMenuOpen = false;

const menuTl = gsap.timeline({
  paused: true,
  defaults: { ease: "power3.inOut" },
  onStart: () => {
    nav.classList.add("is-active");
    nav.style.pointerEvents = "all";
    burger.setAttribute("aria-label", "Close menu");
    burger.setAttribute("aria-expanded", "true");
  },
  onReverseComplete: () => {
    nav.classList.remove("is-active");
    nav.style.pointerEvents = "none";
    burger.setAttribute("aria-label", "Open menu");
    burger.setAttribute("aria-expanded", "false");
  },
});

menuTl
  .to(nav, {
    clipPath: "circle(150% at calc(100% - 40px) 40px)",
    duration: 0.75,
  })
  .to(".burger-line:first-child", {
    y: 4,
    rotation: 45,
    duration: 0.25,
    transformOrigin: "center",
  }, 0)
  .to(".burger-line:last-child", {
    y: -4,
    rotation: -45,
    duration: 0.25,
    transformOrigin: "center",
  }, 0)
  .fromTo(navItems, {
    autoAlpha: 0,
    y: 24,
  }, {
    autoAlpha: 1,
    y: 0,
    duration: 0.45,
    stagger: 0.08,
  }, 0.18);

function openMenu() {
  if (isMenuOpen) return;
  isMenuOpen = true;
  lenis.stop();
  menuTl.play();
}

function closeMenu() {
  if (!isMenuOpen) return;
  isMenuOpen = false;
  lenis.start();
  menuTl.reverse();
}

// Eventy Menu
burger.addEventListener("click", () => {
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Hover effect na linkach w menu
navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    gsap.to(link, {
      x: 10,
      duration: 0.25,
      ease: "power2.out",
    });
  });

  link.addEventListener("mouseleave", () => {
    gsap.to(link, {
      x: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  });
});


// --- 6. SCROLLTRIGGER: REVEAL SEKCJI I PARALLAX HERO ---
sections.forEach((section) => {
  if (section.classList.contains("hero")) return;

  gsap.fromTo(section, {
    autoAlpha: 0,
    y: 60,
  }, {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
});

// Efekt paralaksy w sekcji Hero
gsap.to(".hero-title", {
  yPercent: -6,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});

gsap.to(".hero-subtitle-line", {
  yPercent: -15,
  ease: "none",
  stagger: 0.03,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});

const photos = document.querySelectorAll(".photos img");

if (photos.length > 0) {
  gsap.fromTo(photos, {
    autoAlpha: 0,
    y: 50,
    scale: 0.9,
  }, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".photos",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
}