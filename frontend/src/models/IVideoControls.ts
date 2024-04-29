export interface IVideoControls {
	playing: boolean;
	seeking: boolean;
	controls: boolean | undefined;
	volume: number;
	muted: boolean;
	played: number;
	duration: number;
	fullscreen: boolean;
}
