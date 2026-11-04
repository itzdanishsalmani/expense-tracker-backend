import type { Express, Request, Response } from "express";

let app: Express | undefined;

export default function handler(req: Request, res: Response) {
    if (!process.env.DATABASE_URL) {
        return res.status(500).json({
            success: false,
            message: "Backend configuration error: DATABASE_URL is not configured",
        });
    }

    try {
        app ??= require("../dist/index.js").default as Express;
        return app(req, res);
    } catch (error) {
        console.error("Failed to initialize backend function", error);
        return res.status(500).json({
            success: false,
            message: "Backend failed to initialize. Check the Vercel function logs.",
        });
    }
}
