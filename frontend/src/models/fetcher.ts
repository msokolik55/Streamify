import { logInfo } from "../logger";

const fetcher = (url: string, header: Headers) => {
	logInfo(`Fetching: ${url}, ${header}`);

	return fetch(url, {
		headers: header,
	}).then((response) => response.json());
};

export default fetcher;
