import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import BrowseStreamsPanel from "../components/BrowseStreamsPanel";
import Heading1 from "../components/Heading1";
import ProfilePicture from "../components/ProfilePicture";
import MainWindowError from "../components/errors/MainWindowError";
import { IResponseData } from "../models/IResponseData";
import { IUser } from "../models/IUser";
import fetcher from "../models/fetcher";
import { apiUserUrl, streamPath } from "../urls";

const ProfilePage = () => {
	const { username } = useParams();

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${username}`,
		fetcher,
	);
	const user = data?.data;

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			<div className="flex flex-row gap-x-4 items-center">
				<ProfilePicture src={user.picture} username={user.username} />
				<Heading1 title={user.username} />
			</div>

			<BrowseStreamsPanel
				title="Videos"
				streams={user.streams.filter((stream) => stream.ended)}
				streamType="saved"
				getUrl={(stream) => `${streamPath}/${stream.id}`}
			/>
		</div>
	);
};

export default ProfilePage;
