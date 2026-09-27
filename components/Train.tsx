"use client";

import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef } from "react";
import Passenger, { type PassengerVisualState } from "./Passenger";
import { STATIONS, arrivals, passengerSet } from "@/data/stations";

export interface TrainHandle {
  /** Position the car in the route's coordinate space (imperative — called every animation frame). */
  setPosition(x: number, y: number): void;
  /** Toggle the door-open visual (discrete — only changes at transit-state boundaries). */
  setOpen(open: boolean): void;
  /** Update the one-line status ("At Gononet", "In transit", ...). */
  setStatus(text: string): void;
  /** Red while moving, green while stopped at a station. */
  setStopped(stopped: boolean): void;
}

interface TrainProps {
  /** Index of the station the train currently treats as "arrived" (drives passenger boarding/exiting). */
  stationIndex: number;
  reducedMotion: boolean;
}

const REMOVE_DELAY_MS = 460;
const STAGGER_MS = 45;
const STAGGER_BASE_MS = 60;

const Train = forwardRef<TrainHandle, TrainProps>(function Train({ stationIndex, reducedMotion }, ref) {
  const carRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLElement>(null);
  const signalRef = useRef<HTMLElement>(null);

  const shown = useRef<Map<string, PassengerVisualState>>(new Map());
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [, forceTick] = useReducer((x: number) => x + 1, 0);

  useImperativeHandle(ref, () => ({
    setPosition(x, y) {
      if (carRef.current) carRef.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    setOpen(open) {
      carRef.current?.classList.toggle("open", open);
    },
    setStatus(text) {
      if (statusRef.current) statusRef.current.textContent = text;
    },
    setStopped(stopped) {
      signalRef.current?.classList.toggle("stopped", stopped);
    },
  }));

  useEffect(() => {
    const want = passengerSet(stationIndex);
    const boarding = new Set(arrivals(stationIndex).map(([n]) => n));
    const map = shown.current;

    want.forEach((name) => {
      const t = timeouts.current.get(name);
      if (t) {
        clearTimeout(t);
        timeouts.current.delete(name);
      }
    });

    map.forEach((state, name) => {
      if (!want.has(name) && state !== "leaving") {
        map.set(name, "leaving");
        const t = setTimeout(
          () => {
            map.delete(name);
            timeouts.current.delete(name);
            forceTick();
          },
          reducedMotion ? 0 : REMOVE_DELAY_MS
        );
        timeouts.current.set(name, t);
      }
    });

    want.forEach((name) => {
      map.set(name, boarding.has(name) ? "entering" : "in");
    });

    forceTick();
    // Re-run whenever the arrived-at station changes; reducedMotion only affects timing, read fresh each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationIndex]);

  useEffect(() => {
    const t = timeouts.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);

  const list = Array.from(shown.current, ([name, state]) => ({ name, state }));
  const boardingOrder = arrivals(stationIndex).map(([n]) => n);
  const onBoard = passengerSet(stationIndex).size;

  return (
    <div ref={carRef} className="train-car" role="img" aria-label="Career train with skills on board">
      <div className="train-head">
        <i ref={signalRef} className="signal" aria-hidden="true" />
        <b ref={statusRef}>Career train</b>
        <span className="count">{onBoard} on board</span>
      </div>
      <div className="pax-row">
        {onBoard === 0 && <div className="empty-note">Waiting at the platform</div>}
        {list.map(({ name, state }) => {
          const delayIndex = boardingOrder.indexOf(name);
          const style =
            state === "entering" && delayIndex >= 0 && !reducedMotion
              ? { animationDelay: `${delayIndex * STAGGER_MS + STAGGER_BASE_MS}ms` }
              : undefined;
          return <Passenger key={name} name={name} state={state} style={style} />;
        })}
      </div>
      <div className="doors" aria-hidden="true">
        <i />
        <i />
      </div>
    </div>
  );
});

export default Train;

/** Total number of stations — used by the parent to compute route segments. */
export const STATION_COUNT = STATIONS.length;
