import prisma from "../client";
import { Request, Response } from "express";
import { sendResponseError, sendResponseSuccess } from "./response";
import bcrypt from "bcrypt";
import { findByUsername } from "./user";

/**
 * Generate password
 */
export const changePassword = async (req: Request, res: Response) => {
	const { username, oldPassword, newPassword } = req.body;

	const oldUser = await findByUsername(username);
	if (oldUser === null) {
		return sendResponseError(
			res,
			404,
			"Cannot find user with given username."
		);
	}

	if (!bcrypt.compareSync(oldPassword, oldUser.password)) {
		return sendResponseError(res, 400, "Wrong password.");
	}

	const newHashedPassword = bcrypt.hashSync(newPassword, 10);
	const newUser = await prisma.user.update({
		where: {
			username: username,
		},
		data: {
			password: newHashedPassword,
		},
	});

	return sendResponseSuccess(res, newUser);
};
