import { Request, Response } from "express-serve-static-core";
import { setRefreshToken } from "../../db/update";
import { StatusResponse } from "../../types/ResponseStatus";


export async function logoutHandler(req: Request, res: Response<StatusResponse>) {

    // clear cookies from browser
    const { username } = req.body;
    await logout(res, username);
    // TODO: Check if body is correct
    return res.status(200).json({status: "success"});
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
    await setRefreshToken(username, null);
}