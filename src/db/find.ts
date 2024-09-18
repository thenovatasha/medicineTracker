import { Collection } from "mongodb";
import { User } from "../types/User.js";

/**
 * Get the password for the user in question
 * @param username 
 * @param collection 
 * @returns 
 */
export async function getPassword(username: string, collection: Collection<User>) {
    const projection = { projection: { _id: 0, password: 1 } };
    return collection.findOne({ username: username }, projection);
}
