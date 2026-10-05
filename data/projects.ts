import type { Project } from "@/lib/types";

/**
 * Personal projects, presented as branch routes off the main career line.
 * x/y/bendX are coordinates in the branch diagram's SVG viewBox (0 0 1000 380).
 */
export const PROJECTS: Project[] = [
  {
    id: "flowdocs",
    flagship: true,
    x: 380,
    y: 24,
    bendX: 140,
    name: "FlowDocs",
    tag: "Document workflow platform",
    domain: "flowdocs.ayantt.dev",
    what: "A document approval workflow platform.",
    role: "Independent project",
    stack: ["Go", "React", "PostgreSQL", "REST", "Workflow architecture"],
    capabilities: [
      "Sequential approvals",
      "Document-type workflows",
      "Send-back",
      "Rejection handling",
      "Attachments",
      "Dashboards",
    ],
    links: [
      { label: "Visit site", href: "https://flowdocs.ayantt.dev/" },
      { label: "View source", href: "https://github.com/ayantt/flowdocs" },
    ],
  },
  {
    id: "invoice",
    x: 640,
    y: 310,
    bendX: 260,
    name: "Invoice Snap",
    tag: "PDF invoice generator",
    domain: "invoice.ayantt.dev",
    what: "A free online invoice generator focused on creating professional PDF invoices.",
    role: "Independent project",
    stack: ["HTML", "CSS", "JavaScript"],
    capabilities: ["Professional PDF invoices", "Simple workflow"],
    links: [{ label: "Visit site", href: "https://invoice.ayantt.dev/" }],
  },
  {
    id: "pitch",
    x: 880,
    y: 40,
    bendX: 480,
    name: "PitchBoard",
    tag: "Football data dashboard",
    domain: "github.com/ayantt/pitch-board",
    what: "A football-focused data and dashboard project.",
    role: "Independent project",
    stack: ["HTML", "CSS", "JavaScript"],
    capabilities: ["Data visualization", "Football analytics", "Frontend/backend integration"],
    links: [{ label: "View source", href: "https://github.com/ayantt/pitch-board" }],
  },
];
