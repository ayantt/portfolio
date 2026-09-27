"use client";

import { useEffect, useState } from "react";
import { STATIONS } from "@/data/stations";
import { scrollToStation, prefersReducedMotion } from "@/lib/scroll";

interface HeaderProps {
  activeIndex: number;
}

export default function Header({ activeIndex }: HeaderProps) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Dhaka",
          }).format(new Date()) + " · Dhaka time"
        );
      } catch {
        /* Intl/timeZone unsupported — leave clock blank rather than throw. */
      }
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const go = (i: number) => scrollToStation(i, STATIONS.length, prefersReducedMotion());

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 md:px-12">
        <h1 className="m-0 text-xl leading-tight tracking-tight sm:text-2xl">
          TASNIF TAUSSUK
          <small className="mt-1 block text-[13px] font-normal text-mut">
            Software Engineer · Backend &amp; Database · Dhaka
          </small>
        </h1>
        <nav aria-label="Journey stations" className="flex flex-wrap items-center gap-1 sm:gap-4">
          {STATIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`nav-link${i === activeIndex ? " current" : ""}`}
              aria-label={`Go to station ${i + 1}: ${s.name}`}
              onClick={() => go(i)}
            >
              <span className="sm:hidden">{i + 1}</span>
              <span className="hidden sm:inline">{s.short}</span>
            </button>
          ))}
          <a href="#projects" className="nav-link">
            <span className="hidden sm:inline">Projects</span>
            <span className="sm:hidden">P</span>
          </a>
          <a href="#architecture" className="nav-link">
            <span className="hidden sm:inline">Architecture</span>
            <span className="sm:hidden">A</span>
          </a>
          <a
            className="cv-link"
            href="https://ayantt.dev/Tasnif_Taussuk_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume in a new tab"
          >
            CV
          </a>
        </nav>
      </header>
      <div className="legend-bar flex flex-wrap items-baseline gap-x-6 gap-y-1 px-4 pb-2 font-mono text-xs uppercase tracking-[0.06em] text-mut sm:px-6 md:px-12">
        <span className="now-legend legend-train" />
        <span>Train = career</span>
        <span className="now-legend legend-station" />
        <span>Station = stage</span>
        <span className="now-legend legend-pax" />
        <span>Passenger = skill</span>
        <span className="ml-auto text-mut">{clock}</span>
      </div>
    </>
  );
}
