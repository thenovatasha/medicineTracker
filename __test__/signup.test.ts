import {Request, Response} from "express";
import { createUser } from "../src/db/insert"
import { signupHandler } from "../src/server/routes/signup";
import { signRefreshToken } from "../src/server/util/tokens";
import { StatusResponse } from "../src/types/ResponseStatus";

// Mock the dependencies
jest.mock("../src/db/insert");
jest.mock("../src/server/util/tokens");

describe("signupHandler", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                username: "testuser",
                password: "testpassword",
            },
        };

        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a user successfully", async () => {
        (createUser as jest.Mock).mockResolvedValueOnce({});
        (signRefreshToken as jest.Mock).mockReturnValueOnce("mockRefreshToken");

        await signupHandler(req as Request, res as Response);

        expect(createUser).toHaveBeenCalledWith({
            username: "testuser",
            password: "testpassword",
            dateJoined: expect.any(Number),
            refreshToken: "mockRefreshToken",
        });

        expect(signRefreshToken).toHaveBeenCalledWith({ username: "testuser" });

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ creationStatus: "success" });
    });

    it("should handle errors during user creation", async () => {
        const error = new Error("Database error");
        (createUser as jest.Mock).mockRejectedValueOnce(error);
        (signRefreshToken as jest.Mock).mockReturnValueOnce("mockRefreshToken");
        await signupHandler(req as Request, res as Response);

        expect(createUser).toHaveBeenCalledWith({
            username: "testuser",
            password: "testpassword",
            dateJoined: expect.any(Number),
            refreshToken: expect.any(String),
        });

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ creationStatus: "failure" });
    });
});