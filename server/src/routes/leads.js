import { Router } from "express";
import { isMongoConnected } from "../config/db.js";
import Inquiry from "../models/Inquiry.js";
import Reservation from "../models/Reservation.js";
import AppInterest from "../models/AppInterest.js";
import { sendLeadEmail } from "../config/mailer.js";
import { listMemory, saveMemory } from "../store/memoryStore.js";

const router = Router();
const fieldLimits = {
  fullName: 90,
  email: 254,
  phone: 32,
  inquiryType: 80,
  message: 1200,
  role: 20,
  service: 80,
  pickup: 180,
  dropoff: 180,
  date: 20,
  time: 20,
  notes: 800
};
const services = new Set([
  "One-Way Trips",
  "Round Trips",
  "Hourly Trips",
  "Airport Pickups",
  "Package Delivery",
  "Food Delivery"
]);
const roles = new Set(["customer", "driver"]);
const inquiryTypes = new Set([
  "General Inquiry",
  "Customer Support",
  "Sales Inquiry",
  "Business Inquiry",
  "Complaint",
  "Feedback",
  "Technical Support",
  "Billing & Payments",
  "Careers",
  "Media & Press",
  "Other"
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pick(body, keys) {
  return keys.reduce((acc, key) => {
    if (body[key] !== undefined) {
      acc[key] =
        typeof body[key] === "string"
          ? body[key]
              .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : body[key];
    }
    return acc;
  }, {});
}

function requireFields(payload, fields) {
  return fields.filter((field) => !payload[field]);
}

function validatePayload(payload, { required = [], fields = [], enums = {} }) {
  const errors = [];
  const missing = requireFields(payload, required);

  if (missing.length) {
    errors.push(`Missing fields: ${missing.join(", ")}`);
  }

  for (const field of fields) {
    const value = payload[field];
    const limit = fieldLimits[field];

    if (value && limit && String(value).length > limit) {
      errors.push(`${field} is too long.`);
    }
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    errors.push("Email address is invalid.");
  }

  if (payload.email && /[\r\n]/.test(payload.email)) {
    errors.push("Email address is invalid.");
  }

  if (payload.date && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    errors.push("Date must use YYYY-MM-DD format.");
  }

  if (payload.time && !/^\d{2}:\d{2}$/.test(payload.time)) {
    errors.push("Time must use HH:MM format.");
  }

  for (const [field, allowed] of Object.entries(enums)) {
    if (payload[field] && !allowed.has(payload[field])) {
      errors.push(`${field} is invalid.`);
    }
  }

  return errors;
}

function publicResult(result, email) {
  return {
    ok: true,
    storedIn: result.storedIn,
    id: result.record?._id,
    email
  };
}

async function persist(collection, Model, payload) {
  if (isMongoConnected()) {
    const record = await Model.create(payload);
    return { storedIn: "mongo", record };
  }

  return { storedIn: "memory", record: saveMemory(collection, payload) };
}

async function notify(type, payload, record) {
  try {
    return await sendLeadEmail(type, payload, record);
  } catch (error) {
    console.error(`Nodemailer failed for ${type}:`, error.message);
    return {
      enabled: true,
      sent: false,
      message: error.message
    };
  }
}

router.post("/inquiries", async (req, res, next) => {
  try {
    const payload = pick(req.body, ["fullName", "email", "phone", "inquiryType", "message"]);
    const errors = validatePayload(payload, {
      required: ["fullName", "email", "message"],
      fields: ["fullName", "email", "phone", "inquiryType", "message"],
      enums: { inquiryType: inquiryTypes }
    });

    if (errors.length) {
      return res.status(400).json({ ok: false, message: errors.join(" ") });
    }

    const result = await persist("inquiries", Inquiry, payload);
    const email = await notify("contact inquiry", payload, result.record);
    return res.status(201).json(publicResult(result, email));
  } catch (error) {
    return next(error);
  }
});

router.post("/reservations", async (req, res, next) => {
  try {
    const payload = pick(req.body, [
      "fullName",
      "email",
      "phone",
      "service",
      "pickup",
      "dropoff",
      "date",
      "time",
      "notes"
    ]);
    const errors = validatePayload(payload, {
      required: ["fullName", "email", "phone", "service", "pickup", "dropoff", "date", "time"],
      fields: ["fullName", "email", "phone", "service", "pickup", "dropoff", "date", "time", "notes"],
      enums: { service: services }
    });

    if (errors.length) {
      return res.status(400).json({ ok: false, message: errors.join(" ") });
    }

    const result = await persist("reservations", Reservation, payload);
    const email = await notify("reservation", payload, result.record);
    return res.status(201).json(publicResult(result, email));
  } catch (error) {
    return next(error);
  }
});

router.post("/app-interest", async (req, res, next) => {
  try {
    const payload = pick(req.body, ["role", "fullName", "email", "phone"]);
    const errors = validatePayload(payload, {
      required: ["role", "email"],
      fields: ["role", "fullName", "email", "phone"],
      enums: { role: roles }
    });

    if (errors.length) {
      return res.status(400).json({ ok: false, message: errors.join(" ") });
    }

    const result = await persist("appInterests", AppInterest, payload);
    const email = await notify("app interest", payload, result.record);
    return res.status(201).json(publicResult(result, email));
  } catch (error) {
    return next(error);
  }
});

router.get("/submissions", (_req, res) => {
  res.json({
    mongoConnected: isMongoConnected(),
    inquiries: listMemory("inquiries"),
    reservations: listMemory("reservations"),
    appInterests: listMemory("appInterests")
  });
});

export default router;
