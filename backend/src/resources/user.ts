import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Request, Response } from "express";

import prisma from "../client";
import { logInfo } from "../logger";
import { sendResponseError, sendResponseSuccess } from "./response";
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

	const users = await prisma.user.findMany({
		select: UserSelect,
		where: filter,
	});
	return sendResponseSuccess(res, users);
};

/**
 * Create user
 */
export const create = async (req: Request, res: Response) => {
	logInfo(req.path, create.name, "Method called");

	const { username, email, picture, password } = req.body;

	const user = await prisma.user.create({
		data: {
			username,
			email,
			picture,
			password: bcrypt.hashSync(password, 10),
		},
		select: UserSelect,
	});

	return sendResponseSuccess(res, user);
};

/**
 * Return one user
 */
export const getByUsername = async (req: Request, res: Response) => {
	logInfo(req.path, getByUsername.name, "Method called");

	const username = req.params.username!;

	const user = await findByUsername(username);
	return sendResponseSuccess(res, user);
};

/**
 * Update user
 */
export const update = async (req: Request, res: Response) => {
	logInfo(req.path, update.name, "Method called");

	const id = req.params.id;
	const { username, email, picture } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing user id.");
	}

	await prisma.user.update({
		where: {
			id,
		},
		data: {
			username,
			email,
			picture,
		},
	});

	return sendResponseSuccess(res, true);
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response) => {
	logInfo(req.path, deleteUser.name, "Method called");

	const username = req.params.username;

	if (!username || username === "") {
		return sendResponseError(res, 400, "Missing user username.");
	}

	await prisma.user.delete({
		where: {
			username: username,
		},
	});

	return sendResponseSuccess(res, true);
};

const alterCount = async (
	req: Request,
	res: Response,
	op: (a: number) => number,
) => {
	logInfo(req.path, alterCount.name, "Method called");

	const username = req.params.username;

	if (!username || username === "") {
		return sendResponseError(res, 400, "Missing username.");
	}

	const user = await findByUsername(username);

	if (!user) {
		return sendResponseError(res, 404, "Cannot find user with given id.");
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

	return sendResponseSuccess(res, true);
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
		return sendResponseError(res, 400, "Missing user id.");
	}

	await prisma.user.update({
		where: {
			id,
		},
		data: {
			streamKey: live ? randomUUID() : null,
		},
	});

	return sendResponseSuccess(res, true);
};
