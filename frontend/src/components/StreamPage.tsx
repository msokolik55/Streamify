import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import { IDataUser } from "../models/IDataUser";
import fetcher from "../models/fetcher";
import { apiUserUrl } from "../urls";
import Counter from "./Counter";
import VideoPlayer from "./VideoPlayer";
import MainWindowError from "./errors/MainWindowError";

const StreamPage = () => {
	const { username } = useParams();
	const pageUrl = apiUserUrl;

	const { data, error } = useSWR<IDataUser, Error>(
		`${pageUrl}/${username}`,
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

			<div className="flex flex-row">
				<div className="m-2 h-20 w-20 flex justify-center items-center">
					<img
						className="rounded-full"
						alt="logo"
						src={user.picture}
					/>
				</div>

				<div className="flex flex-col flex-1 p-2 gap-2">
					<div className="flex">
						<h1 className="font-semibold">{user.username}</h1>
					</div>
					<div className="flex flex-row justify-between ">
						<h2 className="font-semibold">Title</h2>
						<Counter count={user.count} />
					</div>
				</div>
			</div>
		</>
	);
};

export default StreamPage;
