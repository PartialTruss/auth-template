import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email("A valid email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("A valid email is required"),
    password: z.string().min(1, "Password is required"),
});

export const verifyEmailQuerySchema = z.object({
    token: z.string().min(1, "Verification token is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("A valid email is required"),
});

export const resetPasswordParamsSchema = z.object({
    passwordResetCode: z.string().min(1, "Reset token is required"),
});

export const resetPasswordBodySchema = z.object({
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters"),
});

export const googleCallbackQuerySchema = z.object({
    code: z.string().min(1, "Authorization code is required"),
});
