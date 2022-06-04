import { getStudentAttendanceDetails, login } from "./sap/sapportal";
import { Session, Year } from "./sap/types";
import cors from "cors";

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/attendance", async (req: Request, res: Response) => {

    const { username, password, year, session } = req.body;

    if (!username || !password || !year || !session) {
        res.status(400);
        return res.json({ error: "invalid request" })
    }

    const [page, context] = await login(username, password);
    const studentAttendance = await getStudentAttendanceDetails(page, Year[year], Session[session]);
    context.close();

    res.json(studentAttendance);
});

app.listen(PORT, () => {
    console.log(`[🥬] Server running 🔴 http://localhost:${PORT}`);
});