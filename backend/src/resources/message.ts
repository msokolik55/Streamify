import { Request, Response } from "express";

import prisma from "../client";
import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { MessageSelect, StreamSelect } from "./selects";

/**
 * Creates message
 */
export const createMessage = async (req: Request, res: Response) => {
	logInfo(req.path, createMessage.name, "Method called");

	const { content, streamId, userId } = req.body;

	if (!streamId || streamId === "") {
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
		const message = await prisma.message.create({
			data: {
				content,
				streamId,
				userId,
			},
			select: MessageSelect,
		});

		return sendResponseSuccess(res, Status.CREATED, message);
	} catch (error) {
		logError(req.path, createMessage.name, "Prisma create", streamId);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Return messages with a specific stream id
 */
export const getByStreamId = async (req: Request, res: Response) => {
	logInfo(req.path, getByStreamId.name, "Method called");

	const streamId = req.params.streamId;
	if (!streamId || streamId === "") {
		return sendResponseError(
			res,
			Status.NOT_FOUND,
			"Cannot find stream with given id.",
		);
	}

	try {
		const messages = await prisma.message.findMany({
			where: {
				streamId,
			},
			select: MessageSelect,
		});

		return sendResponseSuccess(res, Status.OK, messages);
	} catch (error) {
		logError(req.path, getByStreamId.name, "Prisma find", streamId);
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
