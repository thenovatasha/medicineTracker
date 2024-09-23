import { JwtPayload } from "jsonwebtoken"

export interface Payload extends JwtPayload {
    username: string,
}

export type TokenPair = {
  a_token: string,
  r_token: string
}
