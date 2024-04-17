import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config({
	path:
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development",
});

const corsPolicy = {
	origin: `${process.env.FE_URL}:${process.env.FE_PORT}`, // TODO Production: Change to frontend URL
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	credentials: true,
};
const secret = "session_secret";

api.use(express.json());
api.use(cors(corsPolicy));
api.use(cookieParser(secret));

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
		secret: secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false, // TODO Production: Change to true
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		},
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
