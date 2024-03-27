import express, { Request, Response } from "express";
import { login, password, stream, user } from "./resources";
import swaggerUi from "swagger-ui-express";

const router = express.Router();
const swaggerDocument = require("./swagger.json");

const swaggerUrl = "/swagger";
const userUrl = "/users";
const liveUrl = "/live";
const loginUrl = "/login";
const streamUrl = "/streams";
const passwordUrl = "/password";

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

router.patch(`${userUrl}/${idPart}/inc`, user.increaseCount);
router.patch(`${userUrl}/${idPart}/dec`, user.decreaseCount);

//#endregion User

//#region Live

router.get(`${userUrl}${liveUrl}`, user.getByLive);
router.patch(`${userUrl}${liveUrl}/${idPart}`, user.updateLive);

//#endregion Live

//#region Login

router.post(loginUrl, login.checkLogin);

//#endregion Login

//#region Stream

// router.get(`${streamPath}/:folderName`, stream.getVideoName);
router.post(streamUrl, stream.createStream);

router.get(`${streamUrl}/${idPart}`, stream.getById);
router.put(`${streamUrl}/${idPart}`, stream.editStream);

router.delete(`${streamUrl}/${streamPathPart}`, stream.deleteStream);
router.get(`${streamUrl}/${streamPathPart}/exists`, stream.streamSourceExists);
router.put(`${streamUrl}/${streamPathPart}/end`, stream.endStream);

//#endregion Stream

//#region Password

router.put(passwordUrl, password.changePassword);

//#endregion Password

router.get("*", (_: Request, res: Response) => {
	res.status(404).send({ error: "Path not found" });
});

export default router;
