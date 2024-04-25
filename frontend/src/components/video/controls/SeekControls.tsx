import { Slider, SliderChangeEvent } from "primereact/slider";
import { Dispatch, RefObject, SetStateAction } from "react";
import ReactPlayer from "react-player";

import { IVideoControls } from "../../../models/IVideoControls";

interface ISeekControlsProps {
	controls: IVideoControls;
	setControls: Dispatch<SetStateAction<IVideoControls>>;
	reactPlayerRef: RefObject<ReactPlayer>;
}

const SeekControls = (props: ISeekControlsProps) => {
	const handleSeekMouseDown = () => {
		props.setControls((prev) => {
			return { ...prev, seeking: true };
		});
	};

	const handleSeekChange = (e: SliderChangeEvent) => {
		const newPlayed = (e.value as number) / 100;
		props.setControls((prev) => {
			return { ...prev, played: newPlayed };
		});
		if (props.reactPlayerRef.current) {
			props.reactPlayerRef.current.seekTo(newPlayed, "fraction");
		}
	};

	const handleSeekMouseUp = (): void => {
		props.setControls((prev) => {
			return { ...prev, seeking: false };
		});
	};

	return (
		<Slider
			className="rounded-none"
			value={props.controls.played * 100}
			onMouseDown={handleSeekMouseDown}
			onChange={handleSeekChange}
			onMouseUp={handleSeekMouseUp}
		/>
	);
};

export default SeekControls;
