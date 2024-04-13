import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";

import { logInfo } from "./logger";
import router from "./router";

const api = express();
const httpServer = createServer(api);

const corsPolicy = {
	origin: "http://localhost:8080",
	methods: ["GET", "POST"],
};

const io = new SocketIOServer(httpServer, {
	cors: corsPolicy,
});

const port = process.env.PORT ?? 4000;

api.use(express.json());
api.use(cors(corsPolicy));
api.use("/", router);

type SocketData = {
	streamKey: string;
	browserId: string;
};

const streamViewers: { [streamId: string]: number } = {};
const alreadyConnected: { [browserId: string]: number } = {};

const disconnectUser = (socket: Socket) => {
	alreadyConnected[socket.data.browserId]--;
	if (alreadyConnected[socket.data.browserId] > 0) {
		return;
	}

	console.log("A user disconnected");
	delete alreadyConnected[socket.data.browserId];
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

io.on("connection", (socket) => {
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
		disconnectUser(socket);
	});
});

setInterval(() => {
	io.sockets.sockets.forEach((socket) => console.log(socket.data));
	console.log("**********");
	console.log(streamViewers);
	console.log("**********");

	const now = Date.now();
	io.sockets.sockets.forEach((socket) => {
		if (now - socket.data.heartbeat > 2000) {
			logInfo(
				"WS",
				setInterval.name,
				"No heartbeat received in the last 30 seconds. Assuming disconnected.",
			);

			disconnectUser(socket);
		}
	});
}, 1000);

httpServer.listen(port, () =>
	logInfo("httpServer", "listen", "Example app listening on port", port),
);
