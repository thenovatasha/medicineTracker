import { Payload } from "../../types/Payload.js";
import jwt from "jsonwebtoken";


/**
 * Creates a jwt token with the payload for 30d by default.
 * @param payload 
 * @returns Signed Token
 */
export function signRefreshToken(payload: Payload): string {
    const secret = process.env.JWT_REFRESH_KEY;
    if(!secret) {
        throw new ConfigError("JWT_REFRESH_KEY missing");
    }
    return jwt.sign(payload, secret, { expiresIn: "30d" });
}

/**
 * Creates a jwt token with the payload for 5m by default.
 * @param payload 
 * @returns Signed token
 */
export function signAccessToken(payload: Payload): string {
    const secret = process.env.JWT_ACCESS_KEY;
    if(!secret) {
        throw new ConfigError("JWT_ACCESS_KEY missing");
    }
    // TODO: SET BACK TO 5m
    return jwt.sign(payload, secret, { expiresIn: "30s" });
}

/**
 * Throws Error if token is invalid, empty token if refresh key was not found
 * @param refreshToken 
 * @returns Payload
 */
export function decodeRefreshToken(refreshToken: string): Payload | string {
    const secret = process.env.JWT_REFRESH_KEY;
    if (!secret) {
        return "";
    }
    const verifiedToken = jwt.verify(refreshToken, secret);
    return verifiedToken as Payload;
}

/**
 * Throws Error if token is invalid, empty token if refresh key was not found
 * @param refreshToken 
 * @returns Payload
 */
export function decodeAccessToken(accessToken: string): Payload | string {
    const secret = process.env.JWT_ACCESS_KEY;
    if (!secret) {
        return "";
    }

    const verifiedToken = jwt.verify(accessToken, secret);
    return verifiedToken as Payload;
}


