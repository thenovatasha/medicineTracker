import { Request, Response } from "express";
import { createUser } from "../../db/insert";
import { StatusResponse } from "../../types/ResponseStatus";

export const signupHandler = async (req: Request, res: Response) => {

	//! Todo: sanitise input 
	const { username, password } = req.body;
	let responseObject: StatusResponse;

	try {
		// Todo: Improve the response object api
		const dateJoined = Date.now(); 
		// refresh token using a rotating mechanism (implemented elsewhere)
		
		await createUser({ username, password, dateJoined, refreshToken: null});
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
