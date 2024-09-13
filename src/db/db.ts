import { Collection, Db, MongoClient } from "mongodb";

// the password functionality

const url: string = "mongodb://localhost:27017";
let client: MongoClient | null;

export type User = {
    username: string;
	password: string;
};

// create a connection to the database if one doesn't already exist
async function connectToDatabase() {
    if (!client) {
    	client = new MongoClient(url);
	}
}

// return the database
export async function getDb(dbName: string) {
    if (!client) {
        await connectToDatabase();
    }
    // check if client still doesn't exist
    if (!client) {
        throw Error("DATABASE ERROR");
    }
    return client.db(dbName);
}

export async function getPassword(username: string, collection: Collection) {
    const projection = { projection: { _id: 0, password: 1 } };
    return collection.findOne({ username: username }, projection);
}
