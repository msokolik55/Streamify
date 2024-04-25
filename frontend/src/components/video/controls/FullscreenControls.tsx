import { Button } from "primereact/button";

import { IVideoControls } from "../../../models/IVideoControls";

interface IFullscreenControlsProps {
	controls: IVideoControls;
	handleClickFullscreen: () => void;
}

const FullscreenControls = (props: IFullscreenControlsProps) => {
	return (
		<Button
			icon={`pi pi-window-${!props.controls.fullscreen ? "maximize" : "minimize"}`}
			onClick={props.handleClickFullscreen}
			text
		/>
	);
};

export default FullscreenControls;
