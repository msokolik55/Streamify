import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dispatch, RefObject, SetStateAction } from "react";

import { IVideoControls } from "../../../models/IVideoControls";

interface IFullscreenControlsProps {
	controls: IVideoControls;
	setControls: Dispatch<SetStateAction<IVideoControls>>;
	playerWrapperRef: RefObject<HTMLDivElement>;
	toast: RefObject<Toast>;
}

const FullscreenControls = (props: IFullscreenControlsProps) => {
	const handleClickFullscreen = () => {
		if (!props.playerWrapperRef.current) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
			props.setControls((prev) => {
				return { ...prev, fullscreen: false };
			});
			return;
		}

		props.playerWrapperRef.current
			.requestFullscreen()
			.then(() =>
				props.setControls((prev) => {
					return { ...prev, fullscreen: true };
				}),
			)
			.catch((err) => {
				props.toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
					life: 3000,
				});
			});
	};

	return (
		<Button
			icon={`pi pi-window-${!props.controls.fullscreen ? "maximize" : "minimize"}`}
			onClick={handleClickFullscreen}
			text
		/>
	);
};

export default FullscreenControls;
