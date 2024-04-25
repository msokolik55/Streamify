import { Button } from "primereact/button";

import { IVideoControls } from "../../../models/IVideoControls";

interface IPlayPauseControlsProps {
	controls: IVideoControls;
	handlePlayPause: () => void;
}

const PlayPauseControls = (props: IPlayPauseControlsProps) => {
	return (
		<Button
			icon={`pi pi-${!props.controls.playing ? "play" : "pause"}`}
			className="w-12"
			onClick={props.handlePlayPause}
			text
		/>
	);
};

export default PlayPauseControls;
