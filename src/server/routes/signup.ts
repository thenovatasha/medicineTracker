import { Request, Response } from "express";
import { createUser } from "../../db/insert.js";
import { StatusResponse } from "../../types/ResponseStatus.js";
import { signRefreshToken } from "../util/tokens.js";

export const signupHandler = async (req: Request, res: Response) => {

	//! Todo: sanitise input 
	const { username, password } = req.body;
	let responseObject: StatusResponse;

	try {
		// Todo: Improve the response object api
		const dateJoined = Date.now();
		// refresh token using a rotating mechanism (implemented elsewhere)
		const refreshToken = signRefreshToken({username: username});
		
		await createUser({ username, password, dateJoined, refreshToken });
		responseObject = { creationStatus: "success" };
		res.status(200).json(responseObject);
	} catch (e) {
		console.log(e);
		responseObject = { creationStatus: "failure" };
		// internal server error
		res.status(500).json(responseObject);
		return;
	}
};
