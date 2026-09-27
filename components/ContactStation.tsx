import { CONTACT } from "@/data/contact";

export default function ContactStation() {
  return (
    <section className="pg final" id="contact">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.06em] text-mut">Final stop</div>
          <h2 className="my-2 text-[clamp(30px,5vw,52px)] font-bold leading-none tracking-tight">
            Let&rsquo;s build something
          </h2>
          <div className="text-mut">{CONTACT.location}</div>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-mono text-xs uppercase tracking-[0.06em]">
        {CONTACT.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="underline decoration-fg underline-offset-2">
              {l.label}
            </a>
          </li>
        ))}
        <li title="Resume will be available here.">
          <a
            href={CONTACT.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume in a new tab"
            className="underline decoration-fg underline-offset-2"
          >
            Resume
          </a>
        </li>
      </ul>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.06em] text-mut">{CONTACT.closingLine}</p>
    </section>
  );
}
