import User, { IUser } from "../models/User";

export interface CreateUserData {
    email: string;
    passwordHash?: string;
    googleId?: string;
    isVerified?: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
}

export const findUserByEmail = (email: string) =>
    User.findOne({ email: email.toLowerCase() });

export const findUserByVerificationToken = (token: string) =>
    User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
    });

export const findUserByResetToken = (hashedToken: string) =>
    User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

export const createUser = (data: CreateUserData): Promise<IUser> =>
    new User(data).save();

export const saveUser = (user: IUser): Promise<IUser> => user.save();
