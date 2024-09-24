import "dotenv/config";
import cors from "cors";
import express, { Express} from "express";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/protectedRoute.js";
import helmet from "helmet";
import { onBoardRouter } from "./routes/onboardRoute.js";
import { globalErrorHandler } from "./middleware/err.handlers.js";

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
app.use("/api", apiRouter);
app.use("/", onBoardRouter);

app.use(globalErrorHandler);

// activate the server
app.listen(3001, "0.0.0.0", () => {
    console.log("SERVER STARTED");
})
// console.log(`server started at http://localhost:${PORT}`);