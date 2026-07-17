import { CheckCircle2 } from "lucide-react";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { aboutHighlights, whyChoose } from "../data/siteContent.js";

export default function About() {
  return (
    <>
      <Hero
        eyebrow="About Us"
        title="Effortless travel solutions at your fingertips"
        text="From a simple idea to a growing mobility platform, BlinkRide is driven by innovation, reliability, and practical service."
        image="/assets/hero-home-alt.webp"
        primaryLabel="Explore services"
        primaryTo="/services"
        secondaryLabel="Contact us"
        secondaryTo="/contact-us"
      />

      <section className="page-section">
        <SectionHeader
          eyebrow="BlinkRide's Story"
          title="Explore our journey"
          text="We continue to evolve, improving services to deliver seamless and trusted transportation and delivery experiences."
          align="center"
        />
        <div className="about-grid">
          {aboutHighlights.map((item) => (
            <article className="about-card" key={item.title}>
              <img src={item.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{item.title}</h3>
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
            </article>
          ))}
        </div>
      </section>

      <section className="page-section muted">
        <SectionHeader eyebrow="Why BlinkRide?" title="Why choose BlinkRide?" align="center" />
        <div className="check-grid">
          {whyChoose.map((item) => (
            <div key={item}>
              <CheckCircle2 size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
