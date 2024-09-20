import { Collection } from "mongodb";
import { getPassword } from "../src/db/find";
import {User} from "../src/types/User";


describe("getPassword", () => {
    let collectionMock: Partial<Collection<User>>;
    let projection: any;
    beforeEach(() => {
        
        collectionMock = { findOne: jest.fn()};
        projection = { projection: { _id: 0, password: 1 } };
    });

    test("empty string in username should return null", async () => {

    const result = await getPassword("", collectionMock as Collection<User>);
    expect(result).toBe(null);

    });

    test("valid username should call the database", async () => {
        await getPassword("nova", collectionMock as Collection<User>);
        expect(collectionMock.findOne).toHaveBeenCalledTimes(1);
        expect(collectionMock.findOne).toHaveBeenCalledWith({username: "nova"}, projection);
    });

    test("valid username should call the database", async () => {
        await getPassword(" ", collectionMock as Collection<User>);
        expect(collectionMock.findOne).toHaveBeenCalledTimes(1);
        expect(collectionMock.findOne).toHaveBeenCalledWith({username: " "}, projection);
    });
})
