import axios, { AxiosRequestConfig } from "axios";

import { logInfo } from "../logger";

export const axiosConfig: AxiosRequestConfig = {
	headers: {
		"Content-Type": "application/json",
	},
};

const fetcher = async (url: string, header: Headers) => {
	logInfo("global", fetcher.name, `Fetching: ${url}, ${header}`);

	const headersObject: { [key: string]: string } = {};
	if (header) {
		header.forEach((value, name) => {
			headersObject[name] = value;
		});
	}

	try {
		const response = await axios.get(url, axiosConfig);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export default fetcher;
