import { Download, MapPinned, Route, Smile } from "lucide-react";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { ReservationForm } from "../components/LeadForms.jsx";
import { services, startSteps, whyChoose } from "../data/siteContent.js";

const stepIcons = [Download, MapPinned, Route, Smile];

export default function Services() {
  return (
    <>
      <Hero
        eyebrow="Services"
        title="One app, all travel needs"
        text="Book one-way trips, round trips, hourly rides, airport pickups, packages, and food delivery through one connected mobility platform."
        image="/assets/hero-services.webp"
        primaryLabel="Get started"
        primaryTo="#services-list"
        secondaryLabel="Reserve a ride"
        secondaryTo="#service-booking"
      />

      <section id="services-list" className="page-section">
        <SectionHeader
          eyebrow="All services"
          title="Choose the right service for the moment"
          text="The service lineup mirrors the WordPress page while making every option scannable and ready for booking."
          align="center"
        />
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="page-section muted">
        <SectionHeader eyebrow="Get started" title="How to get started" align="center" />
        <div className="steps-grid">
          {startSteps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <div className="step-card" key={step.title}>
                <span>{index + 1}</span>
                <Icon size={24} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-section">
        <div className="service-booking" id="service-booking">
          <div>
            <p className="eyebrow">On-time</p>
            <h2>Reserve the service you need</h2>
            <p>
              Use the MERN backend to collect reservation requests now, then connect the production
              booking engine when your app APIs are ready.
            </p>
            <ul className="plain-list">
              {whyChoose.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <ReservationForm />
        </div>
      </section>
    </>
  );
}
