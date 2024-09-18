var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDb } from "../../db/db.js";
import { getPassword } from "../../db/find.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export default function loginMiddleware(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getDb("medTracker");
        const { name, password } = req.body;
        const truePassword = yield getPassword(name, db.collection("User"));
        if (truePassword) {
            // validate password
            var result = yield bcrypt.compare(password, truePassword.password);
            if (result === true) {
                // res.send("SUCCESSFULLY SIGNED IN!");
                // create the jwt and return it back
                const token = jwt.sign({ username: name }, "secret", {
                    expiresIn: "10m",
                });
                res.send(token);
            }
            else {
                res.send("NOT THE REAL DEAL");
            }
        }
        else {
            res.send("PASSWORD COULD NOT BE VALIDATED");
        }
    });
}
