import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src";
import {
	mockStream,
	mockStreams,
	transformStream,
} from "./generators/mockStream";
import { generateUser } from "./generators/mockUser";

jest.mock("fs", () => ({
	...jest.requireActual("fs"),
	existsSync: jest.fn(() => true),
	readdirSync: jest.fn(() => ["test.jpg"]),
	unlinkSync: jest.fn(),
	rmdirSync: jest.fn(),
}));

describe("Stream endpoints", () => {
	describe("GET /streams", () => {
		it("should return all streams", async () => {
			prismaMock.stream.findMany.mockResolvedValue(mockStreams);

			const res = await request(httpServer).get("/streams").expect(200);
			expect(res.body.data.map(transformStream)).toEqual(
				mockStreams.map(transformStream),
			);
		});

		it("should handle errors in getting streams", async () => {
			prismaMock.stream.findMany.mockRejectedValue(
				new Error("Database error"),
			);
			const res = await request(httpServer).get("/streams").expect(400);
			expect(res.body.status).toEqual("error");
		});
	});

	describe("POST /streams", () => {
		it("should create a new stream", async () => {
			const newUser = generateUser();
			prismaMock.user.findUnique.mockResolvedValue(newUser);
			prismaMock.stream.upsert.mockResolvedValue(mockStream);

			const res = await request(httpServer)
				.post("/streams")
				.send({ username: newUser.username, ...mockStream })
				.expect(201);

			expect(res.body.status).toEqual("success");
			expect(transformStream(res.body.data)).toEqual(
				transformStream(mockStream),
			);
		});

		it("should return an error if the user does not exist", async () => {
			prismaMock.user.findUnique.mockResolvedValue(null);

			const res = await request(httpServer)
				.post("/streams")
				.send(mockStream)
				.expect(404);

			expect(res.body.status).toEqual("error");
		});
	});

	describe("Stream operations by ID or Path", () => {
		it("should return a stream by ID", async () => {
			prismaMock.stream.findUnique.mockResolvedValue(mockStream);

			const res = await request(httpServer)
				.get(`/streams/${mockStream.id}`)
				.expect(200);
			expect(transformStream(res.body.data)).toEqual(
				transformStream(mockStream),
			);
		});

		it("should update a stream by ID", async () => {
			const updateData = {
				name: faker.commerce.productName(),
				description: faker.lorem.sentences(),
			};
			prismaMock.stream.update.mockResolvedValue({
				...mockStream,
				name: faker.commerce.productName(),
				description: faker.lorem.sentences(),
			});

			await request(httpServer)
				.put(`/streams/${mockStream.id}`)
				.send(updateData)
				.expect(204);
		});

		it("should check if a stream source exists by path", async () => {
			jest.spyOn(fs, "existsSync").mockReturnValue(true);
			const res = await request(httpServer)
				.get(`/streams/${mockStream.path}/exists`)
				.expect(200);
			expect(res.body.data).toEqual(true);
		});

		it("should end a stream by path", async () => {
			prismaMock.stream.update.mockResolvedValue({
				...mockStream,
				ended: true,
			});

			await request(httpServer)
				.put(`/streams/${mockStream.path}/end`)
				.expect(204);
		});
	});
});
