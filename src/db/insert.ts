import bcrypt from "bcrypt";
import { getDb } from "./db";
import { env } from "process";
import { Medicine, UserHasMeds } from "../types/Medicine";
import { User } from "../types/User";
import { userExists } from "./find";

/**
    Creates a user in the database, throws an Error if user already exists.
    Returns true if creation successful,
    False otherwise
*/ 
export async function createUser(user: User): Promise<boolean> {

    if (!env.SALT_ROUNDS) {
        console.error("SALT ROUND WAS NOT FOUND");
        return false;
    }
    // load in the db
    const db = await getDb();
    const users = db.collection<User>("user");

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
    Throws error if a medicine was already there with that name
 */
export async function createMedicine(username: string, medicine: Medicine) {

    const db = await getDb();
    const collection = db.collection<UserHasMeds>("medicine");
    const result = await collection.findOne({username: username}, 
                                            {projection: {medicines: 1}});

    if(!result) {
        return collection.insertOne({username: username, medicines: [medicine]})

    }
    console.log(medicine.name);
    const medicineExists = await collection.findOne({username: username,
                                              "medicines.name": medicine.name});
    console.log(medicineExists);
    if(!medicineExists) {
        return collection.updateOne({username: username},
                                    {$push: {medicines: medicine}})
    } else {
        throw new Error("medicine exists");
    }
}

export async function forgotDose(username: string, medicineName: string,
                                 dose: number) 
{
    // db calls
    const db = await getDb();
    const collection = db.collection<UserHasMeds>("medicine");
    
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
    // db calls
    const db = await getDb();
    const collection = db.collection<UserHasMeds>("medicine");

    // filter and update
    const filter = {username: username, "meds.name": medicineName};
    const updateDocument = {
        $inc: {
            "meds.$.missed": dose
        }
    }
    return collection.updateOne(filter, updateDocument);
}