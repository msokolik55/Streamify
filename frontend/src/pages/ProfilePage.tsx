import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import BrowseStreamsPanel from "../components/BrowseStreamsPanel";
import ProfilePicture from "../components/ProfilePicture";
import ErrorBlock from "../components/error/ErrorBlock";
import Heading1 from "../components/heading/Heading1";
import { useUser } from "../functions/useFetch";
import { streamPath } from "../urls";

const ProfilePage = () => {
	const { username } = useParams();
	const { data: user, error } = useUser(username);

	if (error) {
		return <ErrorBlock error={error} />;
	}

	if (!user) {
		return (
			<ErrorBlock
				error={new Error("Cannot find user with given username.")}
			/>
		);
	}

	const savedStreams = user.streams.filter((stream) => stream.ended);

	return (
		<div className="flex flex-col gap-4">
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			<div className="flex flex-row gap-x-4 items-center">
				<ProfilePicture src={user.picture} username={user.username} />
				<div className="flex flex-col gap-2">
					<Heading1 title={user.username} />
					<span className="text-gray-500">
						{`${savedStreams.length} video${savedStreams.length !== 1 ? "s" : ""}`}
					</span>
				</div>
			</div>

			<BrowseStreamsPanel
				title="Videos"
				streams={savedStreams}
				streamType="saved"
				getUrl={(stream) => `${streamPath}/${stream.id}`}
			/>
		</div>
	);
};

export default ProfilePage;
