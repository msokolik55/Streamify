// import bcrypt from "bcrypt";
import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src/index";

jest.mock("fs", () => ({
	existsSync: jest.fn(() => true),
	readdirSync: jest.fn(() => ["test.jpg"]),
	unlinkSync: jest.fn(),
}));

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => "hashedPassword"),
}));

interface IUserWithoutPassword {
	id: string;
	username: string;
	email: string;
	picture: string | null;
	createdAt: Date;
	updatedAt: Date;
	streamKey: string | null;
}

interface IMockedUser extends IUserWithoutPassword {
	password: string;
}

const baseMockUser: IMockedUser = {
	id: "1",
	username: "testuser",
	email: "test@example.com",
	password: "dummyPassword",
	picture: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	streamKey: null,
};

const getTimeFromDate = (date: Date) => new Date(date).getTime();

describe("User endpoints", () => {
	describe("GET /users", () => {
		it("should return all users", async () => {
			const mockUsers = [
				baseMockUser,
				{
					...baseMockUser,
					id: "2",
					username: "testuser2",
					streamKey: "streamKey2",
				},
			];

			prismaMock.user.findMany.mockResolvedValue(mockUsers);

			const res = await request(httpServer).get("/users");
			expect(res.status).toBe(200);
			res.body.data.forEach((user: IMockedUser, index: number) => {
				expect(user.id).toEqual(mockUsers[index].id);
				expect(user.username).toEqual(mockUsers[index].username);
				expect(user.email).toEqual(mockUsers[index].email);
				expect(user.picture).toEqual(mockUsers[index].picture);
				expect(user.streamKey).toEqual(mockUsers[index].streamKey);
				expect(user.password).toEqual(mockUsers[index].password);

				expect(getTimeFromDate(user.createdAt)).toEqual(
					getTimeFromDate(mockUsers[index].createdAt),
				);
				expect(getTimeFromDate(user.updatedAt)).toEqual(
					getTimeFromDate(mockUsers[index].updatedAt),
				);
			});
			expect(res.body.status).toEqual("success");
		});
	});

	// describe("POST /users", () => {
	// 	it("should create a new user", async () => {
	// 		const newUserDetails = {
	// 			username: "newuser",
	// 			email: "new@example.com",
	// 			password: "password",
	// 		};
	// 		const newUser = {
	// 			...baseMockUser,
	// 			...newUserDetails,
	// 		};
	// 		prisma.user.create.mockResolvedValue(newUser);

	// 		const res = await request(api).post("/users").send(newUser);
	// 		console.log(res.body);
	// 		expect(res.status).toBe(201);
	// 		expect(res.body).toEqual({
	// 			id: newUser.id,
	// 			username: newUser.username,
	// 			email: newUser.email,
	// 			picture: newUser.picture,
	// 			createdAt: newUser.createdAt,
	// 			updatedAt: newUser.updatedAt,
	// 			streamKey: newUser.streamKey,
	// 			streams: [],
	// 		});
	// 		expect(bcrypt.hashSync).toHaveBeenCalledWith("password", 10);
	// 	});
	// });

	// describe("GET /users/:username", () => {
	// 	it("should return a user by username", async () => {
	// 		prisma.user.findUnique.mockResolvedValue(baseMockUser);

	// 		const res = await request(api).get(
	// 			`/users/${baseMockUser.username}`,
	// 		);
	// 		expect(res.status).toBe(200);
	// 		expect(res.body).toEqual(baseMockUser);
	// 	});
	// });

	// describe("PATCH /users/:id", () => {
	// 	it("should update user data", async () => {
	// 		const userUpdate = {
	// 			username: "testuser",
	// 			email: "update@example.com",
	// 			streamKey: "updatedStream",
	// 		};
	// 		prisma.user.update.mockResolvedValue(baseMockUser);

	// 		const res = await request(api)
	// 			.patch(`/users/${baseMockUser.id}`)
	// 			.send(userUpdate);
	// 		expect(res.status).toBe(204);
	// 	});
	// });

	// describe("DELETE /users/:username", () => {
	// 	it("should delete a user", async () => {
	// 		prisma.user.delete.mockResolvedValue(baseMockUser);

	// 		const res = await request(api).delete(
	// 			`/users/${baseMockUser.username}`,
	// 		);
	// 		expect(res.status).toBe(204);
	// 	});
	// });

	// describe("PATCH /users/live/:id", () => {
	// 	it("should update the live status of a user", async () => {
	// 		prisma.user.update.mockResolvedValue(baseMockUser);

	// 		const res = await request(api)
	// 			.patch(`/users/live/${baseMockUser.id}`)
	// 			.send({ live: true });
	// 		expect(res.status).toBe(204);
	// 	});
	// });
});
