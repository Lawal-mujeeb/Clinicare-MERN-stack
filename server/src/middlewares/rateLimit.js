import { rateLimit, ipKeyGenerator } from "express-rate-limit"

//general rate limit  four authentication endpoints
export  const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, //2 minute
    max: 10, //attempts within a minutes
    message: "Too many requests, please try again later",
    standardHeaders: true, // return rate limit info in headers
    keyGenerator: (req) => {
        return `${ipKeyGenerator(req.ip)}-${req.headers["user-agent"] || "unknown-user-agent" }`;
    },
    legacyHeaders: false, // disable X-RateLimit headers
    trustProxy: true,   // trust the x-Fowarded-For header
})

//rate limit for refresh token endpoint
export const refreshTokenLimit= rateLimit({
    windowMs: 15 * 60 * 1000, //15 minute
    max: 30, //attempts within a 30 minutes window
    message: "Too many requests, please try again later",
    standardHeaders: true, // return rate limit info in headers
    keyGenerator: (req) => {
        //use ip adress + user agent to indentify unique client
        return `${ ipKeyGenerator(req.ip)}-${req.headers["user-agent"] || "unknown-user-agent" }`;
    },
    legacyHeaders: false, // disable X-RateLimit headers
    trustProxy: true,   // trust the x-Fowarded-For header
})

//note,


// Summary of What the Code Does
// 1. General Rate Limiter (rateLimiter)
// Applies to: Authentication endpoints.

// Limit: 10 requests every 2 minutes per unique IP and user-agent combo.

// Purpose: Prevents brute force or spammy behavior on sensitive auth routes (like login, signup, etc.).

// 2. Refresh Token Rate Limiter (refreshTokenLimit)
// Applies to: Token refresh endpoint.

// Limit: 30 requests every 15 minutes per unique IP and user-agent combo.

// Purpose: Controls the frequency of refresh token usage to prevent abuse.