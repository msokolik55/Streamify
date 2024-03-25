import { getLocaleTimeString } from "../../time";

function fetcher(url: string, header: Headers) {
	console.log(`${getLocaleTimeString()}: Fetching: ${url}, ${header}`);

	return fetch(url, {
		headers: header,
	}).then((response) => response.json());
}

export default fetcher;
