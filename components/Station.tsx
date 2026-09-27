import type { CSSProperties } from "react";
import type { Station as StationData } from "@/lib/types";

interface StationProps {
  station: StationData;
  index: number;
  visited: boolean;
  active: boolean;
  style?: CSSProperties;
  /** Imperative ref hook so the parent (CareerJourney) can read layout without re-rendering. */
  innerRef?: (el: HTMLButtonElement | null) => void;
}

export default function Station({ station, visited, active, style, innerRef }: StationProps) {
  const classes = [
    "station-btn",
    visited ? "visited" : "",
    active ? "active" : "",
    station.future ? "future" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={innerRef}
      type="button"
      tabIndex={-1}
      className={classes}
      style={style}
      aria-label={`${station.name}${station.current ? ". Current station" : ""}`}
    >
      <i className="station-dot" aria-hidden="true" />
      <span>
        <b className="label-name">
          {station.short}
          {station.current && <span className="now-tag">◉ current</span>}
        </b>
        <small className="label-period">{station.role}</small>
        <small className="label-period">{station.period}</small>
        {station.note && <em className="label-note">{station.note}</em>}
      </span>
    </button>
  );
}
