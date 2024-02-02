import Hls from "hls.js";
import { useEffect } from "react";

interface IHlsSourceProps {
	src: string;
	video: HTMLMediaElement;
}

const HlsSource = (props: IHlsSourceProps) => {
	const hls = new Hls();

	useEffect(() => {
		if (Hls.isSupported()) {
			hls.loadSource(props.src);
			hls.attachMedia(props.video);

			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				props.video.play();
			});
		}

		return () => {
			if (hls) hls.destroy();
		};
	}, []);

	return <source src={props.src} type="application/x-mpegURL" />;
};

export default HlsSource;
