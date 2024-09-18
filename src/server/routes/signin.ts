import { Request, Response } from "express";
import { getDb } from "../../db/db.js";
import { getPassword } from "../../db/find.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function loginMiddleware(req: Request, res: Response) {
	const db = await getDb("medTracker");
	const { name, password } = req.body;
	const truePassword = await getPassword(name, db.collection("User"));
	if (truePassword) {
		// validate password
		var result = await bcrypt.compare(password, truePassword.password);
		if (result === true) {
			// res.send("SUCCESSFULLY SIGNED IN!");
			// create the jwt and return it back
			const token = jwt.sign({ username: name }, "secret", {
				expiresIn: "10m",
			});
			res.send(token);
		} else {
			res.send("NOT THE REAL DEAL");
		}
	} else {
		res.send("PASSWORD COULD NOT BE VALIDATED");
	}
}
