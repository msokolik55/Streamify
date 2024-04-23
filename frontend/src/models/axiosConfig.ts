import { AxiosRequestConfig } from "axios";

export const axiosJsonConfig: AxiosRequestConfig = {
	headers: {
		"Content-Type": "application/json",
	},
};

export const axiosMultipartConfig: AxiosRequestConfig = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};
