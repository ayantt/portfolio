// Shared types for the career train portfolio.

/** A passenger (skill/technology) may be a bare name (continues, no reason
 *  shown) or a [name, reason] tuple (boards here, with a short "why"). */
export type PassengerEntry = string | [name: string, reason: string];

export interface WorkGroup {
  heading: string;
  items: string[];
}

export interface StationResult {
  value: string;
  label: string;
  detail: string;
}

export interface Station {
  id: string;
  name: string;
  short: string;
  type: string;
  role: string;
  period?: string;
  desc: string;
  work: WorkGroup[];
  passengers: PassengerEntry[];
  result?: StationResult;
  /** Short railway-style annotation shown under the station label (desktop/tablet only). */
  note?: string;
  /** Marks the current/active station ("YOU ARE HERE"). */
  current?: boolean;
  /** Marks the terminus station (Future) which renders with a dashed ring. */
  future?: boolean;
}

export interface Project {
  id: string;
  flagship?: boolean;
  /** Position on the branch diagram, in SVG viewBox units (0-1000 x, 0-380 y). */
  x: number;
  y: number;
  /** X coordinate of the branch's vertical bend, for fan-out. */
  bendX: number;
  name: string;
  tag: string;
  domain: string;
  what: string;
  role: string;
  stack: string[];
  capabilities: string[];
  links: { label: string; href: string }[];
}

export interface ArchitectureBlock {
  name: string;
  callout: string;
}

export interface ArchitectureResult {
  value: string;
  label: string;
  detail: string;
}

export interface ArchitectureCardData {
  id: string;
  icon: string;
  name: string;
  tag: string;
  disclaimer?: string;
  blocks: ArchitectureBlock[];
  result?: ArchitectureResult;
  notes: string[];
}
