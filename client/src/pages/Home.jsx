import { ArrowRight, CalendarCheck2, ShieldCheck, Smartphone, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import { ReservationForm } from "../components/LeadForms.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import SplitSection from "../components/SplitSection.jsx";
import { audiences, customerSections, services, stats, whyChoose } from "../data/siteContent.js";

export default function Home() {
  return (
    <>
      <Hero
        className="home-hero"
        eyebrow="Smart Rides. Fast Delivery. Trusted Mobility."
        title="Start your journey with BlinkRide"
        text="Book rides, schedule airport transfers, send packages, order food, or drive with a platform built around safety and reliability."
        image="/assets/generated-home-hero.webp"
        heroPosition="58% center"
        primaryLabel="Get the App"
        primaryTo="/get-the-app"
        secondaryLabel="Book now"
        secondaryTo="#booking"
      >
        <div id="booking" className="hero-panel">
          <ReservationForm compact />
        </div>
      </Hero>

      <section className="stats-band">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="For every customer"
          title="Transportation and delivery that fits the day"
          text="The original WordPress homepage highlights business, family, package, food, and kids travel. This MERN version keeps the same service paths in a cleaner, faster interface."
          align="center"
        />
        <div className="audience-grid">
          {audiences.map((audience) => (
            <Link className="image-card" to={audience.href} key={audience.title}>
              <img src={audience.image} alt="" loading="lazy" decoding="async" />
              <div>
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
                <span>
                  Learn more <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section muted">
        <SectionHeader
          eyebrow="Services"
          title="One app, all your transportation needs"
          text="From one-way trips to food delivery, BlinkRide groups everyday mobility into a single customer experience."
          align="center"
        />
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <SplitSection
        item={{
          eyebrow: "Customer",
          title: "Where safety leads",
          description:
            "Safety is non-negotiable. Verified drivers, live trip tracking, emergency support, and transparent updates help riders move with confidence.",
          image: "/assets/generated-customer-safety.webp",
          bullets: ["Verified drivers with background checks", "Real-time trip tracking", "Support when you need it"]
        }}
      />

      <section className="page-section">
        <div className="benefits-layout">
          <div>
            <p className="eyebrow">Benefits</p>
            <h2>Book now or plan ahead</h2>
            <p>
              Choose pickup times, manage scheduled trips, and use the same trusted driver network
              for rides, airport service, packages, food, and business transport.
            </p>
          </div>
          <div className="benefit-grid">
            <div>
              <CalendarCheck2 />
              <h3>Advance pickup</h3>
              <p>Schedule rides up to 90 days ahead for meetings, flights, and events.</p>
            </div>
            <div>
              <Timer />
              <h3>Extra wait time</h3>
              <p>Reservations are designed with practical pickup windows and support.</p>
            </div>
            <div>
              <ShieldCheck />
              <h3>Reliable standards</h3>
              <p>Drivers, vehicles, and routes are managed for a safer experience.</p>
            </div>
            <div>
              <Smartphone />
              <h3>One app</h3>
              <p>Book rides, deliveries, airport trips, and more from a single account.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section muted">
        <SectionHeader eyebrow="Why choose us?" title="Simple, safe, and dependable" align="center" />
        <div className="check-grid">
          {whyChoose.map((item) => (
            <div key={item}>
              <ShieldCheck size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <SplitSection item={customerSections[5]} reverse />
    </>
  );
}
