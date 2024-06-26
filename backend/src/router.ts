import express, { Request, Response } from "express";
import passport from "passport";
import swaggerUi from "swagger-ui-express";

import { login, message, password, stream, user } from "./resources";
import { sendResponseError } from "./resources/response";
import { upload } from "./upload";

const router = express.Router();
const swaggerDocument = require("./swagger.json");

const swaggerUrl = "/swagger";
const userUrl = "/users";
const liveUrl = "/live";
const loginUrl = "/login";
const logoutUrl = "/logout";
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
router.post(userUrl, upload.single("picture"), user.create);

router.get(`${userUrl}/${usernamePart}`, user.getByUsername);
router.delete(`${userUrl}/${usernamePart}`, user.deleteUser);

router.put(`${userUrl}/${idPart}`, upload.single("picture"), user.update);

router.patch(`${userUrl}${liveUrl}/${idPart}`, user.updateLive);

//#endregion User

//#region Login

router.post(
	loginUrl,
	passport.authenticate("local", {
		failureRedirect: "/users/profile",
		failureFlash: true,
	}),
	login.login,
);
router.get(logoutUrl, login.logout);
router.get("/authenticated", login.isAuthenticated);

//#endregion Login

//#region Stream

router.get(streamUrl, stream.get);
router.post(streamUrl, stream.createStream);

router.get(`${streamUrl}/${idPart}`, stream.getById);
router.put(`${streamUrl}/${idPart}`, stream.updateStream);

router.delete(`${streamUrl}/${streamPathPart}`, stream.deleteStream);
router.get(`${streamUrl}/${streamPathPart}/exists`, stream.streamSourceExists);
router.put(`${streamUrl}/${streamPathPart}/end`, stream.endStream);
router.get(`${streamUrl}/${streamPathPart}${messageUrl}`, stream.getMessages);

//#endregion Stream

//#region Password

router.put(passwordUrl, password.changePassword);

//#endregion Password

//#region Message

router.post(messageUrl, message.createMessage);
router.patch(`${messageUrl}/${idPart}`, message.answerMessage);
router.delete(`${messageUrl}/${idPart}`, message.deleteMessage);

//#endregion Message

router.get("*", (_: Request, res: Response) => {
	return sendResponseError(res, 404, "Path not found");
});

export default router;
