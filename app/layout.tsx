import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { EmailDialogProvider } from "@/components/email-dialog";

// Display face for headings — set to var name "--font-display" and mapped
// to Tailwind's `font-heading` via @theme inline in globals.css.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

// Body face — variable is named "--font-sans" on purpose so it lines up
// with @theme inline's `--font-sans: var(--font-sans)` passthrough.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Utility face for the nav's ticket-style brand tag and status labels.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Gea Cuevas — IT Service Management",
  description:
    "Portfolio of Gea Cuevas — bridging people, process, and technology through structured, reliable IT service delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <EmailDialogProvider>
          <Navbar />
          {children}
        </EmailDialogProvider>
      </body>
    </html>
  );
}
