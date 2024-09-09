import { Request, Response } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

export default async function getUserMedMiddleware(
  req: Request,
  res: Response
) {
  const token = req.body.token; // Assuming the token is sent in the body as { "token": "your_jwt_token" }

  console.log(token);
  jwt.verify(token, "secret", function (err: any, decoded: any) {
    if (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    console.log(decoded);
    res.status(200).json({ message: "Token is valid", decoded });
  });
}
