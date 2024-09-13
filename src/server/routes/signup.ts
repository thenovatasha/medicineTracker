import { Request, Response } from "express";
import { createUser } from "../../db/db";

interface StatusResponse {
  creationStatus: "success" | "failure";
}

export const signupMiddleware = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  let responseObject: StatusResponse;

  try {
    await createUser({ username: name, password: password });
    responseObject = { creationStatus: "success" };
    res.status(200).json(responseObject);
  } catch (e) {
    responseObject = { creationStatus: "failure" };
    res.status(202).json(responseObject);
    return;
  }
};
