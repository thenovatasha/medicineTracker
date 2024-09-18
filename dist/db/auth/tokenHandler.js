import jwt from 'jsonwebtoken';
import "dotenv/config";
export function isValidRefreshToken(refreshToken) {
    const secret = process.env.RTSALT;
    if (!secret) {
        console.log("Secret not found");
        return "";
    }
    try {
        const verifiedToken = jwt.verify(refreshToken, secret);
        console.log(typeof verifiedToken);
        // check the database to see if the refresh token exists
    }
    catch (e) {
        console.log("REFRESH NOT VALID");
    }
}
export function generateRefreshToken() {
    const secret = process.env.RTSALT;
    if (!secret) {
        console.log("Secret not found");
        return;
    }
    return jwt.sign({ username: "NOVA", data: "Mew", permissions: "None" }, secret, { expiresIn: "2m" });
}
