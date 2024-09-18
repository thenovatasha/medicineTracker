import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { DecodedToken } from "../../types/DecodedToken";
export default async function getUserMedMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.body.token; // Assuming the token is sent in the body as

	console.log(token);
	jwt.verify(token, "secret", (err: VerifyErrors | null,
			   decoded: string | JwtPayload | undefined) => 
	{
		if (err) {
			return res.status(401).json({ error: "Invalid token" });
		}
		if(decoded && typeof decoded !== "string") {
			const decodedToken = decoded as DecodedToken;
			req.body.user = decodedToken.username;
		}
		console.log("Proceeding from get user middleware");
		next();
	});	
}
