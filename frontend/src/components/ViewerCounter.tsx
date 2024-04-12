import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { apiUrl } from "../env";

const socket = io(apiUrl);

interface ViewerCounterProps {
	streamKey: string;
}

const ViewerCounter = (props: ViewerCounterProps) => {
	const [viewerCount, setViewerCount] = useState(0);

	const getBrowserId = () => {
		const browserId = localStorage.getItem("browserId");
		if (browserId) {
			return browserId;
		}

		const newBrowserId = uuidv4();
		localStorage.setItem("browserId", newBrowserId);
		return newBrowserId;
	};

	useEffect(() => {
		console.log("*****************************************");

		socket.emit("join_stream", {
			streamKey: props.streamKey,
			heartbeat: Date.now(),
			browserId: getBrowserId(),
		});

		socket.on(`viewer_count_${props.streamKey}`, (count: number) => {
			setViewerCount(count);
		});

		setInterval(() => {
			socket.emit("heartbeat", { heartbeat: Date.now() });
		}, 1000);

		return () => {
			socket.off(`viewer_count_${props.streamKey}`);
		};
	}, [props.streamKey]);

	return (
		<div>
			<h1>Current Viewers: {viewerCount}</h1>
		</div>
	);
};

export default ViewerCounter;
