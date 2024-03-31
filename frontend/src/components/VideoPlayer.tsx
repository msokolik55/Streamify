// import { BigPlayButton, Player } from "video-react";
import { useState } from "react";
import "video-react/dist/video-react.css";

import { baseUrl } from "../env";

// import HlsSource from "./HlsSource";

interface IVideoPlayerProps {
	streamKey: string;
}

const VideoPlayer = (props: IVideoPlayerProps) => {
	const qualities = [
		{
			port: 8888,
			resolution: "original",
		},
		{ port: 7888, resolution: "360p" },
	];
	const [qualityId, setQualityId] = useState(0);

	const iframeUrl = `${baseUrl}:${qualities[qualityId].port}/${props.streamKey}`;

	// const hlsExtension = "index.m3u8";
	// const hlsUrl = `${baseUrl}/${hlsExtension}`;

	return (
		<div>
			<iframe src={iframeUrl} className="h-screen"></iframe>
			<select
				value={qualityId}
				onChange={(e) => setQualityId(parseInt(e.target.value))}
			>
				{qualities.map((quality, index) => (
					<option key={`quality-${index}`} value={index}>
						{quality.resolution}
					</option>
				))}
			</select>

			{/* <div>
				<Player playsInline src={hlsUrl}>
					<BigPlayButton position="center" />
					<HlsSource src={hlsUrl} video={videoRef.current!} />
				</Player>
			</div> */}
		</div>
	);
};

export default VideoPlayer;
