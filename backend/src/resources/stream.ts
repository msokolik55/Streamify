import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import prisma from "../client";
import { logInfo } from "../logger";
import { sendResponseError, sendResponseSuccess } from "./response";
import { StreamDetailSelect, StreamSelect } from "./selects";
import { findByUsername } from "./user";

/**
 * Creates stream
 */
export const createStream = async (req: Request, res: Response) => {
	logInfo(req.path, createStream.name, "Method called");

	const { name, username } = req.body;

	const user = await findByUsername(username);
	if (user === null) {
		console.error("here");
		return sendResponseError(
			res,
			404,
			"Cannot find user with given username.",
		);
	}

	const stream = await prisma.stream.create({
		data: {
			name: name,
			path: user.streamKey ?? "",
			userId: user.id,
			ended: false,
		},
		select: StreamSelect,
	});

	return sendResponseSuccess(res, stream);
};

/**
 * Return stream with a specific id
 */
export const getById = async (req: Request, res: Response) => {
	logInfo(req.path, getById.name, "Method called");

	const id = req.params.id;

	const streams = await prisma.stream.findUnique({
		where: {
			id: id,
		},
		select: StreamDetailSelect,
	});

	return sendResponseSuccess(res, streams);
};

/**
 * Updates stream
 */
export const updateStream = async (req: Request, res: Response) => {
	logInfo(req.path, updateStream.name, "Method called");

	const id = req.params.id;
	const { name } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing stream id.");
	}

	await prisma.stream.update({
		where: {
			id: id,
		},
		data: {
			name: name,
		},
	});

	return sendResponseSuccess(res, true);
};

/**
 * Deletes stream
 */
export const deleteStream = async (req: Request, res: Response) => {
	logInfo(req.path, deleteStream.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(res, 400, "Missing folder path.");
	}

	const folderPath = path.join("recordings", streamPath);
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file) => {
			const fullPath = path.join(folderPath, file);
			fs.unlinkSync(fullPath);
		});

		fs.rmdirSync(folderPath);
	}

	await prisma.stream.delete({
		where: {
			path: streamPath,
		},
	});

	return sendResponseSuccess(res, true);
};

/**
 * Return video .mp4 file name
 */
// export const getVideoName = async (req: Request, res: Response) => {
// 	const folderName = req.params.folderName;

// 	if (!folderName || folderName === "") {
// 		return sendResponseError(res, 400, "Missing folder name.");
// 	}

// 	const videoPath = path.join("recordings", folderName);
// 	fs.readdir(videoPath, (err, files) => {
// 		if (err) {
// 			console.error("Error reading directory:", err);
// 			return sendResponseError(res, 500, "Error reading directory");
// 		}

// 		const mp4File = files.find((file) => file.endsWith(".mp4"));
// 		if (!mp4File) {
// 			return sendResponseError(res, 404, "No video file found");
// 		}

// 		sendResponseSuccess(res, mp4File);
// 	});
// };

/**
 * Check if stream source exists
 */
export const streamSourceExists = async (req: Request, res: Response) => {
	logInfo(req.path, streamSourceExists.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(res, 400, "Missing folder path.");
	}

	const folderPath = path.join("recordings", streamPath);
	return sendResponseSuccess(res, fs.existsSync(folderPath));
};

/**
 * Ends stream
 */
export const endStream = async (req: Request, res: Response) => {
	logInfo(req.path, endStream.name, "Method called");

	const streamPath = req.params.streamPath;

	if (!streamPath || streamPath === "") {
		return sendResponseError(res, 400, "Missing stream path.");
	}

	await prisma.stream.update({
		where: {
			path: streamPath,
		},
		data: {
			ended: true,
		},
	});

	return sendResponseSuccess(res, true);
};
