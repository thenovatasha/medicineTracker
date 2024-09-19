import { Request, Response } from "express";
import { getDb } from "../../db/db.js";
import { getPassword, userExists } from "../../db/find.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../util/tokens.js";
import { setRefreshToken } from "../../db/auth/tokenHandler.js";

export default async function loginMiddleware(req: Request, res: Response) {
	
	console.log("LOGIN MIDDLEWARE");
	const db_name = process.env.DB_NAME;
	if(!db_name) {
		return;
	}
	const db = await getDb(db_name);
	
	//! Sanitize input
	// TODO: Think about whether you want this to be in body, or headers
	const { username, password } = req.body;
	console.log(username, password);
	if(!username) {
		throw Error("Username missing");
	}
	// check if the user exists
	const isCorrectUser = userExists(username);

	const truePassword = await getPassword(username, db.collection("user"));
	if (!truePassword) {
		res.json({STATUS: "username or password error"})
		return;
	}
	// validate password
	const passwordIsValid = await bcrypt.compare(password, 
												 truePassword.password);
	if(!passwordIsValid) {
		res.json({STATUS: "NOT TODAY 2"})
		return;
	}	
	
	// create accessToken - refresh token pair
	const accessToken = signAccessToken({username});
	const refreshToken = signRefreshToken({username});
	// ignore response, having token set with certain guarantee is not mandatory
	setRefreshToken(username, refreshToken);
	//! TODO: change back to secure: true in production
	res.cookie("a_token", accessToken, {httpOnly: true, secure: false});
	res.cookie("r_token", refreshToken, {httpOnly: true, secure: false});
	//! TODO: Change
	res.json({cookiesSet: {a_token: accessToken, r_token: refreshToken}});
	return;
}
