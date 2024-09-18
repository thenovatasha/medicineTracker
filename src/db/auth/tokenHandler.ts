import jwt, {JwtPayload } from 'jsonwebtoken';
import "dotenv/config";


export function decodeRefreshToken(refreshToken: string): JwtPayload | string {
    const secret = process.env.RTSALT;
    if (!secret) {
        return "";
    }
    try {
        const verifiedToken = jwt.verify(refreshToken, secret);
        return verifiedToken;
    } catch(e) {
        console.log("REFRESH NOT VALID");
    }
    return "";
}

export function generateRefreshToken(data: object): string | undefined {
    const secret = process.env.RTSALT;
    if (!secret) {
        console.log("Secret not found");
        return;
    }
    return jwt.sign(data, secret, { expiresIn: "2m" });
}

