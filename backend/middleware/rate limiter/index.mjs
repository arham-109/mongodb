import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
