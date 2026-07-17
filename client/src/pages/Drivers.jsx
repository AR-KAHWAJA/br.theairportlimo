import Hero from "../components/Hero.jsx";
import { AppLeadForm } from "../components/LeadForms.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SplitSection from "../components/SplitSection.jsx";
import { driverSections } from "../data/siteContent.js";

export default function Drivers() {
  return (
    <>
      <Hero
        eyebrow="Driver"
        title="Experience seamless driving with us"
        text="Earn through rides, food delivery, parcel delivery, airport pickups, and scheduled transportation with flexible opportunities."
        image="/assets/hero-drivers.webp"
        primaryLabel="Get the Driver App"
        primaryTo="#driver-app"
        secondaryLabel="See opportunities"
        secondaryTo="#driver-opportunities"
      />

      <section id="driver-opportunities" className="page-section">
        <SectionHeader
          eyebrow="Drive Beyond Limits"
          title="Flexible earning opportunities"
          text="The driver page has been reorganized into clear earning paths while keeping the WordPress message and service mix intact."
          align="center"
        />
      </section>

      {driverSections.map((item, index) => (
        <SplitSection key={item.title} item={item} reverse={index % 2 === 1} />
      ))}

      <section id="driver-app" className="page-section muted">
        <div className="app-download-layout">
          <div>
            <p className="eyebrow">Driver App</p>
            <h2>Manage trips, earnings, and requests</h2>
            <p>
              Driver app leads are captured by the MERN API. Connect the production app links when
              the mobile stores are ready.
            </p>
            <AppLeadForm role="driver" />
          </div>
          <img src="/assets/app-driver.webp" alt="BlinkRide driver app screen" loading="lazy" decoding="async" />
        </div>
      </section>
    </>
  );
}
