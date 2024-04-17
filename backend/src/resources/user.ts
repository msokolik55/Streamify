import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import prisma from "../client";
import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { UserDetailSelect, UserSelect } from "./selects";

const ops = {
	inc: (a: number) => a + 1,
	dec: (a: number) => a - 1,
};

export const getPassword = async (username: string) => {
	logInfo("global", getPassword.name, "Method called");

	const user = await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
			password: true,
		},
	});

	return user;
};

export const findByUsername = async (username: string) => {
	logInfo("global", findByUsername.name, "Method called");

	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
		select: UserDetailSelect,
	});

	return user;
};

/**
 * Return list of all users
 */
export const get = async (req: Request, res: Response) => {
	logInfo(req.path, get.name, "Method called");

	const { live } = req.query;
	const filter =
		live === "true"
			? {
					NOT: { streamKey: null },
				}
			: undefined;

	try {
		const users = await prisma.user.findMany({
			select: UserSelect,
			where: filter,
		});

		return sendResponseSuccess(res, Status.OK, users);
	} catch (error) {
		logError(req.path, get.name, "Prisma findMany", live);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Create user
 */
export const create = async (req: Request, res: Response) => {
	logInfo(req.path, create.name, "Method called");

	const { username, email, password } = req.body;

	try {
		const user = await prisma.user.create({
			data: {
				username,
				email,
				picture: req.file?.filename,
				password: bcrypt.hashSync(password, 10),
			},
			select: UserSelect,
		});

		return sendResponseSuccess(res, Status.CREATED, user);
	} catch (error) {
		logError(req.path, create.name, "Prisma create");
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Return one user
 */
export const getByUsername = async (req: Request, res: Response) => {
	logInfo(req.path, getByUsername.name, "Method called");

	const username = req.params.username;

	try {
		const user = await findByUsername(username);
		return sendResponseSuccess(res, Status.OK, user);
	} catch (error) {
		logError(req.path, getByUsername.name, "Prisma findUnique", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Update user
 */
export const update = async (req: Request, res: Response) => {
	logInfo(req.path, update.name, "Method called");

	const id = req.params.id;
	const { username, email } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, Status.BAD_REQUEST, "Missing user id.");
	}

	const oldUser = await findByUsername(username);
	const folderPath = "uploads";
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file) => {
			const fullPath = path.join(folderPath, file);
			if (file === oldUser?.picture) fs.unlinkSync(fullPath);
		});
	}

	try {
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				username,
				email,
				picture: req.file?.filename,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, update.name, "Prisma update", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response) => {
	logInfo(req.path, deleteUser.name, "Method called");

	const username = req.params.username;

	if (!username || username === "") {
		return sendResponseError(
			res,
			Status.BAD_REQUEST,
			"Missing user username.",
		);
	}

	try {
		await prisma.user.delete({
			where: {
				username: username,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, deleteUser.name, "Prisma delete", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

const alterCount = async (
	req: Request,
	res: Response,
	op: (a: number) => number,
) => {
	logInfo(req.path, alterCount.name, "Method called");

	const username = req.params.username;

	if (!username || username === "") {
		return sendResponseError(res, Status.BAD_REQUEST, "Missing username.");
	}

	try {
		const user = await findByUsername(username);
		if (!user) {
			return sendResponseError(
				res,
				Status.NOT_FOUND,
				"Cannot find user with given id.",
			);
		}

		const newCount = Math.max(0, op(user.count));
		await prisma.user.update({
			where: {
				username,
			},
			data: {
				count: newCount,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, alterCount.name, "Prisma update", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};

/**
 * Increase user count
 */
export const increaseCount = async (req: Request, res: Response) => {
	logInfo(req.path, increaseCount.name, "Method called");

	return alterCount(req, res, ops.inc);
};

/**
 * Decrease user count
 */
export const decreaseCount = async (req: Request, res: Response) => {
	logInfo(req.path, decreaseCount.name, "Method called");

	return alterCount(req, res, ops.dec);
};

/**
 * Update live
 */
export const updateLive = async (req: Request, res: Response) => {
	logInfo(req.path, updateLive.name, "Method called");

	const id = req.params.id;
	const { live } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, Status.BAD_REQUEST, "Missing user id.");
	}

	try {
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				streamKey: live ? randomUUID() : null,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, updateLive.name, "Prisma update", id);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};
