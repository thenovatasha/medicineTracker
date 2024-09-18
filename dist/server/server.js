import express from "express";
import cors from "cors";
import "dotenv/config";
import { signupMiddleware } from "./routes/signup.js";
import loginMiddleware from "./routes/signin.js";
import { generateRefreshToken } from "../db/auth/tokenHandler.js";
import { isValidRefreshToken } from "../db/auth/tokenHandler.js";
// Initialize server
const app = express();
const PORT = process.env.PORT || 3000;
// set the initial middleware
app.use(cors());
app.use(express.json());
app.use(express.text());
// implement a top level protection middleware
app.get("/login", loginMiddleware);
// create a new user
app.post("/signup", signupMiddleware);
// beyond this point needs to be authenticated
// app.use(authenticateUser);
// app.get("/:username", getMeds);
// app.post("/:username", createMeds);
// app.put("/:username", updateMeds);
// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
const token = generateRefreshToken();
console.log(token);
if (token) {
    isValidRefreshToken(token);
}
else {
    console.log("Token not found");
}
