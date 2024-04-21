import { Button } from "primereact/button";

interface IStreamInfoPanelProps {
	streamKey: string;
}

const StreamInfoPanel = (props: IStreamInfoPanelProps) => {
	const copyStreamKey = () => {
		navigator.clipboard.writeText(props.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	return (
		<div className="flex flex-row gap-2 justify-between items-center">
			<span>{props.streamKey}</span>
			<Button label="Copy" onClick={copyStreamKey} />
		</div>
	);
};

export default StreamInfoPanel;
