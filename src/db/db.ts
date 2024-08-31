import { Collection, Db, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// the password functionality
const SALT_ROUNDS = 10;

const url: string = "mongodb://localhost:27017";
let client: MongoClient | null;
const DB_NAME: string = "medTracker";
type User = {
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

// Creates a user in the database, throws an Error if user already exists
export async function createUser(user: User) {
  const db = await getDb(DB_NAME);
  const collection = db.collection("User");

  // check if user exists
  if (await userExists(user.username, collection)) {
    throw Error("USER ALREADY EXISTS");
  } else {
    // hash the password including the salt, and store it in the db
    let hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    await collection.insertOne({
      username: user.username,
      password: hashedPassword,
    });
  }

  return true;
}

// check if a user already exists in the database
async function userExists(
  username: string,
  collection: Collection
): Promise<boolean> {
  // query the database to see if the user exits
  if (await collection.findOne({ username: username })) {
    return true;
  } else {
    return false;
  }
}

export async function getPassword(username: string, collection: Collection) {
  const projection = { projection: { _id: 0, password: 1 } };
  return collection.findOne({ username: username }, projection);
}
