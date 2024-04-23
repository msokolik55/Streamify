import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserUsernameAtom } from "../atom";
import { IResponseData } from "../models/IResponseData";
import { IUser } from "../models/IUser";
import fetcher from "../models/fetcher";
import { apiUserUrl } from "../urls";

export const useFetchSWR = <T>(url: string, options?: any) => {
	const { data, error } = useSWR<IResponseData<T>, Error>(
		url,
		fetcher,
		options,
	);

	return {
		data: data?.data,
		error,
	};
};

export const useUser = (username: string | undefined) => {
	return useFetchSWR<IUser>(`${apiUserUrl}/${username}`);
};

export const useLoggedUser = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	return useUser(loggedUserUsername);
};
