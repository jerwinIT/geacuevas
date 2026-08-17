import Image from "next/image";
import { Hero } from "@/components/hero";
import { Tracks } from "@/components/tracks";
import { Projects } from "@/components/projects";
import { AVATAR } from "@/lib/config/site";
import { Footer } from "@/components/footer";

// Experience is kept as data rather than inlined JSX so the timeline
// markup below stays a plain .map — add a role here and it shows up in
// the About section with no other changes needed.
const EXPERIENCE = [
  {
    role: "Quality Assurance Lead Intern",
    org: "Center for Artificial Intelligence and Smart Technologies",
    period: "Feb – May 2026",
  },
  {
    role: "Associate Project Manager for Research and Impact Intern",
    org: "Tech Executive Labs I.T. Solutions",
    period: "Jan 2025 – Jan 2026",
  },
];

const CERTIFICATIONS = [
  "Lean Project Management – Yellow Belt",
  "Asana Workflow Specialist",
];

// Placeholder sections give the nav links (#about, #tracks, #projects) and
// the scroll-spy something real to target. Swap each body out for actual
// content — ids and alternating bg/card tone are the only load-bearing
// parts here.

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <Hero />

      <section id="about" className="mx-auto max-w-4xl px-6 py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr] md:gap-16">
          {/* Portrait — squared off with rounded corners so it reads
              distinct from the hero's full-cutout treatment, but still
              carries the same drop-shadow-over-transparent-bg look. The
              image is sized to match the grid column exactly (200px at
              md) so it no longer overflows into the text column — that
              overflow was also why the text side felt cramped. */}
          <div className="mx-auto w-fit md:mx-0">
            <div
              id="about-avatar"
              className="relative mx-auto h-[300px] w-[210px] sm:h-[340px] sm:w-[230px] md:h-[280px] md:w-[200px]"
            >
              <Image
                src={"/gea-fil.png"}
                alt={AVATAR.alt}
                fill
                priority
                className="object-contain object-bottom drop-shadow-xl"
              />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl text-foreground">About</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Hi, I&apos;m Gea. I&apos;m an IT Service Management graduate from
              Batangas State University, with experience bridging user needs and
              technical delivery across software and research projects. I bring
              a service-first mindset to every initiative — making sure systems
              aren&apos;t just built, but built right for the people who use
              them. My background spans quality assurance, requirements
              gathering, and end-to-end project delivery, backed by
              certifications in Lean Project Management and Agile/Scrum.
            </p>

            <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Experience
            </h3>
            <div className="mt-4 space-y-6 border-l border-border pl-6">
              {EXPERIENCE.map((item) => (
                <div key={item.role} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                  <p className="font-medium text-foreground">{item.role}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.org}
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground/80">
                    {item.period}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Certifications
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Tracks />
      <Projects />
      <Footer />
    </main>
  );
}
