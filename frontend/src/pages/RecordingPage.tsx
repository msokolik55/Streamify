import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import VideoDetailBox from "../components/VideoDetailBox";
import VideoPlayer from "../components/VideoPlayer";
import ErrorBlock from "../components/errors/ErrorBlock";
import { useFetchSWR } from "../functions/useFetch";
import { IStream } from "../models/IStream";
import { apiStreamUrl } from "../urls";

const RecordingPage = () => {
	const { streamId } = useParams();

	const { data: stream, error } = useFetchSWR<IStream>(
		`${apiStreamUrl}/${streamId}`,
	);

	if (error) {
		return <ErrorBlock error={error} />;
	}

	if (!stream) {
		return (
			<ErrorBlock
				error={new Error("Cannot find stream with given id.")}
			/>
		);
	}

	const videoSrc = `/recordings/${stream.path}/video.mp4`;

	return (
		<div>
			<Helmet>
				<title>{stream.name} - Streamify</title>
			</Helmet>
			<VideoPlayer url={videoSrc} />
			<VideoDetailBox
				stream={stream}
				user={stream.user}
				showCounter={false}
			/>
		</div>
	);
};

export default RecordingPage;
