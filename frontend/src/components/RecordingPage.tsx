import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { BigPlayButton, Player } from "video-react";

import { IResponseData } from "../models/IResponseData";
import { IStream } from "../models/IStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl } from "../urls";
import VideoDetailBox from "./VideoDetailBox";
import MainWindowError from "./errors/MainWindowError";

const RecordingPage = () => {
	const { streamId } = useParams();

	const { data, error } = useSWR<IResponseData<IStream>, Error>(
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
			<Helmet>
				<title>{stream.name} - Streamify</title>
			</Helmet>
			<Player playsInline src={`/recordings/${stream.path}/video.mp4`}>
				<BigPlayButton position="center" />
			</Player>

			<VideoDetailBox
				stream={stream}
				user={stream.user}
				showCounter={false}
			/>
		</div>
	);
};

export default RecordingPage;
