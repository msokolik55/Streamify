import { useParams } from "react-router-dom";
import useSWR from "swr";
import { BigPlayButton, Player } from "video-react";

import { IDataStream } from "../models/IDataStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl } from "../urls";
import VideoDetailBox from "./VideoDetailBox";
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

			<VideoDetailBox
				stream={stream}
				user={stream.user}
				showCounter={false}
			/>
		</div>
	);
};

export default RecordingPage;
