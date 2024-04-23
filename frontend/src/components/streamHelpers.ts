import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserUsernameAtom } from "../atom";
import { IResponseData } from "../models/IResponseData";
import { IUser } from "../models/IUser";
import fetcher from "../models/fetcher";
import { apiUserUrl } from "../urls";

export const getActualStream = (user: IUser) => {
	return user.streams.filter((stream) => stream.path === user.streamKey)[0];
};

export const getUser = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,

		fetcher,
	);

	const user = data?.data;
	return {
		user,
		error,
	};
};
