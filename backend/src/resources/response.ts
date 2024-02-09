import { Response } from "express";

export const sendResponseSuccess = (res: Response, data: any) => {
	return res.status(200).send({
		status: "success",
		data: data,
	});
};

export const sendResponseError = (
	res: Response,
	status: number,
	message: string
) => {
	return res.status(status).send({
		status: "error",
		error: message,
	});
};
