import { CalendarClock, Mail, Send } from "lucide-react";
import { useState } from "react";
import { postLead } from "../utils/api.js";

const initialReservation = {
  fullName: "",
  email: "",
  phone: "",
  service: "One-Way Trips",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  notes: ""
};

const initialInquiry = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "General Inquiry",
  message: ""
};

const initialAppLead = {
  role: "customer",
  fullName: "",
  email: "",
  phone: ""
};

function useLeadForm(initialState, endpoint) {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus({ state: "loading", message: "Sending..." });

    try {
      const result = await postLead(endpoint, values);
      setStatus({
        state: "success",
        message:
          result.storedIn === "memory"
            ? "Saved locally for testing. Add MongoDB to store permanently."
            : "Thanks. Your request has been received."
      });
      setValues(initialState);
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  }

  return { values, status, update, submit };
}

export function ReservationForm({ compact = false }) {
  const form = useLeadForm(initialReservation, "/api/reservations");

  return (
    <form className={compact ? "lead-form compact" : "lead-form"} onSubmit={form.submit}>
      <div className="form-title">
        <CalendarClock size={20} />
        <div>
          <h2>Plan for later</h2>
          <p>Fast, easy reservations.</p>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Name
          <input name="fullName" value={form.values.fullName} onChange={form.update} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.values.phone} onChange={form.update} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.values.email} onChange={form.update} required />
        </label>
        <label>
          Service
          <select name="service" value={form.values.service} onChange={form.update} required>
            <option>One-Way Trips</option>
            <option>Round Trips</option>
            <option>Hourly Trips</option>
            <option>Airport Pickups</option>
            <option>Package Delivery</option>
            <option>Food Delivery</option>
          </select>
        </label>
        <label>
          Date
          <input type="date" name="date" value={form.values.date} onChange={form.update} required />
        </label>
        <label>
          Time
          <input type="time" name="time" value={form.values.time} onChange={form.update} required />
        </label>
        <label className="span-2">
          Pick up
          <input name="pickup" value={form.values.pickup} onChange={form.update} required />
        </label>
        <label className="span-2">
          Drop off
          <input name="dropoff" value={form.values.dropoff} onChange={form.update} required />
        </label>
      </div>

      <button className="button primary full" type="submit" disabled={form.status.state === "loading"}>
        Send request <Send size={17} />
      </button>
      {form.status.message && <p className={`form-status ${form.status.state}`}>{form.status.message}</p>}
    </form>
  );
}

export function ContactForm() {
  const form = useLeadForm(initialInquiry, "/api/inquiries");

  return (
    <form className="lead-form contact-form" onSubmit={form.submit}>
      <div className="form-title">
        <Mail size={20} />
        <div>
          <h2>Get in touch</h2>
          <p>Send your question to the BlinkRide team.</p>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Full Name
          <input name="fullName" value={form.values.fullName} onChange={form.update} required />
        </label>
        <label>
          Email Address
          <input type="email" name="email" value={form.values.email} onChange={form.update} required />
        </label>
        <label>
          Phone Number
          <input name="phone" value={form.values.phone} onChange={form.update} />
        </label>
        <label>
          Select your type
          <select name="inquiryType" value={form.values.inquiryType} onChange={form.update}>
            <option>General Inquiry</option>
            <option>Customer Support</option>
            <option>Sales Inquiry</option>
            <option>Business Inquiry</option>
            <option>Complaint</option>
            <option>Feedback</option>
            <option>Technical Support</option>
            <option>Billing & Payments</option>
            <option>Careers</option>
            <option>Media & Press</option>
            <option>Other</option>
          </select>
        </label>
        <label className="span-2">
          Your Message
          <textarea name="message" rows="5" value={form.values.message} onChange={form.update} required />
        </label>
      </div>

      <button className="button primary full" type="submit" disabled={form.status.state === "loading"}>
        Submit <Send size={17} />
      </button>
      {form.status.message && <p className={`form-status ${form.status.state}`}>{form.status.message}</p>}
    </form>
  );
}

export function AppLeadForm({ role = "customer" }) {
  const form = useLeadForm({ ...initialAppLead, role }, "/api/app-interest");

  return (
    <form className="lead-form app-lead-form" onSubmit={form.submit}>
      <div className="form-grid">
        <label>
          I want the
          <select name="role" value={form.values.role} onChange={form.update}>
            <option value="customer">Customer App</option>
            <option value="driver">Driver App</option>
          </select>
        </label>
        <label>
          Full Name
          <input name="fullName" value={form.values.fullName} onChange={form.update} />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.values.email} onChange={form.update} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.values.phone} onChange={form.update} />
        </label>
      </div>
      <button className="button primary full" type="submit" disabled={form.status.state === "loading"}>
        Notify me <Send size={17} />
      </button>
      {form.status.message && <p className={`form-status ${form.status.state}`}>{form.status.message}</p>}
    </form>
  );
}
