import { IVideoControls } from "../../../models/IVideoControls";
import Duration from "../../Duration";

interface IDurationPanelProps {
	controls: IVideoControls;
}

const DurationPanel = (props: IDurationPanelProps) => {
	return (
		<div className="text-white text-nowrap ml-2">
			<Duration
				seconds={props.controls.duration * props.controls.played}
			/>
			<span> / </span>
			<Duration seconds={props.controls.duration} />
		</div>
	);
};

export default DurationPanel;
