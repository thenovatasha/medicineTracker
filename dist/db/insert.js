var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { getDb } from "./db.js";
import { env } from "process";
/**
    Creates a user in the database, throws an Error if user already exists.
    Returns true if creation successful,
    False otherwise
*/
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.DB_NAME) {
            console.error("DB_NAME WAS NOT FOUND");
            return false;
        }
        if (!env.SALT_ROUNDS) {
            console.error("SALT ROUND WAS NOT FOUND");
            return false;
        }
        // load in the db
        const db = yield getDb(env.DB_NAME);
        const users = db.collection("User");
        // hash the password including the salt, and store it in the db
        if (yield userExists(user.username, users)) {
            throw Error("USER ALREADY EXISTS");
        }
        else {
            // hash, and insert
            let hashedPassword = yield bcrypt.hash(user.password, Number(env.SALT_ROUNDS));
            yield users.insertOne({
                username: user.username,
                password: hashedPassword,
                dateJoined: Date.now(),
                refreshToken: null
            });
        }
        return true;
    });
}
/**
    Create a medicine for the given user. Handle first-time insertion too.
 */
function userExists(username, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        // query the database to see if the user exits
        if (yield collection.findOne({ username: username })) {
            return true;
        }
        else {
            return false;
        }
    });
}
/**
    Create a medicine for the given user. Handle first-time insertion too.
 */
export function createMedicine(username, medicine) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.DB_NAME) {
            return;
        }
        const db = yield getDb(env.DB_NAME);
        const collection = db.collection("UserMedicine");
        const result = yield collection.findOne({ username: username }, { projection: { medicines: 1 } });
        if (!result) {
            return collection.insertOne({ username: username, medicines: [medicine] });
        }
        const medicineExists = collection.findOne({ username: username,
            "meds.name": medicine.name });
        if (!medicineExists) {
            return collection.updateOne({ username: username }, { $push: { medicines: medicine } });
        }
        else {
            throw new Error("Medicine exists");
        }
    });
}
export function forgotDose(username, medicineName, dose) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.DB_NAME) {
            return;
        }
        // db calls
        const db = yield getDb(env.DB_NAME);
        const collection = db.collection("UserMedicine");
        // filter and update
        const filter = { username: username, "meds.name": medicineName };
        const updateDocument = {
            $inc: {
                "meds.$.missed": -dose
            }
        };
        return collection.updateOne(filter, updateDocument);
    });
}
export function extraDose(username, medicineName, dose) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.DB_NAME) {
            return;
        }
        // db calls
        const db = yield getDb(env.DB_NAME);
        const collection = db.collection("UserMedicine");
        // filter and update
        const filter = { username: username, "meds.name": medicineName };
        const updateDocument = {
            $inc: {
                "meds.$.missed": dose
            }
        };
        return collection.updateOne(filter, updateDocument);
    });
}
