import express, { Request, Response } from "express";
import { stream, user } from "./resources";

const router = express.Router();

const userPath = "/user";
const livePath = "/live";
const loginPath = "/login";
const streamPath = "/stream";

router.get(userPath, user.get);
router.put(userPath, user.update);
router.get(`${userPath}/:username`, user.getByUsername);

// TODO: change to PUT
router.get(`${userPath}/:id/inc`, user.increaseCount);
router.get(`${userPath}/:id/dec`, user.decreaseCount);
// ENDTODO

router.get(livePath, user.getByLive);
router.put(livePath, user.updateLive);

router.post(loginPath, user.checkLogin);

// router.get(`${streamPath}/:folderName`, stream.getVideoName);
router.get(`${streamPath}/:id`, stream.getById);
router.delete(`${streamPath}`, stream.deleteStream);

router.get("*", (_: Request, res: Response) => {
	res.status(404).send({ error: "Path not found" });
});

export default router;
