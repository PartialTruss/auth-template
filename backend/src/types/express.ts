declare module "express-serve-static-core" {
    interface Request {
        validated?: Partial<{
            body: unknown;
            query: unknown;
            params: unknown;
        }>;
    }
}

export {};
