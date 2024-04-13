import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { socket } from "../socket";

interface ViewerCounterProps {
	streamKey: string;
}

const ViewerCounter = (props: ViewerCounterProps) => {
	const [viewerCount, setViewerCount] = useState(0);
	// const [lastHeartbeat, setLastHeartbeat] = useState(Date.now());

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
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		console.log("*****************************************");

		const sendJoinStream = () => {
			socket.emit("join_stream", {
				streamKey: props.streamKey,
				heartbeat: Date.now(),
				browserId: getBrowserId(),
			});
		};

		sendJoinStream();
		socket.on(`viewer_count_${props.streamKey}`, (count: number) => {
			setViewerCount(count);
		});

		const heartbeatInterval = setInterval(() => {
			const now = Date.now();
			socket.emit("heartbeat", { heartbeat: now });
		}, 1000);

		return () => {
			clearInterval(heartbeatInterval);
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
