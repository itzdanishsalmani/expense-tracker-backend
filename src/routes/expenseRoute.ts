import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import dotenv from "dotenv";
import "../types/express";
dotenv.config();

export async function createExpense(req:Request, res:Response) {
    try {
        const userData = req.body

        const newExpense = await prisma.expense.create({
            data:{
                userId: req.userId!,
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


export async function getExpense(req:Request, res:Response) {
    try {
        const userData = req.body

        const newExpense = await prisma.expense.findMany({
            where:{
                userId: req.userId!,
            }
        })

        return res.json({
            success: true,
            message: "Got all expense successfully",
            data: newExpense
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "unable to get expense data ",
            
        })
    }
}
