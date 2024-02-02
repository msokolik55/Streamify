import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import { apiUrl } from "../env";
import { IDataUser } from "../models/IDataUser";
import fetcher from "../models/fetcher";
import { apiLiveUrl, apiUserUrl } from "../urls";
import MainWindowError from "./errors/MainWindowError";

const ProfilePage = () => {
	const { username } = useParams();

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${username}`,
		fetcher,
	);
	const user = data?.data;

	const { mutate } = useSWRConfig();

	const setUserUsernames = useSetRecoilState(userUsernamesAtom);
	useEffect(() => {
		if (!username || username === "") return;
		shiftUserUsernames(setUserUsernames, username);

		return () => shiftUserUsernames(setUserUsernames, "");
	}, []);

	const goLive = async (live: boolean) => {
		await fetch(`${apiUrl}/live`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user?.id,
				live: live,
			}),
		});

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${username}`);
	};

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	// TODO: create attribute streams in Prisma
	const userStreams: { link: string; image: string; title: string }[] = [
		{ link: "#", image: "", title: "Stream 1" },
		{ link: "#", image: "", title: "Stream 2" },
		{ link: "#", image: "", title: "Stream 3" },
	];
	// ENDTODO

	return (
		<div className="px-8 pt-6 flex flex-col gap-8">
			<div className="flex flex-row gap-x-4 items-center">
				<div className="w-20 h-20">
					<img src={user.picture} className="rounded-full" />
				</div>

				<h1 className="font-semibold text-2xl">{user.username}</h1>
			</div>

			<div className="flex flex-row gap-4 overflow-auto flex-wrap">
				{userStreams.map((userStream, id) => (
					<div
						key={`stream-${userStream.title}-${id}`}
						className="flex flex-col gap-1 rounded-md border"
					>
						<img
							alt="stream's picture"
							src=""
							className="min-w-72"
						/>

						<div className="flex flex-col">
							<span className="font-semibold">
								{userStream.title}
							</span>
							<span className="text-sm">{user.username}</span>
						</div>
					</div>
				))}
			</div>

			{/* TODO: move to user's profile */}
			<hr />
			<p>
				Stream key: {user.streamKey !== null ? user.streamKey : "none"}
			</p>

			{user.streamKey === null ? (
				<button onClick={() => goLive(true)}>Go live</button>
			) : (
				<button onClick={() => goLive(false)}>End live</button>
			)}
			{/* ENDTODO */}
		</div>
	);
};

export default ProfilePage;
