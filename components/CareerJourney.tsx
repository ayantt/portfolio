"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Station from "./Station";
import Train, { type TrainHandle } from "./Train";
import StationPanel from "./StationPanel";
import { STATIONS } from "@/data/stations";
import { ease, JOURNEY_ID } from "@/lib/scroll";

const MOBILE_BREAKPOINT = 760;

export default function CareerJourney() {
  const journeyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const stationRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trainRef = useRef<TrainHandle>(null);

  const posRef = useRef<{ X: number[]; Y: number[] }>({ X: [], Y: [] });
  const curRef = useRef(-1);
  const reducedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
      setReducedMotion(mq.matches);
      update();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function layout() {
    const route = routeRef.current;
    const car = trainRef.current;
    const rail = railRef.current;
    if (!route || !rail) return;

    const W = route.clientWidth;
    const H = route.clientHeight;
    // The train car's rendered size (read from the DOM node behind the imperative handle).
    const carEl = route.querySelector<HTMLDivElement>(".train-car");
    const cw = carEl?.offsetWidth ?? 300;
    const ch = carEl?.offsetHeight ?? 172;
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    const count = STATIONS.length;
    const stations = stationRefs.current;

    if (!mobile) {
      const marginLeft =
        window.innerWidth < 1100 ? parseFloat(getComputedStyle(route).marginLeft || "0") : 0;
      const a = cw / 2 + 12 - marginLeft;
      const ty = Math.max(ch + 16, (H - ch - 104) / 2 + ch + 8);
      const X = STATIONS.map((_, i) => a + (i * (W - 2 * a)) / (count - 1));
      const Y = STATIONS.map(() => ty);
      posRef.current = { X, Y };
      Object.assign(rail.style, { left: `${a}px`, top: `${ty - 2}px`, width: `${W - 2 * a}px`, height: "4px" });
      stations.forEach((el, i) => {
        if (!el) return;
        const w = Math.min(150, (W - 2 * a) / (count - 1) - 8);
        el.style.width = `${w}px`;
        el.style.left = `${X[i] - w / 2}px`;
        el.style.top = `${ty - 8}px`;
      });
    } else {
      const p = ch / 2 + 6;
      const X = STATIONS.map(() => 20);
      const Y = STATIONS.map((_, i) => p + (i * (H - 2 * p)) / (count - 1));
      posRef.current = { X, Y };
      Object.assign(rail.style, { left: "18px", top: `${p}px`, width: "4px", height: `${H - 2 * p}px` });
      stations.forEach((el, i) => {
        if (!el) return;
        el.style.width = "";
        el.style.left = "10px";
        el.style.top = `${Y[i] - 10}px`;
      });
    }
    update();
  }

  function update() {
    const journey = journeyRef.current;
    const car = trainRef.current;
    const rail = railRef.current;
    const prog = progRef.current;
    const hint = hintRef.current;
    const stage = stageRef.current;
    if (!journey || !car || !rail || !prog) return;

    const { X, Y } = posRef.current;
    if (X.length === 0) return;

    const reduced = reducedRef.current;
    const count = STATIONS.length;
    const segCount = count - 1;
    const top = journey.offsetTop;
    const total = journey.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, (window.scrollY - top) / total));
    const t = p * segCount;
    const seg = Math.min(segCount - 1, Math.floor(t));
    const f = t - seg;

    const idx: number | null = reduced ? (f < 0.5 ? seg : seg + 1) : f < 0.3 ? seg : f > 0.7 ? seg + 1 : null;
    const pos = reduced ? (idx as number) : seg + ease(Math.min(1, Math.max(0, (f - 0.3) / 0.4)));
    const i = Math.floor(Math.min(pos, segCount - 0.001));
    const k = pos - i;

    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    const carEl = routeRef.current?.querySelector<HTMLDivElement>(".train-car");
    const cw = carEl?.offsetWidth ?? 300;
    const ch = carEl?.offsetHeight ?? 172;
    const cx = X[i] + (X[i + 1] - X[i]) * k;
    const cy = Y[i] + (Y[i + 1] - Y[i]) * k;

    if (!mobile) {
      car.setPosition(cx - cw / 2, Y[0] - ch - 8);
      Object.assign(prog.style, { left: `${X[0]}px`, top: `${Y[0] - 2}px`, width: `${cx - X[0]}px`, height: "4px" });
    } else {
      car.setPosition(116, cy - ch / 2);
      Object.assign(prog.style, { left: "18px", top: `${Y[0]}px`, width: "4px", height: `${cy - Y[0]}px` });
    }

    car.setOpen(idx !== null);
    car.setStopped(idx !== null);
    car.setStatus(
      idx !== null
        ? `At ${STATIONS[idx].short}`
        : k < 0.15
        ? `Departing ${STATIONS[i].short}`
        : k > 0.85
        ? `Now arriving — ${STATIONS[i + 1].short}`
        : "In transit"
    );
    stage?.classList.toggle("moving", idx === null);
    if (hint) hint.style.opacity = pos < 0.05 ? "1" : "0";

    if (idx !== null && idx !== curRef.current) {
      curRef.current = idx;
      setActiveIndex(idx);
    }
  }

  useEffect(() => {
    layout();
    const route = routeRef.current;
    const ro = route ? new ResizeObserver(() => layout()) : null;
    if (route && ro) ro.observe(route);

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => layout()).catch(() => {});
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shownIndex = Math.max(activeIndex, 0);

  return (
    <section id={JOURNEY_ID} ref={journeyRef} className="h-[500vh]">
      <div className="stage" id="stage" ref={stageRef}>
        <Header activeIndex={activeIndex} />

        <div className="route" ref={routeRef}>
          <div className="rail" ref={railRef} />
          <div className="prog" ref={progRef} />

          {STATIONS.map((s, i) => (
            <Station
              key={s.id}
              station={s}
              index={i}
              visited={i <= activeIndex}
              active={i === activeIndex}
              innerRef={(el) => {
                stationRefs.current[i] = el;
              }}
            />
          ))}

          <Train ref={trainRef} stationIndex={shownIndex} reducedMotion={reducedMotion} />

          <div ref={hintRef} className="hint font-mono text-xs uppercase tracking-[0.06em] text-mut">
            Scroll to depart ↓
          </div>
        </div>

        <StationPanel index={shownIndex} />
      </div>
    </section>
  );
}
