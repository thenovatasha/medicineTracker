import { Db, MongoClient, Collection } from "mongodb";
import { User } from "../types/User";

// the password functionality
const url: string = "mongodb://localhost:27017";
let client: MongoClient | null;
export const DB_NAME: string = process.env.DB_NAME || "tracker";



// create a connection to the database if one doesn't already exist
async function connectToDatabase() {
    if (!client) {
    	client = new MongoClient(url);
	}
}

/**
 * Returns a database connection, or creates one if one doesn't exist
 * @param dbName the name of the database to get
 * @returns Promise<Db>
 */
export async function getDb(dbName: string): Promise<Db> {
    if (!client) {
        await connectToDatabase();
    }
    // check if client still doesn't exist
    if (!client) {
        throw Error("DATABASE ERROR");
    }
    return client.db(dbName);
}

export async function getUsersCollection(): Promise<Collection<User>> {
    const db_name = process.env.DB_NAME;
    if(!db_name) {
        throw Error("db does not exist");
    }
    const db = await getDb(db_name);
    return db.collection<User>("user")
}

