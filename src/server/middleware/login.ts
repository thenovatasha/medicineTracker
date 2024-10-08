import { NextFunction, Request, Response } from "express";
import { getPassword, userExists } from "../../db/find.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../util/tokens.js";
import { setRefreshToken } from "../../db/update.js";
import { TokenPair } from "../../types/Payload.js";
import { StatusResponse } from "../../types/ResponseStatus.js";
import { UnexpectedError } from "../../types/Errors.js";
import { nextTick } from "process";
export default async function loginMiddleware(req: Request, res: Response<StatusResponse>, next: NextFunction) {
	// return res.send({status: "success"});
	const { username, password } = req.body;
	console.log("inside loginMdw");
	console.log(username, password);
	// check if the user exists
	const isCorrectUser = await userExists(username);
	if(!isCorrectUser) {
		return res.status(401).json({status: "failure"});
	}
	let isPasswordValid;
	console.log("user is correct");
	try {
		 isPasswordValid = await matchPassword(username, password);
	} catch (e) {
		next(e);
	}
	
	if(!isPasswordValid) {
		console.log("invalid Password");
		return res.status(401).json({status: "failure"});	 
	}	
	const {a_token, r_token} = generateTokenPair(username);

	console.log("setting cookies");
	// TODO: change back to secure: true in production
	res.cookie("a_token", a_token, {httpOnly: true, secure: false});
	res.cookie("r_token", r_token, {httpOnly: true, secure: false});
	
	return res.status(200).json({status: "success"});
}

async function matchPassword(username: string, password: string) {
	// * SHOULD NEVER BE FALSE
	const truePasswordResult = await getPassword(username);
	if(!truePasswordResult) {
		throw new UnexpectedError("password not found for existing user");
	}
	if(!truePasswordResult.password) {
		return Promise.resolve(false);
	}
	console.log("all the way here");
	// validate password
	return bcrypt.compare(password, truePasswordResult.password);
}

/**
 * Generates a rt-at pair, and also updates it in the database
 * @param username 
 * @returns 
 */
export function generateTokenPair(username: string): TokenPair {
	
	// create accessToken - refresh token pair
	const accessToken = signAccessToken({username});
	const refreshToken = signRefreshToken({username});
	// ignore response, having token set with certain guarantee is not mandatory
	setRefreshToken(username, refreshToken);

	return {a_token: accessToken, r_token: refreshToken};
}