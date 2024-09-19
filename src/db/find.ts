import { Collection } from "mongodb";
import { User } from "../types/User.js";
import { getUsersCollection } from "./db.js";
/**
 * Get the password for the user in question
 * @param username 
 * @param collection 
 * @returns 
 */
export async function getPassword(username: string, collection: Collection<User>) {
    if(!username) {
        return null;
    }
    const projection = { projection: { _id: 0, password: 1 } };
    return collection.findOne({ username: username }, projection);
}

/**
    Check if the user exists.
 */
export async function userExists(username: string, collection?: Collection<User>): 
    Promise<boolean> {
    if(!collection) {
        collection = await getUsersCollection();
    }
    // query the database to see if the user exits
    if (await collection.findOne({ username: username })) {
        return true;
    } else {
        return false;
    }
}

export async function getRefreshToken(username: string) {
    const collection = await getUsersCollection();

    const projection = {projection: { _id: 0, refreshToken: 1}};
    return await collection.findOne({username: username}, projection);

}