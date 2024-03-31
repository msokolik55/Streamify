import { Response } from "express";

export enum Status {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
}

export const sendResponseSuccess = (
	res: Response,
	status: Status,
	data: any,
) => {
	return res.status(status).send({
		status: "success",
		data: data,
	});
};

export const sendResponseError = (
	res: Response,
	status: Status,
	message: string,
) => {
	return res.status(status).send({
		status: "error",
		error: message,
	});
};
