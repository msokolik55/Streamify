import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface IStreamInfoPanelProps {
	streamKey: string;
}

const StreamInfoPanel = (props: IStreamInfoPanelProps) => {
	const toast = useRef<Toast>(null);

	const copyStreamKey = () => {
		navigator.clipboard.writeText(props.streamKey ?? "");

		toast.current?.show({
			severity: "success",
			summary: "Copied",
			detail: "Stream key copied to clipboard.",
		});
	};

	return (
		<div className="flex flex-row gap-2 justify-between items-center">
			<div className="flex flex-row gap-2">
				<span className="font-bold">Stream Key:</span>
				<span>{props.streamKey}</span>
			</div>
			<Button label="Copy" onClick={copyStreamKey} />

			<Toast ref={toast} />
		</div>
	);
};

export default StreamInfoPanel;
