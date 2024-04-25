import { Request, Response } from "express";

import { logInfo } from "../logger";
import { Status, sendResponseError, sendResponseSuccess } from "./response";

export const login = (_req: Request, res: Response) => {
	logInfo("/login", login.name, "User logged in.");

	return sendResponseSuccess(res, Status.OK, true);
};

export const logout = (req: Request, res: Response) => {
	logInfo("/logout", logout.name, "User logged out.");

	req.logout(() => {
		res.redirect("/users/profile");
	});
};

export const isAuthenticated = (req: Request, res: Response) => {
	logInfo(
		"/authenticated",
		isAuthenticated.name,
		"Checking if user is authenticated.",
	);

	if (req.isAuthenticated()) {
		return sendResponseSuccess(res, Status.OK, req.session);
	}

	return sendResponseError(
		res,
		Status.UNAUTHORIZED,
		"User is not authenticated.",
	);
};
