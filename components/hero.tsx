"use client";

// components/hero.tsx
//
// Portrait here is the "source" copy: it starts large and centered, then
// as scrollY moves through SCROLL_RANGE it lifts and fades away. Its twin
// in <Navbar /> is driven independently: the portrait, the #hero-name
// heading, and the #hero-resume / #hero-email buttons below each carry an
// id that Navbar observes directly, so their nav copies fade in the
// instant the real one scrolls behind the bar — no shared pixel range to
// keep in sync, and each nav copy naturally trails the ones above it
// since they sit lower in the hero.

import Image from "next/image";
import { Download, Mail } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEmailDialog } from "@/components/email-dialog";
import {
  AVATAR,
  HERO_CONTENT,
  NAV_HEIGHT,
  SCROLL_RANGE,
} from "@/lib/config/site";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const openEmailDialog = useEmailDialog();
  const { scrollY } = useScroll();

  const heroAvatarOpacity = useTransform(
    scrollY,
    [SCROLL_RANGE.start, SCROLL_RANGE.end],
    [1, 0],
  );
  const heroAvatarScale = useTransform(
    scrollY,
    [SCROLL_RANGE.start, SCROLL_RANGE.end],
    [1, 1.12],
  );
  const heroAvatarY = useTransform(
    scrollY,
    [SCROLL_RANGE.start, SCROLL_RANGE.end],
    [0, -36],
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center"
      style={{ paddingTop: NAV_HEIGHT }}
    >
      {/* Quiet ambient backdrop — a single soft signal-colored glow, kept
          subtle so the portrait and type stay the focal point. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                opacity: heroAvatarOpacity,
                scale: heroAvatarScale,
                y: heroAvatarY,
              }
        }
        className="relative"
      >
        {/* No box, no ring, no crop — the source photo already has its
            background removed, so the full cutout sits directly in the
            hero rather than being forced into a circular frame. Height
            is fixed per breakpoint and width follows naturally via
            object-contain, so the photo's real proportions are kept
            intact. */}
        <div
          id="hero-avatar"
          className="relative mx-auto h-[340px] w-[240px] sm:h-[400px] sm:w-[280px] md:h-[440px] md:w-[300px]"
        >
          <Image
            src={AVATAR.src}
            alt={AVATAR.alt}
            fill
            priority
            className="object-contain object-bottom drop-shadow-xl"
          />
        </div>
      </motion.div>

      <span className="mb-5 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-1.5 font-mono text-xs tracking-wide text-muted-foreground">
        {HERO_CONTENT.badge}
      </span>

      <h1
        id="hero-name"
        className="text-balance font-heading text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl"
      >
        {HERO_CONTENT.name}
      </h1>

      <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
        {HERO_CONTENT.subtitle}
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          id="hero-resume"
          href={HERO_CONTENT.resumeHref}
          download
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
        >
          <Download className="h-4 w-4" />
          {HERO_CONTENT.resumeLabel}
        </a>

        <button
          id="hero-email"
          type="button"
          onClick={openEmailDialog}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-6 text-foreground hover:bg-muted"
        >
          <Mail className="h-4 w-4" />
          {HERO_CONTENT.emailLabel}
        </button>
      </div>
    </section>
  );
}
