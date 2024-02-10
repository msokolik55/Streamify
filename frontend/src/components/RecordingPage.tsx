import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import { BigPlayButton, Player } from "video-react";

import { IDataStream } from "../models/IDataStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl, profilePath } from "../urls";
import MainWindowError from "./errors/MainWindowError";

const RecordingPage = () => {
	const { streamId } = useParams();

	const { data, error } = useSWR<IDataStream, Error>(
		`${apiStreamUrl}/${streamId}`,
		fetcher,
	);
	const stream = data?.data;

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!stream) {
		return <MainWindowError message="Cannot find stream with given id." />;
	}

	return (
		<div>
			<div>
				<Player
					playsInline
					src={`/recordings/${stream.path}/video.mp4`}
				>
					<BigPlayButton position="center" />
				</Player>
			</div>

			<div className="flex flex-row">
				<Link to={`${profilePath}/${stream.user.username}`}>
					<div className="m-2 h-20 w-20 flex justify-center items-center">
						<img
							className="rounded-full"
							alt="logo"
							src={stream.user.picture}
						/>
					</div>
				</Link>

				<div className="flex flex-col flex-1 p-2 gap-2">
					<div className="flex">
						<Link to={`${profilePath}/${stream.user.username}`}>
							<h1 className="font-semibold">
								{stream.user.username}
							</h1>
						</Link>
					</div>
					<div className="flex flex-row justify-between ">
						<h2 className="font-semibold">{stream.name}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecordingPage;
