var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
// the password functionality
const url = "mongodb://localhost:27017";
let client;
// create a connection to the database if one doesn't already exist
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            client = new MongoClient(url);
        }
    });
}
/**
 * Returns a database connection, or creates one if one doesn't exist
 * @param dbName the name of the database to get
 * @returns Promise<Db>
 */
export function getDb(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            yield connectToDatabase();
        }
        // check if client still doesn't exist
        if (!client) {
            throw Error("DATABASE ERROR");
        }
        return client.db(dbName);
    });
}
