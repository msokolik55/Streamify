import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { logError, logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";
import { getPassword } from "./user";

/**
 * Check user login attempt
 */
export const checkLogin = async (req: Request, res: Response) => {
	logInfo(req.path, checkLogin.name, "Method called");

	const { username, password } = req.body;

	try {
		const user = await getPassword(username);
		if (user === null) {
			return sendResponseError(
				res,
				Status.NOT_FOUND,
				"Cannot find user with given username.",
			);
		}

		return bcrypt.compareSync(password, user.password)
			? sendResponseSuccess(res, Status.OK, true)
			: sendResponseError(res, Status.BAD_REQUEST, "Wrong password.");
	} catch (error) {
		logError(req.path, checkLogin.name, "Prisma findUnique", username);
		return sendResponseError(res, Status.BAD_REQUEST, error as string);
	}
};
