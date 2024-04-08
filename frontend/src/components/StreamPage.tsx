import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";

import { shiftUserUsernames } from "../App";
import { loggedUserUsernameAtom, userUsernamesAtom } from "../atom";
import { IResponseData } from "../models/IDataUser";
import { IStream } from "../models/IStream";
import { IUser } from "../models/IUser";
import fetcher from "../models/fetcher";
import { apiStreamUrl, apiUserUrl, messagePath } from "../urls";
import MessageForm from "./MessageForm";
import VideoDetailBox from "./VideoDetailBox";
import VideoPlayer from "./VideoPlayer";
import MainWindowError from "./errors/MainWindowError";
import { getActualStream } from "./streamHelpers";

const StreamPage = () => {
	const loggedUsername = useRecoilValue(loggedUserUsernameAtom);
	const { username } = useParams();

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${username}`,
		fetcher,
	);
	const user = data?.data;

	const { data: dataMessages, error: errorMessages } = useSWR<
		IResponseData<IStream>,
		Error
	>(`${apiStreamUrl}/${user?.streamKey}${messagePath}`, fetcher);
	const stream = dataMessages?.data;

	const setUserUsernames = useSetRecoilState(userUsernamesAtom);
	useEffect(() => {
		if (!username || username === "") return;
		shiftUserUsernames(setUserUsernames, username);

		return () => shiftUserUsernames(setUserUsernames, "");
	}, []);

	if (error) {
		return (
			<MainWindowError
				message={
					error?.message ||
					errorMessages?.message ||
					"Error when fetching data."
				}
			/>
		);
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
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			<div className="flex flex-row gap-1">
				<div className="flex-1">
					<VideoPlayer streamKey={user.streamKey} />
				</div>

				<div className="flex flex-col gap-2 justify-between">
					<h1>Messages</h1>
					{stream?.messages?.map((message) => (
						<h2 key={message.id}>{message.content}</h2>
					))}
					<MessageForm
						streamKey={user.streamKey}
						username={loggedUsername}
					/>
				</div>
			</div>
			<VideoDetailBox
				stream={getActualStream(user)}
				user={user}
				showCounter={true}
			/>
		</>
	);
};

export default StreamPage;
