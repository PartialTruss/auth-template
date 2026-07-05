import "../types/express";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../errors/AppError";

type RequestPart = "body" | "query" | "params";

export const validate =
    <T>(schema: ZodType<T>, part: RequestPart = "body") =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[part]);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");
            next(new BadRequestError(message, "VALIDATION_ERROR"));
            return;
        }

        // Express 5 makes req.query and req.params read-only; store parsed values separately.
        req.validated ??= {};
        req.validated[part] = result.data;

        next();
    };
