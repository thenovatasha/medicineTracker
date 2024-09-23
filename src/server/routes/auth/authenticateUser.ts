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
    
    const refreshToken = req.cookies.r_token;
    let accessStatus: ACCESS_STATE = ACCESS_STATE.INVALID_ACCESS_TOKEN;
    let accessTokenDecoded;

    // check for valid access token   
    try {
        accessTokenDecoded = decodeAccessToken(req.cookies.a_token);
        if(typeof accessTokenDecoded == "string") {
            return res.status(500).json({detail: "Wrong expected return payload"});
        }
        accessStatus = ACCESS_STATE.VALID_ACCESS_TOKEN;
    } catch(e) {
        accessStatus = ACCESS_STATE.INVALID_ACCESS_TOKEN;
    }

    /* 
        Check if a valid refresh token exists to refresh the access.
        A valid refresh token is a token that is not yet revoked and is still
        within expiry
    */
    if(accessStatus === ACCESS_STATE.INVALID_ACCESS_TOKEN) {
        
        let refreshTokenDecoded: Payload | string;
        // check for validity of refresh token
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
        // ensure that the token wasn't revoked
        // TODO: Test this
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
        
        // for any handlers in the current request-response cycle
        req.cookies.a_token = newAccessToken;
        // @ts-ignore
        req.body.username = refreshTokenDecoded.username;
        res.cookie("a_token", newAccessToken);
        res.cookie("r_token", newRefreshToken);
    }

    // check if refresh token was previously used
    if(accessStatus === ACCESS_STATE.VALID_ACCESS_TOKEN) {
        // @ts-ignore
        req.body.username = accessTokenDecoded.username;
    }
    next();
}