import { Button } from "primereact/button";
import { Dispatch, SetStateAction } from "react";

interface IRetryControlsProps {
	setRetryKey: Dispatch<SetStateAction<number>>;
}

const RetryControls = (props: IRetryControlsProps) => {
	return (
		<Button
			icon="pi pi-refresh"
			className="w-12"
			onClick={() => props.setRetryKey((prev) => prev + 1)}
			text
		/>
	);
};

export default RetryControls;
