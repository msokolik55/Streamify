import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

import { baseUrl } from "../../env";
import Duration from "../Duration";

interface IStreamSource {
	streamKey: string;
	url?: never;
}

interface IFileSource {
	streamKey?: never;
	url: string;
}

type IVideoPlayerProps = IStreamSource | IFileSource;

interface IControls {
	playing: boolean;
	seeking: boolean;
	controls: boolean;
	light: boolean;
	volume: number;
	muted: boolean;
	played: number;
	loaded: number;
	duration: number;
	playbackRate: number;
	loop: boolean;
	fullscreen: boolean;
}

const VideoPlayer = (props: IVideoPlayerProps) => {
	const qualities = [
		{ port: 8888, resolution: "360p" },
		{ port: 7888, resolution: "720p" },
	];
	const [streamPort, setStreamPort] = useState(qualities[0].port);

	const [controls, setControls] = useState<IControls>({
		playing: true,
		seeking: false,
		controls: false,
		light: false,
		volume: 0.8,
		muted: false,
		played: 0,
		loaded: 0,
		duration: 0,
		playbackRate: 1.0,
		loop: false,
		fullscreen: false,
	});

	const [retryKey, setRetryKey] = useState(0);
	const playerWrapperRef = useRef<HTMLDivElement>(null);
	const reactPlayerRef = useRef<ReactPlayer>(null);

	const hlsUrl = `${baseUrl}:${streamPort}/${props.streamKey}/index.m3u8`;
	const url = props.streamKey ? hlsUrl : props.url;

	const handlePlayPause = () => {
		setControls((prev) => {
			return { ...prev, playing: !prev.playing };
		});
	};

	//#region Volume

	const handleVolumeChange = (e: SliderChangeEvent) => {
		const newVolume = (e.value as number) / 100;
		setControls((prev) => {
			return { ...prev, volume: newVolume };
		});
	};

	const handleToggleMuted = () => {
		setControls((prev) => {
			return { ...prev, muted: !prev.muted };
		});
	};

	//#endregion Volume

	//#region Seek

	const handleSeekMouseDown = () => {
		setControls((prev) => {
			return { ...prev, seeking: true };
		});
	};

	const handleSeekChange = (e: SliderChangeEvent) => {
		const newPlayed = (e.value as number) / 100;
		setControls((prev) => {
			return { ...prev, played: newPlayed };
		});
		if (reactPlayerRef.current) {
			reactPlayerRef.current.seekTo(newPlayed, "fraction");
		}
	};

	const handleSeekMouseUp = (): void => {
		setControls((prev) => {
			return { ...prev, seeking: false };
		});
	};

	//#endregion Seek

	const handleProgress = (state: OnProgressProps) => {
		if (!controls.seeking) {
			setControls((prev) => {
				return { ...prev, played: state.played, loaded: state.loaded };
			});
		}
	};

	const handleDuration = (duration: number) => {
		setControls((prev) => {
			return { ...prev, duration };
		});
	};

	const handleClickFullscreen = () => {
		if (!playerWrapperRef.current) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
			setControls((prev) => {
				return { ...prev, fullscreen: false };
			});
			return;
		}

		playerWrapperRef.current
			.requestFullscreen()
			.then(() =>
				setControls((prev) => {
					return { ...prev, fullscreen: true };
				}),
			)
			.catch((err) => {
				alert(
					`Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
				);
			});
	};

	return (
		<div
			className="flex flex-col relative"
			ref={playerWrapperRef}
			onPointerEnter={() =>
				setControls((prev) => {
					return { ...prev, controls: true };
				})
			}
			onPointerLeave={() =>
				setControls((prev) => {
					return { ...prev, controls: false };
				})
			}
			onKeyDown={(e) => {
				if (e.key === "q") {
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
			}}
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
					${controls.controls ? "opacity-100" : "opacity-100"}
					`}
			>
				<Slider
					value={controls.played}
					onMouseDown={handleSeekMouseDown}
					onChange={handleSeekChange}
					onMouseUp={handleSeekMouseUp}
				/>
				<div className="mx-1 flex flex-col gap-2">
					<div className="flex flex-row justify-between">
						<div className="flex flex-row gap-1 items-center">
							<Button
								icon={`pi pi-${!controls.playing ? "play" : "pause"}`}
								className="w-12"
								onClick={handlePlayPause}
								text
							/>
							<Button
								icon="pi pi-replay"
								className="w-12"
								onClick={() => setRetryKey((prev) => prev + 1)}
								text
							/>
							<div className="flex flex-row items-center gap-1">
								<Button
									icon={`pi pi-volume-${!controls.muted ? "up" : "off"}`}
									className="w-28"
									onClick={handleToggleMuted}
									text
								/>
								<Slider
									className="w-full"
									value={controls.volume}
									onChange={handleVolumeChange}
								/>

								<div className="text-white text-nowrap ml-2">
									<Duration seconds={controls.duration} />
									<span> / </span>
									<Duration
										seconds={
											controls.duration * controls.played
										}
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-row items-center gap-1">
							<span className="text-white">(Q)</span>
							<Dropdown
								className="bg-transparent text-white border-none font-medium"
								value={streamPort}
								onChange={(event) => {
									console.log(event.value);
									setStreamPort(event.value);
								}}
								options={qualities.map((quality) => {
									return {
										label: quality.resolution,
										value: quality.port,
									};
								})}
							/>
							<Button
								icon={`pi pi-window-${!controls.fullscreen ? "maximize" : "minimize"}`}
								onClick={handleClickFullscreen}
								text
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoPlayer;
