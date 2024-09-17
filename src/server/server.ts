import express, { Express} from "express";
import cors from "cors";
import "dotenv/config";
import { signupMiddleware } from "./routes/signup";
import loginMiddleware from "./routes/signin";
// Initialize server
const app: Express = express();
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
app.use(authenticateUser);
app.get("/:username", getMeds);
app.post("/:username", createMeds);
app.put("/:username", updateMeds);


// activate the server
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
