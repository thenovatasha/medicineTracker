import bcrypt from "bcrypt";
import { getMedicineCollection, getUsersCollection } from "./db";
import { env } from "process";
import { Medicine  } from "../types/Medicine";
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
    const users = await getUsersCollection();

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

    const collection = await getMedicineCollection();
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


/**
 * Remove a dose from the medicine for the user
 * @param username 
 * @param medicineName 
 * @param dose 
 * @returns 
 */
export async function forgotDose(username: string, medicineName: string,
                                 dose: number) 
{

    const collection = await getMedicineCollection();   
    // filter and update
    const filter = {username: username, "medicines.name": medicineName};
    const updateDocument = {
        $inc: {
            "medicines.$.missed": -dose
        }
    }
    return collection.updateOne(filter, updateDocument);
}


/**
 * Add a dose to the particular medicine for that user
 * @param username 
 * @param medicineName 
 * @param dose 
 * @returns 
 */
export async function extraDose(username: string, medicineName: string, 
                                dose: number)
{
    const collection = await getMedicineCollection();

    // filter and update
    const filter = {username: username, "medicines.name": medicineName};
    const updateDocument = {
        $inc: {
            "medicines.$.missed": dose
        }
    }
    return collection.updateOne(filter, updateDocument);
}


/**
 * Set the medicine list to the medicine collection for the user
 * @param username 
 * @param medicineList 
 * @returns 
 */
export async function updateMedicinesList(username: string, medicineList: Medicine[]) {
    
    const collection = await getMedicineCollection();
    return collection.updateOne({username: username},
                                    {$set: {medicines: medicineList}})
}

export async function setRefreshToken(username: string,
                                      refreshToken: string | null) {

    const users = await getUsersCollection();
    // insert into the users table, where the refreshToken belongs
    if (!await userExists(username, users)) {
        throw Error("TOKEN HANDLER: user doesn't exist after signup");
    } else {
        return users.updateOne({username: username},
                        {$set: {refreshToken: refreshToken}})
    }
}