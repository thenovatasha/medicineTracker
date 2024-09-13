import { error } from "console";
import { Request, Response, NextFunction, Errback } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export default async function getUserMedMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.body.token; // Assuming the token is sent in the body as
	// { "token": "your_jwt_token" }

	console.log(token);
	jwt.verify(token, "secret", (err: VerifyErrors | null,
			   decoded: string | JwtPayload | undefined) => 
	{
		if (err) {
			return res.status(401).json({ error: "Invalid token" });
			
		}
		if(decoded) {
			req.body.user = "SIUEEE";
		}
		console.log(decoded);
		console.log(typeof(decoded));
		console.log("Proceeding from get user middleware");
		next();
	});
	
}
