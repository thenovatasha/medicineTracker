import express, { Express} from "express";
import cors from "cors";
import "dotenv/config";
import { signupMiddleware } from "./routes/signup.js";
import loginMiddleware from "./routes/signin.js";

import { authenticateUser } from "./routes/auth/authenticateUser.js";
import { generateRefreshToken } from "../db/auth/tokenHandler.js";
import { decodeRefreshToken } from "../db/auth/tokenHandler.js";
import cookieParser from "cookie-parser";
import { METHODS } from "http";
// Initialize server
const app: Express = express();
const PORT = process.env.PORT || 3000;

// set the initial middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
// implement a top level protection middleware
app.get("/login", loginMiddleware);
// create a new user
app.post("/signup", signupMiddleware);
app.get("/med", authenticateUser);
// beyond this point needs to be authenticated
// app.use(authenticateUser);
// app.get("/:username", getMeds);
// app.post("/:username", createMeds);
// app.put("/:username", updateMeds);


// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);