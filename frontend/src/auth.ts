import axios from "axios";

import { apiUrl } from "./env";
import { axiosConfig } from "./models/fetcher";
import { LoginInputs } from "./models/form";
import { apiLoginUrl } from "./urls";

export const register = async (
	username: string,
	email: string,
	password: string,
) => {
	return await axios.post(
		`${apiUrl}/register`,
		{
			username,
			email,
			password,
		},
		axiosConfig,
	);
};

export const login = async (data: LoginInputs) => {
	return await axios.post(apiLoginUrl, data, {
		...axiosConfig,
		withCredentials: true,
	});
};

export const logout = async () => {
	return await axios.get(`${apiUrl}/logout`, {
		...axiosConfig,
		withCredentials: true,
	});
};
