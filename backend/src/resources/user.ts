import prisma from "../client";
import { Request, Response } from "express";
import { sendResponseSuccess } from "./response";
import { randomUUID } from "crypto";

const ops = {
	inc: (a: number) => a + 1,
	dec: (a: number) => a - 1,
};

const findByUsername = async (username: string) => {
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
			live: true,
			streamKey: true,
			password: true,
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
		return res.status(400).send({
			status: "error",
			error: "Missing id.",
		});
	}

	const user = await findByUsername(id);

	if (!user) {
		return res.status(404).send({
			status: "error",
			data: `Cannot find user with given id.`,
		});
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
	const { id, username, email } = req.body;

	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			username,
			email,
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
			// live: true,
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

	const user = await prisma.user.update({
		where: {
			id,
		},
		data: {
			live,
			streamKey: live ? randomUUID() : null,
		},
	});

	return sendResponseSuccess(res, user);
};

/**
 * Check user login attempt
 */
export const checkLogin = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await findByUsername(username);
	return sendResponseSuccess(
		res,
		user !== null && user.password === password
	);
};
