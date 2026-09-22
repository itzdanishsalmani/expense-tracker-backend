import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import { signIn, signUp, createExpense } from "./routes/authRoute";

const app = express();

const APP_VERSION = Number(process.env.APP_VERSION)

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});


app.get("/health", (req: Request, res: Response): any => {

    return res.json({
        success: true,
        message: "Server is running",
        time: new Date(),
    })
});

app.post("/api/auth/signup", signUp)

app.post("/api/auth/signin", signIn)

app.post("/api/expense/create-expense", createExpense)

app.get("/api/check-version", (req: Request, res: Response): any => {
    const version = Number(req.query.version);
    try {
        if (version && APP_VERSION && version >= APP_VERSION) {
            return res.json({ status: "success", isUpdateRequired: false, message: "App is up to date" });
        }
        return res.json({ status: "error", isUpdateRequired: true, message: "Update is required" });
    } catch (error) {
        console.log(error);
    }
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});