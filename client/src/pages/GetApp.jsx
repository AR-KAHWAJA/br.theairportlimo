import { ArrowRight, CarFront, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";

export default function GetApp() {
  return (
    <>
      <Hero
        eyebrow="Get the App"
        title="Ride smart. Drive better."
        text="Use BlinkRide as a customer or driver with simple access paths for rides, deliveries, airport trips, and driver opportunities."
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
          text="Choose the customer app experience for bookings or the driver app path for earning with BlinkRide."
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
              <Link className="button ghost-dark" to="/contact">
                Get the App <ArrowRight size={17} />
              </Link>
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
              <Link className="button ghost-dark" to="/contact">
                Drive with BlinkRide <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
