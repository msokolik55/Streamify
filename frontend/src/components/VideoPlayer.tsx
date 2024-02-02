import { BigPlayButton, Player } from "video-react";
import "video-react/dist/video-react.css";

import { streamUrl } from "../env";

// import HlsSource from "./HlsSource";

interface IVideoPlayerProps {
	streamKey: string;
}

const VideoPlayer = (props: IVideoPlayerProps) => {
	const baseUrl = `${streamUrl}/${props.streamKey}`;

	const iframeUrl = baseUrl;

	const hlsExtension = "index.m3u8";
	const hlsUrl = `${baseUrl}/${hlsExtension}`;

	return (
		<>
			<iframe src={iframeUrl}></iframe>
			<div>
				<Player playsInline src={hlsUrl}>
					<BigPlayButton position="center" />
					{/* <HlsSource src={hlsUrl} video={videoRef.current!} /> */}
				</Player>
			</div>
		</>
	);
};

export default VideoPlayer;
