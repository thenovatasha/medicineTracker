var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUser } from "../../db/insert.js";
import jwt from "jsonwebtoken";
export const signupMiddleware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    let responseObject;
    try {
        const dateJoined = Date.now();
        const refreshToken = jwt.sign({ username }, "secret", {
            expiresIn: "30d",
        });
        yield createUser({ username, password, dateJoined, refreshToken });
        responseObject = { creationStatus: "success" };
        res.status(200).json(responseObject);
    }
    catch (e) {
        console.log(e);
        responseObject = { creationStatus: "failure" };
        res.status(202).json(responseObject);
        return;
    }
});
