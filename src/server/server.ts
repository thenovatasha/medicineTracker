import "dotenv/config";
import cors from "cors";
import express, { Express} from "express";
import cookieParser from "cookie-parser";
import { signupHandler } from "./routes/signup.js";
import loginMiddleware from "./routes/auth/login.js";
import { router } from "./routes/protected.js";
import helmet from "helmet";
// Initialize server
export const app: Express = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by'); // no sniffing
// set the initial middleware
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.use(express.json());
app.use(express.text());
app.use(cookieParser());

// implement a top level protection middleware
app.use('/api', router);
// create a new user
app.post("/signup", signupHandler);
app.post("/login", loginMiddleware);

// app.use(errHandler) 

// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);