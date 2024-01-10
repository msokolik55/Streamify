import { Response } from "express";

export const sendResponseSuccess = (res: Response, data: any) => {
	return res.status(200).send({
		status: "success",
		data: data,
	});
};
