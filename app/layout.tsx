import type { Metadata, Viewport } from "next";
// Self-hosted via @fontsource (bundled font files, no runtime call to Google Fonts)
// rather than next/font/google, matching the CSS variables globals.css already expects.
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "./globals.css";

const SITE_URL = "https://ayantt.dev";
const TITLE = "Tasnif Taussuk — Software Engineer";
const DESCRIPTION =
  "Tasnif Taussuk — Software Engineer in Dhaka focused on backend systems, Golang, .NET and PostgreSQL. Career journey, projects and architecture.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: "Backend engineer in Dhaka — Golang, .NET, PostgreSQL. Career journey, projects and system architecture.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: "Backend engineer in Dhaka — Golang, .NET, PostgreSQL. Career journey, projects and system architecture.",
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%9A%87%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
