import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "../types/express";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.json({
                success: false,
                status: 401,
                message: "Unauthorized User"
            })
        }

        const token = header.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decodedToken || !decodedToken.userId) {
            return res.json({
                success: false,
                status: 401,
                message: "Invalid Token"
            })
        }

        req.userId = decodedToken.userId;

        next();

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            status: 500,
            message: "Internal Server Error",
        })
    }
}