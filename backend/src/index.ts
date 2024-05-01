import { initSDK } from "@hyperdx/node-opentelemetry";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import passport from "passport";
import { createClient } from "redis";
import { Server as SocketIOServer } from "socket.io";

import { authenticate, deserializeUser, serializeUser } from "./auth";
import { logError, logInfo } from "./logger";
import router from "./router";
import { checkHeartbeat, registerCounter } from "./socket";

const api = express();

dotenv.config({
	path:
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development",
});
const port = process.env.PORT ?? 4000;

initSDK({
	consoleCapture: true,
	additionalInstrumentations: [],
});

const redisClient = createClient({
	url: process.env.REDIS_URL,
});
redisClient.on("error", (err) =>
	logError("(index)", "redisClient", "Redis Client Error", err),
);
redisClient.connect().catch((err) => logError("(index)", "redisClient", err));

const corsPolicy = {
	origin: `${process.env.FE_URL}:${process.env.FE_PORT}`,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	credentials: true,
};

const secret = "session_secret";

api.use(express.json());

if (process.env.NODE_ENV === "test") {
	api.use(cors());
} else {
	api.use(cors(corsPolicy));
}
api.use(cookieParser(secret));

const httpServer = createServer(api);
const io = new SocketIOServer(httpServer, {
	cors: corsPolicy,
});
io.on("connection", (socket) => {
	registerCounter(io, socket);
	checkHeartbeat(io);
});

api.use(express.urlencoded({ extended: true }));
api.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
		},
	}),
);
api.use(passport.initialize());
api.use(passport.session());

authenticate(passport);
serializeUser(passport);
deserializeUser(passport);

api.use("/", router);
if (process.env.NODE_ENV !== "test") {
	httpServer.listen(port, () =>
		logInfo("httpServer", "listen", "Example app listening on port", port),
	);
}

export default httpServer;
