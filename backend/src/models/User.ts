import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    googleId?: string;
    isVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshTokenHash?: string;
    refreshTokenExpires?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: false },
        googleId: { type: String, sparse: true, unique: true },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: { type: String },
        emailVerificationExpires: Date,
        passwordResetToken: { type: String },
        passwordResetExpires: Date,
        refreshTokenHash: { type: String },
        refreshTokenExpires: Date,
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ emailVerificationToken: 1 }, { sparse: true });
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });
UserSchema.index({ refreshTokenHash: 1 }, { sparse: true });

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
