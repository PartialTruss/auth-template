import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config";
import { JwtPayload } from "../types/jwt";

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 15;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const createJwt = (payload: JwtPayload): string =>
    jwt.sign(payload, config.jwtSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

export const verifyJwt = (token: string): JwtPayload =>
    jwt.verify(token, config.jwtSecret) as JwtPayload;

export const createRefreshToken = () => {
    const raw = crypto.randomBytes(48).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    return {
        raw,
        hashed,
        expires: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    };
};

export const hashRefreshToken = (rawToken: string): string =>
    crypto.createHash("sha256").update(rawToken).digest("hex");

export const createResetToken = () => {
    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    return {
        raw,
        hashed,
        expires: Date.now() + RESET_TOKEN_TTL_MS,
    };
};

export const hashResetToken = (rawToken: string): string =>
    crypto.createHash("sha256").update(rawToken).digest("hex");

export const getEmailVerificationExpiry = (): number =>
    Date.now() + EMAIL_VERIFICATION_TTL_MS;
