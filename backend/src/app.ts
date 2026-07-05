import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { authRouter } from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { logger } from "./util/logger";

export const createApp = () => {
    const app = express();

    app.set("trust proxy", 1);

    app.use(helmet());
    app.use(
        cors({
            origin: config.corsOrigin,
            credentials: true,
        })
    );
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );
    app.use(hpp());
    app.use(express.json({ limit: "10kb" }));

    app.use((req, _res, next) => {
        logger.info("HTTP request", {
            method: req.method,
            path: req.path,
        });
        next();
    });

    app.use("/auth", authRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
