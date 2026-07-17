import Hero from "../components/Hero.jsx";
import { ContactForm } from "../components/LeadForms.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SplitSection from "../components/SplitSection.jsx";
import { affiliateSections } from "../data/siteContent.js";

export default function Affiliates() {
  return (
    <>
      <Hero
        eyebrow="Affiliate Program"
        title="Join our affiliate program"
        text="Connect trusted fleets and regional partners to BlinkRide's growing transportation and delivery network."
        image="/assets/hero-affiliates.webp"
        primaryLabel="Become a partner"
        primaryTo="#partner-form"
        secondaryLabel="Discover more"
        secondaryTo="#affiliate-program"
      />

      <section id="affiliate-program" className="page-section">
        <SectionHeader
          eyebrow="Global"
          title="Expanding mobility through trusted partners"
          text="Affiliate partners help BlinkRide serve more customers with transparent quality standards, tracking, and shared support."
          align="center"
        />
      </section>

      {affiliateSections.map((item, index) => (
        <SplitSection key={item.title} item={item} reverse={index % 2 === 1} />
      ))}

      <section id="partner-form" className="page-section muted">
        <div className="service-booking">
          <div>
            <p className="eyebrow">Partner with BlinkRide</p>
            <h2>Bring your fleet into the network</h2>
            <p>
              Use this form for affiliate inquiries, fleet partnership requests, and business
              expansion conversations.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
