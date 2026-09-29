import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import dotenv from "dotenv";
dotenv.config();

export async function createExpense(req:Request, res:Response) {
    try {
        const userData = req.body
        const userId = req.userId;

        console.log("userId", userId, "req.userId", req.userId, "userData.userId", userData.userId)

        const newExpense = await prisma.expense.create({
            data:{
                userId: userId!,
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

export async function bulkCreateExpenses(req: Request, res: Response) {
    const expenses = Array.isArray(req.body) ? req.body : req.body?.expenses;
    const categories = ["GROCERY", "TRANSPORT", "FOOD", "ENTERTAINMENT", "HEALTH", "BILLS", "OTHER"];

    if (!Array.isArray(expenses) || expenses.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a non-empty array of expenses, or an object with an expenses array",
        });
    }

    const invalidIndex = expenses.findIndex((expense: any) =>
        !expense ||
        typeof expense.amount !== "number" || !Number.isFinite(expense.amount) ||
        typeof expense.merchant !== "string" || expense.merchant.trim() === "" ||
        typeof expense.category !== "string" ||
        !categories.includes(expense.category) ||
        (expense.date !== undefined && Number.isNaN(new Date(expense.date).getTime()))
    );

    if (invalidIndex !== -1) {
        return res.status(400).json({
            success: false,
            message: `Expense at index ${invalidIndex} has invalid fields. Provide a finite amount, merchant, valid category, and a valid date (for example, an ISO 8601 date).`,
        });
    }

    try {
        const userId = req.userId;

        console.log(req.body, "req.body create bulk expense")

        const result = await prisma.expense.createMany({
            data: expenses.map((expense: any) => ({
                expenseId: expense.id, // Assuming the frontend sends an 'id' for each expense
                amount: expense.amount,
                category: expense.category,
                merchant: expense.merchant,
                ...(expense.date !== undefined ? { date: new Date(expense.date) } : {}),
                userId: userId!,
            })),
        });

        return res.json({ success: true, count: result.count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to bulk create expenses" });
    }
}

export async function updateBulkExpenses(req: Request, res: Response) {
    console.info("[updateBulkExpenses] request received", {
        userId: req.userId,
    });

    const expenses = Array.isArray(req.body) ? req.body : req.body?.expenses;
    
    // 1. ADDED TRAVELLING AND SHOPPING TO CATEGORIES
    const categories = ["GROCERY", "TRANSPORT", "FOOD", "ENTERTAINMENT", "HEALTH", "BILLS", "OTHER", "SHOPPING", "TRAVELLING"];

    if (!Array.isArray(expenses) || expenses.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a non-empty array of expenses, or an object with an expenses array",
        });
    }

    // 2. ONLY VALIDATE ID AND CATEGORY FOR UPDATES
    const invalidIndex = expenses.findIndex((expense: any) =>
        !expense ||
        typeof expense.id !== "string" || // We expect the frontend to send 'id'
        typeof expense.category !== "string" ||
        !categories.includes(expense.category.toUpperCase())
    );

    if (invalidIndex !== -1) {
        console.warn("[updateBulkExpenses] invalid expense data", {
            userId: req.userId,
            invalidIndex,
            expense: expenses[invalidIndex],
        });
        return res.status(400).json({
            success: false,
            message: `Expense at index ${invalidIndex} has invalid fields. Provide a valid 'id' and 'category'.`,
        });
    }

    try {
        const userId = req.userId;
        console.log(req.body, "req.body")
        
        // 3. USE PRISMA TRANSACTION TO UPDATE MULTIPLE DISTINCT ROWS
        const updatePromises = expenses.map((expense: any) => 
            prisma.expense.updateMany({
                where: { 
                    expenseId: expense.id, // Matching the frontend's 'id' to the backend's 'expenseId'
                    userId: userId! 
                },
                data: {
                    category: expense.category.toUpperCase(),
                }
            })
        );

        // Execute all updates in parallel safely
        await prisma.$transaction(updatePromises);

        console.info("[updateBulkExpenses] database update completed", {
            userId,
            updatedCount: expenses.length,
        });
        return res.json({ success: true, count: expenses.length });
        
    } catch (error) {
        console.error("[updateBulkExpenses] database update failed", {
            userId: req.userId,
            error,
        });
        return res.status(500).json({ success: false, message: "Failed to bulk update expenses" });
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
