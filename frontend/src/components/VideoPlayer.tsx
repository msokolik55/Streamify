import { useState } from "react";
import ReactPlayer from "react-player";
import "video-react/dist/video-react.css";

import { baseUrl } from "../env";

interface IVideoPlayerProps {
	streamKey: string;
}

const VideoPlayer = (props: IVideoPlayerProps) => {
	const qualities = [{ port: 8888, resolution: "360p" }];
	const [qualityId, setQualityId] = useState(0);

	const [retryKey, setRetryKey] = useState(0);

	const hlsExtension = "index.m3u8";
	const hlsUrl = `${baseUrl}:${qualities[qualityId].port}/${props.streamKey}/${hlsExtension}`;

	return (
		<div className="flex flex-col">
			<ReactPlayer
				key={retryKey}
				width="100%"
				height="100%"
				url={hlsUrl}
				controls={true}
				playing={true}
			/>
			<button onClick={() => setRetryKey((prev) => prev + 1)}>
				Reload
			</button>

			<select
				className="text-black"
				value={qualityId}
				onChange={(event) => setQualityId(parseInt(event.target.value))}
			>
				{qualities.map((quality, index) => (
					<option key={`quality-${index}`} value={index}>
						{quality.resolution}
					</option>
				))}
			</select>
		</div>
	);
};

export default VideoPlayer;
