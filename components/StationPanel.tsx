import { STATIONS, arrivals, continuing, leaving, passengerSet } from "@/data/stations";

interface StationPanelProps {
  index: number;
}

export default function StationPanel({ index }: StationPanelProps) {
  const s = STATIONS[index];
  const boarding = arrivals(index);
  const cont = continuing(index);
  const exiting = leaving(index);
  const current = passengerSet(index);
  const next = STATIONS[index + 1] && !STATIONS[index + 1].future ? [...current].filter((x) => passengerSet(index + 1).has(x)) : [];

  return (
    <div className="station-panel" aria-live="polite">
      <div className="col-identity">
        <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">
          {s.type} · {index + 1}/{STATIONS.length}
        </div>
        <h2>{s.name}</h2>
        <p className="role text-mut">
          {s.role}
          {s.period && (
            <>
              {" · "}
              <span className="font-mono text-xs uppercase tracking-[0.06em]">{s.period}</span>
            </>
          )}
        </p>
        <p className="text-sm">{s.desc}</p>
        {s.result && (
          <div className="result-block">
            <b>{s.result.value}</b> <span>{s.result.label}</span>
            <small>{s.result.detail}</small>
          </div>
        )}
      </div>

      <div className="col-work">
        {s.work.map((group) => (
          <div className="g" key={group.heading}>
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-mut">{group.heading}</h3>
            <p className="text-sm">{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>

      <div className="col-passengers">
        {s.future ? (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Carried into the unknown</h3>
            <PassengerStateRow label="On board" cls="continuing" prefix="" names={[...current]} />
          </>
        ) : (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Passengers at {s.short}</h3>
            {index === 0 && <p className="text-mut">None yet. The train is waiting.</p>}
            {boarding.length > 0 && (
              <PassengerStateRow label="Boarding" cls="boarding" prefix="+ " names={boarding.map(([n]) => n)} />
            )}
            {cont.length > 0 && <PassengerStateRow label="Continuing" cls="continuing" prefix="= " names={cont} />}
            {exiting.length > 0 && <PassengerStateRow label="Exiting" cls="exiting" prefix="− " names={exiting} />}
            {boarding.length > 0 && (
              <ul className="why-list">
                {boarding.map(([n, why]) => (
                  <li key={n}>
                    <b>{n}</b> <span>{why}</span>
                  </li>
                ))}
              </ul>
            )}
            {next.length > 0 && (
              <p className="fit-forward text-mut">
                Carries forward to {STATIONS[index + 1].short}: {next.join(", ")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PassengerStateRow({
  label,
  cls,
  prefix,
  names,
}: {
  label: string;
  cls: string;
  prefix: string;
  names: string[];
}) {
  return (
    <div className="pax-state-row">
      <span className="font-mono text-xs uppercase tracking-[0.06em] text-mut">{label}</span>
      <div className="inline">
        {names.map((n) => (
          <span key={n} className={`pax-pill ${cls}`}>
            {prefix}
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
