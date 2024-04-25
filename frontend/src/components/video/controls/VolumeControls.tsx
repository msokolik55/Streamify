import { Button } from "primereact/button";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Dispatch, SetStateAction } from "react";

import { IVideoControls } from "../../../models/IVideoControls";

interface IVolumeControlsProps {
	controls: IVideoControls;
	setControls: Dispatch<SetStateAction<IVideoControls>>;
}

const VolumeControls = (props: IVolumeControlsProps) => {
	const handleVolumeChange = (e: SliderChangeEvent) => {
		const newVolume = (e.value as number) / 100;
		props.setControls((prev) => {
			return { ...prev, volume: newVolume };
		});
	};

	const handleToggleMuted = () => {
		props.setControls((prev) => {
			return { ...prev, muted: !prev.muted };
		});
	};

	return (
		<div className="flex flex-row items-center gap-1 mr-4">
			<Button
				icon={`pi pi-volume-${!props.controls.muted ? "up" : "off"}`}
				className="w-28"
				onClick={handleToggleMuted}
				text
			/>
			<Slider
				className="w-full rounded-none"
				value={props.controls.volume * 100}
				onChange={handleVolumeChange}
			/>
		</div>
	);
};

export default VolumeControls;
