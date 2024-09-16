import bcrypt from "bcrypt";
import { getDb } from "./db.js";
import { env } from "process";
import { Collection } from "mongodb";
import { Medicine, UserHasMeds } from "../types/Medicine.js";
import { User } from "../types/User.js";

/**
    Creates a user in the database, throws an Error if user already exists.
    Returns true if creation successful,
    False otherwise
*/ 
export async function createUser(user: User): Promise<boolean> {
    if (!env.DB_NAME) {
        console.error("DB_NAME WAS NOT FOUND");
        return false;
    }
    if (!env.SALT_ROUNDS) {
        console.error("SALT ROUND WAS NOT FOUND");
        return false;
    }
    // load in the db
    const db = await getDb(env.DB_NAME);
    const users = db.collection<User>("User");

    // hash the password including the salt, and store it in the db
    if (await userExists(user.username, users)) {
        throw Error("USER ALREADY EXISTS");
    } else {
        // hash, and insert
        let hashedPassword = await bcrypt.hash(user.password, Number(env.SALT_ROUNDS));
        await users.insertOne({
            username: user.username,
            password: hashedPassword,
            dateJoined: Date.now(),
            refreshToken: null
        });
    }
    return true;
}

/**
    Create a medicine for the given user. Handle first-time insertion too.
 */
async function userExists(username: string, collection: Collection<User>): 
    Promise<boolean> {

    // query the database to see if the user exits
    if (await collection.findOne({ username: username })) {
        return true;
    } else {
        return false;
    }
}

/**
    Create a medicine for the given user. Handle first-time insertion too.
 */
export async function createMedicine(username: string, medicine: Medicine) {
    if(!env.DB_NAME) {
        return;
    }
    const db = await getDb(env.DB_NAME);
    const collection = db.collection<UserHasMeds>("UserMedicine");
    const result = await collection.findOne({username: username}, 
                                            {projection: {medicines: 1}});

    if(!result) {
        return collection.insertOne({username: username, medicines: [medicine]})

    } else {        
        return collection.updateOne({username: username},
                                    {$push: {medicines: medicine}})
    }
}

export async function forgotDose(username: string, medicineName: string,
                                 dose: number) 
{
    if(!env.DB_NAME) {
        return;
    }
    // db calls
    const db = await getDb(env.DB_NAME);
    const collection = db.collection<UserHasMeds>("UserMedicine");
    
    // filter and update
    const filter = {username: username, "meds.name": medicineName};
    const updateDocument = {
        $inc: {
            "meds.$.missed": -dose
        }
    }
    return collection.updateOne(filter, updateDocument);
}

export async function extraDose(username: string, medicineName: string, 
                                dose: number)
{
    if(!env.DB_NAME) {
        return;
    }
    // db calls
    const db = await getDb(env.DB_NAME);
    const collection = db.collection<UserHasMeds>("UserMedicine");

    // filter and update
    const filter = {username: username, "meds.name": medicineName};
    const updateDocument = {
        $inc: {
            "meds.$.missed": dose
        }
    }
    return collection.updateOne(filter, updateDocument);
}