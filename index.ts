import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const APP_VERSION = Number(process.env.APP_VERSION)

app.use(cors({
    origin: "*"
}));

app.use(express.json());

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

app.post("/create-user", (req:Request, res:Response)=> {
    const {email, password} = req.body

    try {
        // const checkEmail = await p
        const checkEmail = false

        if(checkEmail) {
            return res.json({
                status:400,
                messaage:"User already exist"
            })
        }

        // db create user with email, password

    } catch (error) {
        
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});