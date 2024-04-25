import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src/index";
import { generateUser } from "./generators/mockUser";

const newPassword = "hashedPassword";

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => newPassword),
	compareSync: jest.fn(
		(oldPassword: string, newPassword: string) =>
			oldPassword === newPassword,
	),
}));

const mockUser = generateUser();

describe("Password endpoints", () => {
	it("should successfully change the password for a valid user and correct old password", async () => {
		prismaMock.user.findUnique.mockResolvedValue(mockUser);
		prismaMock.user.update.mockResolvedValue({
			...mockUser,
			password: newPassword,
		});

		await request(httpServer)
			.put("/password")
			.send({
				username: mockUser.username,
				oldPassword: mockUser.password,
				newPassword,
			})
			.expect(204);
	});

	it("should return a bad request if the old password is incorrect", async () => {
		const oldPassword = "incorrectOldPassword";

		prismaMock.user.findUnique.mockResolvedValue(mockUser);

		const res = await request(httpServer)
			.put("/password")
			.send({ username: mockUser.username, oldPassword, newPassword })
			.expect(400);

		expect(res.body).toEqual({
			status: "error",
			error: "Wrong password.",
		});
	});

	it("should return not found if the user does not exist", async () => {
		const username = "nonexistentUser";

		prismaMock.user.findUnique.mockResolvedValue(null);

		const res = await request(httpServer)
			.put("/password")
			.send({ username, oldPassword: mockUser.password, newPassword })
			.expect(404);

		expect(res.body).toEqual({
			status: "error",
			error: "Cannot find user with given username.",
		});
	});

	it("should handle database errors during password update", async () => {
		prismaMock.user.findUnique.mockResolvedValue(mockUser);
		prismaMock.user.update.mockRejectedValue(new Error("Database error"));

		const res = await request(httpServer)
			.put("/password")
			.send({
				username: mockUser.username,
				oldPassword: mockUser.password,
				newPassword,
			})
			.expect(400);

		expect(res.body).toEqual({
			status: "error",
			error: {},
		});
	});
});
