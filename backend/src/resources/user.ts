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
	logInfo("Method called: user.getPassword");

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
	logInfo("Method called: user.findByUsername");

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
	logInfo("Method called: user.get");

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
	logInfo("Method called: user.create");

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
	logInfo("Method called: user.getByUsername");

	const username = req.params.username!;

	const user = await findByUsername(username);
	return sendResponseSuccess(res, user);
};

/**
 * Update user
 */
export const update = async (req: Request, res: Response) => {
	logInfo("Method called: user.update");

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
	logInfo("Method called: user.deleteUser");

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
	logInfo("Method called: user.alterCount");

	const id = req.params.id;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing id.");
	}

	const user = await findByUsername(id);

	if (!user) {
		return sendResponseError(res, 404, "Cannot find user with given id.");
	}

	const newCount = Math.max(0, op(user.count));

	await prisma.user.update({
		where: {
			id,
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
	logInfo("Method called: user.increaseCount");

	return alterCount(req, res, ops.inc);
};

/**
 * Decrease user count
 */
export const decreaseCount = async (req: Request, res: Response) => {
	logInfo("Method called: user.decreaseCount");

	return alterCount(req, res, ops.dec);
};

/**
 * Update live
 */
export const updateLive = async (req: Request, res: Response) => {
	logInfo("Method called: user.updateLive");

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
