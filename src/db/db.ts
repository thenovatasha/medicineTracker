import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

type User = {
    name: string;
    password: string;
};

const dbName = "medTracker";

export async function createUser(user: User) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("User");

    await collection.insertOne({ name: user.name, password: user.password });
    return true;
}
