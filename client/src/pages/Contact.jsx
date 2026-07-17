import { Mail, MapPin, Phone } from "lucide-react";
import Hero from "../components/Hero.jsx";
import { ContactForm } from "../components/LeadForms.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { contactInfo, faqItems } from "../data/siteContent.js";

export default function Contact() {
  return (
    <>
      <Hero
        eyebrow="Contact Us"
        title="We are here to help"
        text="Reach the BlinkRide team for customer support, business inquiries, app questions, billing help, feedback, and partnership requests."
        image="/assets/hero-contact.webp"
        primaryLabel="Send a message"
        primaryTo="#contact-form"
        secondaryLabel="FAQs"
        secondaryTo="#faqs"
      />

      <section className="page-section">
        <div className="contact-layout">
          <div>
            <SectionHeader
              eyebrow="Get in Touch"
              title="Discover support for rides, deliveries, and partnerships"
              text="Use the contact details or submit the form. Messages are handled by the MERN API and can be stored in MongoDB."
            />
            <div className="contact-methods">
              <div>
                <Mail />
                <h3>Email Us</h3>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </div>
              <div>
                <Phone />
                <h3>Call Us</h3>
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </div>
              <div>
                <MapPin />
                <h3>Our Office</h3>
                <p>{contactInfo.address}</p>
              </div>
            </div>
          </div>
          <div id="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>

      <section id="faqs" className="page-section muted">
        <SectionHeader
          eyebrow="FAQs"
          title="Frequently asked questions"
          text="Common questions from the WordPress contact page, kept in a fast React layout."
          align="center"
        />
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
