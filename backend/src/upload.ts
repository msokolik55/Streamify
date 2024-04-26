import { randomUUID } from "crypto";
import fs from "fs";
import multer from "multer";

import { uploadFolderName } from "./constants";

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		if (!fs.existsSync(uploadFolderName)) {
			fs.mkdirSync(uploadFolderName);
		}
		cb(null, uploadFolderName);
	},
	filename: (_req, file, cb) => {
		cb(null, `${randomUUID()}-${file.originalname}`);
	},
});

const fileFilter = (_req: any, file: any, cb: any) => {
	if (!file.mimetype.includes("image")) {
		cb(new Error("Only .jpeg, .png, or .gif formats allowed!"), false);
		return;
	}

	cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
