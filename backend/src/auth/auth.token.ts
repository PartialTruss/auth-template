import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config";
import { JwtPayload } from "../types/jwt";

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 15;
const JWT_EXPIRES_IN = "2d";

export const createJwt = (payload: JwtPayload): string =>
    jwt.sign(payload, config.jwtSecret, {
        expiresIn: JWT_EXPIRES_IN,
    });

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
