"use client";

import { Fragment, useState } from "react";
import ArchitectureCard from "./ArchitectureCard";
import { ARCHITECTURE } from "@/data/architecture";

export default function ArchitectureGallery() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ARCHITECTURE.find((a) => a.id === openId) ?? null;
  const flow = open ? open.blocks.map((b) => b.name).join(" → ") : "";

  return (
    <section className="pg" id="architecture">
      <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Control room</div>
      <h2 className="my-1.5 text-3xl font-bold tracking-tight">Architecture</h2>
      <p className="mb-7 max-w-[60ch] text-mut">
        How the pieces connect — conceptual views, not confidential production diagrams.
      </p>

      <div className="arch-grid">
        {ARCHITECTURE.map((a) => (
          <ArchitectureCard key={a.id} data={a} expanded={openId === a.id} onSelect={() => setOpenId(a.id)} />
        ))}
      </div>

      {open && (
        <div className={`arch-detail${openId ? " open" : ""}`} id="architecture-detail">
          <div className="ahead">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Architecture</div>
              <h3>{open.name}</h3>
            </div>
            {open.disclaimer && <p className="disclaimer">{open.disclaimer}</p>}
          </div>

          <div className="arch-diagram">
            <ul className="arch-rail" aria-label={`Flow: ${flow}`}>
              {open.blocks.map((b, i) => (
                <Fragment key={b.name}>
                  <li className="arch-block">
                    <i aria-hidden="true" />
                    <span className="box">{b.name}</span>
                    <span className="callout">{b.callout}</span>
                  </li>
                  {i < open.blocks.length - 1 && (
                    <li className="arch-arrow" aria-hidden="true">
                      ↓
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>
            {open.result && (
              <div className="result-block" style={{ marginTop: 4 }}>
                <b>{open.result.value}</b> <span>{open.result.label}</span>
                <small>{open.result.detail}</small>
              </div>
            )}
          </div>

          <div className="arch-notes">
            <h4 className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Engineering notes</h4>
            <ul>
              {open.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
