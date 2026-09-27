import type { ArchitectureCardData } from "@/lib/types";

interface ArchitectureCardProps {
  data: ArchitectureCardData;
  expanded: boolean;
  onSelect: () => void;
}

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
        {data.icon}
      </span>
      <b>{data.name}</b>
      <span>{data.tag}</span>
    </button>
  );
}
