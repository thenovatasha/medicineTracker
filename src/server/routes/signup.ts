import { Request, Response } from "express";
import { createUser } from "../../db/insert.js";
import jwt from "jsonwebtoken";
interface StatusResponse {
	creationStatus: "success" | "failure";
}

export const signupMiddleware = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	let responseObject: StatusResponse;

	try {
		const dateJoined = Date.now();
		const refreshToken = jwt.sign({ username }, "secret", {
				expiresIn: "30d",
		});
		await createUser({ username, password, dateJoined, refreshToken });
		responseObject = { creationStatus: "success" };
		res.status(200).json(responseObject);
	} catch (e) {
		console.log(e);
		responseObject = { creationStatus: "failure" };
		res.status(202).json(responseObject);
		return;
	}
};
