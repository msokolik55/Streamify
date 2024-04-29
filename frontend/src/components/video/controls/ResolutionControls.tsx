import { Dropdown } from "primereact/dropdown";
import { Dispatch, SetStateAction } from "react";

interface IResolutionControlsProps {
	streamPort: number;
	setStreamPort: Dispatch<SetStateAction<number>>;
	qualities: { port: number; resolution: string }[];
}

const ResolutionControls = (props: IResolutionControlsProps) => {
	return (
		<>
			<span className="text-white">(Q)uality</span>
			<Dropdown
				className="bg-transparent text-white border-none font-medium"
				value={props.streamPort}
				onChange={(event) => {
					props.setStreamPort(event.value);
				}}
				options={props.qualities.map((quality) => {
					return {
						label: quality.resolution,
						value: quality.port,
					};
				})}
			/>
		</>
	);
};

export default ResolutionControls;
