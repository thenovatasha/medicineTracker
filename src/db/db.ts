import { Db, MongoClient, Collection } from "mongodb";
import { User } from "../types/User";
import { UserHasMeds } from "../types/Medicine";


// the password functionality
const url: string = "mongodb://localhost:27017";
let client: MongoClient | null;
const DB_NAME: string = process.env.DB_NAME || "err";

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
export async function getDb(): Promise<Db> {
    if (!client) {
        await connectToDatabase();
    }
    // check if client still doesn't exist
    if (!client) {
        throw Error("DATABASE ERROR");
    }
    return client.db(DB_NAME);
}

/**
 * Abstracted calls to get the medicine collection
 * @returns 
 */
export async function getUsersCollection(): Promise<Collection<User>> {
    
    const db = await getDb();
    return db.collection<User>("user")
}

/**
 * Abstracted calls to get the medicine collection
 * @returns 
 */
export async function getMedicineCollection(): Promise<Collection<UserHasMeds>> {
    
    const db = await getDb();
    return db.collection<UserHasMeds>("medicine");
}