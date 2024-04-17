import { Request, Response } from "express";

import { Status, sendResponseError, sendResponseSuccess } from "./response";

export const login = (req: Request, res: Response) => {
	return sendResponseSuccess(res, Status.OK, true);
};

export const logout = (req: Request, res: Response) => {
	req.logout(() => {
		res.redirect("/users/profile");
	});
};

export const isAuthenticated = (req: Request, res: Response) => {
	if (req.isAuthenticated()) {
		return sendResponseSuccess(res, Status.OK, req.session);
	}

	return sendResponseError(
		res,
		Status.UNAUTHORIZED,
		"User is not authenticated.",
	);
};
