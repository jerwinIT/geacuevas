"use client";

// components/navbar.tsx
//
// Topbar: Hero/About on the left, Tracks/Projects on the right, portrait
// + name centered between them — all on the same vertical line. No card,
// no background, no bottom border; the bar stays fully transparent at
// every scroll position.
//
// Four things reveal independently, each triggered by its real hero
// counterpart (#hero-avatar, #hero-resume, #hero-email) scrolling behind
// this bar: the portrait first (sits highest in the hero), then Resume
// and Email Me — which land among the link groups on either side rather
// than in the center cluster. The name is not scroll-driven; it appears
// beneath the portrait on hover instead. The portrait itself is aligned
// to the links' vertical center via a fixed-size wrapper; the name is
// absolutely positioned below it so it can overflow past the bar without
// dragging the portrait's own alignment down with it.

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { useEmailDialog } from "@/components/email-dialog";
import {
  AVATAR,
  HERO_CONTENT,
  NAV_HEIGHT,
  NAV_LINKS_ALL,
  NAV_LINKS_LEFT,
  NAV_LINKS_RIGHT,
} from "@/lib/config/site";

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        "relative px-1 py-2 text-sm tracking-wide transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
      />
    </a>
  );
}

export function Navbar() {
  const [activeHref, setActiveHref] = useState<string>("#hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const openEmailDialog = useEmailDialog();

  const prefersReducedMotion = useReducedMotion();

  // Independent reveal flags for each piece of hero copy that hands off
  // to the nav. Each is driven by an IntersectionObserver on the matching
  // hero element, shrunk by NAV_HEIGHT at the top so "intersecting" means
  // "still below the bar" — once the real element scrolls behind the bar
  // it goes false, and that element's nav copy fades in.
  const [avatarRevealed, setAvatarRevealed] = useState(false);
  const [resumeRevealed, setResumeRevealed] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  // The name beneath the portrait is hover-driven rather than
  // scroll-driven — it appears while the pointer is over the portrait.
  const [nameHovered, setNameHovered] = useState(false);

  useEffect(() => {
    const targets: [string, (revealed: boolean) => void][] = [
      ["hero-avatar", setAvatarRevealed],
      ["hero-resume", setResumeRevealed],
      ["hero-email", setEmailRevealed],
    ];

    const rootMargin = `-${NAV_HEIGHT}px 0px 0px 0px`;
    const observers = targets.map(([id, setRevealed]) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => setRevealed(!entry.isIntersecting),
        { rootMargin, threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  // Brand click — scroll straight back to the top rather than relying on
  // the browser's default anchor jump, so it's smooth and always lands
  // above the hero's own scroll-driven fade.
  const handleBackToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Lightweight scroll-spy for the active link underline.
  //
  // Deliberately not ratio-based IntersectionObserver: a section's
  // intersection ratio is computed against its *own* full height, so a
  // section much taller than the viewport (Tracks, once it's a stacked
  // pair of full track write-ups) can sit well inside the trigger band
  // and still never cross a 0.1 ratio threshold, since the visible
  // sliver is tiny relative to the section's total height. That leaves
  // it permanently un-selectable no matter how long you scroll through
  // it. Tracking each section's top position against a fixed line in
  // the viewport works the same regardless of how tall any one section
  // is — the active link is whichever section's top has most recently
  // crossed that line.
  useEffect(() => {
    const sections = NAV_LINKS_ALL.map((link) =>
      document.querySelector<HTMLElement>(link.href),
    ).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    // Same intent as the old rootMargin ("-40% 0px -50% 0px"): the
    // active section is whichever one occupies the line 40% down the
    // viewport.
    const LINE_RATIO = 0.4;

    const updateActive = () => {
      const lineY = window.innerHeight * LINE_RATIO;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= lineY) {
          current = section;
        }
      }
      if (current.id) setActiveHref(`#${current.id}`);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm"
      style={{ height: NAV_HEIGHT }}
    >
      <nav className="relative mx-auto flex h-full max-w-6xl items-center justify-center gap-10 px-4 sm:px-6 lg:px-8 md:gap-14">
        {/* Left links — Resume (once it's scrolled behind the bar), then
            Hero, About. Resume sits at the outer/left edge of this group,
            away from the profile — the mirror of Email Me sitting at the
            outer/right edge of the right group. Unmounted (not just
            invisible) until revealed so it doesn't reserve space or shift
            the group beforehand. */}
        <div className="hidden items-center gap-6 md:flex">
          <AnimatePresence>
            {resumeRevealed && (
              <motion.a
                key="nav-resume"
                href={HERO_CONTENT.resumeHref}
                download
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, scale: 0.9, x: -6 }
                }
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, scale: 0.9, x: -6 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 text-xs text-accent-foreground hover:bg-accent/90"
              >
                <Download className="h-3 w-3" />
                {HERO_CONTENT.resumeLabel}
              </motion.a>
            )}
          </AnimatePresence>
          {NAV_LINKS_LEFT.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={activeHref === link.href}
            />
          ))}
        </div>

        {/* Brand — the h-10 w-10 wrapper is the only box that affects
            this link's height, so the outer flex's items-center aligns
            the portrait itself to the same line as the links on either
            side. The name is absolutely positioned below it, free to
            overflow past the bar without pulling the portrait's
            alignment down with it. Doubles as a back-to-top control once
            it's revealed. Hovering the portrait reveals the name. */}
        <a
          href="#hero"
          onClick={handleBackToTop}
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
          aria-label={`${HERO_CONTENT.name} — back to top`}
          className="hidden md:flex md:items-center"
        >
          <div className="relative h-10 w-10 shrink-0">
            {/* Initials mark — fills the portrait's spot for the default
                state, before scrolling past #hero-avatar reveals the
                real photo. Same ring treatment as the photo below it so
                the crossfade between the two reads as one continuous
                shape settling in, not two different elements swapping. */}
            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: avatarRevealed ? 0 : 1,
                      scale: avatarRevealed ? 0.85 : 1,
                    }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background"
            >
              <span className="font-mono text-xs tracking-wide text-foreground">
                GC
              </span>
            </motion.div>

            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: avatarRevealed ? 1 : 0,
                      scale: avatarRevealed ? 1 : 0.85,
                      y: avatarRevealed ? 0 : 8,
                    }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background"
            >
              <Image
                src={AVATAR.src}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </motion.div>

            <motion.span
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: nameHovered && avatarRevealed ? 1 : 0,
                      y: nameHovered && avatarRevealed ? 0 : -4,
                    }
              }
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-heading text-sm font-medium text-foreground"
            >
              {HERO_CONTENT.name}
            </motion.span>
          </div>
        </a>

        {/* Right links — Tracks, Projects, then Email Me once it's
            scrolled behind the bar. */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS_RIGHT.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={activeHref === link.href}
            />
          ))}
          <AnimatePresence>
            {emailRevealed && (
              <motion.button
                key="nav-email"
                type="button"
                onClick={openEmailDialog}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, scale: 0.9, x: 6 }
                }
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, scale: 0.9, x: 6 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-3.5 text-xs text-foreground hover:bg-muted"
              >
                <Mail className="h-3 w-3" />
                {HERO_CONTENT.emailLabel}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile brand cluster — same GC → avatar handoff as the
            desktop brand mark above, just laid out for a touch target
            with no hover state: the name sits next to the mark instead
            of revealing beneath it on :hover. Empty until avatarRevealed
            flips true, so the bar stays clean at the top of the page and
            only fills in once #hero-avatar has scrolled behind it. */}
        <a
          href="#hero"
          onClick={handleBackToTop}
          aria-label={`${HERO_CONTENT.name} — back to top`}
          className="absolute left-4 flex items-center gap-2 md:hidden"
        >
          <div className="relative h-8 w-8 shrink-0">
            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: avatarRevealed ? 0 : 1,
                      scale: avatarRevealed ? 0.85 : 1,
                    }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background"
            >
              <span className="font-mono text-[10px] tracking-wide text-foreground">
                GC
              </span>
            </motion.div>

            <motion.div
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: avatarRevealed ? 1 : 0,
                      scale: avatarRevealed ? 1 : 0.85,
                    }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-accent ring-offset-2 ring-offset-background"
            >
              <Image
                src={AVATAR.src}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>

          <motion.span
            initial={false}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: avatarRevealed ? 1 : 0,
                    x: avatarRevealed ? 0 : -6,
                  }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="whitespace-nowrap font-heading text-lg font-medium text-foreground"
          >
            {HERO_CONTENT.name}
          </motion.span>
        </a>

        {/* Mobile trigger — pinned to the right edge since the centered
            groups above are hidden below md. Panel itself lives in
            MobileNav so its layout (link list + Resume/Email CTAs) is
            easy to iterate on independently of this bar's reveal
            logic. */}
        <MobileNav
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          activeHref={activeHref}
        />
      </nav>
    </header>
  );
}
