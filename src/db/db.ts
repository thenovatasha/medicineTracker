import { Db, MongoClient, Collection } from "mongodb";
import { User } from "../types/User";
import { UserHasMeds } from "../types/Medicine";
import { DatabaseError } from "../types/Errors";
import { ConfigError } from "../types/Errors";

const url = process.env.CONNECTION_STRING || "err";
let client: MongoClient | null;
const DB_NAME: string = process.env.DB_NAME || "err";

// create a connection to the database if one doesn't already exist
async function connectToDatabase() {
    if(url === "err" || DB_NAME === "err") {
        throw new ConfigError("database connection string missing");
    }
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
        throw new DatabaseError("database could not connect");
    }
    return client.db(DB_NAME);
}

/**
 * Abstracted calls to get the medicine collection
 * @returns 
 */
export async function getUsersCollection(): Promise<Collection<User>> {
    
    const db = await getDb();
    return db.collection<User>("user");
}

/**
 * Abstracted calls to get the medicine collection
 * @returns 
 */
export async function getMedicineCollection(): Promise<Collection<UserHasMeds>> {
    
    const db = await getDb();
    return db.collection<UserHasMeds>("medicine");
}