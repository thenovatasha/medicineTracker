import express, { Express, Request, Response } from "express";
import cors from "cors";
const app: Express = express();
const PORT = 3000;

app.use(cors());
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TS Server");
});

app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
