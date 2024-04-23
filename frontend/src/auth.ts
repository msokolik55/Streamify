import axios from "axios";

import { apiUrl } from "./env";
import { axiosJsonConfig } from "./models/axiosConfig";
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
		axiosJsonConfig,
	);
};

export const login = async (data: LoginInputs) => {
	return await axios.post(apiLoginUrl, data, {
		...axiosJsonConfig,
		withCredentials: true,
	});
};

export const logout = async () => {
	return await axios.get(`${apiUrl}/logout`, {
		...axiosJsonConfig,
		withCredentials: true,
	});
};
