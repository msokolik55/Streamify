import prisma from "../client";
import { Request, Response } from "express";
import { sendResponseError, sendResponseSuccess } from "./response";
import { randomUUID } from "crypto";

const ops = {
	inc: (a: number) => a + 1,
	dec: (a: number) => a - 1,
};

export const findByUsername = async (username: string) => {
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
		select: {
			id: true,
			username: true,
			picture: true,
			email: true,
			count: true,
			streamKey: true,
			password: true,
			streams: {
				select: {
					id: true,
					createdAt: true,
					name: true,
					path: true,
				},
			},
		},
	});

	return user;
};

const alterCount = async (
	req: Request,
	res: Response,
	op: (a: number) => number
) => {
	const id = req.params.id;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing id.");
	}

	const user = await findByUsername(id);

	if (!user) {
		return sendResponseError(res, 404, "Cannot find user with given id.");
	}

	const newCount = Math.max(0, op(user.count));

	const newUser = await prisma.user.update({
		where: {
			id,
		},
		data: {
			count: newCount,
		},
		select: {
			id: true,
			username: true,
			count: true,
		},
	});

	return sendResponseSuccess(res, newUser);
};

/**
 * Return list of all users
 */
export const get = async (req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			username: true,
			picture: true,
			email: true,
			count: true,
			streamKey: true,
		},
	});
	return sendResponseSuccess(res, users);
};

/**
 * Return one user
 */
export const getByUsername = async (req: Request, res: Response) => {
	const username = req.params.username!;

	const user = await findByUsername(username);
	return sendResponseSuccess(res, user);
};

/**
 * Update user
 */
export const update = async (req: Request, res: Response) => {
	const { id, username, email, picture } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing user id.");
	}

	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			username,
			email,
			picture,
		},
	});

	return sendResponseSuccess(res, user);
};

/**
 * Increase user count
 */
export const increaseCount = async (req: Request, res: Response) => {
	return alterCount(req, res, ops.inc);
};

/**
 * Decrease user count
 */
export const decreaseCount = async (req: Request, res: Response) => {
	return alterCount(req, res, ops.dec);
};

/**
 * Return all live users
 */
export const getByLive = async (req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		where: {
			NOT: { streamKey: null },
		},
		select: {
			id: true,
			username: true,
			count: true,
		},
		orderBy: {
			count: "desc",
		},
	});
	return sendResponseSuccess(res, users);
};

/**
 * Update live
 */
export const updateLive = async (req: Request, res: Response) => {
	const { id, live } = req.body;

	if (!id || id === "") {
		return sendResponseError(res, 400, "Missing user id.");
	}

	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			streamKey: live ? randomUUID() : null,
		},
	});

	return sendResponseSuccess(res, user);
};
