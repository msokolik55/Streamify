import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import VideoDetailBox from "../components/VideoDetailBox";
import MainWindowError from "../components/errors/MainWindowError";
import { IResponseData } from "../models/IResponseData";
import { IStream } from "../models/IStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl } from "../urls";

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

	const videoSrc = `/recordings/${stream.path}/video.mp4`;

	return (
		<div>
			<Helmet>
				<title>{stream.name} - Streamify</title>
			</Helmet>
			<ReactPlayer url={videoSrc} controls={true} />

			<VideoDetailBox
				stream={stream}
				user={stream.user}
				showCounter={false}
			/>
		</div>
	);
};

export default RecordingPage;
