import { env } from "./env";

export const config = {
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === "production",
    port: env.PORT,
    mongoUri: env.MONGO_URI,
    jwtSecret: env.JWT_SECRET,
    clientUrl: env.CLIENT_URL,
    corsOrigin: env.CORS_ORIGIN ?? env.CLIENT_URL,
    email: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri:
            env.GOOGLE_REDIRECT_URI ??
            `http://localhost:${env.PORT}/auth/google/callback`,
    },
} as const;
