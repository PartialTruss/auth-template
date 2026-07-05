import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";
import { logger } from "./logger";

let transporter: Transporter | null = null;

const getMailTransporter = (): Transporter => {
    if (!config.email.user || !config.email.pass) {
        throw new Error("Email credentials are not configured");
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }

    return transporter;
};

export const sendVerificationEmail = async (
    email: string,
    link: string
): Promise<void> => {
    const mailer = getMailTransporter();

    await mailer.sendMail({
        from: "Test <no-reply@myapp.com>",
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${link}">${link}</a>
    `,
    });

    logger.info("Verification email sent", { email });
};

export const sendPasswordReset = async (
    email: string,
    link: string
): Promise<void> => {
    const mailer = getMailTransporter();

    await mailer.sendMail({
        from: "Test <no-reply@myapp.com>",
        to: email,
        subject: "Password Reset",
        html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}">${link}</a>
    `,
    });

    logger.info("Password reset email sent", { email });
};
