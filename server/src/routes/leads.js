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

const submissionCollections = [
  { key: "inquiries", model: Inquiry },
  { key: "reservations", model: Reservation },
  { key: "appInterests", model: AppInterest }
];
const submissionCollectionMap = new Map(submissionCollections.map((collection) => [collection.key, collection]));

function readPositiveInt(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const number = Number.parseInt(value, 10);

  if (!Number.isFinite(number) || number < 1) {
    return fallback;
  }

  return Math.min(number, max);
}

function getPagination(query) {
  const maxLimit = readPositiveInt(process.env.SUBMISSIONS_MAX_LIMIT, 100, 500);
  const defaultLimit = readPositiveInt(process.env.SUBMISSIONS_DEFAULT_LIMIT, 25, maxLimit);
  const page = readPositiveInt(query.page, 1);
  const limit = readPositiveInt(query.limit, defaultLimit, maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

function paginationMeta({ page, limit }, total) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

async function listSubmissionsPage({ key, model }, pagination) {
  if (isMongoConnected()) {
    const [items, total] = await Promise.all([
      model.find({}).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
      model.countDocuments()
    ]);

    return { items, pagination: paginationMeta(pagination, total) };
  }

  const records = [...listMemory(key)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return {
    items: records.slice(pagination.skip, pagination.skip + pagination.limit),
    pagination: paginationMeta(pagination, records.length)
  };
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

router.get("/submissions", async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const type = typeof req.query.type === "string" ? req.query.type.trim() : "all";

    if (type !== "all") {
      const collection = submissionCollectionMap.get(type);

      if (!collection) {
        return res.status(400).json({
          ok: false,
          message: `type must be one of: all, ${submissionCollections.map((item) => item.key).join(", ")}.`
        });
      }

      const result = await listSubmissionsPage(collection, pagination);
      return res.json({
        mongoConnected: isMongoConnected(),
        type,
        ...result
      });
    }

    const entries = await Promise.all(
      submissionCollections.map(async (collection) => [
        collection.key,
        await listSubmissionsPage(collection, pagination)
      ])
    );

    return res.json({
      mongoConnected: isMongoConnected(),
      submissions: Object.fromEntries(entries)
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
