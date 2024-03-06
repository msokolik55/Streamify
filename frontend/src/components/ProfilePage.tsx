import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import { IDataUser } from "../models/IDataUser";
import fetcher from "../models/fetcher";
import { apiUserUrl, streamPath } from "../urls";
import StreamCard from "./StreamCard";
import MainWindowError from "./errors/MainWindowError";

const ProfilePage = () => {
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

	return (
		<div className="px-8 pt-6 flex flex-col gap-8">
			<div className="flex flex-row gap-x-4 items-center">
				<div className="w-20 h-20">
					<img
						src={user.picture ?? "/profile_picture.jpg"}
						className="rounded-full"
					/>
				</div>

				<h1 className="font-semibold text-2xl">{user.username}</h1>
			</div>

			<div className="flex flex-row gap-4 overflow-auto flex-wrap">
				{user.streams.length === 0 && <p>No videos to show.</p>}
				{user.streams.map((stream, id) => (
					<Link
						key={`stream-${stream.name}-${id}`}
						to={`${streamPath}/${stream.id}`}
					>
						<StreamCard stream={stream} username={user.username} />
					</Link>
				))}
			</div>
		</div>
	);
};

export default ProfilePage;
