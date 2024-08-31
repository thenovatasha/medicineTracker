import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createUser } from "../db/db";
const app: Express = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TS Server");
});
app.post("/newUser", (req: Request, res: Response) => {
    const { name, password } = req.body;
    console.log("Name: ", name);
    console.log("Password: ", password);
    createUser({ name: name, password: password });
    res.statusCode = 202;
    res.end("GOT");
});
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
