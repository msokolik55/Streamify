import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { loggedUserUsernameAtom } from "../atom";
import ErrorBlock from "../components/error/ErrorBlock";
import Heading2 from "../components/heading/Heading2";
import MessageForm from "../components/message/MessageForm";
import VideoDetailBox from "../components/video/VideoDetailBox";
import VideoPlayer from "../components/video/VideoPlayer";
import { getActualStream } from "../functions/getStreams";
import { useFetchSWR, useUser } from "../functions/useFetch";
import { IStream } from "../models/IStream";
import { apiStreamUrl, messagePath } from "../urls";

const StreamPage = () => {
	const loggedUsername = useRecoilValue(loggedUserUsernameAtom);
	const { username } = useParams();
	const { data: user, error: errorUser } = useUser(username);
	const { data: stream, error: errorMessages } = useFetchSWR<IStream>(
		`${apiStreamUrl}/${user?.streamKey}${messagePath}`,
	);

	if (errorUser) {
		return <ErrorBlock error={errorUser} />;
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
					<div className="max-h-screen max-w-xs overflow-y-auto flex flex-col gap-2 mt-4">
						{stream?.messages
							?.filter((message) => !message.answered)
							.map((message) => (
								<Card key={message.id} className="m-0.5">
									<Heading2 title={message.content} />
								</Card>
							))}
					</div>
				</Panel>
			</div>
		</>
	);
};

export default StreamPage;
