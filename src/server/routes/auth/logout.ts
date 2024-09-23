import { Request, Response } from "express-serve-static-core";
import { setRefreshToken } from "../../../db/auth/tokenHandler.js";


export async function logoutHandler(req: Request, res: Response) {

    //! TODO: switch to a request-attachment style username decoder 
    // clear cookies from browser
    const { username } = req.body;
    await logout(res, username);
    // TODO: Check if body is correct
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
    setRefreshToken(username, null);
}