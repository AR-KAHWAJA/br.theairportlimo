import { ShieldCheck } from "lucide-react";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { fleetVehicles, stats } from "../data/siteContent.js";

export default function Fleet() {
  return (
    <>
      <Hero
        eyebrow="Fleet"
        title="Experience our premium fleet services"
        text="Explore vehicles tailored for personal rides, airport transfers, corporate mobility, family travel, and delivery operations."
        image="/assets/hero-fleet.webp"
        primaryLabel="Book a ride"
        primaryTo="/services#service-booking"
        secondaryLabel="Contact us"
        secondaryTo="/contact-us"
      />

      <section className="stats-band fleet-stats">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Our Vehicles"
          title="Explore our vehicle collection"
          text="From compact city rides to premium SUVs, BlinkRide vehicle options are organized for comfort, reliability, and convenience."
          align="center"
        />
        <div className="fleet-grid">
          {fleetVehicles.map((vehicle) => (
            <article className="fleet-card" key={vehicle.name}>
              <img src={vehicle.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{vehicle.name}</h3>
                <p>{vehicle.description}</p>
                <div className="tag-row">
                  {vehicle.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section muted">
        <SectionHeader eyebrow="Fleet Services" title="Designed for every situation" align="center" />
        <div className="check-grid">
          {[
            "Personal rides and family travel",
            "Airport pickup and drop-off",
            "Corporate transportation",
            "Package and food delivery support",
            "Well-maintained vehicles",
            "Comfort-focused service standards"
          ].map((item) => (
            <div key={item}>
              <ShieldCheck size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
