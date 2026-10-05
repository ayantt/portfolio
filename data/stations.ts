import type { PassengerEntry, Station } from "@/lib/types";

export const STATIONS: Station[] = [
  {
    id: "southeast",
    name: "Southeast University",
    short: "Southeast University",
    type: "Origin station",
    role: "B.Sc. in Computer Science",
    period: "2013–2018",
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
    period: "Sep 2019 — Oct 2021",
    desc: "Business systems: ERP, provident fund and accounting applications.",
    work: [
      { heading: "Systems", items: ["ERP applications", "Provident Fund systems", "Accounting applications"] },
      { heading: "Responsibilities", items: ["Fullstack development", "Complex reporting queries"] },
      { heading: "Worked with", items: ["Delta Life Insurance Ltd.", "Robi Axiata Ltd.", "Shah Cement Industries Ltd.", "GDS Chemicals Ltd.", "Elevate Global Ltd.", "National Tea Company Ltd.", "Sunlife Insurance Company Ltd."] },
    ],
    passengers: [
      ["C#", ".NET application code"],
      [".NET Framework", "ERP, Provident Fund and accounting apps"],
      ["ASP.NET Core", "Provident Fund"],
      ["SQL Server", "Database behind the ERP systems"],
      ["Oracle", "Database behind the ERP systems"],
      ["Dapper", "Data access in .NET"],
      ["Entity Framework", "Data access in .NET"],
      ["SQL", "Complex reporting queries"],
    ],
  },
  {
    id: "naas",
    name: "NAAS Solutions Ltd.",
    short: "NAAS",
    type: "Employer",
    role: "Software Engineer",
    period: "Mar 2022 — Mar 2024",
    desc: "Telecom, queueing and KPI systems.",
    note: "",
    work: [
      { heading: "Systems", items: ["Telecom Commission Generation", "Smart Queue", "Employee KPI", "Sim Registration System", "Corporate Sim Registration and Management System"] },
      { heading: "Responsibilities", items: ["Fullstack development", "Complex reporting queries", "System maintenance"] },
      { heading: "Worked with", items: ["Banglalink Digital Communications Ltd."] },
    ],
    passengers: [
      ["C#", ".NET application code"],
      [".NET Framework", "ERP, Provident Fund and accounting apps"],
      ["ASP.NET Core", "Provident Fund"],
      ["Oracle", "Database for NAAS systems"],
      ["Entity Framework", "Data access in .NET"],
      ["Reporting", "Complex reporting queries for Employee KPI system"],
      ["MySQL", "Database behind Smart Queue Management systems"],
      ["Docker", "Containerization for Smart Queue Management systems"],
      ["SQL", "Queries and schema work"],
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
      { heading: "Domains", items: ["WMS", "Purchase", "Sales", "POS", "Inventory Location"] },
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
      ["Golang", "Backend development"],
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
      "SQL",
      "Backend Development",
      "PostgreSQL",
      "Oracle",
      "MySQL",
      "SQL Server",
      "Database Optimization",
      "Entity Framework",
      "gRPC",
      "Echo",
      "Bun ORM",
      "Kafka",
      "Microservices",
    ],
  },
];

/** Passenger name regardless of whether the entry is a bare string or a [name, reason] tuple. */
export function passengerName(entry: PassengerEntry): string {
  return Array.isArray(entry) ? entry[0] : entry;
}

/** The set of passenger names present at station index i. */
export function passengerSet(i: number): Set<string> {
  return new Set(STATIONS[i].passengers.map(passengerName));
}

/** The reason shown when a passenger boards, if the entry carries one. */
export function passengerReason(name: string, i: number): string {
  const entry = STATIONS[i].passengers.find((e) => passengerName(e) === name);
  return Array.isArray(entry) ? entry[1] : "";
}

/** Passengers that board at station i (i.e. weren't present at i-1). */
export function arrivals(i: number): [string, string][] {
  if (i === 0) return STATIONS[i].passengers.map((e) => [passengerName(e), passengerReason(passengerName(e), i)]);
  const prev = passengerSet(i - 1);
  return STATIONS[i].passengers
    .filter((e) => !prev.has(passengerName(e)))
    .map((e) => [passengerName(e), passengerReason(passengerName(e), i)]);
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
