import type { ArchitectureCardData } from "@/lib/types";

interface ArchitectureCardProps {
  data: ArchitectureCardData;
  expanded: boolean;
  onSelect: () => void;
}

/**
 * Small blueprint-style line icons, keyed by ArchitectureCardData.icon.
 * Drawn inline (not a Unicode glyph) so they render identically everywhere —
 * the previous APL-symbol glyphs (⌷ ⌸ ⌗) silently fell back to tofu boxes on
 * fonts that don't carry them.
 */
const ICONS: Record<string, JSX.Element> = {
  // Workflow: three sequential stages linked by a line (FlowDocs).
  flow: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="6" height="6" rx="1" />
      <rect x="9.5" y="14" width="6" height="6" rx="1" />
      <rect x="16" y="4" width="5" height="6" rx="1" />
      <path d="M9 7h7.5M12.5 10v4" strokeLinecap="round" />
    </svg>
  ),
  // Gateway/mesh: a central hub with services around it (ERP services).
  erp: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4" cy="5" r="2" />
      <circle cx="20" cy="5" r="2" />
      <circle cx="4" cy="19" r="2" />
      <circle cx="20" cy="19" r="2" />
      <path d="M6 6.3 10 10M18 6.3 14 10M6 17.7 10 14M18 17.7 14 14" strokeLinecap="round" />
    </svg>
  ),
  // Database cylinder (indexing / query performance).
  db: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5V18c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" />
      <path d="M4 11.75c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
};

export default function ArchitectureCard({ data, expanded, onSelect }: ArchitectureCardProps) {
  return (
    <button
      type="button"
      id={`arch-card-${data.id}`}
      className="arch-card"
      aria-expanded={expanded}
      aria-controls="architecture-detail"
      onClick={onSelect}
    >
      <span className="icon" aria-hidden="true">
        {ICONS[data.icon]}
      </span>
      <b>{data.name}</b>
      <span>{data.tag}</span>
    </button>
  );
}
