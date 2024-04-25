import request from "supertest";

import { prismaMock } from "../singleton";
import httpServer from "../src/index";
import { generateMessage, transformMessage } from "./generators/mockMessage";

const mockMessage = generateMessage();

describe("Message endpoints", () => {
	describe("POST /messages", () => {
		it("should create a message successfully", async () => {
			prismaMock.message.create.mockResolvedValue(mockMessage);

			const response = await request(httpServer)
				.post("/messages")
				.send(mockMessage)
				.expect(201);

			expect(transformMessage(response.body.data)).toEqual(
				transformMessage(mockMessage),
			);
		});

		it("should return error if streamKey is missing", async () => {
			const response = await request(httpServer)
				.post("/messages")
				.send({ ...mockMessage, streamKey: "" })
				.expect(404);

			expect(response.body).toEqual({
				status: "error",
				error: "Cannot find stream with given id.",
			});
		});

		it("should return error if content is empty", async () => {
			const response = await request(httpServer)
				.post("/messages")
				.send({
					content: "",
					streamKey: "stream123",
					username: "user123",
				})
				.expect(400);

			expect(response.body).toEqual({
				status: "error",
				error: "Content of the message cannot be empty.",
			});
		});
	});

	describe("PATCH /messages/:id", () => {
		it("should mark a message as answered", async () => {
			const messageId = "message123";
			prismaMock.message.update.mockResolvedValue({
				...mockMessage,
				answered: true,
			});

			const response = await request(httpServer)
				.patch(`/messages/${messageId}`)
				.send({ answered: true })
				.expect(200);

			expect(response.body.data).toEqual(true);
		});

		it("should return error if message id is not found", async () => {
			const messageId = "message123";
			prismaMock.message.update.mockRejectedValue(
				new Error("Message not found"),
			);

			const response = await request(httpServer)
				.patch(`/messages/${messageId}`)
				.send({ answered: true })
				.expect(400);

			expect(response.body).toEqual({
				status: "error",
				error: {},
			});
		});
	});

	describe("DELETE /messages/:id", () => {
		it("should delete a message successfully", async () => {
			const messageId = "message123";
			prismaMock.message.delete.mockResolvedValue(mockMessage);

			const response = await request(httpServer)
				.delete(`/messages/${messageId}`)
				.expect(200);

			expect(response.body.data).toEqual(true);
		});

		it("should return error if message id does not exist", async () => {
			const messageId = "invalid123";
			prismaMock.message.delete.mockRejectedValue(
				new Error("Message not found"),
			);

			const response = await request(httpServer)
				.delete(`/messages/${messageId}`)
				.expect(400);

			expect(response.body).toEqual({
				status: "error",
				error: {},
			});
		});
	});
});
