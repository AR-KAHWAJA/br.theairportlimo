import { Router } from "express";
import { isMongoConnected } from "../config/db.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "blinkride-api",
    mongoConnected: isMongoConnected(),
    timestamp: new Date().toISOString()
  });
});

export default router;
