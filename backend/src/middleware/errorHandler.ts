import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config";
import { logger } from "../util/logger";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const isOAuthCallback = req.originalUrl.includes("/google/callback");

    if (err instanceof AppError) {
        if (!err.isOperational) {
            logger.error("Non-operational application error", err);
        }

        if (isOAuthCallback) {
            logger.error("Google OAuth callback failed", err);
            res.redirect(`${config.clientUrl}/oauth-success`);
            return;
        }

        const body: Record<string, string> = { message: err.message };
        if (err.code) {
            body.code = err.code;
        }

        // Preserve legacy `error` key used by some auth endpoints
        if (err.statusCode >= 500) {
            res.status(err.statusCode).json({ error: err.message });
            return;
        }

        res.status(err.statusCode).json(body);
        return;
    }

    logger.error("Unhandled error", err);

    if (isOAuthCallback) {
        res.redirect(`${config.clientUrl}/oauth-success`);
        return;
    }

    res.status(500).json({
        error: config.isProduction
            ? "Internal server error"
            : err instanceof Error
              ? err.message
              : "Internal server error",
    });
};
