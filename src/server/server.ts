import express, { Express} from "express";
import cors from "cors";
import "dotenv/config";
import { signupMiddleware } from "./routes/signup";
import loginMiddleware from "./routes/signin";
import getUserMedMiddleware from "./routes/user";
import { displayDashboard } from "./routes/displayDashboard";

// Initialize server
const app: Express = express();
const PORT = process.env.PORT || 3000;

// set the initial middleware
app.use(cors());
app.use(express.json());
app.use(express.text());

app.get("/login", loginMiddleware);
// create a new user
app.post("/signup", signupMiddleware);

app.get("/dashboard/:username", getUserMedMiddleware, displayDashboard);
// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
