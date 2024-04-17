import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import passport from "passport";
import { Server as SocketIOServer } from "socket.io";

import { authenticate, deserializeUser, serializeUser } from "./auth";
import { logInfo } from "./logger";
import router from "./router";
import { checkHeartbeat, registerCounter } from "./socket";

const api = express();
const httpServer = createServer(api);

const corsPolicy = {
	origin: "http://localhost:3000",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	credentials: true,
};

api.use(express.json());
api.use(cors(corsPolicy));

//#region Socket

const io = new SocketIOServer(httpServer, {
	cors: corsPolicy,
});
io.on("connection", (socket) => {
	registerCounter(io, socket);
	checkHeartbeat(io);
});

//#endregion Socket

//#region Authentication

api.use(express.urlencoded({ extended: true }));
api.use(
	session({
		secret: "session_secret",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	}),
);
api.use(passport.initialize());
api.use(passport.session());

authenticate(passport);
serializeUser(passport);
deserializeUser(passport);

//#endregion Authentication

api.use("/", router);
const port = process.env.PORT ?? 4000;
httpServer.listen(port, () =>
	logInfo("httpServer", "listen", "Example app listening on port", port),
);
