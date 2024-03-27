import express, { Request, Response } from "express";
import { login, password, stream, user } from "./resources";
import swaggerUi from "swagger-ui-express";

const router = express.Router();
const swaggerDocument = require("./swagger.json");

const swaggerPath = "/swagger";
const userPath = "/user";
const livePath = "/live";
const loginPath = "/login";
const streamPath = "/stream";
const passwordPath = "/password";

//#region Swagger

router.use(swaggerPath, swaggerUi.serve);
router.get(swaggerPath, swaggerUi.setup(swaggerDocument));

//#endregion Swagger

//#region User

router.get(userPath, user.get);
router.post(userPath, user.create);
router.put(userPath, user.update);
router.delete(userPath, user.deleteUser);
router.get(`${userPath}/:username`, user.getByUsername);
// TODO: change to PUT
router.get(`${userPath}/:id/inc`, user.increaseCount);
router.get(`${userPath}/:id/dec`, user.decreaseCount);
// ENDTODO

//#endregion User

//#region Live

router.get(livePath, user.getByLive);
router.put(livePath, user.updateLive);

//#endregion Live

//#region Login

router.post(loginPath, login.checkLogin);

//#endregion Login

//#region Stream

// router.get(`${streamPath}/:folderName`, stream.getVideoName);
router.post(streamPath, stream.createStream);
router.put(streamPath, stream.editStream);
router.delete(streamPath, stream.deleteStream);

router.get(`${streamPath}/:id`, stream.getById);
router.get(`${streamPath}/:filePath/exists`, stream.streamSourceExists);
router.put(`${streamPath}/:streamPath/end`, stream.endStream);

//#endregion Stream

//#region Password

router.put(passwordPath, password.changePassword);

//#endregion Password

router.get("*", (_: Request, res: Response) => {
	res.status(404).send({ error: "Path not found" });
});

export default router;
