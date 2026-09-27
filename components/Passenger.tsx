import type { CSSProperties } from "react";

export type PassengerVisualState = "in" | "entering" | "leaving";

interface PassengerProps {
  name: string;
  state: PassengerVisualState;
  style?: CSSProperties;
}

/** A single skill token riding in (or leaving) the train car. */
export default function Passenger({ name, state, style }: PassengerProps) {
  const cls = state === "entering" ? "chip entering" : state === "leaving" ? "chip leaving" : "chip";
  return (
    <span className={cls} style={style}>
      {name}
    </span>
  );
}
