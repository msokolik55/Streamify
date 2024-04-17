import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";

import ProfilePicture from "../components/ProfilePicture";
import StreamCard from "../components/StreamCard";
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
		<div className="px-8 pt-6 flex flex-col gap-8">
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			<div className="flex flex-row gap-x-4 items-center">
				<ProfilePicture src={user.picture} username={user.username} />
				<h1 className="font-semibold text-2xl">{user.username}</h1>
			</div>

			<div className="flex flex-row gap-4 overflow-auto flex-wrap">
				{user.streams.filter((stream) => stream.ended).length === 0 && (
					<p>No videos to show.</p>
				)}
				{user.streams
					.filter((stream) => stream.ended)
					.map((stream, id) => (
						<Link
							key={`stream-${stream.name}-${id}`}
							to={`${streamPath}/${stream.id}`}
						>
							<StreamCard
								stream={stream}
								username={user.username}
							/>
						</Link>
					))}
			</div>
		</div>
	);
};

export default ProfilePage;
