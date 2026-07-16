import { Request, Response } from "express";
import {
    createAuthSession,
    loginUser,
    refreshAuthSession,
    requestPasswordReset,
    resetPasswordWithToken,
    revokeAuthSession,
    signupUser,
    verifyEmailToken,
} from "./auth.services";
import { getGoogleOauthUrl } from "../util/googleOauthUtil";
import { handleGoogleCallback } from "./auth.oauth";
import { config } from "../config";
import {
    clearRefreshCookie,
    REFRESH_COOKIE_NAME,
    setRefreshCookie,
} from "../util/refreshCookie";
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
import { UnauthorizedError } from "../errors/AppError";

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.validated!.body as z.infer<
        typeof signupSchema
    >;
    await signupUser(email, password);

    res.status(201).json({
        message: "Account created. Please verify your email.",
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.validated!.body as z.infer<
        typeof loginSchema
    >;
    const user = await loginUser(email, password);
    const session = await createAuthSession(user);

    setRefreshCookie(res, session.refreshToken);

    res.json({
        message: "Login successful",
        token: session.accessToken,
        userId: user._id,
    });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
        | string
        | undefined;

    if (!rawRefreshToken) {
        throw new UnauthorizedError("No refresh token");
    }

    const session = await refreshAuthSession(rawRefreshToken);
    setRefreshCookie(res, session.refreshToken);

    res.json({
        message: "Token refreshed",
        token: session.accessToken,
    });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
        | string
        | undefined;

    await revokeAuthSession(rawRefreshToken);
    clearRefreshCookie(res);

    res.json({ message: "Logged out successfully." });
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
    const session = await createAuthSession(user);

    setRefreshCookie(res, session.refreshToken);
    res.redirect(`${config.clientUrl}/oauth-success`);
};
