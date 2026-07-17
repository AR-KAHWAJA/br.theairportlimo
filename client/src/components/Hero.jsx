import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero({
  eyebrow,
  title,
  text,
  image,
  heroPosition,
  primaryLabel = "Get the App",
  primaryTo = "/get-the-app",
  secondaryLabel,
  secondaryTo,
  children
}) {
  return (
    <section
      className="hero"
      style={{
        "--hero-image": `url(${image})`,
        "--hero-position": heroPosition
      }}
    >
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          {eyebrow && <p className="eyebrow light">{eyebrow}</p>}
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="hero-actions">
            {primaryLabel && (
              <Link className="button primary" to={primaryTo}>
                {primaryLabel} <ArrowRight size={18} />
              </Link>
            )}
            {secondaryLabel && (
              <Link className="button ghost" to={secondaryTo}>
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
