import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import { IDataUser } from "../models/IDataUser";
import fetcher from "../models/fetcher";
import { apiUserUrl } from "../urls";
import VideoDetailBox from "./VideoDetailBox";
import VideoPlayer from "./VideoPlayer";
import MainWindowError from "./errors/MainWindowError";
import { getActualStream } from "./streamHelpers";

const StreamPage = () => {
	const { username } = useParams();

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${username}`,
		fetcher,
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
		<>
			<VideoPlayer streamKey={user.streamKey} />
			<VideoDetailBox
				stream={getActualStream(user)}
				user={user}
				showCounter={true}
			/>
		</>
	);
};

export default StreamPage;
