import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const optionalString = z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
    CORS_ORIGIN: z.string().url().optional().or(z.literal("")).transform((v) => v || undefined),
    EMAIL_USER: z.string().email().optional().or(z.literal("")).transform((v) => v || undefined),
    EMAIL_PASS: optionalString,
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,
    GOOGLE_REDIRECT_URI: z.string().url().optional().or(z.literal("")).transform((v) => v || undefined),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error(
            "Invalid environment variables:",
            result.error.flatten().fieldErrors
        );
        process.exit(1);
    }

    return result.data;
}

export const env = parseEnv();
