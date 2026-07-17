import { CheckCircle2 } from "lucide-react";

export default function SplitSection({ item, reverse = false }) {
  return (
    <section id={item.id} className={`split-section ${reverse ? "reverse" : ""}`}>
      <div className="split-media">
        <img src={item.image} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="split-copy">
        <p className="eyebrow">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <ul className="check-list">
          {item.bullets.map((bullet) => (
            <li key={bullet}>
              <CheckCircle2 size={18} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
