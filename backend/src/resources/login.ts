import { Request, Response } from "express";
import { sendResponseError, sendResponseSuccess } from "./response";
import bcrypt from "bcrypt";
import { findByUsername } from "./user";

/**
 * Check user login attempt
 */
export const checkLogin = async (req: Request, res: Response) => {
	console.log("Method called: login.checkLogin");

	const { username, password } = req.body;

	const user = await findByUsername(username);
	if (user === null) {
		return sendResponseError(
			res,
			404,
			"Cannot find user with given username."
		);
	}

	return bcrypt.compareSync(password, user.password)
		? sendResponseSuccess(res, true)
		: sendResponseError(res, 400, "Wrong password.");
};
