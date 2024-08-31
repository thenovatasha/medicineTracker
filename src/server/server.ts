import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { createUser } from "../db/db";
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

type statusResponse = {
  creationStatus: "success" | "failure";
};
app.get("/", (req: Request, res: Response) => {
  // in the future, check if user is authorized
  res.send("User is authorized");
});

// create a new user
app.post("/signup", async (req: Request, res: Response) => {
  const { name, password } = req.body;
  let responseObject: statusResponse;
  // check if the user already exists
  try {
    await createUser({ username: name, password: password });
  } catch (e) {
    responseObject = { creationStatus: "failure" };
    res.statusCode = 200;
    res.json(responseObject);
    return;
  }
  responseObject = { creationStatus: "success" };
  res.statusCode = 200;
  res.json(responseObject);
});

app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
