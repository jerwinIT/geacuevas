"use client";

// components/footer.tsx
//
// Closes the page the same way it opens: a hairline rule instead of a
// card, the accent status-dot motif from the Hero pill, and the same
// font-heading/font-mono pairing used everywhere else. Left side carries
// identity (brand + the "available" signal), right side repeats the nav
// so someone who scrolled all the way down doesn't have to scroll back
// up to get anywhere. Bottom row is the fine print — copyright and a
// back-to-top control, styled as quiet as a caption.

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Download, Mail } from "lucide-react";
import { useEmailDialog } from "@/components/email-dialog";
import { BRAND, HERO_CONTENT, NAV_LINKS_ALL } from "@/lib/config/site";

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const openEmailDialog = useEmailDialog();
  const year = new Date().getFullYear();

  const handleBackToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-background">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
          {/* Identity — name, status pill, short line. Echoes the Hero's
              badge treatment at a much quieter volume. */}
          <div>
            <a
              href="#hero"
              onClick={handleBackToTop}
              className="font-heading text-xl text-foreground"
            >
              {HERO_CONTENT.name}
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {HERO_CONTENT.subtitle}
            </p>
          </div>

          {/* Quick links + contact — right-aligned on desktop, mirrors
              the navbar's left/right split into two quiet columns. */}
          <div className="flex flex-wrap gap-12 sm:gap-16 md:justify-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Index
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {NAV_LINKS_ALL.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Contact
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={openEmailDialog}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {HERO_CONTENT.emailLabel}
                </button>
                <a
                  href={HERO_CONTENT.resumeHref}
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  {HERO_CONTENT.resumeLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-16 flex flex-col-reverse items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs tracking-wide text-muted-foreground/80">
            © {year} {HERO_CONTENT.name}. All rights reserved.
          </p>
          <a
            href="#hero"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
