import bcrypt from "bcrypt";
import { google } from "googleapis";
import { config } from "../config";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/AppError";
import { IUser } from "../models/User";
import { generateEmailToken } from "../util/emailToken";
import { oauthClient } from "../util/googleOauthUtil";
import { sendPasswordReset, sendVerificationEmail } from "../util/sendVerification";
import {
    createUser,
    findUserByEmail,
    findUserByResetToken,
    findUserByVerificationToken,
    saveUser,
} from "./auth.repository";
import {
    createJwt,
    createResetToken,
    getEmailVerificationExpiry,
    hashResetToken,
} from "./auth.token";

const BCRYPT_ROUNDS = 10;

export const signupUser = async (
    email: string,
    password: string
): Promise<string> => {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new ConflictError("User already exists", "USER_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const emailToken = generateEmailToken();

    const user = await createUser({
        email: email.toLowerCase(),
        passwordHash,
        emailVerificationToken: emailToken,
        emailVerificationExpires: new Date(getEmailVerificationExpiry()),
    });

    const link = `${config.clientUrl}/verify-email?token=${emailToken}`;
    await sendVerificationEmail(user.email, link);

    return createJwt({ userId: user._id.toString(), email: user.email });
};

export const loginUser = async (
    email: string,
    password: string
): Promise<IUser> => {
    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
        throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new UnauthorizedError("Please verify your email first");
    }

    const passwordIsCorrect = await bcrypt.compare(
        password,
        user.passwordHash
    );
    if (!passwordIsCorrect) {
        throw new UnauthorizedError("Invalid email or password");
    }

    return user;
};

export const verifyEmailToken = async (token: string): Promise<void> => {
    const user = await findUserByVerificationToken(token);

    if (!user) {
        throw new BadRequestError("Invalid or expired token.");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await saveUser(user);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    const user = await findUserByEmail(email);

    if (!user) {
        return;
    }

    const { raw, hashed, expires } = createResetToken();

    user.passwordResetToken = hashed;
    user.passwordResetExpires = new Date(expires);
    await saveUser(user);

    const resetLink = `${config.clientUrl}/forgot-password/${raw}`;
    await sendPasswordReset(user.email, resetLink);
};

export const resetPasswordWithToken = async (
    rawToken: string,
    newPassword: string
): Promise<void> => {
    const hashedToken = hashResetToken(rawToken);
    const user = await findUserByResetToken(hashedToken);

    if (!user) {
        throw new NotFoundError("Invalid or expired reset token.");
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await saveUser(user);
};