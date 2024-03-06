import prisma from "../client";
import { Request, Response } from "express";
import { sendResponseError, sendResponseSuccess } from "./response";
import path from "path";
import fs from "fs";
import { findByUsername } from "./user";
import { Stream } from "@prisma/client";

/**
 * Return list of all streams
 */
export const get = async (req: Request, res: Response) => {
  const streams = await prisma.stream.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      path: true,
      user: {
        select: {
          picture: true,
          username: true,
        },
      },
    },
  });

  return sendResponseSuccess(res, streams);
};

/**
 * Return streams for a specific user
 */
export const getByUsername = async (req: Request, res: Response) => {
  const { username } = req.body;

  const streams = await prisma.stream.findMany({
    where: {
      user: {
        username: username,
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      path: true,
      user: {
        select: {
          picture: true,
          username: true,
        },
      },
    },
  });

  return sendResponseSuccess(res, streams);
};

/**
 * Return stream with a specific id
 */
export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const streams = await prisma.stream.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      path: true,
      user: {
        select: {
          picture: true,
          username: true,
        },
      },
    },
  });

  return sendResponseSuccess(res, streams);
};

/**
 * Return video .mp4 file name
 */
// export const getVideoName = async (req: Request, res: Response) => {
// 	const folderName = req.params.folderName;

// 	if (!folderName || folderName === "") {
// 		return sendResponseError(res, 400, "Missing folder name.");
// 	}

// 	const videoPath = path.join("recordings", folderName);
// 	fs.readdir(videoPath, (err, files) => {
// 		if (err) {
// 			console.error("Error reading directory:", err);
// 			return sendResponseError(res, 500, "Error reading directory");
// 		}

// 		const mp4File = files.find((file) => file.endsWith(".mp4"));
// 		if (!mp4File) {
// 			return sendResponseError(res, 404, "No video file found");
// 		}

// 		sendResponseSuccess(res, mp4File);
// 	});
// };

/**
 * Deletes stream
 */
export const deleteStream = async (req: Request, res: Response) => {
  const { filePath } = req.body;

  if (!filePath || filePath === "") {
    return sendResponseError(res, 400, "Missing folder path.");
  }

  const folderPath = path.join("recordings", filePath);
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const fullPath = path.join(folderPath, file);
      fs.unlinkSync(fullPath);
    });

    fs.rmdirSync(folderPath);
  }

  const stream = await prisma.stream.delete({
    where: {
      path: filePath,
    },
  });

  return sendResponseSuccess(res, stream);
};

/**
 * Creates stream
 */
export const createStream = async (req: Request, res: Response) => {
  const { name, username } = req.body;

  const user = await findByUsername(username);
  if (user === null) {
    console.error("here");
    return sendResponseError(res, 404, "Cannot find user with given username.");
  }

  const stream = await prisma.stream.create({
    data: {
      name: name,
      path: user.streamKey ?? "",
      userId: user.id,
    },
  });

  return sendResponseSuccess(res, stream);
};

/**
 * Edits stream
 */
export const editStream = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || id === "") {
    return sendResponseError(res, 400, "Missing stream id.");
  }

  const stream = await prisma.stream.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });

  return sendResponseSuccess(res, stream);
};
