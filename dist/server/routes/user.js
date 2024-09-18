var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
export default function getUserMedMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.body.token; // Assuming the token is sent in the body as
        // { "token": "your_jwt_token" }
        console.log(token);
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }
            if (decoded) {
                req.body.user = "SIUEEE";
            }
            console.log(decoded);
            console.log(typeof (decoded));
            console.log("Proceeding from get user middleware");
            next();
        });
    });
}
