import { io } from "socket.io-client";

import { apiUrl } from "./env";

export const socket = io(apiUrl, {
	autoConnect: false,
});
