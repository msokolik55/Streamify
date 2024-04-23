import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import VideoDetailBox from "../components/VideoDetailBox";
import VideoPlayer from "../components/VideoPlayer";
import ErrorBlock from "../components/errors/ErrorBlock";
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
