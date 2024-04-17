import { Server, Socket } from "socket.io";

import { logInfo } from "./logger";
import { updateMaxCount } from "./resources/stream";

type SocketData = {
	streamKey: string;
	browserId: string;
};

const streamViewers: { [streamId: string]: number } = {};
const alreadyConnected: { [browserId: string]: number } = {};
let connectedSockets: Socket[] = [];

const emitUpdatedCounts = (io: Server, socket: Socket) => {
	io.emit(
		`viewer_count_${socket.data.streamKey}`,
		streamViewers[socket.data.streamKey],
	);
	io.emit("viewer_counts", streamViewers);
};

const disconnectUser = async (io: Server, socket: Socket) => {
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
	await updateMaxCount(
		socket.data.streamKey,
		streamViewers[socket.data.streamKey],
	);

	emitUpdatedCounts(io, socket);
	socket.disconnect();
};

export const registerCounter = (io: Server, socket: Socket) => {
	socket.data = {
		heartbeat: Date.now(),
		streamKey: "",
		browserId: "",
	};

	logInfo("io", "connection", "A user connected");

	socket.on("join_stream", async (data: SocketData) => {
		if (!alreadyConnected[data.browserId]) {
			alreadyConnected[data.browserId] = 0;
			if (!streamViewers[data.streamKey]) {
				streamViewers[data.streamKey] = 0;
			}
			streamViewers[data.streamKey]++;
			await updateMaxCount(data.streamKey, streamViewers[data.streamKey]);
		}
		alreadyConnected[data.browserId]++;
		connectedSockets.push(socket);

		socket.data = data;
		emitUpdatedCounts(io, socket);
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
