import { Request, Response } from "express";

import { Status, sendResponseSuccess } from "./response";

export const login = (req: Request, res: Response) => {
	return sendResponseSuccess(res, Status.OK, true);
};

export const logout = (req: Request, res: Response) => {
	req.logout(() => {
		res.redirect("/users/profile");
	});
};
