import express from "express";
import cors from "cors";
import { createUser } from "../db/db";
const app = express();
const PORT = 3000;
app.use(cors());
app.get("/", (req, res) => {
    res.send("Express + TS Server");
});
app.post("/newUser", (req, res) => {
    createUser({ name: "Nafi", password: "1435" });
});
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
