import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserUsernameAtom } from "../atom";
import MessageForm from "../components/MessageForm";
import VideoDetailBox from "../components/VideoDetailBox";
import VideoPlayer from "../components/VideoPlayer";
import ErrorBlock from "../components/errors/ErrorBlock";
import { getActualStream, useUser } from "../components/getHelpers";
import { IResponseData } from "../models/IResponseData";
import { IStream } from "../models/IStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl, messagePath } from "../urls";

const StreamPage = () => {
	const loggedUsername = useRecoilValue(loggedUserUsernameAtom);
	const { username } = useParams();
	const { user, error } = useUser(username);

	const { data: dataMessages, error: errorMessages } = useSWR<
		IResponseData<IStream>,
		Error
	>(`${apiStreamUrl}/${user?.streamKey}${messagePath}`, fetcher);
	const stream = dataMessages?.data;

	if (error) {
		return <ErrorBlock error={error} />;
	}
	if (errorMessages) {
		return <ErrorBlock error={errorMessages} />;
	}

	if (!user) {
		return (
			<ErrorBlock
				error={new Error("Cannot find user with given username.")}
			/>
		);
	}

	if (user.streamKey === null) {
		return (
			<ErrorBlock
				error={new Error("This user is not currently streaming.")}
			/>
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
					<VideoDetailBox
						stream={getActualStream(user)}
						user={user}
						showCounter={true}
					/>
				</div>

				<Panel header="Messages">
					<MessageForm
						streamKey={user.streamKey}
						username={loggedUsername}
					/>
					<div className="max-h-screen overflow-y-auto flex flex-col gap-2 mt-4">
						{stream?.messages
							?.filter((message) => !message.answered)
							.map((message) => (
								<Card
									key={message.id}
									title={message.content}
									className="m-0.5"
								/>
							))}
					</div>
				</Panel>
			</div>
		</>
	);
};

export default StreamPage;
