import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src/index";
import { generateUser, mockUser, mockUsers } from "./generators/mockUser";
import { IMockUser } from "./models/IMockUser";

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => "hashedPassword"),
}));

const getTimeFromDate = (date: Date) => new Date(date).getTime();

describe("User endpoints", () => {
	describe("GET /users", () => {
		it("should return all users", async () => {
			prismaMock.user.findMany.mockResolvedValue(mockUsers);

			const res = await request(httpServer).get("/users");
			expect(res.status).toBe(200);
			res.body.data.forEach((user: IMockUser, index: number) => {
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

		it("should return only users with a non-null streamKey when 'live' is true", async () => {
			const mockUsers = Array.from({ length: 3 }, () =>
				generateUser(true),
			);
			prismaMock.user.findMany.mockResolvedValue(
				mockUsers.filter((user) => user.streamKey !== null),
			);

			const res = await request(httpServer).get("/users?live=true");
			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(mockUsers.length);
			res.body.data.forEach((user: IMockUser) => {
				expect(user.streamKey).not.toBeNull();
			});
			expect(res.body.status).toEqual("success");
		});

		it("should return all users when 'live' is false", async () => {
			prismaMock.user.findMany.mockResolvedValue(mockUsers);

			const res = await request(httpServer).get("/users?live=false");
			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(mockUsers.length);
			expect(res.body.status).toEqual("success");
		});

		it("should return all users when 'live' is not true/false", async () => {
			prismaMock.user.findMany.mockResolvedValue(mockUsers);

			const res = await request(httpServer).get("/users?live=maybe");
			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(mockUsers.length);
			expect(res.body.status).toEqual("success");
		});

		it("should return empty users", async () => {
			prismaMock.user.findMany.mockResolvedValue([]);

			const res = await request(httpServer).get("/users");
			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(0);
			expect(res.body.status).toEqual("success");
		});
	});

	describe("POST /users", () => {
		it("should create a user successfully and return the user data", async () => {
			const newUser = generateUser();
			prismaMock.user.create.mockResolvedValue(newUser);

			const res = await request(httpServer)
				.post("/users")
				.send(newUser)
				.expect("Content-Type", /json/)
				.expect(201);

			expect(res.body.data.id).toEqual(newUser.id);
			expect(res.body.data.username).toEqual(newUser.username);
			expect(res.body.data.email).toEqual(newUser.email);
			expect(res.body.data.picture).toEqual(newUser.picture);
			expect(res.body.data.streamKey).toEqual(newUser.streamKey);
			expect(res.body.data.password).toEqual(newUser.password);
			expect(getTimeFromDate(res.body.data.createdAt)).toEqual(
				getTimeFromDate(newUser.createdAt),
			);
			expect(getTimeFromDate(res.body.data.updatedAt)).toEqual(
				getTimeFromDate(newUser.updatedAt),
			);

			expect(res.body.status).toEqual("success");
		});

		it("should return a 400 status if required fields are missing", async () => {
			const incompleteData = {
				email: "newuser@example.com",
				password: "password123",
			};

			const res = await request(httpServer)
				.post("/users")
				.send(incompleteData)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(res.body).toEqual({
				status: "error",
				error: "Missing username.",
			});
		});

		it("should handle database errors during user creation", async () => {
			const userData = {
				username: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			prismaMock.user.create.mockRejectedValue(
				new Error("Database failure"),
			);

			const res = await request(httpServer)
				.post("/users")
				.send(userData)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(res.body.status).toEqual("error");
		});

		it("should hash the user password before saving", async () => {
			const userData = {
				username: "secureuser",
				email: "secure@example.com",
				password: "securePassword123",
			};

			await request(httpServer).post("/users").send(userData).expect(201);
			expect(bcrypt.hashSync).toHaveBeenCalledWith(userData.password, 10);
		});
	});

	describe("GET /users/:username", () => {
		it("should return a user by username successfully", async () => {
			prismaMock.user.findUnique.mockResolvedValue(mockUser);

			const res = await request(httpServer)
				.get(`/users/${mockUser.username}`)
				.expect("Content-Type", /json/)
				.expect(200);

			expect(res.body.status).toEqual("success");

			expect(res.body.data.id).toEqual(mockUser.id);
			expect(res.body.data.username).toEqual(mockUser.username);
			expect(res.body.data.email).toEqual(mockUser.email);
			expect(res.body.data.picture).toEqual(mockUser.picture);
			expect(res.body.data.streamKey).toEqual(mockUser.streamKey);
			expect(res.body.data.password).toEqual(mockUser.password);
			expect(getTimeFromDate(res.body.data.createdAt)).toEqual(
				getTimeFromDate(mockUser.createdAt),
			);
			expect(getTimeFromDate(res.body.data.updatedAt)).toEqual(
				getTimeFromDate(mockUser.updatedAt),
			);
		});

		it("should return a 200 status if the username is not found", async () => {
			const username = faker.internet.userName();
			prismaMock.user.findUnique.mockResolvedValue(mockUser);

			const res = await request(httpServer)
				.get(`/users/${username}`)
				.expect("Content-Type", /json/)
				.expect(200);

			expect(res.body.status).toEqual("success");

			expect(res.body.data.id).toEqual(mockUser.id);
			expect(res.body.data.username).toEqual(mockUser.username);
			expect(res.body.data.email).toEqual(mockUser.email);
			expect(res.body.data.picture).toEqual(mockUser.picture);
			expect(res.body.data.streamKey).toEqual(mockUser.streamKey);
			expect(res.body.data.password).toEqual(mockUser.password);
			expect(getTimeFromDate(res.body.data.createdAt)).toEqual(
				getTimeFromDate(mockUser.createdAt),
			);
			expect(getTimeFromDate(res.body.data.updatedAt)).toEqual(
				getTimeFromDate(mockUser.updatedAt),
			);
		});

		it("should handle errors during user retrieval", async () => {
			const username = faker.internet.userName();
			const errorMessage = "Database connection error";
			prismaMock.user.findUnique.mockRejectedValue(
				new Error(errorMessage),
			);

			const res = await request(httpServer)
				.get(`/users/${username}`)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(res.body.status).toEqual("error");
		});
	});

	describe("PUT /users/:id", () => {
		it("should successfully update the same user and return status 204", async () => {
			mockUser.picture = "oldpicture.jpg";
			prismaMock.user.findUnique.mockResolvedValue(mockUser);
			prismaMock.user.update.mockResolvedValue(mockUser);

			await request(httpServer)
				.put(`/users/${mockUser.id}`)
				.send(mockUser)
				.expect(204);
		});

		it("should successfully update a user and return status 204", async () => {
			mockUser.picture = "oldpicture.jpg";
			const newUser = {
				...mockUser,
				picture: "newpicture.jpg",
				email: faker.internet.email(),
			};

			prismaMock.user.findUnique.mockResolvedValue(mockUser);
			prismaMock.user.update.mockResolvedValue(newUser);

			await request(httpServer)
				.put(`/users/${mockUser.id}`)
				.send(newUser)
				.expect(204);
		});

		it("should return a 404 error if the user ID is missing", async () => {
			const res = await request(httpServer)
				.put("/users/") // No ID provided
				.send({ username: "user", email: "user@example.com" })
				.expect(404);

			expect(res.body).toEqual({});
		});

		it("should handle database errors during user update", async () => {
			const userId = "123";
			const errorMessage = "Database update failed";
			prismaMock.user.update.mockRejectedValue(new Error(errorMessage));

			const res = await request(httpServer)
				.put(`/users/${userId}`)
				.send({ username: "user", email: "user@example.com" })
				.expect(400);

			expect(res.body.status).toEqual("error");
		});
	});

	describe("DELETE /users/:username", () => {
		it("should successfully delete a user and return status 204", async () => {
			prismaMock.user.delete.mockResolvedValue(mockUser);

			await request(httpServer)
				.delete(`/users/${mockUser.username}`)
				.expect(204);
		});

		it("should return a 404 status if the username is missing", async () => {
			const res = await request(httpServer).delete("/users/").expect(404);

			expect(res.body).toEqual({});
		});

		it("should handle errors when deleting a user", async () => {
			const username = "nonexistentuser";
			const errorMessage = "Error deleting user";
			prismaMock.user.delete.mockRejectedValue(new Error(errorMessage));

			const res = await request(httpServer)
				.delete(`/users/${username}`)
				.expect(400);

			expect(res.body).toEqual({
				status: "error",
				error: {},
			});
		});
	});

	describe("PATCH /users/live/:id", () => {
		it("should update the user streamKey when live is true", async () => {
			const userId = "123";
			const newStreamKey = faker.string.uuid(); // Use Faker to generate a UUID
			prismaMock.user.update.mockResolvedValue({
				...mockUser,
				id: userId,
				streamKey: newStreamKey,
			});

			await request(httpServer)
				.patch(`/users/live/${userId}`)
				.send({ live: true })
				.expect(204);
		});

		it("should set the user streamKey to null when live is false", async () => {
			const userId = "123";
			prismaMock.user.update.mockResolvedValue({
				...mockUser,
				id: userId,
				streamKey: null,
			});

			await request(httpServer)
				.patch(`/users/live/${userId}`)
				.send({ live: false })
				.expect(204);
		});

		it("should return a 404 error if the user id is missing or empty", async () => {
			const res = await request(httpServer)
				.patch(`/users/live/`)
				.send({ live: true })
				.expect(404);

			expect(res.body).toEqual({});
		});

		it("should handle errors during the streamKey update", async () => {
			const userId = "123";
			const errorMessage = "Database update error";
			prismaMock.user.update.mockRejectedValue(new Error(errorMessage));

			const res = await request(httpServer)
				.patch(`/users/live/${userId}`)
				.send({ live: true })
				.expect(400);

			expect(res.body).toEqual({
				status: "error",
				error: {},
			});
		});
	});
});
