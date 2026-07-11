import bcrypt from "bcrypt";
import { config } from "../config";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../errors/AppError";
import { IUser } from "../models/User";
import { generateEmailToken } from "../util/emailToken";
import { sendPasswordReset, sendVerificationEmail } from "../util/sendVerification";
import {
    createUser,
    findUserByEmail,
    findUserByResetToken,
    findUserByVerificationToken,
    saveUser,
} from "./auth.repository";
import {
    createResetToken,
    getEmailVerificationExpiry,
    hashResetToken
} from "./auth.token";

const BCRYPT_ROUNDS = 10;
const DUMMY_HASH = "$2b$10$Nx3721kGpvN824./7d8GquNuoPZ116lzH997NlC9Peh16F5ZgV21a";

export const signupUser = async (
    email: string,
    password: string
): Promise<void> => {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new ConflictError("User already exists", "USER_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const emailToken = generateEmailToken();
    const hashedEmailToken = hashResetToken(emailToken);

    const user = await createUser({
        email: email.toLowerCase(),
        passwordHash,
        emailVerificationToken: hashedEmailToken,
        emailVerificationExpires: new Date(getEmailVerificationExpiry()),
    });

    const link = `${config.clientUrl}/verify-email?token=${emailToken}`;
    await sendVerificationEmail(user.email, link);

};

export const loginUser = async (
    email: string,
    password: string
): Promise<IUser> => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);


    const passwordHashCompare = user?.passwordHash ? user.passwordHash : DUMMY_HASH;
    const passwordIsCorrect = await bcrypt.compare(password, passwordHashCompare);


    if (!user || !passwordIsCorrect) {
        throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new UnauthorizedError("Please verify your email first");
    }

    return user;
};

export const verifyEmailToken = async (token: string): Promise<void> => {
    const hashedToken = hashResetToken(token);
    const user = await findUserByVerificationToken(token);

    if (!user || !user.emailVerificationExpires || new Date() > user.emailVerificationExpires) {
        throw new BadRequestError("Invalid or expired token.");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await saveUser(user);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);

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

    if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
        throw new NotFoundError("Invalid or expired reset token.");
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await saveUser(user);
};