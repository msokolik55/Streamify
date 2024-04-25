export interface IVideoControls {
	playing: boolean;
	seeking: boolean;
	controls: boolean;
	light: boolean;
	volume: number;
	muted: boolean;
	played: number;
	duration: number;
	playbackRate: number;
	loop: boolean;
	fullscreen: boolean;
}
