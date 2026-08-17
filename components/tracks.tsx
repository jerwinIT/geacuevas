"use client";

// components/tracks.tsx
//
// The two specializations now read as one continuous, sequential piece —
// Project Management as the lead track, QA and Testing following beneath
// it — rather than two competing cards. There is no card container: each
// track is a numbered section (order carries real meaning here, PM is
// presented first as the primary track) separated by a hairline rule,
// echoing the editorial, boxed-in-nothing feel of the About section
// above it.
//
// Motion is a single slide-fade per track as it enters the viewport, plus
// a shorter-delay stagger on each skill group beneath it — subtle enough
// to read as "settling into place" rather than a flashy entrance.

import type { LucideIcon } from "lucide-react";
import { ClipboardList, ShieldCheck, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type TrackGroup = {
  label: string;
  items: string[];
};

type Track = {
  index: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  groups: TrackGroup[];
  tools: TrackGroup;
};

const TRACKS: Track[] = [
  {
    index: "01",
    title: "Project Management Track",
    icon: ClipboardList,
    tagline: "Planning the work and keeping every commitment on schedule.",
    groups: [
      {
        label: "IT Service Management",
        items: [
          "SDLC Management",
          "Service Delivery Support",
          "Requirements Gathering",
          "Process Documentation",
          "UAT Coordination",
          "Stakeholder Communication",
          "Gap Analysis",
          "SLA Awareness",
        ],
      },
      {
        label: "Project Management",
        items: [
          "Agile/Scrum",
          "Sprint Planning",
          "Project Planning & Scheduling",
          "Risk Management",
          "SDLC Management",
          "Milestone Tracking",
        ],
      },
    ],
    tools: {
      label: "Tools and Platforms",
      items: [
        "Asana",
        "Trello",
        "ClickUp",
        "Blue",
        "GitHub",
        "Google Workspace",
        "Microsoft Office",
        "Figma",
        "Canva",
      ],
    },
  },
  {
    index: "02",
    title: "QA and Testing Track",
    icon: ShieldCheck,
    tagline: "Breaking things safely, on purpose, before production does.",
    groups: [
      {
        label: "QA and Business Analysis",
        items: [
          "Test Plan",
          "Test Case Design",
          "Bug Tracking & Regression Testing",
          "Impact Evaluation",
          "Process Mapping",
        ],
      },
      {
        label: "QA and Security Testing",
        items: [
          "Manual & Automated Testing",
          "Web Application & API Testing",
          "Basic Penetration Testing",
          "Vulnerability Assessment",
          "SQL Injection & Network Scanning",
        ],
      },
    ],
    tools: {
      label: "Tools and Frameworks",
      items: [
        "GitHub",
        "Playwright",
        "Pytest",
        "PHPUnit",
        "OWASP ZAP",
        "Nmap",
        "Nikto",
      ],
    },
  },
];

function TrackGroupBlock({
  group,
  delay,
}: {
  group: TrackGroup;
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <p className="text-sm font-medium text-foreground">{group.label}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 pl-3.5">
        {group.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function TrackSection({ track, index }: { track: Track; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = track.icon;
  // Alternate the entrance direction so the two tracks feel like two beats
  // of one motion rather than the same card sliding in twice.
  const fromX = index % 2 === 0 ? -32 : 32;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-6 md:grid-cols-[96px_1fr] md:gap-10"
    >
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
        <span className="font-heading text-5xl leading-none text-accent/20 md:text-6xl">
          {track.index}
        </span>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent md:hidden">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-2xl text-foreground sm:text-3xl">
            {track.title}
          </h3>
        </div>
        <h3 className="font-heading text-2xl text-foreground md:hidden">
          {track.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:mt-3">
          {track.tagline}
        </p>

        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          What I bring to the table
        </p>

        <div className="mt-4 space-y-6">
          {track.groups.map((group, i) => (
            <TrackGroupBlock
              key={group.label}
              group={group}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5 text-accent" />
            <p className="text-sm font-medium text-foreground">
              {track.tools.label}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-[22px]">
            {track.tools.items.map((item) => (
              <span
                key={item}
                className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Tracks() {
  return (
    <section id="tracks" className="bg-card py-28">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-heading text-3xl text-foreground">Tracks</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Two tracks, one service-first mindset — planning the work, and making
          sure it holds up.
        </p>

        <div className="mt-16 space-y-20">
          {TRACKS.map((track, index) => (
            <div key={track.title}>
              {index > 0 && (
                <div className="mb-20 border-t border-border" aria-hidden />
              )}
              <TrackSection track={track} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
