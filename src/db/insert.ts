import bcrypt from "bcrypt";
import { getDb } from "./db.js";
import { env } from "process";
import { Collection } from "mongodb";
import { User } from "./db.js";

// Create a new user with a password, created time,
// refresh token?

// Creates a user in the database, throws an Error if user already exists
export async function createUser(user: User) {
    if (!env.DB_NAME) {
        console.error("DB_NAME WAS NOT FOUND");
        return;
    }
    if (!env.SALT_ROUNDS) {
        console.error("SALT ROUND WAS NOT FOUND");
        return;
    }
    // load in the db
    const db = await getDb(env.DB_NAME);
    const collection = db.collection("User");

    
    // check if user exists
    if (await userExists(user.username, collection)) {
        throw Error("USER ALREADY EXISTS");
    } else {
        // hash the password including the salt, and store it in the db
        let hashedPassword = await bcrypt.hash(user.password, Number(env.SALT_ROUNDS));
        await collection.insertOne({
            username: user.username,
            password: hashedPassword,
        });

    }

    return true;
}

// check if a user already exists in the database
async function userExists(username: string, collection: Collection): 
    Promise<boolean> {

    // query the database to see if the user exits
    if (await collection.findOne({ username: username })) {
        return true;
    } else {
        return false;
    }
}

interface Medicine {
    name: string,
    size: Number;
}

interface UserDocument {
    username: string;
    medicines: Medicine[];
}
export async function createMedicine(username: string, medicine: Medicine) {
    if(!env.DB_NAME) {
        return;
    }
    const db = await getDb(env.DB_NAME);
    const collection = db.collection<UserDocument>("meds");
    // username
    // send a POST request to the server for the creation of the med
    const result = await collection.findOne({username: username}, {projection: {medicines: 1}});

    if(!result) {
        await collection.insertOne({username: username, medicines: [medicine]})
        console.log("INSERTED MEDICINES");

    } else {        
        await collection.updateOne({username: username}, {$push: {medicines: medicine}})
        console.log("MEDICINE PREVIOUSLY THERE");

    }
}