import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserUsernameAtom } from "../atom";
import MessageForm from "../components/MessageForm";
import VideoDetailBox from "../components/VideoDetailBox";
import VideoPlayer from "../components/VideoPlayer";
import MainWindowError from "../components/errors/MainWindowError";
import { getActualStream } from "../components/streamHelpers";
import { IResponseData } from "../models/IResponseData";
import { IStream } from "../models/IStream";
import { IUser } from "../models/IUser";
import fetcher from "../models/fetcher";
import { apiStreamUrl, apiUserUrl, messagePath } from "../urls";

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
					<div className="max-h-32 overflow-y-auto flex flex-col gap-2">
						{stream?.messages
							?.filter((message) => !message.answered)
							.map((message) => (
								<div className="bg-white text-black rounded-md px-2">
									<h2 key={message.id}>{message.content}</h2>
								</div>
							))}
					</div>
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
