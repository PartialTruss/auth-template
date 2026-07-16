import express from "express";
import rateLimit from "express-rate-limit";
import {
    googleAuth,
    googleCallback,
    login,
    logout,
    refresh,
    resetPassword,
    signup,
    updateUserPassword,
    verifyEmail,
} from "../auth/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import {
    forgotPasswordSchema,
    googleCallbackQuerySchema,
    loginSchema,
    resetPasswordBodySchema,
    resetPasswordParamsSchema,
    signupSchema,
    verifyEmailQuerySchema,
} from "../validators/auth.validators";

export const authRouter = express.Router();

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});

const refreshRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});

authRouter.post(
    "/api/sign-up",
    authRateLimiter,
    validate(signupSchema),
    asyncHandler(signup)
);
authRouter.post(
    "/api/login",
    authRateLimiter,
    validate(loginSchema),
    asyncHandler(login)
);
authRouter.post(
    "/api/refresh",
    refreshRateLimiter,
    asyncHandler(refresh)
);
authRouter.post(
    "/api/logout",
    authRateLimiter,
    asyncHandler(logout)
);
authRouter.get(
    "/verify-email",
    authRateLimiter,
    validate(verifyEmailQuerySchema, "query"),
    asyncHandler(verifyEmail)
);
authRouter.put(
    "/api/forgot-password",
    authRateLimiter,
    validate(forgotPasswordSchema),
    asyncHandler(resetPassword)
);
authRouter.put(
    "/api/reset-password/:passwordResetCode",
    authRateLimiter,
    validate(resetPasswordParamsSchema, "params"),
    validate(resetPasswordBodySchema),
    asyncHandler(updateUserPassword)
);
authRouter.get("/api/google/url", authRateLimiter, asyncHandler(googleAuth));
authRouter.get(
    "/google/callback",
    authRateLimiter,
    validate(googleCallbackQuerySchema, "query"),
    asyncHandler(googleCallback)
);
