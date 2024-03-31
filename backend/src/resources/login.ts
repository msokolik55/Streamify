import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { logInfo } from "../logger";
import { sendResponseError, sendResponseSuccess } from "./response";
import { getPassword } from "./user";

/**
 * Check user login attempt
 */
export const checkLogin = async (req: Request, res: Response) => {
	logInfo(req.path, checkLogin.name, "Method called");

	const { username, password } = req.body;

	const user = await getPassword(username);
	if (user === null) {
		return sendResponseError(
			res,
			404,
			"Cannot find user with given username.",
		);
	}

	return bcrypt.compareSync(password, user.password)
		? sendResponseSuccess(res, true)
		: sendResponseError(res, 400, "Wrong password.");
};
