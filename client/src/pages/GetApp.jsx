import { ArrowRight, CarFront, Smartphone, UserRoundCheck } from "lucide-react";
import Hero from "../components/Hero.jsx";
import { AppLeadForm } from "../components/LeadForms.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function GetApp() {
  return (
    <>
      <Hero
        eyebrow="Get the App"
        title="Ride smart. Drive better."
        text="Use BlinkRide as a customer or driver. Capture app-interest leads now and attach live App Store / Play Store links when they are available."
        image="/assets/hero-app.webp"
        heroPosition="center calc(50% + 58px)"
        primaryLabel="Customer App"
        primaryTo="#customer-app"
        secondaryLabel="Driver App"
        secondaryTo="#driver-app"
      />

      <section className="page-section">
        <SectionHeader
          eyebrow="Get the App"
          title="Ride or drive with BlinkRide anytime"
          text="The original page included customer and driver app calls to action. This version turns those calls to action into useful lead forms."
          align="center"
        />
        <div className="app-card-grid">
          <article id="customer-app" className="app-card">
            <img src="/assets/app-customer.webp" alt="BlinkRide customer app screen" loading="lazy" decoding="async" />
            <div>
              <span className="app-icon">
                <Smartphone size={20} />
              </span>
              <h3>Download the Customer App</h3>
              <p>
                Book premium rides, track your driver in real time, manage reservations, and enjoy
                a smooth travel experience.
              </p>
              <a className="button ghost-dark" href="#app-interest">
                Get the App <ArrowRight size={17} />
              </a>
            </div>
          </article>

          <article id="driver-app" className="app-card">
            <img src="/assets/app-driver.webp" alt="BlinkRide driver app screen" loading="lazy" decoding="async" />
            <div>
              <span className="app-icon">
                <CarFront size={20} />
              </span>
              <h3>Download the Driver App</h3>
              <p>
                Accept ride requests, manage trips, track earnings, and stay connected with
                passengers through the BlinkRide Driver App.
              </p>
              <a className="button ghost-dark" href="#app-interest">
                Drive with BlinkRide <ArrowRight size={17} />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="app-interest" className="page-section muted">
        <div className="app-download-layout">
          <div>
            <p className="eyebrow">App Access</p>
            <h2>Tell us which app you need</h2>
            <p>
              This MERN version can store customer and driver app-interest leads in MongoDB as soon
              as your production connection string is configured.
            </p>
            <div className="mini-feature">
              <UserRoundCheck size={20} />
              <span>Customer and driver leads are separated by role.</span>
            </div>
          </div>
          <AppLeadForm role="customer" />
        </div>
      </section>
    </>
  );
}
