import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import passport from "./auth/passport";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";

const app = express();
const APP_VERSION = Number(process.env.APP_VERSION)

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

// Register routes
app.use("/auth", authRoute);
app.use("/api/auth", authRoute);
app.use("/user", userRoute);

app.get("/health", (req: Request, res: Response): any => {

    return res.json({
        success: true,
        message: "Server is running",
        time: new Date(),
    })
});


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

// Removed mock /create-user and /login routes as we are using real Google Auth

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});