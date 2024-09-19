import { Request, Response } from "express";
import { setRefreshToken } from "../../db/auth/tokenHandler";
import { decodeAccessToken } from "../util/tokens";
export function logoutHandler(req: Request, res: Response) {

    // clear cookies from browser
    console.log(req.cookies);
    const result = decodeAccessToken(req.cookies.a_token);
    if(typeof result == 'string') {
        return;
    }
    logout(res, result.username);
    // TODO: Check if this makes any difference
    res.redirect("/login");
    return;
}

/**
 * Clears both cookies, and nullifies the refresh token
 * @param res 
 * @param username 
 */
export function logout(res: Response, username: string): void {
    res.clearCookie("a_token");
    res.clearCookie("r_token");
    // invalidate refresh token
    setRefreshToken(username, null);
}