import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { contactInfo, navItems, services } from "../data/siteContent.js";

const footerLogoSrc = "/assets/blinkride-logo.webp";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="footer-logo-link" to="/" aria-label="BlinkRide home">
            <img
              className="footer-brand-logo"
              src={footerLogoSrc}
              alt="BlinkRide"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p>
            Smart rides, fast delivery, airport transfers, and partner mobility programs built for
            safety, transparency, and dependable service.
          </p>
          <Link className="footer-cta" to="/get-the-app">
            Ride or drive with us <ArrowRight size={16} />
          </Link>
        </div>

        <div>
          <h2>Pages</h2>
          <ul>
            {navItems.slice(1).map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Services</h2>
          <ul>
            {services.slice(0, 6).map((service) => (
              <li key={service.title}>
                <Link to="/services">{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Contact</h2>
          <ul className="contact-list">
            <li>
              <Mail size={16} />
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </li>
            <li>
              <Phone size={16} />
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>{contactInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} BlinkRide.</span>
      </div>
    </footer>
  );
}
