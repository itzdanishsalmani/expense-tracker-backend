import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUND = Number(process.env.SALT_ROUND);

export async function signUp(req:Request, res:Response) {
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

        return res.json({
            success: true,
            message: "User created successfully",
            data: newUser
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "User creation failed",
            error: error
        })
    }
}

export async function signIn(req:Request, res:Response) {
    try {
        const userData = req.body

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

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }

        return res.json({
            success: true,
            message: "Signed in successfully",
            data: existingUser
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "User creation failed",
            error: error
        })
    }
}


export async function createExpense(req:Request, res:Response) {
    try {
        const userData = req.body

        const newExpense = await prisma.expense.create({
            data:{
                userId: userData.userId,
                amount: userData.amount,
                category: userData.category,
                merchant: userData.merchant,
                date: userData.date
            }
        })
        return res.json({
            success: true,
            message: "Expense added successfully",
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "unable to track a expense",
            
        })
    }
}
