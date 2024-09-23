
import { getDb } from "../db";
import { User } from "../../types/User";
import { userExists } from "../find";


export async function setRefreshToken(username: string,
                                      refreshToken: string | null) {
    const db_name = process.env.DB_NAME;    
    if(!db_name) {
        return null;
    }

    const db = await getDb();
    const users = db.collection<User>("user");
    // insert into the users table, where the refreshToken belongs
    if (!await userExists(username, users)) {
        throw Error("TOKEN HANDLER: user doesn't exist after signup");
    } else {
        return users.updateOne({username: username},
                        {$set: {refreshToken: refreshToken}})
    }
}