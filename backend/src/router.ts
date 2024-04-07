import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import { login, message, password, stream, user } from "./resources";
import { sendResponseError } from "./resources/response";

const router = express.Router();
const swaggerDocument = require("./swagger.json");

const swaggerUrl = "/swagger";
const userUrl = "/users";
const liveUrl = "/live";
const loginUrl = "/login";
const streamUrl = "/streams";
const passwordUrl = "/password";
const messageUrl = "/messages";

const idPart = ":id";
const usernamePart = ":username";
const streamPathPart = ":streamPath";

//#region Swagger

router.use(swaggerUrl, swaggerUi.serve);
router.get(swaggerUrl, swaggerUi.setup(swaggerDocument));

//#endregion Swagger

//#region User

router.get(userUrl, user.get);
router.post(userUrl, user.create);

router.get(`${userUrl}/${usernamePart}`, user.getByUsername);
router.put(`${userUrl}/${idPart}`, user.update);
router.delete(`${userUrl}/${usernamePart}`, user.deleteUser);

router.patch(`${userUrl}/${usernamePart}/inc`, user.increaseCount);
router.patch(`${userUrl}/${usernamePart}/dec`, user.decreaseCount);

router.patch(`${userUrl}${liveUrl}/${idPart}`, user.updateLive);

//#endregion User

//#region Login

router.post(loginUrl, login.checkLogin);

//#endregion Login

//#region Stream

// router.get(`${streamPath}/:folderName`, stream.getVideoName);
router.post(streamUrl, stream.createStream);

router.get(`${streamUrl}/${idPart}`, stream.getById);
router.put(`${streamUrl}/${idPart}`, stream.updateStream);

router.delete(`${streamUrl}/${streamPathPart}`, stream.deleteStream);
router.get(`${streamUrl}/${streamPathPart}/exists`, stream.streamSourceExists);
router.put(`${streamUrl}/${streamPathPart}/end`, stream.endStream);

//#endregion Stream

//#region Password

router.put(passwordUrl, password.changePassword);

//#endregion Password

//#region Message

router.post(messageUrl, message.createMessage);
router.delete(`${messageUrl}/${idPart}`, message.deleteMessage);
router.get(`${messageUrl}${streamUrl}/:streamId`, message.getByStreamId);

//#endregion Message

router.get("*", (_: Request, res: Response) => {
	return sendResponseError(res, 404, "Path not found");
});

export default router;
