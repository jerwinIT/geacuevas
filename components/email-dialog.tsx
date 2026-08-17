"use client";

// components/email-dialog.tsx
//
// Every "Email Me" touchpoint on the site (Hero, Navbar's scroll-revealed
// pill, MobileNav, Footer) used to be a plain `mailto:` link. Rather than
// wrapping each one in its own <Dialog> — which means duplicating the
// form four times and fighting each site's own animation (the Navbar
// pill in particular is framer-motion driven, mounted/unmounted via
// AnimatePresence) — there's a single Dialog + form rendered once here,
// and a tiny context exposes `openEmailDialog()` so any trigger anywhere
// just calls that instead of carrying a mailto href. Each trigger keeps
// its own existing markup, styling, and animation untouched; only the
// href/onClick swaps.
//
// Submitting posts to /api/send-email, a server route that calls Resend
// with the API key kept server-side (RESEND_API_KEY in the environment —
// never referenced from this client component). The form tracks its own
// idle/submitting/success/error state and shows a confirmation screen in
// place rather than just closing on success, since there's no toast
// system in this project to hand that feedback off to.

import {
  createContext,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "submitting" | "success" | "error";

const EmailDialogContext = createContext<(() => void) | null>(null);

export function useEmailDialog() {
  const openEmailDialog = useContext(EmailDialogContext);
  if (!openEmailDialog) {
    throw new Error("useEmailDialog must be used within <EmailDialogProvider>");
  }
  return openEmailDialog;
}

export function EmailDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setName("");
    setReplyTo("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  };

  // Reset happens on close (not just on next open) so a success or error
  // screen doesn't flash the previous state for a frame before the panel
  // has finished animating out. Left alone mid-submit, so closing the
  // dialog doesn't stomp on a request that's still in flight.
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && status !== "submitting") {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: replyTo, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ??
            "Something went wrong sending that — try again in a moment.",
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong sending that — try again in a moment.",
      );
    }
  };

  return (
    <EmailDialogContext.Provider
      value={() => {
        resetForm();
        setOpen(true);
      }}
    >
      {children}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {status === "success" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Message sent
                </DialogTitle>
                <DialogDescription>
                  Thanks{name ? `, ${name}` : ""} — that&apos;s on its way.
                  I&apos;ll get back to you soon.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Get in touch</DialogTitle>
                <DialogDescription>
                  Send a message directly — no mail app required.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email-dialog-name">Name</Label>
                  <Input
                    id="email-dialog-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={status === "submitting"}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email-dialog-reply-to">Your email</Label>
                  <Input
                    id="email-dialog-reply-to"
                    type="email"
                    value={replyTo}
                    onChange={(event) => setReplyTo(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={status === "submitting"}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email-dialog-message">Message</Label>
                  <Textarea
                    id="email-dialog-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="What would you like to talk about?"
                    rows={4}
                    disabled={status === "submitting"}
                    required
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </EmailDialogContext.Provider>
  );
}
