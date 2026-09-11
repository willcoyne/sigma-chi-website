import Reveal from "./Reveal";
import type { TimelineEntry } from "../data/content";
import "./Timeline.css";

export default function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {items.map((item, i) => (
        <li key={item.year} className="timeline__item">
          <Reveal delay={i * 0.05} y={16}>
            <div className="timeline__marker" aria-hidden="true" />
            <p className="timeline__year">{item.year}</p>
            <h3>{item.heading}</h3>
            <p className="timeline__body">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
