"use client";

import { useState } from "react";
import ProjectNode from "./ProjectNode";
import { PROJECTS } from "@/data/projects";
import { STATIONS } from "@/data/stations";

function elbowPath(x: number, y: number, bendX: number): string {
  return `M20 170 H${bendX} V${y} H${x}`;
}

export default function ProjectBranch() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const open = PROJECTS.find((p) => p.id === openId) ?? null;
  const highlighted = hoverId ?? openId;

  return (
    <section className="pg" id="projects">
      <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Branch routes — from Gononet</div>
      <h2 className="my-1.5 text-3xl font-bold tracking-tight">Projects</h2>
      <p className="mb-7 max-w-[60ch] text-mut">
        What I&rsquo;ve built outside of work. Each one branches off the current station — its position says nothing
        about when it was built.
      </p>

      <div className={`branch${hoverId ? " hover" : ""}`} role="group" aria-label="Project branch routes from Gononet">
        <svg viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
          {PROJECTS.map((p) => (
            <path
              key={p.id}
              id={`branch-path-${p.id}`}
              d={elbowPath(p.x, p.y, p.bendX)}
              className={highlighted === p.id ? "active highlighted" : ""}
            />
          ))}
        </svg>
        <div className="trunk-label font-mono text-xs uppercase tracking-[0.06em]">
          <i className="trunk-dot" aria-hidden="true" />
          GONONET
        </div>
        <div className="project-nodes">
          {PROJECTS.map((p) => (
            <ProjectNode
              key={p.id}
              project={p}
              expanded={openId === p.id}
              onSelect={() => setOpenId(p.id)}
              onHoverChange={(hovering) => setHoverId(hovering ? p.id : null)}
            />
          ))}
        </div>
      </div>

      {open && (
        <div className="detail-panel" id="project-detail">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">
              {open.flagship ? "Flagship project" : "Project"}
            </div>
            <h3>{open.name}</h3>
            <p className="role text-mut">{open.role}</p>

            <div className="browser-frame" aria-hidden="true">
              <div className="bar">
                <i />
                <i />
                <i />
                <span>{open.domain}</span>
              </div>
              <div className="stage-preview">
                <b>{open.name}</b>
                <small>{open.tag}</small>
              </div>
            </div>

            <p>{open.what}</p>
            {open.stack.length > 0 && (
              <ul className="stack-list font-mono">
                {open.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {open.capabilities.length > 0 && (
              <>
                <h4 className="mt-2.5 font-mono text-xs uppercase tracking-[0.06em] text-mut">Key capabilities</h4>
                <ul className="caps">
                  {open.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="links font-mono text-xs uppercase tracking-[0.06em]">
              {open.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </p>
          </div>
          <div>
            <div className="fit-forward">
              <b>Where it fits</b>
              <br />
              {STATIONS.slice(0, 4)
                .map((s) => s.short)
                .join(" → ")}{" "}
              → <b>{open.name}</b>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
