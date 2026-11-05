import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SALT_ROUND = Number(process.env.SALT_ROUND);

export async function signUp(req: Request, res: Response) {
    try {
        const userData = req.body

        const hashPassword = await bcrypt.hash(userData.password, SALT_ROUND)

        const newUser = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashPassword
            }
        })

        const decodedToken = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET as string)

        return res.json({
            success: true,
            message: "User created successfully",
            token: decodedToken,
            userData:{
                name: newUser.name,
                email: newUser.email,
            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "User creation failed",
            error: error
        })
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        const userData = req.body

        if (!userData.email || !userData.password) { return res.status(400).json({
                success: false,
                message: "Email and password are required",
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: userData.email,
            }
        })

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }

        const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password)
        console.log("isPasswordValid", isPasswordValid)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }


        const decodedToken = jwt.sign({ userId: existingUser.userId }, process.env.JWT_SECRET as string)


        return res.json({
            success: true,
            message: "Signed in successfully",
            token: decodedToken,
            userData:{
                name: existingUser.name,
                email: existingUser.email,
            } })
    } catch (error) {
        console.error("[signIn] failed", error);
        return res.status(500).json({
            success: false,
            message: "Sign-in failed",
        })
    }
}

