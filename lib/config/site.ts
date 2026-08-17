// lib/config/site.ts
//
// Central place for the copy, links, and scroll-behavior numbers shared
// by <Navbar /> and <Hero />. Keeping this separate means content edits
// (new nav label, new subtitle) never require touching component logic,
// and the two components can stay in sync on the scroll math without
// importing from each other.

export const NAV_LINKS_LEFT = [
  { label: "Hero", href: "#hero" },
  { label: "About", href: "#about" },
] as const;

export const NAV_LINKS_RIGHT = [
  { label: "Tracks", href: "#tracks" },
  { label: "Projects", href: "#projects" },
] as const;

// All nav links combined, used for scroll-spy (active link highlight).
export const NAV_LINKS_ALL = [...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT];

export const BRAND = {
  tag: "GC / 01",
  srLabel: "Gea Cuevas — portfolio home",
} as const;

export const AVATAR = {
  src: "/gea-formal.png",
  alt: "Portrait of Gea Cuevas",
  status: "Available for engagements",
} as const;

export const HERO_CONTENT = {
  badge: "Information Technology — Service Management",
  name: "Gea Cuevas",
  subtitle:
    "Bridging people, process, and technology through structured, reliable IT service delivery.",
  resumeLabel: "Resume",
  resumeHref: "/Gea-Cuevas-Resume.pdf",
  emailHref: "22-31617@g.batstate-u.edu.ph",
  emailLabel: "Email Me",
} as const;

// --- Scroll choreography -------------------------------------------------
// The portrait in the Hero and the portrait in the Navbar are the same
// idea shown at two sizes. As window scrollY moves from `start` to `end`
// (in px), the Hero copy fades/lifts up and out while the Navbar copy
// fades/settles down into the gap between the two link clusters.
// Smaller range = snappier handoff. Both components import this so the
// crossfade always lines up.
export const SCROLL_RANGE = {
  start: 0,
  end: 260,
} as const;

export const AVATAR_SIZE = {
  hero: 176, // px — portrait size at rest in the Hero section
  nav: 40, // px — portrait size settled into the nav gap
} as const;

export const NAV_HEIGHT = 84; // px — used for Hero's top padding offset
