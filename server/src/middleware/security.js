function getClientKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function createRateLimiter({ windowMs, max, message }) {
  const hits = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }, windowMs);

  cleanup.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req);
    const current = hits.get(key);
    const entry = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

    entry.count += 1;
    hits.set(key, entry);

    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - entry.count)));
    res.setHeader("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      return res.status(429).json({
        ok: false,
        message: message || "Too many requests. Please try again soon."
      });
    }

    return next();
  };
}

export function requireSubmissionsToken(req, res, next) {
  const token = process.env.SUBMISSIONS_TOKEN?.trim();

  if (!token) {
    return res.status(404).json({ ok: false, message: "Not found." });
  }

  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const providedToken = bearerToken || req.get("x-submissions-token") || req.query.token;

  if (providedToken !== token) {
    return res.status(403).json({ ok: false, message: "Forbidden." });
  }

  return next();
}
