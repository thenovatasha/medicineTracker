import { NextFunction, Request, Response } from "express";
import { createUser } from "../../db/update";
import { StatusResponse } from "../../types/ResponseStatus";

export async function signupHandler(req: Request, res: Response<StatusResponse>, next: NextFunction) {

	try {
		console.log("HERE");
		const { username, password } = req.body;
		// Todo: Improve the response object api
		const dateJoined = Date.now(); 
		// refresh token using a rotating mechanism (implemented elsewhere)
		await createUser({ username, password, dateJoined, refreshToken: null});
		return res.status(201).json({status: "success"});
	} catch (e) {
		next(e)
		// return res.status(200).json({status: "failure"});
	}
};
