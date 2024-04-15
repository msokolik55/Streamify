import { ChangeEvent, useState } from "react";
import ReactPlayer from "react-player";

import { baseUrl } from "../env";

interface IVideoPlayerProps {
	streamKey: string;
}

interface IControls {
	url: string | null;
	pip: boolean;
	playing: boolean;
	controls: boolean;
	light: boolean;
	volume: number;
	muted: boolean;
	played: number;
	loaded: number;
	duration: number;
	playbackRate: number;
	loop: boolean;
}

const VideoPlayer = (props: IVideoPlayerProps) => {
	const qualities = [{ port: 8888, resolution: "360p" }];
	const [qualityId, setQualityId] = useState(0);

	const [controls, setControls] = useState<IControls>({
		url: null,
		pip: false,
		playing: true,
		controls: false,
		light: false,
		volume: 0.8,
		muted: false,
		played: 0,
		loaded: 0,
		duration: 0,
		playbackRate: 1.0,
		loop: false,
	});

	const [retryKey, setRetryKey] = useState(0);

	const hlsExtension = "index.m3u8";
	const hlsUrl = `${baseUrl}:${qualities[qualityId].port}/${props.streamKey}/${hlsExtension}`;

	const handlePlayPause = () => {
		setControls((prev) => {
			return { ...prev, playing: !prev.playing };
		});
	};

	const handleStop = () => {
		setControls((prev) => {
			return { ...prev, url: null, playing: false };
		});
	};

	const load = (url: string | null) => {
		setControls((prev) => {
			return { ...prev, url, played: 0, loaded: 0, pip: false };
		});
	};

	const handleToggleControls = () => {
		const url = controls.url;
		setControls((prev) => {
			return {
				...prev,
				controls: !controls.controls,
				url: null,
			};
		});
		load(url);
	};

	const handleToggleLight = () => {
		setControls((prev) => {
			return { ...prev, light: !prev.light };
		});
	};

	const handleToggleLoop = () => {
		setControls((prev) => {
			return { ...prev, loop: !prev.loop };
		});
	};

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		setControls((prev) => {
			return { ...prev, volume: parseFloat(e.target.value) };
		});
	};

	const handleToggleMuted = () => {
		setControls((prev) => {
			return { ...prev, muted: !prev.muted };
		});
	};

	// const handleSetPlaybackRate = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
	// 	setControls(prev => {return {...prev, playbackRate: parseFloat(e.target.value) }});
	// };

	// const handleOnPlaybackRateChange = (speed: string) => {
	// 	setControls(prev => {return {...prev, playbackRate: parseFloat(speed) }});
	// };

	// const handlePlay = () => {
	// 	console.log("onPlay");
	// 	setControls(prev => {return {...prev, playing: true }});
	// };

	// const handlePause = () => {
	// 	console.log("onPause");
	// 	setControls(prev => {return {...prev, playing: false }});
	// };

	const handleSeekMouseDown = () => {
		setControls((prev) => {
			return { ...prev, seeking: true };
		});
	};

	const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
		setControls((prev) => {
			return { ...prev, played: parseFloat(e.target.value) };
		});
	};

	// const handleSeekMouseUp = (e: ChangeEvent<HTMLInputElement>) => {
	// 	setControls(prev => {return {...prev, seeking: false }});
	// 	player.seekTo(parseFloat(e.target.value));
	// };

	// const handleProgress = (state) => {
	// 	console.log("onProgress", state);
	// 	// We only want to update time slider if we are not currently seeking
	// 	if (!controls..seeking) {
	// 		setControls(prev => state);
	// 	}
	// };

	// const handleEnded = () => {
	// 	console.log("onEnded");
	// 	setControls(prev => {return {...prev,  playing: prev.loop }});
	// };

	// const handleDuration = (duration: number) => {
	// 	console.log("onDuration", duration);
	// 	setControls(prev => {return {...prev,  duration }});
	// };

	return (
		<div className="flex flex-col">
			<div className="flex flex-row">
				<ReactPlayer
					key={retryKey}
					width="100%"
					height="100%"
					url={hlsUrl}
					controls={true}
					playing={true}
				/>
			</div>
			<button onClick={() => setRetryKey((prev) => prev + 1)}>
				Reload
			</button>
			<table>
				<tbody>
					<tr>
						<th>Controls</th>
						<td>
							<button onClick={handleStop}>Stop</button>
							<button onClick={handlePlayPause}>
								{controls.playing ? "Pause" : "Play"}
							</button>
							{/* <button onClick={handleClickFullscreen}>
								Fullscreen
							</button> */}
						</td>
					</tr>
					{/* <tr>
						<th>Speed</th>
						<td>
							<button onClick={handleSetPlaybackRate} value={1}>
								1x
							</button>
							<button onClick={handleSetPlaybackRate} value={1.5}>
								1.5x
							</button>
							<button onClick={handleSetPlaybackRate} value={2}>
								2x
							</button>
						</td>
					</tr> */}
					<tr>
						<th>Seek</th>
						<td>
							<input
								type="range"
								min={0}
								max={0.999999}
								step="any"
								value={controls.played}
								onMouseDown={handleSeekMouseDown}
								onChange={handleSeekChange}
								// onMouseUp={handleSeekMouseUp}
							/>
						</td>
					</tr>
					<tr>
						<th>Volume</th>
						<td>
							<input
								type="range"
								min={0}
								max={1}
								step="any"
								value={controls.volume}
								onChange={handleVolumeChange}
							/>
						</td>
					</tr>
					<tr>
						<th>
							<label htmlFor="controls">Controls</label>
						</th>
						<td>
							<input
								id="controls"
								type="checkbox"
								checked={controls.controls}
								onChange={handleToggleControls}
							/>
							<em>&nbsp; Requires player reload</em>
						</td>
					</tr>
					<tr>
						<th>
							<label htmlFor="muted">Muted</label>
						</th>
						<td>
							<input
								id="muted"
								type="checkbox"
								checked={controls.muted}
								onChange={handleToggleMuted}
							/>
						</td>
					</tr>
					<tr>
						<th>
							<label htmlFor="loop">Loop</label>
						</th>
						<td>
							<input
								id="loop"
								type="checkbox"
								checked={controls.loop}
								onChange={handleToggleLoop}
							/>
						</td>
					</tr>
					<tr>
						<th>
							<label htmlFor="light">Light mode</label>
						</th>
						<td>
							<input
								id="light"
								type="checkbox"
								checked={controls.light}
								onChange={handleToggleLight}
							/>
						</td>
					</tr>
					<tr>
						<th>Played</th>
						<td>
							<progress max={1} value={controls.played} />
						</td>
					</tr>
					<tr>
						<th>Loaded</th>
						<td>
							<progress max={1} value={controls.loaded} />
						</td>
					</tr>
				</tbody>
			</table>

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
