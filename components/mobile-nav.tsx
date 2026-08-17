"use client";

// components/mobile-nav.tsx
//
// The hamburger panel, split out of Navbar so its own layout can be
// reasoned about on its own: a plain link list up top, then Resume /
// Email Me pinned to the bottom as real CTAs rather than two more links
// in the list — someone opening this on mobile is often here specifically
// to grab one of those two things.
//
// No visible "GC / 01" header anymore — Navbar's brand mark already
// lives in the bar underneath this panel, so repeating it here was just
// noise. SheetTitle is kept but visually hidden (sr-only): Radix's Sheet
// still wants a real title for screen readers, it just doesn't need to
// be seen.

import { Download, Mail, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEmailDialog } from "@/components/email-dialog";
import { HERO_CONTENT, NAV_LINKS_ALL } from "@/lib/config/site";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeHref: string;
};

export function MobileNav({ open, onOpenChange, activeHref }: MobileNavProps) {
  const openEmailDialog = useEmailDialog();
  const close = () => onOpenChange(false);

  const handleEmailClick = () => {
    close();
    openEmailDialog();
  };

  return (
    <div className="absolute right-4 md:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger
          className="text-foreground hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex flex-col border-border bg-card text-foreground"
        >
          <SheetTitle className="sr-only">
            {HERO_CONTENT.name} — navigation menu
          </SheetTitle>

          <nav className="mt-14 flex flex-col gap-1">
            {NAV_LINKS_ALL.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className={[
                  "rounded-lg px-3 py-3 text-lg transition-colors",
                  activeHref === link.href
                    ? "text-accent"
                    : "text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs — pinned to the bottom of the panel via mt-auto so
              they stay put regardless of how many nav links are above
              them, echoing the Hero's own Resume/Email pairing. */}
          <div className="mx-2 mt-auto flex flex-col gap-3 border-t border-border pt-6">
            <a
              href={HERO_CONTENT.resumeHref}
              download
              onClick={close}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm text-accent-foreground hover:bg-accent/90"
            >
              <Download className="h-4 w-4" />
              {HERO_CONTENT.resumeLabel}
            </a>
            <button
              type="button"
              onClick={handleEmailClick}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm text-foreground hover:bg-muted"
            >
              <Mail className="h-4 w-4" />
              {HERO_CONTENT.emailLabel}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
