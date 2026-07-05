import express from "express";
import rateLimit from "express-rate-limit";
import {
    googleAuth,
    googleCallback,
    login,
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

authRouter.use(authRateLimiter);

authRouter.post(
    "/api/sign-up",
    validate(signupSchema),
    asyncHandler(signup)
);
authRouter.post("/api/login", validate(loginSchema), asyncHandler(login));
authRouter.get(
    "/verify-email",
    validate(verifyEmailQuerySchema, "query"),
    asyncHandler(verifyEmail)
);
authRouter.put(
    "/api/forgot-password",
    validate(forgotPasswordSchema),
    asyncHandler(resetPassword)
);
authRouter.put(
    "/api/reset-password/:passwordResetCode",
    validate(resetPasswordParamsSchema, "params"),
    validate(resetPasswordBodySchema),
    asyncHandler(updateUserPassword)
);
authRouter.get("/api/google/url", asyncHandler(googleAuth));
authRouter.get(
    "/google/callback",
    validate(googleCallbackQuerySchema, "query"),
    asyncHandler(googleCallback)
);
