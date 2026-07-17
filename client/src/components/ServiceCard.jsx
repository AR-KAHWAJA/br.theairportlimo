import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <img src={service.image} alt="" loading="lazy" decoding="async" />
      <div className="card-body">
        <p className="eyebrow">{service.label}</p>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className="tag-row">
          {service.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link className="text-link" to="/get-the-app">
          Get started <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
