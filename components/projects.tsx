"use client";

// components/projects.tsx
//
// Same editorial grammar as Tracks: numbered entries, no card container,
// hairline rules between them, a single slide-fade as each one enters
// the viewport. PROJECTS is an array from the start (even with one entry
// today) so a second write-up is just another object in the list, no
// layout changes required.
//
// Each entry is framed the way Gea actually sits on the project — Role /
// Status / Stack as a small meta row (mirrors the mono caption style
// used for "Experience" and "Certifications" in About), problem-first
// framing before the feature list, and an outbound link treated the same
// as the footer's contact links rather than a boxed "view project"
// button.

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Project = {
  name: string;
  status: "Live" | "In Progress" | "Archived";
  role: string;
  client: string;
  stack: string;
  href: string;
  hrefLabel: string;
  summary: string;
  problem: string;
  features: string[];
  image: { src: string; alt: string };
};

const PROJECTS: Project[] = [
  {
    name: "GeoSME Batangas",
    status: "Live",
    role: "Project Manager",
    client: "CABE Research Department",
    stack: "GIS mapping · PostgreSQL · REST API",
    href: "https://geosme-batangas.com",
    hrefLabel: "geosme-batangas.com",
    summary:
      "SME research data platform and fintech mapping dashboard for structured, fieldwork-driven research management.",
    problem:
      "The CABE Research Department lacked a centralized way to record SME data from their fieldwork and track how those businesses were adopting financial technologies across Batangas municipalities — relying instead on scattered spreadsheets and manual reports that made both data upkeep and trend analysis slow and error-prone. As project manager, I coordinated the research and development workflow between the department's fieldwork process and the platform being built to support it, keeping the data model aligned to what researchers actually collect on the ground.",
    features: [
      "Structured dashboard for researchers to record and maintain SME profiles, municipality assignments, and financial technology usage",
      "Interactive GIS map that reflects the live dataset — SME markers, municipality boundaries, and fintech density all update as records change",
      "Data visualization dashboards for trend and comparative analysis across the studied SMEs",
      "Filterable datasets so researchers can drill into specific municipalities, business categories, or fintech types",
      "RESTful API layer connecting the dashboard and mapping frontend to structured PostgreSQL data",
    ],
    image: {
      src: "/projects/geosme-batangas.png",
      alt: "GeoSME Batangas shown on laptop, tablet, and mobile screens",
    },
  },
];

function StatusPill({ status }: { status: Project["status"] }) {
  const isLive = status === "Live";
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] tracking-wide text-muted-foreground">
      {isLive ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      )}
      {status}
    </span>
  );
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const fromX = index % 2 === 0 ? -32 : 32;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Device-mockup screenshot — the one place in this section that
          earns a container, since it's a literal image rather than
          decoration. Kept to a hairline border and the site's existing
          rounded-2xl radius so it reads as part of the same system as
          the portrait treatments above it. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/9]">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className="object-fill"
          sizes="(min-width: 768px) 768px, 100vw"
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-heading text-2xl text-foreground sm:text-3xl">
            {project.name}
          </h3>
          <StatusPill status={project.status} />
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:mt-3">
          {project.summary}
        </p>

        {/* Meta row — Role / Client / Stack, same mono-caption language
            as the About section's Experience/Certifications labels. */}
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
          {[
            { label: "Role", value: project.role },
            { label: "Client", value: project.client },
            { label: "Stack", value: project.stack },
          ].map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Problem addressed
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {project.problem}
        </p>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Key features
        </p>
        <ul className="mt-4 space-y-3">
          {project.features.map((feature) => (
            <li
              key={feature}
              className="relative pl-5 text-sm text-muted-foreground"
            >
              <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
        >
          Visit {project.hrefLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-28">
      <h2 className="font-heading text-3xl text-foreground">Projects</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Platforms I&apos;ve helped plan, build, and ship — led as project
        manager from requirements through delivery.
      </p>

      <div className="mt-16 space-y-20">
        {PROJECTS.map((project, index) => (
          <div key={project.name}>
            {index > 0 && (
              <div className="mb-20 border-t border-border" aria-hidden />
            )}
            <ProjectEntry project={project} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
