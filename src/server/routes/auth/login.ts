import { Request, Response } from "express";
import { getPassword, userExists } from "../../../db/find.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../../util/tokens.js";
import { setRefreshToken } from "../../../db/auth/tokenHandler.js";
import { assert } from "console";
import { TokenPair } from "../../../types/Payload.js";
 
export default async function  loginMiddleware(req: Request, res: Response) {
	
	const { username, password } = req.body;

	// check if the user exists
	const isCorrectUser = await userExists(username);
	if(!isCorrectUser) {
		throw Error("INVALID USERNAME");
	}
	const isPasswordValid = await matchPassword(username, password);
	
	if(!isPasswordValid) {
		return res.json({STATUS: "Invalid Password"});	 
	}	
	const {a_token, r_token} = generateTokenPair(username);

	// TODO: change back to secure: true in production
	res.cookie("a_token", a_token, {httpOnly: true, secure: false});
	res.cookie("r_token", r_token, {httpOnly: true, secure: false});
	
	// TODO: Change
	return res.status(200).json({status: "cookies set"});
}

async function matchPassword(username: string, password: string) {
	// * SHOULD NEVER BE FALSE
	const truePasswordResult = await getPassword(username);
	assert(truePasswordResult?.password);
	if(!truePasswordResult?.password) {
		return Promise.resolve(false);
	}
	// validate password
	return await bcrypt.compare(password, truePasswordResult.password);
}

/**
 * Generates a rt-at pair, and also updates it in the database
 * @param username 
 * @returns 
 */
function generateTokenPair(username: string): TokenPair {
	
	// create accessToken - refresh token pair
	const accessToken = signAccessToken({username});
	const refreshToken = signRefreshToken({username});
	// ignore response, having token set with certain guarantee is not mandatory
	setRefreshToken(username, refreshToken);

	return {a_token: accessToken, r_token: refreshToken};
}