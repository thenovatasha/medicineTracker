import { Request, Response } from "express";
import { setRefreshToken } from "../../db/auth/tokenHandler";
import { decodeAccessToken } from "../util/tokens";
export async function logoutHandler(req: Request, res: Response) {

    // clear cookies from browser
    console.log("INSIDE LOGOUT HANDLER");
    console.log(req.cookies.a_token);
    const result = decodeAccessToken(req.cookies.a_token);
    if(typeof result == 'string') {
        return;
    }
    await logout(res, result.username);
    // TODO: Check if body is correct
    //res.redirect("/login");
    return res.status(200).json({status: "logged out"});
}

/**
 * Clears both cookies, and nullifies the refresh token
 * @param res 
 * @param username 
 */
export async function logout(res: Response, username: string) {
    res.clearCookie("a_token");
    res.clearCookie("r_token");
    // invalidate refresh token
    console.log("nullifying token for" + username);
    setRefreshToken(username, null);
}