import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import prisma from "../client";
import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { StreamDetailSelect, StreamSelect } from "./selects";
import { findByUsername } from "./user";

/**
 * Return all streams
 */
export const get = async (req: Request, res: Response) => {
	logInfo(req.path, get.name, "Method called");

	try {
		const streams = await prisma.stream.findMany({
			select: StreamDetailSelect,
		});

		return sendResponseSuccess(res, Status.OK, streams);
	} catch (error) {
		logError(req.path, getById.name, "Prisma findMany");
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Creates stream
 */
export const createStream = async (req: Request, res: Response) => {
	logInfo(req.path, createStream.name, "Method called");

	const { name, username, description } = req.body;

	try {
		const user = await findByUsername(username);
		if (user === null) {
			return sendResponseError(
				res,
				Status.NOT_FOUND,
				"Cannot find user with given username.",
			);
		}

		const stream = await prisma.stream.upsert({
			where: {
				path: user.streamKey ?? "",
			},
			update: {
				name,
				description,
			},
			create: {
				name,
				path: user.streamKey ?? "",
				userId: user.id,
				ended: false,
				description,
			},
			select: StreamSelect,
		});

		return sendResponseSuccess(res, Status.CREATED, stream);
	} catch (error) {
		logError(req.path, createStream.name, "Prisma create", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Return stream with a specific id
 */
export const getById = async (req: Request, res: Response) => {
	logInfo(req.path, getById.name, "Method called");

	const id = req.params.id;

	try {
		const stream = await prisma.stream.findUnique({
			where: {
				id: id,
			},
			select: StreamDetailSelect,
		});

		return sendResponseSuccess(res, Status.OK, stream);
	} catch (error) {
		logError(req.path, getById.name, "Prisma findUnique", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Updates stream
 */
export const updateStream = async (req: Request, res: Response) => {
	logInfo(req.path, updateStream.name, "Method called");

	const id = req.params.id;
	const { name, description } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, Status.BAD_REQUEST, "Missing stream id.");
	}

	try {
		await prisma.stream.update({
			where: {
				id: id,
			},
			data: {
				name,
				description,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, updateStream.name, "Prisma update", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Deletes stream
 */
export const deleteStream = async (req: Request, res: Response) => {
	logInfo(req.path, deleteStream.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(
			res,
			Status.BAD_REQUEST,
			"Missing folder path.",
		);
	}

	const folderPath = path.join("recordings", streamPath);
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file) => {
			const fullPath = path.join(folderPath, file);
			fs.unlinkSync(fullPath);
		});

		fs.rmdirSync(folderPath);
	}

	try {
		await prisma.stream.delete({
			where: {
				path: streamPath,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, deleteStream.name, "Prisma delete", streamPath);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Check if stream source exists
 */
export const streamSourceExists = async (req: Request, res: Response) => {
	logInfo(req.path, streamSourceExists.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(
			res,
			Status.BAD_REQUEST,
			"Missing folder path.",
		);
	}

	const folderPath = path.join("recordings", streamPath);
	return sendResponseSuccess(res, Status.OK, fs.existsSync(folderPath));
};

/**
 * Ends stream
 */
export const endStream = async (req: Request, res: Response) => {
	logInfo(req.path, endStream.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(
			res,
			Status.BAD_REQUEST,
			"Missing stream path.",
		);
	}

	try {
		await prisma.stream.update({
			where: {
				path: streamPath,
			},
			data: {
				ended: true,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, endStream.name, "Prisma update", streamPath);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Return messages with a specific stream id
 */
export const getMessages = async (req: Request, res: Response) => {
	logInfo(req.path, getMessages.name, "Method called");

	const streamPath = req.params.streamPath;
	if (!streamPath || streamPath === "") {
		return sendResponseError(
			res,
			Status.NOT_FOUND,
			"Cannot find stream with given path.",
		);
	}

	try {
		const stream = await prisma.stream.findUnique({
			where: {
				path: streamPath,
			},
			select: StreamSelect,
		});

		return sendResponseSuccess(res, Status.OK, stream);
	} catch (error) {
		logError(req.path, getMessages.name, "Prisma find", streamPath);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Updates max count of stream
 */
export const updateMaxCount = async (streamKey: string, count: number) => {
	try {
		const oldStream = await prisma.stream.findUnique({
			where: {
				path: streamKey,
			},
			select: {
				maxCount: true,
			},
		});

		const newCount = Math.max(oldStream?.maxCount ?? 0, count);
		await prisma.stream.update({
			where: {
				path: streamKey,
			},
			data: {
				maxCount: newCount,
			},
		});

		logInfo("", updateMaxCount.name, `Count updated to ${count}`);
	} catch (error) {
		logError("", getMessages.name, "Prisma update", streamKey);
	}
};
