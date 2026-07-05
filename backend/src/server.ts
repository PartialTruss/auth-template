import "./types/express";
import { createApp } from "./app";
import { connectToDB } from "./config/db";
import { config } from "./config";
import { logger } from "./util/logger";

const startServer = async (): Promise<void> => {
    await connectToDB();

    const app = createApp();

    app.listen(config.port, () => {
        logger.info(`Server running at http://localhost:${config.port}`);
    });
};

startServer().catch((error) => {
    logger.error("Failed to start server", error);
    process.exit(1);
});
