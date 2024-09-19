import "dotenv/config";
import cors from "cors";
import express, { Express} from "express";
import cookieParser from "cookie-parser";
import { signupHandler } from "./routes/signup.js";
import loginMiddleware from "./routes/login.js";
import { logoutHandler } from "./routes/logout.js";
import { authorizeUser } from "./routes/auth/authenticateUser.js";
import { sendMedInfo } from "./util/med.js";
// Initialize server
const app: Express = express();
const PORT = process.env.PORT || 3000;

// set the initial middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.text());
app.use(cookieParser());

// implement a top level protection middleware
// create a new user
app.post("/signup", signupHandler);
app.post("/login", loginMiddleware);
app.get("/meds", authorizeUser, sendMedInfo);
app.post("/logout", authorizeUser, logoutHandler);
// beyond this point needs to be authenticated

// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);