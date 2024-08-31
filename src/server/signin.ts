import { Request, Response } from "express";
import { getDb, getPassword } from "../db/db";
import bcrypt from "bcrypt";

export default async function loginMiddleware(req: Request, res: Response) {
  const db = await getDb("medTracker");
  const { name, password } = req.body;
  const truePassword = await getPassword(name, db.collection("User"));
  if (truePassword) {
    // validate password
    var result = await bcrypt.compare(password, truePassword.password);
    if (result === true) {
      res.send("SUCCESSFULLY SIGNED IN!");
    } else {
      res.send("NOT THE REAL DEAL");
    }
  } else {
    res.send("PASSWORD COULD NOT BE VALIDATED");
  }
}
