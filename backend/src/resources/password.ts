import bcrypt from "bcrypt";
import { Request, Response } from "express";

import prisma from "../client";
import { logInfo } from "../logger";
import { sendResponseError, sendResponseSuccess } from "./response";
import { getPassword } from "./user";

/**
 * Generate password
 */
export const changePassword = async (req: Request, res: Response) => {
	logInfo("Method called: password.changePassword");

	const { username, oldPassword, newPassword } = req.body;

	const oldUser = await getPassword(username);
	if (oldUser === null) {
		return sendResponseError(
			res,
			404,
			"Cannot find user with given username.",
		);
	}

	if (!bcrypt.compareSync(oldPassword, oldUser.password)) {
		return sendResponseError(res, 400, "Wrong password.");
	}

	const newHashedPassword = bcrypt.hashSync(newPassword, 10);
	await prisma.user.update({
		where: {
			username: username,
		},
		data: {
			password: newHashedPassword,
		},
	});

	return sendResponseSuccess(res, true);
};
