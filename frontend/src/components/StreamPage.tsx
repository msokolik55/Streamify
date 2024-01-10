import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import { IDataUser } from "../models/IDataUser";
import fetcher from "../models/fetcher";
import VideoPlayer from "./VideoPlayer";
import { apiUserUrl } from "../urls";
import Counter from "./Counter";
import MainWindowError from "./MainWindowError";

const StreamPage = () => {
	const { username } = useParams();
	const pageUrl = apiUserUrl;

	const { data, error } = useSWR<IDataUser, Error>(
		`${pageUrl}/${username}`,
		fetcher
	);
	const user = data?.data;

	const setUserUsernames = useSetRecoilState(userUsernamesAtom);
	useEffect(() => {
		if (!username || username === "") return;
		shiftUserUsernames(setUserUsernames, username);

		return () => shiftUserUsernames(setUserUsernames, "");
	}, []);

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	if (user.streamKey === null) {
		return (
			<MainWindowError message="This user is not currently streaming." />
		);
	}

	return (
		<div>
			<h1>{user.username}</h1>
			<Counter count={user.count} />
			<VideoPlayer streamKey={user.streamKey} />
		</div>
	);
};

export default StreamPage;
