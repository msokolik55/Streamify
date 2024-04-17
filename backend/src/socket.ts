import { Server, Socket } from "socket.io";

import { logInfo } from "./logger";

type SocketData = {
	streamKey: string;
	browserId: string;
};

const streamViewers: { [streamId: string]: number } = {};
const alreadyConnected: { [browserId: string]: number } = {};
let connectedSockets: Socket[] = [];

const disconnectUser = (io: Server, socket: Socket) => {
	alreadyConnected[socket.data.browserId]--;
	if (alreadyConnected[socket.data.browserId] > 0) {
		return;
	}

	console.log("A user disconnected");
	delete alreadyConnected[socket.data.browserId];
	connectedSockets = connectedSockets.filter((s) => s !== socket);
	streamViewers[socket.data.streamKey] = Math.max(
		streamViewers[socket.data.streamKey] - 1,
		0,
	);

	io.emit(
		`viewer_count_${socket.data.streamKey}`,
		streamViewers[socket.data.streamKey],
	);
	socket.disconnect();
};

export const registerCounter = (io: Server, socket: Socket) => {
	socket.data = {
		heartbeat: Date.now(),
		streamKey: "",
		browserId: "",
	};

	logInfo("io", "connection", "A user connected");

	socket.on("join_stream", (data: SocketData) => {
		if (!alreadyConnected[data.browserId]) {
			alreadyConnected[data.browserId] = 0;
			if (!streamViewers[data.streamKey]) {
				streamViewers[data.streamKey] = 0;
			}
			streamViewers[data.streamKey]++;
		}
		alreadyConnected[data.browserId]++;
		connectedSockets.push(socket);

		socket.data = data;
		io.emit(
			`viewer_count_${data.streamKey}`,
			streamViewers[data.streamKey],
		);
	});

	socket.on("heartbeat", (data: { heartbeat: number }) => {
		socket.data.heartbeat = data.heartbeat;
	});

	socket.on("disconnect", () => {
		disconnectUser(io, socket);
	});
};

export const checkHeartbeat = (io: Server) => {
	setInterval(() => {
		const now = Date.now();
		connectedSockets.forEach((socket) => {
			// TODO: Change 2000 to 30000
			if (now - socket.data.heartbeat > 2000) {
				logInfo(
					"WS",
					setInterval.name,
					"No heartbeat received in the last 30 seconds. Assuming disconnected.",
				);

				disconnectUser(io, socket);
			}
		});
		// TODO: Change 1000 to 10000
	}, 1000);
};
