import type { Project } from "@/lib/types";

interface ProjectNodeProps {
  project: Project;
  expanded: boolean;
  onSelect: () => void;
  onHoverChange: (hovering: boolean) => void;
}

export default function ProjectNode({ project, expanded, onSelect, onHoverChange }: ProjectNodeProps) {
  return (
    <button
      type="button"
      id={`project-node-${project.id}`}
      className={`project-node${project.flagship ? " flagship" : ""}`}
      style={{ left: `${project.x / 10}%`, top: `${(project.y / 380) * 100}%` }}
      aria-expanded={expanded}
      aria-controls="project-detail"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
    >
      <span className="node-dot" aria-hidden="true" />
      <b>{project.name}</b>
      <small>
        {project.flagship ? "Flagship · " : ""}
        {project.tag}
      </small>
    </button>
  );
}
