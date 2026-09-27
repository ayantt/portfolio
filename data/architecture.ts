import type { ArchitectureCardData } from "@/lib/types";

/**
 * Conceptual architecture views behind the work in Projects/Experience.
 * These are illustrative diagrams, not confidential production schematics.
 */
export const ARCHITECTURE: ArchitectureCardData[] = [
  {
    id: "flowdocs-arch",
    icon: "⌷",
    name: "FlowDocs",
    tag: "Document workflow engineering",
    blocks: [
      { name: "Employee", callout: "Initiates a request" },
      { name: "REST API", callout: "Entry point for actions" },
      { name: "Go Backend", callout: "Workflow logic" },
      { name: "PostgreSQL", callout: "Stores documents and state" },
      { name: "Workflow Engine", callout: "Approval progression" },
      { name: "Approval Stages", callout: "Sequential, with send-back and rejection" },
    ],
    notes: [
      "Sequential approvals mean each stage waits on the one before it to complete.",
      "Send-back returns a document to an earlier stage instead of rejecting it outright.",
      "Document-type workflows let different kinds of documents follow different paths through the same engine.",
    ],
  },
  {
    id: "erp-arch",
    icon: "⌸",
    name: "ERP Service Architecture",
    tag: "Backend systems at Gononet",
    disclaimer:
      "A conceptual view of the technologies used together at Gononet, not a diagram of a specific confidential system.",
    blocks: [
      { name: "Client", callout: "WMS, Inventory, Purchase, Sales, POS" },
      { name: "Echo API Gateway", callout: "Single entry point for clients" },
      { name: "Go Services", callout: "Domain logic per service" },
      { name: "gRPC", callout: "Service-to-service communication" },
      { name: "PostgreSQL", callout: "Central relational data layer" },
      { name: "Kafka", callout: "Reliable event flow via an outbox" },
    ],
    notes: [
      "A gateway exists so clients don't need to know which service handles what.",
      "Services stay separated so each domain — inventory, sales, purchase — can change independently.",
      "The Kafka outbox keeps events reliable even if a service restarts mid-write.",
    ],
  },
  {
    id: "db-arch",
    icon: "⌗",
    name: "Database Thinking",
    tag: "PostgreSQL index optimization",
    blocks: [
      { name: "Before", callout: "Existing indexing strategy" },
      { name: "Slow queries", callout: "Reporting and lookups under load" },
      { name: "Index redesign", callout: "Rebuilt indexing strategy" },
      { name: "Faster responses", callout: "Result of the redesign" },
    ],
    result: {
      value: "≈20%",
      label: "response-time reduction",
      detail: "Documented result of that indexing work at Gononet — not a claim about every system.",
    },
    notes: [
      "Relational databases fit this workload because the data is highly structured and relationships between documents, stages and approvers matter.",
      "An index only helps if it matches how the data is actually queried — that's what the redesign targeted.",
    ],
  },
];
