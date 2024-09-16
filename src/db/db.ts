import { Db, MongoClient } from "mongodb";

// the password functionality
const url: string = "mongodb://localhost:27017";
let client: MongoClient | null;


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

