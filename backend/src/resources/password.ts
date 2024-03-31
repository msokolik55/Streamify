import bcrypt from "bcrypt";
import { Request, Response } from "express";

import prisma from "../client";
import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { getPassword } from "./user";

/**
 * Generate password
 */
export const changePassword = async (req: Request, res: Response) => {
	logInfo(req.path, changePassword.name, "Method called");

	const { username, oldPassword, newPassword } = req.body;

	try {
		const oldUser = await getPassword(username);

		if (oldUser === null) {
			return sendResponseError(
				res,
				Status.NOT_FOUND,
				"Cannot find user with given username.",
			);
		}

		if (!bcrypt.compareSync(oldPassword, oldUser.password)) {
			return sendResponseError(
				res,
				Status.BAD_REQUEST,
				"Wrong password.",
			);
		}
	} catch (error) {
		logError(req.path, changePassword.name, "Prisma findUnique", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}

	const newHashedPassword = bcrypt.hashSync(newPassword, 10);

	try {
		await prisma.user.update({
			where: {
				username: username,
			},
			data: {
				password: newHashedPassword,
			},
		});

		return sendResponseSuccess(res, Status.NO_CONTENT, true);
	} catch (error) {
		logError(req.path, changePassword.name, "Prisma update", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};
