import { CookieOptions, Response } from "express";
import { config } from "../config";

export const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

const cookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax",
    path: "/auth",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
});

export const setRefreshCookie = (res: Response, refreshToken: string): void => {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions());
};

export const clearRefreshCookie = (res: Response): void => {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: config.isProduction ? "none" : "lax",
        path: "/auth",
    });
};
