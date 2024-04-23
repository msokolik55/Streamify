import axios from "axios";

import { logInfo } from "../logger";
import { axiosJsonConfig } from "./axiosConfig";

const fetcher = async (url: string, header: Headers) => {
	logInfo("global", fetcher.name, `Fetching: ${url}, ${header}`);

	const headersObject: { [key: string]: string } = {};
	if (header) {
		header.forEach((value, name) => {
			headersObject[name] = value;
		});
	}

	try {
		const response = await axios.get(url, axiosJsonConfig);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export default fetcher;
