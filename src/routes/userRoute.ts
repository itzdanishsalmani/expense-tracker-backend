import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../services/prisma";

const SALT_ROUND = Number(process.env.SALT_ROUND);

export async function updateUserProfile(req: Request, res: Response) {
    const { name, password } = req.body ?? {};

    const hasName = name !== undefined;
    const hasPassword = password !== undefined;


    if (hasName && (typeof name !== "string" || name.trim().length === 0)) {
        return res.status(400).json({
            success: false,
            message: "Name must be a non-empty string",
        });
    }

    if (hasPassword && (typeof password !== "string" || password.length < 8)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long",
        });
    }

    if (!req.userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const data: { name?: string; password?: string } = {};
        if (hasName) data.name = name.trim();
        if (hasPassword) {
            if (!Number.isInteger(SALT_ROUND) || SALT_ROUND < 1) {
                console.error("[updateUserProfile] SALT_ROUND must be a positive integer");
                return res.status(500).json({ success: false, message: "Failed to update profile" });
            }
            data.password = await bcrypt.hash(password, SALT_ROUND);
        }

        const updatedUser = await prisma.user.update({
            where: { userId: req.userId },
            data,
            select: { name: true, email: true },
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            userData: updatedUser,
        });
    } catch (error) {
        console.error("[updateUserProfile] failed", error);
        return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
}
