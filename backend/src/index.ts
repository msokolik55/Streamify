import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { logInfo } from "./logger";
import router from "./router";
import { checkHeartbeat, registerCounter } from "./socket";

const api = express();
const httpServer = createServer(api);

const corsPolicy = {
	origin: "http://localhost:3000",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

api.use(express.json());
api.use(cors(corsPolicy));
api.use("/", router);

const io = new SocketIOServer(httpServer, {
	cors: corsPolicy,
});
io.on("connection", (socket) => {
	registerCounter(io, socket);
	checkHeartbeat(io);
});

const port = process.env.PORT ?? 4000;
httpServer.listen(port, () =>
	logInfo("httpServer", "listen", "Example app listening on port", port),
);
