import { Request, Response } from "express";

import prisma from "../client";
import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { MessageSelect } from "./selects";

/**
 * Creates message
 */
export const createMessage = async (req: Request, res: Response) => {
	logInfo(req.path, createMessage.name, "Method called");

	const { content, streamKey, username } = req.body;

	if (!streamKey || streamKey === "") {
		return sendResponseError(
			res,
			Status.NOT_FOUND,
			"Cannot find stream with given id.",
		);
	}
	if (!content || content === "") {
		return sendResponseError(
			res,
			Status.BAD_REQUEST,
			"Content of the message cannot be empty.",
		);
	}

	try {
		console.log(content, streamKey, username);
		const message = await prisma.message.create({
			data: {
				content,
				streamKey,
				username,
			},
			select: MessageSelect,
		});

		return sendResponseSuccess(res, Status.CREATED, message);
	} catch (error) {
		console.log(error);
		logError(req.path, createMessage.name, "Prisma create", streamKey);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Answers the message with a specific id
 */
export const answerMessage = async (req: Request, res: Response) => {
	logInfo(req.path, answerMessage.name, "Method called");

	const id = req.params.id;
	const { answered } = req.body;

	if (!id || id === "") {
		return sendResponseError(
			res,
			Status.NOT_FOUND,
			"Cannot find message with given id.",
		);
	}

	try {
		await prisma.message.update({
			where: {
				id,
			},
			data: {
				answered,
			},
			select: MessageSelect,
		});

		return sendResponseSuccess(res, Status.OK, true);
	} catch (error) {
		logError(req.path, answerMessage.name, "Prisma update", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Deletes message with a specific id
 */
export const deleteMessage = async (req: Request, res: Response) => {
	logInfo(req.path, deleteMessage.name, "Method called");

	const id = req.params.id;
	if (!id || id === "") {
		return sendResponseError(
			res,
			Status.NOT_FOUND,
			"Cannot find message with given id.",
		);
	}

	try {
		await prisma.message.delete({
			where: {
				id,
			},
			select: MessageSelect,
		});

		return sendResponseSuccess(res, Status.OK, true);
	} catch (error) {
		logError(req.path, deleteMessage.name, "Prisma delete", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};
