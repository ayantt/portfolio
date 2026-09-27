import type { Station } from "@/lib/types";

/**
 * The career journey, in order. Each station lists the passengers
 * (skills) present at that point in the journey — a bare string means
 * the skill continues from the previous station, a [name, reason] tuple
 * means it boards here. Boarding/continuing/exiting is derived at
 * render time by diffing adjacent stations' passenger sets.
 */
export const STATIONS: Station[] = [
  {
    id: "southeast",
    name: "Southeast University",
    short: "Southeast Univ.",
    type: "Origin station",
    role: "B.Sc. in Computer Science",
    desc: "The start of the journey.",
    work: [],
    passengers: [],
  },
  {
    id: "datahead",
    name: "Datahead (PVT.) Ltd.",
    short: "Datahead",
    type: "Employer",
    role: "Software Engineer",
    desc: "Business systems: ERP, provident fund and accounting.",
    work: [
      { heading: "Systems", items: ["ERP applications", "Provident Fund systems", "Accounting applications"] },
      { heading: "Engineering", items: ["Backend development", "Complex reporting queries"] },
    ],
    passengers: [
      ["C#", ".NET application code"],
      [".NET", "ERP, Provident Fund and accounting apps"],
      ["SQL Server", "Database behind the ERP systems"],
      ["Dapper", "Data access in .NET"],
      ["Entity Framework", "Data access in .NET"],
      ["Backend Development", "Core role focus"],
      ["ERP", "ERP applications"],
      ["Reporting", "Complex reporting queries"],
    ],
  },
  {
    id: "naas",
    name: "NAAS Solutions Ltd.",
    short: "NAAS",
    type: "Employer",
    role: "Software Engineer",
    period: "Mar 2022 — Mar 2024",
    desc: "Telecom, queueing and KPI systems, with early Golang R&D.",
    note: "Go boards here",
    work: [
      { heading: "Systems", items: ["Telecom Commission Generation", "Smart Queue", "Employee KPI"] },
      { heading: "Also", items: ["Golang R&D", "Client proof-of-concept work"] },
    ],
    passengers: [
      "C#",
      ".NET",
      "Backend Development",
      ["Oracle", "Database for NAAS systems"],
      ["Golang", "R&D and client proofs of concept"],
    ],
  },
  {
    id: "gononet",
    name: "Gononet Online Solutions Ltd.",
    short: "Gononet",
    type: "Employer · current",
    role: "Software Engineer",
    period: "Apr 2024 — Present",
    desc: "Golang ERP backend for warehouse, inventory, purchase, sales and POS.",
    note: "PostgreSQL is now the primary passenger",
    current: true,
    work: [
      { heading: "Domains", items: ["WMS", "Inventory", "Purchase", "Sales", "POS"] },
      { heading: "Backend", items: ["Golang ERP backend", "gRPC services", "Echo API gateway", "Kafka outbox"] },
      { heading: "Database", items: ["PostgreSQL architecture and performance work"] },
    ],
    result: {
      value: "≈20%",
      label: "response-time reduction",
      detail:
        "From redesigning the PostgreSQL indexing strategy. A result of that work, not a claim about every Gononet system.",
    },
    passengers: [
      "Golang",
      "C#",
      ".NET",
      "Backend Development",
      ["PostgreSQL", "Architecture and performance work"],
      ["Database Optimization", "Index strategy redesign"],
      ["gRPC", "Service-to-service APIs"],
      ["Echo", "API gateway"],
      ["Bun ORM", "Go data access"],
      ["Kafka", "Outbox pattern"],
      ["Microservices", "ERP backend services"],
      ["SQL", "Queries and schema work"],
    ],
  },
  {
    id: "future",
    name: "Future",
    short: "Future",
    type: "Terminus",
    role: "Next destination unknown.",
    desc: "The end of the documented journey, not a prediction.",
    future: true,
    work: [],
    passengers: [
      "Golang",
      "C#",
      ".NET",
      "Backend Development",
      "PostgreSQL",
      "Database Optimization",
      "gRPC",
      "Echo",
      "Bun ORM",
      "Kafka",
      "Microservices",
      "SQL",
    ],
  },
];

/** Passenger name regardless of whether the entry is a bare string or a [name, reason] tuple. */
export function passengerName(entry: Station["passengers"][number]): string {
  return Array.isArray(entry) ? entry[0] : entry;
}

/** The set of passenger names present at station index i. */
export function passengerSet(i: number): Set<string> {
  return new Set(STATIONS[i].passengers.map(passengerName));
}

/** Passengers that board at station i (i.e. weren't present at i-1). */
export function arrivals(i: number): [string, string][] {
  return STATIONS[i].passengers.filter((e): e is [string, string] => Array.isArray(e));
}

/** Passengers present at station i-1 but not at station i. */
export function leaving(i: number): string[] {
  if (i === 0) return [];
  const prev = passengerSet(i - 1);
  const cur = passengerSet(i);
  return [...prev].filter((x) => !cur.has(x));
}

/** Passengers present at both station i-1 and station i. */
export function continuing(i: number): string[] {
  if (i === 0) return [];
  const prev = passengerSet(i - 1);
  const cur = passengerSet(i);
  return [...cur].filter((x) => prev.has(x));
}
