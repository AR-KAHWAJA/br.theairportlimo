import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SplitSection from "../components/SplitSection.jsx";
import { customerSections } from "../data/siteContent.js";

export default function Customers() {
  return (
    <>
      <Hero
        eyebrow="Exceptional Services"
        title="Every customer, every ride"
        text="BlinkRide brings everyday rides, round trips, hourly travel, airport pickups, food, and parcel delivery into one safety-first experience."
        image="/assets/hero-customers.webp"
        primaryLabel="Get the App"
        primaryTo="/get-the-app"
        secondaryLabel="Explore services"
        secondaryTo="#customer-services"
      />

      <section id="customer-services" className="page-section">
        <SectionHeader
          eyebrow="Customers"
          title="Built on safety, transparency, and reliability"
          text="Each section below carries over the original customer page structure with clearer hierarchy and responsive content."
          align="center"
        />
      </section>

      {customerSections.map((item, index) => (
        <SplitSection key={item.id || item.title} item={item} reverse={index % 2 === 1} />
      ))}
    </>
  );
}
