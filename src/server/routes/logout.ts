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
    res.clearCookie("a_token");
    res.clearCookie("r_token");
    // invalidate refresh token
    setRefreshToken(result.username, null);


    // TODO: Check if this makes any difference
    req.body = {};
    res.redirect("localhost:5173/");
    return;
}