import { useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import fetcher from "../models/fetcher";
import ErrorBlock from "./ErrorBlock";
import { useSetRecoilState } from "recoil";
import { userUsernamesAtom } from "../atom";
import { useEffect } from "react";
import { shiftUserUsernames } from "../App";
import { IDataUser } from "../models/IDataUser";
import { apiUrl } from "../env";
import { apiLiveUrl, apiUserUrl } from "../urls";
import MainWindowError from "./MainWindowError";

const ProfilePage = () => {
	const { username } = useParams();

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${username}`,
		fetcher
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

	return (
		<div>
			<h1>Profile</h1>
			<p>{user.username}</p>

			<p>
				Stream key: {user.streamKey !== null ? user.streamKey : "none"}
			</p>

			<div>
				<img src={user.picture} style={{ width: "5em" }} />
			</div>

			{user.streamKey === null ? (
				<button onClick={() => goLive(true)}>Go live</button>
			) : (
				<button onClick={() => goLive(false)}>End live</button>
			)}
		</div>
	);
};

export default ProfilePage;
