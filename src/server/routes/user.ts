import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async function getUserMedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body.token; // Assuming the token is sent in the body as { "token": "your_jwt_token" }

  console.log(token);
  jwt.verify(token, "secret", function (err: any, decoded: any) {
    if (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.body.user = "USER X";
    console.log(decoded);
    console.log("Proceeding from get user middleware");
  });
  next();
}
