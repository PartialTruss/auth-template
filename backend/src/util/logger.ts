import { config } from "../config";

type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown): void {
    if (level === "debug" && config.isProduction) {
        return;
    }

    const entry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...(meta !== undefined ? { meta } : {}),
    };

    const output = JSON.stringify(entry);

    if (level === "error") {
        console.error(output);
        return;
    }

    if (level === "warn") {
        console.warn(output);
        return;
    }

    console.log(output);
}

export const logger = {
    debug: (message: string, meta?: unknown) => log("debug", message, meta),
    info: (message: string, meta?: unknown) => log("info", message, meta),
    warn: (message: string, meta?: unknown) => log("warn", message, meta),
    error: (message: string, meta?: unknown) => log("error", message, meta),
};
