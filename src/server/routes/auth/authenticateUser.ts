import {NextFunction, Request, Response } from "express";
import { decodeAccessToken, decodeRefreshToken, signAccessToken, signRefreshToken } from "../../util/tokens";
import { getRefreshToken } from "../../../db/find";
import { Payload } from "../../../types/Payload";
import { assert } from "console";
import { setRefreshToken } from "../../../db/auth/tokenHandler";
enum ACCESS_STATE {
    INVALID_ACCESS_TOKEN,
    VALID_ACCESS_TOKEN,
    INVALID_REFRESH_TOKEN,
    VALID_REFRESH_TOKEN
}

export async function authorizeUser(req: Request, res: Response, next: NextFunction) {
    
    let accessStatus: ACCESS_STATE = ACCESS_STATE.INVALID_ACCESS_TOKEN;
    const refreshToken = req.cookies.r_token;
    const accessToken = req.cookies.a_token;
    console.log("ACCESS TOKEN: ");
    console.log(accessToken);
    console.log("REFRESH TOKEN: ");
    console.log(refreshToken);
    // check for valid tokens
    let accessTokenDecoded;
    try {
        accessTokenDecoded = decodeAccessToken(req.cookies.a_token);
        if(typeof accessTokenDecoded == "string") {
            return res.status(500).json({detail: "Wrong expected return payload"});
        }
        accessStatus = ACCESS_STATE.VALID_ACCESS_TOKEN;
    } catch(e) {
        accessStatus = ACCESS_STATE.INVALID_ACCESS_TOKEN;
    }
    console.log("ACCESS STATUS IS: ")
    console.log(accessStatus);
    if(accessStatus === ACCESS_STATE.INVALID_ACCESS_TOKEN) {
        // check for validity of refresh token
        let refreshTokenDecoded: Payload | string;

        try {
            refreshTokenDecoded = decodeRefreshToken(req.cookies.r_token);        
            if(typeof refreshTokenDecoded === "string") {
                return res.status(500).json({detail: "Wrong expected return payload"});
            }
            accessStatus = ACCESS_STATE.VALID_REFRESH_TOKEN;
        } catch (e) {
            accessStatus = ACCESS_STATE.INVALID_REFRESH_TOKEN;
            return res.status(500).json({detail: "INVALID REFRESH TOKEN"});
        }
    
        assert(accessStatus === ACCESS_STATE.VALID_REFRESH_TOKEN);
        const db_result = await getRefreshToken(refreshTokenDecoded.username);
        if(!db_result) {
            return res.status(400).json({status: "DB HAS NO REFRESH TOKEN"});
        }        
        const db_refresh_token = db_result.refreshToken;
        
        assert(db_refresh_token !== null);
        if(refreshToken !== db_refresh_token) {
            return res.status(400).json(
                {status: "THIS TOKEN WAS USED!! HACKERMAN DETECTED"});
        }

        // since all is passed, refresh token was valid and never used before. 
        // create a new pair and send back
        const newAccessToken = signAccessToken({username: refreshTokenDecoded.username});
        const newRefreshToken = signRefreshToken({username: refreshTokenDecoded.username});
        await setRefreshToken(refreshTokenDecoded.username, newRefreshToken);
        // for any handlers in the current cycle
        req.cookies.a_token = newAccessToken;
        // @ts-ignore
        req.username = refreshTokenDecoded.username;
        // reset cookies for the browser
        res.cookie("a_token", newAccessToken);
        res.cookie("r_token", newRefreshToken);
        console.log("new rt-at pair set");
    }
    // check if refresh token was previously used
    console.log("access token valid");
    if(accessStatus === ACCESS_STATE.VALID_ACCESS_TOKEN) {
        // @ts-ignore
        req.username = accessTokenDecoded.username;
    }
    next();
}