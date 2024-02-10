import prisma from "../client";
import { Request, Response } from "express";
import { sendResponseError, sendResponseSuccess } from "./response";
import { randomUUID } from "crypto";

/**
 * Return list of all streams
 */
export const get = async (req: Request, res: Response) => {
	const streams = await prisma.stream.findMany({
		select: {
			id: true,
			name: true,
			createdAt: true,
			path: true,
			user: {
				select: {
					picture: true,
					username: true,
				},
			},
		},
	});

	return sendResponseSuccess(res, streams);
};

/**
 * Return streams for a specific user
 */
export const getByUsername = async (req: Request, res: Response) => {
	const { username } = req.body;

	const streams = await prisma.stream.findMany({
		where: {
			user: {
				username: username,
			},
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			path: true,
			user: {
				select: {
					picture: true,
					username: true,
				},
			},
		},
	});

	return sendResponseSuccess(res, streams);
};
