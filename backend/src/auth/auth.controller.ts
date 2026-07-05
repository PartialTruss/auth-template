import { Request, Response } from "express";
import {
    loginUser,
    requestPasswordReset,
    resetPasswordWithToken,
    signupUser,
    verifyEmailToken,
} from "./auth.services";
import { createJwt } from "./auth.token";
import { getGoogleOauthUrl } from "../util/googleOauthUtil";
import { handleGoogleCallback } from "./auth.oauth";
import { config } from "../config";
import {
    forgotPasswordSchema,
    googleCallbackQuerySchema,
    loginSchema,
    resetPasswordBodySchema,
    resetPasswordParamsSchema,
    signupSchema,
    verifyEmailQuerySchema,
} from "../validators/auth.validators";
import { z } from "zod";

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.validated!.body as z.infer<
        typeof signupSchema
    >;
    const token = await signupUser(email, password);

    res.status(201).json({
        message: "Account created.please verify your email.",
        token,
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.validated!.body as z.infer<
        typeof loginSchema
    >;
    const user = await loginUser(email, password);
    const token = createJwt({
        userId: user._id.toString(),
        email: user.email,
    });

    res.json({
        message: "Login successful",
        token,
        userId: user._id,
    });
};

export const verifyEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token } = req.validated!.query as z.infer<
        typeof verifyEmailQuerySchema
    >;
    await verifyEmailToken(token);

    res.json({ message: "Email verified successfully." });
};

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email } = req.validated!.body as z.infer<
        typeof forgotPasswordSchema
    >;
    await requestPasswordReset(email);

    res.status(200).json({
        message: "If the email exists, a reset link was sent.",
    });
};

export const updateUserPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { passwordResetCode } = req.validated!.params as z.infer<
        typeof resetPasswordParamsSchema
    >;
    const { newPassword } = req.validated!.body as z.infer<
        typeof resetPasswordBodySchema
    >;

    await resetPasswordWithToken(passwordResetCode, newPassword);

    res.status(200).json({ message: "Password updated successfully." });
};

export const googleAuth = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const url = getGoogleOauthUrl();
    res.status(200).json({ url });
};

export const googleCallback = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { code } = req.validated!.query as z.infer<
        typeof googleCallbackQuerySchema
    >;
    const user = await handleGoogleCallback(code);
    const token = createJwt({
        userId: user._id.toString(),
        email: user.email,
    });

    res.redirect(`${config.clientUrl}/oauth-success?token=${token}`);
};
