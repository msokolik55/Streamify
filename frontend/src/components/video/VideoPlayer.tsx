import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

import { baseUrl } from "../../env";
import { IVideoControls } from "../../models/IVideoControls";
import DurationPanel from "./controls/DurationPanel";
import FullscreenControls from "./controls/FullscreenControls";
import LiveIndicator from "./controls/LiveIndicator";
import PlayPauseControls from "./controls/PlayPauseControls";
import ResolutionControls from "./controls/ResolutionControls";
import RetryControls from "./controls/RetryControls";
import SeekControls from "./controls/SeekControls";
import VolumeControls from "./controls/VolumeControls";

interface IStreamSource {
	streamKey: string;
	url?: never;
}

interface IFileSource {
	streamKey?: never;
	url: string;
}

type IVideoPlayerProps = { live: boolean } & (IStreamSource | IFileSource);

const VideoPlayer = (props: IVideoPlayerProps) => {
	const qualities = [
		{ port: 8888, resolution: "360p" },
		{ port: 7888, resolution: "720p" },
	];

	const [streamPort, setStreamPort] = useState(qualities[0].port);
	const [controls, setControls] = useState<IVideoControls>({
		playing: true,
		seeking: false,
		controls: false,
		volume: 0.8,
		muted: false,
		played: 0,
		duration: 0,
		fullscreen: false,
	});
	const [retryKey, setRetryKey] = useState(0);

	const playerWrapperRef = useRef<HTMLDivElement>(null);
	const reactPlayerRef = useRef<ReactPlayer>(null);
	const toast = useRef<Toast>(null);

	const hlsUrl = `${baseUrl}:${streamPort}/${props.streamKey}/index.m3u8`;
	const url = props.streamKey ? hlsUrl : props.url;

	const toggleControls = (show: boolean) => {
		setControls((prev) => {
			return { ...prev, controls: show };
		});
	};

	const handleKeyDown = (pressedKey: string) => {
		if (pressedKey === " ") {
			handlePlayPause();
		}

		if (pressedKey === "q") {
			setStreamPort((prev) => {
				const currentIndex = qualities.findIndex(
					(quality) => quality.port === prev,
				);
				const nextIndex =
					currentIndex === qualities.length - 1
						? 0
						: currentIndex + 1;
				return qualities[nextIndex].port;
			});
		}
	};

	//#region React Player Events

	const handlePlayPause = () => {
		setControls((prev) => {
			return { ...prev, playing: !prev.playing };
		});
	};

	const handleProgress = (state: OnProgressProps) => {
		if (controls.seeking) return;

		setControls((prev) => {
			return { ...prev, played: state.played };
		});
	};

	const handleDuration = (duration: number) => {
		setControls((prev) => {
			return { ...prev, duration };
		});
	};

	//#endregion React Player Events

	return (
		<div
			className="flex flex-col relative"
			ref={playerWrapperRef}
			onPointerEnter={() => toggleControls(true)}
			onPointerLeave={() => toggleControls(false)}
			onKeyDown={(e) => handleKeyDown(e.key)}
		>
			<div
				className="bg-black w-full"
				tabIndex={0}
				onClick={handlePlayPause}
			>
				<ReactPlayer
					key={retryKey}
					ref={reactPlayerRef}
					width="100%"
					height="100%"
					url={url}
					volume={controls.volume}
					playing={controls.playing}
					onProgress={handleProgress}
					onDuration={handleDuration}
					muted={controls.muted}
				/>
			</div>
			<div
				className={`absolute bottom-0 w-full
					ease-in-out duration-200 transition-opacity
					${controls.controls ? "opacity-100" : "opacity-0"}
					`}
			>
				<SeekControls
					controls={controls}
					setControls={setControls}
					reactPlayerRef={reactPlayerRef}
				/>

				<div className="mx-1 flex flex-col gap-2 bg-black">
					<div className="flex flex-row justify-between">
						<div className="flex flex-row gap-1 items-center">
							<PlayPauseControls
								controls={controls}
								handlePlayPause={handlePlayPause}
							/>
							<RetryControls setRetryKey={setRetryKey} />

							<VolumeControls
								controls={controls}
								setControls={setControls}
							/>

							{!props.live ? (
								<DurationPanel controls={controls} />
							) : (
								<LiveIndicator />
							)}
						</div>

						<div className="flex flex-row items-center gap-1">
							{props.live && (
								<ResolutionControls
									streamPort={streamPort}
									setStreamPort={setStreamPort}
									qualities={qualities}
								/>
							)}

							<FullscreenControls
								controls={controls}
								setControls={setControls}
								playerWrapperRef={playerWrapperRef}
								toast={toast}
							/>
						</div>
					</div>
				</div>
			</div>

			<Toast ref={toast} />
		</div>
	);
};

export default VideoPlayer;
