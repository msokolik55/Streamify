import bcrypt from "bcrypt";
import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src/index";
import { generateUser } from "./generators/mockUser";

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => "hashedPassword"),
}));

const mockUser = generateUser();

describe("Password endpoints", () => {
	it("should successfully change the password for a valid user and correct old password", async () => {
		const newPassword = "newPassword";

		prismaMock.user.findUnique.mockResolvedValue(mockUser);
		prismaMock.user.update.mockResolvedValue({
			...mockUser,
			password: bcrypt.hashSync(newPassword, 10),
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
		const newPassword = "newPassword";

		prismaMock.user.findUnique.mockResolvedValue({
			...mockUser,
			password: bcrypt.hashSync("actualOldPassword", 10),
		});

		const res = await request(httpServer)
			.put("/password")
			.send({ username: mockUser.username, oldPassword, newPassword })
			.expect(400);

		expect(res.body).toEqual({
			status: "error",
			error: {},
		});
	});

	it("should return not found if the user does not exist", async () => {
		const username = "nonexistentUser";
		const oldPassword = "oldPassword";
		const newPassword = "newPassword";

		// No user found
		prismaMock.user.findUnique.mockResolvedValue(null);

		const res = await request(httpServer)
			.put("/password")
			.send({ username, oldPassword, newPassword })
			.expect(404);

		expect(res.body).toEqual({
			status: "error",
			error: "Cannot find user with given username.",
		});
	});

	it("should handle database errors during password update", async () => {
		const oldPassword = "oldPassword";
		const newPassword = "newPassword";

		prismaMock.user.findUnique.mockResolvedValue({
			...mockUser,
			password: bcrypt.hashSync(oldPassword, 10),
		});

		prismaMock.user.update.mockRejectedValue(new Error("Database error"));

		const res = await request(httpServer)
			.put("/password")
			.send({ username: mockUser.username, oldPassword, newPassword })
			.expect(400);

		expect(res.body).toEqual({
			status: "error",
			error: {},
		});
	});
});
