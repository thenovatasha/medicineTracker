import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { signupMiddleware } from "./signup";
import loginMiddleware from "./signin";

// Initialize server
const app: Express = express();
const PORT = process.env.PORT || 3000;

// set the initial middleware
app.use(cors());
app.use(express.json());

app.get("/login", loginMiddleware);
// create a new user
app.post("/signup", signupMiddleware);

// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
